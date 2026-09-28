'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Matikan scroll restoration otomatis bawaan browser
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const forceScrollTop = () => {
            // 1. Scroll window
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            // 2. Scroll elemen html & body jika ada container overflow
            if (document.documentElement) {
                document.documentElement.scrollTop = 0;
            }
            if (document.body) {
                document.body.scrollTop = 0;
            }
        };

        // Eksekusi langsung
        forceScrollTop();

        // Eksekusi ulang di next tick (requestAnimationFrame) untuk mengantisipasi re-render Next.js
        const rafId = requestAnimationFrame(() => {
            forceScrollTop();
        });

        return () => cancelAnimationFrame(rafId);
    }, [pathname]);

    return null;
}