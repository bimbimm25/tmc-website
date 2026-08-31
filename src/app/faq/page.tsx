'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, ChevronDown, ChevronUp, MessageCircle,
    Coffee, Utensils, Calendar, Sparkles, Building2,
    ShoppingBag, MapPin, Clock, ArrowRight, HelpCircle,
    Mail, X
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function BearFaceIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a3 3 0 100-6 3 3 0 000 6zm16 0a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    );
}

function BearPawIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5.7 2.5 1.6 2.5z" />
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

interface FAQItem {
    id: string;
    category: string;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    // Informasi Umum
    {
        id: 'gen-1',
        category: 'general',
        question: 'Apa itu To Meet Cafe & Playground?',
        answer: 'To Meet Cafe adalah cafe dan playground ramah keluarga bertema beruang lucu di mana Anda dapat menikmati hidangan lezat, aktivitas seru anak-anak, dan menciptakan kenangan manis bersama orang tersayang.'
    },
    {
        id: 'gen-2',
        category: 'general',
        question: 'Di mana saja lokasi cabang To Meet Cafe?',
        answer: 'Saat ini kami memiliki 2 cabang di Sidoarjo: 1) Heavenland Park (Outdoor Playground & Kolam Pancing Beruang) di Jl. Raya Pralajur, dan 2) Pondok Mutiara (Indoor Cozy Space & Ruang Privat) di Jl. Pondok Mutiara No. 1.'
    },
    {
        id: 'gen-3',
        category: 'general',
        question: 'Kapan jam operasional buka cafe?',
        answer: 'Cabang Heavenland Park: Senin–Jumat pukul 10.00–22.00 WIB, Sabtu–Minggu & Libur Nasional pukul 09.00–22.00 WIB. Cabang Pondok Mutiara: Buka setiap hari pukul 10.00–22.00 WIB. Pesanan terakhir (last order) pukul 21.30 WIB.'
    },
    {
        id: 'gen-4',
        category: 'general',
        question: 'Apakah harus melakukan reservasi sebelum datang?',
        answer: 'Pengunjung langsung (walk-in) selalu disambut dengan hangat! Namun, untuk kunjungan di akhir pekan, rombongan lebih dari 8 orang, atau acara ulang tahun, kami sangat menyarankan untuk reservasi terlebih dahulu via WhatsApp.'
    },
    {
        id: 'gen-5',
        category: 'general',
        question: 'Apakah To Meet Cafe cocok untuk anak-anak dan balita?',
        answer: 'Sangat cocok! Cafe kami dirancang khusus ramah keluarga dengan playground bertingkat 3 yang aman, kolam pancing beruang interaktif, baby high chair, area balita, serta paket menu khusus anak.'
    },
    {
        id: 'gen-6',
        category: 'general',
        question: 'Apa saja tata tertib yang berlaku di dalam cafe?',
        answer: 'Demi kenyamanan bersama, pengunjung wajib memakai kaos kaki saat berada di area playground, menjaga kebersihan, mendampingi anak-anak saat bermain, serta merokok hanya di area smoking outdoor yang disediakan.'
    },

    // Menu & Pemesanan
    {
        id: 'menu-1',
        category: 'menu',
        question: 'Apakah semua makanan dan minuman di sini Halal?',
        answer: 'Ya! Semua bahan baku makanan dan minuman yang kami sajikan 100% Halal, tanpa mengandung babi, tanpa minyak babi (no pork no lard), dan tanpa alkohol.'
    },
    {
        id: 'menu-2',
        category: 'menu',
        question: 'Apa saja menu andalan (signature) di To Meet Cafe?',
        answer: 'Menu favorit andalan kami antara lain Bear Signature Milk Tea, Teddy Croffle dengan Gelato lembut, Creamy Truffle Pasta, dan Paket Bento Karakter Beruang untuk anak-anak.'
    },
    {
        id: 'menu-3',
        category: 'menu',
        question: 'Metode pembayaran apa saja yang diterima?',
        answer: 'Kami menerima pembayaran Tunai (Cash), QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay, Dana), Kartu Debit, dan Kartu Kredit tanpa biaya tambahan.'
    },

    // Reservasi
    {
        id: 'res-1',
        category: 'reservation',
        question: 'Bagaimana cara memesan tempat atau ruang privat?',
        answer: 'Anda dapat memesan tempat dengan mudah melalui tombol "Chat WhatsApp" di website ini atau menghubungi admin kami dengan mencantumkan tanggal, jam, jumlah tamu, dan cabang yang dipilih.'
    },
    {
        id: 'res-2',
        category: 'reservation',
        question: 'Apakah ada batas minimum pemesanan (minimum spend)?',
        answer: 'Untuk area makan reguler tidak ada minimum spend. Sedangkan untuk penyewaan Ruang Privat VIP di Lantai 2, paket minimum spend mulai dari Rp 500.000 untuk durasi 2,5 jam.'
    },

