'use client';

import { Save, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { updateProduct } from './actions';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    namaKategori: string;
}

interface Product {
    id: string;
    namaProduk: string;
    idKategori: string;
    harga: number;
    stok: number;
    deskripsiProduk: string | null;
    gambarUrl: string | null;
    images?: { id: string, url: string }[];
}

export default function EditProductFormClient({
    product,
    categories
}: {
    product: Product,
    categories: Category[]
}) {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        product.gambarUrl && product.gambarUrl !== '/placeholder-image.jpg' ? product.gambarUrl : null
    );
    const [mainFile, setMainFile] = useState<File | null>(null);

    // Gallery state
    const [existingGallery, setExistingGallery] = useState<{ id: string, url: string }[]>(product.images || []);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
    const [newGallery, setNewGallery] = useState<{ id: string, url: string, file: File }[]>([]);
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
        // We set a hidden input later to indicate deletion if no file is provided
    };

    const handleNewGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const added = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            url: URL.createObjectURL(file),
            file
        }));
        setNewGallery(prev => [...prev, ...added]);
        if (e.target) e.target.value = '';
    };

    const handleRemoveExistingGalleryImage = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setExistingGallery(prev => prev.filter(img => img.id !== id));
        setDeletedImageIds(prev => [...prev, id]);
    };

    const handleRemoveNewGalleryImage = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setNewGallery(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            if (mainFile) {
                formData.set('file-upload', mainFile);
            } else if (!previewUrl) {
                formData.set('remove-main-image', 'true');
            }

            formData.set('deleted-images', JSON.stringify(deletedImageIds));

            newGallery.forEach(item => {
                formData.append('gallery-upload', item.file);
            });

            await updateProduct(formData);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            // setIsSubmitting(false)
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Hidden ID field for update logic */}
                <input type="hidden" name="id" value={product.id} />

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
                                defaultValue={product.namaProduk}
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
                                defaultValue={product.idKategori}
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
                                defaultValue={product.harga}
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
                                defaultValue={product.stok}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="deskripsiProduk" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Deskripsi Produk
                        </label>
                        <textarea
                            id="deskripsiProduk"
                            name="deskripsiProduk"
                            rows={3}
                            defaultValue={product.deskripsiProduk || ''}
                            placeholder="Tuliskan deskripsi singkat mengenai produk ini."
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y dark:text-zinc-100"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="warna" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Pilihan Warna <span className="text-zinc-400 font-normal">(opsional)</span>
                            </label>
                            <input
                                type="text"
                                id="warna"
                                name="warna"
                                defaultValue={(product as any).warna || ''}
                                placeholder="Cth: Merah, Hitam Doff, Putih"
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all dark:text-zinc-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="spesifikasi" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Spesifikasi Utama <span className="text-zinc-400 font-normal">(opsional)</span>
                            </label>
                            <textarea
                                id="spesifikasi"
                                name="spesifikasi"
                                rows={4}
                                defaultValue={(product as any).spesifikasi || ''}
                                placeholder="Gunakan format per baris:&#10;Frame: ALX Alloy&#10;Fork: Suntour XCM&#10;Groupset: Shimano Altus"
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-y dark:text-zinc-100"
                            ></textarea>
                        </div>
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
                                        Upload foto baru
                                    </span>
                                    <p className="pl-1">atau drag & drop ke sini</p>
                                </div>
                                <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-500 mt-2">
                                    PNG, JPG, WEBP maks 5MB
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Multiple Images Upload & Management */}
                    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Galeri Foto Tambahan</h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Existing Images */}
                            {existingGallery.map((item) => (
                                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700">
                                    <Image src={item.url} alt="Existing Gallery Image" fill className="object-cover" />
                                    <button
                                        onClick={(e) => handleRemoveExistingGalleryImage(e, item.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/80 hover:bg-red-500 text-zinc-700 dark:text-zinc-300 hover:text-white rounded-full transition-colors backdrop-blur-sm shadow-sm z-10"
                                        title="Hapus foto asli"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* New Images */}
                            {newGallery.map((item) => (
                                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-blue-200 dark:border-blue-900/50 relative">
                                    <Image src={item.url} alt="New Gallery Preview" fill className="object-cover" />
                                    <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-500 rounded-xl pointer-events-none z-0"></div>
                                    <button
                                        onClick={(e) => handleRemoveNewGalleryImage(e, item.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/80 hover:bg-red-500 text-zinc-700 dark:text-zinc-300 hover:text-white rounded-full transition-colors backdrop-blur-sm shadow-sm z-10"
                                        title="Batal tambah foto ini"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm">Baru</span>
                                </div>
                            ))}

                            {/* Upload Button */}
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
                                    onChange={handleNewGalleryChange}
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
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
