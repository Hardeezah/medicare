import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Doctor from '@/lib/models/Doctor';
import redis from '@/lib/redis';
import { sendEmail } from '@/lib/utils/email';
import User from '@/lib/models/User';


export const POST = async (req: NextRequest, { params }: { params: { appointmentTime: string } }) => {
    try {
        await dbConnect();

        const { appointmentTime } = params;

        const appointmentData = await redis.get(appointmentTime) as string;
        console.log("Retrieved registration data from Redis:", appointmentData);
        
        if (!appointmentData) {
            return NextResponse.json({ success: false, message: 'Appointment not found or already approved' }, { status: 404 });
        }

        console.log("Retrieved registration data from Redis:", appointmentData);
        const format = JSON.stringify(appointmentData)


        const appointment = JSON.parse(format);

        // Find the doctor by ID
        const doctor = await Doctor.findById(appointment.doctor);
        if (!doctor) {
            return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
        }

        // Check if the appointment time is still available (optional but recommended)
        if (!doctor.availableSlots.includes(appointment.time)) {
            return NextResponse.json({ success: false, message: 'Selected time slot is no longer available' }, { status: 400 });
        }

        // Save the appointment to MongoDB
        const newAppointment = new Appointment({
            user: appointment.user,
            doctor: appointment.doctor,
            time: appointment.time,
            details: appointment.details,
            symptom: appointment.symptom,
            status: 'confirmed',
            email: appointment.email,  // Add user's email to the appointment data
        });

        await newAppointment.save();

        // Remove the booked slot from the doctor's available slots
        doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== appointment.time);
        await doctor.save();

        // Remove the appointment from Redis
        await redis.del(appointmentTime);

        // Send approval email to user
         await sendEmail(
            appointment.email,  // Replace with the actual user email
            `Your appointment with Dr. ${doctor.name} has been approved for ${appointment.time}.`,
        ); 

        return NextResponse.json({
            success: true,
            message: 'Appointment approved and saved, email sent',
            data: newAppointment,
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};
