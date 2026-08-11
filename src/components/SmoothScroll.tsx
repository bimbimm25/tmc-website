'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    useEffect(() => {
        // Inisialisasi Lenis dengan konfigurasi animasi scroll yang super mulus
        const lenis = new Lenis({
            duration: 1.2, // Durasi inersia (makin tinggi makin mulus)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing curve murni khas Apple/Mac
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true, // Mengaktifkan smooth scroll untuk mouse wheel & trackpad
            wheelMultiplier: 1.0, // Kecepatan gulir mouse
            touchMultiplier: 1.5, // Kecepatan gulir di layar HP/touchscreen
        });

        // Loop animasi menggunakan requestAnimationFrame
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Cleanup saat komponen di-unmount
        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}