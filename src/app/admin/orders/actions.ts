'use server';

import prisma from '@/lib/prisma';
import { verifyUserSession } from '@/app/(auth)/verify';
import { revalidatePath } from 'next/cache';

export async function getAllOrders() {
    const session = await verifyUserSession();
    if (!session.isAuthenticated || session.user?.role !== 'admin') {
        return { error: 'Anda tidak memiliki akses ke halaman ini.' };
    }

    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        namaLengkap: true,
                        email: true,
                        noTelepon: true
                    }
                },
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

        return { success: true, orders };
    } catch (error) {
        console.error('Fetch All Orders Error:', error);
        return { error: 'Gagal memuat data pesanan masuk.' };
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const session = await verifyUserSession();
    if (!session.isAuthenticated || session.user?.role !== 'admin') {
        return { error: 'Akses ditolak.' };
    }

    // Validate the newStatus against allowed list
    const allowedStatuses = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
    if (!allowedStatuses.includes(newStatus)) {
        return { error: 'Status pesanan tidak valid.' };
    }

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { statusPesanan: newStatus }
        });

        revalidatePath('/admin/orders');
        revalidatePath('/profile'); // Revalidate profile as well so customers see the update
        revalidatePath('/admin'); // Revalidate dashboard stats

        return { success: true };
    } catch (error) {
        console.error('Update Order Status Error:', error);
        return { error: 'Gagal memperbarui status pesanan.' };
    }
}
