import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { TextEncoder } from 'util';

// Secret for signing JWTs
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshTokenSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

// Function to sign the access token
async function signAccessToken(doctorId: string, role: string) {
    return new SignJWT({ doctorId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m') // Access token expires in 15 minutes
        .sign(secret);
}

// Function to sign the refresh token
async function signRefreshToken(doctorId: string, role: string) {
    return new SignJWT({ doctorId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Refresh token expires in 7 days
        .sign(refreshTokenSecret);
}

export const POST = async (req: Request) => {
    try {
        // Connect to the database
        await dbConnect();
        const { loginCode } = await req.json();

        // Find the doctor by the login code
        const doctor = await Doctor.findOne({ token: loginCode });

        if (!doctor) {
            return NextResponse.json({ success: false, message: 'Invalid login code' }, { status: 400 });
        }

        // Sign access token using jose
        const token = await signAccessToken(doctor._id.toString(), 'doctor');

        // Sign refresh token using jose
        const refreshToken = await signRefreshToken(doctor._id.toString(), 'doctor');

        // Set refresh token as an HTTP-only cookie
        const refreshTokenCookie = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure only in production
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
