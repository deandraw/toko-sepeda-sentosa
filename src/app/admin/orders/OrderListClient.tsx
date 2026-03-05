'use client';

import { useState } from 'react';
import { updateOrderStatus } from './actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function OrderListClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);

        const res = await updateOrderStatus(orderId, newStatus);

        if (res.success) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statusPesanan: newStatus } : o));
        } else {
            alert(res.error || 'Gagal memperbarui status.');
        }

        setUpdatingId(null);
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">Belum ada pesanan masuk.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold w-1/4">Order ID & Waktu</th>
                            <th className="px-6 py-4 font-semibold w-1/4">Pelanggan</th>
                            <th className="px-6 py-4 font-semibold">Total Tagihan</th>
                            <th className="px-6 py-4 font-semibold text-center">Pembayaran</th>
                            <th className="px-6 py-4 font-semibold text-center w-48">Status Logistik</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-zinc-900 dark:text-zinc-100 text-xs mb-1">{order.id}</div>
                                    <div className="text-zinc-500 dark:text-zinc-400 text-xs">
                                        {new Date(order.tanggalPesanan).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="mt-2 text-xs text-zinc-400 max-w-[200px] truncate" title={order.orderDetails.map((d: any) => `${d.product.namaProduk} x${d.kuantitas}`).join(', ')}>
                                        {order.orderDetails.length} item(s)
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{order.user.namaLengkap}</div>
                                    <div className="text-zinc-500 dark:text-zinc-400 text-xs">{order.user.noTelepon || '-'}</div>
                                    <div className="text-zinc-400 text-xs max-w-[200px] truncate mt-1" title={order.alamatPengiriman}>{order.alamatPengiriman}</div>
                                    {order.catatan && (
                                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-200 text-xs rounded-lg whitespace-pre-wrap min-w-[200px]">
                                            <span className="font-bold flex items-center gap-1 mb-1">
                                                📝 Catatan Pembeli:
                                            </span>
                                            {order.catatan}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                                    Rp {order.totalHarga.toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                        {order.payments?.[0]?.metodePembayaran === 'transfer' ? 'Transfer' : 'COD'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <select
                                            value={order.statusPesanan}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={updatingId === order.id}
                                            className={`w-full appearance-none px-3 py-1.5 rounded-lg text-xs font-bold text-center border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 cursor-pointer
                                                ${order.statusPesanan === 'Menunggu Pembayaran' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                    order.statusPesanan === 'Diproses' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                                        order.statusPesanan === 'Dikirim' ? 'bg-purple-50 border-purple-200 text-purple-800' :
                                                            order.statusPesanan === 'Selesai' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                                                'bg-red-50 border-red-200 text-red-800'
                                                }`}
                                        >
                                            <option value="Menunggu Pembayaran">Menunggu Bayar</option>
                                            <option value="Diproses">Diproses</option>
                                            <option value="Dikirim">Dikirim</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Dibatalkan">Batalkan</option>
                                        </select>

                                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                                            {updatingId === order.id ? (
                                                <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                                            ) : (
                                                order.statusPesanan === 'Selesai' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
