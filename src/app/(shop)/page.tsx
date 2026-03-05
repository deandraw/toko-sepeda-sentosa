import prisma from '@/lib/prisma';
import Image from 'next/image';
import { ShoppingCart, Star, Zap, Shield, ArrowRight } from 'lucide-react';
import CategorySectionClient from './CategorySectionClient';

export default async function ShopHomePage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { namaProduk: 'asc' },
    });

    const categories = await prisma.category.findMany({
        orderBy: { namaKategori: 'asc' }
    });

    return (
        <div className="flex flex-col animate-in fade-in duration-700">

            {/* Hero Section */}
            <section className="relative w-full bg-zinc-950 overflow-hidden min-h-[500px] flex items-center justify-center py-20">
                {/* Background Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-zinc-950 to-zinc-950"></div>
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 hidden lg:block">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500 fill-current opacity-40 blur-3xl">
                        <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96,-18,94.9,-3.1C93.8,11.8,86.1,26.1,77,39.1C67.9,52.1,57.4,63.8,44.5,72.6C31.6,81.4,16.3,87.3,1.1,85.4C-14.1,83.5,-29.3,73.8,-42.6,64.2C-55.9,54.6,-67.3,45,-75.4,32.7C-83.5,20.4,-88.3,5.4,-86.3,-8.9C-84.3,-23.2,-75.5,-36.8,-64.8,-48.1C-54.1,-59.4,-41.5,-68.4,-28.4,-75.4C-15.3,-82.4,-1.7,-87.4,12.3,-85C26.3,-82.6,40.3,-72.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium text-sm mb-6 border border-blue-500/20">
                        <Zap className="w-4 h-4" /> Koleksi Musim Ini Telah Hadir
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
                        Temukan Sepeda Impian Anda di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Sentosa</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl font-light">
                        Pusat penjualan sepeda berkualitas tinggi dan aksesoris original terlengkap. Melayani hobi bersepeda Anda dengan sepenuh hati.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
                        <a href="#katalog" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 group">
                            Eksplorasi Katalog
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#katalog" className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-semibold transition-all">
                            Lihat Promo
                        </a>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="bg-white py-16 border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-900 mb-2">Garansi Resmi</h3>
                            <p className="text-zinc-500 text-sm">Semua unit sepeda mendapatkan garansi resmi distributor hingga 5 tahun.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 -rotate-3">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-900 mb-2">Siap Rakit & Pakai</h3>
                            <p className="text-zinc-500 text-sm">Terima sepeda dalam kondisi siap dikayuh, disetel mekanik ahli kami.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                                <Star className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-lg text-zinc-900 mb-2">Pasti Original</h3>
                            <p className="text-zinc-500 text-sm">100% Produk yang dijual berasal langsung dari merek asli (bukan replika).</p>
                        </div>
                    </div>
                </div>
            </section>

            <div id="katalog" className="scroll-mt-10">
                <CategorySectionClient
                    title="Katalog Sepeda Terbaru"
                    subtitle="Pilihan unit favorit para goweser tangguh minggu ini."
                    products={products}
                    categories={categories}
                    isAccessorySection={false}
                />

                <CategorySectionClient
                    title="Koleksi Aksesoris & Perlengkapan"
                    subtitle="Lengkapi petualangan Anda dengan peralatan kualitas premium."
                    products={products}
                    categories={categories}
                    isAccessorySection={true}
                />
            </div>

        </div>
    );
}
