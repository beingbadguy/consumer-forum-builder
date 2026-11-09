import mongoose, { Schema, Document, Model } from 'mongoose';
import { ComplaintFormData, FormStep } from '../types/complaint';

export interface ICase extends Document {
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

const CaseSchema = new Schema<ICase>(
  {
    userId: { type: String, required: true, index: true },
    caseTitle: { type: String, default: 'Untitled Consumer Complaint' },
    caseType: { type: String, default: 'Consumer Dispute' },
    caseStatus: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'completed'],
      default: 'draft',
      index: true,
    },
    currentStep: { type: Number, default: 1, min: 1, max: 8 },
    totalSteps: { type: Number, default: 8 },
    formData: { type: Schema.Types.Mixed, default: {} },
    completionPercentage: { type: Number, default: 12 },
    lastSavedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

CaseSchema.index({ userId: 1, updatedAt: -1 });
CaseSchema.index({ caseStatus: 1, createdAt: -1 });

export const CaseModel: Model<ICase> =
  mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);

