'use client';

import { useEffect, useRef } from 'react';

export default function OrderNotifier() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize the audio object
        audioRef.current = new Audio('/notification.mp3');

        // Setup initial timestamp if not exists
        if (!localStorage.getItem('lastOrderCheck')) {
            localStorage.setItem('lastOrderCheck', new Date().toISOString());
        }

        const checkNewOrders = async () => {
            const lastChecked = localStorage.getItem('lastOrderCheck');
            if (!lastChecked) return;

            // Generate the timestamp for THIS network request
            const nextCheckTime = new Date().toISOString();

            try {
                const res = await fetch(`/api/orders/check-new?since=${encodeURIComponent(lastChecked)}`);
                if (!res.ok) return;

                const data = await res.json();

                if (data.hasNewOrders) {
                    // Play shiny notification sound
                    audioRef.current?.play().catch(e => console.warn('Audio auto-play blocked by browser (user needs to interact with page first):', e));
                    localStorage.setItem('lastOrderCheck', nextCheckTime);
                } else {
                    // Roll the timestamp forward even if no orders were found
                    localStorage.setItem('lastOrderCheck', nextCheckTime);
                }
            } catch (error) {
                console.error('Failed to poll for new orders:', error);
            }
        };

        // Poll every 10 seconds
        const intervalId = setInterval(checkNewOrders, 10000);

        return () => clearInterval(intervalId);
    }, []);

    // Invisible system component
    return null;
}
