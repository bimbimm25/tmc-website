'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Sparkles, Gift, Coffee, Boxes,
    ShoppingBag, ShieldCheck, Heart,
    ChevronDown, Phone, MessageCircle, X, Store
} from 'lucide-react';

// Custom SVG Icons (Nol Emoji)
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

// Interface Data Merchandise
export interface MerchandiseItem {
    id: number;
    category_slug: string;
    name: string;
    description: string;
    price: number;
    image: string;
    is_new: boolean;
    is_bestseller: boolean;
    is_active: boolean;
    purchase_option: string; // 'In Store'
}

// List Kategori Sesuai Permintaan Kak Fransiska
const CATEGORIES_LIST = [
    { slug: 'all', name: 'All Products' },
    { slug: 'plushie', name: 'Plushie' },
    { slug: 'toy', name: 'Toy' },
    { slug: 'fidget-clicker', name: 'Fidget Clicker' },
    { slug: 'accessories', name: 'Accessories' },
    { slug: 'squishy', name: 'Squishy' },
    { slug: 'slime', name: 'Slime' },
    { slug: 'bag-charm', name: 'Bag Charm' },
    { slug: 'blind-box', name: 'Blind Box' },
];

// Data Dummy Lengkap untuk Setiap Kategori
const DEFAULT_MERCHANDISE_ITEMS: MerchandiseItem[] = [
    // Plushie
    { id: 1, category_slug: 'plushie', name: 'To Meet Plush Bear Signature', description: 'Boneka beruang ikonik berbahan super lembut dan empuk.', price: 189000, image: '/img/hero-home.png', is_new: true, is_bestseller: true, is_active: true, purchase_option: 'In Store' },
    { id: 2, category_slug: 'plushie', name: 'Mini Bear Hug Plushie', description: 'Gantungan boneka beruang mini yang menggemaskan.', price: 79000, image: '/img/hero-home.png', is_new: false, is_bestseller: false, is_active: true, purchase_option: 'In Store' },

    // Toy
    { id: 3, category_slug: 'toy', name: 'Bear Building Blocks Set', description: 'Mainan susun balok karakter beruang untuk melatih kreativitas.', price: 99000, image: '/img/hero-home.png', is_new: true, is_bestseller: false, is_active: true, purchase_option: 'In Store' },
    { id: 4, category_slug: 'toy', name: 'To Meet Wind-Up Walking Bear', description: 'Mainan putar mekanis beruang yang dapat berjalan.', price: 45000, image: '/img/hero-home.png', is_new: false, is_bestseller: false, is_active: true, purchase_option: 'In Store' },

    // Fidget Clicker
    { id: 5, category_slug: 'fidget-clicker', name: 'Bear Mechanical Fidget Clicker', description: 'Fidget clicker dengan suara klik taktil yang memuaskan relaksasi.', price: 49000, image: '/img/hero-home.png', is_new: true, is_bestseller: true, is_active: true, purchase_option: 'In Store' },
    { id: 6, category_slug: 'fidget-clicker', name: 'Coffee Cup Keyboard Switch Clicker', description: 'Gantungan fidget berbahan switch mekanis berbentuk cangkir kopi.', price: 39000, image: '/img/hero-home.png', is_new: false, is_bestseller: false, is_active: true, purchase_option: 'In Store' },

    // Accessories
    { id: 7, category_slug: 'accessories', name: 'Bear Bucket Hat Warm Brown', description: 'Topi bucket berbahan katun lembut dengan bordir beruang.', price: 129000, image: '/img/hero-home.png', is_new: true, is_bestseller: false, is_active: true, purchase_option: 'In Store' },
    { id: 8, category_slug: 'accessories', name: 'Fluffy Bear Hair Clip Set', description: 'Jepit rambut bulu halus karakter beruang lucu.', price: 35000, image: '/img/hero-home.png', is_new: false, is_bestseller: true, is_active: true, purchase_option: 'In Store' },

    // Squishy
    { id: 9, category_slug: 'squishy', name: 'Slow Rising Bear Donut Squishy', description: 'Squishy beraroma manis yang sangat lambat kembali ke bentuk semula.', price: 55000, image: '/img/hero-home.png', is_new: true, is_bestseller: true, is_active: true, purchase_option: 'In Store' },
    { id: 10, category_slug: 'squishy', name: 'Bear Toast Bread Squishy', description: 'Squishy empuk berbentuk roti tawar beruang.', price: 48000, image: '/img/hero-home.png', is_new: false, is_bestseller: false, is_active: true, purchase_option: 'In Store' },

    // Slime
    { id: 11, category_slug: 'slime', name: 'Clear Butter Slime Bear Scented', description: 'Slime tekstur mentega wangi vanila dengan charm beruang.', price: 42000, image: '/img/hero-home.png', is_new: true, is_bestseller: false, is_active: true, purchase_option: 'In Store' },
    { id: 12, category_slug: 'slime', name: 'Cloud Slime Galaxy Strawberry', description: 'Slime lembut sehalus awan dengan aroma stroberi manis.', price: 45000, image: '/img/hero-home.png', is_new: false, is_bestseller: true, is_active: true, purchase_option: 'In Store' },

    // Bag Charm
    { id: 13, category_slug: 'bag-charm', name: 'Acrylic Bear Charm Keychain', description: 'Gantungan tas akrilik tebal dengan warna pastel estetik.', price: 39000, image: '/img/hero-home.png', is_new: false, is_bestseller: true, is_active: true, purchase_option: 'In Store' },
    { id: 14, category_slug: 'bag-charm', name: 'Leather Plush Paws Bag Charm', description: 'Gantungan kunci jejak kaki beruang berbahan kulit sintetis.', price: 59000, image: '/img/hero-home.png', is_new: true, is_bestseller: false, is_active: true, purchase_option: 'In Store' },

    // Blind Box
    { id: 15, category_slug: 'blind-box', name: 'To Meet Bear World Blind Box Vol.1', description: 'Kotak misteri figurin beruang! Koleksi ke-6 karakter uniknya.', price: 89000, image: '/img/hero-home.png', is_new: true, is_bestseller: true, is_active: true, purchase_option: 'In Store' },
    { id: 16, category_slug: 'blind-box', name: 'Sweet Bakery Bear Mystery Box', description: 'Blind box seri tema kue dan roti beruang manis.', price: 95000, image: '/img/hero-home.png', is_new: false, is_bestseller: false, is_active: true, purchase_option: 'In Store' },
];

