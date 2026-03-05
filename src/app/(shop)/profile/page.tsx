import { verifyUserSession } from '@/app/(auth)/verify';
import { redirect } from 'next/navigation';
import { logoutUser } from '@/app/(auth)/actions';
import { LogOut, UserCircle, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getUserProfile, getUserOrders } from './actions';
import ProfileFormClient from './ProfileFormClient';

export default async function ProfilePage() {
    const session = await verifyUserSession();

    if (!session.isAuthenticated) {
        redirect('/login');
    }

    const profileData = await getUserProfile();
    const ordersData = await getUserOrders();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-8">Profil Saya</h1>

            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
                <div className="p-8 sm:p-10 border-b border-zinc-200 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-12 h-12" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-zinc-900">{String(session.user?.namaLengkap)}</h2>
                        <p className="text-zinc-500 mt-1">{session.user?.role === 'customer' ? 'Pelanggan Sentosa Bike' : 'Administrator Toko'}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-auto flex gap-3">
                        {session.user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold transition-colors">
                                Ke Dashboard
                            </Link>
                        )}
                        <form action={logoutUser}>
                            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl font-semibold transition-colors">
                                <LogOut className="w-5 h-5" />
                                Keluar Akun
                            </button>
                        </form>
                    </div>
                </div>

                <div className="p-8 sm:p-10 border-b border-zinc-200">
                    <h3 className="text-xl font-bold text-zinc-900 mb-6">Informasi Kontak & Pengiriman</h3>
                    {profileData.success && profileData.user ? (
                        <ProfileFormClient user={profileData.user} />
                    ) : (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                            {profileData.error || 'Gagal memuat data profil.'}
                        </div>
                    )}
                </div>

                <div className="p-8 sm:p-10 bg-zinc-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-zinc-200/50 rounded-lg text-zinc-700">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900">Riwayat Pesanan</h3>
                    </div>

                    {!ordersData.orders || ordersData.orders.length === 0 ? (
                        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
                            <p className="text-zinc-500">Anda belum memiliki riwayat pesanan.</p>
                            <Link href="/#katalog" className="inline-block mt-4 text-blue-600 hover:underline font-medium">
                                Mulai Belanja Hari Ini
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {ordersData.orders.map((order: any) => (
                                <div key={order.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-100 pb-4 mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-500">
                                                {new Date(order.tanggalPesanan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                                            </p>
                                            <p className="text-xs font-mono mt-1 text-zinc-400">ID: {order.id}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold w-fit text-center ${order.statusPesanan === 'Menunggu Pembayaran' ? 'bg-yellow-100 text-yellow-800' :
                                                order.statusPesanan === 'Diproses' ? 'bg-blue-100 text-blue-800' :
                                                    order.statusPesanan === 'Dikirim' ? 'bg-purple-100 text-purple-800' :
                                                        order.statusPesanan === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                                                            'bg-red-100 text-red-800'
                                            }`}>
                                            {order.statusPesanan}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {order.orderDetails.map((detail: any) => (
                                            <div key={detail.id} className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-700 font-medium">
                                                    {detail.product.namaProduk} <span className="text-zinc-400 ml-1">x{detail.kuantitas}</span>
                                                </span>
                                                <span className="text-zinc-900 font-medium">
                                                    Rp {(detail.hargaSatuan * detail.kuantitas).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                                        <div>
                                            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wide">Metode Pembayaran</span>
                                            <span className="text-sm font-bold text-zinc-700">
                                                {order.payments?.[0]?.metodePembayaran === 'transfer' ? 'Transfer Bank' : 'Cash On Delivery (COD)'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wide">Total Tagihan</span>
                                            <span className="text-lg font-extrabold text-blue-600">
                                                Rp {order.totalHarga.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
