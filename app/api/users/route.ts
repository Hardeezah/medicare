import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

// Handle GET requests to fetch all users
export const GET = async () => {
    try {
        await dbConnect();

        // Fetch all users from the database
        const users = await User.find();

        // Return the users in JSON format
        return NextResponse.json({ success: true, data: users });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};
