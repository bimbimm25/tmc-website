'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Phone, Users, Clock, Sparkles, Heart, Utensils,
    Camera, ImageOff, CalendarCheck, MessageSquare, CreditCard,
    Info, Gift, Layers, ArrowRight, X, AlertCircle, PartyPopper,
    ChevronLeft, ChevronRight, ZoomIn
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Add-Ons Resmi Otomatis (Built-in)
const OFFICIAL_ADDONS = [
    {
        id: 'addon-1',
        name: 'Table Dekor',
        price: 'Rp 80.000 / pax',
        desc: 'Dekorasi meja tematik beruang cantik lengkap dengan perlengkapan makan spesial.'
    },
    {
        id: 'addon-2',
        name: 'Full Private Access Playground',
        price: 'Rp 3.500.000',
        desc: 'Sewa privat eksklusif seluruh area playground tanpa bercampur pengunjung umum.'
    },
    {
        id: 'addon-3',
        name: 'Backdrop Eksklusif',
        price: 'Rp 700.000',
        desc: 'Backdrop foto 3D custom nama & karakter beruang To Meet untuk kenangan foto manis.'
    },
    {
        id: 'addon-4',
        name: 'Face Painting',
        price: 'Rp 1.200.000 / 30 Anak',
        desc: 'Layanan face painting profesional untuk anak-anak dengan tema beruang lucu dan aman.'
    }
];

// Foto-Foto Galeri Murni Tanpa Tulisan
const GALLERY_PHOTOS = [
    { id: 1, image: '/img/gallery-birthday/Galery.jpg', alt: 'To Meet Cafe Gallery 1' },
    { id: 2, image: '/img/gallery-birthday/Galery.png', alt: 'To Meet Cafe Gallery 2' },
    { id: 3, image: '/img/gallery-birthday/Galery(1).jpg', alt: 'To Meet Cafe Gallery 3' },
    { id: 4, image: '/img/gallery-birthday/Galery(2).jpg', alt: 'To Meet Cafe Gallery 4' },
    { id: 5, image: '/img/gallery-birthday/Galery(3).jpg', alt: 'To Meet Cafe Gallery 5' },
    { id: 6, image: '/img/gallery-birthday/Galery(4).jpg', alt: 'To Meet Cafe Gallery 6' },
    { id: 7, image: '/img/gallery-birthday/Galery(5).jpg', alt: 'To Meet Cafe Gallery 7' },
    { id: 8, image: '/img/gallery-birthday/Galery(6).jpg', alt: 'To Meet Cafe Gallery 8' },
    { id: 9, image: '/img/gallery-birthday/Galery(7).jpg', alt: 'To Meet Cafe Gallery 9' },
    { id: 10, image: '/img/gallery-birthday/Galery(8).jpg', alt: 'To Meet Cafe Gallery 10' },
    { id: 11, image: '/img/gallery-birthday/Galery(9).jpg', alt: 'To Meet Cafe Gallery 11' },
    { id: 12, image: '/img/gallery-birthday/Galery(10).jpg', alt: 'To Meet Cafe Gallery 12' },
    { id: 13, image: '/img/gallery-birthday/Galery(11).jpg', alt: 'To Meet Cafe Gallery 13' },
    { id: 14, image: '/img/gallery-birthday/Galery(12).jpg', alt: 'To Meet Cafe Gallery 14' },
    { id: 15, image: '/img/gallery-birthday/Galery(13).jpg', alt: 'To Meet Cafe Gallery 15' },
    { id: 16, image: '/img/gallery-birthday/Galery(14).jpg', alt: 'To Meet Cafe Gallery 16' },
    { id: 17, image: '/img/gallery-birthday/Galery(15).jpg', alt: 'To Meet Cafe Gallery 17' },
    { id: 18, image: '/img/gallery-birthday/Galery(16).jpg', alt: 'To Meet Cafe Gallery 18' },
    { id: 19, image: '/img/gallery-birthday/Galery(17).jpg', alt: 'To Meet Cafe Gallery 19' },
    { id: 20, image: '/img/gallery-birthday/Galery(18).jpg', alt: 'To Meet Cafe Gallery 20' },
    { id: 21, image: '/img/gallery-birthday/Galery(19).jpg', alt: 'To Meet Cafe Gallery 21' },
    { id: 22, image: '/img/gallery-birthday/Galery(20).jpg', alt: 'To Meet Cafe Gallery 22' },
    { id: 23, image: '/img/gallery-birthday/Galery(21).jpg', alt: 'To Meet Cafe Gallery 23' },
    { id: 24, image: '/img/gallery-birthday/Galery(22).jpg', alt: 'To Meet Cafe Gallery 24' },
    { id: 25, image: '/img/gallery-birthday/Galery(23).jpg', alt: 'To Meet Cafe Gallery 25' },
];

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

