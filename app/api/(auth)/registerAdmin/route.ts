import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hospital from '@/lib/models/Hospital';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const POST = async (req: Request) => {
    try {
        await dbConnect();

        const { name, email, password, hospitalName } = await req.json();

        const existingAdmin = await Hospital.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ success: false, message: 'Admin already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomBytes(3).toString('hex');

        const admin = await Hospital.create({
            name: hospitalName,
            email,
            password: hashedPassword,
            otp,
        });
        await admin.save();

        return NextResponse.json({ success: true, message: 'Admin created successfully', data: admin });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
