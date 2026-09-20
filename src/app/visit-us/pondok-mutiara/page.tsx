'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MapPin, Clock, Car, Navigation,
    ExternalLink, Compass, Wifi, AirVent,
    Sparkles, Camera, Users, ChevronRight, ChevronLeft,
    Heart, Home, ShieldCheck, Info, CreditCard,
    Utensils, Baby, BookOpen, AlertCircle, Phone,
    CigaretteOff, Dices, Footprints, QrCode, Ban,
    CalendarCheck, Timer, AlertTriangle, ArrowRight, Waves
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

function ToiletIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v6a4 4 0 004 4h2a4 4 0 004-4V3M9 21v-4m6 4v-4M5 9h14" />
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

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
}

// 8 Spot Foto untuk Galeri Carousel (Dibagi 2 Slide: 4 & 4)
const GALLERY_PAGES = [
    [
        {
            id: 1,
            title: 'Seating Area LT 1',
            desc: '',
            image: '/img/visit-us-pm/seating-area-lt1.png'
        },
        {
            id: 2,
            title: 'Seating Area LT 2',
            desc: '',
            image: '/img/visit-us-pm/seating-area-lt2.png'
        },
        {
            id: 3,
            title: 'Seating Area LT 3',
            desc: '',
            image: '/img/visit-us-pm/seating-area-lt3.png'
        },
        {
            id: 4,
            title: 'Playground',
            desc: '',
            image: '/img/visit-us-pm/playground.png'
        }
    ],
    [
        {
            id: 5,
            title: 'Spot foto Teddy Bear',
            desc: '',
            image: '/img/visit-us-pm/teddy-bear.png'
        },
        {
            id: 6,
            title: 'Kolam Pancing',
            desc: '',
            image: '/img/visit-us-pm/kolam-pancing.png'
        },
        {
            id: 7,
            title: 'Merchandise Corner',
            desc: '',
            image: '/img/visit-us-pm/merchandise-corner.png'
        },
        {
            id: 8,
            title: 'Boardgame',
            desc: '',
            image: '/img/visit-us-pm/boardgame.png'
        }
    ]
];

