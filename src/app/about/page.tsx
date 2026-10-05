'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Heart, Users, Sparkles, Award, MapPin,
    Smile, Utensils, Star, ExternalLink, ShieldCheck,
    CheckCircle2, Clock, Calendar, Flag, X
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Cache in-memory level modul agar saat navigasi page langsung instan tanpa glitch
let cachedAboutBanner: BannerData | null = null;

interface BannerData {
    id: number;
    page_key: string;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
    is_active: boolean | number;
}

// Custom SVG Icons
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

// Helper function untuk parsing tag <br> dan baris baru (\n)
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

export default function AboutPage() {
    const [aboutBanner, setAboutBanner] = useState<BannerData | null>(() => cachedAboutBanner);
    const [isBannerChecked, setIsBannerChecked] = useState<boolean>(() => cachedAboutBanner !== null);
    const [isHalalModalOpen, setIsHalalModalOpen] = useState(false);

    // Kunci Scroll Halaman Persis Seperti di Modal Menu
    useEffect(() => {
        if (!isHalalModalOpen) return;

        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const preventScroll = (e: TouchEvent | WheelEvent) => {
            const target = e.target as HTMLElement;
            const modalContent = document.getElementById('halal-modal-card');

            if (modalContent && modalContent.contains(target)) {
                return;
            }

            e.preventDefault();
        };

        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [isHalalModalOpen]);

    useEffect(() => {
        async function fetchBanner() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/banners/about`, { cache: 'default' });
                if (res.ok) {
                    const json = await res.json();
                    if (json?.data) {
                        cachedAboutBanner = json.data;
                        setAboutBanner(json.data);
                    }
                }
            } catch (err) {
                console.warn('About Banner API offline / fallback used:', err);
            } finally {
                setIsBannerChecked(true);
            }
        }

        fetchBanner();
    }, []);

    const heroImageSrc = useMemo(() => {
        if (aboutBanner?.image) {
            return aboutBanner.image.startsWith('http')
                ? aboutBanner.image
                : aboutBanner.image.startsWith('/img')
                    ? aboutBanner.image
                    : `${API_BASE_URL}/storage/${aboutBanner.image}`;
        }
        return isBannerChecked ? '/img/hero-home.png' : '';
    }, [aboutBanner, isBannerChecked]);

    const handleCloseModal = () => {
        setIsHalalModalOpen(false);
    };

    return (
        <div className="min-h-screen space-y-0">

            {/* ================================================= */}
            {/* 1. HERO SECTION                                   */}
            {/* ================================================= */}
            <section
                className={`relative w-full h-screen min-h-dvh flex items-center overflow-hidden border-b border-[#e6ccb2]/50 transition-colors duration-500 ${heroImageSrc ? 'bg-transparent' : 'bg-[#FAF0E6]/30'
                    }`}
            >
                <div className="absolute inset-0 z-0">
                    {heroImageSrc && (
                        <img
                            src={heroImageSrc}
                            alt="To Meet Cafe Atmosphere"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={(e) => {
                                (e.currentTarget as HTMLElement).classList.remove('opacity-0');
                                (e.currentTarget as HTMLElement).classList.add('opacity-100');
                            }}
                            className="w-full h-full object-cover object-[75%_center] lg:object-right xl:object-center opacity-0 transition-opacity duration-700 ease-out"
                        />
                    )}

                    <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/70 sm:via-white/60 to-transparent w-110 sm:w-4/5 lg:w-3/5 xl:w-1/2 pointer-events-none" />
                    <BearPawIcon className="absolute top-20 right-6 w-16 h-16 text-white/30 rotate-12 pointer-events-none" />
                    <BearPawIcon className="absolute top-44 right-24 w-8 h-8 text-white/20 -rotate-15 pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-14 sm:pt-16">
                    <div
                        className={`max-w-[85%] sm:max-w-md lg:max-w-xl space-y-2.5 sm:space-y-3 transition-all duration-700 ease-out ${isBannerChecked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                            }`}
                    >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#e85a4f] text-[10px] font-black border border-[#e6ccb2]/80 shadow-2xs">
                            <span>ABOUT TO MEET</span>
                            <BearPawIcon className="w-2.5 h-2.5" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#2e170c] tracking-tight leading-[1.2] uppercase">
                            {aboutBanner?.title ? (
                                renderFormattedText(aboutBanner.title)
                            ) : isBannerChecked ? (
                                <>
                                    MORE THAN A CAFE, <br />
                                    IT&apos;S A HAPPY PLACE TO MEET <br />
                                    <span className="text-[#8c5a3c]">& CREATE MEMORIES.</span>
                                </>
                            ) : null}
                        </h1>

                        <p className="text-xs sm:text-sm lg:text-[15px] text-[#4a3427] font-bold leading-relaxed max-w-sm sm:max-w-md">
                            {aboutBanner?.subtitle ? (
                                renderFormattedText(aboutBanner.subtitle)
                            ) : isBannerChecked ? (
                                'To Meet is a cozy bear-themed cafe & playground created for everyone to enjoy sweet treats, good times, and heartwarming moments together.'
                            ) : null}
                        </p>

                        <div className="pt-1.5 flex flex-row items-center gap-2.5 max-w-sm sm:max-w-none">
                            <a
                                href={aboutBanner?.cta_link || "#story"}
                                className="px-4 sm:px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black rounded-full text-[11px] sm:text-xs transition duration-200 shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            >
                                <span>{aboutBanner?.cta_text || 'OUR STORY'}</span>
                                <BearPawIcon className="w-3 h-3 shrink-0" />
                            </a>

                            <Link
                                href="/#locations"
                                className="px-4 sm:px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-[11px] sm:text-xs rounded-full transition flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md whitespace-nowrap"
                            >
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span>VISIT OUR CAFES</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. OUR STORY SECTION                              */}
            {/* ================================================= */}
            <section id="story" className="w-full py-14 lg:py-16 scroll-mt-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/95 rounded-[2.5rem] border border-[#e6ccb2]/80 p-6 sm:p-10 lg:p-12 shadow-2xs">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-6 flex justify-center">
                                <div className="w-full max-w-md bg-white rounded-[2rem] border border-[#e6ccb2] p-3 sm:p-4 shadow-sm relative group">
                                    <div className="absolute -top-3 -left-2 z-20 w-11 h-11 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-md border border-[#e6ccb2]/70 group-hover:scale-105 transition duration-300">
                                        <BearFaceIcon className="w-6 h-6" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 text-[#e85a4f]/25 z-10 pointer-events-none">
                                        <Heart className="w-8 h-8 fill-current" />
                                    </div>
                                    <div className="w-full aspect-[4/3] bg-stone-100 rounded-[1.5rem] overflow-hidden border border-[#e6ccb2]/60 relative shadow-2xs">
                                        <img
                                            src="/img/about-img.png"
                                            alt="To Meet Cafe Story"
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3d2314]/60 via-transparent to-transparent opacity-80" />
                                        <div className="absolute bottom-3 left-4 right-4 z-10 text-white flex items-center justify-between">
                                            <div>
                                                <h4 className="font-black text-xs sm:text-sm tracking-wide uppercase drop-shadow-xs">
                                                    TO MEET CAFE HEAVENLAND PARK
                                                </h4>
                                                <p className="text-[10px] text-stone-200 font-semibold drop-shadow-xs">
                                                    The first warm place we built
                                                </p>
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                                                <BearPawIcon className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 text-[#e85a4f] font-black tracking-widest text-[10.5px] uppercase">
                                    <span>OUR STORY</span>
                                    <BearPawIcon className="w-3.5 h-3.5" />
                                </div>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                    How To Meet Cafe Started
                                </h2>
                                <div className="space-y-2.5 text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                    <p>
                                        To Meet lahir pada tahun 2023 dari sebuah café kecil di Heavenland Park, Sidoarjo dengan satu tujuan sederhana: menghadirkan dessert yang lucu, suasana yang hangat, dan momen yang menyenangkan untuk dinikmati bersama.
                                    </p>
                                    <p>
                                        Seiring waktu, To Meet tumbuh menjadi lebih dari sekedar café. Kami ingin menciptakan tempat di mana keluarga, teman, dan anak-anak bisa berkumpul, bermain, berbagi cerita, dan membawa pulang kenangan manis di setiap kunjungan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* HALAL & QUALITY SECTION                           */}
            {/* ================================================= */}
            <section id="halal-certified" className="w-full py-14 lg:py-16 scroll-mt-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2.5rem] border border-[#e6ccb2]/80 p-6 sm:p-10 lg:p-12 shadow-2xs">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                                <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                    Halal & Quality
                                </h2>
                                <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#5a4232] font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Kami ingin setiap kunjungan ke To Meet terasa nyaman, termasuk saat menikmati menu favoritmu. To Meet telah <span className="font-black text-[#8c5a3c]">bersertifikat halal</span>, dengan pemilihan bahan baku serta proses pengolahan yang mengikuti standar halal dan keamanan pangan.
                                </p>

                                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                                    <div className="bg-[#FAF0E6]/80 border border-[#e6ccb2]/80 px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
                                        <div className="w-6 h-6 rounded-lg bg-white text-[#8c5a3c] flex items-center justify-center shrink-0 border border-[#e6ccb2]/60 shadow-2xs">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-xs font-black text-[#3d2314] uppercase tracking-wide whitespace-nowrap">
                                            Halal Certified
                                        </span>
                                    </div>
                                    <div className="bg-[#FAF0E6]/80 border border-[#e6ccb2]/80 px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
                                        <div className="w-6 h-6 rounded-lg bg-white text-[#8c5a3c] flex items-center justify-center shrink-0 border border-[#e6ccb2]/60 shadow-2xs">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        </div>
                                        <span className="text-xs font-black text-[#3d2314] uppercase tracking-wide whitespace-nowrap">
                                            Quality Ingredients
                                        </span>
                                    </div>
                                    <div className="bg-[#FAF0E6]/80 border border-[#e6ccb2]/80 px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
                                        <div className="w-6 h-6 rounded-lg bg-white text-[#8c5a3c] flex items-center justify-center shrink-0 border border-[#e6ccb2]/60 shadow-2xs">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-black text-[#3d2314] uppercase tracking-wide whitespace-nowrap">
                                            Food Safety & Hygiene
                                        </span>
                                    </div>
                                </div>

                                {/* Logo Halal Indonesia Resmi (Card Persegi Panjang Mendatar / Landscape 2:1) */}
                                <div className="pt-2 flex justify-center lg:justify-start">
                                    
                                        {/* Card Putih Persegi Panjang Ramping Mengikuti Bentuk Logo */}
                                        <div className="w-48 sm:w-56 aspect-[2/1] bg-white rounded-xl  p-2 flex items-center justify-center overflow-hidden">
                                            <img
                                                src="/img/halal-logo.png"
                                                alt="Logo Halal Indonesia Resmi"
                                                className="w-full h-full object-contain block scale-200  transition-transform duration-200"
                                            />
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex flex-col items-center justify-center">
                                <div
                                    onClick={() => setIsHalalModalOpen(true)}
                                    className="group relative cursor-pointer w-full max-w-[260px] sm:max-w-[300px] bg-white p-3 rounded-2xl border border-[#e6ccb2] shadow-md hover:shadow-xl hover:border-[#8c5a3c] transition-all duration-300"
                                >
                                    <div className="relative aspect-[1/1.414] w-full rounded-xl overflow-hidden bg-stone-50 border border-stone-200">
                                        <img
                                            src="/img/sertifikat-halal.jpeg"
                                            alt="Sertifikat Halal To Meet Cafe"
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white">
                                            <div className="w-9 h-9 rounded-full bg-white text-[#8c5a3c] flex items-center justify-center shadow-md">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full">
                                                Lihat Sertifikat
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2.5 pb-0.5 text-center">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-[#3d2314] block">
                                            Sertifikat Halal
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. OUR MISSION & VALUES                           */}
            {/* ================================================= */}
            <section className="w-full py-14 lg:py-16 bg-white/40 border-y border-[#e6ccb2]/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-3 text-center lg:text-left space-y-1.5 lg:flex lg:items-center lg:min-h-full">
                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] tracking-tight leading-tight uppercase pt-2 lg:pt-4">
                                OUR MISSION<br />& VALUES
                                <Heart className="inline-block w-4 h-4 ml-1.5 text-[#e85a4f] fill-[#e85a4f]" />
                            </h2>
                        </div>
                        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3.5">
                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <BearFaceIcon className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">HAPPINESS</h4>
                                <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                    We create happiness in every bite, every sip, and every moment.
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">TOGETHERNESS</h4>
                                <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                    We believe in the joy of being together and building connections.
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <BearPawIcon className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">CREATIVITY</h4>
                                <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                    We inspire creativity through fun experiences, activities, and designs.
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <Utensils className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">QUALITY</h4>
                                <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                    We are committed to quality in our food, service, and environment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. TO MEET UNIVERSE ECOSYSTEM                     */}
            {/* ================================================= */}
            <section className="w-full py-14 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#e6ccb2]/50 pb-4 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-[#e85a4f] tracking-widest uppercase">
                                <span>ECOSYSTEM</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                            <h2 className="text-xl sm:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                TO MEET UNIVERSE
                            </h2>
                            <p className="text-xs sm:text-sm text-[#6c584c] font-semibold max-w-xl">
                                Dunia penuh kehangatan bersama teman beruang, tempat nongkrong nyaman, dan petualangan seru untuk seluruh keluarga.
                            </p>
                        </div>
                        <Link
                            href="/roblox"
                            className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-extrabold rounded-full text-[11px] uppercase tracking-wider transition duration-200 shadow-md shadow-rose-500/20 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                            <span>EXPLORE ROBLOX MAP</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 items-stretch">
                        <Link
                            href="/#locations"
                            className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3.5">
                                <img
                                    src="/img/icon-visit-cafe.png"
                                    alt="Visit Cafe"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="w-full flex flex-col flex-1 justify-between items-center text-center">
                                <div className="min-h-[2.5rem] flex items-center justify-center">
                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-snug">
                                        CAFE & PLAYGROUND
                                    </h4>
                                </div>
                                <div className="flex-1 flex items-start justify-center pt-1.5">
                                    <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                        Cek lokasi To meet terdekat
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/menu"
                            className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3.5">
                                <img
                                    src="/img/icon-menu.png"
                                    alt="Digital Menu"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="w-full flex flex-col flex-1 justify-between items-center text-center">
                                <div className="min-h-[2.5rem] flex items-center justify-center">
                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-snug">
                                        DIGITAL MENU
                                    </h4>
                                </div>
                                <div className="flex-1 flex items-start justify-center pt-1.5">
                                    <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                        Makanan dan minuman lucu yang dibuat dengan penuh cinta.
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/event"
                            className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3.5">
                                <img
                                    src="/img/icon-event.png"
                                    alt="Event & Workshop"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="w-full flex flex-col flex-1 justify-between items-center text-center">
                                <div className="min-h-[2.5rem] flex items-center justify-center">
                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-snug">
                                        EVENT & WORKSHOP
                                    </h4>
                                </div>
                                <div className="flex-1 flex items-start justify-center pt-1.5">
                                    <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                        Aktivitas seru dan workshop interaktif 
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/merchandise"
                            className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3.5">
                                <img
                                    src="/img/icon-merchandise.png"
                                    alt="Merchandise"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="w-full flex flex-col flex-1 justify-between items-center text-center">
                                <div className="min-h-[2.5rem] flex items-center justify-center">
                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-snug">
                                        MERCHANDISE
                                    </h4>
                                </div>
                                <div className="flex-1 flex items-start justify-center pt-1.5">
                                    <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                        Bawa pulang item spesial dari To Meet 
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/roblox"
                            className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3.5">
                                <img
                                    src="/img/icon-roblox.png"
                                    alt="Roblox World"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="w-full flex flex-col flex-1 justify-between items-center text-center">
                                <div className="min-h-[2.5rem] flex items-center justify-center">
                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-snug">
                                        ROBLOX WORLD
                                    </h4>
                                </div>
                                <div className="flex-1 flex items-start justify-center pt-1.5">
                                    <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                        Dunia virtual interaktif dan selesaikan misi seru.
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/birthday"
                            className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3.5">
                                <img
                                    src="/img/icon-birthday.png"
                                    alt="Birthday & Party"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="w-full flex flex-col flex-1 justify-between items-center text-center">
                                <div className="min-h-[2.5rem] flex items-center justify-center">
                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-snug">
                                        BIRTHDAY & PRIVATE EVENT
                                    </h4>
                                </div>
                                <div className="flex-1 flex items-start justify-center pt-1.5">
                                    <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                        Rayakan momen spesial dengan paket perayaan privat.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. WHAT MAKES US SPECIAL & STATS SECTION          */}
            {/* ================================================= */}
            <section className="w-full py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs">
                        <div className="lg:col-span-3 text-center lg:text-left">
                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                WHAT MAKES<br />US SPECIAL?
                                <Sparkles className="inline-block w-5 h-5 ml-1.5 text-[#e85a4f]" />
                            </h2>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                                    <BearFaceIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-xs sm:text-[13px] text-[#3d2314] uppercase tracking-wide">
                                        BEAR THEME
                                    </h4>
                                    <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed">
                                        Our lovable bear friends are everywhere!
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                                    <Smile className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-xs sm:text-[13px] text-[#3d2314] uppercase tracking-wide">
                                        COZY VIBES
                                    </h4>
                                    <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed">
                                        Warm, aesthetic, and instagrammable place.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-xs sm:text-[13px] text-[#3d2314] uppercase tracking-wide">
                                        DELICIOUS TREATS
                                    </h4>
                                    <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed">
                                        Made with love using quality ingredients.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-black text-xs sm:text-[13px] text-[#3d2314] uppercase tracking-wide">
                                        FOR EVERYONE
                                    </h4>
                                    <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed">
                                        Kids, teens, families — all welcome!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#fdf3f1] p-5 sm:p-6 md:p-8 rounded-3xl border border-rose-100 text-center shadow-2xs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6 items-start">
                            <div className="space-y-1.5 flex flex-col justify-start">
                                <div className="flex items-center justify-center gap-1.5 text-[#e85a4f]">
                                    <Star className="w-4 h-4 fill-current shrink-0" />
                                    <span className="text-2xl sm:text-3xl font-black tracking-tight">2+</span>
                                </div>
                                <div className="text-xs sm:text-[13px] font-black text-[#3d2314] uppercase tracking-wide min-h-[2.25rem] md:min-h-0 flex items-center justify-center leading-tight px-1">
                                    YEARS OF HAPPINESS
                                </div>
                                <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed min-h-[2.75rem] md:min-h-0 flex items-start justify-center">
                                    Thank you for being part of our journey!
                                </p>
                            </div>

                            <div className="space-y-1.5 flex flex-col justify-start">
                                <div className="flex items-center justify-center gap-1.5 text-[#e85a4f]">
                                    <Smile className="w-4 h-4 shrink-0" />
                                    <span className="text-2xl sm:text-3xl font-black tracking-tight">50K+</span>
                                </div>
                                <div className="text-xs sm:text-[13px] font-black text-[#3d2314] uppercase tracking-wide min-h-[2.25rem] md:min-h-0 flex items-center justify-center leading-tight px-1">
                                    HAPPY CUSTOMERS
                                </div>
                                <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed min-h-[2.75rem] md:min-h-0 flex items-start justify-center">
                                    We&apos;re grateful for all your love & support!
                                </p>
                            </div>

                            <div className="space-y-1.5 flex flex-col justify-start">
                                <div className="flex items-center justify-center gap-1.5 text-[#e85a4f]">
                                    <BearPawIcon className="w-4 h-4 fill-current shrink-0" />
                                    <span className="text-2xl sm:text-3xl font-black tracking-tight">10+</span>
                                </div>
                                <div className="text-xs sm:text-[13px] font-black text-[#3d2314] uppercase tracking-wide min-h-[2.25rem] md:min-h-0 flex items-center justify-center leading-tight px-1">
                                    EVENTS EACH MONTH
                                </div>
                                <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed min-h-[2.75rem] md:min-h-0 flex items-start justify-center">
                                    Creating fun and memorable experiences!
                                </p>
                            </div>

                            <div className="space-y-1.5 flex flex-col justify-start">
                                <div className="flex items-center justify-center gap-1.5 text-[#e85a4f]">
                                    <Heart className="w-4 h-4 fill-current shrink-0" />
                                    <span className="text-2xl sm:text-3xl font-black tracking-tight">1</span>
                                </div>
                                <div className="text-xs sm:text-[13px] font-black text-[#3d2314] uppercase tracking-wide min-h-[2.25rem] md:min-h-0 flex items-center justify-center leading-tight px-1">
                                    BIG FAMILY
                                </div>
                                <p className="text-xs sm:text-[12.5px] text-[#6c584c] font-semibold leading-relaxed min-h-[2.75rem] md:min-h-0 flex items-start justify-center">
                                    Because To Meet is more than just a place.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 6. BOTTOM CTA SECTION                             */}
            {/* ================================================= */}
            <section className="w-full pb-16 sm:pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <div className="space-y-1.5">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight">
                            Let&apos;s create more sweet memories together!
                        </h3>
                        <p className="text-sm sm:text-base text-[#6c584c] font-semibold leading-relaxed max-w-2xl mx-auto">
                            Come, meet, enjoy, and be part of the To Meet family.
                        </p>
                    </div>

                    <div className="flex justify-center pt-2">
                        <Link
                            href="/visit-us"
                            className="px-7 sm:px-8 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-xs sm:text-sm rounded-full transition duration-200 shadow-md shadow-rose-500/20 inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>VISIT OUR CAFES</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* MODAL SERTIFIKAT HALAL (PERSIS SEPERTI MODAL MENU) */}
            {/* ================================================= */}
            {isHalalModalOpen && (
                <div
                    onClick={handleCloseModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3.5 sm:p-4 overscroll-contain overflow-hidden"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="halal-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl p-4 sm:p-5 border border-[#e6ccb2] shadow-2xl space-y-3.5 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto scrollbar-none"
                    >
                        {/* Tombol Tutup Modal */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition border border-[#e6ccb2]/80 shadow-md cursor-pointer z-20 active:scale-95"
                            aria-label="Tutup Sertifikat"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Wadah Dokumen Sertifikat Halal */}
                        <div className="w-full bg-stone-50 rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative shadow-2xs">
                            <img
                                src="/img/sertifikat-halal.jpeg"
                                alt="Dokumen Sertifikat Halal Resmi To Meet Cafe"
                                className="w-full h-auto object-contain bg-white block"
                            />
                        </div>

                        {/* Info Sertifikat */}
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider block">
                                DOKUMEN RESMI
                            </span>
                            <h3 className="font-black text-[#3d2314] text-base sm:text-lg leading-tight uppercase">
                                SERTIFIKAT HALAL INDONESIA
                            </h3>
                            <p className="text-xs sm:text-[13px] text-[#6c584c] font-semibold leading-relaxed">
                                ID35210033163501125 • CV. SELARAS KOLABORASI MAKMUR
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}