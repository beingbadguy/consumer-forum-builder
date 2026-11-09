import { connectToDatabase, isUsingFallback, readFallbackCollection, writeFallbackCollection } from './db';
import { UserModel, IUser } from '../models/User';
import { CaseModel, ICase } from '../models/Case';
import { DocumentModel, IDocument } from '../models/Document';
import { ActivityLogModel, IActivityLog } from '../models/ActivityLog';
import { SessionModel } from '../models/Session';
import { ComplaintFormData, FormStep } from '../types/complaint';

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'citizen' | 'user' | 'admin';
  emailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseRecord {
  _id: string;
  userId: string;
  caseTitle: string;
  caseType: string;
  caseStatus: 'draft' | 'submitted' | 'under_review' | 'completed';
  currentStep: FormStep;
  totalSteps: number;
  formData: ComplaintFormData;
  completionPercentage: number;
  lastSavedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentRecord {
  _id: string;
  userId: string;
  caseId: string;
  originalFileName: string;
  storageKey: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface ActivityRecord {
  _id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  caseId?: string;
  action: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

function generateId(): string {
  return 'cm_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// ============================================================================
// USERS REPOSITORY
// ============================================================================

export const usersRepo = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const conn = await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();
    if (conn && !isUsingFallback()) {
      const doc = await UserModel.findOne({ email: cleanEmail }).lean();
      if (!doc) return null;
      return { ...doc, _id: doc._id.toString() } as unknown as UserRecord;
    }
    const list = readFallbackCollection<UserRecord>('users');
    return list.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      try {
        const doc = await UserModel.findById(id).lean();
        if (!doc) return null;
        return { ...doc, _id: doc._id.toString() } as unknown as UserRecord;
      } catch {
        return null;
      }
    }
    const list = readFallbackCollection<UserRecord>('users');
    return list.find((u) => u._id === id) || null;
  },

  async create(data: Partial<UserRecord>): Promise<UserRecord> {
    const conn = await connectToDatabase();
    const cleanEmail = data.email!.toLowerCase().trim();
    if (conn && !isUsingFallback()) {
      const created = await UserModel.create({
        ...data,
        email: cleanEmail,
      });
      return { ...created.toObject(), _id: created._id.toString() } as unknown as UserRecord;
    }
    const list = readFallbackCollection<UserRecord>('users');
    const newUser: UserRecord = {
      _id: generateId(),
      name: data.name || '',
      email: cleanEmail,
      passwordHash: data.passwordHash || '',
      role: data.role || 'citizen',
      emailVerified: data.emailVerified ?? false,
      accountStatus: data.accountStatus || 'active',
      verificationToken: data.verificationToken,
      resetPasswordToken: data.resetPasswordToken,
      resetPasswordExpires: data.resetPasswordExpires,
      lastLoginAt: data.lastLoginAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    list.push(newUser);
    writeFallbackCollection('users', list);
    return newUser;
  },

  async update(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const updated = await UserModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (!updated) return null;
      return { ...updated, _id: updated._id.toString() } as unknown as UserRecord;
    }
    const list = readFallbackCollection<UserRecord>('users');
    const idx = list.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: new Date(),
    };
    writeFallbackCollection('users', list);
    return list[idx];
  },

  async list(filter: { role?: string; search?: string } = {}): Promise<UserRecord[]> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const q: any = {};
      if (filter.role) q.role = filter.role;
      if (filter.search) {
        q.$or = [
          { name: { $regex: filter.search, $options: 'i' } },
          { email: { $regex: filter.search, $options: 'i' } },
        ];
      }
      const docs = await UserModel.find(q).sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as UserRecord[];
    }
    let list = readFallbackCollection<UserRecord>('users');
    if (filter.role) list = list.filter((u) => u.role === filter.role);
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async count(): Promise<number> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      return UserModel.countDocuments();
    }
    return readFallbackCollection<UserRecord>('users').length;
  },
};

// ============================================================================
// CASES REPOSITORY
// ============================================================================

