import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import redis from '@/lib/redis'; // Import Redis
import Hospital from '@/lib/models/Hospital';
import crypto from 'crypto';

export const POST = async (req: Request) => {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        
        const registrationData = await redis.get(email) as string;
        if (!registrationData) {
            return NextResponse.json({ success: false, message: 'No registration data found or OTP expired' }, { status: 404 });
        }

        console.log("Retrieved registration data from Redis:", registrationData);
        const format = JSON.stringify(registrationData)

        
        const { name, password, otp: storedOtp } = JSON.parse(format);

        
        if (storedOtp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        
        const loginToken = crypto.randomBytes(4).toString('hex'); // 8 characters long

        // Create the hospital admin in MongoDB
        const newHospital = new Hospital({
            name,
            email,
            password, 
            loginToken,
            isVerified: true, 
        });
        
        await newHospital.save();
       

        // Remove the temporary registration data from Redis after successful verification
        await redis.del(email);

        return NextResponse.json({
            success: true,
            message: 'Hospital admin created successfully',
            data: newHospital,
            loginToken 
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message},  { status: 500 });
    }
};
