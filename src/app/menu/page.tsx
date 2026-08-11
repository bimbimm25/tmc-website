'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, Star, Utensils, CupSoda, Cake,
    Sparkles, Leaf, Info, ChevronRight,
    ShoppingBag, Heart, Coffee, X
} from 'lucide-react';

// Custom SVG Icon (Nol Emoji)
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    );
}

export interface MenuItem {
    id: number;
    category_slug: string;
    name: string;
    description: string;
    price: number;
    image: string;
    is_bestseller: boolean;
    is_recommended: boolean;
    is_active: boolean;
}

// Fallback Data Menu
const DEFAULT_MENU_ITEMS: MenuItem[] = [
    { id: 1, category_slug: 'bestseller', name: 'Snow Ice Bear Original', description: 'Refreshing milk snow ice with fruits and honey.', price: 48000, image: '/img/hero-home.png', is_bestseller: true, is_recommended: false, is_active: true },
    { id: 2, category_slug: 'bestseller', name: 'Nasi Goreng To Meet', description: 'Special fried rice with chicken, egg, veggies, and crackers.', price: 42000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: true, is_active: true },
    { id: 3, category_slug: 'bestseller', name: 'Bear Berry Latte', description: 'Mix of strawberry, milk, and creamy cheese foam.', price: 38000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },
    { id: 4, category_slug: 'bestseller', name: 'Pudding Kelinci', description: 'Smooth pudding with sweet milky flavor.', price: 26000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },

    { id: 5, category_slug: 'food', name: 'Nasi Curry', description: 'Japanese curry with chicken katsu and steamed rice.', price: 45000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: true, is_active: true },
    { id: 6, category_slug: 'food', name: 'Creamy Chicken Pasta', description: 'Creamy white sauce pasta with grilled chicken.', price: 43000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },
    { id: 7, category_slug: 'food', name: 'Chicken Ramen', description: 'Rich chicken broth ramen with egg and toppings.', price: 40000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },
    { id: 8, category_slug: 'food', name: 'Chicken Katsu', description: 'Crispy chicken katsu served with rice & salad.', price: 44000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },

    { id: 9, category_slug: 'drinks', name: 'Ovaltine Bear', description: 'Ovaltine milk with chocolate & bear topping.', price: 32000, image: '/img/hero-home.png', is_bestseller: true, is_recommended: false, is_active: true },
    { id: 10, category_slug: 'drinks', name: 'Matcha Latte', description: 'Creamy matcha latte with fresh milk.', price: 30000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },
    { id: 11, category_slug: 'drinks', name: 'Strawberry Yogurt', description: 'Sweet & refreshing strawberry yogurt.', price: 32000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },
    { id: 12, category_slug: 'drinks', name: 'Lychee Sparkle', description: 'Lychee drink with sparkling soda.', price: 28000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: false, is_active: true },

    { id: 13, category_slug: 'dessert', name: 'Chocolate Bingsoo', description: 'Chocolate shaved ice with brownie & almond.', price: 46000, image: '/img/hero-home.png', is_bestseller: true, is_recommended: false, is_active: true },
    { id: 14, category_slug: 'dessert', name: 'Bear Waffle', description: 'Waffle with ice cream, fruits, and honey.', price: 42000, image: '/img/hero-home.png', is_bestseller: false, is_recommended: true, is_active: true },
];

