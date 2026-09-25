import Link from 'next/link';
import {
    Heart, Users, Sparkles, Award, MapPin,
    Smile, Utensils, Star, ExternalLink, ShieldCheck,
    CheckCircle2, Clock, Calendar, Flag
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

// Fetch Banner Dinamis dari Dashboard Admin
async function getAboutBanner(): Promise<BannerData | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/banners/about`, {
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.data || null;
    } catch (error) {
        console.warn("About Banner API offline / fallback used:", error);
        return null;
    }
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

// Data Milestone Perjalanan To Meet Cafe
const MILESTONES = [
    {
        year: '2023',
        title: 'The First Spark: Heavenland Park',
        desc: 'To Meet Cafe pertama kali hadir di Heavenland Park, Sidoarjo. Membawa konsep dessert manis dan ramah keluarga bertema beruang.',
        tag: 'Birth of To Meet'
    },
    {
        year: '2024',
        title: 'Signature Bear Menu & Playground',
        desc: 'Meluncurkan menu ikonik Onigiri Teddy dan minuman beruang, serta memperluas area playground indoor yang aman untuk anak.',
        tag: 'Menu Innovation'
    },
    {
        year: '2025',
        title: 'Ekspansi Cabang Pondok Mutiara',
        desc: 'Membuka outlet kedua di Pondok Mutiara dengan kapasitas lebih luas untuk private birthday party, workshop, dan merchandise corner.',
        tag: 'Second Outlet'
    },
    {
        year: '2026',
        title: 'Roblox World & Digital Ecosystem',
        desc: 'Menghubungkan cafe fisik dengan dunia virtual interaktif To Meet di Roblox dan penyempurnaan sistem pemesanan digital menu.',
        tag: 'Digital Universe'
    }
];

export default async function AboutPage() {
    const aboutBanner = await getAboutBanner();

    const heroImageSrc = aboutBanner?.image
        ? (aboutBanner.image.startsWith('http')
            ? aboutBanner.image
            : aboutBanner.image.startsWith('/img')
                ? aboutBanner.image
                : `${API_BASE_URL}/storage/${aboutBanner.image}`)
        : '/img/hero-home.png';

    return (
        <div className="min-h-screen overflow-hidden space-y-0">

            {/* ================================================= */}
            {/* 1. HERO SECTION (PAS & PROPORSIONAL)              */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden border-b border-[#e6ccb2]/50">
                {/* 1. Background Image & Decorative Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImageSrc}
                        alt="To Meet Cafe Atmosphere"
                        className="w-full h-full object-cover object-[75%_center] lg:object-right xl:object-center"
                    />

                    {/* Gradien Putih Halus Sisi Kiri (Desktop) */}
                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full lg:w-3/5 xl:w-1/2" />

                    {/* Soft Vignette Khusus Mobile agar Karakter Beruang Stand Out */}
                    <div className="block lg:hidden absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />

                    {/* Watermark Paw prints samar di latar belakang */}
                    <BearPawIcon className="absolute top-20 right-6 w-16 h-16 text-white/30 rotate-12 pointer-events-none" />
                    <BearPawIcon className="absolute top-44 right-24 w-8 h-8 text-white/20 -rotate-15 pointer-events-none" />
                </div>

                {/* 2. Konten Text Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-14 sm:pt-16">
                    <div className="max-w-md lg:max-w-xl space-y-2.5 sm:space-y-3 bg-white/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 sm:p-5 lg:p-0 rounded-2xl lg:rounded-none border border-white/80 lg:border-none shadow-md lg:shadow-none">

                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#e85a4f] text-[9px] font-black border border-[#e6ccb2]/80 shadow-2xs">
                            <span>ABOUT TO MEET</span>
                            <BearPawIcon className="w-2.5 h-2.5" />
                        </div>

                        {/* Title Proporsional */}
                        <h1 className="text-xl sm:text-2xl lg:text-[2.2rem] font-black text-[#2e170c] tracking-tight leading-[1.2]">
                            {renderFormattedText(
                                aboutBanner?.title,
                                <>
                                    MORE THAN A CAFE, <br />
                                    IT&apos;S A HAPPY PLACE TO MEET <br />
                                    <span className="text-[#8c5a3c]">& CREATE MEMORIES.</span>
                                </>
                            )}
                        </h1>

                        {/* Subtitle Ringkas */}
                        <p className="text-[11px] sm:text-xs lg:text-[15px] text-[#4a3427] font-semibold leading-relaxed max-w-md">
                            {renderFormattedText(
                                aboutBanner?.subtitle,
                                'To Meet is a cozy bear-themed cafe & playground created for everyone to enjoy sweet treats, good times, and heartwarming moments together.'
                            )}
                        </p>

                        {/* Tombol Aksi */}
                        <div className="pt-1 grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 max-w-sm sm:max-w-none">
                            <a
                                href="#story"
                                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black rounded-full text-[10.5px] sm:text-xs transition duration-200 shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            >
                                <span>{aboutBanner?.cta_text || 'OUR STORY'}</span>
                                <BearPawIcon className="w-3 h-3 shrink-0" />
                            </a>

                            <Link
                                href="/#locations"
                                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full transition flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md whitespace-nowrap"
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

                            {/* Kolom Kiri: Visual Gambar About */}
                            <div className="lg:col-span-6 flex justify-center">
                                <div className="w-full max-w-md bg-white rounded-[2rem] border border-[#e6ccb2] p-3 sm:p-4 shadow-sm relative group">

                                    {/* Ikon Floating Badge & Dekorasi */}
                                    <div className="absolute -top-3 -left-2 z-20 w-11 h-11 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-md border border-[#e6ccb2]/70 group-hover:scale-105 transition duration-300">
                                        <BearFaceIcon className="w-6 h-6" />
                                    </div>

                                    <div className="absolute -top-2 -right-2 text-[#e85a4f]/25 z-10 pointer-events-none">
                                        <Heart className="w-8 h-8 fill-current" />
                                    </div>

                                    {/* Container Gambar Utama */}
                                    <div className="w-full aspect-[4/3] bg-stone-100 rounded-[1.5rem] overflow-hidden border border-[#e6ccb2]/60 relative shadow-2xs">
                                        <img
                                            src="/img/about-img.png"
                                            alt="To Meet Cafe Story"
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />

                                        {/* Overlay Gradient Halus Bawah */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#3d2314]/60 via-transparent to-transparent opacity-80" />

                                        {/* Label Teks Melayang */}
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

                            {/* Kolom Kanan: Narasi Cerita */}
                            <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 text-[#e85a4f] font-black tracking-widest text-[10.5px] uppercase">
                                    <span>OUR STORY</span>
                                    <BearPawIcon className="w-3.5 h-3.5" />
                                </div>

                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                    How To Meet Cafe Started
                                </h2>

                                <div className="space-y-2.5 text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed">
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
            {/* NEW 1: HALAL CERTIFIED & QUALITY COMMITMENT       */}
            {/* <section className="w-full py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#FAF0E6]/70 rounded-[2.5rem] border border-[#e6ccb2] p-6 sm:p-10 lg:p-12 shadow-2xs relative overflow-hidden">
                            
                        <BearPawIcon className="absolute -right-8 -bottom-8 w-44 h-44 text-[#e6ccb2]/40 -rotate-12 pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                            
                            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-white rounded-3xl border border-[#e6ccb2]/80 shadow-sm">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-inner border border-emerald-100">
                                    <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11" />
                                </div>
                                <span className="inline-block px-3 py-1 bg-emerald-100/70 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-wider mb-2">
                                    100% Halal Ingredients
                                </span>
                                <h3 className="text-lg sm:text-xl font-black text-[#3d2314] uppercase tracking-tight">
                                    HALAL & HYGIENIC
                                </h3>
                                <p className="text-xs text-[#6c584c] font-semibold mt-1">
                                    Disiapkan dengan penuh rasa aman untuk seluruh keluarga dan si kecil.
                                </p>
                            </div>

                            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                                <div className="space-y-1.5">
                                    <div className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-emerald-700 tracking-widest uppercase">
                                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>QUALITY & TRUST COMMITMENT</span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                        Makan Nyaman, Hati Tenang di To Meet
                                    </h2>
                                    <p className="text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed">
                                        Kami memahami pentingnya kehalalan dan kebersihan makanan bagi keluarga Anda. Setiap menu To Meet Cafe diolah menggunakan bahan-bahan bersertifikasi halal, tanpa alkohol, dan tanpa bahan non-halal lainnya dengan standar sanitasi dapur yang ketat.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                    <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <h4 className="font-black text-xs text-[#3d2314] uppercase">No Pork, No Lard</h4>
                                        </div>
                                        <p className="text-[10px] text-[#6c584c] font-semibold leading-tight">
                                            100% bebas dari bahan hewani non-halal dan turunannya.
                                        </p>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Alcohol-Free</h4>
                                        </div>
                                        <p className="text-[10px] text-[#6c584c] font-semibold leading-tight">
                                            Semua saus, bumbu, sirup, dan dessert murni tanpa campuran alkohol.
                                        </p>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#e6ccb2]/60 space-y-1">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Kid-Friendly Food</h4>
                                        </div>
                                        <p className="text-[10px] text-[#6c584c] font-semibold leading-tight">
                                            Rasa seimbang, ramah anak, serta kaya nutrisi baik.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>       */}
            {/* ================================================= */}
            

            {/* ================================================= */}
            {/* NEW 2: MILESTONES (OUR JOURNEY)                   */}
            {/* <section className="w-full py-14 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#e85a4f] tracking-widest uppercase">
                            <Clock className="w-3.5 h-3.5" />
                            <span>OUR MILESTONES</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3d2314] tracking-tight uppercase">
                            Perjalanan Kami Dari Waktu ke Waktu
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6c584c] font-semibold">
                            Setiap langkah kecil yang kami lalui bersama Anda untuk menciptakan ruang bahagia yang selalu dirindukan.
                        </p>
                    </div>

                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
                        {MILESTONES.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-300 flex flex-col justify-between space-y-4 group relative"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl sm:text-3xl font-black text-[#8c5a3c] tracking-tight group-hover:text-[#e85a4f] transition duration-200">
                                            {item.year}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[9px] font-black uppercase rounded-full border border-[#e6ccb2]/60">
                                            {item.tag}
                                        </span>
                                    </div>

                                    <h3 className="font-black text-sm text-[#3d2314] leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-[#e6ccb2]/40 flex items-center gap-1.5 text-[#8c5a3c] text-[10px] font-bold">
                                    <BearPawIcon className="w-3 h-3 text-[#e85a4f]" />
                                    <span>To Meet Chapter</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>*/}
            {/* ================================================= */}
            

            {/* ================================================= */}
            {/* 3. OUR MISSION & VALUES                           */}
            {/* ================================================= */}
            <section className="w-full py-14 lg:py-16 bg-white/40 border-y border-[#e6ccb2]/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        <div className="lg:col-span-3 text-center lg:text-left space-y-1.5">
                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                OUR MISSION<br />& VALUES
                                <Heart className="inline-block w-4 h-4 ml-1.5 text-[#e85a4f] fill-[#e85a4f]" />
                            </h2>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3.5">

                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <BearFaceIcon className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">HAPPINESS</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We create happiness in every bite, every sip, and every moment.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">TOGETHERNESS</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We believe in the joy of being together and building connections.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <BearPawIcon className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">CREATIVITY</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We inspire creativity through fun experiences, activities, and designs.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-2">
                                <div className="w-9 h-9 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <Utensils className="w-4 h-4" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">QUALITY</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
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

                    {/* Header Ekosistem */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#e6ccb2]/50 pb-4 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-[#e85a4f] tracking-widest uppercase">
                                <span>ECOSYSTEM</span>
                                <Sparkles className="w-3 h-3" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                TO MEET UNIVERSE
                            </h2>
                            <p className="text-xs text-[#6c584c] font-semibold max-w-xl">
                                Dunia penuh kehangatan bersama teman beruang, tempat nongkrong nyaman, dan petualangan seru untuk seluruh keluarga.
                            </p>
                        </div>

                        <Link
                            href="/roblox"
                            className="px-4 py-2 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-extrabold rounded-full text-[9.5px] uppercase tracking-wider transition duration-200 shadow-md shadow-rose-500/20 inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                            <span>EXPLORE ROBLOX MAP</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* 6 Grid Card Ekosistem */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">

                        {/* 1. Visit Cafe */}
                        <Link
                            href="/#locations"
                            className="bg-white p-3 sm:p-3.5 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square flex items-center justify-center shrink-0">
                                <img
                                    src="/img/icon-visit-cafe.png"
                                    alt="Visit Cafe"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-[10.5px] sm:text-[11px] text-[#3d2314] uppercase tracking-wide leading-tight">
                                    CAFE & PLAYGROUND
                                </h4>
                                <p className="text-[9px] text-[#6c584c] font-semibold leading-tight">
                                    Nikmati hidangan lezat dan area playground ramah anak.
                                </p>
                            </div>
                        </Link>

                        {/* 2. Digital Menu */}
                        <Link
                            href="/menu"
                            className="bg-white p-3 sm:p-3.5 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square flex items-center justify-center shrink-0">
                                <img
                                    src="/img/icon-menu.png"
                                    alt="Digital Menu"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-[10.5px] sm:text-[11px] text-[#3d2314] uppercase tracking-wide leading-tight">
                                    DIGITAL MENU
                                </h4>
                                <p className="text-[9px] text-[#6c584c] font-semibold leading-tight">
                                    Kue, makanan, dan minuman lezat bertema beruang.
                                </p>
                            </div>
                        </Link>

                        {/* 3. Event & Workshop */}
                        <Link
                            href="/event"
                            className="bg-white p-3 sm:p-3.5 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square flex items-center justify-center shrink-0">
                                <img
                                    src="/img/icon-event.png"
                                    alt="Event & Workshop"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-[10.5px] sm:text-[11px] text-[#3d2314] uppercase tracking-wide leading-tight">
                                    EVENT & WORKSHOP
                                </h4>
                                <p className="text-[9px] text-[#6c584c] font-semibold leading-tight">
                                    Aktivitas edukatif dan kelas kreatif mengasah bakat.
                                </p>
                            </div>
                        </Link>

                        {/* 4. Merchandise */}
                        <Link
                            href="/merchandise"
                            className="bg-white p-3 sm:p-3.5 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square flex items-center justify-center shrink-0">
                                <img
                                    src="/img/icon-merchandise.png"
                                    alt="Merchandise"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-[10.5px] sm:text-[11px] text-[#3d2314] uppercase tracking-wide leading-tight">
                                    MERCHANDISE
                                </h4>
                                <p className="text-[9px] text-[#6c584c] font-semibold leading-tight">
                                    Koleksi boneka dan suvenir lucu khas To Meet.
                                </p>
                            </div>
                        </Link>

                        {/* 5. Roblox World */}
                        <Link
                            href="/roblox"
                            className="bg-white p-3 sm:p-3.5 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square flex items-center justify-center shrink-0">
                                <img
                                    src="/img/icon-roblox.png"
                                    alt="Roblox World"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-[10.5px] sm:text-[11px] text-[#3d2314] uppercase tracking-wide leading-tight">
                                    ROBLOX WORLD
                                </h4>
                                <p className="text-[9px] text-[#6c584c] font-semibold leading-tight">
                                    Dunia virtual interaktif dan selesaikan misi seru.
                                </p>
                            </div>
                        </Link>

                        {/* 6. Birthday / Private Event */}
                        <Link
                            href="/birthday"
                            className="bg-white p-3 sm:p-3.5 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-2 group cursor-pointer"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square flex items-center justify-center shrink-0">
                                <img
                                    src="/img/icon-birthday.png"
                                    alt="Birthday & Party"
                                    className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-[10.5px] sm:text-[11px] text-[#3d2314] uppercase tracking-wide leading-tight">
                                    BIRTHDAY & PARTY
                                </h4>
                                <p className="text-[9px] text-[#6c584c] font-semibold leading-tight">
                                    Rayakan momen spesial dengan paket perayaan privat.
                                </p>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. WHAT MAKES US SPECIAL & STATS                 */}
            {/* ================================================= */}
            <section className="w-full py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-white p-5 lg:p-7 rounded-3xl border border-[#e6ccb2]/60 shadow-2xs">
                        <div className="lg:col-span-3 text-center lg:text-left">
                            <h2 className="text-lg sm:text-xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                WHAT MAKES<br />US SPECIAL?
                                <Sparkles className="inline-block w-4 h-4 ml-1.5 text-[#e85a4f]" />
                            </h2>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3.5">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5">
                                <BearFaceIcon className="w-6 h-6 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[10.5px] text-[#3d2314] uppercase">BEAR THEME</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold mt-0.5">Our lovable bear friends are everywhere!</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5">
                                <Smile className="w-6 h-6 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[10.5px] text-[#3d2314] uppercase">COZY VIBES</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold mt-0.5">Warm, aesthetic, and instagrammable place.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5">
                                <Utensils className="w-6 h-6 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[10.5px] text-[#3d2314] uppercase">DELICIOUS TREATS</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold mt-0.5">Made with love using quality ingredients.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5">
                                <Users className="w-6 h-6 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[10.5px] text-[#3d2314] uppercase">FOR EVERYONE</h4>
                                    <p className="text-[9.5px] text-[#6c584c] font-semibold mt-0.5">Kids, teens, families — all welcome!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#fdf3f1] p-5 sm:p-6 rounded-3xl border border-rose-100/60 text-center shadow-2xs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f]">
                                    <Star className="w-3.5 h-3.5" />
                                    <span className="text-xl sm:text-2xl font-black">2+</span>
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314] uppercase">YEARS OF HAPPINESS</div>
                                <p className="text-[8.5px] text-[#6c584c] font-semibold">Thank you for being part of our journey!</p>
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f]">
                                    <Smile className="w-3.5 h-3.5" />
                                    <span className="text-xl sm:text-2xl font-black">50K+</span>
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314] uppercase">HAPPY CUSTOMERS</div>
                                <p className="text-[8.5px] text-[#6c584c] font-semibold">We&apos;re grateful for all your love & support!</p>
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f]">
                                    <BearPawIcon className="w-3.5 h-3.5" />
                                    <span className="text-xl sm:text-2xl font-black">10+</span>
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314] uppercase">EVENTS EACH MONTH</div>
                                <p className="text-[8.5px] text-[#6c584c] font-semibold">Creating fun and memorable experiences!</p>
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f]">
                                    <Heart className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xl sm:text-2xl font-black">1</span>
                                </div>
                                <div className="text-[10px] font-black text-[#3d2314] uppercase">BIG FAMILY</div>
                                <p className="text-[8.5px] text-[#6c584c] font-semibold">Because To Meet is more than just a place.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 6. BOTTOM CTA SECTION                             */}
            {/* ================================================= */}
            <section className="w-full pb-14">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-black text-[#3d2314]">
                            Let&apos;s create more sweet memories together!
                        </h3>
                        <p className="text-xs text-[#6c584c] font-semibold">
                            Come, meet, enjoy, and be part of the To Meet family.
                        </p>
                    </div>

                    <div className="flex justify-center pt-1">
                        <Link
                            href="/visit-us"
                            className="px-6 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-extrabold rounded-full text-xs transition duration-200 shadow-md shadow-rose-500/20 inline-flex items-center gap-2 tracking-wider uppercase cursor-pointer"
                        >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>VISIT OUR CAFES</span>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}