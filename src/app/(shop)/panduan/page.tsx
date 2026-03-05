import { ShoppingBag, UserCircle, MapPin, CheckCircle, Smartphone, Truck, Info, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Panduan Belanja - Toko Sepeda Sentosa',
    description: 'Langkah-langkah berbelanja mulai dari memilih produk, checkout, hingga konfirmasi ke Admin.',
};

export default function PanduanPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-lg mb-6">
                    <Info className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">Panduan Belanja</h1>
                <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                    Ketahui langkah-langkah mudah, aman, dan cepat dalam berbelanja sepeda dan suku cadang impian Anda di Toko Sepeda Sentosa.
                </p>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 sm:before:ml-[3.5rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">

                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <span className="font-bold text-lg">1</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <UserCircle className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-zinc-900">Buat Akun & Login</h3>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                            Mulai dengan mendaftarkan akun baru atau masuk ke akun Anda. Anda wajib masuk (login) terlebih dahulu agar sistem dapat mengenali pesanan dan menyimpan riwayat belanja Anda.
                        </p>
                        <Link href="/login" className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">Daftar / Masuk Sekarang &rarr;</Link>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <span className="font-bold text-lg">2</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-zinc-900">Lengkapi Alamat</h3>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                            Buka halaman <strong className="font-semibold">Profil</strong> Anda. Untuk memastikan barang sampai tujuan dengan benar, pastikan Anda telah mengisi <strong className="font-semibold text-red-600">Alamat Lengkap Pengiriman</strong> dan <strong className="font-semibold">No. Telepon Aktif</strong> sebelum memesan.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <span className="font-bold text-lg">3</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-zinc-900">Pilih Produk & Checkout</h3>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                            Telusuri Katalog Sepeda maupun Aksesoris. Klik ikon keranjang pada produk yang diinginkan. Masuk ke halaman Keranjang, periksa kembali pesanan Anda, pilih <strong className="font-semibold">Metode Pembayaran (Transfer Bank atau COD)</strong>, lalu klik "Selesaikan Transaksi".
                        </p>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <span className="font-bold text-lg">4</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Smartphone className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-zinc-900">Konfirmasi via WhatsApp</h3>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                            Setelah berhasil melakukan Checkout, Anda akan diarahkan untuk menekan tombol yang secara otomatis membuat draf pesan berisi rincian pesanan ke <strong className="font-semibold text-emerald-600">WhatsApp Admin Sentosa</strong>. Jika memilih Transfer, kirimkan juga foto bukti transfernya di sini agar segera diproses!
                        </p>
                    </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group-hover:border-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="w-6 h-6 text-emerald-600" />
                            <h3 className="text-xl font-bold text-zinc-900">Barang Dikirim</h3>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                            Tim kami akan segera memverifikasi pesanan Anda dan memperbarui status pesanan menjadi <strong className="font-semibold text-blue-600">"Diproses"</strong> hingga <strong className="font-semibold text-purple-600">"Dikirim"</strong>. Pantau terus status lacak kurir pada menu <strong className="font-semibold">Profil &gt; Riwayat Pesanan</strong> secara langsung. Duduk manis dan barang segera tiba!
                        </p>

                        <div className="mt-6 pt-6 border-t border-zinc-100 flex items-start gap-3 text-sm text-zinc-500 bg-zinc-50 p-4 rounded-xl">
                            <CreditCard className="w-5 h-5 flex-shrink-0 text-zinc-400" />
                            <p>Bagi pembeli dengan metode <strong className="font-semibold text-zinc-700">Cash On Delivery (COD)</strong>, siapkan uang tunai yang pas untuk diberikan kepada Kurir saat sepeda sampai di rumah Anda.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-20 text-center">
                <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Mulai Belanja Sekarang
                </Link>
            </div>

        </div>
    );
}
