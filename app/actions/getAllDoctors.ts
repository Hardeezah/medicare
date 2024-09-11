import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export const getAllDoctors = async () => {
    await dbConnect();
    const doctors = await Doctor.find(); // Fetch all doctors
    return doctors;
};
