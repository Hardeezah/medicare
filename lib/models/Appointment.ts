import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAppointment extends Document {
    user: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    time: string; // ISO 8601 format for both date and time
    status: 'pending' | 'confirmed' | 'cancelled';
    details?: string;
    email: string;
    symptom: string;
}

const AppointmentSchema: Schema<IAppointment> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    time: { type: String, required: true }, // ISO 8601 format, e.g., '2024-10-01T10:00:00'
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    details: { type: String },
    symptom: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },

}, { timestamps: true });

const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export default Appointment;
