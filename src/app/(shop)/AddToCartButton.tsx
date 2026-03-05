'use client';

import { useCart, ShopCartItem } from '@/components/shop/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: ShopCartItem }) {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (product.stok <= 0) {
        return (
            <button
                disabled
                className="w-10 h-10 bg-zinc-300 text-white rounded-full flex items-center justify-center shadow-md cursor-not-allowed"
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${added ? 'bg-emerald-500 text-white scale-110' : 'bg-zinc-900 hover:bg-blue-600 text-white hover:scale-105'
                }`}
        >
            {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
        </button>
    );
}