    // Event & Ulang Tahun
    {
        id: 'event-1',
        category: 'event',
        question: 'Bisakah mengadakan pesta ulang tahun atau gathering di sini?',
        answer: 'Tentu saja! Kami menyediakan paket lengkap pesta ulang tahun anak, bridal shower, field trip sekolah, maupun gathering kantor lengkap dengan dekorasi tematik, pemandu acara (MC), dan hidangan prasmanan.'
    },
    {
        id: 'event-2',
        category: 'event',
        question: 'Berapa hari sebelumnya kami harus memesan paket acara?',
        answer: 'Kami menyarankan untuk melakukan pemesanan dan konfirmasi paket acara minimal 1–2 minggu sebelumnya agar jadwal dan persiapan dekorasi dapat disiapkan maksimal.'
    },

    // Fasilitas
    {
        id: 'fac-1',
        category: 'facilities',
        question: 'Fasilitas apa saja yang tersedia untuk pengunjung?',
        answer: 'Fasilitas kami meliputi Free Wi-Fi berkecepatan tinggi, Ruangan Full AC yang sejuk, Musholla bersih dan nyaman, Toilet keluarga yang higienis, Kursi makan bayi (High Chair), dan beragam Spot Foto Instagramable.'
    },
    {
        id: 'fac-2',
        category: 'facilities',
        question: 'Apakah wajib memakai kaos kaki di area playground?',
        answer: 'Ya, demi menjaga kebersihan dan keselamatan anak-anak, seluruh pengunjung yang memasuki area playground wajib mengenakan kaos kaki. Kaos kaki juga tersedia untuk dibeli di kasir jika Anda lupa membawanya.'
    },

    // Merchandise
    {
        id: 'merch-1',
        category: 'merchandise',
        question: 'Di mana saya bisa membeli merchandise resmi To Meet?',
        answer: 'Boneka beruang resmi, gantungan kunci, tote bag kanvas, tumbler, dan aksesoris eksklusif dapat dibeli langsung di kasir outlet cafe maupun melalui katalog online di website ini.'
    },

    // Lokasi & Parkir
    {
        id: 'loc-1',
        category: 'location',
        question: 'Apakah tersedia tempat parkir yang aman dan luas?',
        answer: 'Kedua cabang kami memiliki area parkir mobil dan motor yang sangat luas, tertata rapi, dan dilengkapi pengawasan keamanan 24 jam. Parkir gratis bagi pengunjung cafe.'
    }
];

const CATEGORIES = [
    { id: 'general', name: 'UMUM', desc: 'Info umum tentang To Meet Cafe', icon: Coffee },
    { id: 'menu', name: 'MENU & PESANAN', desc: 'Menu, pemesanan & pembayaran', icon: Utensils },
    { id: 'reservation', name: 'RESERVASI', desc: 'Reservasi meja & booking tempat', icon: Calendar },
    { id: 'event', name: 'EVENT & ULANG TAHUN', desc: 'Paket ulang tahun & acara privat', icon: Sparkles },
    { id: 'facilities', name: 'FASILITAS', desc: 'Fasilitas lengkap di cafe', icon: Building2 },
    { id: 'merchandise', name: 'MERCHANDISE', desc: 'Pembelian merchandise resmi', icon: ShoppingBag },
    { id: 'location', name: 'LOKASI & PARKIR', desc: 'Akses jalan & info parkir', icon: MapPin },
];

