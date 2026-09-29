'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Sparkles, Gift, ShieldCheck, Heart,
    ChevronDown, Phone, MessageCircle, X,
    Search, AlertCircle, RefreshCw, Info, Flame
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Cache memori modul agar saat navigasi rute langsung instan tanpa glitch
let cachedMerchBanner: BannerItem | null = null;

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

export interface MerchandiseItem {
    id: number;
    category?: string;
    category_slug?: string;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    stock?: number;
    is_new?: boolean | number;
    is_best_seller?: boolean | number;
    is_bestseller?: boolean | number;
    is_featured?: boolean | number;
    is_active?: boolean | number;
    purchase_type?: string;
    purchase_option?: string;
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

export default function MerchandisePage() {
    const [merchItems, setMerchItems] = useState<MerchandiseItem[]>([]);
    const [merchBanner, setMerchBanner] = useState<BannerItem | null>(() => cachedMerchBanner);
    const [isBannerChecked, setIsBannerChecked] = useState<boolean>(() => cachedMerchBanner !== null);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [displayCount, setDisplayCount] = useState<number>(8);
    const [selectedProduct, setSelectedProduct] = useState<MerchandiseItem | null>(null);

    // Kunci skrol halaman belakang sepenuhnya apabila modal dibuka
    useEffect(() => {
        if (selectedProduct) {
            const originalHtmlOverflow = document.documentElement.style.overflow;
            const originalBodyOverflow = document.body.style.overflow;

            // Kunci kedua-dua html dan body agar halaman belakang pegun (diam)
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            return () => {
                document.documentElement.style.overflow = originalHtmlOverflow;
                document.body.style.overflow = originalBodyOverflow;
            };
        }
    }, [selectedProduct]);

    async function fetchMerchandiseData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const [resMerch, resBanner] = await Promise.all([
                fetch(`${API_BASE_URL}/api/merchandise`, { cache: 'no-store' }),
                fetch(`${API_BASE_URL}/api/banners/merchandise`, { cache: 'default' }).catch(() => null)
            ]);

            if (!resMerch.ok) {
                throw new Error('Gagal memuat data merchandise');
            }

            const jsonMerch = await resMerch.json();
            if (jsonMerch && Array.isArray(jsonMerch.data)) {
                setMerchItems(jsonMerch.data);
            } else {
                setMerchItems([]);
            }

            if (resBanner && resBanner.ok) {
                const jsonBanner = await resBanner.json();
                if (jsonBanner?.data) {
                    cachedMerchBanner = jsonBanner.data;
                    setMerchBanner(jsonBanner.data);
                }
            }
        } catch (err) {
            console.error('Error fetching merchandise API:', err);
            setIsError(true);
            setMerchItems([]);
        } finally {
            setIsLoading(false);
            setIsBannerChecked(true);
        }
    }

    useEffect(() => {
        fetchMerchandiseData();
    }, []);

    const availableCategories = useMemo(() => {
        const unique = Array.from(new Set(
            merchItems.map(m => m.category || m.category_slug).filter(Boolean)
        )) as string[];
        return ['all', 'best_seller', ...unique];
    }, [merchItems]);

    const filteredAndSortedItems = useMemo(() => {
        let result = merchItems.filter(item => {
            if (item.is_active === false) return false;

            let matchesCategory = false;
            if (selectedCategory === 'all') {
                matchesCategory = true;
            } else if (selectedCategory === 'best_seller') {
                matchesCategory = Boolean(item.is_best_seller ?? item.is_bestseller);
            } else {
                const categoryName = (item.category || item.category_slug || '').toLowerCase();
                matchesCategory = categoryName === selectedCategory.toLowerCase();
            }

            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });

        if (sortBy === 'featured') {
            result = [...result].sort((a, b) => (Boolean(b.is_featured) ? 1 : 0) - (Boolean(a.is_featured) ? 1 : 0));
        } else if (sortBy === 'price-low') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result = [...result].sort((a, b) => (Boolean(b.is_new) ? 1 : 0) - (Boolean(a.is_new) ? 1 : 0));
        }

        return result;
    }, [merchItems, selectedCategory, searchQuery, sortBy]);

    const displayedItems = useMemo(() => {
        return filteredAndSortedItems.slice(0, displayCount);
    }, [filteredAndSortedItems, displayCount]);

    const heroImageSrc = useMemo(() => {
        if (merchBanner?.image) {
            return merchBanner.image.startsWith('http')
                ? merchBanner.image
                : merchBanner.image.startsWith('/img')
                    ? merchBanner.image
                    : `${API_BASE_URL}/storage/${merchBanner.image}`;
        }
        return isBannerChecked ? '/img/hero-home.png' : '';
    }, [merchBanner, isBannerChecked]);

    const categoryTitle = useMemo(() => {
        if (selectedCategory === 'all') return 'ALL PRODUCTS';
        if (selectedCategory === 'best_seller') return 'BEST SELLER PRODUCTS';
        return selectedCategory.toUpperCase();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen pb-16 space-y-6 sm:space-y-10">

            {/* ================================================= */}
            {/* 1. HERO BANNER                                    */}
            {/* ================================================= */}
            <section
                className={`hidden lg:flex relative w-full h-screen max-h-180 items-center overflow-hidden border-b border-[#e6ccb2]/60 transition-colors duration-500 ${heroImageSrc ? 'bg-transparent' : 'bg-[#FAF0E6]/30'
                    }`}
            >
                <div className="absolute inset-0 z-0">
                    {heroImageSrc && (
                        <img
                            src={heroImageSrc}
                            alt="To Meet Official Merchandise"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={(e) => {
                                (e.currentTarget as HTMLElement).classList.remove('opacity-0');
                                (e.currentTarget as HTMLElement).classList.add('opacity-100');
                            }}
                            className="w-full h-full object-cover object-right xl:object-center opacity-0 transition-opacity duration-700 ease-out"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-transparent w-full lg:w-3/5 xl:w-1/2 pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-20">
                    <div
                        className={`max-w-md lg:max-w-lg transition-all duration-700 ease-out ${isBannerChecked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                            }`}
                    >
                        <div className="space-y-3 sm:space-y-3.5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#8c5a3c] text-xs font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
                                <span>OFFICIAL MERCHANDISE</span>
                                <Sparkles className="w-3 h-3 text-amber-500" />
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-3xl lg:text-[2.4rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                                    {merchBanner?.title ? (
                                        renderFormattedText(merchBanner.title)
                                    ) : isBannerChecked ? (
                                        <>
                                            TO MEET <br />
                                            <span className="text-[#8c5a3c]">MERCHANDISE</span>
                                        </>
                                    ) : null}
                                </h1>
                            </div>

                            <p className="text-xs sm:text-[15px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                                {merchBanner?.subtitle ? (
                                    renderFormattedText(merchBanner.subtitle)
                                ) : isBannerChecked ? (
                                    'Bawa pulang koleksi boneka dan suvenir lucu khas To Meet Cafe untuk teman atau koleksi pribadimu.'
                                ) : null}
                            </p>

                            <div className="grid grid-cols-3 gap-3 pt-1 max-w-md">
                                <div className="bg-[#FAF0E6]/80 backdrop-blur-xs p-3 rounded-2xl border border-[#e6ccb2]/70 text-center flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
                                    <div className="w-8 h-8 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-2xs">
                                        <BearFaceIcon className="w-4 h-4" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-sm font-black text-[#3d2314] block tracking-tight">100% Original</span>
                                        <span className="text-xs text-[#6c584c] font-bold block mt-0.5">Official Item</span>
                                    </div>
                                </div>

                                <div className="bg-[#FAF0E6]/80 backdrop-blur-xs p-3 rounded-2xl border border-[#e6ccb2]/70 text-center flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
                                    <div className="w-8 h-8 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-2xs">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-sm font-black text-[#3d2314] block tracking-tight">Cute Design</span>
                                        <span className="text-xs text-[#6c584c] font-bold block mt-0.5">Aesthetic</span>
                                    </div>
                                </div>

                                <div className="bg-[#FAF0E6]/80 backdrop-blur-xs p-3 rounded-2xl border border-[#e6ccb2]/70 text-center flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
                                    <div className="w-8 h-8 rounded-xl bg-white text-[#e85a4f] flex items-center justify-center shadow-2xs">
                                        <Gift className="w-4 h-4" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-sm font-black text-[#3d2314] block tracking-tight">Great Gift</span>
                                        <span className="text-xs text-[#6c584c] font-bold block mt-0.5">For Loved Ones</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-1.5 flex flex-row items-center gap-2.5">
                                <a
                                    href={merchBanner?.cta_link || "#catalog"}
                                    className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-xs rounded-full shadow-md shadow-rose-500/25 transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                >
                                    <span>{merchBanner?.cta_text || 'LIHAT KATALOG'}</span>
                                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                </a>

                                <a
                                    href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20stok%20merchandise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-xs rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-current shrink-0" />
                                    <span>TANYA ADMIN</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. MAIN MERCHANDISE SECTION                       */}
            {/* ================================================= */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14 pt-20 sm:pt-24 lg:pt-6">
                <div className="bg-white p-4 sm:p-8 lg:p-10 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-6 lg:space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* SIDEBAR FILTER (KIRI) */}
                        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:flex lg:flex-col lg:min-h-0">
                            {/* Search Box */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk merchandise..."
                                    className="w-full bg-[#FAF0E6]/50 border border-[#e6ccb2]/80 rounded-2xl pl-10 lg:pl-12 pr-9 lg:pr-11 py-2.5 lg:py-3.5 text-xs lg:text-sm text-[#3d2314] font-semibold focus:outline-none focus:bg-white focus:border-[#8c5a3c] transition placeholder:text-[#a08a7b]"
                                />
                                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-[#8c5a3c] absolute left-3.5 lg:left-4 top-3 lg:top-3.5" />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 lg:right-4 top-3 lg:top-3.5 text-[#8c5a3c] hover:text-[#3d2314] cursor-pointer"
                                    >
                                        <X className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="text-xs lg:text-sm font-black text-[#3d2314] uppercase tracking-wider px-1 flex items-center gap-2 border-b border-[#e6ccb2]/60 pb-2.5">
                                <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                                <span>Kategori Merchandise</span>
                            </div>

                            {/* Navigasi Kategori */}
                            <div className="bg-[#FAF0E6]/40 p-2 sm:p-2.5 rounded-2xl border border-[#e6ccb2]/60 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col">
                                <nav
                                    onWheel={(e) => e.stopPropagation()}
                                    className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:flex-1 lg:min-h-0 overscroll-contain pr-1 scrollbar-thin scrollbar-thumb-[#8c5a3c]/30 scrollbar-track-transparent text-xs font-black uppercase tracking-wide"
                                >
                                    {availableCategories.map((cat) => {
                                        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                        const isBestSellerOption = cat === 'best_seller';

                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setDisplayCount(8);
                                                }}
                                                className={`flex items-center justify-between px-3.5 lg:px-4 py-2.5 lg:py-3 rounded-2xl transition shrink-0 cursor-pointer text-left w-full ${isSelected
                                                    ? isBestSellerOption
                                                        ? 'bg-[#e85a4f] text-white shadow-xs font-black'
                                                        : 'bg-[#8c5a3c] text-white shadow-xs font-black'
                                                    : isBestSellerOption
                                                        ? 'bg-rose-50/80 text-rose-700 hover:bg-[#e85a4f] hover:text-white border border-rose-200/60'
                                                        : 'bg-[#FAF0E6]/50 text-[#3d2314] hover:bg-[#FAF0E6] border border-[#e6ccb2]/60'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2.5 min-w-0 pr-1">
                                                    {isBestSellerOption ? (
                                                        <Flame className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-rose-600'}`} />
                                                    ) : (
                                                        <BearPawIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#8c5a3c]'}`} />
                                                    )}
                                                    <span className="text-[10.5px] lg:text-xs xl:text-[13px] font-black uppercase tracking-tight leading-none truncate whitespace-nowrap">
                                                        {cat === 'all'
                                                            ? 'All Products'
                                                            : isBestSellerOption
                                                                ? 'Best Seller'
                                                                : cat}
                                                    </span>
                                                </span>

                                                {isSelected && !isBestSellerOption && (
                                                    <X className="w-4 h-4 hidden lg:block opacity-80 shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Promo Card Chat WA */}
                            <div className="hidden lg:block bg-[#fdf3f1] p-4.5 rounded-2xl border border-rose-100 space-y-2.5 text-center mt-auto">
                                <h4 className="font-black text-xs sm:text-sm text-[#3d2314] leading-snug">
                                    Can&apos;t find what you&apos;re looking for?
                                </h4>
                                <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                    Tanyakan ketersediaan stok produk langsung ke admin kami.
                                </p>
                                <a
                                    href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20stok%20merchandise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 bg-[#3d2314] hover:bg-[#201007] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition uppercase tracking-wider cursor-pointer shadow-xs"
                                >
                                    <span>CHAT VIA WA</span>
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                </a>
                            </div>
                        </aside>

                        {/* PRODUCT GRID & SORTING (KANAN) */}
                        <main className="lg:col-span-9 space-y-6">

                            {/* Header Sort & Counter */}
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                                <div className="flex items-center gap-2.5 text-base lg:text-lg xl:text-xl font-black text-[#3d2314] uppercase tracking-wide">
                                    <BearPawIcon className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-[#8c5a3c]" />
                                    <h2>{categoryTitle}</h2>
                                    <span className="text-xs lg:text-sm font-semibold text-[#6c584c] lowercase">
                                        ({filteredAndSortedItems.length} item)
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="sortBy" className="text-xs lg:text-sm font-bold text-[#6c584c] hidden sm:block">
                                        Urutkan:
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="sortBy"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="bg-[#FAF0E6]/50 border border-[#e6ccb2]/80 rounded-xl px-3.5 py-2 text-xs lg:text-sm text-[#3d2314] font-black focus:outline-none appearance-none pr-8 cursor-pointer"
                                        >
                                            <option value="featured">Paling Populer (Featured)</option>
                                            <option value="newest">Produk Terbaru</option>
                                            <option value="price-low">Harga: Termurah</option>
                                            <option value="price-high">Harga: Tertinggi</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-[#8c5a3c] absolute right-2.5 top-3 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="py-20 text-center space-y-3">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 border-3 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs lg:text-sm font-black text-[#8c5a3c] uppercase tracking-wider">
                                        Memuat produk merchandise...
                                    </p>
                                </div>
                            )}

                            {/* Error State */}
                            {!isLoading && isError && (
                                <div className="py-16 lg:py-20 text-center space-y-3.5 bg-[#FAF0E6]/50 rounded-3xl border border-rose-200/80 p-6 lg:p-8">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                                        <AlertCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <h4 className="font-black text-sm lg:text-base text-[#3d2314]">Gagal Memuat Data Merchandise</h4>
                                    <p className="text-xs lg:text-sm text-[#6c584c] font-semibold max-w-xs mx-auto">
                                        Server Sedang Sibuk Atau Sedang Offline.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={fetchMerchandiseData}
                                        className="px-4 lg:px-5 py-2 lg:py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-bold text-xs lg:text-sm rounded-full transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                        <span>Coba Lagi</span>
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && !isError && filteredAndSortedItems.length === 0 && (
                                <div className="py-16 lg:py-20 text-center space-y-2.5 bg-[#FAF0E6]/50 rounded-3xl border border-[#e6ccb2]/60 p-6 lg:p-8">
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/60">
                                        <Info className="w-6 h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <h4 className="font-black text-sm lg:text-base text-[#3d2314]">Belum Ada Produk</h4>
                                    <p className="text-xs lg:text-sm text-[#6c584c] font-semibold max-w-sm mx-auto">
                                        {selectedCategory === 'best_seller'
                                            ? 'Belum ada produk yang ditandai sebagai Best Seller.'
                                            : searchQuery
                                                ? 'Produk dengan kata kunci tersebut tidak ditemukan.'
                                                : 'Belum ada produk merchandise yang ditambahkan pada kategori ini.'}
                                    </p>
                                </div>
                            )}

                            {/* Grid 4 Kolom Produk */}
                            {!isLoading && !isError && displayedItems.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
                                    {displayedItems.map((item) => (
                                        <MerchandiseProductCard
                                            key={item.id}
                                            item={item}
                                            onSelect={(prod) => setSelectedProduct(prod)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Tombol Load More */}
                            {!isLoading && !isError && displayedItems.length < filteredAndSortedItems.length && (
                                <div className="pt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setDisplayCount(prev => prev + 4)}
                                        className="px-6 py-2.5 bg-[#FAF0E6] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-black text-xs sm:text-sm rounded-full border border-[#e6ccb2] transition uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                                    >
                                        <span>LOAD MORE PRODUCTS</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                        </main>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. BENEFITS / FEATURES SECTION                    */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <BearFaceIcon className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">
                                100% Official
                            </h4>
                            <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                To Meet Merchandise
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <Gift className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">
                                Great for Gift
                            </h4>
                            <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                and Collection
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">
                                Quality You Can
                            </h4>
                            <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                Trust
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <Heart className="w-4 h-4 text-[#e85a4f] fill-current" />
                            </div>
                            <h4 className="font-black text-sm text-[#3d2314] uppercase tracking-wide">
                                Support To Meet
                            </h4>
                            <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                Community
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. ORDER / WHATSAPP CTA SECTION                   */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative w-full aspect-16/5 sm:aspect-16/4 lg:aspect-1920/420 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-md border border-[#e6ccb2]/60">
                    <img
                        src="/img/banner-section-merch.png"
                        alt="To Meet Cafe Merchandise Banner"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none scale-[1.05]"
                        style={{ objectPosition: 'center 60%' }}
                    />

                    <div className="relative z-10 w-full h-full flex items-center justify-between px-4 sm:px-8 lg:px-12">
                        <div className="max-w-[55%] sm:max-w-md lg:max-w-xl space-y-1 sm:space-y-2 text-left">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[#ffd6a5] text-[8px] sm:text-[10px] font-black tracking-widest uppercase border border-white/20">
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                                <span>ORDER DIRECTLY</span>
                            </div>

                            <h2 className="text-xs sm:text-xl lg:text-3xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                Want to order or ask more?
                            </h2>

                            <p className="text-[8.5px] sm:text-xs lg:text-sm text-stone-100 font-semibold leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] line-clamp-1 sm:line-clamp-2">
                                Chat with us on WhatsApp to check stock and place your order!
                            </p>

                            <div className="pt-0.5 sm:pt-1">
                                <a
                                    href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20order%20merchandise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 sm:px-5 lg:px-6 py-1 sm:py-2 lg:py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-[8px] sm:text-xs rounded-full shadow-lg shadow-black/40 transition duration-200 inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer border border-white/20"
                                >
                                    <span>CHAT VIA WHATSAPP</span>
                                    <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-current" />
                                </a>
                            </div>
                        </div>

                        {/* Sisi Kanan: 2 Foto Polaroid */}
                        <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-4 shrink-0">
                            <div className="w-16 sm:w-24 lg:w-32 aspect-3/4 bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition duration-300 text-center flex flex-col justify-between border sm:border-2 border-white">
                                <img
                                    src="/img/mc-1.png"
                                    alt="Merchandise 1"
                                    className="w-full flex-1 object-cover rounded-lg sm:rounded-xl"
                                />
                                <span className="text-[6.5px] sm:text-[8.5px] lg:text-[10px] font-black uppercase tracking-wider text-[#8c5a3c] pt-0.5">
                                    For You
                                </span>
                            </div>

                            <div className="w-16 sm:w-24 lg:w-32 aspect-3/4 bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition duration-300 text-center flex flex-col justify-between border sm:border-2 border-white">
                                <img
                                    src="/img/mc-2.png"
                                    alt="Merchandise 2"
                                    className="w-full flex-1 object-cover rounded-lg sm:rounded-xl"
                                />
                                <span className="text-[6.5px] sm:text-[8.5px] lg:text-[10px] font-black uppercase tracking-wider text-[#8c5a3c] pt-0.5">
                                    For Your Friend
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* MODAL DETAIL PRODUK MERCHANDISE                   */}
            {/* ================================================= */}
            {selectedProduct && (
                <div
                    onClick={() => setSelectedProduct(null)}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="fixed inset-0 z-50 w-screen h-[100dvh] flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overscroll-none"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl p-5 sm:p-6 border border-[#e6ccb2] shadow-2xl space-y-4 relative my-auto max-h-[88vh] overflow-y-auto scrollbar-none"
                    >
                        {/* Butang Tutup */}
                        <button
                            type="button"
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-3.5 top-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF0E6] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Gambar Produk */}
                        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-[#FAF0E6]/50 border border-[#e6ccb2]/60 shadow-2xs">
                            <img
                                src={
                                    selectedProduct.image
                                        ? (selectedProduct.image.startsWith('http') || selectedProduct.image.startsWith('/img')
                                            ? selectedProduct.image
                                            : `${API_BASE_URL}/storage/${selectedProduct.image}`)
                                        : '/img/placeholder-food.png'
                                }
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>

                        {/* Maklumat Produk */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] sm:text-[11px] font-black uppercase rounded-md tracking-wider">
                                    {selectedProduct.category || 'MERCHANDISE'}
                                </span>

                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider">
                                    {(selectedProduct.stock !== undefined ? selectedProduct.stock > 0 : selectedProduct.is_active !== false)
                                        ? 'READY STOCK'
                                        : 'HABIS'}
                                </span>
                            </div>

                            <div className="space-y-0.5">
                                <h2 className="text-base sm:text-lg font-black text-[#3d2314] leading-snug">
                                    {selectedProduct.name}
                                </h2>
                                <div className="text-sm sm:text-base font-black text-[#8c5a3c]">
                                    Rp.{Number(selectedProduct.price || 0).toLocaleString('id-ID')}
                                </div>
                            </div>

                            {/* Penerangan Produk */}
                            <div className="bg-[#FAF0E6]/30 p-3 rounded-2xl border border-[#e6ccb2]/50 text-xs sm:text-sm text-[#5a4232] font-medium leading-relaxed max-h-32 overflow-y-auto scrollbar-none">
                                {selectedProduct.description || 'Belum ada deskripsi lengkap untuk produk ini.'}
                            </div>
                        </div>

                        {/* Butang Tindakan */}
                        <div className="pt-2.5 border-t border-[#e6ccb2]/50 flex items-center justify-between gap-2.5">
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                            >
                                Tutup
                            </button>

                            <a
                                href={`https://wa.me/6282141609328?text=${encodeURIComponent(
                                    `Halo To Meet Cafe, saya ingin memesan merchandise "${selectedProduct.name}" (Rp.${Number(selectedProduct.price || 0).toLocaleString('id-ID')}). Apakah stok masih tersedia?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4 fill-current" />
                                <span>Pesan via WA</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

interface MerchandiseProductCardProps {
    item: MerchandiseItem;
    onSelect?: (product: MerchandiseItem) => void;
}

function MerchandiseProductCard({ item, onSelect }: MerchandiseProductCardProps) {
    const rawNumber = Number(item.price) || 0;
    const formattedPrice = `Rp.${rawNumber.toLocaleString('id-ID')}`;

    const imageUrl = item.image
        ? (item.image.startsWith('http') || item.image.startsWith('/img')
            ? item.image
            : `${API_BASE_URL}/storage/${item.image}`)
        : '/img/placeholder-food.png';

    const categoryName = item.category || 'MERCHANDISE';
    const isAvailable = item.stock !== undefined ? item.stock > 0 : item.is_active !== false;
    const statusLabel = isAvailable ? 'READY STOCK' : 'HABIS';

    return (
        <div
            onClick={() => onSelect && onSelect(item)}
            className="group bg-[#FAF0E6]/40 hover:bg-[#FAF0E6]/60 rounded-3xl border border-[#e6ccb2]/80 hover:border-[#8c5a3c]/60 shadow-2xs hover:shadow-xs transition-all duration-200 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer space-y-3 overflow-hidden"
        >
            <div className="space-y-2.5">
                {/* 1. Foto Merchandise */}
                <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#e6ccb2]/50 shadow-2xs">
                    <img
                        src={imageUrl}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />

                    {Boolean(item.is_bestseller ?? item.is_best_seller) && (
                        <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#e85a4f] text-white text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-2xs">
                                BEST SELLER
                            </span>
                        </div>
                    )}

                    {!isAvailable && (
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="px-2.5 py-1 bg-white/95 text-[#e85a4f] font-black text-[10px] uppercase tracking-wider rounded-full shadow-md">
                                HABIS
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. Kategori & Badge Outlet */}
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    <span className="text-[10px] sm:text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider truncate">
                        {categoryName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#8c5a3c] text-[8.5px] sm:text-[9px] font-bold tracking-tight border border-[#e6ccb2]/80 shrink-0 whitespace-nowrap">
                        To Meet
                    </span>
                </div>

                {/* 3. Nama & Deskripsi */}
                <div className="space-y-1">
                    <h3 className="font-black text-xs sm:text-sm text-[#3d2314] tracking-tight leading-snug line-clamp-1 uppercase group-hover:text-[#8c5a3c] transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#6c584c] font-medium leading-relaxed line-clamp-2 min-h-8">
                        {item.description || '-'}
                    </p>
                </div>
            </div>

            {/* 4. Footer */}
            <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-[#e6ccb2]/40 min-w-0">
                <span className="font-black text-xs sm:text-sm text-[#3d2314] whitespace-nowrap tabular-nums shrink-0">
                    {formattedPrice}
                </span>

                <span
                    title={statusLabel}
                    className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider border shadow-2xs shrink-0 whitespace-nowrap ${isAvailable
                        ? 'bg-white text-[#3d2314] border-[#e6ccb2]/80'
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}
                >
                    {statusLabel}
                </span>
            </div>
        </div>
    );
}