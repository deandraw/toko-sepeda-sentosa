import prisma from '@/lib/prisma';
import { Package, Plus, Search, Edit2, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '../../../../src/generated/prisma';

import ProductListClient from './ProductListClient';

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
        },
        orderBy: {
            namaProduk: 'asc',
        },
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Package className="w-6 h-6 text-blue-500" />
                        Inventaris Barang
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Kelola daftar sepeda, aksesoris, dan sparepart toko Anda.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Barang
                </Link>
            </div>

            <ProductListClient initialProducts={products} />
        </div>
    );
}
