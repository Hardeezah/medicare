import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Secret for JWT verification
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function authMiddleware(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log("Extracted Token:", token); // Debugging log

    try {
        // Verify the JWT token using jose
        const { payload } = await jwtVerify(token, secret);
        console.log("Decoded JWT Payload:", payload); // Debugging log

        // Check if the payload contains userId or hospitalId and the role
        const userId = payload.userId || payload.hospitalId; // Check for both userId and hospitalId
        const role = payload.role;
        

        if (userId && role) {
            const res = NextResponse.next();
            res.headers.set('X-User-Id', userId as string);
            res.headers.set('X-User-Role', role as string);
            //console.log(res.headers.get('X-User-Role'));

            return res;
            
        } else {
            return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
        }
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}
