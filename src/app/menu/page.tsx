'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, Star, Utensils, CupSoda, Cake,
    Info, ChevronRight, Coffee, X, MapPin, AlertCircle, RefreshCw,
    SlidersHorizontal, Sparkles, ThumbsUp, ChevronDown
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Cache in-memory level modul agar saat navigasi page langsung instan tanpa glitch hero-home
let cachedMenuBanner: BannerItem | null = null;

// Custom SVG Icon
function BearPawIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5.7 2.5 1.6 2.5z" />
        </svg>
    );
}

export interface MenuItem {
    id: number;
    category: string;
    name: string;
    description: string;
    price: number;
    purchase_option?: string;
    location?: string;
    image: string;
    is_bestseller: boolean | number;
    is_recommended: boolean | number;
    is_active?: boolean;
}

export interface BannerItem {
    id: number;
    page_key: string;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
    is_active: boolean | number;
}

export default function DigitalMenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    // Inisialisasi banner langsung dari cache bila sudah pernah dimuat
    const [menuBanner, setMenuBanner] = useState<BannerItem | null>(() => cachedMenuBanner);
    const [isBannerResolved, setIsBannerResolved] = useState<boolean>(() => cachedMenuBanner !== null);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

    // Kunci Scroll Halaman ketika Modal Pop-up Aktif
    useEffect(() => {
        if (!selectedProduct) return;

        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const preventScroll = (e: TouchEvent | WheelEvent) => {
            const target = e.target as HTMLElement;
            const modalContent = document.getElementById('menu-modal-card');

            if (modalContent && modalContent.contains(target)) {
                return;
            }

            e.preventDefault();
        };

        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [selectedProduct]);

    async function fetchMenuPageData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const [resMenu, resBanner] = await Promise.all([
                fetch(`${API_BASE_URL}/api/menus`, { cache: 'no-store' }),
                fetch(`${API_BASE_URL}/api/banners/menu`, { cache: 'default' }).catch(() => null)
            ]);

            if (!resMenu.ok) {
                throw new Error('Gagal mengambil data dari server');
            }

            const jsonMenu = await resMenu.json();
            if (jsonMenu && Array.isArray(jsonMenu.data)) {
                setMenuItems(jsonMenu.data);
            } else {
                setMenuItems([]);
            }

            // Utamakan banner langsung dari dashboard
            if (resBanner && resBanner.ok) {
                const jsonBanner = await resBanner.json();
                if (jsonBanner?.data) {
                    cachedMenuBanner = jsonBanner.data;
                    setMenuBanner(jsonBanner.data);
                }
            }
        } catch (err) {
            console.error('API Error / Offline:', err);
            setIsError(true);
            setMenuItems([]);
        } finally {
            setIsLoading(false);
            setIsBannerResolved(true);
        }
    }

    useEffect(() => {
        fetchMenuPageData();
    }, []);

    // Kategori dinamis dari database + default: all, bestseller, dan recommended
    const availableCategories = useMemo(() => {
        const base = ['all', 'bestseller', 'recommended'];
        if (menuItems.length === 0) return base;

        const unique = Array.from(new Set(menuItems.map(m => m.category).filter(Boolean)));
        const excluded = ['bestseller', 'best seller', 'recommended', 'recommend', 'rekomendasi'];
        const cleanDynamic = unique.filter(c => !excluded.includes(c.toLowerCase()));

        return [...base, ...cleanDynamic];
    }, [menuItems]);

    const filteredMenuItems = useMemo(() => {
        return menuItems.filter((item) => {
            if (item.is_active === false) return false;

            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (selectedLocation !== 'all') {
                const itemLoc = item.location || 'all';
                if (itemLoc !== 'all' && itemLoc !== selectedLocation) {
                    return false;
                }
            }

            if (selectedCategory === 'all') return true;
            if (selectedCategory === 'bestseller') return Boolean(item.is_bestseller);
            if (selectedCategory === 'recommended') return Boolean(item.is_recommended);

            return (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
        });
    }, [menuItems, selectedCategory, selectedLocation, searchQuery]);

    // Langsung arahkan ke gambar dashboard admin, fallback ke hero-home hanya jika pengecekan tuntas dan dashboard tidak memiliki gambar
    const heroBackgroundImage = useMemo(() => {
        if (menuBanner?.image) {
            return menuBanner.image.startsWith('http')
                ? menuBanner.image
                : menuBanner.image.startsWith('/img')
                    ? menuBanner.image
                    : `${API_BASE_URL}/storage/${menuBanner.image}`;
        }
        return isBannerResolved ? '/img/hero-home.png' : '';
    }, [menuBanner, isBannerResolved]);

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen pb-16 space-y-4 lg:space-y-8">

            {/* ================================================= */}
            {/* 1. HERO SECTION (SMOOTH & ANTI-GLITCH DASHBOARD)  */}
            {/* ================================================= */}
            <section
                className={`hidden lg:flex w-full relative h-screen max-h-[750px] items-center border-b border-[#e6ccb2]/60 pt-20 pb-6 overflow-hidden transition-colors duration-500 ${heroBackgroundImage ? 'bg-transparent' : 'bg-[#FAF0E6]/30'
                    }`}
            >
                {/* Background Image Layer dengan Transisi Halus (Smooth Fade-In) */}
                <div className="absolute inset-0 z-0">
                    {heroBackgroundImage && (
                        <img
                            src={heroBackgroundImage}
                            alt="Digital Menu Hero Banner"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={(e) => {
                                (e.currentTarget as HTMLElement).classList.remove('opacity-0');
                                (e.currentTarget as HTMLElement).classList.add('opacity-100');
                            }}
                            className="w-full h-full object-cover object-right opacity-0 transition-opacity duration-700 ease-out"
                        />
                    )}
                    {/* Gradien Pelindung Kontras Teks */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent max-w-2xl lg:max-w-3xl pointer-events-none" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
                    <div
                        className={`w-full max-w-lg lg:w-1/2 p-0 space-y-3.5 text-left transition-all duration-700 ease-out ${isBannerResolved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                            }`}
                    >
                        <div className="inline-flex items-center justify-start gap-2 text-xs font-bold text-[#8c5a3c] tracking-widest uppercase">
                            <Link href="/" className="hover:underline">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-[#8c5a3c]" />
                            <span className="text-[#3d2314] font-black">DIGITAL MENU</span>
                        </div>

                        {/* Title: Utamakan Dashboard -> Fallback Default jika tuntas & kosong */}
                        <h1 className="text-4xl lg:text-4xl font-black text-[#3d2314] tracking-tight leading-tight">
                            {menuBanner?.title
                                ? menuBanner.title
                                : isBannerResolved
                                    ? 'Our Digital Menu'
                                    : null}
                        </h1>

                        {/* Subtitle: Utamakan Dashboard -> Fallback Default jika tuntas & kosong */}
                        <p className="text-sm sm:text-[15px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            {menuBanner?.subtitle
                                ? menuBanner.subtitle
                                : isBannerResolved
                                    ? 'Explore our wide variety of bear-themed sweet treats, delicious meals, and refreshing drinks crafted with love for you and your family!'
                                    : null}
                        </p>

                        <div className="pt-2 flex items-center justify-start">
                            <a
                                href={menuBanner?.cta_link || "#menu-content"}
                                className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <span>{menuBanner?.cta_text || 'EXPLORE MENU'}</span>
                                <BearPawIcon className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. MAIN CONTENT AREA & UX KATEGORI MOBILE         */}
            {/* ================================================= */}
            <section id="menu-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-6">
                <div className="bg-white p-4 sm:p-8 lg:p-10 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5 lg:space-y-8">

                    {/* Filter Tab Lokasi Outlet & Search Bar */}
                    <div className="space-y-3.5 lg:space-y-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 lg:p-5 bg-[#FAF0E6]/50 rounded-2xl border border-[#e6ccb2]/70">
                            <div className="flex items-center gap-2 text-xs lg:text-sm font-black text-[#3d2314] uppercase tracking-wide">
                                <MapPin className="w-4 h-4 lg:w-4.5 lg:h-4.5 text-[#8c5a3c]" />
                                <span>PILIH OUTLET:</span>
                            </div>
                            <div className="flex items-center gap-1.5 lg:gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                                <button
                                    onClick={() => setSelectedLocation('all')}
                                    className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-xs xl:text-[13px] font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${selectedLocation === 'all'
                                        ? 'bg-[#8c5a3c] text-white shadow-xs'
                                        : 'bg-white text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                        }`}
                                >
                                    Semua Outlet
                                </button>
                                <button
                                    onClick={() => setSelectedLocation('pondok_mutiara')}
                                    className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-[11px] lg:text-xs xl:text-[13px] font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${selectedLocation === 'pondok_mutiara'
                                        ? 'bg-[#8c5a3c] text-white shadow-xs'
                                        : 'bg-white text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                        }`}
                                >
                                    Pondok Mutiara
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari makanan / minuman lezat..."
                                className="w-full bg-[#FAF0E6]/50 border border-[#e6ccb2]/80 rounded-2xl pl-10 lg:pl-12 pr-9 lg:pr-11 py-2.5 lg:py-3.5 text-xs lg:text-sm text-[#3d2314] font-semibold focus:outline-none focus:bg-white focus:border-[#8c5a3c] transition placeholder:text-[#a08a7b]"
                            />
                            <Search className="w-4 h-4 lg:w-5 lg:h-5 text-[#8c5a3c] absolute left-3.5 lg:left-4 top-3 lg:top-3.5" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 lg:right-4 top-3 lg:top-3.5 text-[#8c5a3c] hover:text-[#3d2314] cursor-pointer"
                                >
                                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* UX KATEGORI MENU KHUSUS MOBILE: Custom Animated Dropdown (Tanpa Scroll Samping) */}
                    <div className="block lg:hidden relative z-20">
                        {/* Label Bar Kecil */}
                        <div className="flex items-center justify-between px-1 pb-1.5">
                            <span className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Kategori Menu
                            </span>
                            <span className="text-[10px] font-bold text-[#6c584c]">
                                {availableCategories.length} Pilihan
                            </span>
                        </div>

                        {/* Tombol Pemicu Dropdown Utama */}
                        <button
                            type="button"
                            onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                            className="w-full bg-[#FAF0E6]/70 hover:bg-[#FAF0E6] border border-[#e6ccb2] rounded-2xl px-4 py-3 flex items-center justify-between transition-all duration-300 shadow-2xs cursor-pointer text-left active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <div className="w-7 h-7 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-2xs shrink-0 border border-[#e6ccb2]/50">
                                    {selectedCategory === 'bestseller' ? (
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    ) : selectedCategory === 'recommended' ? (
                                        <Sparkles className="w-3.5 h-3.5 text-[#e85a4f] fill-current" />
                                    ) : (
                                        <Coffee className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    )}
                                </div>
                                <div className="truncate">

                                    <span className="text-xs sm:text-[13px] font-black text-[#3d2314] uppercase tracking-wide block mt-0.5 truncate">
                                        {selectedCategory === 'all'
                                            ? 'SEMUA MENU'
                                            : selectedCategory === 'bestseller'
                                                ? 'BEST SELLER'
                                                : selectedCategory === 'recommended'
                                                    ? 'RECOMMENDED'
                                                    : selectedCategory}
                                    </span>
                                </div>
                            </div>

                            {/* Chevron dengan Animasi Rotasi Halus */}
                            <div className={`w-6 h-6 rounded-full bg-white/80 border border-[#e6ccb2]/60 flex items-center justify-center text-[#8c5a3c] transition-transform duration-300 shrink-0 ${isCategoryDropdownOpen ? 'rotate-180 bg-[#8c5a3c] text-white' : ''
                                }`}>
                                <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                        </button>

                        {/* List Menu Dropdown dengan Animasi Smooth Accordion */}
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isCategoryDropdownOpen
                                ? 'grid-rows-[1fr] opacity-100 mt-2'
                                : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="bg-white rounded-2xl border border-[#e6ccb2]/80 shadow-md p-2 space-y-1 max-h-64 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {availableCategories.map((cat) => {
                                        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                        let label = cat.toUpperCase();
                                        if (cat === 'all') label = 'SEMUA MENU';
                                        if (cat === 'bestseller') label = 'BEST SELLER';
                                        if (cat === 'recommended') label = 'RECOMMENDED';

                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setIsCategoryDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer ${isSelected
                                                    ? 'bg-[#8c5a3c] text-white shadow-2xs font-black'
                                                    : 'text-[#3d2314] hover:bg-[#FAF0E6] font-bold text-xs'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    {cat === 'bestseller' ? (
                                                        <Star className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
                                                    ) : cat === 'recommended' ? (
                                                        <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'fill-white text-white' : 'fill-[#e85a4f] text-[#e85a4f]'}`} />
                                                    ) : (
                                                        <Coffee className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#8c5a3c]'}`} />
                                                    )}
                                                    <span className="text-[11.5px] uppercase tracking-wider">
                                                        {label}
                                                    </span>
                                                </div>

                                                {isSelected && (
                                                    <div className="w-2 h-2 rounded-full bg-white shrink-0 shadow-xs" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* SIDEBAR FILTER (KIRI - HANYA DESKTOP) */}
                        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:flex lg:flex-col gap-3.5">
                            <div className="text-xs lg:text-sm font-black text-[#3d2314] uppercase tracking-wider px-1 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Kategori Menu</span>
                            </div>

                            <nav
                                onWheel={(e) => e.stopPropagation()}
                                className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto lg:flex-1 lg:min-h-0 overscroll-contain pr-1.5 pb-3 scrollbar-thin scrollbar-thumb-[#8c5a3c]/30 scrollbar-track-transparent"
                            >
                                {availableCategories.map((cat) => {
                                    const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                    let label = cat.toUpperCase();
                                    if (cat === 'all') label = 'SEMUA MENU';
                                    if (cat === 'bestseller') label = 'BEST SELLER';
                                    if (cat === 'recommended') label = 'RECOMMENDED';

                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`flex items-center justify-between px-3.5 lg:px-4 py-2.5 lg:py-3 rounded-2xl transition shrink-0 cursor-pointer text-left w-full ${isSelected
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-[#FAF0E6]/50 text-[#3d2314] hover:bg-[#FAF0E6] border border-[#e6ccb2]/60'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2.5 min-w-0 pr-1">
                                                {cat === 'bestseller' ? (
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                                                ) : cat === 'recommended' ? (
                                                    <Sparkles className="w-4 h-4 text-[#e85a4f] fill-[#e85a4f] shrink-0" />
                                                ) : (
                                                    <Coffee className="w-4 h-4 shrink-0 text-current" />
                                                )}
                                                <span className="text-[10.5px] lg:text-xs xl:text-[13px] font-black uppercase tracking-tight leading-none truncate whitespace-nowrap">
                                                    {label}
                                                </span>
                                            </span>

                                            {isSelected ? (
                                                <X className="w-4 h-4 shrink-0 hidden lg:block" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 shrink-0 hidden lg:block opacity-60" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* PRODUCT GRID / STATE (KANAN) */}
                        <main className="lg:col-span-9 space-y-6">

                            {/* Loading State */}
                            {isLoading && (
                                <div className="py-20 text-center space-y-3">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 border-3 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs lg:text-sm font-black text-[#8c5a3c] uppercase tracking-wider">
                                        Memuat data menu...
                                    </p>
                                </div>
                            )}

                            {/* Error State */}
                            {!isLoading && isError && (
                                <div className="py-16 lg:py-20 text-center space-y-3.5 bg-[#FAF0E6]/50 rounded-3xl border border-rose-200/80 p-6 lg:p-8">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                                        <AlertCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm lg:text-base text-[#3d2314]">Gagal Memuat Data Menu</h4>
                                        <p className="text-xs lg:text-sm text-[#6c584c] font-semibold max-w-sm mx-auto">
                                            Server Sedang Sibuk atau Anda Sedang Offline. Silakan coba lagi nanti.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchMenuPageData}
                                        className="px-4 lg:px-5 py-2 lg:py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-bold text-xs lg:text-sm rounded-full transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                        <span>Coba Lagi</span>
                                    </button>
                                </div>
                            )}

                            {/* Normal Data State */}
                            {!isLoading && !isError && (
                                <>
                                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                                        <div className="flex items-center gap-2.5 text-base lg:text-lg xl:text-xl font-black text-[#3d2314] uppercase tracking-wide">
                                            <Coffee className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-[#8c5a3c]" />
                                            <h2>
                                                {selectedCategory === 'all'
                                                    ? 'DAFTAR MENU TO MEET'
                                                    : selectedCategory === 'bestseller'
                                                        ? 'MENU BEST SELLER'
                                                        : selectedCategory === 'recommended'
                                                            ? 'MENU REKOMENDASI'
                                                            : `KATEGORI ${selectedCategory.toUpperCase()}`}
                                            </h2>
                                        </div>
                                        <span className="text-[11px] lg:text-xs xl:text-[13px] font-bold text-[#8c5a3c]">
                                            {filteredMenuItems.length} Menu
                                        </span>
                                    </div>

                                    {filteredMenuItems.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
                                            {filteredMenuItems.map((item) => (
                                                <MenuProductCard key={item.id} item={item} onSelect={setSelectedProduct} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-16 lg:py-20 text-center space-y-2.5 bg-[#FAF0E6]/50 rounded-3xl border border-[#e6ccb2]/60 p-6 lg:p-8">
                                            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/60">
                                                <Info className="w-6 h-6 lg:w-7 lg:h-7" />
                                            </div>
                                            <h4 className="font-black text-sm lg:text-base text-[#3d2314]">Tidak Ada Data Menu</h4>
                                            <p className="text-xs lg:text-sm text-[#6c584c] font-semibold max-w-sm mx-auto">
                                                {searchQuery
                                                    ? 'Menu dengan kata kunci tersebut tidak ditemukan.'
                                                    : 'Belum ada menu yang ditambahkan pada filter ini.'}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                        </main>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. MODAL DETAIL PRODUK                            */}
            {/* ================================================= */}
            {selectedProduct && (
                <div
                    onClick={handleCloseModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3.5 sm:p-4 overscroll-contain overflow-hidden"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="menu-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl p-4 sm:p-5 border border-[#e6ccb2] shadow-2xl space-y-3.5 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto scrollbar-none"
                    >
                        {/* Tombol Tutup Modal */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition border border-[#e6ccb2]/80 shadow-md cursor-pointer z-20 active:scale-95"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Wadah Foto 1080x1080 Persegi Penuh (1:1 Aspect Ratio) */}
                        <div className="w-full aspect-square bg-stone-50 rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative shadow-2xs">
                            {selectedProduct.image ? (
                                <img
                                    src={
                                        selectedProduct.image.startsWith('http')
                                            ? selectedProduct.image
                                            : selectedProduct.image.startsWith('/img')
                                                ? selectedProduct.image
                                                : `${API_BASE_URL}/storage/${selectedProduct.image}`
                                    }
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-contain sm:object-cover bg-white"
                                />
                            ) : (
                                <Coffee className="w-12 h-12 text-[#e6ccb2]" />
                            )}
                        </div>

                        {/* Info Kategori & Lokasi */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    {selectedProduct.category || 'MENU'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[9px] font-black uppercase rounded-md border border-[#e6ccb2]/60">
                                        {selectedProduct.purchase_option || 'In Store'}
                                    </span>
                                    {selectedProduct.location && selectedProduct.location !== 'all' && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black uppercase rounded-md border border-amber-200">
                                            {selectedProduct.location === 'heavenland' ? 'Heavenland' : 'Pondok Mutiara'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-black text-[#3d2314] text-base sm:text-lg leading-tight uppercase">
                                {selectedProduct.name}
                            </h3>

                            <p className="text-xs sm:text-[13px] text-[#6c584c] font-semibold leading-relaxed">
                                {selectedProduct.description || 'Nikmati sajian lezat spesial To Meet Cafe.'}
                            </p>
                        </div>

                        {/* Footer Modal: Harga & CTA Button */}
                        <div className="pt-2.5 border-t border-[#e6ccb2]/60 flex items-center justify-between">
                            <div>
                                <span className="text-[9.5px] font-bold text-[#8c5a3c] uppercase tracking-wider block">Harga Menu</span>
                                <span className="font-black text-[#3d2314] text-sm sm:text-base tabular-nums">
                                    Rp {new Intl.NumberFormat('id-ID').format(selectedProduct.price)}
                                </span>
                            </div>

                            <Link
                                href="/visit-us"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-[#8c5a3c] hover:bg-[#73482f] active:scale-95 text-white font-black text-xs rounded-full transition flex items-center gap-1.5 uppercase cursor-pointer shadow-xs"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>VISIT CAFE</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function MenuProductCard({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }) {
    const isBestseller = Boolean(item.is_bestseller);
    const isRecommended = Boolean(item.is_recommended);
    const rawNumber = Number(item.price) || 0;
    const formattedPrice = `Rp.${rawNumber.toLocaleString('id-ID')}`;

    const imageUrl = item.image
        ? (item.image.startsWith('http') || item.image.startsWith('/img')
            ? item.image
            : `${API_BASE_URL}/storage/${item.image}`)
        : '/img/placeholder-food.png';

    const categoryName = item.category || 'MENU';
    const locationName = item.location && item.location !== 'all'
        ? (item.location === 'heavenland' ? 'Heavenland' : 'P. Mutiara')
        : 'To Meet';

    return (
        <div
            onClick={() => onSelect(item)}
            className="group bg-[#FAF0E6]/40 hover:bg-[#FAF0E6]/60 rounded-3xl border border-[#e6ccb2]/80 hover:border-[#8c5a3c]/60 shadow-2xs hover:shadow-xs transition-all duration-200 p-2.5 sm:p-3.5 flex flex-col justify-between cursor-pointer space-y-2.5 sm:space-y-3 overflow-hidden"
        >
            <div className="space-y-2 sm:space-y-2.5">
                {/* 1. Wadah Foto: Persegi Penuh (aspect-square 1:1) */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#e6ccb2]/50 shadow-2xs">
                    {item.image ? (
                        <img
                            src={imageUrl}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#FAF0E6]/50">
                            <Coffee className="w-8 h-8 text-[#e6ccb2]" />
                        </div>
                    )}

                    {/* Badge Badging di Kiri Atas Foto */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 z-10">
                        {isBestseller && (
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#d4a373] text-white text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-2xs whitespace-nowrap">
                                BEST SELLER
                            </span>
                        )}
                        {isRecommended && (
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#e85a4f] text-white text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-2xs whitespace-nowrap">
                                RECOMMENDED
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Kategori & Badge Outlet */}
                <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-[9.5px] sm:text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider truncate">
                        {categoryName}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white text-[#8c5a3c] text-[8px] sm:text-[9px] font-bold tracking-tight border border-[#e6ccb2]/80 shrink-0 whitespace-nowrap">
                        {locationName}
                    </span>
                </div>

                {/* 3. Nama & Deskripsi (Ukuran, Line-clamp, & Tinggi Min Sama Persis) */}
                <div className="space-y-0.5 sm:space-y-1">
                    <h4 className="font-black text-xs sm:text-sm text-[#3d2314] tracking-tight leading-snug line-clamp-1 uppercase group-hover:text-[#8c5a3c] transition-colors">
                        {item.name}
                    </h4>
                    <p className="text-[13px] text-[#6c584c] font-medium leading-relaxed line-clamp-2 min-h-7 sm:min-h-8">
                        {item.description || '-'}
                    </p>
                </div>
            </div>

            {/* 4. Footer: Info Harga & Opsi Pembelian (Satu Baris, Tabular, Tidak Patah) */}
            <div className="pt-2 flex items-center justify-between gap-1 border-t border-[#e6ccb2]/40 min-w-0">
                <span className="font-black text-xs sm:text-sm text-[#3d2314] whitespace-nowrap tabular-nums shrink-0">
                    {formattedPrice}
                </span>

                <span
                    title={item.purchase_option || 'DINE IN'}
                    className="px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[8.5px] font-black uppercase tracking-tight sm:tracking-wider border border-[#e6ccb2]/80 bg-white text-[#3d2314] shadow-2xs shrink-0 whitespace-nowrap truncate max-w-[100px]"
                >
                    {item.purchase_option || 'Dine In'}
                </span>
            </div>
        </div>
    );
}