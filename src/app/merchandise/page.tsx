'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Sparkles, Gift, Coffee, Boxes,
    ShoppingBag, ShieldCheck, Heart,
    ChevronDown, Phone, MessageCircle, X, Store,
    Search, AlertCircle, RefreshCw, Info, ImageOff
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

// Helper function parsing tag <br> dan enter (\n)
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
    is_new?: boolean | number;
    is_bestseller?: boolean | number;
    is_active?: boolean | number;
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
    const [merchBanner, setMerchBanner] = useState<BannerItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [displayCount, setDisplayCount] = useState<number>(8);

    async function fetchMerchandiseData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const [resMerch, resBanner] = await Promise.all([
                fetch(`${API_BASE_URL}/api/merchandise`, { cache: 'no-store' }),
                fetch(`${API_BASE_URL}/api/banners/merchandise`, { cache: 'no-store' }).catch(() => null)
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
                setMerchBanner(jsonBanner.data || null);
            }
        } catch (err) {
            console.error('Error fetching merchandise API:', err);
            setIsError(true);
            setMerchItems([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMerchandiseData();
    }, []);

    // Ekstrak list kategori unik secara dinamis dari produk admin
    const availableCategories = useMemo(() => {
        if (merchItems.length === 0) return ['all'];
        const unique = Array.from(new Set(
            merchItems.map(m => m.category || m.category_slug).filter(Boolean)
        )) as string[];
        return ['all', ...unique];
    }, [merchItems]);

    // Filter Kategori, Pencarian, & Sorting
    const filteredAndSortedItems = useMemo(() => {
        let result = merchItems.filter(item => {
            if (item.is_active === false) return false;

            const categoryName = (item.category || item.category_slug || '').toLowerCase();
            const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory.toLowerCase();

            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });

        if (sortBy === 'price-low') {
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

    // Format URL Foto Hero Banner
    const heroImageSrc = merchBanner?.image
        ? (merchBanner.image.startsWith('http')
            ? merchBanner.image
            : merchBanner.image.startsWith('/img')
                ? merchBanner.image
                : `${API_BASE_URL}/storage/${merchBanner.image}`)
        : '/img/hero-home.png';

    return (
        <div className="min-h-screen pb-16 space-y-6 sm:space-y-10">

            {/* ================================================= */}
            {/* 1. HERO BANNER (HANYA DITAMPILKAN DI DESKTOP)     */}
            {/* ================================================= */}
            <section className="hidden lg:flex relative w-full h-screen max-h-[820px] items-center overflow-hidden border-b border-[#e6ccb2]/60">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImageSrc}
                        alt="To Meet Official Merchandise"
                        className="w-full h-full object-cover object-right xl:object-center"
                    />
                    {/* Gradien Putih Halus Sisi Kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full lg:w-3/5 xl:w-1/2" />
                </div>

                {/* Konten Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-20">
                    <div className="max-w-md lg:max-w-xl">
                        <div className="space-y-3.5 sm:space-y-4">

                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#8c5a3c] text-xs font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
                                <span>OFFICIAL MERCHANDISE</span>
                                <Sparkles className="w-3 h-3 text-amber-500" />
                            </div>

                            {/* Title */}
                            <div className="space-y-1">
                                <h1 className="text-4xl xl:text-5xl font-black text-[#3d2314] tracking-tight leading-[1.18] uppercase">
                                    {renderFormattedText(
                                        merchBanner?.title,
                                        <>
                                            TO MEET <br />
                                            <span className="text-[#8c5a3c]">MERCHANDISE</span>
                                        </>
                                    )}
                                </h1>
                            </div>

                            {/* Subtitle */}
                            <p className="text-sm text-[#5a4232] font-semibold leading-relaxed max-w-md">
                                {renderFormattedText(
                                    merchBanner?.subtitle,
                                    'Bawa pulang koleksi boneka dan suvenir lucu khas To Meet Cafe untuk teman atau koleksi pribadimu.'
                                )}
                            </p>

                            {/* 3 Values Mini Cards */}
                            <div className="grid grid-cols-3 gap-2 pt-1 max-w-md">
                                <div className="bg-[#FAF0E6]/80 backdrop-blur-xs p-2.5 rounded-2xl border border-[#e6ccb2]/70 text-center flex flex-col items-center justify-center space-y-1 shadow-2xs">
                                    <div className="w-7 h-7 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-2xs">
                                        <BearFaceIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-[9.5px] font-black text-[#3d2314] block tracking-tight">100% Original</span>
                                        <span className="text-[7.5px] text-[#6c584c] font-bold block mt-0.5">Official Item</span>
                                    </div>
                                </div>

                                <div className="bg-[#FAF0E6]/80 backdrop-blur-xs p-2.5 rounded-2xl border border-[#e6ccb2]/70 text-center flex flex-col items-center justify-center space-y-1 shadow-2xs">
                                    <div className="w-7 h-7 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-2xs">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-[9.5px] font-black text-[#3d2314] block tracking-tight">Cute Design</span>
                                        <span className="text-[7.5px] text-[#6c584c] font-bold block mt-0.5">Aesthetic</span>
                                    </div>
                                </div>

                                <div className="bg-[#FAF0E6]/80 backdrop-blur-xs p-2.5 rounded-2xl border border-[#e6ccb2]/70 text-center flex flex-col items-center justify-center space-y-1 shadow-2xs">
                                    <div className="w-7 h-7 rounded-xl bg-white text-[#e85a4f] flex items-center justify-center shadow-2xs">
                                        <Gift className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-[9.5px] font-black text-[#3d2314] block tracking-tight">Great Gift</span>
                                        <span className="text-[7.5px] text-[#6c584c] font-bold block mt-0.5">For Loved Ones</span>
                                    </div>
                                </div>
                            </div>

                            {/* Call To Action Buttons */}
                            <div className="pt-2 flex flex-row items-center gap-2.5">
                                <a
                                    href="#catalog"
                                    className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-xs rounded-full shadow-md shadow-rose-500/25 transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                >
                                    <span>{merchBanner?.cta_text || 'LIHAT KATALOG'}</span>
                                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                                </a>

                                <a
                                    href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20stok%20merchandise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-xs rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer whitespace-nowrap"
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
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14 pt-20 sm:pt-24 lg:pt-0">
                <div className="bg-white p-4 sm:p-6 lg:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* SIDEBAR FILTER (KIRI) */}
                        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
                            {/* Search Box */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk merchandise..."
                                    className="w-full bg-[#FAF0E6]/50 border border-[#e6ccb2]/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[#3d2314] font-semibold focus:outline-none focus:bg-white focus:border-[#8c5a3c] transition placeholder:text-[#a08a7b]"
                                />
                                <Search className="w-4 h-4 text-[#8c5a3c] absolute left-3.5 top-3" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-3 text-[#8c5a3c] hover:text-[#3d2314] cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-[#e6ccb2]/60">
                                <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <BearPawIcon className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>CATEGORIES</span>
                                </h3>
                            </div>

                            {/* Daftar Kategori Dinamis */}
                            <div className="bg-[#FAF0E6]/40 p-2 rounded-2xl border border-[#e6ccb2]/40">
                                <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[320px] pr-1 scrollbar-thin text-xs font-black uppercase tracking-wide">
                                    {availableCategories.map((cat) => {
                                        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setDisplayCount(8);
                                                }}
                                                className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition shrink-0 cursor-pointer text-left ${isSelected
                                                    ? 'bg-[#8c5a3c] text-white shadow-2xs font-extrabold'
                                                    : 'bg-white/80 text-[#3d2314] hover:bg-[#FAF0E6] hover:text-[#8c5a3c]'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <BearPawIcon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#8c5a3c]'}`} />
                                                    <span>{cat === 'all' ? 'All Products' : cat}</span>
                                                </span>
                                                {isSelected && <X className="w-3 h-3 hidden lg:block opacity-80" />}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Promo Card Chat WA */}
                            <div className="hidden lg:block bg-[#fdf3f1] p-4 rounded-2xl border border-rose-100 space-y-2.5 text-center">
                                <h4 className="font-black text-xs text-[#3d2314]">Cant find what you&apos;re looking for?</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold">Tanyakan ketersediaan stok produk langsung ke admin.</p>
                                <a
                                    href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20stok%20merchandise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 bg-[#3d2314] hover:bg-[#201007] text-white font-black text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition uppercase tracking-wider cursor-pointer"
                                >
                                    <span>CHAT VIA WA</span>
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                </a>
                            </div>
                        </aside>

                        {/* PRODUCT GRID & SORTING (KANAN) */}
                        <main className="lg:col-span-9 space-y-5">

                            {/* Header Sort & Counter */}
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                                <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                                    <h2>{selectedCategory === 'all' ? 'ALL PRODUCTS' : selectedCategory.toUpperCase()}</h2>
                                    <span className="text-xs font-semibold text-[#6c584c] lowercase">
                                        ({filteredAndSortedItems.length} item)
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="sortBy" className="text-xs font-bold text-[#6c584c] hidden sm:block">
                                        Urutkan:
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="sortBy"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="bg-[#FAF0E6]/50 border border-[#e6ccb2]/80 rounded-xl px-3 py-1.5 text-xs text-[#3d2314] font-black focus:outline-none appearance-none pr-8 cursor-pointer"
                                        >
                                            <option value="featured">Paling Populer</option>
                                            <option value="newest">Produk Terbaru</option>
                                            <option value="price-low">Harga: Termurah</option>
                                            <option value="price-high">Harga: Tertinggi</option>
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#8c5a3c] absolute right-2.5 top-2.5 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="py-16 text-center space-y-2">
                                    <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                        Memuat produk merchandise...
                                    </p>
                                </div>
                            )}

                            {/* Error State */}
                            {!isLoading && isError && (
                                <div className="py-10 text-center space-y-2.5 bg-[#FAF0E6]/50 rounded-2xl border border-rose-200 p-5">
                                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-black text-xs text-[#3d2314]">Gagal Memuat Data Merchandise</h4>
                                    <p className="text-[11px] text-[#6c584c] font-semibold max-w-xs mx-auto">
                                        Server Sedang Sibuk Atau Error
                                    </p>
                                    <button
                                        onClick={fetchMerchandiseData}
                                        className="px-3.5 py-1.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-bold text-[10px] rounded-full transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Coba Lagi</span>
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && !isError && filteredAndSortedItems.length === 0 && (
                                <div className="py-12 text-center space-y-1.5 bg-[#FAF0E6]/50 rounded-2xl border border-[#e6ccb2]/60 p-5">
                                    <div className="w-9 h-9 rounded-xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/60">
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-black text-xs text-[#3d2314]">Belum Ada Produk</h4>
                                    <p className="text-[10px] text-[#6c584c] font-semibold max-w-xs mx-auto">
                                        {searchQuery
                                            ? 'Produk dengan kata kunci tersebut tidak ditemukan.'
                                            : 'Belum ada produk merchandise yang ditambahkan pada kategori ini.'}
                                    </p>
                                </div>
                            )}

                            {/* Grid 4 Kolom Produk Dinamis */}
                            {!isLoading && !isError && displayedItems.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                    {displayedItems.map((item) => (
                                        <MerchandiseProductCard key={item.id} item={item} />
                                    ))}
                                </div>
                            )}

                            {/* Tombol Load More */}
                            {!isLoading && !isError && displayedItems.length < filteredAndSortedItems.length && (
                                <div className="pt-2 text-center">
                                    <button
                                        onClick={() => setDisplayCount(prev => prev + 4)}
                                        className="px-5 py-2 bg-[#FAF0E6] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-black text-xs rounded-full border border-[#e6ccb2] transition uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                    >
                                        <span>LOAD MORE PRODUCTS</span>
                                        <ChevronDown className="w-3.5 h-3.5" />
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
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">100% Official</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">To Meet Merchandise</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <Gift className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Great for Gift</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">and Collection</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Quality You Can</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Trust</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center">
                                <Heart className="w-4 h-4 text-[#e85a4f] fill-current" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Support To Meet</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Community</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. ORDER / WHATSAPP CTA SECTION                   */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#ffffff] p-5 sm:p-7 rounded-3xl border border-rose-100/80 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">

                    <div className="lg:col-span-7 space-y-2 text-center lg:text-left">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                            Want to order or ask more?
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6c584c] font-semibold max-w-md mx-auto lg:mx-0">
                            Chat with us on WhatsApp to check stock and place your order!
                        </p>

                        <div className="pt-1">
                            <a
                                href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20order%20merchandise"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-[#3d2314] hover:bg-[#201007] text-white font-black text-xs rounded-full shadow-md transition duration-200 inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <span>CHAT VIA WHATSAPP</span>
                                <Phone className="w-3.5 h-3.5 fill-current" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end gap-3">
                        <div className="w-28 h-36 bg-white p-2 rounded-2xl shadow-xs transform -rotate-3 hover:rotate-0 transition duration-200 text-[#3d2314] text-center flex flex-col justify-between border border-[#e6ccb2]">
                            <img src="/img/mc-1.png" alt="Merchandise 1" className="w-full h-24 object-cover rounded-xl" />
                            <span className="text-[8px] font-black uppercase tracking-wide">For You</span>
                        </div>

                        <div className="w-28 h-36 bg-white p-2 rounded-2xl shadow-xs transform rotate-3 hover:rotate-0 transition duration-200 text-[#3d2314] text-center flex flex-col justify-between border border-[#e6ccb2]">
                            <img src="/img/mc-2.png" alt="Merchandise 2" className="w-full h-24 object-cover rounded-xl" />
                            <span className="text-[8px] font-black uppercase tracking-wide">For Your Friend</span>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}

function MerchandiseProductCard({ item }: { item: MerchandiseItem }) {
    const isNew = Boolean(item.is_new);
    const isBestseller = Boolean(item.is_bestseller);
    const hasImage = Boolean(item.image && item.image.trim() !== '');

    const imageSrc = hasImage
        ? (item.image!.startsWith('http')
            ? item.image!
            : item.image!.startsWith('/img')
                ? item.image!
                : `${API_BASE_URL}/storage/${item.image}`)
        : null;

    return (
        <div className="bg-[#FAF0E6]/60 rounded-3xl p-3 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-2.5 relative group hover:shadow-md hover:border-[#8c5a3c] transition duration-200">

            {/* Badges Status */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                {isNew && (
                    <span className="px-2.5 py-0.5 bg-[#e85a4f] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        NEW
                    </span>
                )}
                {isBestseller && (
                    <span className="px-2.5 py-0.5 bg-[#d4a373] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        BEST SELLER
                    </span>
                )}
            </div>

            {/* Foto Produk */}
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-3 space-y-1 text-[#a08a7b]">
                        <ImageOff className="w-5 h-5 opacity-60" />
                        <span className="text-[9px] font-bold tracking-wider uppercase">Belum ada foto</span>
                    </div>
                )}
            </div>

            {/* Detail Teks & Opsi Pembelian */}
            <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[8px] font-black text-[#8c5a3c] uppercase tracking-wider">
                    <Store className="w-3 h-3" />
                    <span>{item.purchase_option || 'In Store'}</span>
                </div>
                <h4 className="font-black text-[#3d2314] text-xs leading-snug line-clamp-1">{item.name}</h4>
                <p className="text-[10px] text-[#6c584c] font-semibold line-clamp-2 leading-tight">
                    {item.description || 'Official merchandise khas To Meet Cafe.'}
                </p>
            </div>

            {/* Harga & Tombol Order WhatsApp */}
            <div className="flex items-center justify-between pt-1.5 border-t border-[#e6ccb2]/40">
                <div className="font-black text-[#3d2314] text-xs">
                    Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </div>
                <button
                    title="Pesan via WhatsApp"
                    onClick={() => window.open(`https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20pesan%20merchandise%20${encodeURIComponent(item.name)}`, '_blank')}
                    className="w-7 h-7 rounded-full bg-white hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition shadow-2xs border border-[#e6ccb2]/50 cursor-pointer"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}