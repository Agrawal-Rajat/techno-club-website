import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClubApplication extends Document {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  year: string;
  reason: string;
  clubSlug: string;
  clubName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  adminNotes?: string;
}

const clubApplicationSchema = new Schema<IClubApplication>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  clubSlug: {
    type: String,
    required: true,
  },
  clubName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  adminNotes: {
    type: String,
  },
}, { timestamps: true });

// Prevent model overwrite error in development due to hot reloading
const ClubApplication = (mongoose.models.ClubApplication as Model<IClubApplication>) || 
  mongoose.model<IClubApplication>('ClubApplication', clubApplicationSchema);

export default ClubApplication;
