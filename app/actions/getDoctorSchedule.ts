// app/actions/getDoctorSchedule.ts

import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import { getUserIdFromToken } from './getUserIdFromToken'; // Import the server action
import { NextRequest } from 'next/server';
import Doctor from '@/lib/models/Doctor';

export const getDoctorSchedule = async (req: NextRequest) => {
    await dbConnect();

    // Extract the Authorization header from the request
    const authHeader = req.headers.get('Authorization');

    // Get doctor ID from token
    const doctorId = await getUserIdFromToken(authHeader);
    if (!doctorId) {
        throw new Error('Unauthorized: No valid token provided');
    }

    // Check if the user with the extracted ID is actually a doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new Error('Unauthorized: Doctor not found');
    }

    // Fetch appointments for the doctor
    const appointments = await Appointment.find({ doctor: doctorId });

    return appointments;
};
