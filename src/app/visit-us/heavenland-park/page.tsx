'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
    MapPin, Clock, Car, Navigation,
    ExternalLink, Compass, Wifi, Wind,
    Sparkles, Camera, Cigarette, ArrowRight,
    Utensils, Coffee, CheckCircle2, ChevronRight,
    AlertCircle, Info, CreditCard, Baby, BookOpen, AlertTriangle,
    AirVent, Dices,
    ConciergeBell, CigaretteOff
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

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
}

function renderFormattedText(value: string | null | undefined, fallback: ReactNode): ReactNode {
    return value?.trim() ? value : fallback;
}

export default function HeavenlandParkPage() {
    const [banner, setBanner] = useState<BannerItem | null>(null);

    async function fetchBanner() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/banners/heavenland-park`, { cache: 'no-store' });
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

    const googleMapsUrl = "https://maps.app.goo.gl/v78EHasqF2phT22k8";

    return (
        <div className="min-h-screen space-y-8 sm:space-y-12 pb-14">

            {/* ================================================= */}
            {/* 1. HERO SECTION FULL 1 LAYAR (HEAVENLAND PARK)    */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Cafe Heavenland Park"
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
                            <span>OUTLET 1 • HEAVENLAND PARK</span>
                            <Sparkles className="w-3 h-3 text-amber-500" />
                        </div>

                        {/* Title Proporsional */}
                        <h1 className="text-2xl sm:text-[15px] lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {renderFormattedText(
                                banner?.title,
                                <>
                                    VISIT US! <br />
                                    <span className="text-[#8c5a3c]">HEAVENLAND PARK</span>
                                </>
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            {renderFormattedText(
                                banner?.subtitle,
                                'Kami tidak sabar menyambut kedatanganmu di To Meet Cafe Heavenland Park. Datang untuk mencicipi hidangan, tinggal untuk kenangannya!'
                            )}
                        </p>

                        {/* Tombol Aksi */}
                        <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[11px] rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>BUKA GOOGLE MAPS</span>
                            </a>

                            <a
                                href="#guidelines"
                                className="px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] text-white font-black text-[11px] rounded-full transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md"
                            >
                                <Compass className="w-3.5 h-3.5" />
                                <span>PANDUAN KUNJUNGAN</span>
                            </a>
                        </div>

                        {/* Breadcrumbs Navigasi */}
                        <div className="pt-1 flex items-center gap-2 text-xs font-bold text-[#8c5a3c]">
                            <Link href="/visit-us" className="hover:underline">Visit Us</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                            <span className="text-[#3d2314] font-black">Heavenland Park</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. OUR LOCATION & MAPS EMBED                      */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                        {/* Kiri: Detail Alamat */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#e85a4f] flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                                    ALAMAT LOKASI
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="text-lg sm:text-xl font-black text-[#3d2314] leading-tight uppercase">
                                    To Meet Cafe<br />
                                    <span className="text-[#8c5a3c]">Heavenland Park</span>
                                </h2>
                                <p className="text-xs text-[#5a4232] font-semibold leading-relaxed">
                                    Ruko Heavenland Park, BB-26, Ngemplak, Klurak, Kec. Candi, Kabupaten Sidoarjo, Jawa Timur 61217<br />
                                    <span className="text-[11px] text-[#6c584c]">(Area komersial di dalam kawasan Heavenland Park)</span>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-xl shadow-md shadow-rose-500/15 transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
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

                        {/* Kanan: Embed Google Maps Frame */}
                        <div className="lg:col-span-7">
                            <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#e6ccb2]/70 shadow-2xs bg-stone-100">
                                <iframe
                                    title="Peta Lokasi Heavenland Park"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4704.330425576108!2d112.72438561170864!3d-7.481304280975146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e166de3acc1b%3A0xfe742c8fa55c747a!2sTo%20Meet%20Cafe!5e0!3m2!1sid!2sid!4v1787805462467!5m2!1sid!2sid"
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
            {/* 3. PANDUAN KUNJUNGAN TERPADU                      */}
            {/* ================================================= */}
            <section id="guidelines" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5">

                    {/* Header Card */}
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Compass className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            PANDUAN OPERASIONAL & KUNJUNGAN
                        </h2>
                    </div>

                    {/* 3 Sub-Cards Sejajar */}
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
                                        <span className="text-[#6c584c] font-semibold">Selasa – Jumat</span>
                                        <span className="font-bold text-[#3d2314]">12.00 – 19.00 WIB</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#6c584c] font-semibold">Sabtu – Minggu</span>
                                        <span className="font-bold text-[#3d2314]">10.00 – 20.00 WIB</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#6c584c] font-semibold">Senin</span>
                                        <span className="font-bold text-rose-600">LIBUR / TUTUP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-white rounded-xl border border-[#e6ccb2]/60 text-[10.5px] text-[#8c5a3c] font-bold text-center shadow-2xs">
                                Last Order: 18.30 WIB
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
                                        Berjarak sekitar <span className="font-black text-[#3d2314]">15–20 menit</span> dari Pintu Tol Sidoarjo Kota.
                                    </p>
                                    <p className="text-[11px] text-[#6c584c]">
                                        Akses jalan mudah dijangkau mobil maupun motor.
                                    </p>
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-white rounded-xl border border-[#e6ccb2]/60 text-[10.5px] text-[#8c5a3c] font-bold text-center shadow-2xs">
                                Maps: To Meet Cafe Heavenland Park
                            </div>
                        </div>

                        {/* Sub-Card 3: Fasilitas Parkir */}
                        <div className="bg-[#FAF0E6]/50 p-4 sm:p-5 rounded-2xl border border-[#e6ccb2]/70 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                    <Car className="w-4 h-4 text-emerald-600" />
                                    <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                        FASILITAS PARKIR
                                    </h3>
                                </div>
                                <div className="space-y-1.5 text-xs text-[#5a4232] font-semibold leading-relaxed">
                                    <p>
                                        Tersedia Area parkir luas dan aman tepat di depan deretan ruko cafe.
                                    </p>
                                </div>
                            </div>
                            <div className="py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[10.5px] text-emerald-800 font-bold text-center shadow-2xs">
                                Bebas Biaya Parkir (Gratis)
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. INFORMASI PENTING & CATATAN KUNJUNGAN          */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">

                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Info className="w-4 h-4 text-[#e85a4f]" />
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            INFORMASI LAIN-LAIN
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">

                        {/* Catatan 1: Menu Makanan */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <Coffee className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Tidak Tersedia Makanan Berat</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Cabang Heavenland Park berfokus menyajikan aneka <span className="font-bold text-[#3d2314]">Snack, Dessert, Pastry & Minuman Spesial</span> (tidak tersedia menu makanan berat).
                                </p>
                            </div>
                            <span className="text-[9.5px] font-bold text-[#8c5a3c] pt-1 border-t border-[#e6ccb2]/40">
                                Cocok untuk santai & ngemil manis
                            </span>
                        </div>

                        {/* Catatan 2: Mini Playground */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-amber-600 flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <Baby className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Area Mini Playground</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Fasilitas mini playground di cabang ini berukuran compact dan diperuntukkan khusus untuk <span className="font-bold text-[#3d2314]">anak-anak usia balita (di bawah 3 tahun)</span>.
                                </p>
                            </div>
                            <span className="text-[9.5px] font-bold text-amber-700 pt-1 border-t border-[#e6ccb2]/40">
                                Wajib dalam pengawasan orang tua
                            </span>
                        </div>

                        {/* Catatan 3: Variasi Menu Cabang */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Daftar Menu Cabang</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Daftar menu lengkap dapat dicek pada halaman menu website. Variasi dan ketersediaan hidangan dapat berbeda di setiap cabang.
                                </p>
                            </div>
                            <Link href="/menu" className="text-[9.5px] font-bold text-emerald-800 hover:underline pt-1 border-t border-[#e6ccb2]/40 inline-flex items-center gap-1">
                                <span>Lihat Halaman Menu</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                        </div>

                        {/* Catatan 4: Pembayaran Cashless */}
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/70 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white text-[#e85a4f] flex items-center justify-center border border-[#e6ccb2]/50 shadow-2xs">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase">Pembayaran Non-Tunai</h4>
                                <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                                    Untuk kenyamanan dan higienitas transaksi, kami memberlakukan sistem pembayaran <span className="font-bold text-[#3d2314]">Cashless (QRIS, Kartu Debit, & Kartu Kredit)</span>.
                                </p>
                            </div>
                            <span className="text-[9.5px] font-bold text-[#e85a4f] pt-1 border-t border-[#e6ccb2]/40">
                                100% Cashless Surcharge-Free
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. GALLERY SHOWCASE SPOTS                         */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                    <Camera className="w-4 h-4 text-[#8c5a3c]" />
                    <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                        SEE YOU SOON!
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/visit-us-hlp/seating-area-1.png" alt="Seating Area lt-1" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">SEATING AREA LT 1</h4>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/visit-us-hlp/seating-area-2.png" alt="Seating Area lt 2" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">SEATING AREA LT 2</h4>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/visit-us-hlp/mini-playground-hlp.png" alt="Mini Playground" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">MINI PLAYGROUND</h4>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/visit-us-hlp/boardgame-hlp.png" alt="Board Game" className="w-full h-full object-cover object-[center_10%]" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">BOARD GAME</h4>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 6. FACILITIES STRIP                               */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">

                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Sparkles className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            FASILITAS CABANG HEAVENLAND PARK
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <ConciergeBell className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Self Service</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <Baby className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Mini Playground</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <Wifi className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Free Wi-Fi</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <AirVent className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Full AC Indoor</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <ToiletIcon className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Toilet Bersih</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <CigaretteOff className="w-4 h-4 text-[#e85a4f] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Non-Smoking</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1 hover:border-[#8c5a3c] transition duration-200">
                            <Dices className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Board Game</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}