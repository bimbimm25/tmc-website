'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Gamepad2, Play, ExternalLink,
    ThumbsUp, Users, Monitor, Sparkles,
    Heart, Award, Phone, Gift, Coffee, Utensils, X, Info,
    ShieldCheck, CheckCircle2, Lock, AlertCircle, Target, ArrowRight
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

function VerifiedCheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="#2563eb">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
    );
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

export default function RobloxPage() {
    const [badges, setBadges] = useState<RobloxBadgeItem[]>([]);
    const [banner, setBanner] = useState<BannerItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

    // Modal Kirim Bukti Klaim State
    const [selectedBadgeToClaim, setSelectedBadgeToClaim] = useState<RobloxBadgeItem | null>(null);
    const [robloxUsername, setRobloxUsername] = useState<string>('');
    const [whatsappNumber, setWhatsappNumber] = useState<string>('');
    const [proofImage, setProofImage] = useState<File | null>(null);
    const [isSubmittingClaim, setIsSubmittingClaim] = useState<boolean>(false);
    const [claimSuccessData, setClaimSuccessData] = useState<{ claim_code: string } | null>(null);

    async function fetchRobloxData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const res = await fetch('http://127.0.0.1:8000/api/roblox-data', { cache: 'no-store' });
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

    const categories = useMemo(() => {
        if (badges.length === 0) return ['all'];
        const unique = Array.from(new Set(badges.map(b => b.category || 'Career Quest').filter(Boolean)));
        return ['all', ...unique];
    }, [badges]);

    const filteredBadges = useMemo(() => {
        if (selectedCategory === 'all') return badges;
        return badges.filter(b => (b.category || 'Career Quest') === selectedCategory);
    }, [badges, selectedCategory]);

    async function handleClaimSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedBadgeToClaim || !proofImage) return;

        try {
            setIsSubmittingClaim(true);
            const formData = new FormData();
            formData.append('roblox_mission_id', selectedBadgeToClaim.id.toString());
            formData.append('roblox_username', robloxUsername);
            formData.append('whatsapp_number', whatsappNumber);
            formData.append('proof_image', proofImage);

            const res = await fetch('http://127.0.0.1:8000/api/roblox/claim', {
                method: 'POST',
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.message || 'Gagal mengirim bukti klaim.');
            }

            setClaimSuccessData(json.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert('Terjadi kesalahan saat mengirim bukti klaim.');
            }
        } finally {
            setIsSubmittingClaim(false);
        }
    }

    function closeClaimModal() {
        setSelectedBadgeToClaim(null);
        setRobloxUsername('');
        setWhatsappNumber('');
        setProofImage(null);
        setClaimSuccessData(null);
    }

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `http://127.0.0.1:8000/storage/${banner.image}`)
        : '/img/hero-home.png';

    const playLink = banner?.cta_link || 'https://www.roblox.com';

    return (
        <div className="bg-[#faf6f0] min-h-screen space-y-8 sm:space-y-12 pb-12">

            {/* ================================================= */}
            {/* 1. HERO SECTION                                   */}
            {/* ================================================= */}
            <section className="w-full relative min-h-[100dvh] lg:h-screen lg:max-h-[760px] flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-6 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                        <div className="lg:col-span-6 space-y-4 text-center lg:text-left order-2 lg:order-1">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#8c5a3c] text-[10px] sm:text-xs font-black tracking-wider uppercase border border-[#e6ccb2]/80">
                                    <span>WELCOME TO ROBLOX WORLD</span>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                </div>

                                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                                    {banner?.title || (
                                        <>
                                            To Meet<br />
                                            <span className="text-[#8c5a3c]">Universe</span>
                                        </>
                                    )}
                                </h1>
                            </div>

                            <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed max-w-md mx-auto lg:mx-0">
                                {banner?.subtitle || 'Selesaikan misi karier dan tantangan Obby di game Roblox, raih badge penanda prestasi, dan tukarkan reward gratis di To Meet Cafe!'}
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 pt-1">
                                <a
                                    href={playLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                                >
                                    <Gamepad2 className="w-4 h-4" />
                                    <span>{banner?.cta_text || 'PLAY ON ROBLOX'}</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                <button
                                    onClick={() => setIsPlayingVideo(true)}
                                    className="px-5 py-3 bg-white hover:bg-[#faf6f0] text-[#3d2314] font-black text-xs rounded-full border border-[#e6ccb2] transition inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer uppercase tracking-wider"
                                >
                                    <Play className="w-3.5 h-3.5 fill-current text-[#e85a4f]" />
                                    <span>WATCH TRAILER</span>
                                </button>
                            </div>

                            <div className="pt-2 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-amber-500 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-black text-[#3d2314] leading-none">18.5K</div>
                                        <div className="text-[9px] font-bold text-[#6c584c] uppercase tracking-wider mt-0.5">Visits</div>
                                    </div>
                                </div>

                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-emerald-600 flex items-center justify-center shrink-0">
                                        <ThumbsUp className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-black text-[#3d2314] leading-none">96%</div>
                                        <div className="text-[9px] font-bold text-[#6c584c] uppercase tracking-wider mt-0.5">Likes</div>
                                    </div>
                                </div>

                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-black text-[#3d2314] leading-none">3.2K</div>
                                        <div className="text-[9px] font-bold text-[#6c584c] uppercase tracking-wider mt-0.5">Players</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end relative">
                            <div className="relative w-full max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-3 border-white">
                                <img
                                    src={heroImage}
                                    alt="To Meet Roblox Game Experience"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. TAB FILTER ROLE & KATEGORI                     */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-3 border-b border-[#e6ccb2]/60 pb-3">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                        <Award className="w-5 h-5 text-[#8c5a3c]" />
                        <h2>CAREER QUESTS & BADGE REWARDS</h2>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black transition tracking-wider shrink-0 cursor-pointer uppercase ${selectedCategory === cat
                                        ? 'bg-[#8c5a3c] text-white shadow-xs'
                                        : 'bg-[#faf6f0] text-[#6c584c] hover:bg-[#f4ece1] border border-[#e6ccb2]/60'
                                    }`}
                            >
                                {cat === 'all' ? 'SEMUA ROLE' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. DUAL-CARD: CURRENT MISSIONS vs BADGES          */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* SISI KIRI: CURRENT MISSIONS (INSTRUKSI TUGAS JELAS) */}
                    <div className="lg:col-span-6 bg-[#fffcf7] p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                            <div className="flex items-center gap-2 text-sm font-black text-[#3d2314] uppercase">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <h2>CURRENT MISSIONS</h2>
                            </div>
                            <span className="text-[10px] font-black text-[#8c5a3c] uppercase">
                                {filteredBadges.length} TANTANGAN AKTIF
                            </span>
                        </div>

                        {isLoading && (
                            <div className="py-12 text-center space-y-2">
                                <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-[10px] font-bold text-[#8c5a3c]">Memuat misi game...</p>
                            </div>
                        )}

                        {!isLoading && isError && (
                            <div className="py-8 text-center space-y-2 bg-[#faf6f0] rounded-2xl border border-rose-200 p-4">
                                <AlertCircle className="w-5 h-5 text-rose-600 mx-auto" />
                                <p className="text-xs text-[#6c584c] font-semibold">Gagal memuat misi dari server.</p>
                            </div>
                        )}

                        {!isLoading && !isError && filteredBadges.length === 0 && (
                            <div className="py-12 text-center space-y-2 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 p-6 my-auto">
                                <Info className="w-6 h-6 text-[#8c5a3c] mx-auto" />
                                <h4 className="text-xs font-black text-[#3d2314] uppercase">Belum Ada Misi di Kategori Ini</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold">Tantangan baru akan segera hadir!</p>
                            </div>
                        )}

                        {!isLoading && !isError && filteredBadges.length > 0 && (
                            <div className="space-y-3 flex-1">
                                {filteredBadges.map((item) => {
                                    // Mengambil teks syarat murni yang diinput di dashboard admin
                                    const syaratTeks = item.requirement && item.requirement !== item.badge_name
                                        ? item.requirement
                                        : (item.description && item.description !== item.badge_name ? item.description : 'Selesaikan tantangan di map');

                                    const namaBadge = item.badge_name || item.title || 'Badge Target';
                                    const hadiahCafe = item.reward_title || 'Free Reward';

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2.5 hover:border-[#8c5a3c] transition duration-150"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    {/* Kategori Role & Target Badge */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-[#f4ece1] text-[#8c5a3c] text-[8.5px] font-black uppercase rounded-md shrink-0">
                                                            {item.category || 'CHEF CAREER'}
                                                        </span>
                                                        <span className="text-[11px] font-extrabold text-[#8c5a3c] truncate">
                                                            Target: {namaBadge}
                                                        </span>
                                                    </div>

                                                    {/* Teks Syarat Pencapaian Game dari Dashboard Admin */}
                                                    <div className="pt-0.5">
                                                        <p className="text-xs sm:text-[13px] text-[#3d2314] font-black leading-snug">
                                                            Syarat: <span className="text-[#e85a4f] underline decoration-[#e6ccb2] font-black">{syaratTeks}</span>
                                                        </p>
                                                    </div>

                                                    {/* Hadiah di Cafe */}
                                                    <div className="text-[10.5px] text-[#6c584c] font-semibold">
                                                        Hadiah di Cafe: <span className="text-emerald-700 font-bold">{hadiahCafe}</span>
                                                    </div>
                                                </div>

                                                {/* Tombol Klaim */}
                                                <button
                                                    onClick={() => setSelectedBadgeToClaim(item)}
                                                    className="px-4 py-2 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[10px] rounded-xl transition shrink-0 uppercase tracking-wider shadow-2xs cursor-pointer flex items-center gap-1.5"
                                                >
                                                    <Gift className="w-3.5 h-3.5" />
                                                    <span>KLAIM</span>
                                                </button>
                                            </div>

                                            {/* Progress Bar Visual */}
                                            <div className="w-full bg-[#e6ccb2]/60 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-[#8c5a3c] h-full w-[60%] rounded-full" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="p-3 bg-[#fdf3f1] border border-rose-200/80 rounded-2xl text-[10px] text-[#5a4232] font-semibold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#e85a4f] shrink-0" />
                            <span>Selesaikan misi di game $\rightarrow$ Upload screenshot bukti $\rightarrow$ Dapatkan badge & hadiah fisik di outlet To Meet Cafe!</span>
                        </div>
                    </div>

                    {/* SISI KANAN: REWARDS & BADGES (PENANDA PENCAPAIAN EMBLEM) */}
                    <div className="lg:col-span-6 bg-[#fffcf7] p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                            <div className="flex items-center gap-2 text-sm font-black text-[#3d2314] uppercase">
                                <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                                <h2>REWARDS & BADGES</h2>
                            </div>
                            <span className="text-[10px] font-black text-[#8c5a3c] uppercase">
                                {filteredBadges.length} EMBLEM
                            </span>
                        </div>

                        {!isLoading && !isError && filteredBadges.length === 0 && (
                            <div className="py-12 text-center space-y-2 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 p-6 my-auto">
                                <Award className="w-6 h-6 text-[#8c5a3c] mx-auto" />
                                <h4 className="text-xs font-black text-[#3d2314] uppercase">Belum Ada Badge</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold">Badge reward sedang disiapkan.</p>
                            </div>
                        )}

                        {!isLoading && !isError && filteredBadges.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                                {filteredBadges.map((badge) => {
                                    const badgeImage = badge.image
                                        ? (badge.image.startsWith('http')
                                            ? badge.image
                                            : badge.image.startsWith('/img')
                                                ? badge.image
                                                : `http://127.0.0.1:8000/storage/${badge.image}`)
                                        : '/img/badge-default.png';

                                    const badgeName = badge.badge_name || badge.title || 'Badge Target';
                                    const syaratBadge = badge.requirement || badge.description || 'Selesaikan Misi';
                                    const rewardBadge = badge.reward_title || 'Reward Cafe';

                                    return (
                                        <div
                                            key={badge.id}
                                            className="bg-[#faf6f0] p-3 rounded-2xl border border-[#e6ccb2]/70 text-center space-y-2 flex flex-col justify-between group hover:border-[#8c5a3c] transition duration-200"
                                        >
                                            <div className="w-16 h-16 mx-auto bg-white rounded-full p-1.5 border border-[#e6ccb2]/60 shadow-xs flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-200">
                                                <img
                                                    src={badgeImage}
                                                    alt={badgeName}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="space-y-0.5">
                                                <h4 className="font-black text-xs text-[#3d2314] truncate">
                                                    {badgeName}
                                                </h4>
                                                <div className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded px-1 py-0.5 truncate">
                                                    {rewardBadge}
                                                </div>
                                            </div>

                                            <div className="text-[8.5px] font-bold text-[#8c5a3c] uppercase tracking-wider pt-1 border-t border-[#e6ccb2]/40">
                                                Syarat: {syaratBadge}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="bg-[#f4ece1] p-3 rounded-2xl text-center text-xs font-black text-[#3d2314] border border-[#e6ccb2] flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Kumpulkan seluruh badge dan jadilah To Meet Master!</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 4. ATURAN KLAIM REWARD DI CAFE                    */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <ShieldCheck className="w-5 h-5 text-[#e85a4f]" />
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            ATURAN & CARA KLAIM REWARD DI TO MEET CAFE
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                1
                            </div>
                            <div>
                                <h4 className="font-black text-xs text-[#3d2314]">Tunjukkan ID Roblox</h4>
                                <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                    Bawa akun Roblox milikmu saat berkunjung ke outlet To Meet Cafe.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                2
                            </div>
                            <div>
                                <h4 className="font-black text-xs text-[#3d2314]">Tunjukkan Kode Klaim</h4>
                                <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                    Tunjukkan bukti perolehan badge atau kode klaim yang sudah diverifikasi ke kasir.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5 flex items-start gap-3">
                            <div className="w-7 h-7 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                3
                            </div>
                            <div>
                                <h4 className="font-black text-xs text-[#3d2314]">1x Akun Per Badge</h4>
                                <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                    Setiap reward berlaku untuk 1 kali penukaran per akun Roblox untuk tiap tingkatan badge.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. MODAL FORM SUBMIT BUKTI KLAIM                   */}
            {/* ================================================= */}
            {selectedBadgeToClaim && (
                <div
                    onClick={() => !isSubmittingClaim && closeClaimModal()}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#fffcf7] w-full max-w-md rounded-3xl p-6 border border-[#e6ccb2] shadow-2xl space-y-4 relative my-auto"
                    >
                        <button
                            onClick={closeClaimModal}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f4ece1] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                FORM KLAIM REWARD CAFE
                            </span>
                            <h3 className="font-black text-lg text-[#3d2314]">
                                {selectedBadgeToClaim.badge_name || selectedBadgeToClaim.title}
                            </h3>
                            <p className="text-[11px] text-[#6c584c] font-semibold">
                                Syarat: <span className="text-[#3d2314] font-bold">{selectedBadgeToClaim.requirement || selectedBadgeToClaim.description}</span> •
                                Reward: <span className="text-emerald-700 font-bold">{selectedBadgeToClaim.reward_title}</span>
                            </p>
                        </div>

                        {claimSuccessData ? (
                            <div className="py-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                                <h4 className="font-black text-sm text-emerald-900">Bukti Berhasil Dikirim!</h4>
                                <p className="text-xs text-emerald-700 font-medium">
                                    Simpan dan tunjukkan kode klaim berikut ke staff kasir To Meet Cafe saat penukaran:
                                </p>
                                <div className="px-5 py-2.5 bg-white rounded-xl border border-emerald-300 font-mono text-base font-black text-emerald-800 inline-block shadow-2xs tracking-widest">
                                    {claimSuccessData.claim_code}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleClaimSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                                        Username / ID Akun Roblox
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={robloxUsername}
                                        onChange={(e) => setRobloxUsername(e.target.value)}
                                        placeholder="Contoh: BearChef_99"
                                        className="w-full bg-[#faf6f0] border border-[#e6ccb2] rounded-xl px-3 py-2 text-xs font-semibold text-[#3d2314] focus:outline-none focus:border-[#8c5a3c]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                                        Nomor WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        placeholder="08123456789"
                                        className="w-full bg-[#faf6f0] border border-[#e6ccb2] rounded-xl px-3 py-2 text-xs font-semibold text-[#3d2314] focus:outline-none focus:border-[#8c5a3c]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                                        Screenshot Bukti In-Game
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*"
                                        onChange={(e) => e.target.files && setProofImage(e.target.files[0])}
                                        className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#f4ece1] file:text-[#8c5a3c] hover:file:bg-amber-100 transition cursor-pointer"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingClaim}
                                        className="w-full py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmittingClaim ? 'MENGIRIM BUKTI...' : 'KIRIM BUKTI KLAIM'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* 6. MODAL TRAILER VIDEO                            */}
            {/* ================================================= */}
            {isPlayingVideo && (
                <div
                    onClick={() => setIsPlayingVideo(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-black w-full max-w-3xl aspect-video rounded-3xl overflow-hidden shadow-2xl relative border border-stone-800"
                    >
                        <button
                            onClick={() => setIsPlayingVideo(false)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center z-10 hover:bg-black transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <iframe
                            src="https://www.youtube.com/embed/EpK4HAGh1zc?autoplay=1"
                            title="To Meet Roblox Gameplay Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                </div>
            )}

        </div>
    );
}