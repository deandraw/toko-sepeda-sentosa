'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string) {
    try {
        // Delete the product
        await prisma.product.delete({
            where: { id: productId }
        });

        // Revalidate the products page to refresh the data
        revalidatePath('/admin/products');
        revalidatePath('/admin/pos'); // Also refresh POS since product is gone

        return { success: true };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, error: 'Failed to delete product. Ensure it is not linked to existing orders.' };
    }
}
