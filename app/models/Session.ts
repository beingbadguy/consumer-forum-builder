import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  sessionToken: string;
  userId: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionToken: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: '0s' } },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

