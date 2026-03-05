import { Bell, Search, UserCircle } from 'lucide-react';

export default function Header() {
    return (
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

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-zinc-950"></span>
                </button>

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
    );
}
