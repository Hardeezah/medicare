// models/UserProfile.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICompletedAppointment {
    doctorId: mongoose.Types.ObjectId;
    appointmentId: mongoose.Types.ObjectId;
    time: Date;
    details: string;
    symptom: string;
    completedAt: Date; // Timestamp when the appointment was completed
}

export interface IUserProfile extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    dateOfBirth: Date;
    address?: string;
    phone?: string;
    bloodGroup: string;
    heartRate?: number;
    bloodSugar?: number;
    weight?: number;
    medicalHistory: ICompletedAppointment[]; // Array of completed appointments
}

const CompletedAppointmentSchema: Schema<ICompletedAppointment> = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    time: { type: Date, required: true },
    details: { type: String, required: true },
    symptom: { type: String, required: true },
    completedAt: { type: Date, default: Date.now }, // Automatically set completion time
});

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
    medicalHistory: { type: [CompletedAppointmentSchema], default: [] }, // Medical history stores completed appointments
}, {
    timestamps: true,
});

const UserProfile: Model<IUserProfile> = mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
export default UserProfile;
