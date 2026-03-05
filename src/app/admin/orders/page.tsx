import { getAllOrders } from './actions';
import OrderListClient from './OrderListClient';
import { PackageOpen } from 'lucide-react';
import Link from 'next/link';

export default async function AdminOrdersPage() {
    const res = await getAllOrders();

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Pesanan Online</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Pantau dan perbarui status pengiriman pelanggan Anda secara *real-time*.
                    </p>
                </div>
            </div>

            {res.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl">
                    <p className="font-semibold text-center">{res.error}</p>
                </div>
            ) : (
                <OrderListClient initialOrders={res.orders || []} />
            )}
        </div>
    );
}
