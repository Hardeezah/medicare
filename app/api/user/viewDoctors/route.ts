import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export const GET = async () => {
    try {
        await dbConnect();

        // Fetch all doctors with their availability
        const doctors = await Doctor.find().select('name availableSlots hospital');

        return NextResponse.json({
            success: true,
            data: doctors,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
