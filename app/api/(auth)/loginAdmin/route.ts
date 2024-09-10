import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hospital from '@/lib/models/Hospital';
import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { TextEncoder } from 'util';

// Secret keys for JWTs
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshTokenSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

// Function to generate access token
async function signAccessToken(hospitalId: string, role: string) {
    return new SignJWT({ hospitalId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m') // Access token expires in 15 minutes
        .sign(secret);
}

// Function to generate refresh token
async function signRefreshToken(hospitalId: string, role: string) {
    return new SignJWT({ hospitalId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Refresh token expires in 7 days
        .sign(refreshTokenSecret);
}

export const POST = async (req: Request) => {
    try {
        // Connect to the database
        await dbConnect();

        // Get the loginToken from the request body
        const { loginToken } = await req.json();
        console.log("Login Token Provided by Admin:", loginToken); // Debugging

        // Find the hospital admin by the loginToken in the database
        const hospital = await Hospital.findOne({ loginToken });
        console.log("Hospital Record Retrieved from Database:", hospital); // Debugging

        // If no hospital is found with the provided loginToken
        if (!hospital) {
            return NextResponse.json({ success: false, message: 'Invalid login token' }, { status: 400 });
        }

        // If the hospital admin is not yet verified
        if (!hospital.isVerified) {
            return NextResponse.json({ success: false, message: 'Admin not verified' }, { status: 403 });
        }

        // Generate JWT access token using jose
        const token = await signAccessToken(hospital._id.toString(), 'admin');

        // Generate JWT refresh token using jose
        const refreshToken = await signRefreshToken(hospital._id.toString(), 'admin');

        // Set refresh token as an HTTP-only cookie
        const refreshTokenCookie = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use 'true' in production only
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Send the JWT token in the response and refresh token in a cookie
        const response = NextResponse.json({ success: true, token }, { status: 200 });
        response.headers.append('Set-Cookie', refreshTokenCookie); // Set refresh token cookie

        return response; // Return the response to the client
    } catch (error: any) {
        // Log any errors that occur
        console.error(`Error during login: ${error.message}`);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
