'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { loginUser } from '../actions';
import { useRouter, useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function LoginClientForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        const formData = new FormData(e.currentTarget);

        const res = await loginUser(formData);

        if (res?.error) {
            setErrorMsg(res.error);
            setIsLoading(false);
        } else {
            const role = res?.user?.role;
            const defaultUrl = role === 'admin' ? '/admin' : '/';
            const finalRedirect = searchParams.get('redirect') || defaultUrl;
            router.push(finalRedirect);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl relative">
            <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Toko
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Selamat Datang Kembali</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Masuk ke panel manajemen toko Anda</p>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-zinc-100"
                        placeholder="admin@sentosa.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-zinc-100"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md mt-6 group disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Masuk ke Dashboard
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Belum punya akun?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Daftar di sini
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
            <LoginClientForm />
        </Suspense>
    );
}
