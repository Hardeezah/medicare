import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Define roles allowed to access specific paths
const rolePermissions = {
    '/admin': ['admin'],       // Only admins can access /admin routes
    '/doctor': ['doctor', 'admin'], // Doctors and admins can access /doctor routes
    '/dashboard': ['user', 'doctor', 'admin'], // All authenticated users can access /dashboard
};

export function middleware(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        // Determine the requested path
        const { pathname } = req.nextUrl;

        // Check if the user's role is allowed to access the requested path
        const allowedRoles = Object.keys(rolePermissions).find(path => pathname.startsWith(path)) 
            ? rolePermissions[pathname.split('/')[1] as keyof typeof rolePermissions]
            : null;

                if (allowedRoles && !allowedRoles.includes(decoded.role)) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        // Attach user info to headers for further use in route handlers
        req.headers.set('user', JSON.stringify(decoded));
        return NextResponse.next(); // Continue to the route handler
    } catch (err) {
        // Redirect to login if the token is invalid or expired
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/doctor/:path*'], // Protect these paths
};
