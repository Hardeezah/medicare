import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';

export const GET = async (req: Request) => {
    try {
        await dbConnect();

        const { userId } = await req.json();

        // Find all appointments for the user
        const appointments = await Appointment.find({ user: userId })
            .populate('doctor', 'name') // Populate doctor's name
            .sort({ time: -1 }); // Sort by most recent first

        return NextResponse.json({
            success: true,
            data: appointments,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
