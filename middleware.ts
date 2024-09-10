import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middleware/auth'; // Import auth middleware
import { roleCheckMiddleware } from './middleware/roleCheck'; // Import role-based middleware

// Global middleware for applying authentication and role checks on API routes
export async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;

    // Apply authentication to /api/admin, /api/doctor, and /api/user routes
    if (url.startsWith('/api/user') || url.startsWith('/api/admin') || url.startsWith('/api/doctor')) {
        const authResponse = await authMiddleware(req); // Apply auth check
        if (authResponse.status !== 200) return authResponse; // Block if not authenticated

        if (url.startsWith('/api/admin')) {
            const roleCheckResponse = await roleCheckMiddleware(req, 'admin'); // Check if the user is an admin
            if (roleCheckResponse.status !== 200) return roleCheckResponse; // Block if not an admin
        }

        // Check role for doctor-specific routes
        if (url.startsWith('/api/doctor')) {
            const roleCheckResponse = await roleCheckMiddleware(req, 'doctor'); // Check if the user is a doctor
            if (roleCheckResponse.status !== 200) {
                // Allow admin to access doctor routes
                const adminRoleCheckResponse = await roleCheckMiddleware(req, 'admin');
                if (adminRoleCheckResponse.status !== 200) return adminRoleCheckResponse; // Block if not a doctor or admin
            }
        }

        // Check role for user-specific routes
        if (url.startsWith('/api/user')) {
            const roleCheckResponse = await roleCheckMiddleware(req, 'user'); // Check if the user is a regular user
            if (roleCheckResponse.status !== 200) return roleCheckResponse; // Block if not a user
        }
    }

    // Apply security headers globally
    const res = NextResponse.next();
    res.headers.set('X-Content-Type-Options', 'nosniff');
    return res;
}

// Define matchers to apply middleware only on specific routes
export const config = {
    matcher: [
        '/api/user/:path*', // Apply on all /api/user routes
        '/api/admin/:path*', // Apply on all /api/admin routes
        '/api/doctor/:path*', // Apply on all /api/doctor routes
    ],
};
