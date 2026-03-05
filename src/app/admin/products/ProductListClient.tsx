'use client';

import { Package, Search, Edit2, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteProduct } from './actions';
import { useState } from 'react';

// Using inline types to simplify import if we don't have the exact Prisma type handy here
type ProductWithCategory = {
    id: string;
    namaProduk: string;
    deskripsiProduk: string | null;
    harga: number;
    stok: number;
    gambarUrl: string | null;
    category: {
        namaKategori: string;
    };
};

export default function ProductListClient({ initialProducts }: { initialProducts: ProductWithCategory[] }) {
    const [products] = useState(initialProducts);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Extract unique categories from products
    const categories = Array.from(new Set(initialProducts.map(p => p.category.namaKategori))).sort();

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.namaKategori.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === '' || product.category.namaKategori === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${name}"?\nPerhatian: Produk yang sudah dihapus tidak dapat dikembalikan.\n\nTIPS: Anda mungkin tidak bisa menghapus produk yang sudah memiliki riwayat transaksi.`)) {
            setIsDeleting(id);
            const result = await deleteProduct(id);

            if (!result.success) {
                alert(result.error);
            }
            setIsDeleting(null);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cari nama barang..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-300 focus:border-blue-500 rounded-xl text-sm outline-none transition-all cursor-text dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-blue-500 shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none flex items-center justify-between gap-2 pl-4 pr-10 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 w-full sm:w-auto dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors shadow-sm outline-none cursor-pointer focus:border-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200 dark:bg-zinc-950/50 dark:text-zinc-400 dark:border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-xl font-medium w-16">Foto</th>
                            <th className="px-6 py-4 font-medium">Nama Produk</th>
                            <th className="px-6 py-4 font-medium">Spesifikasi</th>
                            <th className="px-6 py-4 font-medium">Kategori</th>
                            <th className="px-6 py-4 font-medium">Harga</th>
                            <th className="px-6 py-4 font-medium">Stok</th>
                            <th className="px-6 py-4 text-right rounded-tr-xl font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Package className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                                        <p>Belum ada produk yang cocok dengan pencarian.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group ${isDeleting === product.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="relative w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                                            {product.gambarUrl && product.gambarUrl !== '/placeholder-image.jpg' ? (
                                                <Image
                                                    src={product.gambarUrl}
                                                    alt={product.namaProduk}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="absolute inset-0"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                                        {product.namaProduk}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]" title={product.deskripsiProduk || ''}>
                                        {product.deskripsiProduk || 'Tidak ada spesifikasi'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                            {product.category.namaKategori}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                        Rp {product.harga.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stok > 10 ? 'bg-emerald-500' : product.stok > 0 ? 'bg-amber-500' : 'bg-red-500'
                                                }`}></div>
                                            <span className={`font-medium ${product.stok === 0 ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'
                                                }`}>
                                                {product.stok} unit
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Notice: Edit is wired up now! */}
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.namaProduk)}
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Details */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/50 rounded-b-2xl">
                <span>Menampilkan <span className="font-medium text-zinc-900 dark:text-zinc-100">{filteredProducts.length}</span> barang</span>
            </div>
        </div>
    );
}
