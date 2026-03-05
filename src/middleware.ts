import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Use same secret key as actions.ts
const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'sentosa-secure-fallback-secret-key-32-bytes'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We only protect the /admin branch
    if (pathname.startsWith('/admin')) {
        const sessionToken = request.cookies.get('session_token')?.value;

        // No token found, kick them to login
        if (!sessionToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Verify the JWT signature using jose on the Vercel Edge Runtime
            const { payload } = await jwtVerify(sessionToken, SECRET_KEY);

            // Only admins are allowed in the /admin branch
            if (String(payload.role).toLowerCase() !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url));
            }

            return NextResponse.next(); // Signature verified, allow access
        } catch (error) {
            // Token is expired or tampered, clear cookie and redirect
            console.error('Invalid JWT in Middleware:', error);
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('session_token');
            return response;
        }
    }

    // Free passage for public (shop) and static assets
    return NextResponse.next();
}

// Optimization strategy: Only invoke this Middleware function on specific paths
export const config = {
    matcher: ['/admin/:path*'],
};
