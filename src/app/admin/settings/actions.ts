'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { verifyUserSession } from '@/app/(auth)/verify';

export async function updateAdminSettings(formData: FormData) {
    try {
        const session = await verifyUserSession();
        if (!session.isAuthenticated || !session.user || (session.user.role as string)?.toLowerCase() !== 'admin') {
            return { error: 'Tidak memiliki akses.' };
        }

        const id = session.user.id as string;
        const namaLengkap = formData.get('namaLengkap') as string;
        const noTelepon = formData.get('noTelepon') as string;
        const alamatLengkap = formData.get('alamatLengkap') as string;
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;

        const admin = await prisma.user.findUnique({ where: { id } });
        if (!admin) return { error: 'Admin tidak ditemukan.' };

        const updateData: any = {
            namaLengkap,
            noTelepon,
            alamatLengkap,
        };

        if (currentPassword && newPassword) {
            const isValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isValid) return { error: 'Password saat ini salah.' };

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
