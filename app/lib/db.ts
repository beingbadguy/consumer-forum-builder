import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/consumer_mitra';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isFallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongooseCache || {
  conn: null,
  promise: null,
  isFallback: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB with caching and fallback support.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        cached.isFallback = false;
        console.log('[Database] Connected to MongoDB successfully.');
        seedInitialAdmin();
        return m;
      })
      .catch((err) => {
        console.warn(
          `[Database] Notice: MongoDB connection to "${MONGODB_URI}" timed out or is unavailable (${err.message}). Activating resilient local database adapter.`
        );
        cached.isFallback = true;
        initFallbackStore();
        return null as unknown as typeof mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.isFallback = true;
    initFallbackStore();
  }

  return cached.conn;
}

export function isUsingFallback(): boolean {
  return cached.isFallback;
}

// ============================================================================
// RESILIENT EMBEDDED LOCAL FILE-BACKED DATABASE (For zero-dependency runtime)
// ============================================================================

const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getCollectionFile(name: string) {
  ensureDataDir();
  return path.join(DATA_DIR, `${name}.json`);
}

export function readFallbackCollection<T = any>(name: string): T[] {
  try {
    const file = getCollectionFile(name);
    if (!fs.existsSync(file)) {
      return [];
    }
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeFallbackCollection<T = any>(name: string, data: T[]): void {
  try {
    const file = getCollectionFile(name);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Failed to write to fallback store ${name}:`, err);
  }
}

/**
 * Automatically seeds the administrative account if not already present.
 */
export async function seedInitialAdmin(): Promise<void> {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@consumermitra.gov.in').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@ConsumerMitra2026';
  const adminName = process.env.ADMIN_NAME || 'Administrative Officer';

  try {
    if (cached.conn && !cached.isFallback && mongoose.connection.readyState === 1) {
      const { UserModel } = await import('../models/User');
      const existing = await UserModel.findOne({ email: adminEmail });
      if (!existing) {
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        await UserModel.create({
          name: adminName,
          email: adminEmail,
          passwordHash,
          role: 'admin',
          emailVerified: true,
          accountStatus: 'active',
        });
        console.log(`[Database] Seeded initial Admin user: ${adminEmail}`);
      }
    } else {
      // In fallback mode
      initFallbackStore();
      const users = readFallbackCollection('users');
      const existing = users.find((u: any) => u.email === adminEmail);
      if (!existing) {
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        const adminUser = {
          _id: 'admin_' + Date.now().toString(36),
          name: adminName,
          email: adminEmail,
          passwordHash,
          role: 'admin',
          emailVerified: true,
          accountStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        users.push(adminUser);
        writeFallbackCollection('users', users);
        console.log(`[Database Fallback] Seeded initial Admin user: ${adminEmail}`);
      }
    }
  } catch (err) {
    console.warn('[Database] Seed check warning:', err);
  }
}

function initFallbackStore() {
  ensureDataDir();
  ['users', 'cases', 'documents', 'activity_logs', 'sessions'].forEach((col) => {
    const f = getCollectionFile(col);
    if (!fs.existsSync(f)) {
      fs.writeFileSync(f, JSON.stringify([], null, 2), 'utf-8');
    }
  });
  seedInitialAdmin();
}