function parseDescriptionLines(text?: string | null): string[] {
    if (!text) return [];
    return text
        .replace(/<br\s*\/?>/gi, '\n')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => l.replace(/^[-*•]\s*/, ''));
}

function checkHasFreeMcGames(title?: string | null): boolean {
    if (!title) return false;
    const lower = title.toLowerCase();
    return (
        (lower.includes('teddy bliss') && lower.includes('bday')) ||
        lower.includes('teddy bliss') ||
        lower.includes('golden bear') ||
        (lower.includes('golden') && lower.includes('party'))
    );
}

function getTaxNotice(price: number): { text: string; isIncluded: boolean } {
    if (price >= 3500000) {
        return { text: '*sudah termasuk pajak', isIncluded: true };
    }
    return { text: '*belum termasuk pajak', isIncluded: false };
}

function shouldHideAddons(title?: string | null): boolean {
    if (!title) return false;
    const lower = title.toLowerCase();
    return (
        lower.includes('surprise bday') ||
        lower.includes('tiny party') ||
        lower.includes('happy party') ||
        lower.includes('teddy party')
    );
}

export default function BirthdayPage() {
    const [packages, setPackages] = useState<BirthdayPackageItem[]>([]);
    const [banner, setBanner] = useState<BannerItem | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<BirthdayPackageItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    // State Slider Gallery (4 per slide)
    const [currentSlide, setCurrentSlide] = useState(0);
    const ITEMS_PER_SLIDE = 4;
    const totalSlides = Math.ceil(GALLERY_PHOTOS.length / ITEMS_PER_SLIDE);

    // State Zoom Foto Lightbox
    const [zoomedPhotoIndex, setZoomedPhotoIndex] = useState<number | null>(null);

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    // Navigasi Foto Saat Mode Zoom Aktif
    const handlePrevZoomPhoto = useCallback(() => {
        setZoomedPhotoIndex((prev) => (prev === null || prev === 0 ? GALLERY_PHOTOS.length - 1 : prev - 1));
    }, []);

    const handleNextZoomPhoto = useCallback(() => {
        setZoomedPhotoIndex((prev) => (prev === null || prev === GALLERY_PHOTOS.length - 1 ? 0 : prev + 1));
    }, []);

    // Kunci scroll body saat modal paket atau zoom gambar aktif
    useEffect(() => {
        const isLocked = Boolean(selectedPackage || zoomedPhotoIndex !== null);
        if (!isLocked) return;

        const origHtml = document.documentElement.style.overflow;
        const origBody = document.body.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const preventScroll = (e: TouchEvent | WheelEvent) => {
            const target = e.target as HTMLElement;
            const card = document.getElementById('bday-modal-card');
            if (card && card.contains(target)) return;
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedPackage(null);
                setZoomedPhotoIndex(null);
            }
            if (zoomedPhotoIndex !== null) {
                if (e.key === 'ArrowLeft') handlePrevZoomPhoto();
                if (e.key === 'ArrowRight') handleNextZoomPhoto();
            }
        };

        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.documentElement.style.overflow = origHtml;
            document.body.style.overflow = origBody;
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedPackage, zoomedPhotoIndex, handlePrevZoomPhoto, handleNextZoomPhoto]);

    async function fetchBirthdayData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const [resBirthdays, resBanner] = await Promise.all([
                fetch(`${API_BASE_URL}/api/birthdays`, { cache: 'no-store' }),
                fetch(`${API_BASE_URL}/api/banners/birthday`, { cache: 'no-store' }).catch(() => null)
            ]);

            if (!resBirthdays.ok) {
                const resEvents = await fetch(`${API_BASE_URL}/api/events`, { cache: 'no-store' });
                if (resEvents.ok) {
                    const jsonEvents = await resEvents.json();
                    const filtered = (jsonEvents.data || []).filter((item: any) =>
                        item.type === 'birthday_package' || (item.category && item.category.toLowerCase().includes('birthday'))
                    );
                    const sortedFiltered = [...filtered].sort((a: any, b: any) => Number(a.price || 0) - Number(b.price || 0));
                    setPackages(sortedFiltered);
                }
            } else {
                const json = await resBirthdays.json();
                if (json && json.data) {
                    if (Array.isArray(json.data)) {
                        const sortedPackages = [...json.data].sort((a: BirthdayPackageItem, b: BirthdayPackageItem) => Number(a.price || 0) - Number(b.price || 0));
                        setPackages(sortedPackages);
                    } else {
                        const sortedPackages = [...(json.data.packages || [])].sort((a: BirthdayPackageItem, b: BirthdayPackageItem) => Number(a.price || 0) - Number(b.price || 0));
                        setPackages(sortedPackages);
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
                : `${API_BASE_URL}/storage/${banner.image}`)
        : '/img/hero-home.png';

    const defaultBookingLink = "https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20tertarik%20untuk%20booking%20paket%20Birthday%20&%20Private%20Event";

    return (
        <div className="min-h-screen space-y-10 sm:space-y-14 pb-16">

            {/* ================================================= */}
            {/* 1. HERO BANNER FULL 1 LAYAR (CLEAN & SUBJUDUL PAS) */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden border-b border-[#e6ccb2]/50">
                {/* 1. Background Cover Layer & Gradien Asli */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="Birthday and Private Event at To Meet Cafe"
                        className="w-full h-full object-cover object-[75%_center] lg:object-center"
                    />
                    {/* Lapisan gradien putih halus sisi kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full sm:w-2/3 lg:w-1/2" />
                </div>

                {/* 2. Konten Hero Text & Buttons */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-3 sm:space-y-3.5 text-left">

                        {/* Pill Badge */}
                        <div className="flex">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#8c5a3c] text-[9.5px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
                                <span>MAKE EVERY MOMENT SPECIAL</span>
                                <Sparkles className="w-3 h-3 text-amber-500" />
                            </div>
                        </div>

                        {/* Judul Utama */}
                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {renderFormattedText(
                                banner?.title,
                                <>
                                    BIRTHDAY & <br />
                                    <span>PRIVATE EVENT</span> <br />
                                    <span className="text-[#8c5a3c]">AT TO MEET</span>
                                </>
                            )}
                        </h1>

                        {/* Subjudul: Bersih tanpa box, dibatasi max-w-[260px] di mobile agar pas di area putih */}
                        <p className="text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed max-w-[260px] sm:max-w-md">
                            {renderFormattedText(
                                banner?.subtitle,
                                'Rayakan hari spesial si kecil di dunia beruang yang hangat dan ceria! Kami siapkan seluruh detail dekorasi dan makanan, Anda cukup menikmati momen bahagianya.'
                            )}
                        </p>

                        {/* 3 Mini Feature Cards: Sejajar Rapi */}
                        <div className="w-full grid grid-cols-3 gap-2 text-center pt-0.5">
                            <div className="bg-white/95 backdrop-blur-xs py-2 px-1 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-0.5">
                                <div className="w-6 h-6 rounded-xl bg-[#FAF0E6] text-[#e85a4f] mx-auto flex items-center justify-center">
                                    <Heart className="w-3.5 h-3.5 fill-current" />
                                </div>
                                <div className="text-[9px] font-black text-[#3d2314] leading-tight">Cute Bear Theme</div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-xs py-2 px-1 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-0.5">
                                <div className="w-6 h-6 rounded-xl bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center">
                                    <Utensils className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-[9px] font-black text-[#3d2314] leading-tight">Yummy Treats</div>
                            </div>

                            <div className="bg-white/95 backdrop-blur-xs py-2 px-1 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-0.5">
                                <div className="w-6 h-6 rounded-xl bg-[#FAF0E6] text-amber-600 mx-auto flex items-center justify-center">
                                    <Camera className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-[9px] font-black text-[#3d2314] leading-tight">Photo Spots</div>
                            </div>
                        </div>

                        {/* Tombol Aksi Sejajar Rata Kiri */}
                        <div className="w-full pt-1 flex flex-row items-center gap-2 sm:gap-2.5">
                            <a
                                href={banner?.cta_link || defaultBookingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            >
                                <Phone className="w-3.5 h-3.5 fill-current" />
                                <span>{banner?.cta_text || 'BOOK VIA WHATSAPP'}</span>
                            </a>

                            <a
                                href="#packages"
                                className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full transition inline-flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md whitespace-nowrap"
                            >
                                <Gift className="w-3.5 h-3.5" />
                                <span>PILIH PAKET</span>
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. OUR PACKAGES */}
            <section id="packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6ccb2]/60 pb-3">
                    <div className="flex items-center gap-2">
                        <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            OUR PACKAGES
                        </h2>
                    </div>
                    <span className="text-xs font-bold text-[#8c5a3c]">
                        Paket Perayaan Lengkap & Fleksibel
                    </span>
                </div>

                {isLoading && (
                    <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#e6ccb2]/60 p-6">
                        <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs font-bold text-[#8c5a3c]">Memuat paket birthday...</p>
                    </div>
                )}

                {!isLoading && isError && (
                    <div className="py-12 text-center space-y-2.5 bg-[#FAF0E6]/50 rounded-3xl border border-rose-200 p-6">
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
                    <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#e6ccb2]/60 p-6">
                        <Info className="w-6 h-6 text-[#8c5a3c]" />
                        <h4 className="font-black text-sm text-[#3d2314]">Belum Ada Paket Birthday</h4>
                        <p className="text-xs text-[#6c584c]">Paket perayaan sedang disiapkan oleh tim To Meet Cafe.</p>
                    </div>
                )}

                {!isLoading && !isError && packages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                        {packages.map((pkg, idx) => {
                            const hasImage = Boolean(pkg.image && pkg.image.trim() !== '');
                            const pkgImage = hasImage
                                ? (pkg.image!.startsWith('http')
                                    ? pkg.image!
                                    : pkg.image!.startsWith('/img')
                                        ? pkg.image!
                                        : `${API_BASE_URL}/storage/${pkg.image}`)
                                : null;

                            const facilityLines = parseDescriptionLines(pkg.description);
                            const previewFacilities = facilityLines.slice(0, 3);
                            const remainingCount = facilityLines.length - 3;
                            const hasFreeMcGames = checkHasFreeMcGames(pkg.title);
                            const taxNotice = getTaxNotice(pkg.price);

                            return (
                                <div
                                    key={pkg.id}
                                    className="bg-white rounded-xl border border-[#e6ccb2]/80 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-md transition duration-200"
                                >
                                    <div>
                                        <div className="relative w-full aspect-video bg-[#FAF0E6]/50 overflow-hidden flex items-center justify-center border-b border-[#e6ccb2]/40">
                                            {pkgImage ? (
                                                <img
                                                    src={pkgImage}
                                                    alt={pkg.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center p-2.5 space-y-1 text-[#a08a7b]">
                                                    <ImageOff className="w-4.5 h-4.5 opacity-60" />
                                                    <span className="text-[8px] font-black tracking-wider uppercase">Belum ada gambar</span>
                                                </div>
                                            )}

                                            <div className="absolute top-2 left-2 bg-[#3d2314]/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider shadow-xs">
                                                {idx === 0 ? 'BASIC' : idx === 1 ? 'DELUXE' : 'PREMIUM'}
                                            </div>

                                            {hasFreeMcGames && (
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-[#e85a4f] text-white px-2 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                                                    <PartyPopper className="w-2.5 h-2.5" />
                                                    <span>+ Free MC & Games</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3.5 space-y-2">
                                            <div>
                                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] leading-tight">
                                                    {pkg.title}
                                                </h3>
                                                {pkg.capacity && (
                                                    <span className="text-[9px] font-bold text-[#8c5a3c] mt-0.5 block">
                                                        Kapasitas hingga {pkg.capacity} Tamu
                                                    </span>
                                                )}

                                                {hasFreeMcGames && (
                                                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md text-[8.5px] font-black uppercase tracking-wider">
                                                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                                        <span>+ Free MC & Fun Games</span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 border-t border-[#e6ccb2]/50 pt-2">
                                                <span className="text-[8px] font-black text-[#8c5a3c] uppercase tracking-wider block">
                                                    Highlight Fasilitas:
                                                </span>
                                                {previewFacilities.length > 0 ? (
                                                    <div className="space-y-1 text-left">
                                                        {previewFacilities.map((item, fIdx) => (
                                                            <div key={fIdx} className="flex items-start gap-1.5 text-[10px] text-[#5a4232] font-semibold">
                                                                <BearPawIcon className="w-2.5 h-2.5 text-[#8c5a3c] shrink-0 mt-0.5" />
                                                                <span className="line-clamp-1">{item}</span>
                                                            </div>
                                                        ))}
                                                        {remainingCount > 0 && (
                                                            <span className="text-[9px] font-bold text-[#8c5a3c] block pt-0.5">
                                                                +{remainingCount} fasilitas lainnya...
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-[#6c584c] italic">Klik tombol detail untuk rincian fasilitas.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 pt-0 border-t border-[#e6ccb2]/40 space-y-2 mt-0.5">
                                        <div className="flex items-baseline justify-between pt-1.5">
                                            <div>
                                                <span className="text-[8px] font-bold text-[#8c5a3c] uppercase block">Start from</span>
                                                <span className="font-black text-xs sm:text-sm text-[#3d2314]">
                                                    Rp {new Intl.NumberFormat('id-ID').format(pkg.price)}
                                                </span>
                                            </div>
                                            <span className={`text-[8.5px] font-bold italic ${taxNotice.isIncluded ? 'text-emerald-700' : 'text-[#8c5a3c]'}`}>
                                                {taxNotice.text}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setSelectedPackage(pkg)}
                                            className="w-full py-2.25 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[9px] rounded-lg transition text-center uppercase tracking-wider shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <span>VIEW DETAIL & FASILITAS</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* 3. OFFICIAL ADD-ONS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-[#e85a4f] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>OFFICIAL ADD-ONS</span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                                PILIHAN LAYANAN TAMBAHAN (ADD-ONS)
                            </h2>
                        </div>
                        <p className="text-xs text-[#6c584c] font-semibold">
                            Dapat digabungkan langsung dengan paket pilihan Anda saat konfirmasi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {OFFICIAL_ADDONS.map((addon) => (
                            <div
                                key={addon.id}
                                className="h-full bg-[#FAF0E6]/50 p-4 sm:p-5 rounded-2xl border border-[#e6ccb2]/70 space-y-2.5 flex flex-col justify-between"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase">
                                            {addon.name}
                                        </h3>
                                        <Layers className="w-4 h-4 text-[#8c5a3c]" />
                                    </div>
                                    <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                                        {addon.desc}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-[#e6ccb2]/50 flex items-center justify-between gap-2">
                                    <span className="text-[8.5px] sm:text-[9px] font-bold text-[#8c5a3c] uppercase leading-none">Biaya Tambahan</span>
                                    <span className="font-black text-[10.5px] sm:text-xs text-[#3d2314] leading-none">{addon.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. GALLERY (SLIDER 4 PER HALAMAN + ZOOM MODAL) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                    <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            GALLERY
                        </h2>
                        <span className="hidden sm:inline-block px-2 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] font-bold rounded-full border border-[#e6ccb2]/60">
                            {GALLERY_PHOTOS.length} Foto
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-[#8c5a3c] mr-1">
                            {currentSlide + 1} <span className="text-[#a08a7b] font-semibold">/ {totalSlides}</span>
                        </span>

                        <button
                            onClick={handlePrevSlide}
                            aria-label="Foto Sebelumnya"
                            className="w-8 h-8 rounded-full bg-white border border-[#e6ccb2]/80 hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white shadow-2xs flex items-center justify-center transition active:scale-95 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={handleNextSlide}
                            aria-label="Foto Berikutnya"
                            className="w-8 h-8 rounded-full bg-white border border-[#e6ccb2]/80 hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white shadow-2xs flex items-center justify-center transition active:scale-95 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIdx) => {
                            const startIdx = slideIdx * ITEMS_PER_SLIDE;
                            const currentBatch = GALLERY_PHOTOS.slice(startIdx, startIdx + ITEMS_PER_SLIDE);

                            return (
                                <div key={slideIdx} className="w-full shrink-0">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                        {currentBatch.map((photo, pSubIdx) => {
                                            const globalIndex = startIdx + pSubIdx;
                                            return (
                                                <div
                                                    key={photo.id}
                                                    onClick={() => setZoomedPhotoIndex(globalIndex)}
                                                    className="group relative w-full aspect-16/10 rounded-2xl overflow-hidden border border-[#e6ccb2]/70 bg-stone-100 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer"
                                                >
                                                    <img
                                                        src={photo.image}
                                                        alt={photo.alt}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />

                                                    {/* Hover Overlay Icon Zoom */}
                                                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 text-white">
                                                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 shadow-xs">
                                                            <ZoomIn className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline-block">Zoom</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 pt-1">
                    {Array.from({ length: totalSlides }).map((_, dotIdx) => (
                        <button
                            key={dotIdx}
                            onClick={() => setCurrentSlide(dotIdx)}
                            aria-label={`Pindah ke slide ${dotIdx + 1}`}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${currentSlide === dotIdx
                                ? 'w-6 h-2 bg-[#8c5a3c]'
                                : 'w-2 h-2 bg-[#e6ccb2]/70 hover:bg-[#8c5a3c]/60'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* 5. HOW TO BOOK */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-3">
                        <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                        <h2 className="text-base sm:text-lg font-black text-[#3d2314] uppercase tracking-wide">
                            HOW TO BOOK
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                1
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/50">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Contact Us</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Chat with us via WhatsApp to check availability.</p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                2
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/50">
                                <CalendarCheck className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Choose Date & Package</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Select your preferred date and birthday package.</p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                3
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/50">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Confirm & Pay Deposit</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">We&apos;ll confirm your booking after the deposit.</p>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-4 rounded-2xl border border-[#e6ccb2]/60 space-y-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-[#e85a4f] text-white flex items-center justify-center font-black text-xs mx-auto shadow-xs">
                                4
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/50">
                                <BearFaceIcon className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Enjoy Your Day!</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">We&apos;ll handle the rest, you make sweet memories!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. BOTTOM CTA BANNER */}
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

            {/* 7. MODAL DETAIL PAKET */}
            {selectedPackage && (
                <div
                    onClick={() => setSelectedPackage(null)}
                    className="fixed inset-0 z-[99999] w-screen h-[100dvh] flex items-center justify-center bg-black/65 backdrop-blur-md p-4"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="bday-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-white rounded-3xl border border-[#e6ccb2] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <button
                            onClick={() => setSelectedPackage(null)}
                            aria-label="Tutup Detail"
                            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-[#8c5a3c] text-[#3d2314] hover:text-white shadow-md border border-[#e6ccb2]/80 flex items-center justify-center transition cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="overflow-y-auto p-6 space-y-5">
                            <div className="relative w-full aspect-16/10 bg-stone-50 rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center">
                                {selectedPackage.image && selectedPackage.image.trim() !== '' ? (
                                    <img
                                        src={
                                            selectedPackage.image.startsWith('http')
                                                ? selectedPackage.image
                                                : selectedPackage.image.startsWith('/img')
                                                    ? selectedPackage.image
                                                    : `${API_BASE_URL}/storage/${selectedPackage.image}`
                                        }
                                        alt={selectedPackage.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-[#a08a7b]">
                                        <ImageOff className="w-8 h-8 opacity-60" />
                                        <span className="text-xs font-black tracking-wider uppercase">Belum ada foto paket</span>
                                    </div>
                                )}

                                {checkHasFreeMcGames(selectedPackage.title) && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-[#e85a4f] text-white px-2.5 py-1 rounded-full text-[8.5px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                        <PartyPopper className="w-3 h-3" />
                                        <span>+ Free MC & Fun Games</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] font-black uppercase rounded-md">
                                        BIRTHDAY PACKAGE
                                    </span>
                                    <span className="text-xs font-bold text-stone-500">
                                        {selectedPackage.location_name || 'Semua Lokasi'}
                                    </span>
                                </div>

                                <h3 className="font-black text-xl text-[#3d2314]">
                                    {selectedPackage.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                    {selectedPackage.capacity && (
                                        <span className="text-xs font-bold text-[#8c5a3c]">
                                            Kapasitas: hingga {selectedPackage.capacity} Tamu
                                        </span>
                                    )}

                                    {checkHasFreeMcGames(selectedPackage.title) && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-md text-[9.5px] font-black uppercase tracking-wider">
                                            <PartyPopper className="w-3 h-3 text-amber-600" />
                                            <span>+ Free MC & Fun Games</span>
                                        </span>
                                    )}
                                </div>

                                <div className="py-2.5 border-y border-[#e6ccb2]/50 space-y-2">
                                    <span className="text-[10px] font-black text-[#3d2314] uppercase block">
                                        Semua Fasilitas Yang Didapatkan:
                                    </span>
                                    <div className="space-y-1.5 text-left bg-[#FAF0E6]/30 p-3 rounded-xl border border-[#e6ccb2]/50">
                                        {parseDescriptionLines(selectedPackage.description).map((line, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-xs text-[#5a4232] font-semibold leading-relaxed">
                                                <BearPawIcon className="w-3.5 h-3.5 text-[#8c5a3c] shrink-0 mt-0.5" />
                                                <span>{line}</span>
                                            </div>
                                        ))}

                                        {checkHasFreeMcGames(selectedPackage.title) && (
                                            <div className="flex items-start gap-2 text-xs text-amber-800 font-bold leading-relaxed bg-amber-50/70 p-1.5 rounded-lg border border-amber-200 mt-1">
                                                <PartyPopper className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                                <span>Free MC & Fun Games interaktif untuk memeriahkan pesta ulang tahun</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Rincian Pilihan Add-Ons Resmi (Disembunyikan untuk Surprise Bday, Tiny Party, Happy Party, Teddy Party) */}
                            {!shouldHideAddons(selectedPackage.title) && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-[#8c5a3c] uppercase block">
                                        Tersedia Pilihan Add-Ons:
                                    </span>
                                    <div className="space-y-1.5">
                                        {OFFICIAL_ADDONS.map((addon) => (
                                            <div key={addon.id} className="flex items-center justify-between p-2.5 bg-[#FAF0E6]/50 rounded-xl border border-[#e6ccb2]/50 text-xs">
                                                <div>
                                                    <span className="font-black text-[#3d2314] block">{addon.name}</span>
                                                    <span className="text-[10px] text-[#6c584c] font-medium">{addon.desc}</span>
                                                </div>
                                                <span className="font-black text-[#e85a4f] text-[11px] shrink-0 ml-2">{addon.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 border-t border-[#e6ccb2]/50 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#8c5a3c] block uppercase">Harga Paket</span>
                                    <span className="font-black text-lg text-[#3d2314]">
                                        Rp {new Intl.NumberFormat('id-ID').format(selectedPackage.price)}
                                    </span>
                                    <span className={`block text-[9px] font-bold italic mt-0.5 ${getTaxNotice(selectedPackage.price).isIncluded ? 'text-emerald-700' : 'text-[#8c5a3c]'}`}>
                                        {getTaxNotice(selectedPackage.price).text}
                                    </span>
                                </div>

                                <a
                                    href={`https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20tertarik%20untuk%20booking%20paket%20${encodeURIComponent(selectedPackage.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-full transition flex items-center gap-2 uppercase tracking-wider shadow-xs cursor-pointer"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-current" />
                                    <span>BOOK VIA WA</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* 8. MODAL ZOOM FOTO GALERI (LIGHTBOX RESPONSIVE)   */}
            {/* ================================================= */}
            {zoomedPhotoIndex !== null && GALLERY_PHOTOS[zoomedPhotoIndex] && (
                <div
                    onClick={() => setZoomedPhotoIndex(null)}
                    className="fixed inset-0 z-[999999] w-screen h-[100dvh] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {/* Tombol Tutup X di Pojok Kanan Atas */}
                    <button
                        onClick={() => setZoomedPhotoIndex(null)}
                        aria-label="Tutup Zoom"
                        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-md border border-white/30 cursor-pointer shadow-lg active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Tombol Panah Kiri (Foto Sebelumnya) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevZoomPhoto();
                        }}
                        aria-label="Foto Sebelumnya"
                        className="absolute left-3 sm:left-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-md border border-white/30 cursor-pointer shadow-lg active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Tombol Panah Kanan (Foto Berikutnya) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNextZoomPhoto();
                        }}
                        aria-label="Foto Berikutnya"
                        className="absolute right-3 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-md border border-white/30 cursor-pointer shadow-lg active:scale-95"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Gambar Zoom dengan Ukuran Maksimal & Proporsional */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200 select-none"
                    >
                        <img
                            src={GALLERY_PHOTOS[zoomedPhotoIndex].image}
                            alt={GALLERY_PHOTOS[zoomedPhotoIndex].alt}
                            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/20"
                        />

                        {/* Keterangan & Nomor Urut Foto di Bawah */}
                        <div className="mt-3 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2">
                            <span>{GALLERY_PHOTOS[zoomedPhotoIndex].alt}</span>
                            <span className="text-[#d4a373]">({zoomedPhotoIndex + 1} / {GALLERY_PHOTOS.length})</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}