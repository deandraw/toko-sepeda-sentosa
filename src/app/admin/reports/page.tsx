import prisma from '@/lib/prisma';
import { FileText, Calendar, DollarSign, Package } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ExportExcelButton from './ExportExcelButton';

export default async function ReportsPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            payments: true,
            orderDetails: {
                include: {
                    product: true,
                }
            }
        },
        orderBy: {
            tanggalPesanan: 'desc',
        },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalHarga, 0);
    const totalItemsSold = orders.reduce((sum, order) => {
        return sum + order.orderDetails.reduce((itemSum, detail) => itemSum + detail.kuantitas, 0);
    }, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-500" />
                        Laporan Penjualan
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Riwayat seluruh transaksi dan ringkasan pendapatan toko.
                    </p>
                </div>

                <div className="flex-shrink-0">
                    <ExportExcelButton data={orders} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
                        <DollarSign className="w-5 h-5" />
                        <h3 className="font-medium text-sm">Total Pendapatan</h3>
                    </div>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        Rp {totalRevenue.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">Dari {orders.length} transaksi</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
                        <Package className="w-5 h-5" />
                        <h3 className="font-medium text-sm">Barang Terjual</h3>
                    </div>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {totalItemsSold} <span className="text-lg font-medium text-zinc-500">Unit</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-2">
                        <Calendar className="w-5 h-5" />
                        <h3 className="font-medium text-sm">Update Terakhir</h3>
                    </div>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                        {orders.length > 0 ? format(new Date(orders[0].tanggalPesanan), 'dd MMM yyyy, HH:mm', { locale: id }) : '-'}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Riwayat Transaksi</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200 dark:bg-zinc-950/50 dark:text-zinc-400 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">ID Pesanan</th>
                                <th className="px-6 py-4 font-medium">Pelanggan</th>
                                <th className="px-6 py-4 font-medium">Item</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                                            <p>Belum ada transaksi.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {format(new Date(order.tanggalPesanan), 'dd/MM/yyyy HH:mm')}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {order.user.namaLengkap}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {order.orderDetails.length} jenis barang
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                                            Rp {order.totalHarga.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                                                {order.statusPesanan}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
