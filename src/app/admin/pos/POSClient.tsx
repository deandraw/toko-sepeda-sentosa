'use client';

import { useState } from 'react';
import { Product, Category } from '../../../../src/generated/prisma';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Printer, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';

type ProductWithCategory = Product & { category: Category };

interface CartItem {
    product: ProductWithCategory;
    quantity: number;
}

interface ReceiptData {
    orderId: string;
    items: CartItem[];
    total: number;
    subTotal: number;
    tax: number;
    amountPaid: number;
    change: number;
    paymentMethod: string;
    address?: string;
    date: Date;
}

export default function POSClient({
    products,
    processCheckout
}: {
    products: ProductWithCategory[],
    processCheckout: (cartData: { productId: string; quantity: number; price: number }[], totalAmount: number, paymentMethod: string, address?: string) => Promise<{ success: boolean; error?: string; orderId?: string }>
}) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
    const [amountPaid, setAmountPaid] = useState<number>(0);
    const [address, setAddress] = useState<string>('');
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredProducts = products.filter(p =>
        p.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.namaKategori.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (product: ProductWithCategory) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stok) return prev; // Don't exceed stock
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            if (product.stok <= 0) return prev; // Can't add out of stock
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQuantity = item.quantity + delta;
                if (newQuantity <= 0) return item;
                if (newQuantity > item.product.stok) return item;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = cart.reduce((sum, item) => sum + (item.product.harga * item.quantity), 0);
    const tax = subTotal * 0.11; // 11% PPN as example, optional
    const total = subTotal + tax;
    const change = Math.max(0, amountPaid - total);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        try {
            const cartData = cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.harga
            }));

            const result = await processCheckout(cartData, total, paymentMethod, address);

            if (result && result.success && result.orderId) {
                setReceiptData({
                    orderId: result.orderId,
                    items: [...cart],
                    total,
                    subTotal,
                    tax,
                    amountPaid: paymentMethod === 'cash' ? amountPaid : total,
                    change: paymentMethod === 'cash' ? change : 0,
                    paymentMethod,
                    address,
                    date: new Date()
                });

                setCart([]); // Reset cart on successful checkout
                setAmountPaid(0); // Reset amount paid on successful checkout
                setAddress(''); // Reset address
                // We don't redirect here anymore, we show the receipt popup
            } else {
                alert(result?.error || 'Gagal memproses pembayaran ke server.');
            }
        } catch (error: any) {
            console.error(error);
            alert('Terjadi kesalahan saat checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (receiptData) {
        return (
            <div className="fixed inset-0 z-50 bg-zinc-900/40 flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:block print:bg-white print:static print:inset-auto">
                <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl overflow-hidden print:shadow-none print:max-w-[300px] print:mx-auto print:rounded-none print:font-mono">

                    {/* Receipt Header */}
                    <div className="bg-blue-600 p-6 flex flex-col items-center text-white print:bg-transparent print:text-black print:p-0 print:pb-4 print:border-b print:border-dashed print:border-black print:mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 print:hidden">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight print:text-lg print:uppercase print:text-center">Toko Sepeda Sentosa</h2>
                        <p className="text-blue-100 text-xs mt-1 print:text-black print:text-[10px] print:text-center print:leading-tight">Jl. Pahlawan No. 123<br className="hidden print:block" /> Kota Sentosa</p>
                    </div>

                    {/* Receipt Body */}
                    <div className="px-6 py-4 print:p-0">
                        <div className="flex justify-between text-xs text-zinc-500 mb-4 pb-4 border-b border-zinc-100 border-dashed print:text-black print:border-black print:mb-2 print:pb-2 print:text-[10px]">
                            <div>
                                <p>No: {receiptData.orderId.substring(0, 8).toUpperCase()}</p>
                                <p>Tipe: {receiptData.paymentMethod === 'cash' ? 'Tunai' : 'Transfer'}</p>
                            </div>
                            <div className="text-right">
                                <p>{receiptData.date.toLocaleDateString('id-ID')}</p>
                                <p>{receiptData.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 mb-4 pb-4 border-b border-zinc-100 border-dashed print:border-black print:mb-2 print:pb-2 print:space-y-1">
                            {receiptData.items.map(item => (
                                <div key={item.product.id} className="text-sm print:text-xs">
                                    <p className="font-semibold text-zinc-800 print:text-black print:font-medium">{item.product.namaProduk}</p>
                                    <div className="flex justify-between text-zinc-500 print:text-black print:text-[10px]">
                                        <p>{item.quantity} x {item.product.harga.toLocaleString('id-ID')}</p>
                                        <p className="font-medium text-zinc-900 print:text-black">
                                            {(item.quantity * item.product.harga).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-1 text-sm pb-4 border-b border-zinc-100 border-dashed print:border-black print:text-xs print:pb-2 print:mb-2">
                            <div className="flex justify-between text-zinc-600 print:text-black">
                                <span>Subtotal</span>
                                <span>{receiptData.subTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-zinc-600 print:text-black">
                                <span>PPN (11%)</span>
                                <span>{receiptData.tax.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-zinc-100 print:text-black print:border-black print:border-dashed print:text-base print:mt-1 print:pt-1">
                                <span>Total</span>
                                <span>Rp {receiptData.total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-1 text-sm pt-4 print:text-xs print:pt-0">
                            <div className="flex justify-between text-zinc-600 print:text-black">
                                <span>Dibayar</span>
                                <span>{receiptData.amountPaid.toLocaleString('id-ID')}</span>
                            </div>
                            {receiptData.paymentMethod === 'cash' && (
                                <div className="flex justify-between font-semibold text-zinc-800 print:text-black">
                                    <span>Kembali</span>
                                    <span>{receiptData.change.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                        </div>

                        {receiptData.address && receiptData.address.trim() !== '' && (
                            <div className="mt-4 pt-4 border-t border-zinc-100 border-dashed text-xs text-zinc-600 print:text-black print:border-black print:mt-2 print:pt-2 print:text-[10px]">
                                <p className="font-semibold mb-1">Alamat Pengiriman:</p>
                                <p>{receiptData.address}</p>
                            </div>
                        )}

                        <div className="text-center text-xs text-zinc-400 mt-8 print:text-black print:mt-6 print:text-[10px] print:leading-tight">
                            <p className="font-medium print:font-normal">Terima kasih atas kunjungan Anda!</p>
                            <p>Barang yang sudah dibeli<br className="hidden print:block" /> tidak dapat ditukar/dikembalikan.</p>
                            <p className="mt-2 hidden print:block">- Kasir Sentosa -</p>
                        </div>
                    </div>

                    {/* Action Buttons - Hidden in Print */}
                    <div className="bg-zinc-50 p-4 grid grid-cols-2 gap-3 border-t border-zinc-200 print:hidden">
                        <button
                            onClick={() => {
                                setReceiptData(null);
                                router.push('/admin/pos?success=true');
                            }}
                            className="py-2.5 px-4 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-xl font-semibold text-sm transition-colors"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="py-2.5 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Printer className="w-4 h-4" /> Cetak Struk
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">

            {/* Left Area: Product Selection */}
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-500" />
                            Kasir (Point of Sale)
                        </h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau kategori..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-300 focus:border-blue-500 rounded-xl text-sm outline-none transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-blue-500 shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-zinc-50/30 dark:bg-zinc-950/30">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => {
                            const outOfStock = product.stok <= 0;
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    disabled={outOfStock}
                                    className={`relative flex flex-col bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden text-left transition-all ${outOfStock
                                        ? 'border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed grayscale'
                                        : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:shadow-md cursor-pointer group'
                                        }`}
                                >
                                    <div className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800 relative">
                                        {product.gambarUrl && product.gambarUrl !== '/placeholder-image.jpg' ? (
                                            <img src={product.gambarUrl} alt={product.namaProduk} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center p-4 text-zinc-300 dark:text-zinc-600">
                                                <ShoppingCart className="w-8 h-8 opacity-20" />
                                            </div>
                                        )}
                                        {outOfStock && (
                                            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-10">
                                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Habis</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">{product.category.namaKategori}</span>
                                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight mb-2 line-clamp-2">{product.namaProduk}</h3>
                                        <div className="mt-auto flex items-end justify-between">
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">Rp {product.harga.toLocaleString('id-ID')}</span>
                                            <span className="text-xs text-zinc-500">Stok: {product.stok}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Area: Cart & Checkout */}
            <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex-shrink-0">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Pesanan Saat Ini</h2>
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                        {totalItems} item
                    </span>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 space-y-4">
                            <ShoppingCart className="w-16 h-16 opacity-20" />
                            <p className="text-sm font-medium">Keranjang belanja kosong</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                                <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                    {item.product.gambarUrl && item.product.gambarUrl !== '/placeholder-image.jpg' ? (
                                        <img src={item.product.gambarUrl} alt={item.product.namaProduk} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingCart className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.product.namaProduk}</h4>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Rp {(item.product.harga * item.quantity).toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, -1)}
                                            className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, 1)}
                                            className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Area */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                            <span>Subtotal</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">Rp {subTotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                            <span>PPN (11%)</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">Rp {tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-end">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">Total Tagihan</span>
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${paymentMethod === 'cash'
                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                                }`}
                        >
                            <Banknote className="w-4 h-4" /> Tunai
                        </button>
                        <button
                            onClick={() => setPaymentMethod('transfer')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${paymentMethod === 'transfer'
                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                                }`}
                        >
                            <CreditCard className="w-4 h-4" /> Transfer Bank
                        </button>
                    </div>

                    <div className="space-y-1.5 mt-4">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">
                            Alamat Pengiriman (Opsional)
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Tulis alamat jika barang ingin diantar..."
                            rows={2}
                            className="w-full px-4 py-2 bg-white border border-zinc-300 focus:border-blue-500 rounded-xl text-sm outline-none transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-blue-500 shadow-inner resize-none"
                        />
                    </div>

                    {paymentMethod === 'cash' && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Uang Dibayar</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-zinc-500">Rp</span>
                                <input
                                    type="number"
                                    value={amountPaid || ''}
                                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-300 focus:border-blue-500 rounded-xl font-bold text-lg outline-none transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:focus:border-blue-500 shadow-inner"
                                    placeholder="0"
                                />
                            </div>
                            {amountPaid > 0 && amountPaid < total && (
                                <p className="text-xs text-red-500 font-medium mt-1">Uang tidak cukup (Kurang Rp {(total - amountPaid).toLocaleString('id-ID')})</p>
                            )}
                            {amountPaid >= total && (
                                <div className="flex justify-between items-center mt-2 p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Kembalian:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Rp {change.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || (paymentMethod === 'cash' && amountPaid < total)}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:text-zinc-500 text-white rounded-xl font-bold text-lg transition-all shadow-sm disabled:shadow-none disabled:cursor-not-allowed dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
                    >
                        Selesaikan Pembayaran
                    </button>
                </div>
            </div>
        </div>
    );
}
