import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, LogOut, Globe } from 'lucide-react';
import { logoutUser } from '@/app/(auth)/actions';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pesanan Online', href: '/admin/orders', icon: Globe },
    { name: 'Inventaris', href: '/admin/products', icon: Package },
    { name: 'Kasir (POS)', href: '/admin/pos', icon: ShoppingCart },
    { name: 'Laporan', href: '/admin/reports', icon: FileText },
];

export default function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-zinc-200/50 flex flex-col shadow-sm dark:bg-zinc-950/80 dark:border-zinc-800/50 transition-all duration-300 print:hidden">
            <div className="flex h-16 items-center px-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                    <span>Sentosa POS</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                    Main Menu
                </p>
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:text-blue-600 hover:bg-blue-50/50 dark:text-zinc-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all group"
                    >
                        <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all group"
                >
                    <Settings className="h-5 w-5 transition-transform group-hover:rotate-45" />
                    Pengaturan
                </Link>
                <form action={logoutUser}>
                    <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all group">
                        <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        Keluar
                    </button>
                </form>
            </div>
        </aside >
    );
}