export default function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<string[]>(['gen-1']);
    const [bannerImage, setBannerImage] = useState<string>('/img/hero-home.png');
    const [bannerTitle, setBannerTitle] = useState<string | null>(null);
    const [bannerSubtitle, setBannerSubtitle] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBanner() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/banners/faq`, { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json?.data) {
                        if (json.data.image) {
                            const img = json.data.image;
                            setBannerImage(img.startsWith('http') || img.startsWith('/img') ? img : `${API_BASE_URL}/storage/${img}`);
                        }
                        if (json.data.title) setBannerTitle(json.data.title);
                        if (json.data.subtitle) setBannerSubtitle(json.data.subtitle);
                    }
                }
            } catch {
                // fallback default
            }
        }
        fetchBanner();
    }, []);

    const toggleAccordion = (id: string) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const filteredFAQs = useMemo(() => {
        return FAQ_DATA.filter((item) => {
            const matchesCategory = searchQuery.trim() !== '' ? true : item.category === selectedCategory;
            const matchesSearch =
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const activeCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

    return (
        <div className="min-h-screen space-y-10 sm:space-y-14 pb-14">

            {/* ================================================= */}
            {/* 1. HERO SECTION FULL 1 LAYAR (FAQ BANNER)         */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImage}
                        alt="To Meet Cafe FAQ Showcase"
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
                            <span>HELP CENTER</span>
                            <BearPawIcon className="w-3 h-3" />
                        </div>

                        {/* Title Proporsional */}
                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {renderFormattedText(
                                bannerTitle,
                                <>
                                    FREQUENTLY ASKED <br />
                                    <span className="text-[#8c5a3c]">QUESTIONS (FAQ)</span>
                                </>
                            )}
                        </h1>

                        {/* Subtitle */}
                        <div className="space-y-1 text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            <p className="font-bold text-[#3d2314]">
                                Kami siap membantu Anda!
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#6c584c]">
                                {renderFormattedText(
                                    bannerSubtitle,
                                    'Temukan jawaban seputar To Meet Cafe, menu lezat kami, reservasi, event seru, dan segala hal yang ingin Anda ketahui.'
                                )}
                            </p>
                        </div>

                        {/* Badge Sambutan */}
                        <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white/90 border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <div className="w-5 h-5 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <BearFaceIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10.5px] font-black text-[#3d2314]">
                                Punya pertanyaan lain? Kami siap menjawab!
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. CATEGORY NAVIGATION HORIZONTAL TABS            */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-3 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-2 min-w-max lg:min-w-0 lg:grid lg:grid-cols-7">
                        {CATEGORIES.map((cat) => {
                            const IconComponent = cat.icon;
                            const isActive = selectedCategory === cat.id && searchQuery.trim() === '';
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setSearchQuery('');
                                    }}
                                    className={`p-3 rounded-2xl transition flex flex-col items-center text-center space-y-1 cursor-pointer w-36 lg:w-full ${isActive
                                        ? 'bg-[#FAF0E6] border border-[#e6ccb2] shadow-2xs'
                                        : 'hover:bg-[#FAF0E6]/50 border border-transparent'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#8c5a3c] text-white shadow-xs' : 'bg-[#FAF0E6] text-[#8c5a3c]'
                                        }`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className={`text-[11px] font-black tracking-wider uppercase leading-tight ${isActive ? 'text-[#8c5a3c]' : 'text-[#3d2314]'
                                        }`}>
                                        {cat.name}
                                    </div>
                                    <div className="text-[9.5px] text-[#6c584c] font-semibold line-clamp-1">
                                        {cat.desc}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. MAIN FAQ CONTENT & SIDEBAR                     */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* KOLOM KIRI: SEARCH INPUT + ACCORDION FAQ */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* SEARCH INPUT BAR DI ATAS FAQ */}
                        <div className="bg-white p-2 rounded-2xl border border-[#e6ccb2]/80 shadow-2xs">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari pertanyaan kamu di sini..."
                                    className="w-full bg-[#FAF0E6]/50 border border-[#e6ccb2]/60 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#3d2314] font-semibold focus:outline-none focus:bg-white focus:border-[#8c5a3c] placeholder:text-stone-400 transition"
                                />
                                <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="p-1 text-stone-400 hover:text-stone-700 absolute right-3 cursor-pointer"
                                        title="Hapus pencarian"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Section Header */}
                        <div className="border-b border-[#e6ccb2]/60 pb-3 space-y-0.5">
                            <div className="flex items-center gap-2">
                                <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                                <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                                    {searchQuery.trim() !== '' ? `HASIL PENCARIAN: "${searchQuery}"` : activeCategoryInfo.name}
                                </h2>
                            </div>
                            <p className="text-xs text-[#6c584c] font-semibold">
                                {searchQuery.trim() !== ''
                                    ? `Ditemukan ${filteredFAQs.length} pertanyaan terkait`
                                    : activeCategoryInfo.desc}
                            </p>
                        </div>

                        {/* Accordion List */}
                        <div className="space-y-3">
                            {filteredFAQs.length === 0 ? (
                                <div className="bg-white p-10 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2">
                                    <HelpCircle className="w-8 h-8 text-[#8c5a3c] mx-auto opacity-60" />
                                    <h3 className="font-black text-sm text-[#3d2314]">Pertanyaan Tidak Ditemukan</h3>
                                    <p className="text-xs text-[#6c584c]">
                                        Tidak ada pertanyaan yang cocok dengan kata kunci pencarian Anda. Silakan hubungi kami langsung via WhatsApp!
                                    </p>
                                </div>
                            ) : (
                                filteredFAQs.map((item) => {
                                    const isExpanded = expandedIds.includes(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded
                                                ? 'bg-white border-[#8c5a3c] shadow-xs'
                                                : 'bg-white border-[#e6ccb2]/80 hover:border-[#8c5a3c]/60'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleAccordion(item.id)}
                                                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer"
                                                aria-expanded={isExpanded}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${isExpanded
                                                        ? 'bg-[#e85a4f] text-white'
                                                        : 'bg-[#FAF0E6] text-[#8c5a3c]'
                                                        }`}>
                                                        ?
                                                    </div>
                                                    <span className="font-black text-xs sm:text-sm text-[#3d2314] leading-snug">
                                                        {item.question}
                                                    </span>
                                                </div>

                                                <div className="shrink-0 text-[#8c5a3c]">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-5 pb-5 pt-0 text-xs text-[#5a4232] font-semibold leading-relaxed border-t border-[#e6ccb2]/40 pt-3 ml-9">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN: SIDEBAR INFO & CHAT */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* CARD 1: MASIH ADA PERTANYAAN? */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-sm sm:text-base text-[#3d2314]">
                                        Masih ada pertanyaan?
                                    </h3>
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                </div>
                                <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                    Tim kami siap membantu menjawab pertanyaan dan kebutuhan Anda setiap hari.
                                </p>
                            </div>

                            <a
                                href="https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20ingin%20bertanya%20seputar%20cafe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>CHAT VIA WHATSAPP</span>
                            </a>
                        </div>

                        {/* CARD 2: TAUTAN CEPAT (QUICK LINKS) */}
                        <div className="bg-white p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/50 pb-2.5">
                                <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wider">
                                    TAUTAN CEPAT
                                </h3>
                                <BearPawIcon className="w-3.5 h-3.5 text-[#8c5a3c]" />
                            </div>

                            <div className="space-y-1 text-xs font-bold">
                                <Link
                                    href="/menu"
                                    className="p-2 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Menu Cafe</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <Link
                                    href="/event"
                                    className="p-2 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Event & Workshop</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <Link
                                    href="/birthday"
                                    className="p-2 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Ulang Tahun & Acara Privat</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <Link
                                    href="/merchandise"
                                    className="p-2 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Katalog Merchandise</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <Link
                                    href="/roblox"
                                    className="p-2 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>To Meet di Roblox</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <Link
                                    href="/blog"
                                    className="p-2 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Blog & Cerita</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* CARD 3: JAM BUKA CAFE */}
                        <div className="bg-white p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3.5">
                            {/* Header Card */}
                            <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                <Clock className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wider">
                                    JAM BUKA OPERASIONAL
                                </h3>
                            </div>

                            {/* Daftar Jam Operasional Per Cabang */}
                            <div className="space-y-3 text-xs">

                                {/* Cabang 1: Heavenland Park */}
                                <div className="bg-[#FAF0E6]/50 p-3 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-[#e85a4f] uppercase tracking-wider">
                                            HEAVENLAND PARK
                                        </span>
                                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded">
                                            Senin Libur
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[#3d2314]">
                                        <span className="text-[#6c584c] font-semibold">Selasa – Minggu</span>
                                        <span className="font-black text-xs">12.00 – 19.00 WIB</span>
                                    </div>
                                </div>

                                {/* Cabang 2: Pondok Mutiara */}
                                <div className="bg-[#FAF0E6]/50 p-3 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                            PONDOK MUTIARA
                                        </span>
                                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded">
                                            Senin Libur
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[#3d2314]">
                                        <span className="text-[#6c584c] font-semibold">Selasa – Minggu</span>
                                        <span className="font-black text-xs">12.00 – 21.00 WIB</span>
                                    </div>
                                </div>

                            </div>

                            {/* Footer Note */}
                            <div className="pt-2 border-t border-[#e6ccb2]/40 text-center">
                                <span className="text-[10px] font-black text-[#8c5a3c] uppercase">
                                    Sampai jumpa di To Meet Cafe!
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 4. BOTTOM CONTACT CTA SECTION                     */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                            <BearFaceIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="font-black text-base sm:text-lg text-[#3d2314]">
                                Belum menemukan jawaban yang Anda cari?
                            </h3>
                            <p className="text-xs text-[#6c584c] font-semibold mt-0.5">
                                Jangan ragu untuk menghubungi kami, tim kami akan dengan senang hati membantu Anda!
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/628123456789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                        <Mail className="w-3.5 h-3.5" />
                        <span>HUBUNGI KAMI</span>
                    </a>
                </div>
            </section>

        </div>
    );
}