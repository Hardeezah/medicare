import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export const getAllUsers = async () => {
    await dbConnect();
    const users = await User.find(); // Fetch all users
    return users;
};
