import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hospital from '@/lib/models/Hospital';
import redis from '@/lib/redis'; // Import Redis
import crypto from 'crypto';
import { sendOTPEmail } from '@/lib/utils/email';

export const POST = async (req: Request) => {
    try {
        await dbConnect();
        const { name, email, password, inviteToken } = await req.json();

        // Find the hospital by invite token
        const hospital = await Hospital.findOne({ "inviteTokens.token": inviteToken });
        console.log(hospital);
        

        if (!hospital) {
            return NextResponse.json({ success: false, message: 'Invalid or expired invite token' }, { status: 400 });
        }

        // Check if the invite token has already been used or expired
        const tokenEntry = hospital.inviteTokens.find(token => token.token === inviteToken);
        if (tokenEntry) {
            if (tokenEntry.isUsed || tokenEntry.expiresAt < new Date()) {
                return NextResponse.json({ success: false, message: 'Invite token is already used or expired' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ success: false, message: 'Invalid or expired invite token' }, { status: 400 });
        }


        // Check if the doctor email already exists in the Redis temp storage
        const existingDoctor = await redis.get(email);
        if (existingDoctor) {
            return NextResponse.json({ success: false, message: 'A registration request for this email is already pending OTP verification' }, { status: 400 });
        }

        // Generate OTP and store registration data in Redis (valid for 1 hour)
        const otp = crypto.randomBytes(3).toString('hex'); // 6-character OTP
        const registrationData = {
            name,
            email,
            password,
            hospitalId: hospital._id,
            hositalName:hospital.name,
            inviteToken,
            otp, // Store OTP for verification
        };

        await redis.setex(email, 3600, JSON.stringify(registrationData)); // Store in Redis for 1 hour
        console.log(registrationData);
        // Send OTP to the doctor's email
        await sendOTPEmail(email, otp);

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email for verification. Complete the registration within 1 hour.',
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
