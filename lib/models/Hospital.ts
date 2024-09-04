import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IInviteToken extends Document {
  token: string;
  isUsed: boolean;
  expiresAt: Date;
}

export interface IHospital extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  token?: string;
  isVerified: boolean;
  otp?: string;
  inviteTokens: IInviteToken[];
  role: 'admin' | 'doctor' | 'user';
}

const InviteTokenSchema: Schema<IInviteToken> = new mongoose.Schema({
  token: { type: String, required: true},
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
},
{
    timestamps: true,
  
});

const HospitalSchema: Schema<IHospital> = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  token: { type: String, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  inviteTokens: [InviteTokenSchema],
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'admin' },

},
{
    timestamps: true,
  
});

HospitalSchema.pre<IHospital>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Hospital: Model<IHospital> = mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', HospitalSchema);
export default Hospital;
