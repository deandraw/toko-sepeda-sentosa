'use client';

import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ChartData {
    nama: string;
    total: number;
}

export default function SalesChartClient({ data }: { data: ChartData[] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Grafik akan tampil setelah ada data penjualan.</p>
            </div>
        );
    }

    if (!isMounted) return <div className="h-64 w-full bg-zinc-50 dark:bg-zinc-950/50 animate-pulse rounded-xl" />;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis
                        dataKey="nama"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#71717a' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#71717a' }}
                        tickFormatter={(value) => `Rp ${(value / 1000).toLocaleString('id-ID')}k`}
                        width={80}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: '1px solid #e4e4e7',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                        labelStyle={{ color: '#71717a', fontWeight: '500', marginBottom: '4px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
