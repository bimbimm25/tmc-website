'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    // 1. Inisialisasi Lenis dengan RAF Loop yang Bersih & Anti-Stutter
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.95, // Kecepatan scroll natural, tidak lompat-lompat
            touchMultiplier: 1.0,
            syncTouch: false,      // Jaga scroll mobile tetap natural tanpa lag input
        });

        lenisRef.current = lenis;

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // 2. Paksa Scroll Kembali ke Paling Atas Saat Pindah Halaman (Route Change)
    useEffect(() => {
        if (!lenisRef.current) return;

        // Hentikan inersia/momentum yang sedang berjalan
        lenisRef.current.stop();

        // Paksa scroll langsung ke puncak halaman secara instan (tanpa animasi transisi)
        lenisRef.current.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);

        // Lanjutkan kembali engine scroll Lenis
        const timer = setTimeout(() => {
            lenisRef.current?.start();
        }, 50);

        return () => clearTimeout(timer);
    }, [pathname]);

    return <>{children}</>;
}