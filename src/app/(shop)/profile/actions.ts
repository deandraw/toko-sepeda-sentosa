'use server';

import prisma from '@/lib/prisma';
import { verifyUserSession } from '@/app/(auth)/verify';
import { revalidatePath } from 'next/cache';

// Fetch the full user document from DB
export async function getUserProfile() {
    const session = await verifyUserSession();

    if (!session.isAuthenticated || !session.user?.id) {
        return { error: 'Sesi tidak valid.' };
    }

    try {
        const userRow = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: {
                id: true,
                namaLengkap: true,
                email: true,
                role: true,
                noTelepon: true,
                alamatLengkap: true
            }
        });

        if (!userRow) return { error: 'Pengguna tidak ditemukan.' };

        return { success: true, user: userRow };
    } catch (error) {
        console.error('Fetch Profile Error:', error);
        return { error: 'Terjadi kesalahan sistem.' };
    }
}

// Action to update the phone number and address
export async function updateUserProfile(formData: FormData) {
    const session = await verifyUserSession();

    if (!session.isAuthenticated || !session.user?.id) {
        return { error: 'Akses ditolak.' };
    }

    const noTelepon = formData.get('noTelepon') as string;
    const alamatLengkap = formData.get('alamatLengkap') as string;

    try {
        await prisma.user.update({
            where: { id: session.user.id as string },
            data: {
                noTelepon: noTelepon || null,
                alamatLengkap: alamatLengkap || null
            }
        });

        revalidatePath('/profile');

        return { success: true };
    } catch (error) {
        console.error('Update Profile Error:', error);
        return { error: 'Gagal memperbarui profil.' };
    }
}

export async function getUserOrders() {
    const session = await verifyUserSession();

    if (!session.isAuthenticated || !session.user?.id) {
        return { error: 'Sesi tidak valid.' };
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                idPengguna: session.user.id as string
            },
            include: {
                orderDetails: {
                    include: {
                        product: {
                            select: {
                                namaProduk: true
                            }
                        }
                    }
                },
                payments: true
            },
            orderBy: {
                tanggalPesanan: 'desc'
            }
        });

        return { orders };
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        return { error: 'Terjadi kesalahan saat memuat riwayat pesanan.' };
    }
}
