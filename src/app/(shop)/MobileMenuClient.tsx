'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, UserCircle } from 'lucide-react';

interface MobileMenuProps {
    session: any;
}

export default function MobileMenuClient({ session }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const menuContent = (
        <>
            {/* Slide-over Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden transition-opacity"
                    onClick={closeMenu}
                />
            )}

            {/* Slide-over Menu */}
            <div className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Close Button Inside Menu */}
                <div className="h-16 flex items-center justify-end px-4 border-b border-zinc-100">
                    <button onClick={closeMenu} className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-6 py-6 flex flex-col gap-4 font-bold text-lg text-zinc-800 overflow-y-auto">
                    <Link href="/" onClick={closeMenu} className="block py-3 hover:text-blue-600 transition-colors border-b border-zinc-100">Beranda</Link>
                    <Link href="/#katalog" onClick={closeMenu} className="block py-3 hover:text-blue-600 transition-colors border-b border-zinc-100">Katalog Sepeda</Link>
                    <Link href="/#aksesoris" onClick={closeMenu} className="block py-3 hover:text-blue-600 transition-colors border-b border-zinc-100">Aksesoris</Link>
                    <Link href="/tentang" onClick={closeMenu} className="block py-3 hover:text-blue-600 transition-colors border-b border-zinc-100">Tentang Kami</Link>
                    <Link href="/panduan" onClick={closeMenu} className="block py-3 text-blue-600 hover:text-blue-800 transition-colors border-b border-zinc-100">Panduan Belanja</Link>

                    <div className="pt-8 mt-auto mb-6">
                        <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Akun Saya</p>
                        {session?.isAuthenticated ? (
                            session.user?.role === 'admin' ? (
                                <Link onClick={closeMenu} href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-colors">
                                    <UserCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="truncate">Panel Admin ({session.user?.namaLengkap ? String(session.user.namaLengkap).split(' ')[0] : 'Admin'})</span>
                                </Link>
                            ) : (
                                <Link onClick={closeMenu} href="/profile" className="flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-xl font-bold transition-colors shadow-sm">
                                    <UserCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="truncate">Profil ({session.user?.namaLengkap ? String(session.user.namaLengkap).split(' ')[0] : 'Pelanggan'})</span>
                                </Link>
                            )
                        ) : (
                            <Link onClick={closeMenu} href="/login" className="flex items-center justify-center gap-3 px-4 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all shadow-md">
                                <UserCircle className="w-5 h-5 flex-shrink-0" />
                                <span>Login / Daftar Baru</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </>
    );

    return (
        <div className="md:hidden flex items-center">
            <button
                onClick={toggleMenu}
                className="p-2 -mr-2 text-zinc-600 hover:text-blue-600 transition-colors"
                aria-label="Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {mounted ? createPortal(menuContent, document.body) : null}
        </div>
    );
}
