'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { updateAdminSettings } from './actions';
import { Settings, Save, Key, User as UserIcon, MapPin, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsClient({ admin }: { admin: User }) {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        const formData = new FormData(e.currentTarget);

        // Validate passwords if user is trying to change it
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            setMessage({ text: 'Mohon isi kedua kolom password jika ingin mengubahnya.', type: 'error' });
            setIsSaving(false);
            return;
        }

        const res = await updateAdminSettings(formData);

        if (res.error) {
            setMessage({ text: res.error, type: 'error' });
        } else {
            setMessage({ text: 'Pengaturan berhasil diperbarui!', type: 'success' });
            router.refresh(); // Give it a shiny reload wrapper for UI update

            // clear passwords
            (e.currentTarget as HTMLFormElement).reset();
        }

        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-500" />
                    Pengaturan Sistem
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Kelola profil, informasi toko Sentosa, dan keamanan sandi Anda.
                </p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-zinc-500" />
                        Informasi Dasar
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Email (Login ID)
                            </label>
                            <input
                                type="email"
                                value={admin.email}
                                disabled
                                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-zinc-500">Email tidak dapat diubah.</p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="namaLengkap" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Nama Tampilan Admin
                            </label>
                            <input
                                type="text"
                                id="namaLengkap"
                                name="namaLengkap"
                                defaultValue={admin.namaLengkap}
                                required
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-zinc-500" />
                        Kontak & Alamat Toko
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="noTelepon" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Nomor Telepon (WA CS)
                            </label>
                            <input
                                type="text"
                                id="noTelepon"
                                name="noTelepon"
                                defaultValue={admin.noTelepon || ''}
                                placeholder="Contoh: 081234567890"
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="alamatLengkap" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Alamat Lengkap Operasional Toko
                            </label>
                            <textarea
                                id="alamatLengkap"
                                name="alamatLengkap"
                                defaultValue={admin.alamatLengkap || ''}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100 resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
                        <Key className="w-5 h-5 text-zinc-500" />
                        Ubah Password
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4">Biarkan kosong jika tidak ingin mengubah password.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="currentPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                minLength={6}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-sm shadow-blue-500/20 transition-all group"
                    >
                        {isSaving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
