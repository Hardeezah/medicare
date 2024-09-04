import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export const POST = async (req: Request) => {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
        }

        // Assume the user model has a 'role' field (e.g., 'user', 'doctor', 'admin')
        const role = user.role; // e.g., 'user', 'doctor', or 'admin'

        // Generate JWT token (short-lived)
        const token = jwt.sign(
            { userId: user._id, role: role },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign(
            { userId: user._id, role: role },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' }
        );

        // Store the refresh token in an HTTP-only cookie
        const refreshTokenCookie = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Return the JWT token and set the refresh token cookie
        const response = NextResponse.json({ success: true, token }, { status: 200 });
        response.headers.append('Set-Cookie', refreshTokenCookie);

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
