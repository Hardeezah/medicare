// models/User.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMedicalHistory {
  doctorId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  time: Date;
  details: string;
  symptom: string;
  completedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'doctor' | 'admin';
  isVerified: boolean;
  otp?: string;
  hospital?: mongoose.Types.ObjectId;
  hospital_name?: string;
  bloodGroup?: string;
  heartRate?: number;
  bloodSugar?: number;
  weight?: number;
  medicalHistory: IMedicalHistory[];
}

const MedicalHistorySchema: Schema<IMedicalHistory> = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  time: { type: Date, required: true },
  details: { type: String, required: true },
  symptom: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
});

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  hospital_name: { type: String },
  bloodGroup: { type: String },
  heartRate: { type: Number },
  bloodSugar: { type: Number },
  weight: { type: Number },
  medicalHistory: { type: [MedicalHistorySchema], default: [] }, // Array of completed appointments
},
{
  timestamps: true,
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
/* import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'doctor' | 'admin';
  isVerified: boolean;
  otp?: string;
  hospital?: mongoose.Types.ObjectId;
  hospital_name?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
},
{
    timestamps: true,
  
});

/* UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 */
//const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
//export default User;