export const casesRepo = {
  async findById(id: string): Promise<CaseRecord | null> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      try {
        const doc = await CaseModel.findById(id).lean();
        if (!doc) return null;
        return { ...doc, _id: doc._id.toString() } as unknown as CaseRecord;
      } catch {
        return null;
      }
    }
    const list = readFallbackCollection<CaseRecord>('cases');
    return list.find((c) => c._id === id) || null;
  },

  async listByUser(userId: string): Promise<CaseRecord[]> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const docs = await CaseModel.find({ userId }).sort({ updatedAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as CaseRecord[];
    }
    const list = readFallbackCollection<CaseRecord>('cases');
    return list
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async listAll(filter: { search?: string; status?: string; category?: string } = {}): Promise<CaseRecord[]> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const q: any = {};
      if (filter.status) q.caseStatus = filter.status;
      if (filter.category) q.caseType = filter.category;
      if (filter.search) {
        q.$or = [
          { caseTitle: { $regex: filter.search, $options: 'i' } },
          { _id: { $regex: filter.search, $options: 'i' } },
        ];
      }
      const docs = await CaseModel.find(q).sort({ updatedAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as CaseRecord[];
    }
    let list = readFallbackCollection<CaseRecord>('cases');
    if (filter.status) list = list.filter((c) => c.caseStatus === filter.status);
    if (filter.category) list = list.filter((c) => c.caseType === filter.category);
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(
        (c) => c.caseTitle.toLowerCase().includes(s) || c._id.toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async create(data: Partial<CaseRecord>): Promise<CaseRecord> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const created = await CaseModel.create(data);
      return { ...created.toObject(), _id: created._id.toString() } as unknown as CaseRecord;
    }
    const list = readFallbackCollection<CaseRecord>('cases');
    const newCase: CaseRecord = {
      _id: generateId(),
      userId: data.userId!,
      caseTitle: data.caseTitle || 'Untitled Consumer Complaint',
      caseType: data.caseType || 'Consumer Dispute',
      caseStatus: data.caseStatus || 'draft',
      currentStep: (data.currentStep as FormStep) || 1,
      totalSteps: 8,
      formData: data.formData || ({} as ComplaintFormData),
      completionPercentage: data.completionPercentage || 12,
      lastSavedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    list.push(newCase);
    writeFallbackCollection('cases', list);
    return newCase;
  },

  async update(id: string, updates: Partial<CaseRecord>): Promise<CaseRecord | null> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const updated = await CaseModel.findByIdAndUpdate(
        id,
        {
          ...updates,
          lastSavedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true }
      ).lean();
      if (!updated) return null;
      return { ...updated, _id: updated._id.toString() } as unknown as CaseRecord;
    }
    const list = readFallbackCollection<CaseRecord>('cases');
    const idx = list.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      ...updates,
      lastSavedAt: new Date(),
      updatedAt: new Date(),
    };
    writeFallbackCollection('cases', list);
    return list[idx];
  },

  async delete(id: string): Promise<boolean> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const res = await CaseModel.findByIdAndDelete(id);
      return !!res;
    }
    const list = readFallbackCollection<CaseRecord>('cases');
    const filtered = list.filter((c) => c._id !== id);
    if (filtered.length !== list.length) {
      writeFallbackCollection('cases', filtered);
      return true;
    }
    return false;
  },

  async count(query: any = {}): Promise<number> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      return CaseModel.countDocuments(query);
    }
    const list = readFallbackCollection<CaseRecord>('cases');
    if (query.caseStatus) return list.filter((c) => c.caseStatus === query.caseStatus).length;
    if (query.userId) return list.filter((c) => c.userId === query.userId).length;
    return list.length;
  },
};

// ============================================================================
// DOCUMENTS REPOSITORY
// ============================================================================

export const documentsRepo = {
  async listByUserOrCase(filter: { userId?: string; caseId?: string }): Promise<DocumentRecord[]> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const docs = await DocumentModel.find(filter).sort({ uploadedAt: -1 }).lean();
      return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as DocumentRecord[];
    }
    let list = readFallbackCollection<DocumentRecord>('documents');
    if (filter.userId) list = list.filter((d) => d.userId === filter.userId);
    if (filter.caseId) list = list.filter((d) => d.caseId === filter.caseId);
    return list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  async create(data: Partial<DocumentRecord>): Promise<DocumentRecord> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const created = await DocumentModel.create(data);
      return { ...created.toObject(), _id: created._id.toString() } as unknown as DocumentRecord;
    }
    const list = readFallbackCollection<DocumentRecord>('documents');
    const newDoc: DocumentRecord = {
      _id: generateId(),
      userId: data.userId!,
      caseId: data.caseId!,
      originalFileName: data.originalFileName!,
      storageKey: data.storageKey || generateId(),
      fileType: data.fileType || 'application/octet-stream',
      fileSize: data.fileSize || 0,
      uploadedAt: new Date(),
    };
    list.push(newDoc);
    writeFallbackCollection('documents', list);
    return newDoc;
  },

  async findById(id: string): Promise<DocumentRecord | null> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const doc = await DocumentModel.findById(id).lean();
      if (!doc) return null;
      return { ...doc, _id: doc._id.toString() } as unknown as DocumentRecord;
    }
    const list = readFallbackCollection<DocumentRecord>('documents');
    return list.find((d) => d._id === id) || null;
  },

  async delete(id: string): Promise<boolean> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const res = await DocumentModel.findByIdAndDelete(id);
      return !!res;
    }
    const list = readFallbackCollection<DocumentRecord>('documents');
    const filtered = list.filter((d) => d._id !== id);
    if (filtered.length !== list.length) {
      writeFallbackCollection('documents', filtered);
      return true;
    }
    return false;
  },
};

// ============================================================================
// ACTIVITY LOG REPOSITORY
// ============================================================================

export const activityRepo = {
  async log(data: {
    userId: string;
    userEmail?: string;
    userName?: string;
    caseId?: string;
    action: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityRecord> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const created = await ActivityLogModel.create(data);
      return { ...created.toObject(), _id: created._id.toString() } as unknown as ActivityRecord;
    }
    const list = readFallbackCollection<ActivityRecord>('activity_logs');
    const record: ActivityRecord = {
      _id: generateId(),
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      caseId: data.caseId,
      action: data.action,
      metadata: data.metadata,
      timestamp: new Date(),
    };
    list.unshift(record);
    if (list.length > 500) list.pop();
    writeFallbackCollection('activity_logs', list);
    return record;
  },

  async list(limit = 100): Promise<ActivityRecord[]> {
    const conn = await connectToDatabase();
    if (conn && !isUsingFallback()) {
      const docs = await ActivityLogModel.find().sort({ timestamp: -1 }).limit(limit).lean();
      return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as ActivityRecord[];
    }
    const list = readFallbackCollection<ActivityRecord>('activity_logs');
    return list.slice(0, limit);
  },
};

