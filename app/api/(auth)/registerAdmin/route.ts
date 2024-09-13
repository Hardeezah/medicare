import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hospital from '@/lib/models/Hospital';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import redis from '@/lib/redis';
import { sendOTPEmail } from '@/lib/utils/email';

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

        const registrationData ={
            name,
            email,
            password: hashedPassword,
            hospitalName,
            otp,
        };
        await redis.setex(email, 3600, JSON.stringify(registrationData)); // Store data in Redis for 1 hour

        console.log("Storing registration data in Redis:", JSON.stringify(registrationData));

        //await sendOTPEmail(email, otp);

        return NextResponse.json({ success: true, message: 'OTP sent to email for verification' }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
