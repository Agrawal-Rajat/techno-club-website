import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'user' | 'member' | 'admin' | 'superadmin';
export type ClubType = 'IEEE' | 'ACM' | 'AWS' | 'GDG' | 'STIC' | '';

export interface Certificate {
  name: string;
  url: string;
  isVerified: boolean;
  creditsAwarded: number;
  submittedAt: Date;
  verifiedAt?: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: UserRole;
  club: ClubType;
  creditScore: number;
  emailVerified?: Date;
  certificates?: Certificate[];
  // Profile fields
  bio?: string;
  enrollmentNumber?: string;
  year?: number;
  contactNumber?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'member', 'admin', 'superadmin'],
      default: 'user',
    },
    club: {
      type: String,
      enum: ['IEEE', 'ACM', 'AWS', 'GDG', 'STIC', ''],
      default: '',
    },
    creditScore: {
      type: Number,
      default: 0,
    },
    emailVerified: {
      type: Date,
    },
    certificates: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      creditsAwarded: { type: Number, default: 0 },
      submittedAt: { type: Date, default: Date.now },
      verifiedAt: { type: Date }
    }],
    // Profile fields
    bio: { type: String },
    enrollmentNumber: { type: String },
    year: { type: Number },
    contactNumber: { type: String }
  },
  { timestamps: true }
);

// Prevent model overwrite error in development due to hot reloading
const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User; 