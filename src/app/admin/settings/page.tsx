import prisma from '@/lib/prisma';
import { verifyUserSession } from '@/app/(auth)/verify';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const session = await verifyUserSession();
    if (!session.isAuthenticated || !session.user || (session.user.role as string)?.toLowerCase() !== 'admin') {
        redirect('/login');
    }

    const admin = await prisma.user.findUnique({
        where: { id: session.user.id as string }
    });

    if (!admin) {
        redirect('/login');
    }

    return <SettingsClient admin={admin} />;
}
