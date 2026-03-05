'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateProduct(formData: FormData) {
    const id = formData.get('id') as string;
    const namaProduk = formData.get('namaProduk') as string;
    const idKategori = formData.get('idKategori') as string;
    const harga = Number(formData.get('harga'));
    const stok = Number(formData.get('stok'));
    const deskripsiProduk = formData.get('deskripsiProduk') as string;

    const updateData: any = {
        namaProduk,
        idKategori,
        harga,
        stok,
        deskripsiProduk,
    };

    const removeMainImage = formData.get('remove-main-image') === 'true';
    if (removeMainImage) {
        updateData.gambarUrl = '/placeholder-image.jpg';
    }

    const file = formData.get('file-upload') as File;
    if (file && file.size > 0 && file.name && file.name !== 'undefined') {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');
        updateData.gambarUrl = `data:${file.type};base64,${base64String}`;
    }

    const deletedImagesStr = formData.get('deleted-images') as string;
    let deletedImageIds: string[] = [];
    if (deletedImagesStr) {
        try { deletedImageIds = JSON.parse(deletedImagesStr); } catch (e) { }
    }

    const galleryFiles = formData.getAll('gallery-upload') as File[];
    const galleryBase64: { url: string, urutan: number }[] = [];

    // Determine the next `urutan` for new images
    const existingImgs = await prisma.productImage.findMany({ where: { idProduk: id }, orderBy: { urutan: 'desc' }, take: 1 });
    let maxOrder = existingImgs.length > 0 ? existingImgs[0].urutan : 0;

    for (const gFile of galleryFiles) {
        if (gFile && gFile.size > 0 && gFile.name !== 'undefined') {
            const gBytes = await gFile.arrayBuffer();
            const gBuffer = Buffer.from(gBytes);
            const gBase64String = gBuffer.toString('base64');
            const gUrl = `data:${gFile.type};base64,${gBase64String}`;
            galleryBase64.push({ url: gUrl, urutan: ++maxOrder });
        }
    }

    // Build Prisma Update Query for relations
    if (deletedImageIds.length > 0 || galleryBase64.length > 0) {
        updateData.images = {};
        if (deletedImageIds.length > 0) {
            updateData.images.deleteMany = { id: { in: deletedImageIds } };
        }
        if (galleryBase64.length > 0) {
            updateData.images.create = galleryBase64;
        }
    }

    await prisma.product.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/products');
    revalidatePath('/admin/pos');
    redirect('/admin/products');
}
