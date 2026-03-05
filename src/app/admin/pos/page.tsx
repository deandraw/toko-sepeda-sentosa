import prisma from '@/lib/prisma';
import POSClient from './POSClient';
import { Product, Category } from '@prisma/client';
import { redirect } from 'next/navigation';

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

        const user = await prisma.user.findFirst();
        if (!user) {
            throw new Error("Tidak ada pengguna/kasir di database.");
        }

        // Create the order and details inside a transaction
        const transactionResult = await prisma.$transaction(async (tx: any) => {
            // 1. Create order
            const order = await tx.order.create({
                data: {
                    idPengguna: user.id,
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

        return { success: true, orderId: transactionResult.id };
    }

    return <POSClient products={products} processCheckout={processCheckout} />;
}
