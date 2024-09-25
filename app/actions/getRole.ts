import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { jwtVerify } from 'jose';

// Secret for JWT verification
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getRole() {
  try {
    await dbConnect();

    // Get JWT from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return null;
    }

    // Verify the token and extract userId
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Find the user by ID and return their role
    const user = await User.findById(userId);
    return user ? user.role : null;
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
}
