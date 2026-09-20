'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, Star, Utensils, CupSoda, Cake,
    Info, ChevronRight, Coffee, X, MapPin, AlertCircle, RefreshCw,
    SlidersHorizontal
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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
    const [menuBanner, setMenuBanner] = useState<BannerItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

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
                fetch(`${API_BASE_URL}/api/banners/menu`, { cache: 'no-store' }).catch(() => null)
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

            if (resBanner && resBanner.ok) {
                const jsonBanner = await resBanner.json();
                setMenuBanner(jsonBanner.data || null);
            }
        } catch (err) {
            console.error('API Error / Offline:', err);
            setIsError(true);
            setMenuItems([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMenuPageData();
    }, []);

    const availableCategories = useMemo(() => {
        if (menuItems.length === 0) return ['all'];
        const unique = Array.from(new Set(menuItems.map(m => m.category).filter(Boolean)));
        return ['all', 'bestseller', ...unique.filter(c => c.toLowerCase() !== 'bestseller' && c.toLowerCase() !== 'best seller')];
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

            return (item.category || '').toLowerCase() === selectedCategory.toLowerCase();
        });
    }, [menuItems, selectedCategory, selectedLocation, searchQuery]);

    const heroBackgroundImage = menuBanner?.image
        ? (menuBanner.image.startsWith('http')
            ? menuBanner.image
            : menuBanner.image.startsWith('/img')
                ? menuBanner.image
                : `${API_BASE_URL}/storage/${menuBanner.image}`)
        : '/img/hero-home.png';

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="min-h-screen pb-16 space-y-4 lg:space-y-8">

            {/* ================================================= */}
            {/* 1. HERO SECTION (HANYA DITAMPILKAN DI DESKTOP)    */}
            {/* ================================================= */}
            <section
                className="hidden lg:flex w-full relative h-screen max-h-[750px] items-center bg-cover bg-right bg-no-repeat border-b border-[#e6ccb2]/60 pt-20 pb-6 overflow-hidden transition-all duration-300"
                style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent max-w-2xl lg:max-w-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
                    <div className="w-full max-w-lg lg:w-1/2 p-0 space-y-3.5 text-left">
                        <div className="inline-flex items-center justify-start gap-2 text-xs font-bold text-[#8c5a3c] tracking-widest uppercase">
                            <Link href="/" className="hover:underline">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-[#8c5a3c]" />
                            <span className="text-[#3d2314] font-black">DIGITAL MENU</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-tight">
                            {menuBanner?.title || 'Our Digital Menu'}
                        </h1>

                        <p className="text-sm text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            {menuBanner?.subtitle || 'Explore our wide variety of bear-themed sweet treats, delicious meals, and refreshing drinks crafted with love for you and your family!'}
                        </p>

                        <div className="pt-2 flex items-center justify-start">
                            <a
                                href="#menu-content"
                                className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
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
            <section id="menu-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-4">
                <div className="bg-white p-4 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-6">

                    {/* Filter Tab Lokasi Outlet & Search Bar (Di atas untuk Mobile) */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 bg-[#FAF0E6]/50 rounded-2xl border border-[#e6ccb2]/70">
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314] uppercase tracking-wide">
                                <MapPin className="w-4 h-4 text-[#8c5a3c]" />
                                <span>PILIH OUTLET:</span>
                            </div>
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                                <button
                                    onClick={() => setSelectedLocation('all')}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${selectedLocation === 'all'
                                        ? 'bg-[#8c5a3c] text-white shadow-xs'
                                        : 'bg-white text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                        }`}
                                >
                                    Semua Outlet
                                </button>
                                <button
                                    onClick={() => setSelectedLocation('pondok_mutiara')}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition cursor-pointer shrink-0 ${selectedLocation === 'pondok_mutiara'
                                        ? 'bg-[#8c5a3c] text-white shadow-xs'
                                        : 'bg-white text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                        }`}
                                >
                                    Pondok Mutiara
                                </button>
                            </div>
                        </div>

                        {/* Search Bar untuk Mobile & Desktop */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari makanan / minuman lezat..."
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
                    </div>

                    {/* UX KATEGORI MENU KHUSUS MOBILE: Horizontal Pill Chips yang Sangat Rapi & Mudah Dipahami */}
                    <div className="block lg:hidden">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                            {availableCategories.map((cat) => {
                                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                let label = cat.toUpperCase();
                                if (cat === 'all') label = 'SEMUA MENU';
                                if (cat === 'bestseller') label = 'BEST SELLER';

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition shrink-0 cursor-pointer flex items-center gap-1.5 ${isSelected
                                            ? 'bg-[#8c5a3c] text-white shadow-xs'
                                            : 'bg-[#FAF0E6]/70 text-[#3d2314] border border-[#e6ccb2]/70 hover:bg-[#FAF0E6]'
                                            }`}
                                    >
                                        {cat === 'bestseller' && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* SIDEBAR FILTER (KIRI - HANYA DESKTOP) */}
                        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:flex lg:flex-col gap-3">
                            <div className="text-xs font-black text-[#3d2314] uppercase tracking-wider px-1 flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                <span>Kategori Menu</span>
                            </div>

                            <nav
                                onWheel={(e) => e.stopPropagation()}
                                className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto lg:flex-1 lg:min-h-0 overscroll-contain pr-1.5 pb-3 scrollbar-thin scrollbar-thumb-[#8c5a3c]/30 scrollbar-track-transparent"
                            >
                                {availableCategories.map((cat) => {
                                    const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                    let label = cat.toUpperCase();
                                    if (cat === 'all') label = 'SEMUA MENU';
                                    if (cat === 'bestseller') label = 'BEST SELLER';

                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition shrink-0 cursor-pointer text-left w-full ${isSelected
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-[#FAF0E6]/50 text-[#3d2314] hover:bg-[#FAF0E6] border border-[#e6ccb2]/60'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2 min-w-0 pr-1">
                                                {cat === 'bestseller' ? (
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                                ) : (
                                                    <Coffee className="w-3.5 h-3.5 shrink-0 text-current" />
                                                )}
                                                <span className="text-[10.5px] font-black uppercase tracking-tight leading-none truncate whitespace-nowrap">
                                                    {label}
                                                </span>
                                            </span>

                                            {isSelected ? (
                                                <X className="w-3.5 h-3.5 shrink-0 hidden lg:block" />
                                            ) : (
                                                <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden lg:block opacity-60" />
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
                                    <div className="w-8 h-8 border-3 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                                        Memuat data menu...
                                    </p>
                                </div>
                            )}

                            {/* Error State */}
                            {!isLoading && isError && (
                                <div className="py-16 text-center space-y-3.5 bg-[#FAF0E6]/50 rounded-3xl border border-rose-200/80 p-6">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm text-[#3d2314]">Gagal Memuat Data Menu</h4>
                                        <p className="text-xs text-[#6c584c] font-semibold max-w-sm mx-auto">
                                            Server Sedang Sibuk atau Anda Sedang Offline. Silakan coba lagi nanti.
                                        </p>
                                    </div>
                                    <button
                                        onClick={fetchMenuPageData}
                                        className="px-4 py-2 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-bold text-xs rounded-full transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Coba Lagi</span>
                                    </button>
                                </div>
                            )}

                            {/* Normal Data State */}
                            {!isLoading && !isError && (
                                <>
                                    {/* Header List */}
                                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-2.5">
                                        <div className="flex items-center gap-2 text-base font-black text-[#3d2314] uppercase tracking-wide">
                                            <Coffee className="w-4.5 h-4.5 text-[#8c5a3c]" />
                                            <h2>
                                                {selectedCategory === 'all'
                                                    ? 'DAFTAR MENU TO MEET'
                                                    : selectedCategory === 'bestseller'
                                                        ? 'MENU BEST SELLER'
                                                        : `KATEGORI ${selectedCategory.toUpperCase()}`}
                                            </h2>
                                        </div>
                                        <span className="text-[11px] font-bold text-[#8c5a3c]">
                                            {filteredMenuItems.length} Menu
                                        </span>
                                    </div>

                                    {/* Grid Produk */}
                                    {filteredMenuItems.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                                            {filteredMenuItems.map((item) => (
                                                <MenuProductCard key={item.id} item={item} onSelect={setSelectedProduct} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center space-y-2 bg-[#FAF0E6]/50 rounded-3xl border border-[#e6ccb2]/60 p-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center mx-auto border border-[#e6ccb2]/60">
                                                <Info className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-black text-sm text-[#3d2314]">Tidak Ada Data Menu</h4>
                                            <p className="text-xs text-[#6c584c] font-semibold max-w-xs mx-auto">
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overscroll-contain overflow-hidden"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="menu-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 border border-[#e6ccb2] shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#FAF0E6] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-full aspect-[4/3] bg-stone-50 rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center">
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
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Coffee className="w-12 h-12 text-[#e6ccb2]" />
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    {selectedProduct.category || 'MENU'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[9px] font-black uppercase rounded-md">
                                        {selectedProduct.purchase_option || 'In Store'}
                                    </span>
                                    {selectedProduct.location && selectedProduct.location !== 'all' && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black uppercase rounded-md">
                                            {selectedProduct.location === 'heavenland' ? 'Heavenland' : 'Pondok Mutiara'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-black text-[#3d2314] text-lg leading-tight">
                                {selectedProduct.name}
                            </h3>

                            <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                {selectedProduct.description || 'Nikmati sajian lezat spesial To Meet Cafe.'}
                            </p>
                        </div>

                        <div className="pt-3 border-t border-[#e6ccb2]/60 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-[#8c5a3c] block">Harga Menu</span>
                                <span className="font-black text-[#3d2314] text-base">
                                    Rp {new Intl.NumberFormat('id-ID').format(selectedProduct.price)}
                                </span>
                            </div>

                            <Link
                                href="/visit-us"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-full transition flex items-center gap-1.5 uppercase cursor-pointer"
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

    return (
        <div
            onClick={() => onSelect(item)}
            className="bg-[#FAF0E6]/60 rounded-3xl p-3 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-2.5 relative group hover:shadow-md hover:border-[#8c5a3c] transition duration-200 cursor-pointer"
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                {isBestseller && (
                    <span className="px-2.5 py-0.5 bg-[#d4a373] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        BEST SELLER
                    </span>
                )}
                {isRecommended && (
                    <span className="px-2.5 py-0.5 bg-[#e85a4f] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        RECOMMENDED
                    </span>
                )}
            </div>

            {/* Foto Produk */}
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative">
                {item.image ? (
                    <img
                        src={
                            item.image.startsWith('http')
                                ? item.image
                                : item.image.startsWith('/img')
                                    ? item.image
                                    : `${API_BASE_URL}/storage/${item.image}`
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <Coffee className="w-8 h-8 text-[#e6ccb2]" />
                )}
            </div>

            {/* Detail */}
            <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                    <span className="text-[8px] sm:text-[9px] font-black text-[#8c5a3c] uppercase tracking-wider truncate">
                        {item.category || 'MENU'}
                    </span>
                    {item.location && item.location !== 'all' && (
                        <span className="text-[7px] font-bold px-1.5 py-0.2 bg-white text-[#8c5a3c] rounded border border-[#e6ccb2]/60 shrink-0">
                            {item.location === 'heavenland' ? 'Heavenland' : 'P. Mutiara'}
                        </span>
                    )}
                </div>
                <h4 className="font-black text-[#3d2314] text-xs leading-snug line-clamp-1">{item.name}</h4>
                <p className="text-[10px] text-[#6c584c] font-semibold line-clamp-2 leading-tight">
                    {item.description}
                </p>
            </div>

            {/* Harga & Badge Opsi Pembelian */}
            <div className="flex items-center justify-between pt-1 border-t border-[#e6ccb2]/40">
                <div className="font-black text-[#3d2314] text-xs">
                    Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </div>
                <span className="px-2 py-0.5 bg-white text-[#8c5a3c] text-[8px] font-black uppercase rounded-md border border-[#e6ccb2]/50">
                    {item.purchase_option || 'In Store'}
                </span>
            </div>
        </div>
    );
}