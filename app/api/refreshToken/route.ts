import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const POST = async () => {
    try {
        // Access cookies using the cookies function from next/headers
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ success: false, message: 'No refresh token provided' }, { status: 401 });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;

        // Generate a new JWT token
        const newToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' } // New short-lived token
        );

        return NextResponse.json({ success: true, token: newToken }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
    }
};
