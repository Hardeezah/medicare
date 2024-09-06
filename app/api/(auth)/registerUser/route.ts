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

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        // Check if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return NextResponse.json({ success: false, message: 'Hospital ID not found' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = crypto.randomBytes(3).toString('hex');
        

/*         const user = await User.create({
            name,
            email,
            password: hashedPassword, // Already hashed
            hospital: hospital._id,
            hospital_name: hospital.name,
            otp,
        });

        return NextResponse.json({ success: true, message: 'Account created successfully', data: user }, { status: 201 });
 */
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

        // Send OTP to the user's email
        await sendOTPEmail(email, otp);

        return NextResponse.json({ success: true, message: 'OTP sent to your email' }, { status: 201 });
     } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
