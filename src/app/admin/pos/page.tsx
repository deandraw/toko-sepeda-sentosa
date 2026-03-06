import prisma from '@/lib/prisma';
import POSClient from './POSClient';
import { Product, Category } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { verifyUserSession } from '@/app/(auth)/verify';

export default async function POSPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
        },
        orderBy: {
            namaProduk: 'asc',
        },
    });

    async function processCheckout(cartData: { productId: string, quantity: number, price: number }[], totalAmount: number, paymentMethod: string, address?: string) {
        'use server';

        const session = await verifyUserSession();
        if (!session.isAuthenticated || !session.user) {
            throw new Error("Tidak ada sesi pengguna kasir yang valid.");
        }

        // Create the order and details inside a transaction
        const transactionResult = await prisma.$transaction(async (tx: any) => {
            // 1. Create order
            const order = await tx.order.create({
                data: {
                    idPengguna: session.user.id as string,
                    totalHarga: totalAmount,
                    statusPesanan: "Selesai",
                    alamatPengiriman: address && address.trim() !== '' ? address : "Pembelian di Toko",
                }
            });

            // 2. Create order details & deduct stock
            for (const item of cartData) {
                await tx.orderDetail.create({
                    data: {
                        idPesanan: order.id,
                        idProduk: item.productId,
                        kuantitas: item.quantity,
                        hargaSatuan: item.price,
                    }
                });

                // Deduct stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stok: { decrement: item.quantity }
                    }
                });
            }

            // 3. Create payment record
            await tx.payment.create({
                data: {
                    idPesanan: order.id,
                    metodePembayaran: paymentMethod,
                    statusPembayaran: "Lunas"
                }
            });

            return order;
        });

        revalidatePath('/', 'layout');
        return { success: true, orderId: transactionResult.id };
    }

    return <POSClient products={products} processCheckout={processCheckout} />;
}