export default function DigitalMenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchMenuFromBackend() {
            try {
                setIsLoading(true);
                const res = await fetch('http://127.0.0.1:8000/api/menus', { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.data && json.data.length > 0) {
                        setMenuItems(json.data);
                    }
                }
            } catch {
                console.log('Menggunakan fallback data lokal menu');
            } finally {
                setIsLoading(false);
            }
        }
        fetchMenuFromBackend();
    }, []);

    const filteredMenuItems = useMemo(() => {
        return menuItems.filter((item) => {
            if (!item.is_active) return false;

            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());

            if (selectedCategory === 'all') return matchesSearch;
            if (selectedCategory === 'bestseller') return matchesSearch && (item.is_bestseller || item.category_slug === 'bestseller');

            return matchesSearch && item.category_slug.toLowerCase() === selectedCategory.toLowerCase();
        });
    }, [menuItems, selectedCategory, searchQuery]);

    const bestSellerList = useMemo(() => filteredMenuItems.filter(i => i.is_bestseller || i.category_slug === 'bestseller'), [filteredMenuItems]);
    const foodList = useMemo(() => filteredMenuItems.filter(i => i.category_slug === 'food'), [filteredMenuItems]);
    const drinksList = useMemo(() => filteredMenuItems.filter(i => i.category_slug === 'drinks'), [filteredMenuItems]);
    const dessertList = useMemo(() => filteredMenuItems.filter(i => i.category_slug === 'dessert'), [filteredMenuItems]);

    return (
        <div className="bg-[#faf6f0] min-h-screen pb-16 space-y-8">

            {/* ================================================= */}
            {/* 1. HERO MENU SECTION (PAS 1 LAYAR LAPTOP + OVERLAY SEPARUH) */}
            {/* ================================================= */}
            <section
                className="w-full relative h-screen min-h-[600px] max-h-[750px] flex items-center bg-cover bg-center bg-no-repeat border-b border-[#e6ccb2]/60 pt-20 pb-8 overflow-hidden"
                style={{ backgroundImage: "url('/img/hero-home.png')" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">

                    {/* Kartu Overlay Putih/Krem Separuh Layar di Sisi Kiri */}
                    <div className="w-full lg:w-1/2 bg-[#faf6f0]/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-[#e6ccb2]/80 shadow-xl space-y-3.5 text-center sm:text-left">

                        {/* Breadcrumb */}
                        <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-[10px] sm:text-xs font-bold text-[#8c5a3c] tracking-widest uppercase">
                            <Link href="/" className="hover:underline">HOME</Link>
                            <ChevronRight className="w-3 h-3 text-[#8c5a3c]" />
                            <span className="text-[#3d2314] font-black">DIGITAL MENU</span>
                        </div>

                        {/* Judul Utama */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-tight">
                            Our Digital Menu
                        </h1>

                        {/* Deskripsi */}
                        <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                            Explore our wide variety of bear-themed sweet treats, delicious meals, and refreshing drinks crafted with love for you and your family!
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                            <a
                                href="#menu-content"
                                className="px-6 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider"
                            >
                                <span>EXPLORE MENU</span>
                                <BearPawIcon className="w-3.5 h-3.5" />
                            </a>
                        </div>

                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 2. MAIN MENU CONTAINER (SIDEBAR & PRODUCT GRID UX) */}
            {/* ================================================= */}
            <section id="menu-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div className="bg-[#fffcf7] p-4 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* --------------------------------------------- */}
                        {/* SIDEBAR CATEGORY (KIRI)                       */}
                        {/* --------------------------------------------- */}
                        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">

                            {/* Input Pencarian */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari makanan / minuman..."
                                    className="w-full bg-[#faf6f0] border border-[#e6ccb2]/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[#3d2314] font-semibold focus:outline-none focus:border-[#8c5a3c] transition placeholder:text-[#a08a7b]"
                                />
                                <Search className="w-4 h-4 text-[#8c5a3c] absolute left-3.5 top-3" />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-3 text-[#8c5a3c] hover:text-[#3d2314]"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Kategori Menu */}
                            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none text-xs font-black uppercase tracking-wide">

                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition shrink-0 cursor-pointer ${selectedCategory === 'all'
                                            ? 'bg-[#8c5a3c] text-white shadow-xs'
                                            : 'bg-[#faf6f0] text-[#3d2314] hover:bg-[#f4ece1]'
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Coffee className="w-4 h-4" />
                                        <span>SEMUA MENU</span>
                                    </span>
                                    {selectedCategory === 'all' && <X className="w-3.5 h-3.5 hidden lg:block" />}
                                </button>

                                <button
                                    onClick={() => setSelectedCategory('bestseller')}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition shrink-0 cursor-pointer ${selectedCategory === 'bestseller'
                                            ? 'bg-[#8c5a3c] text-white shadow-xs'
                                            : 'bg-[#faf6f0] text-[#3d2314] hover:bg-[#f4ece1]'
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span>BEST SELLER</span>
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 hidden lg:block opacity-60" />
                                </button>

                                <button
                                    onClick={() => setSelectedCategory('food')}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition shrink-0 cursor-pointer ${selectedCategory === 'food'
                                            ? 'bg-[#8c5a3c] text-white shadow-xs'
                                            : 'bg-[#faf6f0] text-[#3d2314] hover:bg-[#f4ece1]'
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Utensils className="w-4 h-4" />
                                        <span>MAKANAN (FOOD)</span>
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 hidden lg:block opacity-60" />
                                </button>

                                <button
                                    onClick={() => setSelectedCategory('drinks')}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition shrink-0 cursor-pointer ${selectedCategory === 'drinks'
                                            ? 'bg-[#8c5a3c] text-white shadow-xs'
                                            : 'bg-[#faf6f0] text-[#3d2314] hover:bg-[#f4ece1]'
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <CupSoda className="w-4 h-4" />
                                        <span>MINUMAN (DRINKS)</span>
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 hidden lg:block opacity-60" />
                                </button>

                                <button
                                    onClick={() => setSelectedCategory('dessert')}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition shrink-0 cursor-pointer ${selectedCategory === 'dessert'
                                            ? 'bg-[#8c5a3c] text-white shadow-xs'
                                            : 'bg-[#faf6f0] text-[#3d2314] hover:bg-[#f4ece1]'
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Cake className="w-4 h-4" />
                                        <span>DESSERT</span>
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 hidden lg:block opacity-60" />
                                </button>

                            </nav>

                            {/* Promo Allergen Card Info */}
                            <div className="hidden lg:block bg-[#fdf3f1] p-5 rounded-3xl border border-rose-100 space-y-2.5">
                                <div className="w-10 h-10 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-xs">
                                    <BearFaceIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xs text-[#3d2314]">Informasi Alergi Makanan</h4>
                                    <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                        Mohon informasikan kepada staf kami apabila Anda memiliki alergi terhadap bahan tertentu.
                                    </p>
                                </div>
                            </div>

                        </aside>

                        {/* --------------------------------------------- */}
                        {/* PRODUCT GRID DENGAN UX INTERAKTIF (KANAN)     */}
                        {/* --------------------------------------------- */}
                        <main className="lg:col-span-9 space-y-8">

                            {isLoading && (
                                <div className="py-12 text-center text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                                    Memuat daftar menu...
                                </div>
                            )}

                            {/* SECTION: BEST SELLER */}
                            {(selectedCategory === 'all' || selectedCategory === 'bestseller') && bestSellerList.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-2.5">
                                        <div className="flex items-center gap-2 text-base font-black text-[#3d2314] uppercase tracking-wide">
                                            <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                                            <h2>BEST SELLER</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                        {bestSellerList.map((item) => (
                                            <MenuProductCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION: FOOD */}
                            {(selectedCategory === 'all' || selectedCategory === 'food') && foodList.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-2.5">
                                        <div className="flex items-center gap-2 text-base font-black text-[#3d2314] uppercase tracking-wide">
                                            <Utensils className="w-4.5 h-4.5 text-[#8c5a3c]" />
                                            <h2>MAKANAN (FOOD)</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                        {foodList.map((item) => (
                                            <MenuProductCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION: DRINKS */}
                            {(selectedCategory === 'all' || selectedCategory === 'drinks') && drinksList.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-2.5">
                                        <div className="flex items-center gap-2 text-base font-black text-[#3d2314] uppercase tracking-wide">
                                            <CupSoda className="w-4.5 h-4.5 text-[#8c5a3c]" />
                                            <h2>MINUMAN (DRINKS)</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                        {drinksList.map((item) => (
                                            <MenuProductCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION: DESSERT */}
                            {(selectedCategory === 'all' || selectedCategory === 'dessert') && dessertList.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-2.5">
                                        <div className="flex items-center gap-2 text-base font-black text-[#3d2314] uppercase tracking-wide">
                                            <Cake className="w-4.5 h-4.5 text-[#8c5a3c]" />
                                            <h2>DESSERT</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                        {dessertList.map((item) => (
                                            <MenuProductCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* JIKA TIDAK ADA DATA PENCARIAN */}
                            {!isLoading && filteredMenuItems.length === 0 && (
                                <div className="py-16 text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                        <Info className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-black text-sm text-[#3d2314]">Menu Tidak Ditemukan</h4>
                                    <p className="text-xs text-[#6c584c] font-semibold max-w-xs mx-auto">
                                        Coba cari menggunakan kata kunci lain atau pilih kategori lain.
                                    </p>
                                </div>
                            )}

                        </main>

                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 3. RECOMMENDATION BANNER SHORTCUT                */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fdf3f1] p-6 sm:p-8 rounded-3xl border border-rose-100/80 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                    <div className="lg:col-span-6 space-y-1 text-center lg:text-left">
                        <div className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                            Bingung Memilih Menu?
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3d2314] tracking-tight leading-tight">
                            Biarkan To Meet Bear merekomendasikan untuk Anda!
                            <BearPawIcon className="inline-block w-5 h-5 ml-2 text-[#e85a4f]" />
                        </h2>
                    </div>

                    <div className="lg:col-span-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSelectedCategory('bestseller')}
                            className="bg-white hover:bg-[#8c5a3c] hover:text-white px-4 py-3 rounded-full border border-[#e6ccb2]/80 transition flex items-center justify-between group shadow-2xs cursor-pointer"
                        >
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314] group-hover:text-white uppercase">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:text-white" />
                                <span>Best Seller</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
                        </button>

                        <button
                            onClick={() => setSelectedCategory('food')}
                            className="bg-white hover:bg-[#8c5a3c] hover:text-white px-4 py-3 rounded-full border border-[#e6ccb2]/80 transition flex items-center justify-between group shadow-2xs cursor-pointer"
                        >
                            <div className="flex items-center gap-2 text-xs font-black text-[#3d2314] group-hover:text-white uppercase">
                                <Utensils className="w-4 h-4 text-[#8c5a3c] group-hover:text-white" />
                                <span>Makanan Favorit</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
                        </button>
                    </div>

                </div>
            </section>

        </div>
    );
}

// Komponen Kartu Produk UX Bersih
function MenuProductCard({ item }: { item: MenuItem }) {
    return (
        <div className="bg-[#faf6f0] rounded-3xl p-3 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-3 relative group hover:shadow-md transition duration-200">

            {/* Badges Status */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                {item.is_bestseller && (
                    <span className="px-2.5 py-0.5 bg-[#d4a373] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        BEST SELLER
                    </span>
                )}
                {item.is_recommended && (
                    <span className="px-2.5 py-0.5 bg-[#e85a4f] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        RECOMMENDED
                    </span>
                )}
            </div>

            {/* Foto Produk */}
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative">
                {item.image ? (
                    <img
                        src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000/storage/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <Coffee className="w-8 h-8 text-[#e6ccb2]" />
                )}
            </div>

            {/* Detail Teks & Harga */}
            <div className="space-y-1">
                <h4 className="font-black text-[#3d2314] text-xs leading-snug line-clamp-1">{item.name}</h4>
                <p className="text-[10px] text-[#6c584c] font-semibold line-clamp-2 leading-tight">
                    {item.description}
                </p>
            </div>

            {/* Harga & Tombol Aksi */}
            <div className="flex items-center justify-between pt-1 border-t border-[#e6ccb2]/40">
                <div className="font-black text-[#3d2314] text-xs">
                    Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </div>
                <button
                    title="Pesan via WhatsApp"
                    onClick={() => window.open(`https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20pesan%20${encodeURIComponent(item.name)}`, '_blank')}
                    className="w-7 h-7 rounded-full bg-[#f4ece1] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                </button>
            </div>

        </div>
    );
}