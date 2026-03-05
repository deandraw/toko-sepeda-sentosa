'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// For production, always use process.env.JWT_SECRET
const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'sentosa-secure-fallback-secret-key-32-bytes'
);

export async function registerUser(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!name || !email || !password || password.length < 6) {
            return { error: 'Data tidak lengkap atau password kurang dari 6 karakter.' };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.' };
        }

        // Hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Assign 'admin' role if this is Sentosa's backend registration
        const user = await prisma.user.create({
            data: {
                namaLengkap: name,
                email,
                password: hashedPassword,
                role: 'customer' // Default public role
            }
        });

        // Automatically log them in by creating a session
        await createSession(user.id, user.role, user.namaLengkap);

        return { success: true, user: { role: user.role } };
    } catch (error) {
        console.error('Registration Error:', error);
        return { error: 'Terjadi kesalahan pada server saat mendaftarkan akun.' };
    }
}

export async function loginUser(formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return { error: 'Email dan Password wajib diisi.' };
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { error: 'Email atau Password salah.' };
        }

        // Verify hash
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return { error: 'Email atau Password salah.' };
        }

        await createSession(user.id, String(user.role).toLowerCase(), user.namaLengkap);

        return { success: true, user: { role: String(user.role).toLowerCase() } };
    } catch (error) {
        console.error('Login Error:', error);
        return { error: 'Terjadi kesalahan sistem saat mencoba login.' };
    }
}

export async function logoutUser() {
    (await cookies()).delete('session_token');
    redirect('/login');
}

// Internal helper to create the JWT Session Cookie
async function createSession(userId: string, role: string, namaLengkap: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days
    const sessionToken = await new SignJWT({ userId, role, namaLengkap })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY);

    (await cookies()).set('session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    });
}
