'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MapPin, Clock, Car, Camera, ExternalLink,
    Sparkles, ArrowRight, Heart, Home, Users,
    Coffee, ShieldCheck, Compass
} from 'lucide-react';

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
            const res = await fetch('http://127.0.0.1:8000/api/banners/visit-us', { cache: 'no-store' });
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
                : `http://127.0.0.1:8000/storage/${banner.image}`)
        : '/img/hero-home.png';

    return (
        <div className="bg-[#faf6f0] min-h-screen space-y-8 sm:space-y-12 pb-12">

            {/* ================================================= */}
            {/* 1. HERO SECTION (100% DIPERTAHANKAN)               */}
            {/* ================================================= */}
            <section className="w-full relative min-h-dvh lg:h-screen lg:max-h-160 flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-6 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                        {/* Kolom Kiri: Headline & Deskripsi */}
                        <div className="lg:col-span-5 space-y-3.5 text-center lg:text-left order-2 lg:order-1">
                            <div className="space-y-1.5">
                                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-[1.05] uppercase">
                                    {banner?.title || 'Visit Us!'}
                                </h1>

                                <div className="space-y-1 text-xs text-[#5a4232] font-semibold leading-relaxed max-w-sm mx-auto lg:mx-0">
                                    <p className="font-bold text-[#3d2314]">
                                        Dua tempat nyaman, satu pengalaman manis penuh kehangatan.
                                    </p>
                                    <p className="text-[11px] text-[#6c584c]">
                                        {banner?.subtitle || 'Datang untuk menikmati hidangan lezat, tinggal untuk mengabadikan momen berharga bersama keluarga.'}
                                    </p>
                                </div>
                            </div>

                            {/* Badge Sambutan Hangat */}
                            <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-[#fffcf7] border border-[#e6ccb2]/80 shadow-2xs">
                                <div className="w-5 h-5 rounded-lg bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                    <BearFaceIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10.5px] font-black text-[#3d2314]">
                                    Kami tidak sabar menyambut kedatanganmu!
                                </span>
                            </div>

                            {/* Tombol Scroll Cepat */}
                            <div className="pt-1 flex justify-center lg:justify-start">
                                <a
                                    href="#choose-location"
                                    className="px-5 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-[11px] rounded-full shadow-md shadow-[#8c5a3c]/20 transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                                >
                                    <span>PILIH LOKASI CABANG</span>
                                    <ArrowRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>

                        {/* Kolom Kanan: Foto Showcase Cafe */}
                        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end relative">
                            <div className="relative w-full max-w-md lg:max-w-lg aspect-16/10 rounded-3xl overflow-hidden shadow-xl border-3 border-white">
                                <img
                                    src={heroImage}
                                    alt="To Meet Cafe Building Entrance"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
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
                            CHOOSE YOUR TO MEET
                        </h2>
                        <span className="w-5 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                    </div>
                    <p className="text-[11px] text-[#6c584c] font-semibold">
                        Pilih lokasi cabang terdekat yang ingin kamu kunjungi
                    </p>
                </div>

                {/* 2 Card Berdampingan (Compact Vertically) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">

                    {/* CABANG 1: HEAVENLAND PARK */}
                    <div className="bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#8c5a3c] transition duration-200">
                        <div className="space-y-2">
                            {/* Gambar Card Terukur (Target 240-270px di Desktop) */}
                            <div className="relative w-full h-44 sm:h-52 lg:h-[260px] bg-stone-100 overflow-hidden">
                                <img
                                    src="/img/hero-home.png"
                                    alt="To Meet Cafe Heavenland Park"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-[#e85a4f] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs">
                                    CABANG 1
                                </div>
                            </div>

                            {/* Informasi Cabang */}
                            <div className="px-4 sm:px-5 space-y-1 text-center">
                                <h3 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide leading-tight">
                                    HEAVENLAND PARK
                                </h3>

                                <p className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    OUTDOOR • PLAYGROUND • KOLAM PANCING
                                </p>

                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed max-w-sm mx-auto line-clamp-2">
                                    Suasana outdoor seru dengan playground lantai 3, kolam pancing beruang, dan area santai keluarga.
                                </p>

                                {/* 4 Feature Badges */}
                                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Sparkles className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Playground</div>
                                    </div>

                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <BearFaceIcon className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Bear Fishing</div>
                                    </div>

                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Home className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Outdoor Area</div>
                                    </div>

                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Coffee className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Self Service</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 sm:px-5 pb-4 pt-2 space-y-1">
                            <Link
                                href="/visit-us/heavenland-park"
                                className="w-full py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-xs cursor-pointer"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>VISIT HEAVENLAND PARK</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>

                            <a
                                href="https://maps.google.com/?q=Heavenland+Park+Sidoarjo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1 bg-transparent hover:bg-[#faf6f0] text-[#8c5a3c] font-black text-[10px] rounded-lg transition flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
                            >
                                <Compass className="w-3 h-3" />
                                <span>LIHAT DI GOOGLE MAPS</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    </div>

                    {/* CABANG 2: PONDOK MUTIARA */}
                    <div className="bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#8c5a3c] transition duration-200">
                        <div className="space-y-2">
                            {/* Gambar Card Terukur (Target 240-270px di Desktop) */}
                            <div className="relative w-full h-44 sm:h-52 lg:h-[260px] bg-stone-100 overflow-hidden">
                                <img
                                    src="/img/hero-home.png"
                                    alt="To Meet Cafe Pondok Mutiara"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-[#8c5a3c] text-white px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs">
                                    CABANG 2
                                </div>
                            </div>

                            {/* Informasi Cabang */}
                            <div className="px-4 sm:px-5 space-y-1 text-center">
                                <h3 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide leading-tight">
                                    PONDOK MUTIARA
                                </h3>

                                <p className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    INDOOR • COZY SPACE • FAMILY FRIENDLY
                                </p>

                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed max-w-sm mx-auto line-clamp-2">
                                    Suasana indoor hangat, sejuk, dan nyaman. Cocok untuk perayaan ulang tahun intim dan quality time bersama.
                                </p>

                                {/* 4 Feature Badges */}
                                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Home className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Indoor Cozy</div>
                                    </div>

                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Users className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Family Friendly</div>
                                    </div>

                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">Private Event</div>
                                    </div>

                                    <div className="bg-[#faf6f0] p-1.5 rounded-xl border border-[#e6ccb2]/60 space-y-0.5">
                                        <div className="w-5 h-5 rounded-md bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                            <ShieldCheck className="w-3 h-3" />
                                        </div>
                                        <div className="text-[8.5px] font-black text-[#3d2314] leading-tight truncate">House Rules</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 sm:px-5 pb-4 pt-2 space-y-1">
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
                                className="w-full py-1 bg-transparent hover:bg-[#faf6f0] text-[#8c5a3c] font-black text-[10px] rounded-lg transition flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
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
                <div className="bg-[#fffcf7] p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

                        <div className="lg:col-span-4 flex items-center gap-3 border-b lg:border-b-0 lg:border-r border-[#e6ccb2]/60 pb-3 lg:pb-0 lg:pr-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
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
                                <div className="w-6 h-6 rounded-lg bg-[#faf6f0] text-[#e85a4f] mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <MapPin className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Lokasi Strategis</div>
                                <div className="text-[8.5px] text-[#6c584c] font-semibold">Mudah dijangkau</div>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#faf6f0] text-[#8c5a3c] mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Car className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Parkir Luas</div>
                                <div className="text-[8.5px] text-[#6c584c] font-semibold">Aman dan nyaman</div>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#faf6f0] text-amber-600 mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Clock className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Buka Setiap Hari</div>
                                <div className="text-[8.5px] text-[#6c584c] font-semibold">10.00 – 22.00 WIB</div>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                                <div className="w-6 h-6 rounded-lg bg-[#faf6f0] text-emerald-600 mx-auto flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Camera className="w-3 h-3" />
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314]">Spot Foto Cantik</div>
                                <div className="text-[8.5px] text-[#6c584c] font-semibold">Instagramable</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}