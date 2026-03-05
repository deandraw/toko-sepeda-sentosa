'use client';

import { useCart } from '@/components/shop/CartContext';
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, CreditCard, Banknote, ShieldCheck, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyUserSession } from '@/app/(auth)/verify';
import { getUserProfile } from '@/app/(shop)/profile/actions';
import { createOnlineOrder } from './actions';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [success, setSuccess] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'COD'>('transfer');
    const [whatsappLink, setWhatsappLink] = useState('');
    const [copiedBank, setCopiedBank] = useState('');
    const router = useRouter();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedBank(text);
        setTimeout(() => setCopiedBank(''), 2000);
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setCheckoutError('');
        try {
            // Check if the user is authenticated via JWT Cookie
            const session = await verifyUserSession();

            if (!session.isAuthenticated) {
                // If not logged in, redirect them to login page and abort checkout
                router.push('/login?redirect=/cart');
                return;
            }

            // Fetch user profile to check for address
            const profileData = await getUserProfile();

            if (profileData.error) {
                setCheckoutError(profileData.error);
                return;
            }

            if (!profileData.user?.alamatLengkap) {
                setCheckoutError('Alamat Pengiriman belum diisi. Anda wajib mengisi alamat lengkap di Profil sebelum melakukan checkout.');
                return;
            }

            // Call Server Action to create the real Order in DB
            const cartItemsInput = cart.map(item => ({
                id: item.id,
                kuantitas: item.kuantitas,
                harga: item.harga
            }));

            const res = await createOnlineOrder(cartItemsInput, paymentMethod);

            if (res.error) {
                setCheckoutError(res.error);
                return;
            }

            // Construct WhatsApp Message
            const adminPhone = '6281234567890'; // Assuming this is Sentosa's Admin WhatsApp number
            let messageText = `Halo *Sentosa Bike*! 👋\n\nSaya ingin mengonfirmasi pesanan baru saya:\n\n*ID Pesanan*: ${res.orderId}\n*Nama Pemesan*: ${res.customerData?.namaLengkap}\n*Alamat Pengiriman*:\n${res.customerData?.alamatLengkap}\n\n*Daftar Belanja*:`;

            cart.forEach(item => {
                messageText += `\n- ${item.namaProduk} (${item.kuantitas}x) - Rp ${item.harga.toLocaleString('id-ID')}`;
            });

            messageText += `\n\n*Total Tagihan*: Rp ${res.totalHarga?.toLocaleString('id-ID')}`;
            messageText += `\n*Metode Pembayaran*: ${paymentMethod === 'transfer' ? 'Transfer Bank' : 'Cash On Delivery (COD)'}`;

            if (paymentMethod === 'transfer') {
                messageText += `\n\nSaya akan segera mentransfer dan mengirimkan bukti pembayaran kemari.`;
            } else {
                messageText += `\n\nTolong persiapkan barang, saya akan membayarnya ke kurir saat barang tiba.`;
            }

            messageText += `\n\nTerima kasih!`;

            const encodedMessage = encodeURIComponent(messageText);
            const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

            setWhatsappLink(waUrl);

            clearCart();
            setSuccess(true);

            // Optionally, we could auto-redirect them immediately, but giving them a button is better UX
            // window.open(waUrl, '_blank');

        } catch (error) {
            console.error(error);
            alert("Gagal memproses pesanan.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-8 sm:p-10 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Checkout Berhasil!</h2>
                    <p className="text-zinc-500 mb-8">
                        Pesanan Anda telah dicatat di sistem kami. Langkah terakhir, silakan konfirmasi pesanan ini langsung ke WhatsApp Admin toko kami.
                    </p>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-6 py-4 bg-[#25D366] hover:bg-[#1ebd5c] text-white rounded-xl font-bold transition-all shadow-md mb-4 gap-2"
                    >
                        <ArrowRight className="w-5 h-5" />
                        Lanjutkan Konfirmasi di WhatsApp
                    </a>

                    <Link href="/" className="inline-block text-zinc-500 hover:text-blue-600 font-medium transition-colors">
                        Kembali melihat katalog
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-zinc-100 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Keranjang Anda Kosong</h2>
                    <p className="text-zinc-500 mb-8 max-w-md mx-auto">Anda belum menambahkan satupun produk ke keranjang belanja. Yuk, mulai eksplorasi sepeda impian Anda.</p>
                    <Link href="/#katalog" className="inline-flex items-center justify-center px-8 py-3.5 bg-zinc-900 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors shadow-lg hover:shadow-blue-500/20">
                        Eksplorasi Katalog
                    </Link>
                </div>
            </div>
        );
    }

    const tax = cartTotal * 0.11;
    const finalTotal = cartTotal + tax;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-8">Keranjang Belanja</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cart Items List */}
                <div className="flex-1 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex-shrink-0 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 overflow-hidden relative">
                                {item.gambarUrl && item.gambarUrl !== '/placeholder-image.jpg' ? (
                                    <img src={item.gambarUrl} alt={item.namaProduk} className="w-full h-full object-cover" />
                                ) : (
                                    <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300 dark:text-zinc-600" />
                                )}
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-bold text-zinc-900 text-lg sm:text-xl line-clamp-2">{item.namaProduk}</h3>
                                        <p className="text-zinc-500 text-sm mt-1">Stok tersisa: {item.stok}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-zinc-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div className="flex items-center w-max bg-zinc-100 rounded-xl p-1 border border-zinc-200/50">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1.5 sm:p-2 bg-white text-zinc-600 rounded-lg shadow-sm hover:text-blue-600 transition-colors disabled:opacity-50"
                                            disabled={item.kuantitas <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 sm:w-12 text-center font-bold text-sm sm:text-base">
                                            {item.kuantitas}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1.5 sm:p-2 bg-white text-zinc-600 rounded-lg shadow-sm hover:text-blue-600 transition-colors disabled:opacity-50"
                                            disabled={item.kuantitas >= item.stok}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="font-extrabold text-blue-600 text-base sm:text-xl text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-0">
                                        Rp {(item.harga * item.kuantitas).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Checkout Summary */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    {checkoutError && (
                        <div className="mb-6 p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-red-800 mb-1">Peringatan Checkout</h3>
                                    <p className="text-sm font-medium leading-relaxed">{checkoutError}</p>
                                    <Link href="/profile" className="inline-block mt-4 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
                                        Isi Alamat Sekarang &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 sticky top-24">
                        <h2 className="text-xl font-bold text-zinc-900 mb-6 pb-6 border-b border-zinc-100">Ringkasan Pesanan</h2>

                        <div className="mb-6 pb-6 border-b border-zinc-100">
                            <h3 className="font-bold text-zinc-900 mb-4">Pilih Metode Pembayaran</h3>
                            <div className="space-y-3">
                                <label htmlFor="pay-transfer" className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:border-blue-300'}`}>
                                    <input
                                        id="pay-transfer"
                                        type="radio"
                                        name="payment"
                                        value="transfer"
                                        checked={paymentMethod === 'transfer'}
                                        onChange={() => setPaymentMethod('transfer')}
                                        className="w-5 h-5 text-blue-600 accent-blue-600 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-zinc-500" />
                                            Transfer Bank
                                        </div>
                                        <p className="text-xs text-zinc-500">Pembayaran aman via rekening toko</p>
                                    </div>
                                </label>

                                <label htmlFor="pay-cod" className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:border-blue-300'}`}>
                                    <input
                                        id="pay-cod"
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                        className="w-5 h-5 text-blue-600 accent-blue-600 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold flex items-center gap-2">
                                            <Banknote className="w-4 h-4 text-zinc-500" />
                                            Cash On Delivery (COD)
                                        </div>
                                        <p className="text-xs text-zinc-500">Bayar ke kurir saat barang tiba</p>
                                    </div>
                                </label>
                            </div>

                            {/* Bank Details Dropdown */}
                            {paymentMethod === 'transfer' && (
                                <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 animate-in slide-in-from-top-2">
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">Rekening Pembayaran</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-zinc-100 shadow-sm">
                                            <div>
                                                <div className="font-bold text-zinc-900">BCA - 1234567890</div>
                                                <div className="text-sm text-zinc-500">a/n Toko Sepeda Sentosa</div>
                                            </div>
                                            <button
                                                onClick={() => handleCopy('1234567890')}
                                                className="p-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors"
                                                title="Salin No. Rekening"
                                            >
                                                {copiedBank === '1234567890' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-zinc-100 shadow-sm">
                                            <div>
                                                <div className="font-bold text-zinc-900">Mandiri - 0987654321</div>
                                                <div className="text-sm text-zinc-500">a/n Toko Sepeda Sentosa</div>
                                            </div>
                                            <button
                                                onClick={() => handleCopy('0987654321')}
                                                className="p-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors"
                                                title="Salin No. Rekening"
                                            >
                                                {copiedBank === '0987654321' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-zinc-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-zinc-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Pajak (PPN 11%)</span>
                                <span className="font-medium text-zinc-900">Rp {tax.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Pengiriman</span>
                                <span className="font-medium text-emerald-600">Gratis</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-100 mb-8 flex justify-between items-end">
                            <span className="font-bold text-zinc-900">Total Akhir</span>
                            <span className="text-3xl font-black text-blue-600">Rp {finalTotal.toLocaleString('id-ID')}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 hover:bg-blue-600 disabled:bg-zinc-300 text-white rounded-xl font-bold text-lg transition-all shadow-md group disabled:cursor-not-allowed"
                        >
                            {isCheckingOut ? (
                                'Memproses...'
                            ) : (
                                <>
                                    Selesaikan Transaksi
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-4 text-zinc-400">
                            <ShieldCheck className="w-5 h-5" />
                            <CreditCard className="w-5 h-5" />
                            <Banknote className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
