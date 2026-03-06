'use client';

import { useCart, ShopCartItem } from '@/components/shop/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }: { product: ShopCartItem }) {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(product);
        router.push('/cart');
    };

    if (product.stok <= 0) {
        return (
            <div className="flex gap-2">
                <button
                    disabled
                    className="h-10 px-4 bg-zinc-100 text-zinc-400 rounded-xl text-sm font-bold cursor-not-allowed flex items-center shadow-sm border border-zinc-200"
                >
                    Stok Habis
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={handleBuyNow}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-all hover:shadow-blue-600/30 hover:-translate-y-0.5"
            >
                Beli
            </button>
            <button
                onClick={handleAdd}
                className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${added ? 'bg-emerald-500 text-white border border-emerald-500' : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5'
                    }`}
            >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
        </div>
    );
}
