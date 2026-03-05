import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductFormClient from './ProductFormClient';

export default async function NewProductPage() {
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
                        Tambah Barang Baru
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Masukkan detail barang yang ingin Anda tambahkan ke inventaris.
                    </p>
                </div>
            </div>

            <ProductFormClient categories={categories} />
        </div>
    );
}
