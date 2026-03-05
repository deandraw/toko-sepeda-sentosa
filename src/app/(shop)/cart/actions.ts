'use server';

import prisma from '@/lib/prisma';
import { verifyUserSession } from '@/app/(auth)/verify';
import { revalidatePath } from 'next/cache';

type CartItemInput = {
    id: string; // Product ID
    kuantitas: number;
    harga: number;
};

export async function createOnlineOrder(cartItems: CartItemInput[], paymentMethod: string) {
    const session = await verifyUserSession();

    if (!session.isAuthenticated || !session.user?.id) {
        return { error: 'Anda harus login untuk membuat pesanan.' };
    }

    if (!cartItems || cartItems.length === 0) {
        return { error: 'Keranjang belanja Anda kosong.' };
    }

    try {
        // Double check user address
        const userRow = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: { alamatLengkap: true, noTelepon: true, namaLengkap: true }
        });

        if (!userRow?.alamatLengkap) {
            return { error: 'Alamat pengiriman belum diisi. Silakan lengkapi di halaman Profil.' };
        }

        // Calculate total exactly as the backend sees it
        let totalHarga = 0;
        const processedItems: { idProduk: string, kuantitas: number, hargaSatuan: number }[] = [];

        for (const item of cartItems) {
            // Verify product exists and get its real price to prevent client-side manipulation
            const product = await prisma.product.findUnique({
                where: { id: item.id },
                select: { harga: true, stok: true, namaProduk: true }
            });

            if (!product) {
                return { error: `Produk dengan ID ${item.id} tidak ditemukan.` };
            }

            if (product.stok < item.kuantitas) {
                return { error: `Stok produk "${product.namaProduk}" tidak mencukupi. Tersisa: ${product.stok}` };
            }

            totalHarga += product.harga * item.kuantitas;

            processedItems.push({
                idProduk: item.id,
                kuantitas: item.kuantitas,
                hargaSatuan: product.harga
            });
        }

        // Determine status based on payment mechanism
        const statusPembayaran = paymentMethod === 'COD' ? 'Pending (COD)' : 'Menunggu Transfer';
        const statusPesanan = 'Menunggu Pembayaran'; // Will be updated by Admin later

        // Use Prisma Transaction to ensure atomic consistency
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create Order Master
            const newOrder = await tx.order.create({
                data: {
                    idPengguna: session.user!.id as string,
                    totalHarga,
                    statusPesanan,
                    alamatPengiriman: userRow.alamatLengkap,
                }
            });

            // 2. Insert Order Details and Deduct Stock
            for (const item of processedItems) {
                await tx.orderDetail.create({
                    data: {
                        idPesanan: newOrder.id,
                        idProduk: item.idProduk,
                        kuantitas: item.kuantitas,
                        hargaSatuan: item.hargaSatuan
                    }
                });

                // Deduct stock
                await tx.product.update({
                    where: { id: item.idProduk },
                    data: { stok: { decrement: item.kuantitas } }
                });
            }

            // 3. Create initial payment history record
            await tx.payment.create({
                data: {
                    idPesanan: newOrder.id,
                    metodePembayaran: paymentMethod,
                    statusPembayaran
                }
            });

            return newOrder;
        });

        revalidatePath('/admin'); // Update dashboard graphics for the admin

        return {
            success: true,
            orderId: order.id,
            totalHarga,
            customerData: {
                namaLengkap: userRow.namaLengkap,
                noTelepon: userRow.noTelepon,
                alamatLengkap: userRow.alamatLengkap
            }
        };

    } catch (error) {
        console.error('Create Order Error:', error);
        return { error: 'Gagal membuat pesanan.' };
    }
}
