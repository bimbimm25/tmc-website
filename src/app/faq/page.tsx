'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, ChevronDown, ChevronUp, MessageCircle,
    Coffee, Utensils, Calendar, Sparkles, Building2,
    ShoppingBag, MapPin, Clock, ArrowRight, HelpCircle,
    Mail, X, Phone, SlidersHorizontal
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
    {
        id: 'gen-18',
        category: 'general',
        question: 'Apakah To Meet Cafe sudah bersertifikasi halal?',
        answer: 'Ya, To Meet Cafe telah bersertifikasi halal dan berkomitmen untuk menjaga kehalalan produk melalui pemilihan bahan baku dan proses pengolahan yang sesuai dengan ketentuan halal.'
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

// Cache in-memory level modul agar saat navigasi page langsung instan tanpa glitch
let cachedFaqBanner: BannerItem | null = null;

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
}

export default function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<string[]>(['gen-1']);


    // Inisialisasi awal langsung dari cache modul jika ada
    const [banner, setBanner] = useState<BannerItem | null>(() => cachedFaqBanner);
    const [isBannerChecked, setIsBannerChecked] = useState<boolean>(() => cachedFaqBanner !== null);

    //dropdown
    const [isFaqCategoryDropdownOpen, setIsFaqCategoryDropdownOpen] = useState(false);

    useEffect(() => {
        async function fetchBanner() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/banners/faq`, { cache: 'default' });
                if (res.ok) {
                    const json = await res.json();
                    if (json?.data) {
                        cachedFaqBanner = json.data;
                        setBanner(json.data);
                    }
                }
            } catch {
                // fallback default
            } finally {
                setIsBannerChecked(true); // Pengecekan banner dashboard tuntas
            }
        }

        fetchBanner();
    }, []);

    // Prioritaskan gambar dari dashboard. Fallback ke hero-home hanya jika pengecekan selesai dan dashboard kosong
    const heroImage = useMemo(() => {
        if (banner?.image) {
            return banner.image.startsWith('http')
                ? banner.image
                : banner.image.startsWith('/img')
                    ? banner.image
                    : `${API_BASE_URL}/storage/${banner.image}`;
        }
        return isBannerChecked ? '/img/hero-home.png' : '';
    }, [banner, isBannerChecked]);

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
            {/* 1. HERO SECTION (SMOOTH & ANTI-GLITCH DASHBOARD)  */}
            {/* ================================================= */}
            <section
                className={`hidden lg:flex relative w-full h-screen min-h-dvh items-center overflow-hidden transition-colors duration-500 ${heroImage ? 'bg-transparent' : 'bg-[#FAF0E6]/30'
                    }`}
            >
                {/* 1. Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    {heroImage && (
                        <img
                            src={heroImage}
                            alt="To Meet Cafe FAQ Showcase"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={(e) => {
                                (e.currentTarget as HTMLElement).classList.remove('opacity-0');
                                (e.currentTarget as HTMLElement).classList.add('opacity-100');
                            }}
                            className="w-full h-full object-cover object-right lg:object-center opacity-0 transition-opacity duration-700 ease-out"
                        />
                    )}
                    {/* Gradient Overlay Putih Sebelah Kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent w-full sm:w-[80%] lg:w-[60%] pointer-events-none" />
                </div>

                {/* 2. Konten Text Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div
                        className={`max-w-md lg:max-w-lg space-y-3 sm:space-y-3.5 transition-all duration-700 ease-out ${isBannerChecked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                            }`}
                    >

                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#8c5a3c] text-[9.5px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <span>HELP CENTER</span>
                            <BearPawIcon className="w-3 h-3" />
                        </div>

                        {/* Title: Utamakan Dashboard -> Fallback Default jika tuntas & kosong */}
                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {banner?.title ? (
                                renderFormattedText(banner.title)
                            ) : isBannerChecked ? (
                                <>
                                    FREQUENTLY ASKED <br />
                                    <span className="text-[#8c5a3c]">QUESTIONS (FAQ)</span>
                                </>
                            ) : null}
                        </h1>

                        {/* Subtitle: Utamakan Dashboard -> Fallback Default jika tuntas & kosong */}
                        <div className="space-y-1 text-xs sm:text-[15px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            <p className="font-bold text-[#3d2314]">
                                Kami siap membantu Anda!
                            </p>
                            <p className="text-xs sm:text-[14px] text-[#6c584c]">
                                {banner?.subtitle ? (
                                    renderFormattedText(banner.subtitle)
                                ) : isBannerChecked ? (
                                    'Temukan jawaban seputar To Meet Cafe, menu lezat kami, reservasi, event seru, dan segala hal yang ingin Anda ketahui.'
                                ) : null}
                            </p>
                        </div>

                        {/* Badge Sambutan */}
                        <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-xl bg-white/90 border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <div className="w-5 h-5 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <BearFaceIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[13px] font-black text-[#3d2314]">
                                Punya pertanyaan lain? Kami siap menjawab!
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. CATEGORY NAVIGATION (DROPDOWN MOBILE & GRID DESKTOP) */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-0">

                {/* A. TAMPILAN KHUSUS MOBILE: ELEGANT ACCORDION DROPDOWN */}
                <div className="block lg:hidden relative z-20">
                    <div className="bg-white p-3.5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-2">
                        {/* Header Mini Keterangan */}
                        <div className="flex items-center justify-between px-1.5 pt-0.5">
                            <span className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Kategori FAQ
                            </span>
                            <span className="text-[10px] font-bold text-[#6c584c]">
                                {CATEGORIES.length} Topik
                            </span>
                        </div>

                        {/* Tombol Pemicu Dropdown Utama */}
                        {(() => {
                            const activeCat = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
                            const ActiveIcon = activeCat.icon;

                            return (
                                <button
                                    type="button"
                                    onClick={() => setIsFaqCategoryDropdownOpen(prev => !prev)}
                                    className="w-full bg-[#FAF0E6]/70 hover:bg-[#FAF0E6] border border-[#e6ccb2] rounded-2xl px-3.5 py-2.5 flex items-center justify-between transition-all duration-200 shadow-2xs cursor-pointer text-left active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                        <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-2xs shrink-0 border border-[#e6ccb2]/60">
                                            <ActiveIcon className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <span className="text-[9.5px] uppercase font-bold text-[#8c5a3c] block leading-none">
                                                Topik Pilihan:
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wide block mt-0.5 truncate">
                                                {activeCat.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Indikator Panah Berputar Halus */}
                                    <div className={`w-6 h-6 rounded-full bg-white/80 border border-[#e6ccb2]/60 flex items-center justify-center text-[#8c5a3c] transition-transform duration-300 shrink-0 ${isFaqCategoryDropdownOpen ? 'rotate-180 bg-[#8c5a3c] text-white' : ''
                                        }`}>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </button>
                            );
                        })()}

                        {/* List Opsi Dropdown Beranimasi Smooth */}
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isFaqCategoryDropdownOpen
                                ? 'grid-rows-[1fr] opacity-100 mt-2'
                                : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="bg-[#FAF0E6]/30 rounded-2xl border border-[#e6ccb2]/70 p-1.5 space-y-1 max-h-64 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {CATEGORIES.map((cat) => {
                                        const IconComponent = cat.icon;
                                        const isActive = selectedCategory === cat.id && searchQuery.trim() === '';

                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategory(cat.id);
                                                    setSearchQuery('');
                                                    setIsFaqCategoryDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${isActive
                                                    ? 'bg-[#8c5a3c] text-white shadow-2xs'
                                                    : 'hover:bg-white text-[#3d2314]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-white text-[#8c5a3c] border border-[#e6ccb2]/60'
                                                        }`}>
                                                        <IconComponent className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <span className={`text-[11.5px] font-black uppercase tracking-wider block truncate ${isActive ? 'text-white' : 'text-[#3d2314]'
                                                            }`}>
                                                            {cat.name}
                                                        </span>
                                                        <span className={`text-[10px] font-semibold block leading-tight truncate ${isActive ? 'text-white/80' : 'text-[#6c584c]'
                                                            }`}>
                                                            {cat.desc}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isActive && (
                                                    <div className="w-2 h-2 rounded-full bg-white shrink-0 shadow-xs" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* B. TAMPILAN KHUSUS DESKTOP (SEJAJAR RAPI & RATA) */}
                <div className="hidden lg:block bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-6 gap-2 xl:gap-3 items-stretch">
                        {CATEGORIES.map((cat) => {
                            const IconComponent = cat.icon;
                            const isActive = selectedCategory === cat.id && searchQuery.trim() === '';

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setSearchQuery('');
                                    }}
                                    className={`p-3 xl:p-4 rounded-2xl transition flex flex-col items-center justify-between text-center cursor-pointer w-full h-full ${isActive
                                            ? 'bg-[#FAF0E6] border border-[#e6ccb2] shadow-2xs'
                                            : 'hover:bg-[#FAF0E6]/50 border border-transparent'
                                        }`}
                                >
                                    {/* 1. Slot Icon: Tinggi tetap agar sejajar horizontal */}
                                    <div className="h-9 flex items-center justify-center">
                                        <div
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${isActive
                                                    ? 'bg-[#8c5a3c] text-white'
                                                    : 'bg-[#FAF0E6] text-[#8c5a3c]'
                                                }`}
                                        >
                                            <IconComponent className="w-4.5 h-4.5" />
                                        </div>
                                    </div>

                                    {/* 2. Slot Teks: Judul & Deskripsi terkunci tingginya */}
                                    <div className="w-full space-y-1 pt-2 flex-1 flex flex-col justify-center">
                                        {/* Judul: h-10 dengan flex items-center agar teks 1 atau 2 baris tetap tepat di tengah */}
                                        <div className="h-10 flex items-center justify-center">
                                            <span
                                                className={`text-[13px] font-black tracking-wider uppercase leading-tight px-1 ${isActive ? 'text-[#8c5a3c]' : 'text-[#3d2314]'
                                                    }`}
                                            >
                                                {cat.name}
                                            </span>
                                        </div>

                                        {/* Deskripsi: h-9 dengan flex items-start agar posisi awal teks sama rata */}
                                        <div className="h-9 flex items-start justify-center">
                                            <span className="text-[12px] text-[#6c584c] font-semibold leading-snug line-clamp-2 px-1">
                                                {cat.desc}
                                            </span>
                                        </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                    {/* KOLOM KIRI: SEARCH INPUT + ACCORDION FAQ */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* SEARCH INPUT BAR DI ATAS FAQ */}
                        <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-[#e6ccb2]/80 shadow-2xs">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari pertanyaan kamu di sini..."
                                    className="w-full bg-[#FAF0E6]/50 border border-[#e6ccb2]/60 rounded-xl pl-11 pr-11 py-3 text-xs sm:text-sm text-[#3d2314] font-semibold focus:outline-none focus:bg-white focus:border-[#8c5a3c] placeholder:text-[#a08a7b] transition"
                                />
                                <Search className="w-5 h-5 text-[#8c5a3c] absolute left-3.5" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="p-1.5 text-stone-400 hover:text-stone-700 absolute right-3 cursor-pointer transition"
                                        title="Hapus pencarian"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Section Header */}
                        <div className="border-b border-[#e6ccb2]/60 pb-3.5 space-y-1">
                            <div className="flex items-center gap-2.5">
                                <BearPawIcon className="w-5 h-5 text-[#8c5a3c]" />
                                <h2 className="text-base sm:text-lg lg:text-xl font-black text-[#3d2314] uppercase tracking-wide">
                                    {searchQuery.trim() !== '' ? `HASIL PENCARIAN: "${searchQuery}"` : activeCategoryInfo.name}
                                </h2>
                            </div>
                            {/* Deskripsi: Patokan text-xs sm:text-sm */}
                            <p className="text-xs sm:text-sm text-[#6c584c] font-semibold">
                                {searchQuery.trim() !== ''
                                    ? `Ditemukan ${filteredFAQs.length} pertanyaan terkait`
                                    : activeCategoryInfo.desc}
                            </p>
                        </div>

                        {/* Accordion List */}
                        <div className="space-y-3.5">
                            {filteredFAQs.length === 0 ? (
                                <div className="bg-white p-12 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2.5">
                                    <HelpCircle className="w-10 h-10 text-[#8c5a3c] mx-auto opacity-60" />
                                    <h3 className="font-black text-base text-[#3d2314]">Pertanyaan Tidak Ditemukan</h3>
                                    {/* Deskripsi: Patokan text-xs sm:text-sm */}
                                    <p className="text-xs sm:text-sm text-[#6c584c] max-w-md mx-auto leading-relaxed">
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
                                                <div className="flex items-center gap-3.5">
                                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-xs sm:text-sm font-black shadow-2xs transition-colors ${isExpanded
                                                        ? 'bg-[#e85a4f] text-white'
                                                        : 'bg-[#FAF0E6] text-[#8c5a3c]'
                                                        }`}>
                                                        ?
                                                    </div>
                                                    <span className="font-black text-xs sm:text-sm text-[#3d2314] leading-snug">
                                                        {item.question}
                                                    </span>
                                                </div>

                                                <div className="shrink-0 text-[#8c5a3c] pl-2">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    )}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-5 pb-5 pt-3 border-t border-[#e6ccb2]/40 ml-10 sm:ml-11">
                                                    {/* Jawaban FAQ: Patokan text-xs sm:text-sm */}
                                                    <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                                        {item.answer}
                                                    </p>
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
                        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-base sm:text-lg text-[#3d2314]">
                                        Masih ada pertanyaan?
                                    </h3>
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                </div>
                                {/* Deskripsi: Patokan text-xs sm:text-sm */}
                                <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                                    Tim kami siap membantu menjawab pertanyaan dan kebutuhan Anda setiap hari.
                                </p>
                            </div>

                            <a
                                href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20ingin%20bertanya%20seputar%20cafe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4 fill-current" />
                                <span>CHAT VIA WHATSAPP</span>
                            </a>
                        </div>

                        {/* CARD 2: TAUTAN CEPAT (QUICK LINKS) */}
                        <div className="bg-white p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3.5">
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/50 pb-3">
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wider">
                                    TAUTAN CEPAT
                                </h3>
                                <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                            </div>

                            <div className="space-y-1.5 text-xs sm:text-sm font-bold">
                                <Link
                                    href="/menu"
                                    className="p-2.5 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Menu Cafe</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/event"
                                    className="p-2.5 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Event & Workshop</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/birthday"
                                    className="p-2.5 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Ulang Tahun & Acara Privat</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/merchandise"
                                    className="p-2.5 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Katalog Merchandise</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/roblox"
                                    className="p-2.5 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>To Meet di Roblox</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/blog"
                                    className="p-2.5 rounded-xl flex items-center justify-between text-[#5a4232] hover:bg-[#FAF0E6]/50 hover:text-[#8c5a3c] transition"
                                >
                                    <span>Blog & Cerita</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* {jam buka operasional} */}
                        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-[#e6ccb2]/50 pb-3">
                                <Clock className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wider">
                                    JAM BUKA OPERASIONAL
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {/* Cabang 1: Heavenland Park */}
                                <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] sm:text-xs font-black text-[#e85a4f] uppercase tracking-wider whitespace-nowrap">
                                            HEAVENLAND PARK
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-red-700 bg-red-100/90 border border-red-300 px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                                            Sedang Renovasi
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-[#3d2314]">
                                        <span className="text-xs sm:text-sm text-[#6c584c] font-semibold whitespace-nowrap">Saat ini belum buka</span>
                                        <span className="font-black text-xs sm:text-sm whitespace-nowrap">Pantau info terbaru</span>
                                    </div>
                                </div>

                                {/* Cabang 2: Pondok Mutiara */}
                                <div className="bg-[#FAF0E6]/50 p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] sm:text-xs font-black text-[#8c5a3c] uppercase tracking-wider whitespace-nowrap">
                                            PONDOK MUTIARA
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                                            Senin Libur
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-[#3d2314]">
                                        <span className="text-xs sm:text-sm text-[#6c584c] font-semibold whitespace-nowrap">Selasa – Minggu</span>
                                        <span className="font-black text-xs sm:text-sm whitespace-nowrap">12.00 – 22.00 WIB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-[#e6ccb2]/40 text-center">
                                <span className="text-[11px] sm:text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
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
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                            <BearFaceIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-sm sm:text-base lg:text-lg text-[#3d2314] tracking-tight uppercase">
                                Belum menemukan jawaban yang Anda cari?
                            </h3>
                            {/* Deskripsi: Patokan text-xs sm:text-sm */}
                            <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed max-w-xl">
                                Jangan ragu untuk menghubungi kami, tim kami akan dengan senang hati membantu Anda!
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/6282141609328"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 sm:px-7 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-xs sm:text-sm rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider shrink-0 cursor-pointer whitespace-nowrap"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>HUBUNGI KAMI</span>
                    </a>
                </div>
            </section>
        </div>
    )
}