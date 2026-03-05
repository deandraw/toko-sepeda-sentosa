'use client';

import { Save, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { createProduct } from './actions';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    namaKategori: string;
}

export default function ProductFormClient({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mainFile, setMainFile] = useState<File | null>(null);
    const [gallery, setGallery] = useState<{ id: string, url: string, file: File }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setPreviewUrl(null);
        setMainFile(null);
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newGallery = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            url: URL.createObjectURL(file),
            file
        }));
        setGallery(prev => [...prev, ...newGallery]);
        // Reset input value to allow selecting the same file again if needed
        if (e.target) e.target.value = '';
    };

    const handleRemoveGalleryImage = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setGallery(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Append the strictly tracked files
            if (mainFile) {
                formData.set('file-upload', mainFile);
            }
            // Append gallery files
            gallery.forEach(item => {
                formData.append('gallery-upload', item.file);
            });

            await createProduct(formData);

            // Using a server action with redirect might throw an internal error caught by Next.js, 
            // but just in case we also handle router pushing if needed. The Server Action already redirects.
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            // setIsSubmitting(false) // Not needed if redirecting
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        Informasi Utama
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="namaProduk" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Nama Barang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="namaProduk"
                                name="namaProduk"
                                required
                                placeholder="Misal: Sepeda Polygon Cascade"
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="idKategori" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="idKategori"
                                name="idKategori"
                                required
                                defaultValue=""
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100 appearance-none"
                            >
                                <option value="" disabled>Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.namaKategori}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="harga" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Harga (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="harga"
                                name="harga"
                                required
                                min="0"
                                placeholder="0"
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stok" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Stok Awal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="stok"
                                name="stok"
                                required
                                min="0"
                                placeholder="0"
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="deskripsiProduk" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Spesifikasi / Deskripsi
                        </label>
                        <textarea
                            id="deskripsiProduk"
                            name="deskripsiProduk"
                            rows={4}
                            placeholder="Tuliskan detail spesifikasi, warna, tipe transmisi, dll."
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y dark:text-zinc-100"
                        ></textarea>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        Media (Foto Produk)
                    </h3>

                    <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-zinc-300 px-6 py-12 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors relative group">
                        {/* THE FIX: Invisible but fully mounted input field so it gets submitted with the form */}
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {previewUrl ? (
                            <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden shadow-sm" onClick={() => document.getElementById('file-upload')?.click()}>
                                <Image src={previewUrl} alt="Preview" fill className="object-cover cursor-pointer" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(e); }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/80 hover:bg-red-500 text-zinc-700 dark:text-zinc-300 hover:text-white rounded-full transition-colors backdrop-blur-sm shadow-sm z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center" onClick={() => document.getElementById('file-upload')?.click()}>
                                <div className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:text-blue-500 transition-all cursor-pointer">
                                    <UploadCloud className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <div className="mt-4 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400 justify-center">
                                    <span className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                        Upload foto
                                    </span>
                                    <p className="pl-1">atau drag & drop ke sini</p>
                                </div>
                                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500 mt-2">
                                    PNG, JPG, WEBP maks 5MB
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Multiple Images Upload */}
                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Galeri Foto Tambahan</h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {gallery.map((item) => (
                                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700">
                                    <Image src={item.url} alt="Gallery Preview" fill className="object-cover" />
                                    <button
                                        onClick={(e) => handleRemoveGalleryImage(e, item.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/80 hover:bg-red-500 text-zinc-700 dark:text-zinc-300 hover:text-white rounded-full transition-colors backdrop-blur-sm shadow-sm z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <div
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                            >
                                <input
                                    id="gallery-upload"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleGalleryChange}
                                />
                                <UploadCloud className="h-6 w-6 text-zinc-400 group-hover:text-blue-500 transition-colors mb-2" />
                                <span className="text-xs font-medium text-zinc-500 group-hover:text-blue-600 transition-colors">Tambah Foto</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                    <Link
                        href="/admin/products"
                        className="px-5 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800 shadow-sm"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Barang'}
                    </button>
                </div>
            </form>
        </div>
    );
}
