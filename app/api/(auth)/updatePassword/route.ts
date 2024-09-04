import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export const PATCH = async (req: Request) => {
    try {
        await dbConnect();

        const { email, newPassword } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
