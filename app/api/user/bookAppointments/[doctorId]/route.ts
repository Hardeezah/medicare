import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Doctor from '@/lib/models/Doctor';


export const POST = async (req: NextRequest, { params }: { params: { doctorId: string } }) => {

    try {
        await dbConnect();

        const { doctorId } = params; // Extract doctorId from the URL
        const { userId, appointmentTime, details, symptom } = await req.json();

        // Find the doctor by ID
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
        }

        // Check if the appointment time is available
        if (!doctor.availableSlots.includes(appointmentTime)) {
            return NextResponse.json({ success: false, message: 'Selected time slot is not available' }, { status: 400 });
        }

        // Create a new appointment
        const appointment = new Appointment({
            user: userId,
            doctor: doctorId,
            time: appointmentTime,
            details: details || '',
            symptom: symptom, // User-provided symptom details for the doctor
            status: 'pending', // Initial status of the appointment
        });

        await appointment.save();

        // Remove the booked slot from the doctor's available slots
        doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== appointmentTime);
        await doctor.save();

        return NextResponse.json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
