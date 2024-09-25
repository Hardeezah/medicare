// models/UserProfile.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUserProfile extends Document {
    userId: mongoose.Types.ObjectId;  // Link to User
    name: string;
    email: string;
    dateOfBirth: Date;
    address?: string;
    phone?: string;
    bloodGroup: string;
    heartRate?: number;
    bloodSugar?: number;
    weight?: number;
    medicalHistory?: string[]; // List of past medical records or illnesses
}

const UserProfileSchema: Schema<IUserProfile> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String },
    phone: { type: String },
    bloodGroup: { type: String, required: true },
    heartRate: { type: Number },
    bloodSugar: { type: Number },
    weight: { type: Number },
    medicalHistory: { type: [String] }, // List of conditions or illnesses
}, {
    timestamps: true,
});

const UserProfile: Model<IUserProfile> = mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
export default UserProfile;
