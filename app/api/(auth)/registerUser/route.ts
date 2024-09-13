import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import redis from '@/lib/redis'; // Redis client setup
import User from '@/lib/models/User';
import Hospital from '@/lib/models/Hospital';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOTPEmail } from '@/lib/utils/email';

export const POST = async (req: Request) => {
    try {
        await dbConnect();

        const { name, email, password, hospitalId } = await req.json();

        // Check if user already exists in Redis
        const existingRedisUser = await redis.get(email);
        if (existingRedisUser) {
            return NextResponse.json({ success: false, message: 'User registration in process. OTP already sent.' }, { status: 403 });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        // Check if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return NextResponse.json({ success: false, message: 'Hospital ID not found' }, { status: 401 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = crypto.randomBytes(3).toString('hex');

        // Send OTP to the user's email
        /* const sentOTP = await sendOTPEmail(email, otp);
        console.log(sentOTP);
        
        // Check if OTP was sent successfully
        if (!sentOTP) {
            return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 405 });
        } */ 

        // Store registration details in Redis temporarily (1-hour expiry)
       const registrationData = {
            name,
            email,
            password: hashedPassword,
            hospitalId: hospital._id.toString(),
            hospitalName: hospital.name,
            otp,
        };

        console.log("Storing registration data in Redis:", JSON.stringify(registrationData));

        const registrationDataString = JSON.stringify(registrationData);
        await redis.setex(email, 3600, registrationData); // Store for 1 hour
        return NextResponse.json({ success: true, message: 'OTP sent to your email' }, { status: 201 });
     } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
