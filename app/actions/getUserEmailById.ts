import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

// Server Action: Function to get user email from userId
export const getUserEmailById = async (userId: string): Promise<string | null> => {
    await dbConnect(); // Connect to the database

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
        return null;
    }

    return user.email; // Return the user's email
};
