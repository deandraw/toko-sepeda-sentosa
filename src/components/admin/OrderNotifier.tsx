'use client';

import { useEffect, useRef, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import Link from 'next/link';

export default function OrderNotifier() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // Initialize the audio object
        audioRef.current = new Audio('/notification.mp3');
        audioRef.current.volume = 0.8; // Set volume a bit lower in case it's loud

        // Setup initial timestamp if not exists
        if (!localStorage.getItem('lastOrderCheck')) {
            localStorage.setItem('lastOrderCheck', new Date().toISOString());
        }

        const checkNewOrders = async () => {
            const lastChecked = localStorage.getItem('lastOrderCheck');
            if (!lastChecked) return;

            // Generate the timestamp for THIS network request
            const nextCheckTime = new Date().toISOString();

            try {
                const res = await fetch(`/api/orders/check-new?since=${encodeURIComponent(lastChecked)}`);
                if (!res.ok) return;

                const data = await res.json();

                if (data.hasNewOrders && data.orders) {
                    // Play shiny notification sound
                    audioRef.current?.play().catch(e => console.warn('Audio auto-play blocked:', e));
                    localStorage.setItem('lastOrderCheck', nextCheckTime);

                    // Add to visual toast queue
                    setNotifications(prev => [...prev, ...data.orders]);

                    // Auto dismiss after 8 seconds
                    setTimeout(() => {
                        setNotifications(prev => prev.filter(n => !data.orders.find((o: any) => o.id === n.id)));
                    }, 8000);

                } else {
                    // Roll the timestamp forward even if no orders were found
                    localStorage.setItem('lastOrderCheck', nextCheckTime);
                }
            } catch (error) {
                console.error('Failed to poll for new orders:', error);
            }
        };

        // Poll every 10 seconds
        const intervalId = setInterval(checkNewOrders, 10000);

        return () => clearInterval(intervalId);
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
            {notifications.map((order) => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 border border-emerald-500/50 shadow-2xl rounded-2xl p-4 w-80 animate-in slide-in-from-top-4 slide-in-from-right-4 relative group">
                    <button
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== order.id))}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 animate-pulse border border-emerald-200 dark:border-emerald-500/30">
                            <BellRing className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50">Pesanan Baru Masuk!</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                Dari: <span className="font-medium text-zinc-700 dark:text-zinc-300">{order.user?.namaLengkap || 'Pelanggan'}</span>
                            </p>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                                Rp {order.totalHarga?.toLocaleString('id-ID')}
                            </p>
                            <Link href="/admin/orders" className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline mt-2 inline-block font-medium">
                                Lihat Pesanan &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