export default function PondokMutiaraPage() {
    const [banner, setBanner] = useState<BannerItem | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

    async function fetchBanner() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/banners/pondok-mutiara`, { cache: 'no-store' });
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

    const totalPages = GALLERY_PAGES.length;

    const prevSlide = () => {
        setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const nextSlide = () => {
        setCurrentPageIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `${API_BASE_URL}/storage/${banner.image}`)
        : '/img/hero-home.png';

    const googleMapsUrl = "https://maps.app.goo.gl/zWp8wcEhyK4VpczDA";
    const reservationWaUrl = "https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20ingin%20reservasi%20meja%20di%20Cabang%20Pondok%20Mutiara";

    return (
        <div className="min-h-screen space-y-10 sm:space-y-14 pb-16">

            {/* ================================================= */}
            {/* 1. HERO SECTION (BANNER FULL 1 LAYAR DARI ADMIN)  */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Cafe Pondok Mutiara"
                        className="w-full h-full object-cover object-[60%_center] lg:object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full sm:w-2/3 lg:w-1/2" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div className="max-w-md lg:max-w-lg space-y-3 sm:space-y-3.5">

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#8c5a3c] text-[9.5px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <span>OUTLET 2 • PONDOK MUTIARA</span>
                            <Sparkles className="w-3 h-3 text-amber-500" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {renderFormattedText(
                                banner?.title,
                                <>
                                    VISIT US! <br />
                                    <span className="text-[#8c5a3c]">PONDOK MUTIARA</span>
                                </>
                            )}
                        </h1>

                        <p className="text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            {renderFormattedText(
                                banner?.subtitle,
                                'Suasana indoor yang luas, sejuk, dan nyaman dengan playground bertingkat, menu makanan berat lezat, serta ruang privat untuk keluarga Anda.'
                            )}
                        </p>

                        <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                            <a
                                href={reservationWaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[11px] rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <Phone className="w-3.5 h-3.5 fill-current" />
                                <span>RESERVASI SEKARANG</span>
                            </a>

                            <a
                                href="#guidelines"
                                className="px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] text-white font-black text-[11px] rounded-full transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md"
                            >
                                <Compass className="w-3.5 h-3.5" />
                                <span>PANDUAN KUNJUNGAN</span>
                            </a>
                        </div>

                        <div className="pt-1 flex items-center gap-2 text-xs font-bold text-[#8c5a3c]">
                            <Link href="/visit-us" className="hover:underline">Visit Us</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                            <span className="text-[#3d2314] font-black">Pondok Mutiara</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. ALAMAT LOKASI & EMBED GOOGLE MAPS              */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#e85a4f] flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                                    ALAMAT OUTLET
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="text-lg sm:text-xl font-black text-[#3d2314] leading-tight uppercase">
                                    To Meet Cafe & Playground<br />
                                    <span className="text-[#8c5a3c]">Pondok Mutiara</span>
                                </h2>
                                <p className="text-xs text-[#5a4232] font-semibold leading-relaxed">
                                    Ruko Pondok Mutiara Harum, Blok B No. 1A, Jati, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61226<br />
                                    <span className="text-[11px] text-[#6c584c]">(Kawasan Ruko Pondok Mutiara, Dekat Pintu Tol Sidoarjo)</span>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-xs rounded-xl shadow-md shadow-[#8c5a3c]/15 transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                                >
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>BUKA GOOGLE MAPS</span>
                                </a>

                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-[#FAF0E6]/50 hover:bg-[#FAF0E6] text-[#3d2314] font-black text-xs rounded-xl border border-[#e6ccb2] transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-2xs"
                                >
                                    <Navigation className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>PETUNJUK ARAH</span>
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#e6ccb2]/70 shadow-2xs bg-stone-100">
                                <iframe
                                    title="Peta Lokasi Pondok Mutiara"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.5875573291796!2d112.69738207400381!3d-7.4478727925632375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e12007cd81af%3A0xf50bdf96d6e1a0a9!2sTo%20Meet%20Cafe%20-%20Pondok%20Mutiara!5e1!3m2!1sid!2sid!4v1789358859258!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. PANDUAN KUNJUNGAN TERPADU (1 CARD COMPACT)     */}
            {/* ================================================= */}
            <section id="guidelines" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5">

                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Compass className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            PANDUAN OPERASIONAL & KUNJUNGAN
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

                        {/* Sub-Card 1: Jam Operasional */}
                        <div className="bg-[#FAF0E6]/50 p-4 sm:p-5 rounded-2xl border border-[#e6ccb2]/70 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                    <Clock className="w-4 h-4 text-[#e85a4f]" />
                                    <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                        JAM OPERASIONAL
                                    </h3>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#6c584c] font-semibold">Selasa – Minggu</span>
                                        <span className="font-bold text-[#3d2314]">12.00 – 22.00 WIB</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#6c584c] font-semibold">Senin</span>
                                        <span className="font-bold text-rose-600">LIBUR / TUTUP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-white rounded-xl border border-[#e6ccb2]/60 text-[10.5px] text-[#8c5a3c] font-bold text-center shadow-2xs">
                                Last Order: 21.00 WIB
                            </div>
                        </div>

                        {/* Sub-Card 2: Panduan Rute */}
                        <div className="bg-[#FAF0E6]/50 p-4 sm:p-5 rounded-2xl border border-[#e6ccb2]/70 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                    <Navigation className="w-4 h-4 text-[#8c5a3c]" />
                                    <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                        PANDUAN AKSES RUTE
                                    </h3>
                                </div>
                                <div className="space-y-1.5 text-xs text-[#5a4232] font-semibold leading-relaxed">
                                    <p>
                                        Hanya <span className="font-black text-[#3d2314]">2–3 menit</span> setelah keluar Gerbang Tol Sidoarjo Kota.
                                    </p>
                                    <p className="text-[11px] text-[#6c584c]">
                                        Belok kanan menuju kawasan Ruko Pondok Mutiara Harum.
                                    </p>
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-white rounded-xl border border-[#e6ccb2]/60 text-[10.5px] text-[#8c5a3c] font-bold text-center shadow-2xs">
                                Maps: To Meet Cafe Pondok Mutiara
                            </div>
                        </div>

                        {/* Sub-Card 3: Fasilitas Parkir */}
                        <div className="bg-[#FAF0E6]/50 p-4 sm:p-5 rounded-2xl border border-[#e6ccb2]/70 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                    <Car className="w-4 h-4 text-[#8c5a3c]" />
                                    <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                        INFORMASI PARKIR
                                    </h3>
                                </div>
                                <div className="space-y-1.5 text-xs text-[#5a4232] font-semibold leading-relaxed">
                                    <p>
                                        Tersedia area parkir disekitar ruko untuk mobil dan motor
                                    </p>
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[10.5px] text-amber-800 font-bold text-center shadow-2xs">
                                Parkir Berbayar
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. INFORMASI PENTING CABANG PONDOK MUTIARA        */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">

                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Info className="w-4 h-4 text-[#e85a4f]" />
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            INFORMASI LAIN - LAIN
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">

                        {/* 1. Makanan Berat */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <Utensils className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Tersedia Makanan Berat</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Menyajikan aneka menu makanan berat keluarga, dan kids meal set lengkap.
                                </p>
                            </div>
                            <Link href="/menu" className="text-[9.5px] font-bold text-[#8c5a3c] hover:underline pt-1 border-t border-[#e6ccb2]/40 inline-flex items-center gap-1">
                                <span>Cek Menu Lengkap</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                        </div>

                        {/* 2. Playground Luas */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-amber-600 flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <Baby className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Playground Lebih Luas</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Area playground multi-level yang lebih luas, seru, dan wajib mengenakan kaos kaki bersih.
                                </p>
                            </div>
                            <span className="text-[9.5px] font-bold text-amber-700 pt-1 border-t border-[#e6ccb2]/40">
                                Anak & Pendamping Wajib Memakai Kaos Kaki
                            </span>
                        </div>

                        {/* 3. Spot Foto Dinding Boneka */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-[#e85a4f] flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <Camera className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Spot Foto Teddy Bear</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Ikon spot foto estetik *Teddy Bear Wall* yang hanya ada di cabang Pondok Mutiara.
                                </p>
                            </div>
                            <span className="text-[9.5px] font-bold text-[#e85a4f] pt-1 border-t border-[#e6ccb2]/40">
                                Spot Foto Ikonik
                            </span>
                        </div>

                        {/* 4. Pembayaran & Akses Datang */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Walk-in & Reservasi</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Bisa langsung datang (tanpa min. order) atau reservasi meja di awal (dengan min. order). Pembayaran 100% Cashless.
                                </p>
                            </div>
                            <span className="text-[9.5px] font-bold text-emerald-800 pt-1 border-t border-[#e6ccb2]/40">
                                QRIS, Kartu Debit & Kartu Kredit
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. SEE YOU SOON! (SLIDING TRACK PER 4 FOTO)       */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                    <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            SEE YOU SOON AT PONDOK MUTIARA!
                        </h2>
                    </div>
                    <span className="text-[11px] font-bold text-[#8c5a3c]">
                        Halaman {currentPageIndex + 1} dari {totalPages}
                    </span>
                </div>

                {/* Container Carousel dengan Tombol Panah Melayang */}
                <div className="relative overflow-hidden">

                    {/* Tombol Panah Kiri (Floating) */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition border border-[#e6ccb2] shadow-md cursor-pointer active:scale-90"
                        aria-label="Previous 4 Photos"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Sliding Track Viewport */}
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentPageIndex * 100}%)` }}
                    >
                        {GALLERY_PAGES.map((pageItems, pageIdx) => (
                            <div
                                key={pageIdx}
                                className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 px-0.5"
                            >
                                {pageItems.map((spot) => (
                                    <div
                                        key={spot.id}
                                        className="bg-white p-3 rounded-3xl border border-[#e6ccb2]/70 space-y-2.5 text-center shadow-2xs flex flex-col justify-between"
                                    >
                                        <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                                            <img
                                                src={spot.image}
                                                alt={spot.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-0.5 pb-1">
                                            <h4 className="font-black text-xs text-[#3d2314] uppercase">
                                                {spot.title}
                                            </h4>
                                            {spot.desc && (
                                                <p className="text-[10.5px] text-[#6c584c] font-semibold">
                                                    {spot.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Tombol Panah Kanan (Floating) */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition border border-[#e6ccb2] shadow-md cursor-pointer active:scale-90"
                        aria-label="Next 4 Photos"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Indikator Dot Pagination */}
                <div className="flex items-center justify-center gap-2 pt-1">
                    {GALLERY_PAGES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPageIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentPageIndex === idx
                                ? 'w-6 bg-[#8c5a3c]'
                                : 'w-2 bg-[#e6ccb2] hover:bg-[#8c5a3c]/60'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ================================================= */}
            {/* 6. FASILITAS CABANG PONDOK MUTIARA                */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Sparkles className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            FASILITAS CABANG PONDOK MUTIARA
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <Baby className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Playground</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <Camera className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Teddy Spot</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <Wifi className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Free Wi-Fi</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <AirVent className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Full AC Indoor</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <ToiletIcon className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Toilet Bersih</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <CigaretteOff className="w-4 h-4 text-[#e85a4f] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Non-Smoking</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <Dices className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Board Game</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition">
                            <Users className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Baby Chair</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 7. HOUSE RULES PONDOK MUTIARA                     */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5">

                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#e85a4f]" />
                            <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                                HOUSE RULES CABANG PONDOK MUTIARA
                            </h2>
                        </div>
                        <span className="text-[10px] font-black text-[#8c5a3c] uppercase">
                            DEMI KENYAMANAN BERSAMA
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <Clock className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Penyajian & Pesanan</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Waktu penyajian makanan maksimal <span className="font-bold text-[#3d2314]">40 menit</span>. saat kondisi sedang ramai.
                                Pemesanan dilakukan secara mandiri dengan scan barcode di meja.
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <CreditCard className="w-4 h-4 text-[#8c5a3c]" />
                                <span>100% Cashless</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Seluruh pembayaran wajib non-tunai (QRIS, Debit Card, atau Credit Card).
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <Timer className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Durasi Dine-In</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Batas waktu dine-in maksimal <span className="font-bold text-[#3d2314]">2 jam</span> jika terdapat antrean / waiting list. Jika tidak ada antrean, Anda bebas duduk lebih lama.
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <Ban className="w-4 h-4 text-rose-600" />
                                <span>Dilarang Pindah Meja</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Dilarang berpindah meja tanpa konfirmasi staff agar pesanan barcode tidak tertukar dengan tamu lain.
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <Ban className="w-4 h-4 text-rose-600" />
                                <span>Makanan Dari Luar</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Dilarang membawa makanan dan minuman dari luar ke dalam area cafe.
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                <span>Playground Access</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Akses bermain di playground tersedia dengan memenuhi minimum pembelian sesuai promo yang berlaku.
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <span>Ketentuan Tinggi Badan & Usia Anak</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Batas maksimal tinggi badan anak di playground adalah <span className="font-bold text-[#3d2314]">125 cm</span> demi menjaga keamanan bersama. Anak di bawah 3 tahun wajib didampingi orang tua.
                            </p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314]">
                                <Footprints className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Wajib Kaos Kaki</span>
                            </div>
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                Anak dan orang tua pendamping wajib menggunakan kaos kaki bersih saat memasuki area playground.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 8. KETENTUAN & PROSEDUR RESERVASI (CARD KHUSUS)   */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fdf3f1] p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-2xs space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/70 pb-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#e85a4f] uppercase tracking-wider">
                                <CalendarCheck className="w-3.5 h-3.5" />
                                <span>RESERVATION POLICY</span>
                            </div>
                            <h2 className="text-base sm:text-xl font-black text-[#3d2314] uppercase tracking-tight">
                                KETENTUAN & SYARAT RESERVASI MEJA
                            </h2>
                        </div>

                        <a
                            href={reservationWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer self-start sm:self-auto"
                        >
                            <Phone className="w-3.5 h-3.5 fill-current" />
                            <span>HUBUNGI ADMIN RESERVASI</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs text-[#5a4232]">

                        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 space-y-1">
                            <div className="font-black text-[#3d2314] text-xs flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Minimum Spend & Kapasitas</span>
                            </div>
                            <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                Reservasi meja berlaku dengan minimum pembelian per meja (kapasitas 4 pax per meja).
                            </p>
                        </div>

                        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 space-y-1">
                            <div className="font-black text-[#3d2314] text-xs flex items-center gap-1.5">
                                <CalendarCheck className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Batas Booking H-1</span>
                            </div>
                            <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                Reservasi wajib dilakukan maksimal H-1 dengan sistem <strong>close bill</strong> di awal saat konfirmasi.
                            </p>
                        </div>

                        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 space-y-1">
                            <div className="font-black text-[#3d2314] text-xs flex items-center gap-1.5">
                                <Timer className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Durasi Dine-In 2 Jam</span>
                            </div>
                            <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                Waktu dine-in maksimal 2 jam. Apabila tidak ada antrean / waiting list, tamu diperbolehkan duduk lebih lama.
                            </p>
                        </div>

                        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 space-y-1">
                            <div className="font-black text-[#3d2314] text-xs flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Perubahan Jadwal & Pax</span>
                            </div>
                            <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                Informasi perubahan jumlah tamu atau jam kedatangan wajib dikonfirmasi maksimal H-1.
                            </p>
                        </div>

                        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 space-y-1">
                            <div className="font-black text-[#3d2314] text-xs flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Toleransi Keterlambatan 15 Menit</span>
                            </div>
                            <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                Toleransi keterlambatan maksimal 15 menit. Keterlambatan akan memotong durasi jam reservasi Anda.
                            </p>
                        </div>

                        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 space-y-1">
                            <div className="font-black text-rose-700 text-xs flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-rose-600" />
                                <span>Kebijakan Pembatalan / No-Show</span>
                            </div>
                            <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                Tanpa konfirmasi keterlambatan, reservasi otomatis dibatalkan karena hidangan disiapkan sebelum kedatangan. Pembayaran bersifat *non-refundable*.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}