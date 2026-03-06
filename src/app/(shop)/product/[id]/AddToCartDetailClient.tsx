'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/components/shop/CartContext';
import { useRouter } from 'next/navigation';

interface ProductInfo {
    id: string;
    namaProduk: string;
    harga: number;
    stok: number;
    kuantitas: number;
    gambarUrl: string | null;
}

export default function AddToCartDetailClient({ product }: { product: ProductInfo }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handlePlus = () => {
        if (quantity < product.stok) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (product.stok === 0) return;

        setIsAdding(true);
        addToCart({
            id: product.id,
            namaProduk: product.namaProduk,
            harga: product.harga,
            kuantitas: quantity,
            stok: product.stok,
            gambarUrl: product.gambarUrl,
        });

        setTimeout(() => {
            setIsAdding(false);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }, 500); // UI feedback delay
    };

    const handleBuyNow = () => {
        if (product.stok === 0) return;

        setIsBuyingNow(true);
        addToCart({
            id: product.id,
            namaProduk: product.namaProduk,
            harga: product.harga,
            kuantitas: quantity,
            stok: product.stok,
            gambarUrl: product.gambarUrl,
        });

        // Immediately redirect to cart
        router.push('/cart');
    };

    const canBuy = product.stok > 0;

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border-2 border-zinc-200 rounded-xl overflow-hidden bg-white w-full sm:w-[140px] h-12">
                <button
                    onClick={handleMinus}
                    disabled={!canBuy || quantity <= 1}
                    className="w-12 h-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 h-full flex items-center justify-center font-bold text-zinc-900 border-x border-zinc-200">
                    {quantity}
                </div>
                <button
                    onClick={handlePlus}
                    disabled={!canBuy || quantity >= product.stok}
                    className="w-12 h-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Buttons Group */}
            <div className="flex flex-col sm:flex-row w-full flex-1 gap-4">
                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!canBuy || isAdding || success || isBuyingNow}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl font-bold tracking-wide transition-all shadow-sm ${!canBuy
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : success
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                            : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5'
                        }`}
                >
                    {success ? (
                        <>
                            <Check className="w-5 h-5" /> Ditambahkan
                        </>
                    ) : isAdding ? (
                        'Menambahkan...'
                    ) : !canBuy ? (
                        'Stok Habis'
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5" /> Keranjang
                        </>
                    )}
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={handleBuyNow}
                    disabled={!canBuy || isAdding || success || isBuyingNow}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl font-bold tracking-wide transition-all shadow-sm ${!canBuy
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5'
                        }`}
                >
                    {isBuyingNow ? 'Memproses...' : !canBuy ? 'Stok Habis' : 'Beli Sekarang'}
                </button>
            </div>
        </div>
    );
}
