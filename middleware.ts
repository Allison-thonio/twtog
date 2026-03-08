import { NextResponse, NextRequest } from 'next/server';

/**
 * Middleware to protect administrative routes from unauthorized access.
 * This runs at the edge, before the request reaches the server or client.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all routes starting with /admin/dashboard
    if (pathname.startsWith('/admin/dashboard')) {
        const adminSession = request.cookies.get('admin_session');

        // If no secure session cookie is found, redirect to login
        if (!adminSession || adminSession.value !== 'TWT_SECURE_SESSION') {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
