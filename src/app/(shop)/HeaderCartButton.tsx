'use client';

import { useCart } from '@/components/shop/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeaderCartButton() {
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch between server-rendered HTML and client localStorage
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Link href="/cart" className="relative p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors text-zinc-700 group">
            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex min-h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in-50 duration-300">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </Link>
    );
}
