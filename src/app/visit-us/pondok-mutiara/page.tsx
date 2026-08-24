'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MapPin, Clock, Car, Navigation,
    ExternalLink, Compass, Wifi, Wind,
    Sparkles, Camera, Users, ChevronRight,
    Heart, Home, ShieldCheck
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

function MosqueIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m-4 14v-6a4 4 0 018 0v6M4 20h16M3 20v-7a2 2 0 012-2h1M21 20v-7a2 2 0 00-2-2h-1M12 3a4 4 0 00-4 4c0 2 4 4 4 4s4-2 4-4a4 4 0 00-4-4z" />
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

export default function PondokMutiaraPage() {
    const [banner, setBanner] = useState<BannerItem | null>(null);

    async function fetchBanner() {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/banners/pondok-mutiara', { cache: 'no-store' });
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

    const googleMapsUrl = "https://maps.google.com/?q=Pondok+Mutiara+Sidoarjo";

    return (
        <div className="bg-[#faf6f0] min-h-screen space-y-8 sm:space-y-12 pb-14">

            {/* ================================================= */}
            {/* 1. HERO SECTION (BANNER DARI DASHBOARD ADMIN)     */}
            {/* ================================================= */}
            <section className="w-full relative min-h-dvh lg:h-screen lg:max-h-160 flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-6 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                        {/* Kolom Kiri: Headline & Deskripsi */}
                        <div className="lg:col-span-5 space-y-3.5 text-center lg:text-left order-2 lg:order-1">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#8c5a3c] text-[10px] sm:text-xs font-black tracking-wider uppercase border border-[#e6ccb2]/80">
                                    <span>CABANG 2 • INDOOR & PRIVATE EVENT</span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-[1.05] uppercase">
                                    Visit Us!
                                </h1>

                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed max-w-sm mx-auto lg:mx-0">
                                    {banner?.subtitle || 'Suasana indoor yang hangat, sejuk, dan nyaman untuk quality time bersama keluarga di To Meet Cafe Pondok Mutiara.'}
                                </p>
                            </div>

                            {/* Badge Sambutan */}
                            <div className="inline-flex items-center gap-2 py-2 px-3.5 rounded-2xl bg-[#fffcf7] border border-[#e6ccb2]/80 shadow-2xs">
                                <div className="w-6 h-6 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                    <BearFaceIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[11px] font-black text-[#3d2314]">
                                    Tempat sempurna untuk momen hangat dan perayaan spesial!
                                </span>
                            </div>

                            {/* Breadcrumbs Navigasi Balik */}
                            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#8c5a3c]">
                                <Link href="/visit-us" className="hover:underline">Visit Us</Link>
                                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                                <span className="text-[#3d2314] font-black">Pondok Mutiara</span>
                            </div>
                        </div>

                        {/* Kolom Kanan: Foto Showcase Gedung */}
                        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end relative">
                            <div className="relative w-full max-w-md lg:max-w-lg aspect-16/10 rounded-3xl overflow-hidden shadow-xl border-3 border-white">
                                <img
                                    src={heroImage}
                                    alt="To Meet Cafe Pondok Mutiara"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. OUR LOCATION & INTERACTIVE MAP                 */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        
                        {/* Kiri: Detail Alamat */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                                    LOKASI KAMI
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="text-lg sm:text-xl font-black text-[#3d2314] leading-tight uppercase">
                                    To Meet Cafe & Playground<br />
                                    <span className="text-[#8c5a3c]">Pondok Mutiara</span>
                                </h2>
                                <p className="text-xs text-[#5a4232] font-semibold leading-relaxed">
                                    Jl. Pondok Mutiara No. 1, Jati, Sidoarjo, Jawa Timur 61226<br />
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
                                    className="px-5 py-2.5 bg-white hover:bg-[#faf6f0] text-[#3d2314] font-black text-xs rounded-xl border border-[#e6ccb2] transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-2xs"
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
                                    title="Peta Lokasi Pondok Mutiara"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.467414002626!2d112.7093222!3d-7.4467873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e6b72a39a7b9%3A0x7d8e20f269a87d0!2sPondok%20Mutiara!5e0!3m2!1sid!2sid!4v1715000000000!5m2!1sid!2sid"
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
            {/* 3. 3-CARD GRID (HOURS, TRANSPORT, PARKING)        */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-stretch">

                    {/* CARD 1: JAM OPERASIONAL */}
                    <div className="bg-[#fffcf7] p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                <Clock className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                    JAM OPERASIONAL
                                </h3>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#6c584c] font-semibold">Senin – Jumat</span>
                                    <span className="font-bold text-[#3d2314]">10.00 – 22.00 WIB</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#6c584c] font-semibold">Sabtu – Minggu</span>
                                    <span className="font-bold text-[#3d2314]">10.00 – 22.00 WIB</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#6c584c] font-semibold">Hari Libur Nasional</span>
                                    <span className="font-bold text-[#3d2314]">10.00 – 22.00 WIB</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-2.5 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 flex items-center gap-2 text-[11px] text-[#8c5a3c] font-bold">
                            <BearFaceIcon className="w-4 h-4 shrink-0" />
                            <span>Last order pemesanan: 21.30 WIB</span>
                        </div>
                    </div>

                    {/* CARD 2: CARA MENUJU KE SINI */}
                    <div className="bg-[#fffcf7] p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                <Navigation className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                    PANDUAN RUTE
                                </h3>
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div className="space-y-0.5">
                                    <div className="font-bold text-[#3d2314] flex items-center gap-1.5">
                                        <Car className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                        <span>Dari Arah Tol Sidoarjo</span>
                                    </div>
                                    <p className="text-[11px] text-[#6c584c] font-semibold pl-5">
                                        Keluar gerbang Tol Sidoarjo, belok kanan ke arah Pondok Mutiara (hanya 3 menit).
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <div className="font-bold text-[#3d2314] flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                        <span>Navigasi Maps</span>
                                    </div>
                                    <p className="text-[11px] text-[#6c584c] font-semibold pl-5">
                                        Cari kata kunci: &quot;To Meet Cafe Pondok Mutiara&quot;.
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <div className="font-bold text-[#3d2314] flex items-center gap-1.5">
                                        <Compass className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                        <span>Transportasi Online</span>
                                    </div>
                                    <p className="text-[11px] text-[#6c584c] font-semibold pl-5">
                                        Bisa diakses langsung oleh Gojek/Grab dengan drop-off lobi utama cafe.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2.5 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 text-center text-[10.5px] font-bold text-[#8c5a3c]">
                            Sangat strategis di pusat kota Sidoarjo
                        </div>
                    </div>

                    {/* CARD 3: INFORMASI PARKIR */}
                    <div className="bg-[#fffcf7] p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                <Car className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                                    INFORMASI PARKIR
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                                    <div className="font-black text-[#3d2314]">Area Parkir Ruko Luas</div>
                                    <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                        Tersedia parkir mobil tepat di depan outlet cafe dengan pantauan keamanan 24 jam.
                                    </p>
                                </div>

                                <div className="p-3 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                                    <div className="font-black text-[#3d2314]">Parkir Motor Tertata</div>
                                    <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                        Area khusus motor yang rapi dan dekat dengan pintu masuk.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-center text-[11px] font-bold text-emerald-800">
                            Parkir Aman & Terjangkau
                        </div>
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 4. SEE YOU SOON! (GALLERY SHOWCASE SPOTS)         */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                    <Camera className="w-4 h-4 text-[#8c5a3c]" />
                    <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                        SEE YOU SOON!
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#fffcf7] p-2 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                            <img src="/img/hero-home.png" alt="Indoor Cozy Cafe" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">INDOOR COZY CAFE</h4>
                    </div>

                    <div className="bg-[#fffcf7] p-2 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                            <img src="/img/hero-home.png" alt="Private Room L2" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">PRIVATE ROOM (L2)</h4>
                    </div>

                    <div className="bg-[#fffcf7] p-2 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                            <img src="/img/hero-home.png" alt="Family Dining Space" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">FAMILY DINING</h4>
                    </div>

                    <div className="bg-[#fffcf7] p-2 rounded-2xl border border-[#e6ccb2]/70 space-y-1.5 text-center">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100">
                            <img src="/img/hero-home.png" alt="Teddy Bear Corner" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-black text-[11px] text-[#3d2314] uppercase">TEDDY BEAR CORNER</h4>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. FACILITIES STRIP                               */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <Sparkles className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            FASILITAS CABANG
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <Wind className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Full AC Sejuk</div>
                        </div>

                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <Home className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Private Room L2</div>
                        </div>

                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <Wifi className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Free High-Speed Wi-Fi</div>
                        </div>

                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <ToiletIcon className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Toilet Bersih</div>
                        </div>

                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <MosqueIcon className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Musholla Nyaman</div>
                        </div>

                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <Users className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Kursi Anak (High Chair)</div>
                        </div>

                        <div className="bg-[#faf6f0] p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                            <Camera className="w-4 h-4 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10px] font-black text-[#3d2314]">Photo Spot Instagramable</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}