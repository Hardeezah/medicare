import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';
import redis from '@/lib/redis';
import { getUserEmailById } from '@/app/actions/getUserEmailById';
import { getUserIdFromToken } from '@/app/actions/getUserIdFromToken';



export const POST = async (req: NextRequest, { params }: { params: { doctorId: string } }) => {
    try {
        await dbConnect();
        const authHeader = req.headers.get('Authorization');

        const { doctorId } = params;
        const { appointmentTime, details, symptom } = await req.json();

        // Get the currently logged-in user's ID from the JWT
        const userId = await getUserIdFromToken(authHeader);
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No valid token provided' }, { status: 401 });
        }

        // Get the user's email by their userId
        const userEmail = await getUserEmailById(userId);
        if (!userEmail) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Find the doctor by ID
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
        }

        // Check if the appointment time is available
        if (!doctor.availableSlots.includes(appointmentTime)) {
            return NextResponse.json({ success: false, message: 'Selected time slot is not available' }, { status: 400 });
        }

        // Store the appointment data in Redis with a pending status
        const appointmentData = {
            user: userId,
            doctor: doctorId,
            time: appointmentTime,
            details: details || '',
            symptom: symptom,
            status: 'pending', // Status remains pending until admin approval
            email: userEmail,  // Add user's email to the appointment data
        };

        // Store the appointment in Redis using a unique key, for example using the appointmentTime and userId
        await redis.setex(appointmentTime, 4800, JSON.stringify(appointmentData)); // Store for 1 hour
        console.log("Storing appointment data in Redis:", JSON.stringify(appointmentData));

        return NextResponse.json({
            success: true,
            message: 'Appointment booked and awaiting approval',
            data: appointmentData,
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
