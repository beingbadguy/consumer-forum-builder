import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDocument extends Document {
  userId: string;
  caseId: string;
  originalFileName: string;
  storageKey: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: { type: String, required: true, index: true },
    caseId: { type: String, required: true, index: true },
    originalFileName: { type: String, required: true },
    storageKey: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const DocumentModel: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

