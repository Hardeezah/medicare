import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import redis from '@/lib/redis'; // Import Redis
import Doctor from '@/lib/models/Doctor';
import Hospital from '@/lib/models/Hospital';
import crypto from 'crypto';

export const POST = async (req: Request) => {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        // Retrieve the registration data from Redis
        const registrationData = await redis.get(email);
        if (!registrationData) {
            return NextResponse.json({ success: false, message: 'No registration data found or OTP expired' }, { status: 404 });
        }

        console.log("Retrieved registration data from Redis:", registrationData);
        const format = JSON.stringify(registrationData)

        // Parse the registration data
        const { name, password, hospitalId, inviteToken, otp: storedOtp } = JSON.parse(format);

        // Check if the provided OTP matches the stored OTP
        if (storedOtp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return NextResponse.json({ success: false, message: 'Hospital not found' }, { status: 404 });
        }

        // Check if the invite token was already used (re-check for safety)
        const tokenEntry = hospital.inviteTokens.find(token => token.token === inviteToken);
        if (tokenEntry?.isUsed) {
            return NextResponse.json({ success: false, message: 'Invite token already used' }, { status: 400 });
        }

        // Generate a unique 8-character login code
        const loginCode = crypto.randomBytes(4).toString('hex'); // 8-character login code

        // Create the doctor in MongoDB
        const newDoctor = new Doctor({
            name,
            email,
            password,
            hospital: hospital._id,
            isVerified: true,
            token: loginCode, // Assign login code to the doctor
        });

        await newDoctor.save();

        // Mark the invite token as used
        if(tokenEntry){
            tokenEntry.isUsed = true;
        }
        
        await hospital.save();

        // Remove registration data from Redis after successful verification
        await redis.del(email);

        return NextResponse.json({
            success: true,
            message: 'Doctor verified successfully. You can now log in using your login code.',
            data: newDoctor, // Send the doctor object back to the client
            loginCode, // Send login code back to the doctor
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
