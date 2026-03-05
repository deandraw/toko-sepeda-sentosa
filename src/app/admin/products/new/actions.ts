'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
    const namaProduk = formData.get('namaProduk') as string;
    const idKategori = formData.get('idKategori') as string;
    const harga = Number(formData.get('harga'));
    const stok = Number(formData.get('stok'));
    const deskripsiProduk = formData.get('deskripsiProduk') as string;

    let gambarUrl = '/placeholder-image.jpg';
    const file = formData.get('file-upload') as File;
    console.log("SERVER ACTION RECEIVED FORM:", { namaProduk, hasFile: !!file, fileName: file?.name, fileSize: file?.size, fileType: file?.type });
    if (file && file.size > 0 && file.name !== 'undefined') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');
        gambarUrl = `data:${file.type};base64,${base64String}`;
    }

    const galleryFiles = formData.getAll('gallery-upload') as File[];
    const galleryBase64: { url: string, urutan: number }[] = [];

    let order = 1;
    for (const gFile of galleryFiles) {
        if (gFile && gFile.size > 0 && gFile.name !== 'undefined') {
            const gBytes = await gFile.arrayBuffer();
            const gBuffer = Buffer.from(gBytes);
            const gBase64String = gBuffer.toString('base64');
            const gUrl = `data:${gFile.type};base64,${gBase64String}`;
            galleryBase64.push({ url: gUrl, urutan: order++ });
        }
    }

    await prisma.product.create({
        data: {
            namaProduk,
            idKategori,
            harga,
            stok,
            deskripsiProduk,
            gambarUrl,
            images: {
                create: galleryBase64
            }
        },
    });

    revalidatePath('/admin/products');
    redirect('/admin/products');
}
