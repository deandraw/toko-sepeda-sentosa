'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';

// Utility to parse categories
export const isAccessoryCategory = (categoryName: string) => {
    const accKeywords = ['aksesoris', 'helm', 'lampu', 'botol', 'apparel', 'jersey', 'sepatu', 'sarung', 'kacamata', 'mainan'];
    return accKeywords.some(keyword => categoryName.toLowerCase().includes(keyword));
};

export default function CategorySectionClient({
    title,
    subtitle,
    products,
    categories,
    isAccessorySection
}: {
    title: string;
    subtitle: string;
    products: any[];
    categories: any[];
    isAccessorySection: boolean;
}) {
    // Filter the incoming generic lists down to this specific section's domain
    const sectionCategories = categories.filter(c =>
        isAccessorySection ? isAccessoryCategory(c.namaKategori) : !isAccessoryCategory(c.namaKategori)
    );

    const sectionProducts = products.filter(p =>
        isAccessorySection ? isAccessoryCategory(p.category.namaKategori) : !isAccessoryCategory(p.category.namaKategori)
    );

    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

    // Apply active pill filter
    const displayedProducts = activeCategoryId
        ? sectionProducts.filter(p => p.idKategori === activeCategoryId)
        : sectionProducts;

    if (sectionProducts.length === 0) {
        return null; // Don't render the section at all if there are no products for it
    }

    return (
        <section className={`py-20 ${isAccessorySection ? 'bg-white' : 'bg-zinc-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{title}</h2>
                        <p className="mt-2 text-zinc-500">{subtitle}</p>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategoryId(null)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategoryId === null
                                ? 'bg-zinc-900 text-white shadow-md'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                }`}
                        >
                            Semua
                        </button>
                        {sectionCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategoryId === cat.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200'
                                    }`}
                            >
                                {cat.namaKategori}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedProducts.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                            <p>Tidak ada produk di kategori ini.</p>
                        </div>
                    ) : (
                        displayedProducts.map((product) => (
                            <div key={product.id} className="group relative bg-white border border-zinc-200/80 rounded-3xl p-4 flex flex-col hover:shadow-xl hover:border-zinc-300 hover:-translate-y-1 transition-all duration-300">
                                <Link href={`/product/${product.id}`} className="block aspect-[4/3] w-full bg-zinc-100 rounded-2xl overflow-hidden relative mb-5 flex items-center justify-center border border-zinc-100/50">
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-200/50 to-transparent mix-blend-multiply z-10"></div>

                                    {product.gambarUrl && product.gambarUrl !== '/placeholder-image.jpg' ? (
                                        <img
                                            src={product.gambarUrl}
                                            alt={product.namaProduk}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0 z-0"
                                        />
                                    ) : (
                                        <ShoppingCart className="w-12 h-12 text-zinc-300 group-hover:scale-110 group-hover:text-blue-200 transition-all duration-500 relative z-0" />
                                    )}
                                    {product.stok <= 0 && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm">
                                            Habis
                                        </div>
                                    )}
                                </Link>

                                <div className="flex-1 flex flex-col justify-between px-1">
                                    <Link href={`/product/${product.id}`} className="block">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                                                {product.category.namaKategori}
                                            </span>
                                            <span className="text-[11px] font-medium text-zinc-400">
                                                Stok: {product.stok}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-zinc-900 text-base leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                            {product.namaProduk}
                                        </h3>
                                    </Link>
                                    <div className="mt-5 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5">Harga</p>
                                            <p className="font-extrabold text-zinc-900 text-lg">
                                                Rp {product.harga.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <AddToCartButton product={{
                                            id: product.id,
                                            namaProduk: product.namaProduk,
                                            harga: product.harga,
                                            stok: product.stok,
                                            kuantitas: 1,
                                            gambarUrl: product.gambarUrl
                                        }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
