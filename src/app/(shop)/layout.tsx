import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Toko Sepeda Sentosa | Belanja Sepeda Online",
    description: "Temukan sepeda dan sparepart terbaik di Toko Sepeda Sentosa.",
};

import "../globals.css";

import { ShoppingCart, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { CartProvider } from '@/components/shop/CartContext';
import HeaderCartButton from './HeaderCartButton';
import MobileMenuClient from './MobileMenuClient';
import { verifyUserSession } from '@/app/(auth)/verify';

export default async function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await verifyUserSession();

    return (
        <html lang="id">
            <body className="antialiased">
                <CartProvider>
                    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
                        {/* Public Storefront Navbar */}
                        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 shadow-sm">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                                        <ShoppingCart className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-bold text-xl tracking-tight text-zinc-900">Sentosa<span className="text-blue-600">Bike</span></span>
                                </Link>

                                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-600">
                                    <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
                                    <Link href="/#katalog" className="hover:text-blue-600 transition-colors">Katalog</Link>
                                    <Link href="/#aksesoris" className="hover:text-blue-600 transition-colors">Aksesoris</Link>
                                    <Link href="/tentang" className="hover:text-blue-600 transition-colors">Tentang Kami</Link>
                                    <Link href="/panduan" className="hover:text-blue-600 transition-colors font-semibold text-blue-600/80">Panduan Belanja</Link>
                                </nav>

                                <div className="flex items-center gap-4">
                                    {session.isAuthenticated ? (
                                        session.user?.role === 'admin' ? (
                                            <Link href="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors shadow-sm">
                                                <UserCircle className="w-4 h-4" />
                                                <span className="truncate max-w-[100px]">Halo, {session.user?.namaLengkap ? String(session.user.namaLengkap).split(' ')[0] : 'Admin'}</span>
                                            </Link>
                                        ) : (
                                            <Link href="/profile" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-sm font-bold transition-colors shadow-sm">
                                                <UserCircle className="w-4 h-4" />
                                                <span className="truncate max-w-[100px]">Halo, {session.user?.namaLengkap ? String(session.user.namaLengkap).split(' ')[0] : 'Pelanggan'}</span>
                                            </Link>
                                        )
                                    ) : (
                                        <Link href="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-sm font-bold transition-colors border border-zinc-200">
                                            <UserCircle className="w-4 h-4" />
                                            <span>Login/Daftar</span>
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <HeaderCartButton />
                                        <MobileMenuClient session={session} />
                                    </div>
                                </div>

                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 w-full mx-auto">
                            {children}
                        </main>

                        {/* Public Footer */}
                        <footer className="bg-white border-t border-zinc-200 mt-20">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                                    <div className="space-y-6">
                                        <Link href="/" className="flex items-center gap-2 group">
                                            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                                                <ShoppingCart className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="font-bold text-xl tracking-tight text-zinc-900">Sentosa<span className="text-blue-600">Bike</span></span>
                                        </Link>
                                        <p className="text-zinc-600 text-sm leading-relaxed">
                                            Toko sepeda dan perlengkapan olahraga terlengkap. Mitra terpercaya untuk kebutuhan hobi dan mobilitas Anda.
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-zinc-900">Alamat Kami</h3>
                                        <address className="not-italic text-zinc-500 text-sm leading-relaxed">
                                            Jl Pasar Baru No 91B Majakerta,<br />
                                            Kec. Majalaya, Kab Bandung,<br />
                                            Jawa Barat 40382<br />
                                            <br />
                                            <strong>Buka:</strong> Setiap Hari, 08.00 - 17.00
                                        </address>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-zinc-900">Tautan Penting</h3>
                                        <ul className="text-sm text-zinc-500 space-y-3">
                                            <li><Link href="/tentang" className="hover:text-blue-600 transition-colors">Profil Perusahaan</Link></li>
                                            <li><Link href="/panduan" className="hover:text-blue-600 transition-colors">Panduan Belanja / FAQ</Link></li>
                                            <li><Link href="/login" className="hover:text-blue-600 transition-colors">Masuk ke Akun Anda</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <p className="text-sm text-zinc-400">© 2026 Toko Sepeda Sentosa. Seluruh hak cipta dilindungi.</p>
                                    <p className="text-sm font-semibold text-zinc-400">#BersepedaItuSehat</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </CartProvider>
            </body>
        </html>
    );
}
