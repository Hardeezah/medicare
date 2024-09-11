import { jwtVerify } from 'jose';

// Secret for signing JWTs
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// Server Action: Function to extract and verify JWT, and get the userId
export const getUserIdFromToken = async (authHeader: string | null): Promise<string | null> => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;
        return userId;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
};
