'use client';

import { Bell, Search, UserCircle, BellRing, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Header() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial setup & Audio loading
    useEffect(() => {
        audioRef.current = new Audio('/notification.mp3');
        audioRef.current.volume = 0.9;

        if (!localStorage.getItem('lastOrderCheck')) {
            localStorage.setItem('lastOrderCheck', new Date().toISOString());
        }

        const storedHistory = localStorage.getItem('orderHistory');
        if (storedHistory) {
            try {
                setNotifications(JSON.parse(storedHistory));
            } catch (e) { }
        }

        const storedUnread = localStorage.getItem('unreadCount');
        if (storedUnread) {
            setUnreadCount(parseInt(storedUnread, 10));
        }
    }, []);

    // Polling Mechanism
    useEffect(() => {
        const checkNewOrders = async () => {
            const lastChecked = localStorage.getItem('lastOrderCheck');
            if (!lastChecked) return;

            const nextCheckTime = new Date().toISOString();

            try {
                const res = await fetch(`/api/orders/check-new?since=${encodeURIComponent(lastChecked)}`);
                if (!res.ok) return;

                const data = await res.json();

                if (data.hasNewOrders && data.orders?.length > 0) {
                    // Play Sound
                    audioRef.current?.play().catch(e => console.warn('Audio auto-play blocked:', e));
                    localStorage.setItem('lastOrderCheck', nextCheckTime);

                    setNotifications(prev => {
                        const newQueue = [...data.orders, ...prev].slice(0, 10); // Keep last 10
                        localStorage.setItem('orderHistory', JSON.stringify(newQueue));
                        return newQueue;
                    });

                    setUnreadCount(prev => {
                        const newCount = prev + data.orders.length;
                        localStorage.setItem('unreadCount', newCount.toString());
                        return newCount;
                    });

                    // Trigger Toast Animation by adding a temporary 'isNew' flag
                    const newToasts = data.orders.map((o: any) => ({ ...o, isToastVisible: true }));
                    setNotifications(prev => {
                        const combined = [...newToasts, ...prev.filter(p => !newToasts.find((n: any) => n.id === p.id))].slice(0, 10);
                        return combined;
                    });

                    // Auto dismiss toasts after 8 seconds
                    setTimeout(() => {
                        setNotifications(currentVals =>
                            currentVals.map(n =>
                                newToasts.find((nt: any) => nt.id === n.id) ? { ...n, isToastVisible: false } : n
                            )
                        );
                    }, 8000);

                } else {
                    localStorage.setItem('lastOrderCheck', nextCheckTime);
                }
            } catch (error) {
                console.error('Failed to poll for new orders:', error);
            }
        };

        const intervalId = setInterval(checkNewOrders, 10000);
        return () => clearInterval(intervalId);
    }, []);

    // Clicking outside closes the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setUnreadCount(0);
            localStorage.setItem('unreadCount', '0');
        }
    };

    const activeToasts = notifications.filter(n => n.isToastVisible);

    return (
        <>
            <header className="sticky top-0 z-40 h-16 w-full bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 flex items-center justify-between px-8 shadow-sm dark:bg-zinc-950/70 dark:border-zinc-800/50 transition-all print:hidden">
                <div className="flex items-center flex-1">
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari produk atau pesanan..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-100/50 border border-transparent focus:bg-white focus:border-blue-500 rounded-full text-sm outline-none transition-all dark:bg-zinc-900/50 dark:focus:bg-zinc-950 dark:focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 relative">
                    <div ref={dropdownRef}>
                        <button
                            onClick={handleBellClick}
                            className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-zinc-950">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-12 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Notifikasi</h3>
                                    <span className="text-xs text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-full">{notifications.length} Terakhir</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto w-full">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-500 flex flex-col items-center gap-2">
                                            <Bell className="w-8 h-8 opacity-20" />
                                            <p className="text-sm">Belum ada notifikasi.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {notifications.map((notif, idx) => (
                                                <Link href="/admin/orders" key={idx} onClick={() => setIsDropdownOpen(false)} className="p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex gap-4 items-start group">
                                                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                                        <Search className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-tight">
                                                            Pesanan Baru: {notif.user?.namaLengkap || 'Pelanggan'}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                                            Rp {notif.totalHarga?.toLocaleString('id-ID')}
                                                        </p>
                                                        <p className="text-[11px] text-zinc-400 mt-1">
                                                            {formatDistanceToNow(new Date(notif.tanggalPesanan), { addSuffix: true, locale: id })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href="/admin/orders"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block w-full p-4 text-center text-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 transition-colors"
                                >
                                    Lihat Semua Pesanan
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>

                    <button className="flex items-center gap-2 pl-2">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">Admin Toko</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Administrator</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                            <UserCircle className="h-6 w-6" />
                        </div>
                    </button>
                </div>
            </header>

            {/* Floating Toasts (Popups) */}
            {activeToasts.length > 0 && (
                <div className="fixed top-20 right-8 z-[9999] flex flex-col gap-3">
                    {activeToasts.map((order) => (
                        <div key={order.id} className="bg-white/95 backdrop-blur-md dark:bg-zinc-900/95 border border-blue-500/30 shadow-2xl rounded-2xl p-4 w-80 animate-in slide-in-from-right-8 fade-in duration-300 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                            <button
                                onClick={() => setNotifications(prev => prev.map(n => n.id === order.id ? { ...n, isToastVisible: false } : n))}
                                className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 z-10"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-500/20 shadow-inner">
                                    <BellRing className="w-6 h-6 animate-pulse" />
                                </div>
                                <div className="flex-1 pr-2">
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                        Pesanan Masuk!
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    </h4>
                                    <p className="text-[13px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                                        Dari pelanggan <span className="font-semibold text-zinc-800 dark:text-zinc-200">{order.user?.namaLengkap || 'Tamu'}</span>.
                                    </p>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            Rp {order.totalHarga?.toLocaleString('id-ID')}
                                        </p>
                                        <Link href="/admin/orders" className="text-[11px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-full font-medium hover:scale-105 transition-transform">
                                            Proses &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
