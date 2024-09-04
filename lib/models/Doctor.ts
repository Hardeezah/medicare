import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  hospital: mongoose.Types.ObjectId;
  isVerified: boolean;
  otp?: string;
  token?: string;
}

const DoctorSchema: Schema<IDoctor> = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  token: { type: String, unique: true },
},
{
    timestamps: true,
  
});

DoctorSchema.pre<IDoctor>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
export default Doctor;
