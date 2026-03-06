import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toko Sepeda Sentosa",
  description: "Sistem Informasi Inventaris dan Penjualan",
};

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import OrderNotifier from "@/components/admin/OrderNotifier";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}
      >
        <OrderNotifier />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64 w-full min-h-screen print:ml-0">
            <Header />
            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full print:p-0 print:max-w-none">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
