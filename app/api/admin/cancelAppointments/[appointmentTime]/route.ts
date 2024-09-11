import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import redis from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email'; // Utility function to send emails

export const POST = async (req: NextRequest, { params }: { params: { appointmentTime: string } }) => {
    try {
        await dbConnect();

        const { appointmentTime } = params;
        const { reason } = await req.json(); // Reason for cancellation

        // Retrieve the appointment from Redis
        const appointmentDataString = await redis.get(appointmentTime) as string;
        const format = JSON.stringify(appointmentDataString); 
        console.log(appointmentDataString);

        let appointmentData;
        if (appointmentDataString) {
            // Appointment is still pending, retrieve from Redis
            appointmentData = JSON.parse(format);
        } else {
            // If not in Redis, retrieve from MongoDB
            const appointment = await Appointment.findOne({ time: appointmentTime });
            if (!appointment) {
                return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
            }
            appointmentData = appointment;
        }

        // If the appointment has already been approved, fetch it from the database
        if (!appointmentData) {
            return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
        }

        // Update the appointment status to "canceled"
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { time: appointmentTime },
            { status: 'canceled' },
            { new: true }
        );

        // Remove the appointment from Redis (if it's pending)
        await redis.del(appointmentTime);

        // Send cancellation email to the user
        await sendEmail(
            appointmentData.email,
            `Dear user,\n\nUnfortunately, your appointment with Dr. ${appointmentData.doctor} scheduled for ${appointmentData.time} has been canceled.\n\nReason: ${reason}\n\nWe apologize for any inconvenience caused.\n\nBest regards,\nAdmin`
        );

        return NextResponse.json({
            success: true,
            message: 'Appointment canceled and email sent to the user',
            data: updatedAppointment,
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
