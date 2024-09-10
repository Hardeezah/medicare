import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Secret for JWT verification
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function roleCheckMiddleware(req: NextRequest, requiredRole: string) {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the JWT token using jose
        const { payload } = await jwtVerify(token, secret);

        // Extract the user's role from the payload
        const userRole = payload.role;

        // Check if the role from the payload matches the required role
        if (!userRole || userRole !== requiredRole) {
            return NextResponse.json({ message: `Access denied: ${requiredRole} role required` }, { status: 403 });
        }

        return NextResponse.next(); // Proceed if the user has the required role
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}
/* import { NextRequest, NextResponse } from 'next/server';

export async function roleCheckMiddleware(req: NextRequest, requiredRole: string) {
    // Retrieve the user's role from the custom header
    const userRole = req.headers.get('x-user-role'); // Access role from header set by authMiddleware
    const userId = req.headers.get('X-User-Id'); // Access role from header set by authMiddleware
   console.log(req.headers);
    
    console.log(userId);
    
    console.log("Required Role:", requiredRole);
    console.log("User Role from Header:", userRole);

  // Check if the role from the header matches the required role
    if (!userRole || userRole !== requiredRole) {
        return NextResponse.json({ message: `Access denied: ${requiredRole} role required` }, { status: 403 });
    }

    return NextResponse.next(); // Proceed if the user has the required role
}
 */