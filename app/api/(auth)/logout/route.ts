import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export const POST = async () => {
    try {
        // Clear the refresh token by setting an expired cookie
        const refreshTokenCookie = serialize('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            path: '/',
            expires: new Date(0), // Expire the cookie immediately
        });

        // Send response with cleared cookie
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });
        response.headers.append('Set-Cookie', refreshTokenCookie); // Clear the cookie

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
