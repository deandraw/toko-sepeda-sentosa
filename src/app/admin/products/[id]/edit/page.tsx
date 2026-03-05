import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditProductFormClient from './EditProductFormClient';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: {
            id: id,
        },
        include: {
            images: {
                orderBy: { urutan: 'asc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        orderBy: { namaKategori: 'asc' },
    });

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Edit Data Barang
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Perbarui informasi detail untuk perlengkapan atau sepeda.
                    </p>
                </div>
            </div>

            <EditProductFormClient product={product} categories={categories} />
        </div>
    );
}
