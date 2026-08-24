'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Phone, Users, Clock, Sparkles, Heart, Utensils,
    Camera, Home, Palette, ShieldCheck, Check,
    Plus, ChevronRight, X, AlertCircle, RefreshCw,
    ImageOff, CalendarCheck, MessageSquare, CreditCard, Smile,
    Info, Gift
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

export interface BirthdayPackageItem {
    id: number;
    title: string;
    description?: string | null;
    capacity?: string | number | null;
    price: number;
    image?: string | null;
    location_name?: string | null;
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

function FormatDescription({ text }: { text?: string | null }) {
    if (!text) return <span>Paket ulang tahun lengkap dan seru di To Meet Cafe.</span>;

    const cleanText = text.replace(/<br\s*\/?>/gi, '\n');
    const lines = cleanText.split('\n');

    return (
        <div className="space-y-1.5 text-left">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
                    const content = trimmed.replace(/^[-*•]\s*/, '');
                    return (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#5a4232] font-semibold leading-relaxed">
                            <BearPawIcon className="w-3 h-3 text-[#8c5a3c] shrink-0 mt-0.5" />
                            <span>{content}</span>
                        </div>
                    );
                }

                return (
                    <p key={idx} className="text-xs text-[#5a4232] font-semibold leading-relaxed">
                        {trimmed}
                    </p>
                );
            })}
        </div>
    );
}

