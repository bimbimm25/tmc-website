'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, ChevronDown, ChevronUp, MessageCircle,
    Coffee, Utensils, Calendar, Sparkles, Building2,
    ShoppingBag, MapPin, Clock, ArrowRight, HelpCircle,
    Mail, X, Phone
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
        question: 'Cafe cabang Pondok Mutiara buka pukul berapa?',
        answer: 'To Meet Cafe cabang Pondok Mutiara beroperasi Selasa–Minggu pukul 12.00–22.00 WIB. Pemesanan terakhir pukul 21.00 WIB.'
    },
    {
        id: 'gen-2',
        category: 'general',
        question: 'Cabang Heavenland tutup pukul berapa?',
        answer: 'Cabang Heavenland sedang tutup sementara untuk renovasi. Saat beroperasi, cabang ini buka pukul 12.00–19.00 WIB, dengan pemesanan terakhir pukul 18.30 WIB.'
    },
    {
        id: 'gen-3',
        category: 'general',
        question: 'Apakah cabang Pondok Mutiara tutup setiap hari Senin?',
        answer: 'Cabang Pondok Mutiara tutup setiap hari Senin dan kembali buka pada hari Selasa.'
    },
    {
        id: 'gen-4',
        category: 'general',
        question: 'Apakah durasi kunjungan dibatasi maksimal 2 jam?',
        answer: 'Saat cafe ramai dan terdapat antrean, waktu makan di tempat dibatasi maksimal 2 jam. Jika tidak ada antrean, Anda dapat bersantai lebih lama.'
    },
    {
        id: 'gen-5',
        category: 'general',
        question: 'Pemesanan melalui GoFood dapat dilakukan mulai pukul berapa?',
        answer: 'Pemesanan melalui GoFood tersedia mulai pukul 12.30 WIB.'
    },
    {
        id: 'gen-6',
        category: 'general',
        question: 'Apakah To Meet Cafe tersedia di ShopeeFood, GrabFood, dan GoFood?',
        answer: 'Anda dapat memesan menu To Meet Cafe melalui GoFood. Saat ini, layanan pesan antar kami belum tersedia di ShopeeFood maupun GrabFood.'
    },
    {
        id: 'gen-7',
        category: 'general',
        question: 'Kapan saja badut maskot berkeliling di area cafe?',
        answer: 'Badut maskot hadir hari Selasa–Minggu dengan waktu berkeliling yang tidak tetap.'
    },
    {
        id: 'gen-8',
        category: 'general',
        question: 'Apakah To Meet Cafe menerima pembayaran tunai dan nontunai?',
        answer: 'Pembayaran di To Meet Cafe dilakukan secara nontunai. Kami menerima QRIS, kartu debit, dan kartu kredit.'
    },
    {
        id: 'gen-9',
        category: 'general',
        question: 'Berapa minimum transaksi untuk pembayaran dengan kartu kredit?',
        answer: 'Pembayaran dengan kartu kredit berlogo Visa, Mastercard, atau JCB dapat dilakukan dengan minimum transaksi Rp150.000.'
    },
    {
        id: 'gen-10',
        category: 'general',
        question: 'Apakah harga yang tertera pada menu sudah termasuk pajak?',
        answer: 'Harga makanan dan minuman yang tertera pada menu belum termasuk pajak.'
    },
    {
        id: 'gen-11',
        category: 'general',
        question: 'Berapa minimum pemesanan untuk bermain di playground?',
        answer: 'Ketentuan minimum pemesanan untuk bermain di playground mengikuti promo yang berlaku. Informasi promo terbaru dapat dilihat di Instagram resmi To Meet Cafe.'
    },
    {
        id: 'gen-12',
        category: 'general',
        question: 'Apa saja syarat dan ketentuan untuk bermain di playground?',
        answer: 'Untuk bermain di playground, berlaku ketentuan minimum pemesanan. Playground dapat digunakan oleh anak dengan tinggi badan maksimal 125 cm. Anak di bawah usia 3 tahun wajib didampingi orang tua, dan setiap pengunjung area playground wajib memakai kaos kaki.'
    },
    {
        id: 'gen-13',
        category: 'general',
        question: 'Apakah To Meet Cafe menjual kaos kaki untuk digunakan di playground?',
        answer: 'Kami menyediakan kaos kaki untuk playground di kasir dengan harga Rp5.000.'
    },
    {
        id: 'gen-14',
        category: 'general',
        question: 'Apakah pembelian Paket Surprise sudah mencakup akses ke playground?',
        answer: 'Akses playground untuk satu anak melalui Paket Surprise mengikuti ketentuan promo yang berlaku saat pemesanan.'
    }, 
    {
        id: 'gen-15',
        category: 'general',
        question: 'Cabang To Meet Cafe mana yang memiliki kolam pancing?',
        answer: 'Kolam pancing tersedia di To Meet Cafe cabang Pondok Mutiara.'
    }, 
    {
        id: 'gen-16',
        category: 'general',
        question: 'Apakah penggunaan area kolam pancing (fishing) dikenakan biaya',
        answer: 'Penggunaan area kolam pancing dikenakan biaya Rp10.000'
    }, 
    {
        id: 'gen-17',
        category: 'general',
        question: 'Apakah To Meet Cafe  membuka peluang kemitraan atau franchise?',
        answer: 'Saat ini, To Meet Cafe belum membuka peluang kemitraan atau franchise. Semoga program kemitraan dapat segera tersedia dalam waktu dekat.'
    }, 

    // Reservasi
    {
        id: 'res-1',
        category: 'reservation',
        question: 'Apakah perlu reservasi sebelum datang ke To Meet Cafe?',
        answer: 'Anda bisa langsung datang tanpa reservasi dan tanpa minimum pemesanan. Jika ingin melakukan reservasi, berlaku ketentuan minimum pemesanan'
    },
    {
        id: 'res-2',
        category: 'reservation',
        question: 'Apakah saya bisa melakukan reservasi meja untuk hari ini? ',
        answer: 'Reservasi dapat dilakukan paling lambat satu hari sebelum kedatangan (H-1). Jika ingin datang hari ini, Anda bisa langsung berkunjung tanpa reservasi'
    },
    {
        id: 'res-3',
        category: 'reservation',
        question: 'Apakah reservasi meja memiliki batas waktu penggunaan?',
        answer: 'Baik dengan reservasi maupun datang langsung, waktu makan dibatasi maksimal 2 jam. Jika tidak ada antrean, Anda dapat duduk lebih lama'
    },
    {
        id: 'res-4',
        category: 'reservation',
        question: 'Apakah To Meet Cafe menerima reservasi untuk perayaan ulang tahun?',
        answer: 'Tentu bisa! To Meet Cafe menerima reservasi untuk perayaan ulang tahun. Silakan hubungi admin kami melalui WhatsApp untuk mengetahui paket yang tersedia dan melakukan reservasi.'
    },
    {
        id: 'res-5',
        category: 'reservation',
        question: 'Apakah ada minimum pemesanan per orang untuk berkunjung ke To Meet Cafe?',
        answer: 'Jika datang langsung, tidak ada minimum pembelian per orang. Untuk reservasi, berlaku minimum pemesanan Rp320.000 per meja.'
    },
    {
        id: 'res-6',
        category: 'reservation',
        question: 'Apakah ada minimum pembelian bagi pengunjung yang datang langsung (dine-in)',
        answer: 'Tidak ada minimum pembelian untuk pengunjung yang datang langsung (tanpa reservasi)'
    },
    {
        id: 'res-7',
        category: 'reservation',
        question: 'Jika total pesanan kurang dari Rp320.000, apakah tetap bisa reservasi?',
        answer: 'Minimum pemesanan untuk reservasi adalah Rp320.000 per meja dengan kapasitas maksimal 4 orang. Pesanan di bawah Rp320.000 belum memenuhi ketentuan reservasi.'
    },
    {
        id: 'res-8',
        category: 'reservation',
        question: 'Bagaimana cara menghubungi To Meet Cafe untuk reservasi?',
        answer: 'Untuk reservasi, silakan hubungi WhatsApp resmi To Meet Cafe di +62 821-4160-9328'
    },
    {
        id: 'res-9',
        category: 'reservation',
        question: 'Apakah perlu reservasi untuk memesan menu dengan tulisan HBD?',
        answer: 'Tidak perlu reservasi. Anda dapat memesannya langsung saat berkunjung. Kami menyediakan tulisan ucapan tanpa biaya tambahan, dan lilin dapat dibeli di kasir'
    },

    // Event & Ulang Tahun
    {
        id: 'event-1',
        category: 'event',
        question: 'Apakah To Meet Cafe menyediakan birthday treats?',
        answer: 'Kami menyediakan paket surprise birthday atau birthday menu, yang detailnya dapat dilihat di menu digital kami'
    },
    {
        id: 'event-2',
        category: 'event',
        question: 'Apakah saya bisa meminta tulisan “HBD" di piring?',
        answer: 'Dengan melakukan pembelian lilin, Anda dapat meminta tulisan “HBD” di piring tanpa biaya tambahan.'
    },
    {
        id: 'event-3',
        category: 'event',
        question: 'Apakah permintaan tulisan “HBD” bisa dilakukan langsung di cafe?',
        answer: 'Anda dapat menyampaikannya saat memesan langsung di cafe.'
    },
    {
        id: 'event-4',
        category: 'event',
        question: 'Apakah boleh membawa kue ulang tahun (birthday cake) sendiri?',
        answer: 'Anda boleh membawa kue ulang tahun dari luar untuk keperluan foto. Namun, kue tersebut tidak dapat dikonsumsi di dalam cafe'
    },
    {
        id: 'event-5',
        category: 'event',
        question: 'Apakah Paket Surprise Birthday bisa dipesan langsung di cafe tanpa reservasi ?',
        answer: 'Tidak perlu reservasi. Paket Surprise Birthday bisa dipesan langsung saat Anda berkunjung ke cafe.'
    },
    {
        id: 'event-6',
        category: 'event',
        question: 'Apakah total minimum pembelian untuk Paket Surprise Birthday hanya Rp150.000?',
        answer: 'Harga Paket Surprise Birthday adalah Rp150.000. Paket ini dapat dipesan dengan tambahan pembelian menu minimal Rp150.000, sehingga total minimum transaksi menjadi Rp300.000.'
    },
    {
        id: 'event-7',
        category: 'event',
        question: 'Apakah tersedia paket ulang tahun untuk 50 orang?',
        answer: 'Kami menyediakan paket ulang tahun untuk acara privat, dengan harga mulai dari Rp3.500.000. Informasi pilihan paket dapat dilihat di halaman Birthday kami'
    },
    {
        id: 'event-8',
        category: 'event',
        question: 'Apakah kue dalam Paket Surprise Birthday bisa dipilih?',
        answer: 'Paket Surprise Birthday sudah termasuk mousse cake berbentuk beruang dan lilin. Jika menginginkan kue lain, Anda dapat memilih dari menu birthday cake dengan biaya tambahan'
    },
    {
        id: 'event-9',
        category: 'event',
        question: 'Apakah meja untuk Paket Birthday bisa ditambahkan dekorasi?',
        answer: 'Tentu bisa. Anda dapat menambahkan dekorasi meja pada Paket Birthday. Untuk detail pilihan dan pemesanan, silahkan hubungi admin kami melalui WhatsApp'
    },

    // Fasilitas
    {
        id: 'fac-1',
        category: 'facilities',
        question: 'Apakah To Meet Cafe menyediakan Wi-Fi untuk pengunjung?',
        answer: 'Ya, To Meet Cafe menyediakan Wi-Fi untuk pengunjung. Untuk mendapatkan kata sandinya, silakan menghubungi kasir atau staf kami'
    },
    {
        id: 'fac-2',
        category: 'facilities',
        question: 'Cabang To Meet Cafe mana saja yang memiliki playground?',
        answer: 'Playground tersedia di cabang Pondok Mutiara dan Heavenland. Jika Anda mencari area bermain yang lebih luas, kami menyarankan cabang Pondok Mutiara. Saat ini, cabang Heavenland masih tutup sementara untuk renovasi.'
    },
    {
        id: 'fac-3',
        category: 'facilities',
        question: 'Apakah To Meet Cafe memiliki lift?',
        answer: 'Mohon maaf,  Saat ini To Meet Cafe belum dilengkapi fasilitas lift.'
    },
    {
        id: 'fac-4',
        category: 'facilities',
        question: 'Ada berapa lantai di To Meet Cafe cabang Pondok Mutiara? Apakah tersedia lift?',
        answer: 'To Meet Cafe cabang Pondok Mutiara memiliki tiga lantai. Saat ini akses antar lantai melalui tangga, karena fasilitas lift belum tersedia'
    },
    {
        id: 'fac-5',
        category: 'facilities',
        question: 'Apakah tersedia ruang laktasi atau tempat untuk mengganti popok/pampers bayi?',
        answer: 'Mohon maaf, saat ini kami belum menyediakan ruang khusus untuk laktasi. Jika perlu mengganti popok si kecil, tersedia area meja yang cukup luas di dekat wastafel toilet umum lantai 2 dan 3.'
    },
    {
        id: 'fac-6',
        category: 'facilities',
        question: 'Apakah tersedia musholla di To Meet Cafe cabang Pondok Mutiara?',
        answer: 'Mohon maaf, saat ini fasilitas musholla belum tersedia di To Meet Cafe cabang Pondok Mutiara'
    },

    // Merchandise
    {
        id: 'merch-1',
        category: 'merchandise',
        question: 'Apakah To Meet Cafe menjual squishy?',
        answer: 'Squishy tersedia di To Meet Cafe. Harganya mulai dari Rp20.000.'
    },
    {
        id: 'merch-2',
        category: 'merchandise',
        question: 'Apakah merchandise To Meet Cafe bisa dipesan secara online?',
        answer: 'Saat ini, merchandise hanya dapat dibeli langsung di To Meet Cafe cabang Pondok Mutiara.'
    },

    // Lokasi & Parkir
    {
        id: 'loc-1',
        category: 'location',
        question: 'To Meet Cafe berlokasi di mana?',
        answer: 'To Meet Cafe berlokasi di Sidoarjo, Jawa Timur'
    },
    {
        id: 'loc-2',
        category: 'location',
        question: 'Apakah To Meet Cafe memiliki cabang di Jakarta?',
        answer: 'Saat ini, To Meet Cafe belum memiliki cabang di Jakarta. Seluruh cabang kami berlokasi di Sidoarjo, Jawa Timur'
    },
    {
        id: 'loc-3',
        category: 'location',
        question: 'Apa perbedaan menu di cabang Heavenland dan Pondok Mutiara?',
        answer: 'Cabang Heavenland menyediakan minuman dan dessert. Di cabang Pondok Mutiara, pilihan menunya lebih lengkap dan tersedia berbagai makanan berat.'
    },
    {
        id: 'loc-4',
        category: 'location',
        question: 'Apakah cabang Heavenland berada di daerah Candi?',
        answer: 'Betul cabang Heavenland berada di daerah Candi. Namun saat ini, cabang tersebut masih tutup sementara karena renovasi.'
    },
    {
        id: 'loc-5',
        category: 'location',
        question: 'Apakah cabang Pondok Mutiara berada di dekat Lippo Mall?',
        answer: 'Betul, cabang Pondok Mutiara berada di dekat Lippo Mall. '
    },
];

