import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hospital from '@/lib/models/Hospital';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

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

        // Generate JWT token
        const token = jwt.sign(
            { hospitalId: hospital._id, role: 'admin' },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' } // JWT expires in 15 minutes
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { hospitalId: hospital._id, role: 'admin' },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' } // Refresh token expires in 7 days
        );

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
