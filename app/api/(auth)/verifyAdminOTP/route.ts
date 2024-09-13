import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import redis from '@/lib/redis'; // Import Redis
import Hospital from '@/lib/models/Hospital';
import crypto from 'crypto';
import { sendEmail } from '@/lib/utils/email';

export const POST = async (req: Request) => {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        
        const registrationData = await redis.get(email) as string;
        if (!registrationData) {
            return NextResponse.json({ success: false, message: 'No registration data found or OTP expired' }, { status: 400 });
        }

        console.log("Retrieved registration data from Redis:", registrationData);
        const format = JSON.stringify(registrationData)

        let pendingRegistration;
        try {
            pendingRegistration = JSON.parse(format);
        
        } catch (parseError) {
            console.error("Failed to parse registration data", parseError);
            return NextResponse.json({ success: false, message: 'Failed to parse registration data' }, { status: 401 });
        }
        //const { name, password, otp: storedOtp } = JSON.parse(format);

        
        if (pendingRegistration.otp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 403 });
        }

        
        const loginToken = crypto.randomBytes(4).toString('hex'); // 8 characters long

        // Create the hospital admin in MongoDB
        const newHospital = new Hospital({
            name: pendingRegistration.name,
            email,
            password: pendingRegistration.password, 
            loginToken,
            hospitalName: pendingRegistration.hospitalName,  // Hospital name from registration data
            isVerified: true, 
        });
        
        await newHospital.save();
       

        // Remove the temporary registration data from Redis after successful verification
        await redis.del(email);
        await sendEmail(email, loginToken);

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
