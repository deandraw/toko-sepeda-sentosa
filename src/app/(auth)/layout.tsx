import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Autentikasi | Toko Sepeda Sentosa',
    description: 'Login ke panel manajemen Sentosa Bike',
};

import "../globals.css";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className="antialiased bg-zinc-50 dark:bg-zinc-950 font-sans min-h-screen flex flex-col items-center justify-center p-4">
                <main className="w-full max-w-md">
                    <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                                Sentosa<span className="text-blue-600">Bike</span>
                            </span>
                        </Link>
                    </div>

                    <div className="animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
