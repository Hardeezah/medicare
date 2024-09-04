import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import redis from '@/lib/redis';
import User from '@/lib/models/User';
import mongoose from 'mongoose';
import { log } from 'console';

export const POST = async (req: Request) => {
    try {
        await dbConnect();

        const { email, otp } = await req.json();

        // Retrieve the registration data as a string
        const registrationData = await redis.get(email) as string;

        if (!registrationData) {
            console.error("No registration data found or OTP expired");
            return NextResponse.json({ success: false, message: 'No pending registration found or OTP expired' }, { status: 400 });
        }

        console.log("Retrieved registration data from Redis:", registrationData);
        const format = JSON.stringify(registrationData)
        // Parse the registration data as JSON
        let pendingRegistration;
        try {
            pendingRegistration = JSON.parse(format);
        
        } catch (parseError) {
            console.error("Failed to parse registration data", parseError);
            return NextResponse.json({ success: false, message: 'Failed to parse registration data' }, { status: 500 });
        }

        console.log(pendingRegistration.name);
        
        // Check if the OTP matches
        if (pendingRegistration.otp !== otp) {
            console.error("Invalid OTP");
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("User already exists");
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }


        // Create the actual user
        const user = await User.create({
            name: pendingRegistration.name,
            email: pendingRegistration.email,
            password: pendingRegistration.password, // Already hashed
            hospital: pendingRegistration.hospitalId,
            hospital_name: pendingRegistration.hospitalName,
            isVerified: true,
        });

        // Delete the Redis key after successful verification
        await redis.del(email);

        return NextResponse.json({ success: true, message: 'Account created successfully', data: user }, { status: 201 });
    } catch (error: any) {
        console.error("Unexpected error occurred", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
