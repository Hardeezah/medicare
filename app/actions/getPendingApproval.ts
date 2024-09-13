// app/actions/getPendingApproval.ts

import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import { getUserIdFromToken } from './getUserIdFromToken'; // Server action to verify JWT
import { NextRequest } from 'next/server';
import Hospital from '@/lib/models/Hospital';

export const getPendingApproval = async (req: NextRequest) => {
    await dbConnect();

    // Extract the Authorization header from the request
    const authHeader = req.headers.get('Authorization');

    // Get user (admin) ID from token
    const adminId = await getUserIdFromToken(authHeader);
    if (!adminId) {
        throw new Error('Unauthorized: No valid token provided');
    }

    // Check if the user is an admin by finding them in the Hospital collection
    const admin = await Hospital.findById(adminId);
    if (!admin || admin.role !== 'admin') {
        throw new Error('Unauthorized: You must be an admin to view pending appointments');
    }

    // Fetch all appointments with a 'pending' status
    const pendingAppointments = await Appointment.find({ status: 'pending' });

    return pendingAppointments;
};
