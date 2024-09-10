import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export const PATCH = async (req: Request) => {
    try {
        await dbConnect();

        const { email, password, newPassword } = await req.json();

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
        }

        // Compare the provided current password with the stored password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid current password' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Save the updated user with the new password
        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