export default function BirthdayPage() {
    const [packages, setPackages] = useState<BirthdayPackageItem[]>([]);
    const [banner, setBanner] = useState<BannerItem | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<BirthdayPackageItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    async function fetchBirthdayData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const [resBirthdays, resBanner] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/birthdays', { cache: 'no-store' }),
                fetch('http://127.0.0.1:8000/api/banners/birthday', { cache: 'no-store' }).catch(() => null)
            ]);

            if (!resBirthdays.ok) {
                const resEvents = await fetch('http://127.0.0.1:8000/api/events', { cache: 'no-store' });
                if (resEvents.ok) {
                    const jsonEvents = await resEvents.json();
                    const filtered = (jsonEvents.data || []).filter((item: any) =>
                        item.type === 'birthday_package' || (item.category && item.category.toLowerCase().includes('birthday'))
                    );
                    setPackages(filtered);
                }
            } else {
                const json = await resBirthdays.json();
                if (json && json.data) {
                    if (Array.isArray(json.data)) {
                        setPackages(json.data);
                    } else {
                        setPackages(json.data.packages || []);
                        setBanner(json.data.banner || null);
                    }
                }
            }

            if (resBanner && resBanner.ok) {
                const jsonB = await resBanner.json();
                if (jsonB.data) setBanner(jsonB.data);
            }
        } catch (error) {
            console.error('Gagal memuat data birthday:', error);
            setIsError(true);
            setPackages([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBirthdayData();
    }, []);

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `http://127.0.0.1:8000/storage/${banner.image}`)
        : '/img/hero-home.png';

    const defaultBookingLink = "https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20tertarik%20untuk%20booking%20paket%20Birthday%20&%20Private%20Event";

    return (
        <div className="bg-[#faf6f0] min-h-screen space-y-10 sm:space-y-16 pb-16">

            {/* 1. HERO BIRTHDAY SECTION */}
            <section className="w-full relative min-h-dvh lg:h-screen lg:max-h-190 flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-6 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-2 lg:order-1">
                            <div className="space-y-2">
                                <span className="text-[10px] sm:text-xs font-black text-[#8c5a3c] tracking-widest uppercase block">
                                    MAKE EVERY MOMENT SPECIAL
                                </span>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-[1.1] uppercase">
                                    Birthday &<br />
                                    <span>Private Event</span><br />
                                    <span className="text-[#8c5a3c] text-2xl sm:text-3xl lg:text-4xl font-extrabold normal-case tracking-normal">
                                        at To Meet
                                    </span>
                                </h1>
                            </div>

                            <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed max-w-md mx-auto lg:mx-0">
                                {banner?.subtitle || 'Rayakan hari spesial si kecil di dunia beruang yang hangat dan ceria! Kami siapkan seluruh detail dekorasi dan makanan, Anda cukup menikmati momen bahagianya.'}
                            </p>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0 pt-1">
                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 text-center space-y-1">
                                    <div className="w-7 h-7 rounded-xl bg-[#f4ece1] text-[#e85a4f] mx-auto flex items-center justify-center">
                                        <Heart className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                    <div className="text-[10px] font-black text-[#3d2314]">Cute Bear Theme</div>
                                </div>
                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 text-center space-y-1">
                                    <div className="w-7 h-7 rounded-xl bg-[#f4ece1] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                        <Utensils className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="text-[10px] font-black text-[#3d2314]">Yummy Food & Drinks</div>
                                </div>
                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 text-center space-y-1">
                                    <div className="w-7 h-7 rounded-xl bg-[#f4ece1] text-amber-600 mx-auto flex items-center justify-center">
                                        <Camera className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="text-[10px] font-black text-[#3d2314]">Memorable Moments</div>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                <a
                                    href={banner?.cta_link || defaultBookingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-7 py-3.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-current" />
                                    <span>{banner?.cta_text || 'BOOK VIA WHATSAPP'}</span>
                                </a>
                                <span className="text-xs font-bold text-[#8c5a3c]">Let&apos;s plan your special day!</span>
                            </div>
                        </div>

                        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center lg:items-end space-y-3">
                            <div className="relative w-full max-w-md lg:max-w-lg aspect-16/11 rounded-3xl overflow-hidden shadow-xl border-3 border-white">
                                <img
                                    src={heroImage}
                                    alt="Birthday and Private Event at To Meet Cafe"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            <div className="w-full max-w-md lg:max-w-lg bg-[#fffcf7] p-3 rounded-2xl border border-[#e6ccb2]/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-black text-[#3d2314]">
                                <div className="flex items-center gap-1.5 justify-center">
                                    <Home className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>Spacious Space</span>
                                </div>
                                <div className="flex items-center gap-1.5 justify-center">
                                    <Palette className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>Custom Decor</span>
                                </div>
                                <div className="flex items-center gap-1.5 justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>Playground</span>
                                </div>
                                <div className="flex items-center gap-1.5 justify-center">
                                    <Smile className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>Friendly Staff</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. OUR PACKAGES & WHAT'S INCLUDED */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            OUR PACKAGES
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        <div className="lg:col-span-8">
                            {isLoading && (
                                <div className="py-16 text-center space-y-2 bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/60 p-6">
                                    <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs font-bold text-[#8c5a3c]">Memuat paket birthday...</p>
                                </div>
                            )}

                            {!isLoading && isError && (
                                <div className="py-12 text-center space-y-2.5 bg-[#faf6f0] rounded-3xl border border-rose-200 p-6">
                                    <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
                                    <h4 className="font-black text-xs text-[#3d2314]">Gagal Memuat Paket</h4>
                                    <button
                                        onClick={fetchBirthdayData}
                                        className="px-4 py-1.5 bg-[#8c5a3c] text-white text-xs font-bold rounded-full cursor-pointer"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            )}

                            {!isLoading && !isError && packages.length === 0 && (
                                <div className="py-16 text-center space-y-2 bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/60 p-6">
                                    <Info className="w-6 h-6 text-[#8c5a3c] mx-auto" />
                                    <h4 className="font-black text-sm text-[#3d2314]">Belum Ada Paket Birthday</h4>
                                    <p className="text-xs text-[#6c584c]">Paket perayaan sedang disiapkan oleh tim To Meet Cafe.</p>
                                </div>
                            )}

                            {!isLoading && !isError && packages.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {packages.map((pkg, idx) => {
                                        const pkgImage = pkg.image
                                            ? (pkg.image.startsWith('http')
                                                ? pkg.image
                                                : pkg.image.startsWith('/img')
                                                    ? pkg.image
                                                    : `http://127.0.0.1:8000/storage/${pkg.image}`)
                                            : '/img/hero-home.png';

                                        return (
                                            <div
                                                key={pkg.id}
                                                className="bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#8c5a3c] transition duration-200"
                                            >
                                                <div>
                                                    <div className="relative w-full aspect-4/3 bg-stone-100 overflow-hidden">
                                                        <img
                                                            src={pkgImage}
                                                            alt={pkg.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-3 left-3 bg-[#3d2314]/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                            {idx === 0 ? 'BASIC' : idx === 1 ? 'DELUXE' : 'PREMIUM'}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 space-y-3">
                                                        <div>
                                                            <h3 className="font-black text-sm text-[#3d2314] leading-tight">
                                                                {pkg.title}
                                                            </h3>
                                                            {pkg.capacity && (
                                                                <span className="text-[10px] font-bold text-[#8c5a3c] mt-0.5 block">
                                                                    Kapasitas hingga {pkg.capacity} Tamu
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1.5 border-t border-[#e6ccb2]/50 pt-2.5">
                                                            <FormatDescription text={pkg.description} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 pt-0 border-t border-[#e6ccb2]/40 space-y-2 mt-2">
                                                    <div>
                                                        <span className="text-[9px] font-bold text-[#8c5a3c] uppercase block">Start from</span>
                                                        <span className="font-black text-sm sm:text-base text-[#3d2314]">
                                                            Rp {new Intl.NumberFormat('id-ID').format(pkg.price)}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => setSelectedPackage(pkg)}
                                                        className="w-full py-2 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-xl transition text-center uppercase tracking-wider shadow-2xs cursor-pointer"
                                                    >
                                                        DETAILS
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4 bg-[#fffcf7] p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2">
                                <BearFaceIcon className="w-5 h-5 text-[#8c5a3c]" />
                                <h3 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">
                                    WHAT&apos;S INCLUDED?
                                </h3>
                            </div>

                            <div className="space-y-2.5 text-xs text-[#5a4232] font-bold">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Exclusive Event Area Access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Custom Setup Tables & Chairs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Bear Theme Decoration Setup</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Delicious Food & Drinks Package</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Audio & Sound System Provided</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Dedicated Staff & Event Assistance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Full Clean Up Service</span>
                                </div>
                            </div>

                            <div className="p-3 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 text-center">
                                <p className="text-[11px] font-bold text-[#8c5a3c]">
                                    We can customize packages based on your personal needs!
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. OUR SPACES & ADD-ON SERVICES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                            <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                            <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                                OUR SPACES
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-2">
                                <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                                    <img src="/img/hero-home.png" alt="Indoor Area" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs text-[#3d2314]">INDOOR AREA</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold leading-tight mt-0.5">Cozy space for dining and celebration.</p>
                                </div>
                            </div>

                            <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-2">
                                <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                                    <img src="/img/hero-home.png" alt="Playground" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs text-[#3d2314]">PLAYGROUND</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold leading-tight mt-0.5">Fun & safe playground for kids.</p>
                                </div>
                            </div>

                            <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-2">
                                <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                                    <img src="/img/hero-home.png" alt="Private Room" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs text-[#3d2314]">PRIVATE ROOM (L2)</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold leading-tight mt-0.5">More private space for special moments.</p>
                                </div>
                            </div>

                            <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-2">
                                <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                                    <img src="/img/hero-home.png" alt="Outdoor Area" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs text-[#3d2314]">OUTDOOR AREA</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold leading-tight mt-0.5">Great for casual gathering and small events.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-[#fffcf7] p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                        <h3 className="font-black text-sm text-[#e85a4f] uppercase tracking-wide">
                            ADD-ON SERVICES
                        </h3>

                        <div className="space-y-2 text-xs text-[#5a4232] font-bold">
                            <div className="flex items-center gap-2 p-1.5 bg-[#faf6f0] rounded-xl">
                                <Palette className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Face Painting Activity</span>
                            </div>
                            <div className="flex items-center gap-2 p-1.5 bg-[#faf6f0] rounded-xl">
                                <Sparkles className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Balloon Decoration Gate</span>
                            </div>
                            <div className="flex items-center gap-2 p-1.5 bg-[#faf6f0] rounded-xl">
                                <Gift className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Custom Goodie Bags</span>
                            </div>
                            <div className="flex items-center gap-2 p-1.5 bg-[#faf6f0] rounded-xl">
                                <Camera className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Photobooth & Documentation</span>
                            </div>
                            <div className="flex items-center gap-2 p-1.5 bg-[#faf6f0] rounded-xl">
                                <Heart className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Custom Birthday Cake</span>
                            </div>
                        </div>

                        <a
                            href="https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20detail%20Add-On%20Services%20Birthday"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-xl transition text-center uppercase tracking-wider block shadow-2xs"
                        >
                            SEE ALL ADD-ONS
                        </a>
                    </div>

                </div>
            </section>

            {/* 4. HOW TO BOOK */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-5 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            HOW TO BOOK
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                1
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Contact Us</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Chat with us via WhatsApp to check availability.</p>
                        </div>

                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                2
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                <CalendarCheck className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Choose Date & Package</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Select your preferred date and birthday package.</p>
                        </div>

                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                3
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Confirm & Pay Deposit</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">We&apos;ll confirm your booking after the deposit.</p>
                        </div>

                        <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                4
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                <BearFaceIcon className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Enjoy Your Day!</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">We&apos;ll handle the rest, you make sweet memories!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. BOTTOM CTA BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fdf3f1] p-6 sm:p-10 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="space-y-1 max-w-lg">
                        <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] tracking-tight">
                            Ready to plan an unforgettable celebration?
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6c584c] font-semibold">
                            Let&apos;s make your special day extra special at To Meet!
                        </p>
                    </div>

                    <a
                        href={banner?.cta_link || defaultBookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-7 py-3.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                        <Phone className="w-4 h-4 fill-current" />
                        <span>BOOK VIA WHATSAPP</span>
                    </a>
                </div>
            </section>

            {/* 6. MODAL DETAIL PAKET POPUP */}
            {selectedPackage && (
                <div
                    onClick={() => setSelectedPackage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#fffcf7] w-full max-w-lg rounded-3xl p-6 border border-[#e6ccb2] shadow-2xl space-y-4 relative my-auto max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={() => setSelectedPackage(null)}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f4ece1] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-full aspect-16/10 bg-stone-100 rounded-2xl overflow-hidden border border-[#e6ccb2]/60">
                            <img
                                src={
                                    selectedPackage.image
                                        ? (selectedPackage.image.startsWith('http')
                                            ? selectedPackage.image
                                            : `http://127.0.0.1:8000/storage/${selectedPackage.image}`)
                                        : '/img/hero-home.png'
                                }
                                alt={selectedPackage.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 bg-[#f4ece1] text-[#8c5a3c] text-[10px] font-black uppercase rounded-md">
                                    BIRTHDAY PACKAGE
                                </span>
                                <span className="text-xs font-bold text-stone-500">
                                    {selectedPackage.location_name || 'Semua Lokasi'}
                                </span>
                            </div>

                            <h3 className="font-black text-xl text-[#3d2314]">
                                {selectedPackage.title}
                            </h3>

                            <div className="py-2 border-y border-[#e6ccb2]/50 space-y-1.5">
                                <span className="text-[10px] font-black text-[#3d2314] uppercase block">
                                    Fasilitas & Detail Paket:
                                </span>
                                <FormatDescription text={selectedPackage.description} />
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-[#8c5a3c] block uppercase">Harga Paket</span>
                                <span className="font-black text-lg text-[#3d2314]">
                                    Rp {new Intl.NumberFormat('id-ID').format(selectedPackage.price)}
                                </span>
                            </div>

                            <a
                                href={`https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20tertarik%20untuk%20booking%20paket%20${encodeURIComponent(selectedPackage.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-full transition flex items-center gap-2 uppercase tracking-wider shadow-xs"
                            >
                                <Phone className="w-3.5 h-3.5 fill-current" />
                                <span>BOOK NOW</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}