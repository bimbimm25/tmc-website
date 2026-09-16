'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MapPin, Clock, Car, Camera, ExternalLink,
    Sparkles, ArrowRight, Heart, Home, Users,
    Coffee, ShieldCheck, Compass, User, Utensils
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function BearPawIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5.7 2.5 1.6 2.5z" />
        </svg>
    );
}

function BearFaceIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a3 3 0 100-6 3 3 0 000 6zm16 0a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    );
}

// Helper function untuk parsing tag <br> dan enter (\n)
function renderFormattedText(text?: string | null, fallback?: React.ReactNode) {
    if (!text) return fallback;

    const normalized = text.replace(/<br\s*\/?>/gi, '\n');
    const lines = normalized.split('\n');

    return lines.map((line, idx) => (
        <span key={idx}>
            {line}
            {idx < lines.length - 1 && <br />}
        </span>
    ));
}

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
}

export default function VisitUsPage() {
    const [banner, setBanner] = useState<BannerItem | null>(null);

    async function fetchBanner() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/banners/visit-us`, { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                if (json && json.data) setBanner(json.data);
            }
        } catch {
            // fallback
        }
    }

    useEffect(() => {
        fetchBanner();
    }, []);

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `${API_BASE_URL}/storage/${banner.image}`)
        : '/img/hero-home.png';

    return (
        <div className="min-h-screen space-y-8 sm:space-y-12 pb-12">

            {/* ================================================= */}
            {/* 1. HERO SECTION FULL 1 LAYAR (VISIT US)           */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Cafe Building Entrance"
                        className="w-full h-full object-cover object-right lg:object-center"
                    />
                    {/* Gradient Overlay Putih Sebelah Kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full sm:w-2/3 lg:w-1/2" />
                </div>

                {/* Konten Text Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div className="max-w-md lg:max-w-lg space-y-3 sm:space-y-3.5">

                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#8c5a3c] text-[9.5px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <span>OUR LOCATIONS</span>
                            <BearPawIcon className="w-3 h-3" />
                        </div>

                        {/* Title Proporsional */}
                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {renderFormattedText(
                                banner?.title,
                                <>
                                    VISIT <br />
                                    <span className="text-[#8c5a3c]">TO MEET CAFE!</span>
                                </>
                            )}
                        </h1>

                        {/* Subtitle */}
                        <div className="space-y-1 text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            <p className="font-bold text-[#3d2314]">
                                Dua tempat nyaman, satu pengalaman manis penuh kehangatan.
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#6c584c]">
                                {renderFormattedText(
                                    banner?.subtitle,
                                    'Datang untuk menikmati hidangan lezat, tinggal untuk mengabadikan momen berharga bersama keluarga.'
                                )}
                            </p>
                        </div>

                        {/* Badge Sambutan */}
                        <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white/90 border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <div className="w-5 h-5 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <BearFaceIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10.5px] font-black text-[#3d2314]">
                                Kami tidak sabar menyambut kedatanganmu!
                            </span>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                            <a
                                href="#choose-location"
                                className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[11px] rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <span>PILIH LOKASI CABANG</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>

                            <Link
                                href="/menu"
                                className="px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] text-white font-black text-[11px] rounded-full transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md"
                            >
                                <Utensils className="w-3.5 h-3.5" />
                                <span>LIHAT MENU</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. CHOOSE YOUR TO MEET (CARD COMPACT 1 VIEWPORT)  */}
            {/* ================================================= */}
            <section id="choose-location" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5 scroll-mt-20">

                {/* Section Header Ringkas */}
                <div className="text-center space-y-0.5">
                    <div className="inline-flex items-center gap-2">
                        <span className="w-5 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                        <h2 className="text-base sm:text-xl font-black text-[#3d2314] tracking-tight uppercase">
                            CHOOSE YOUR OUR LOCATIONS
                        </h2>
                        <span className="w-5 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                    </div>
                    <p className="text-[11px] text-[#6c584c] font-semibold">
                        Pilih lokasi cabang terdekat yang ingin kamu kunjungi
                    </p>
                </div>

                {/* 2 Card Berdampingan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">

                    {/* CABANG 1: HEAVENLAND PARK */}
                    <div className="bg-white rounded-3xl border border-[#e6ccb2]/80 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#8c5a3c] transition duration-200 opacity-95">
                        <div className="space-y-3">
                            {/* Frame Gambar Proporsional */}
                            <div className="relative w-full h-48 sm:h-56 lg:h-[270px] bg-stone-100 rounded-2xl overflow-hidden border border-[#e6ccb2]/60 shadow-2xs">
                                <img
                                    src="/img/visit-us-hlp/banner-hlp.png"
                                    alt="To Meet Cafe Heavenland Park"
                                    className="w-full h-full object-cover object-[center_35%] grayscale-[0.2] brightness-[0.8]"
                                />
                                <div className="absolute inset-0 bg-[#3d2314]/30" />
                                <div className="absolute top-2.5 left-2.5 bg-[#e85a4f] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs">
                                    CABANG 1
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center px-4">
                                    <div className="rounded-2xl border border-white/60 bg-[#3d2314]/60 px-3 py-2 text-center shadow-lg backdrop-blur-[1px]">
                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f7dfc6]">
                                            Sedang Renovasi
                                        </p>
                                        <p className="mt-1 text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                                            CABANG INI SEDANG DI RENOVASI
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-1 space-y-2 text-center">
                                <h3 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide leading-tight">
                                    HEAVENLAND PARK
                                </h3>

                                <p className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    DESSERT • MINI PLAYGROUND
                                </p>

                                <div className="rounded-2xl border border-[#f0d9bf] bg-[#FAF0E6]/70 px-3 py-2 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-[#8c5a3c]">
                                        INFORMASI KUNJUNGAN
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                        Silakan cek cabang lain atau tunggu update resmi dari To Meet Cafe untuk pembukaan kembali.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 space-y-1">
                            <button
                                type="button"
                                disabled
                                className="w-full py-2.5 bg-[#c7b8a7] text-white font-black text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-xs cursor-not-allowed"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>VISIT HEAVENLAND PARK</span>
                                <ArrowRight className="w-3 h-3" />
                            </button>

                            <a
                                href="https://maps.google.com/?q=Heavenland+Park+Sidoarjo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1 bg-transparent hover:bg-[#FAF0E6] text-[#8c5a3c] font-black text-[10px] rounded-lg transition flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
                            >
                                <Compass className="w-3 h-3" />
                                <span>LIHAT DI GOOGLE MAPS</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    </div>

                    {/* CABANG 2: PONDOK MUTIARA */}
                    <div className="bg-white rounded-3xl border border-[#e6ccb2]/80 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-[#8c5a3c] transition duration-200">
                        <div className="space-y-3">
                            {/* Frame Gambar Proporsional */}
                            <div className="relative w-full h-48 sm:h-56 lg:h-[270px] bg-stone-100 rounded-2xl overflow-hidden border border-[#e6ccb2]/60 shadow-2xs">
                                <img
                                    src="/img/visit-us-pm/banner-pm.png"
                                    alt="To Meet Cafe Pondok Mutiara"
                                    className="w-full h-full object-cover object-bottom"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-[#8c5a3c] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs">
                                    CABANG 2
                                </div>
                            </div>

                            <div className="px-1 space-y-1 text-center">
                                <h3 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide leading-tight">
                                    PONDOK MUTIARA
                                </h3>

                                <p className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    CAFE • PLAYGROUND • EVENT • BIRTHDAY
                                </p>

                                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                                    <div className="bg-[#FAF0E6]/50 p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <BearFaceIcon className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Cafe</div>
                                    </div>

                                    <div className="bg-[#FAF0E6]/50 p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Home className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Indoor Area</div>
                                    </div>

                                    <div className="bg-[#FAF0E6]/50 p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Event & Birthday</div>
                                    </div>

                                    <div className="bg-[#FAF0E6]/50 p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Playground</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 space-y-1">
                            <Link
                                href="/visit-us/pondok-mutiara"
                                className="w-full py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-xs cursor-pointer"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>VISIT PONDOK MUTIARA</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>

                            <a
                                href="https://maps.google.com/?q=Pondok+Mutiara+Sidoarjo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1 bg-transparent hover:bg-[#FAF0E6] text-[#8c5a3c] font-black text-[10px] rounded-lg transition flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
                            >
                                <Compass className="w-3 h-3" />
                                <span>LIHAT DI GOOGLE MAPS</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 3. INFO BAR BOTTOM: 2 TEMPAT 2 CERITA             */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

                        <div className="lg:col-span-4 flex items-center gap-3 border-b lg:border-b-0 lg:border-r border-[#e6ccb2]/60 pb-3 lg:pb-0 lg:pr-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                                <BearFaceIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] leading-tight uppercase">
                                    2 TEMPAT • 2 CERITA<br />
                                    <span className="text-[#8c5a3c]">1 KESERUAN BERSAMA!</span>
                                </h3>
                                <p className="text-[9.5px] text-[#6c584c] font-semibold mt-0.5">
                                    Kunjungi kedua cabang To Meet dan nikmati kehangatannya!
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#FAF0E6]/50 text-[#e85a4f] mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <User className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Family Friendly</div>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#FAF0E6]/50 text-[#8c5a3c] mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <BearFaceIcon className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Cafe Tema Beruang</div>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#FAF0E6]/50 text-amber-600 mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Clock className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Selasa - Minggu</div>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#FAF0E6]/50 text-emerald-600 mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Camera className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Spot Foto Cantik</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}