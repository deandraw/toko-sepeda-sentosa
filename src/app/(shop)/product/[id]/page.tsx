import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ShoppingCart, ShieldCheck, ArrowLeft, ChevronRight, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import ImageGalleryClient from './ImageGalleryClient';
import AddToCartDetailClient from './AddToCartDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!product) return { title: 'Produk Tidak Ditemukan' };

    return {
        title: `${product.namaProduk} | Toko Sepeda Sentosa`,
        description: product.deskripsiProduk?.substring(0, 150) || `Beli ${product.namaProduk} original dengan harga terbaik.`,
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: {
                orderBy: { urutan: 'asc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    // Prepare gallery images starting with the main thumbnail
    const galleryImages = [];
    if (product.gambarUrl && product.gambarUrl !== '/placeholder-image.jpg') {
        galleryImages.push({ id: 'main', url: product.gambarUrl });
    }
    // Append additional product images
    product.images.forEach(img => {
        galleryImages.push({ id: img.id, url: img.url });
    });

    // If no images at all, use placeholder
    if (galleryImages.length === 0) {
        galleryImages.push({ id: 'placeholder', url: '/placeholder-image.jpg' });
    }

    // Formatting specifications
    // If Admin used newlines, we convert them to an array for a neat list
    const specsList = product.spesifikasi ? product.spesifikasi.split('\n').filter(s => s.trim() !== '') : [];

    return (
        <div className="bg-zinc-50 min-h-screen pb-20">
            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm font-medium text-zinc-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
                        <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
                        <ChevronRight className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                        <Link href={`/#katalog`} className="hover:text-blue-600 transition-colors">Katalog</Link>
                        <ChevronRight className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                        <span className="text-zinc-900 truncate max-w-[200px] sm:max-w-xs">{product.namaProduk}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">

                        {/* Left Column: Image Gallery */}
                        <div className="p-6 lg:p-10 bg-zinc-50/50">
                            <ImageGalleryClient images={galleryImages} productName={product.namaProduk} />
                        </div>

                        {/* Right Column: Product Info & Actions */}
                        <div className="p-6 lg:p-10 flex flex-col">
                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-100">
                                    {product.category.namaKategori}
                                </span>
                                {product.stok > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <PackageCheck className="w-3.5 h-3.5" /> Tersedia ({product.stok})
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                                        Habis
                                    </span>
                                )}
                            </div>

                            {/* Title & Price */}
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-4">
                                {product.namaProduk}
                            </h1>
                            <div className="mb-8">
                                <p className="text-3xl sm:text-4xl font-black text-blue-600">
                                    Rp {product.harga.toLocaleString('id-ID')}
                                </p>
                            </div>

                            {/* Client Component for Add to Cart Logic */}
                            <div className="mb-10 pb-10 border-b border-zinc-200">
                                <AddToCartDetailClient product={{
                                    id: product.id,
                                    namaProduk: product.namaProduk,
                                    harga: product.harga,
                                    stok: product.stok,
                                    kuantitas: 1, // Default starting mapped elsewhere
                                    gambarUrl: product.gambarUrl
                                }} />
                            </div>

                            {/* Specs and Description Tabs/Sections */}
                            <div className="space-y-8 flex-1">
                                {specsList.length > 0 && (
                                    <div className="animate-in fade-in duration-700">
                                        <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-4">
                                            <ShieldCheck className="w-5 h-5 text-blue-500" /> Spesifikasi Utama
                                        </h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                            {specsList.map((spec, idx) => {
                                                const [key, val] = spec.split(':');
                                                return (
                                                    <li key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm pb-2 border-b border-zinc-100 border-dashed">
                                                        {val ? (
                                                            <>
                                                                <span className="font-semibold text-zinc-700 min-w-[100px]">{key.trim()}</span>
                                                                <span className="text-zinc-500 flex-1">{val.trim()}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-zinc-600 whitespace-pre-wrap">{spec.trim()}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-3">Deskripsi Produk</h3>
                                    <div className="prose prose-zinc prose-sm sm:prose-base max-w-none text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                        {product.deskripsiProduk ? product.deskripsiProduk : "Belum ada deskripsi untuk produk ini."}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
