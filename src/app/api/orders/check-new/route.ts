import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyUserSession } from '@/app/(auth)/verify';

export async function GET(req: NextRequest) {
    const session = await verifyUserSession();
    if (!session.isAuthenticated || !session.user || (session.user.role as string)?.toLowerCase() !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const since = searchParams.get('since');

    if (!since) {
        return NextResponse.json({ error: 'Missing since parameter' }, { status: 400 });
    }

    try {
        const dateSince = new Date(since);

        // Fetch orders created STRICTLY AFTER the given exact timestamp
        const newOrders = await prisma.order.findMany({
            where: {
                tanggalPesanan: {
                    gt: dateSince
                }
            },
            include: {
                user: {
                    select: { namaLengkap: true }
                }
            }
        });

        return NextResponse.json({ hasNewOrders: newOrders.length > 0, orders: newOrders });
    } catch (error) {
        console.error('Check New Orders API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
