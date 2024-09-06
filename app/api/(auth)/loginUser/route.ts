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
        console.log("Email:", email); // Debugging log
        console.log("Password:", password); // Debugging log

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found"); // Debugging log
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
        }
        console.log(user.password);
        
/*         const plainPassword = '123456';
        const storedHash = '$2a$10$l5c2LfG10JIe1a0Ix0i8eOqMrxYsqXjH5D/gj3og9f0.f0wzqQlye'; // The stored hash
 *//*         
        // Rehash the plain text password with the same salt rounds (10 in this case)
        const newHash = await bcrypt.hash(plainPassword, 10);
        console.log('New Hash:', newHash);
        
        // Compare the rehashed password with the original stored hash
        const matched = await bcrypt.compare(plainPassword, storedHash);
        console.log('Does the password match the stored hash?', matched);
 */        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match"); // Debugging log
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
        }

        const role = user.role;

        const token = jwt.sign(
            { userId: user._id, role: role },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, role: role },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' }
        );

        const refreshTokenCookie = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        const response = NextResponse.json({ success: true, token }, { status: 200 });
        response.headers.append('Set-Cookie', refreshTokenCookie);

        return response;
    } catch (error: any) {
        console.log("Error:", error.message); // Debugging log
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
