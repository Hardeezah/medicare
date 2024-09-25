// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getUserIdFromToken } from '@/app/actions/getUserIdFromToken'; // Import server action to get userId from JWT

export const POST = async (req: NextRequest) => {
    try {
        await dbConnect();

        // Get the user ID from the token
        const userId = await getUserIdFromToken(req.headers.get('Authorization'));
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Parse the updated profile fields from the request body
        const updatedProfileData = await req.json();

        // Find the user by ID and update their profile
        const updatedProfile = await User.findByIdAndUpdate(
            userId, 
            { $set: updatedProfileData }, // Only update the fields sent in the request
            { new: true } // Return the updated profile
        );

        if (!updatedProfile) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile,
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
