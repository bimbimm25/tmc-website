'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Gamepad2, Play, ExternalLink,
    ThumbsUp, Users, Sparkles,
    Award, Gift, Utensils, X, Info,
    ShieldCheck, AlertCircle, Camera, ShoppingBag,
    CheckCircle2, Compass, Eye, Image as ImageIcon
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function BearPawIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5.7 2.5 1.6 2.5z" />
        </svg>
    );
}

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

export interface RobloxBadgeItem {
    id: number;
    category?: string;
    title?: string;
    badge_name?: string;
    requirement?: string;
    description?: string;
    reward_title?: string;
    image?: string | null;
    is_active?: boolean | number;
}

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
}

const MAP_SCREENSHOTS = [
    {
        id: 1,
        title: 'Bear Park Area',
        tag: 'Main Map',
        image: '/img/roblox/bear-park-roblox.png',
        desc: 'Area utama To Meet Cafe dengan suasana bear park yang estetik dan siap untuk dijelajahi.'
    },
    {
        id: 2,
        title: 'Indoor Cafe',
        tag: 'Indoor Cafe',
        image: '/img/roblox/indoor-cafe-roblox.png',
        desc: 'Jelajahi bagian dalam cafe sambil menyelesaikan misi dan menikmati detail dunia game.'
    },
    {
        id: 3,
        title: 'Obby Area',
        tag: 'Obby Challenge',
        image: '/img/roblox/obby-roblox.png',
        desc: 'Selesaikan misi karier, kumpulkan badge, dan buka reward eksklusif di To Meet Cafe.'
    },
    {
        id: 4,
        title: 'Outdoor Cafe',
        tag: 'Outdoor Cafe',
        image: '/img/roblox/outdoor-cafe-roblox.png',
        desc: 'Area outdoor yang cocok untuk selfie, eksplorasi visual, dan menikmati suasana cafe santai.'
    }
];

