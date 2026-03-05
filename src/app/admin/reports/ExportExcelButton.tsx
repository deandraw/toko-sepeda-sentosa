'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportExcelButton({ data }: { data: any }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            // Flatten the complex nested order data into a clean structure for Excel
            const flattenedData = data.map((order: any) => ({
                'ID Pesanan': `#${order.id.slice(-6).toUpperCase()}`,
                'Tanggal': new Date(order.tanggalPesanan).toLocaleString('id-ID'),
                'Nama Kasir/Pelanggan': order.user?.namaLengkap || '-',
                'Total Harga (Rp)': order.totalHarga,
                'Status': order.statusPesanan,
                'Metode Pembayaran': order.payments?.[0]?.metodePembayaran || 'Tunai',
                'Item Terjual': order.orderDetails.map((item: any) =>
                    `${item.product?.namaProduk} (${item.kuantitas}x)`
                ).join(', ')
            }));

            // Create Worksheet
            const worksheet = XLSX.utils.json_to_sheet(flattenedData);

            // Auto-size columns slightly
            worksheet['!cols'] = [
                { wch: 15 }, // ID Pesanan
                { wch: 20 }, // Tanggal
                { wch: 25 }, // Nama
                { wch: 18 }, // Total
                { wch: 15 }, // Status
                { wch: 20 }, // Pembayaran
                { wch: 50 }, // Items
            ];

            // Create Workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Penjualan');

            // Generate and trigger download
            XLSX.writeFile(workbook, `Laporan-Penjualan-Sentosa-${new Date().toISOString().split('T')[0]}.xlsx`);

        } catch (error) {
            console.error('Failed to export:', error);
            alert('Gagal mengekspor data ke Excel.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyusun Data...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    Export ke Excel
                </>
            )}
        </button>
    );
}