export default function MerchandisePage() {
    const [merchItems, setMerchItems] = useState<MerchandiseItem[]>(DEFAULT_MERCHANDISE_ITEMS);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayCount, setDisplayCount] = useState<number>(8);

    // Integrasi Backend
    useEffect(() => {
        async function fetchMerchandise() {
            try {
                setIsLoading(true);
                const res = await fetch('http://127.0.0.1:8000/api/merchandise', { cache: 'no-store' });
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.data && json.data.length > 0) {
                        setMerchItems(json.data);
                    }
                }
            } catch {
                console.log('Menggunakan fallback data lokal merchandise');
            } finally {
                setIsLoading(false);
            }
        }
        fetchMerchandise();
    }, []);

    // Filter Kategori & Sorting
    const filteredAndSortedItems = useMemo(() => {
        let result = merchItems.filter(item => {
            if (!item.is_active) return false;
            if (selectedCategory === 'all') return true;
            return item.category_slug.toLowerCase() === selectedCategory.toLowerCase();
        });

        if (sortBy === 'price-low') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result = [...result].sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        }

        return result;
    }, [merchItems, selectedCategory, sortBy]);

    const displayedItems = useMemo(() => {
        return filteredAndSortedItems.slice(0, displayCount);
    }, [filteredAndSortedItems, displayCount]);

    return (
        <div className="bg-[#faf6f0] min-h-screen pb-16 space-y-10 lg:space-y-14">

            {/* ================================================= */}
            {/* 1. HERO MERCHANDISE SECTION                      */}
            {/* ================================================= */}
            <section className="w-full relative min-h-[calc(100vh-5rem)] max-h-[750px] flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-20 pb-8 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Teks Kiri */}
                        <div className="lg:col-span-6 space-y-4 text-center lg:text-left order-2 lg:order-1">

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#8c5a3c] text-[10px] font-black border border-[#e6ccb2]/80">
                                <span>Official</span>
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#3d2314] tracking-tight leading-none">
                                To Meet<br />
                                Merchandise
                            </h1>

                            <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed max-w-md mx-auto lg:mx-0">
                                Take home your favorite bear and keep the memories close.
                                <Heart className="inline-block w-3.5 h-3.5 ml-1 text-[#e85a4f] fill-current" />
                            </p>

                            {/* 3 Values Kecil */}
                            <div className="pt-2 grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 text-center">
                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-1">
                                    <div className="w-7 h-7 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                        <BearFaceIcon className="w-4 h-4" />
                                    </div>
                                    <div className="text-[9px] font-black text-[#3d2314] uppercase leading-tight">Official</div>
                                    <div className="text-[8px] text-[#6c584c] font-semibold">To Meet Merchandise</div>
                                </div>

                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-1">
                                    <div className="w-7 h-7 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="text-[9px] font-black text-[#3d2314] uppercase leading-tight">Cute Designs</div>
                                    <div className="text-[8px] text-[#6c584c] font-semibold">You&apos;ll Love</div>
                                </div>

                                <div className="bg-[#fffcf7] p-2.5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-1">
                                    <div className="w-7 h-7 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                        <Gift className="w-4 h-4" />
                                    </div>
                                    <div className="text-[9px] font-black text-[#3d2314] uppercase leading-tight">Perfect for Gift</div>
                                    <div className="text-[8px] text-[#6c584c] font-semibold">& Collection</div>
                                </div>
                            </div>

                        </div>

                        {/* Visual Kanan */}
                        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-lg aspect-[4/3] lg:aspect-[16/11] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
                                <img
                                    src="/img/hero-home.png"
                                    alt="To Meet Official Merchandise"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. MAIN MERCHANDISE SECTION                       */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-4 sm:p-8 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* --------------------------------------------- */}
                        {/* SIDEBAR CATEGORIES (KIRI - INDEPENDENT SCROLL)*/}
                        {/* --------------------------------------------- */}
                        <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-24">

                            <div className="flex items-center justify-between pb-2 border-b border-[#e6ccb2]/60">
                                <h3 className="font-black text-sm text-[#3d2314] uppercase tracking-wider flex items-center gap-2">
                                    <span>CATEGORIES</span>
                                    <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                                </h3>
                            </div>

                            {/* Area Card Kategori yang Bisa Scroll Sendiri di Desktop */}
                            <div className="bg-[#faf6f0]/60 p-2 rounded-2xl border border-[#e6ccb2]/40">
                                <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[360px] pr-1 scrollbar-thin text-xs font-black uppercase tracking-wide">

                                    {CATEGORIES_LIST.map((cat) => {
                                        const isSelected = selectedCategory === cat.slug;
                                        return (
                                            <button
                                                key={cat.slug}
                                                onClick={() => setSelectedCategory(cat.slug)}
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition shrink-0 cursor-pointer text-left ${isSelected
                                                        ? 'bg-[#8c5a3c] text-white shadow-2xs font-extrabold'
                                                        : 'bg-white/80 text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c]'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <BearPawIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#8c5a3c]'}`} />
                                                    <span>{cat.name}</span>
                                                </span>
                                                {isSelected && <X className="w-3.5 h-3.5 hidden lg:block opacity-80" />}
                                            </button>
                                        );
                                    })}

                                </nav>
                            </div>

                            {/* Promotional WhatsApp Card */}
                            <div className="hidden lg:block bg-[#fdf3f1] p-5 rounded-3xl border border-rose-100 space-y-3 relative overflow-hidden">
                                <div className="space-y-1">
                                    <h4 className="font-extrabold text-xs text-[#3d2314]">Can&apos;t find what you&apos;re looking for?</h4>
                                </div>
                                <a
                                    href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20stok%20merchandise"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 bg-[#3d2314] hover:bg-[#201007] text-white font-black text-[10px] rounded-2xl flex items-center justify-center gap-1.5 transition uppercase tracking-wider cursor-pointer"
                                >
                                    <span>CHAT VIA WHATSAPP</span>
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                </a>
                                <p className="text-[10px] text-[#6c584c] font-semibold text-center">
                                    We&apos;re happy to help!
                                </p>
                            </div>

                        </aside>

                        {/* --------------------------------------------- */}
                        {/* PRODUCT GRID & SORTING (KANAN)                 */}
                        {/* --------------------------------------------- */}
                        <main className="lg:col-span-9 space-y-6">

                            {/* Header Grid */}
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                                <div className="flex items-center gap-2 text-base font-black text-[#3d2314] uppercase tracking-wide">
                                    <h2>ALL PRODUCTS</h2>
                                    <span className="text-xs font-semibold text-[#6c584c] lowercase">
                                        {filteredAndSortedItems.length} items
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="sortBy" className="text-xs font-extrabold text-[#6c584c] hidden sm:block">
                                        Sort by:
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="sortBy"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="bg-[#faf6f0] border border-[#e6ccb2]/80 rounded-xl px-3 py-1.5 text-xs text-[#3d2314] font-black focus:outline-none appearance-none pr-8 cursor-pointer"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="newest">Newest</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#8c5a3c] absolute right-2.5 top-2.5 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Status Loading */}
                            {isLoading && (
                                <div className="py-12 text-center text-xs font-black text-[#8c5a3c] uppercase tracking-wider">
                                    Memuat daftar produk merchandise...
                                </div>
                            )}

                            {/* Grid 4 Kolom Produk */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                {displayedItems.map((item) => (
                                    <MerchandiseProductCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Tombol Load More Products */}
                            {displayedItems.length < filteredAndSortedItems.length && (
                                <div className="pt-4 text-center">
                                    <button
                                        onClick={() => setDisplayCount(prev => prev + 4)}
                                        className="px-6 py-2.5 bg-[#f4ece1] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-black text-xs rounded-full border border-[#e6ccb2] transition uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
                <div className="bg-[#fffcf7] p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <BearFaceIcon className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">100% Official</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">To Meet Merchandise</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <Gift className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Great for Gift</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">and Collection</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314] uppercase">Quality You Can</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold">Trust</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <Heart className="w-5 h-5 text-[#e85a4f] fill-current" />
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
                <div className="bg-[#fdf3f1] p-6 sm:p-8 rounded-3xl border border-rose-100/80 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                    <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3d2314] tracking-tight leading-tight">
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
                                className="px-6 py-3 bg-[#3d2314] hover:bg-[#201007] text-white font-black text-xs rounded-full shadow-md transition duration-200 inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <span>CHAT VIA WHATSAPP</span>
                                <Phone className="w-3.5 h-3.5 fill-current" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex justify-center lg:justify-end gap-3">
                        <div className="w-28 h-36 bg-white p-2 rounded-2xl shadow-xs transform -rotate-3 hover:rotate-0 transition duration-200 text-[#3d2314] text-center flex flex-col justify-between border border-[#e6ccb2]">
                            <div className="w-full h-24 bg-[#faf6f0] rounded-xl flex items-center justify-center font-black text-[9px] text-[#8c5a3c]">
                                FOR YOU
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-wide">For You</span>
                        </div>

                        <div className="w-28 h-36 bg-white p-2 rounded-2xl shadow-xs transform rotate-3 hover:rotate-0 transition duration-200 text-[#3d2314] text-center flex flex-col justify-between border border-[#e6ccb2]">
                            <div className="w-full h-24 bg-[#f4ece1] rounded-xl flex items-center justify-center font-black text-[9px] text-[#8c5a3c]">
                                FRIEND
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-wide">For Your Friend</span>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}

// Komponen Kartu Produk Single Merchandise dengan Badge In Store
function MerchandiseProductCard({ item }: { item: MerchandiseItem }) {
    return (
        <div className="bg-[#faf6f0] rounded-3xl p-3 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-3 relative group hover:shadow-md transition duration-200">

            {/* Badges Status */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                {item.is_new && (
                    <span className="px-2.5 py-0.5 bg-[#e85a4f] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        NEW
                    </span>
                )}
                {item.is_bestseller && (
                    <span className="px-2.5 py-0.5 bg-[#d4a373] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        BEST SELLER
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
                    <Gift className="w-8 h-8 text-[#e6ccb2]" />
                )}
            </div>

            {/* Detail Teks & Opsi Pembelian */}
            <div className="space-y-1">
                <div className="flex items-center gap-1 text-[8px] font-black text-[#8c5a3c] uppercase tracking-wider">
                    <Store className="w-3 h-3" />
                    <span>{item.purchase_option || 'In Store'}</span>
                </div>
                <h4 className="font-black text-[#3d2314] text-xs leading-snug line-clamp-1">{item.name}</h4>
                <p className="text-[10px] text-[#6c584c] font-semibold line-clamp-2 leading-tight">
                    {item.description}
                </p>
            </div>

            {/* Harga & Tombol Order */}
            <div className="flex items-center justify-between pt-1 border-t border-[#e6ccb2]/40">
                <div className="font-black text-[#3d2314] text-xs">
                    Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </div>
                <button
                    title="Pesan via WhatsApp"
                    onClick={() => window.open(`https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20pesan%20merchandise%20${encodeURIComponent(item.name)}`, '_blank')}
                    className="w-7 h-7 rounded-full bg-[#f4ece1] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                </button>
            </div>

        </div>
    );
}