const CATEGORIES = [
    { id: 'general', name: 'UMUM', desc: 'Info umum tentang To Meet Cafe', icon: Coffee },
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
        <div className="min-h-screen space-y-6 sm:space-y-10 pb-14">

            {/* ================================================= */}
            {/* 1. HERO SECTION (HANYA DITAMPILKAN DI DESKTOP)    */}
            {/* ================================================= */}
            <section className="hidden lg:flex relative w-full h-screen min-h-dvh items-center overflow-hidden">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={bannerImage}
                        alt="To Meet Cafe FAQ Showcase"
                        className="w-full h-full object-cover object-right lg:object-center"
                    />
                    {/* Gradient Overlay Putih Sebelah Kiri */}
                    <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-transparent w-full sm:w-[80%] lg:w-[60%]" />
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
                        <div className="space-y-1 text-xs sm:text-[15px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            <p className="font-bold text-[#3d2314]">
                                Kami siap membantu Anda!
                            </p>
                            <p className="text-xs sm:text-[14px] text-[#6c584c]">
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
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-0">
                <div className="bg-white p-3 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-2 min-w-max lg:min-w-0 lg:grid lg:grid-cols-6">
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
                                    className={`p-2.5 rounded-2xl transition flex flex-col items-center text-center space-y-1 cursor-pointer w-[7.2rem] sm:w-[7.5rem] lg:w-full ${isActive
                                        ? 'bg-[#FAF0E6] border border-[#e6ccb2] shadow-2xs'
                                        : 'hover:bg-[#FAF0E6]/50 border border-transparent'
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#8c5a3c] text-white shadow-xs' : 'bg-[#FAF0E6] text-[#8c5a3c]'
                                        }`}>
                                        <IconComponent className="w-3.5 h-3.5" />
                                    </div>
                                    <div className={`text-[10px] font-black tracking-wider uppercase leading-tight ${isActive ? 'text-[#8c5a3c]' : 'text-[#3d2314]'
                                        }`}>
                                        {cat.name}
                                    </div>
                                    <div className="text-[8.5px] text-[#6c584c] font-semibold line-clamp-1">
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
                                href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20ingin%20bertanya%20seputar%20cafe"
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
                            <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-2.5">
                                <Clock className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wider">
                                    JAM BUKA OPERASIONAL
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                {/* Cabang 1: Heavenland Park */}
                                <div className="bg-[#FAF0E6]/50 p-3 rounded-2xl border border-[#e6ccb2]/60 space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-black text-[#e85a4f] uppercase tracking-wider">
                                            HEAVENLAND PARK
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-wide text-red-700 bg-red-100 border border-red-300 px-2 py-1 rounded-full shadow-sm">
                                            Sedang Direnovasi
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[#3d2314]">
                                        <span className="text-[#6c584c] font-semibold">Saat ini belum buka</span>
                                        <span className="font-black text-xs">Pantau info terbaru</span>
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
                        href="https://wa.me/6282141609328"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>HUBUNGI KAMI</span>
                    </a>
                </div>
            </section>

        </div>
    );
}