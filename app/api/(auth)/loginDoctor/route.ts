import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export const POST = async (req: Request) => {
    try {
        await dbConnect();
        const { loginCode } = await req.json();

        // Find the doctor by the login code
        const doctor = await Doctor.findOne({ token: loginCode });

        if (!doctor) {
            return NextResponse.json({ success: false, message: 'Invalid login code' }, { status: 400 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { doctorId: doctor._id, role: 'doctor' },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' } // Token expires in 15 minutes
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { doctorId: doctor._id, role: 'doctor' },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' } // Refresh token expires in 7 days
        );

        // Set refresh token as an HTTP-only cookie
        const refreshTokenCookie = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // True in production
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Send JWT token and refresh token
        const response = NextResponse.json({ success: true, token }, { status: 200 });
        response.headers.append('Set-Cookie', refreshTokenCookie);

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
