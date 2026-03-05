'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'sentosa-secure-fallback-secret-key-32-bytes'
);

export async function verifyUserSession() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;

        if (!sessionToken) {
            return { isAuthenticated: false };
        }

        // Verify the JWT signature
        const { payload } = await jwtVerify(sessionToken, SECRET_KEY);

        return {
            isAuthenticated: true,
            user: {
                id: payload.userId,
                role: payload.role,
                namaLengkap: payload.namaLengkap
            }
        };
    } catch (error) {
        // Token is invalid/expired
        return { isAuthenticated: false };
    }
}
