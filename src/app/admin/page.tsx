import { Package, TrendingUp, Users, DollarSign } from 'lucide-react';
import prisma from '@/lib/prisma';
import SalesChartClient from './SalesChartClient';
import { startOfDay, subDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default async function Home() {
  // 1. Fetch Basic Stats
  const totalProducts = await prisma.product.count();
  const activeCustomers = await prisma.user.count({
    where: { role: 'KASIR' } // Assuming 'KASIR' represents the active users/staff
  });

  const today = startOfDay(new Date());

  const todayOrders = await prisma.order.findMany({
    where: {
      tanggalPesanan: {
        gte: today
      },
      statusPesanan: 'Selesai'
    }
  });

  const newOrdersCount = todayOrders.length;
  // Calculate total historical revenue
  const allCompletedOrders = await prisma.order.findMany({
    where: { statusPesanan: 'Selesai' }
  });

  const totalRevenue = allCompletedOrders.reduce((sum, order) => sum + order.totalHarga, 0);

  // 2. Fetch Chart Data (Last 7 Days)
  const sevenDaysAgo = subDays(today, 6);

  const recentOrders = await prisma.order.findMany({
    where: {
      tanggalPesanan: {
        gte: sevenDaysAgo
      },
      statusPesanan: 'Selesai'
    },
    orderBy: {
      tanggalPesanan: 'asc'
    }
  });

  // Group by day
  const dailyTotals = Array.from({ length: 7 }).map((_, i) => {
    const day = subDays(today, 6 - i);
    const dayName = format(day, 'EEEE', { locale: id });
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const dayOrders = recentOrders.filter(o =>
      o.tanggalPesanan >= dayStart && o.tanggalPesanan < dayEnd
    );

    return {
      nama: dayName,
      total: dayOrders.reduce((sum, o) => sum + o.totalHarga, 0)
    };
  });

  // 3. Fetch Low Stock Products
  const lowStockProducts = await prisma.product.findMany({
    where: { stok: { lte: 5 } },
    take: 4,
    orderBy: { stok: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Ringkasan aktivitas toko dan inventaris Sentosa POS hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Pendapatan</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Produk</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +4.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pesanan Hari Ini</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{newOrdersCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pengguna Sistem</p>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{activeCustomers}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Grafik Penjualan Terakhir</h3>
            <Link href="/admin/reports" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">Lihat Detail</Link>
          </div>
          <div className="h-64 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-2">
            <SalesChartClient data={dailyTotals} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6">Stok Menipis</h3>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-zinc-500">Semua stok produk terpantau aman.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                    <Package className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{product.namaProduk}</p>
                    <p className="text-xs text-red-500 dark:text-red-400">Tersisa {product.stok} unit</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Temporary icon to satisfy JSX requirements
function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
