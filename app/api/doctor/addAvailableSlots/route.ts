import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export const PATCH = async (req: Request) => {
    try {
        await dbConnect();

        const { doctorId, availableSlots } = await req.json();

        // Find the doctor by ID
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
        }

        // Ensure that availableSlots is an array
        if (!Array.isArray(availableSlots) || availableSlots.length === 0) {
            return NextResponse.json({ success: false, message: 'Please provide an array of available slots' }, { status: 400 });
        }

        // Update the doctor's available slots by adding the new slots
        doctor.availableSlots.push(...availableSlots); // Append the new slots

        // Save the updated doctor
        await doctor.save();

        return NextResponse.json({
            success: true,
            message: 'Available slots added successfully',
            data: doctor,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