export default function RobloxPage() {
    const [badges, setBadges] = useState<RobloxBadgeItem[]>([]);
    const [banner, setBanner] = useState<BannerItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

    async function fetchRobloxData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const res = await fetch(`${API_BASE_URL}/api/roblox-data`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Gagal memuat data');

            const json = await res.json();
            if (json && json.data) {
                if (Array.isArray(json.data)) {
                    setBadges(json.data);
                } else {
                    setBadges(json.data.missions || []);
                    setBanner(json.data.banner || null);
                }
            }
        } catch (error) {
            console.error('Error fetching roblox data:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchRobloxData();
    }, []);

    useEffect(() => {
        if (selectedScreenshot) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            const preventTouch = (e: TouchEvent) => e.preventDefault();
            window.addEventListener('touchmove', preventTouch, { passive: false });

            return () => {
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                window.removeEventListener('touchmove', preventTouch);
            };
        }
    }, [selectedScreenshot]);

    const groupedMissions = useMemo(() => {
        const groups: { [key: string]: RobloxBadgeItem[] } = {};

        badges.forEach((item) => {
            const rawCat = (item.category || 'Career Quest').trim();
            if (!groups[rawCat]) {
                groups[rawCat] = [];
            }
            groups[rawCat].push(item);
        });

        return groups;
    }, [badges]);

    const getCategoryIcon = (categoryName: string) => {
        const lower = categoryName.toLowerCase();
        if (lower.includes('chef') || lower.includes('cook') || lower.includes('kitchen')) {
            return <Utensils className="w-4 h-4 text-[#8c5a3c]" />;
        }
        if (lower.includes('cashier') || lower.includes('kasir')) {
            return <ShoppingBag className="w-4 h-4 text-[#8c5a3c]" />;
        }
        if (lower.includes('obby') || lower.includes('parkour')) {
            return <Gamepad2 className="w-4 h-4 text-[#8c5a3c]" />;
        }
        if (lower.includes('selfie') || lower.includes('photo') || lower.includes('explore')) {
            return <Camera className="w-4 h-4 text-[#8c5a3c]" />;
        }
        return <Award className="w-4 h-4 text-[#8c5a3c]" />;
    };

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `${API_BASE_URL}/storage/${banner.image}`)
        : '/img/hero-home.png';

    const playLink = banner?.cta_link || 'https://www.roblox.com/share?code=47170fa9c8a5b649b293166187e470c0&type=ExperienceDetails&stamp=1785743470866';

    return (
        <div className="min-h-screen space-y-8 sm:space-y-12 pb-16">

            {/* ================================================= */}
            {/* 1. HERO SECTION (RESPONSIF: MOBILE vs DESKTOP)    */}
            {/* ================================================= */}
            <section className="relative w-full min-h-dvh lg:h-screen flex items-center overflow-hidden border-b border-[#e6ccb2]/60 pt-16 pb-4 lg:py-0">
                {/* 1. Background Image Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Roblox Game Experience"
                        className="w-full h-full object-cover object-[75%_center] lg:object-right xl:object-center"
                    />

                    {/* Gradien Putih Sisi Kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 sm:via-white/80 to-transparent w-full sm:w-4/5 lg:w-3/5 xl:w-1/2" />

                    {/* Soft Vignette Bawah di HP */}
                    <div className="block lg:hidden absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 2. Konten Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto flex flex-col justify-center">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-8 items-center">

                        {/* Kolom Teks: Dibungkus Card Ber-Border Rapi di HP */}
                        <div className="lg:col-span-6 text-left">
                            <div className="bg-white/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 sm:p-5 lg:p-0 rounded-3xl lg:rounded-none border border-white/80 lg:border-none shadow-md lg:shadow-none space-y-2.5 sm:space-y-3 max-w-md">

                                {/* Pill Badge */}
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#8c5a3c] text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
                                        <span>ROBLOX UNIVERSE</span>
                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2e170c] tracking-tight leading-[1.15] uppercase">
                                    {renderFormattedText(
                                        banner?.title,
                                        <>
                                            TO MEET <br className="hidden sm:block" />
                                            <span className="text-[#8c5a3c]">IN ROBLOX</span>
                                        </>
                                    )}
                                </h1>

                                {/* Subjudul Rapi dengan Warna Teks Asli */}
                                <p className="text-xs sm:text-[15px] text-[#4a3427] font-semibold leading-relaxed">
                                    {renderFormattedText(
                                        banner?.subtitle,
                                        'Selesaikan misi karier dan tantangan Obby di game Roblox, raih badge penanda prestasi, dan tukarkan reward gratis di To Meet Cafe!'
                                    )}
                                </p>

                                {/* Tombol Aksi Sejajar */}
                                <div className="pt-1 flex flex-row items-center gap-2 sm:gap-2.5">
                                    <a
                                        href={playLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 sm:px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                    >
                                        <Gamepad2 className="w-3.5 h-3.5" />
                                        <span>{banner?.cta_text || 'PLAY ON ROBLOX'}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>

                                    <a
                                        href="#map-gallery"
                                        className="px-4 sm:px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full transition inline-flex items-center gap-1.5 shadow-md cursor-pointer uppercase tracking-wider whitespace-nowrap"
                                    >
                                        <Compass className="w-3.5 h-3.5" />
                                        <span>MAP PREVIEW</span>
                                    </a>
                                </div>

                            </div>
                        </div>

                        {/* Video YouTube Khusus Tampilan HP (Langsung Muncul Bersama Hero) */}
                        <div className="block lg:hidden lg:col-span-6 w-full max-w-md">
                            <div className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-[#e6ccb2]/90 shadow-md space-y-1.5">
                                <div className="flex items-center justify-between px-1">
                                    <span className="inline-flex items-center gap-1.5 text-[9.5px] font-black uppercase text-[#8c5a3c]">
                                        <Play className="w-2.5 h-2.5 text-[#e85a4f] fill-current" />
                                        Official Trailer
                                    </span>
                                    <span className="text-[8px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                                        Roblox Gameplay
                                    </span>
                                </div>

                                <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#e6ccb2]/60 bg-black">
                                    <iframe
                                        src="https://www.youtube.com/embed/eZsAmpeJYPM?si=_y6r7OPCty9zuWj-"
                                        loading="lazy"
                                        title="To Meet Roblox Gameplay Trailer"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 3 Mini Highlight Stats: Presisi Sejajar di Bawah */}
                    <div className="grid grid-cols-3 gap-2 max-w-md text-center pt-3">
                        <div className="bg-white/95 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-[#e6ccb2]/70 shadow-2xs">
                            <div className="text-[11px] font-black text-[#3d2314] leading-none">18.5K</div>
                            <div className="text-[7.5px] text-[#6c584c] font-bold uppercase mt-0.5">Visits</div>
                        </div>

                        <div className="bg-white/95 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-[#e6ccb2]/70 shadow-2xs">
                            <div className="text-[11px] font-black text-emerald-700 leading-none">96%</div>
                            <div className="text-[7.5px] text-[#6c584c] font-bold uppercase mt-0.5">Likes</div>
                        </div>

                        <div className="bg-white/95 backdrop-blur-xs py-1.5 px-2 rounded-xl border border-[#e6ccb2]/70 shadow-2xs">
                            <div className="text-[11px] font-black text-[#8c5a3c] leading-none">3.2K</div>
                            <div className="text-[7.5px] text-[#6c584c] font-bold uppercase mt-0.5">Players</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. TRAILER GAMEPLAY & THEATER SHOWCASE (DESKTOP)  */}
            {/* ================================================= */}
            <section id="trailer-section" className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14">
                <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2.5rem] border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

                        {/* Video Player */}
                        <div className="lg:col-span-7">
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border-2 border-[#e6ccb2]/80 bg-black group">
                                <iframe
                                    src="https://www.youtube.com/embed/eZsAmpeJYPM?si=_y6r7OPCty9zuWj-"
                                    title="To Meet Roblox Gameplay Trailer"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Video Content Overview */}
                        <div className="lg:col-span-5 space-y-3.5 text-center lg:text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF0E6] rounded-full text-[10px] sm:text-xs font-black text-[#8c5a3c] tracking-widest uppercase border border-[#e6ccb2]/80">
                                <Play className="w-3 h-3 fill-current text-[#e85a4f]" />
                                <span>OFFICIAL GAME TRAILER</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                Jelajahi Dunia Virtual <br /> To Meet Cafe!
                            </h2>

                            <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                Tonton cuplikan keseruan game resmi kami di Roblox! Jelajahi bangunan cafe 3D yang autentik, selesaikan rintangan Obby bersama teman, dan kumpulkan badge eksklusif.
                            </p>

                            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                                <a
                                    href={playLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                                >
                                    <Gamepad2 className="w-4 h-4" />
                                    <span>GABUNG SEKARANG</span>
                                </a>
                                <a
                                    href="#map-gallery"
                                    className="px-5 py-2.5 bg-[#FAF0E6] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-black text-xs rounded-full transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer border border-[#e6ccb2]/60"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>LIHAT MAP PREVIEW</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. IN-GAME MAP SCREENSHOTS GALLERY                */}
            {/* ================================================= */}
            <section id="map-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#e6ccb2]/60 pb-3">
                    <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-[#e85a4f] tracking-widest uppercase">
                            <Compass className="w-3.5 h-3.5 text-[#e85a4f]" />
                            <span>MAP EXPLORATION</span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-black text-[#3d2314] tracking-tight uppercase">
                            SNEAK PEEK DI DALAM MAP GAME
                        </h2>
                    </div>
                    <span className="text-xs font-semibold text-[#8c5a3c]">
                        4 Spot Utama di Roblox
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MAP_SCREENSHOTS.map((spot) => (
                        <div
                            key={spot.id}
                            onClick={() => setSelectedScreenshot(spot.image)}
                            className="bg-white rounded-3xl p-3.5 border border-[#e6ccb2]/80 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 flex flex-col justify-between space-y-3 group cursor-pointer"
                        >
                            <div className="w-full aspect-[16/10] bg-[#FAF0E6] rounded-2xl overflow-hidden border border-[#e6ccb2]/60 relative shadow-2xs">
                                <img
                                    src={spot.image}
                                    alt={spot.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                                    {spot.tag}
                                </div>
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center text-white">
                                    <Eye className="w-6 h-6 drop-shadow-md" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase leading-tight line-clamp-1">
                                    {spot.title}
                                </h3>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed line-clamp-2">
                                    {spot.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. DAFTAR MISI PER SECTION                        */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {isLoading && (
                    <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#e6ccb2]/60 p-6">
                        <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs font-bold text-[#8c5a3c]">Memuat misi & badge Roblox...</p>
                    </div>
                )}

                {!isLoading && isError && (
                    <div className="py-10 text-center space-y-2 bg-[#FAF0E6]/50 rounded-3xl border border-rose-200 p-6">
                        <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
                        <p className="text-xs text-[#6c584c] font-semibold">Gagal memuat misi dari server.</p>
                    </div>
                )}

                {!isLoading && !isError && Object.keys(groupedMissions).length === 0 && (
                    <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#e6ccb2]/60 p-6">
                        <Info className="w-6 h-6 text-[#8c5a3c] mx-auto" />
                        <h4 className="text-sm font-black text-[#3d2314] uppercase">Belum Ada Misi Aktif</h4>
                        <p className="text-xs text-[#6c584c]">Misi dan badge terbaru sedang disiapkan.</p>
                    </div>
                )}

                {!isLoading && !isError && Object.keys(groupedMissions).map((categoryKey) => {
                    const missionList = groupedMissions[categoryKey];

                    return (
                        <div
                            key={categoryKey}
                            className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-[#FAF0E6] flex items-center justify-center shrink-0">
                                        {getCategoryIcon(categoryKey)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm sm:text-base text-[#3d2314] uppercase tracking-wide">
                                            {categoryKey}
                                        </h3>
                                        <p className="text-[10.5px] text-[#6c584c] font-semibold">
                                            Selesaikan misi in-game dan tunjukkan badge ke kasir untuk menukarkan reward
                                        </p>
                                    </div>
                                </div>

                                <span className="px-3 py-1 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] font-black uppercase rounded-full border border-[#e6ccb2]/60 shrink-0">
                                    {missionList.length} TANTANGAN
                                </span>
                            </div>

                            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-[#FAF0E6]/50 rounded-xl text-[10px] font-black text-stone-500 uppercase tracking-wider">
                                <div className="col-span-4">Badge</div>
                                <div className="col-span-5">Mission</div>
                                <div className="col-span-3 text-right">Reward</div>
                            </div>

                            <div className="space-y-2.5">
                                {missionList.map((item) => {
                                    const badgeImg = item.image
                                        ? (item.image.startsWith('http')
                                            ? item.image
                                            : item.image.startsWith('/img')
                                                ? item.image
                                                : `${API_BASE_URL}/storage/${item.image}`)
                                        : '/img/badge-default.png';

                                    const badgeTitle = item.badge_name || item.title || 'Badge Target';
                                    const missionRequirement = item.requirement || item.description || 'Selesaikan tantangan di map';
                                    const cafeReward = item.reward_title || 'Free Reward';

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-[#FAF0E6]/60 p-3.5 sm:p-4 rounded-2xl border border-[#e6ccb2]/70 hover:border-[#8c5a3c] transition duration-150 flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 sm:gap-4"
                                        >
                                            <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 border border-[#e6ccb2]/80 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                                                    <img
                                                        src={badgeImg}
                                                        alt={badgeTitle}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                <div className="min-w-0 space-y-0.5">
                                                    <span className="text-[8.5px] font-black text-[#8c5a3c] uppercase tracking-wider block">
                                                        BADGE
                                                    </span>
                                                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] leading-snug truncate">
                                                        {badgeTitle}
                                                    </h4>
                                                </div>
                                            </div>

                                            <div className="md:col-span-5 border-t md:border-t-0 border-[#e6ccb2]/50 pt-2 md:pt-0 space-y-0.5">
                                                <span className="text-[8.5px] font-black text-stone-400 uppercase tracking-wider block md:hidden">
                                                    MISSION:
                                                </span>
                                                <p className="text-xs font-black text-[#3d2314] leading-snug">
                                                    {missionRequirement}
                                                </p>
                                            </div>

                                            <div className="md:col-span-3 border-t md:border-t-0 border-[#e6ccb2]/50 pt-2 md:pt-0 flex items-center justify-between md:justify-end gap-2 text-right">
                                                <span className="text-[8.5px] font-bold text-stone-400 uppercase block md:hidden">REWARD</span>
                                                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-black rounded-lg shadow-2xs">
                                                    <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>{cafeReward}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

            </section>

            {/* ================================================= */}
            {/* 5. ATURAN & CARA KLAIM REWARD OFFLINE DI CAFE     */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <ShieldCheck className="w-5 h-5 text-[#e85a4f]" />
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            CARA KLAIM HADIAH LANGSUNG DI OUTLET TO MEET CAFE
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                1
                            </div>
                            <div>
                                <h4 className="font-black text-xs text-[#3d2314]">Selesaikan Misi Game</h4>
                                <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                    Mainkan game To Meet Universe di Roblox dan selesaikan misi sampai badge terbuka di profilmu.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                2
                            </div>
                            <div>
                                <h4 className="font-black text-xs text-[#3d2314]">Tunjukkan Profil ke Kasir</h4>
                                <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                    Kunjungi outlet To Meet Cafe dan perlihatkan badge Roblox yang sudah berhasil didapatkan kepada staff kasir dan bawa id Roblox mu.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/50 space-y-1.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                3
                            </div>
                            <div>
                                <h4 className="font-black text-xs text-[#3d2314]">Nikmati Hadiah Gratis</h4>
                                <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                    Staff kami akan memverifikasi dan langsung menyerahkan reward sesuai misi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 6. MODAL PREVIEW SCREENSHOT IMAGE                 */}
            {/* ================================================= */}
            {selectedScreenshot && (
                <div
                    onClick={() => setSelectedScreenshot(null)}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overscroll-contain"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border border-[#e6ccb2]"
                    >
                        <button
                            onClick={() => setSelectedScreenshot(null)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center z-10 hover:bg-black transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="w-full aspect-[16/10] bg-stone-900 flex items-center justify-center">
                            <img
                                src={selectedScreenshot}
                                alt="Map Preview"
                                className="w-full h-full object-contain select-none"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}