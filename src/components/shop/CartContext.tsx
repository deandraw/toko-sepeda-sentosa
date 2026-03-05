'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ShopCartItem = {
    id: string;
    namaProduk: string;
    harga: number;
    kuantitas: number;
    stok: number;
    gambarUrl: string | null;
};

interface CartContextType {
    cart: ShopCartItem[];
    addToCart: (item: ShopCartItem) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<ShopCartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('sentosa_shop_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever cart changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('sentosa_shop_cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const addToCart = (product: ShopCartItem) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                if (existing.kuantitas >= product.stok) {
                    alert('Maaf, stok barang tidak mencukupi.');
                    return prev;
                }
                return prev.map((item) =>
                    item.id === product.id ? { ...item, kuantitas: item.kuantitas + 1 } : item
                );
            }
            if (product.stok <= 0) {
                alert('Maaf, barang ini sedang habis.');
                return prev;
            }
            return [...prev, { ...product, kuantitas: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQ = item.kuantitas + delta;
                    if (newQ <= 0) return item; // Handled by remove
                    if (newQ > item.stok) return item;
                    return { ...item, kuantitas: newQ };
                }
                return item;
            })
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + item.harga * item.kuantitas, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.kuantitas, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
