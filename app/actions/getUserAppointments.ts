// app/actions/getUserAppointments.ts

import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import { getUserIdFromToken } from './getUserIdFromToken'; // Import the server action
import { NextRequest } from 'next/server';

export const getUserAppointments = async (req: NextRequest) => {
    await dbConnect();

    // Extract the Authorization header from the request
    const authHeader = req.headers.get('Authorization');

    // Get user ID from token
    const userId = await getUserIdFromToken(authHeader);
    if (!userId) {
        throw new Error('Unauthorized: No valid token provided');
    }

    // Fetch appointments for the logged-in user
    const appointments = await Appointment.find({ user: userId });

    return appointments;
};
