import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { TextEncoder } from 'util';
import { serialize } from 'cookie';

// Secret keys from environment variables
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshTokenSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

// Function to sign an access token
async function signAccessToken(userId: string, role: string) {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // Access token valid for 15 minutes
    .sign(secret);
}

// Function to sign a refresh token
async function signRefreshToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Refresh token valid for 7 days
    .sign(refreshTokenSecret);
}

export const POST = async (req: Request) => {
  try {
    await dbConnect();

    const { email, password } = await req.json();
    console.log("Email:", email); // Debugging log
    console.log("Password:", password); // Debugging log

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // Debugging log
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
    }
    console.log(user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match"); // Debugging log
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
    }

    const role = user.role;

    // Sign JWT access token and refresh token using jose
    const token = await signAccessToken(user.id.toString(), role);
    const refreshToken = await signRefreshToken(user.id.toString());

    // Set the refresh token as an httpOnly cookie
    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const response = NextResponse.json({ success: true, token }, { status: 200 });
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;
  } catch (error: any) {
    console.log("Error:", error.message); // Debugging log
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
