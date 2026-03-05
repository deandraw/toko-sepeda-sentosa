import { MapPin, Phone, Mail, Clock, ShieldCheck, Wrench, Shield } from 'lucide-react';

export const metadata = {
    title: "Profil Perusahaan | Toko Sepeda Sentosa",
    description: "Kenali lebih dekat Toko Sepeda Sentosa, pusat penjualan sepeda dan aksesoris terlengkap di Majalaya, Bandung.",
};

export default function TentangKamiPage() {
    return (
        <div className="bg-zinc-50 min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-6">
                        Toko Sepeda <span className="text-blue-600">Sentosa</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-zinc-600 leading-relaxed">
                        Hadir sejak [Tahun Berdiri], kami berdedikasi menjadi mitra terbaik bagi para pesepeda.
                        Mulai dari hobi, olahraga, hingga mobilitas harian, Toko Sepeda Sentosa menyediakan solusi
                        berkualitas tinggi dengan pelayanan purna jual yang terpercaya.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Info & Address */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <MapPin className="text-blue-600" /> Lokasi Kami
                            </h2>
                            <address className="not-italic text-zinc-600 space-y-4">
                                <div>
                                    <p className="font-semibold text-zinc-900">Jalan Pasar Baru No. 91B</p>
                                    <p>Majakerta, Kecamatan Majalaya</p>
                                    <p>Kabupaten Bandung, Jawa Barat</p>
                                    <p>Kode Pos 40382</p>
                                </div>
                                <hr className="border-zinc-100" />
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-zinc-400" />
                                        <span>Buka Setiap Hari: 08.00 - 17.00 WIB</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-zinc-400" />
                                        <a href="#" className="hover:text-blue-600 transition-colors">+62 812-3456-7890</a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-zinc-400" />
                                        <a href="mailto:info@sentosabike.com" className="hover:text-blue-600 transition-colors">info@sentosabike.com</a>
                                    </div>
                                </div>
                            </address>
                        </section>
                    </div>

                    {/* Right Column: Profile details */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Visi & Misi</h2>
                            <p className="text-zinc-600 leading-relaxed mb-6">
                                Visi kami adalah menginspirasi gaya hidup sehat dan ramah lingkungan melalui bersepeda.
                                Sedangkan misi kami berkomitmen memberikan pengalaman berbelanja perlengkapan sepeda paling memuaskan
                                di Bandung Selatan dengan menyediakan produk orisinil, harga kompetitif, serta edukasi bersepeda yang positif.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 border-t border-zinc-100 pt-10">
                                <div className="text-center">
                                    <div className="mx-auto w-14 h-14 bg-blue-50 flex items-center justify-center rounded-2xl mb-4 text-blue-600">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 mb-2">Produk Asli</h3>
                                    <p className="text-sm text-zinc-500">100% Produk yang kami jual memiliki garansi resmi dari distributor utama.</p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto w-14 h-14 bg-indigo-50 flex items-center justify-center rounded-2xl mb-4 text-indigo-600">
                                        <Wrench className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 mb-2">Servis Handal</h3>
                                    <p className="text-sm text-zinc-500">Dilengkapi mekanik berpengalaman untuk perakitan dan perbaikan sepeda.</p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto w-14 h-14 bg-emerald-50 flex items-center justify-center rounded-2xl mb-4 text-emerald-600">
                                        <Shield className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-zinc-900 mb-2">Belanja Aman</h3>
                                    <p className="text-sm text-zinc-500">Sistem transaksi yang transparan dan aman demi kepuasan pelanggan.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}
