'use client';

import { useState } from 'react';
import { updateUserProfile } from './actions';
import { Loader2, CheckCircle2, Save } from 'lucide-react';

type UserData = {
    namaLengkap: string;
    email: string;
    noTelepon: string | null;
    alamatLengkap: string | null;
    role: string;
};

export default function ProfileFormClient({ user }: { user: UserData }) {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMessage('');

        const formData = new FormData(e.currentTarget);
        const res = await updateUserProfile(formData);

        if (res.error) {
            setErrorMsg(res.error);
        } else {
            setSuccessMessage('Profil berhasil diperbarui!');
            setTimeout(() => setSuccessMessage(''), 5000);
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nama Lengkap</label>
                    <input
                        type="text"
                        defaultValue={user.namaLengkap}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
                        title="Nama tidak dapat diubah"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                    <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
                        title="Email tidak dapat diubah"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Nomor Telepon</label>
                <input
                    type="tel"
                    name="noTelepon"
                    defaultValue={user.noTelepon || ''}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-zinc-100"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Alamat Pengiriman Default</label>
                <textarea
                    name="alamatLengkap"
                    defaultValue={user.alamatLengkap || ''}
                    rows={4}
                    placeholder="Masukkan alamat lengkap rumah/kantor Anda..."
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-zinc-100 resize-y"
                ></textarea>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                    {errorMsg}
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md group disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Simpan Perubahan
                </button>
            </div>
        </form>
    );
}
