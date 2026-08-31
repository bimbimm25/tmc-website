'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, Clock, ArrowRight, Sparkles,
    Mail, Send, TrendingUp, BookOpen, AlertCircle, RefreshCw,
    ImageOff
} from 'lucide-react';

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

export interface PostItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_description?: string | null;
    meta_title?: string | null;
    image?: string | null;
    views?: number;
    created_at: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

export interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [featured, setFeatured] = useState<PostItem | null>(null);
    const [popular, setPopular] = useState<PostItem[]>([]);
    const [banner, setBanner] = useState<BannerItem | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [visibleCount, setVisibleCount] = useState<number>(6);

    async function fetchBlogData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const res = await fetch('http://127.0.0.1:8000/api/blog-data', { cache: 'no-store' });
            if (!res.ok) throw new Error('Gagal mengambil data blog');

            const json = await res.json();
            if (json && json.data) {
                setPosts(json.data.posts || []);
                setCategories(json.data.categories || []);
                setFeatured(json.data.featured || null);
                setPopular(json.data.popular || []);
                setBanner(json.data.banner || null);
            }
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogData();
    }, []);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchCat = selectedCategory === 'all' || post.category?.slug === selectedCategory;
            const matchSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.meta_description && post.meta_description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchCat && matchSearch;
        });
    }, [posts, selectedCategory, searchQuery]);

    const totalArticlesCount = posts.length;

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `http://127.0.0.1:8000/storage/${banner.image}`)
        : '/img/hero-home.png';

    const getImageUrl = (img?: string | null) => {
        if (!img || img.trim() === '') return null;
        if (img.startsWith('http') || img.startsWith('/img')) return img;
        return `http://127.0.0.1:8000/storage/${img}`;
    };

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="bg-[#faf6f0] min-h-screen space-y-10 sm:space-y-14 pb-16">

            {/* ================================================= */}
            {/* 1. HERO SECTION FULL 1 LAYAR (BLOG BANNER)        */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center bg-[#faf6f0] overflow-hidden">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Blog Showcase"
                        className="w-full h-full object-cover object-right lg:object-center"
                    />
                    {/* Gradient Overlay Sebelah Kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0] via-[#faf6f0]/85 to-transparent w-full sm:w-2/3 lg:w-1/2" />
                </div>

                {/* Konten Text Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div className="max-w-md lg:max-w-lg space-y-3 sm:space-y-3.5">

                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1]/90 text-[#8c5a3c] text-[9.5px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs backdrop-blur-xs">
                            <span>TO MEET STORIES & TIPS</span>
                            <Sparkles className="w-3 h-3 text-amber-500" />
                        </div>

                        {/* Title Proporsional */}
                        <h1 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-black text-[#3d2314] tracking-tight leading-[1.15] uppercase">
                            {renderFormattedText(
                                banner?.title,
                                <>
                                    TO MEET <br />
                                    <span className="text-[#8c5a3c]">BLOG & STORIES</span>
                                </>
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xs sm:text-[13px] text-[#5a4232] font-semibold leading-relaxed max-w-md">
                            {renderFormattedText(
                                banner?.subtitle,
                                'Cerita seru, resep lezat, info acara, dan update terbaru seputar dunia To Meet Cafe.'
                            )}
                        </p>

                        {/* Feature Badges Mini */}
                        <div className="pt-1 grid grid-cols-3 gap-2 max-w-sm text-center">
                            <div className="bg-[#fffcf7]/90 backdrop-blur-xs p-2 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-0.5">
                                <div className="text-[9.5px] font-black text-[#8c5a3c] uppercase">Cerita Cafe</div>
                                <div className="text-[8px] text-[#6c584c] font-semibold">Behind the scenes</div>
                            </div>
                            <div className="bg-[#fffcf7]/90 backdrop-blur-xs p-2 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-0.5">
                                <div className="text-[9.5px] font-black text-[#8c5a3c] uppercase">Menu & Resep</div>
                                <div className="text-[8px] text-[#6c584c] font-semibold">Inspirasi kuliner</div>
                            </div>
                            <div className="bg-[#fffcf7]/90 backdrop-blur-xs p-2 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs space-y-0.5">
                                <div className="text-[9.5px] font-black text-[#8c5a3c] uppercase">Aktivitas & Tips</div>
                                <div className="text-[8px] text-[#6c584c] font-semibold">Tips seru si kecil</div>
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                            <a
                                href="#articles"
                                className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[11px] rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <span>BACA ARTIKEL</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. MAIN BLOG CONTENT                              */}
            {/* ================================================= */}
            <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* KOLOM KIRI (FEATURED ARTICLE & LATEST POSTS) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* FEATURED ARTICLE (ARTIKEL PILIHAN UTAMA) */}
                        {featured && selectedCategory === 'all' && !searchQuery && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <h2 className="text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wider">
                                        FEATURED ARTICLE
                                    </h2>
                                </div>

                                <div className="bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-hidden hover:border-[#8c5a3c] transition duration-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 items-center">
                                        <div className="sm:col-span-6 aspect-16/10 sm:aspect-auto sm:h-full bg-[#fcf7f0] overflow-hidden flex items-center justify-center">
                                            {getImageUrl(featured.image) ? (
                                                <img
                                                    src={getImageUrl(featured.image)!}
                                                    alt={featured.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center p-6 space-y-1 text-[#a08a7b]">
                                                    <ImageOff className="w-7 h-7 opacity-60" />
                                                    <span className="text-[10px] font-black tracking-wider uppercase">Belum ada gambar</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="sm:col-span-6 p-5 sm:p-6 space-y-3">
                                            <span className="px-2.5 py-0.5 bg-[#f4ece1] text-[#8c5a3c] text-[9.5px] font-black uppercase rounded-md">
                                                {featured.category?.name || 'Cerita Cafe'}
                                            </span>

                                            <h3 className="text-base sm:text-lg font-black text-[#3d2314] leading-snug">
                                                <Link href={`/blog/${featured.slug}`} className="hover:text-[#8c5a3c] transition">
                                                    {featured.title}
                                                </Link>
                                            </h3>

                                            <p className="text-xs text-[#5a4232] font-semibold leading-relaxed line-clamp-2">
                                                {featured.meta_description || featured.content.slice(0, 120) + '...'}
                                            </p>

                                            <div className="pt-2 flex items-center justify-between border-t border-[#e6ccb2]/50 text-[11px] font-bold text-[#6c584c]">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                                    <span>{formatDate(featured.created_at)}</span>
                                                </div>

                                                <Link
                                                    href={`/blog/${featured.slug}`}
                                                    className="px-4 py-1.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-[10.5px] rounded-full shadow-2xs transition inline-flex items-center gap-1 uppercase tracking-wider"
                                                >
                                                    <span>READ MORE</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LATEST ARTICLES GRID */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <BearPawIcon className="w-4 h-4 text-[#8c5a3c]" />
                                    <h2 className="text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wider">
                                        LATEST ARTICLES
                                    </h2>
                                </div>
                                <span className="text-[11px] font-bold text-[#8c5a3c]">
                                    {filteredPosts.length} Artikel Ditemukan
                                </span>
                            </div>

                            {isLoading && (
                                <div className="py-16 text-center space-y-2 bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/60 p-6">
                                    <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs font-bold text-[#8c5a3c]">Memuat artikel...</p>
                                </div>
                            )}

                            {!isLoading && isError && (
                                <div className="py-12 text-center space-y-2.5 bg-[#faf6f0] rounded-3xl border border-rose-200 p-6">
                                    <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
                                    <h4 className="font-black text-xs text-[#3d2314]">Gagal Memuat Artikel</h4>
                                    <button
                                        onClick={fetchBlogData}
                                        className="px-4 py-1.5 bg-[#8c5a3c] text-white text-xs font-bold rounded-full cursor-pointer"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            )}

                            {!isLoading && !isError && filteredPosts.length === 0 && (
                                <div className="py-16 text-center space-y-2 bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/60 p-6">
                                    <BookOpen className="w-6 h-6 text-[#8c5a3c] mx-auto" />
                                    <h4 className="font-black text-sm text-[#3d2314]">Artikel Tidak Ditemukan</h4>
                                    <p className="text-xs text-[#6c584c]">Coba ubah kata kunci pencarian atau kategori filter.</p>
                                </div>
                            )}

                            {!isLoading && !isError && filteredPosts.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {filteredPosts.slice(0, visibleCount).map((post) => {
                                        const postImg = getImageUrl(post.image);

                                        return (
                                            <div
                                                key={post.id}
                                                className="bg-[#fffcf7] rounded-3xl border border-[#e6ccb2]/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#8c5a3c] transition duration-200 group"
                                            >
                                                <div>
                                                    <div className="relative w-full aspect-16/10 bg-[#fcf7f0] overflow-hidden flex items-center justify-center border-b border-[#e6ccb2]/40">
                                                        {postImg ? (
                                                            <img
                                                                src={postImg}
                                                                alt={post.title}
                                                                className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-[#a08a7b]">
                                                                <ImageOff className="w-5 h-5 opacity-60" />
                                                                <span className="text-[9px] font-black tracking-wider uppercase">Belum ada gambar</span>
                                                            </div>
                                                        )}

                                                        <div className="absolute top-2.5 left-2.5 bg-[#3d2314]/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider">
                                                            {post.category?.name || 'Blog'}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 space-y-1.5">
                                                        <h3 className="font-black text-xs sm:text-[13px] text-[#3d2314] leading-snug line-clamp-2">
                                                            <Link href={`/blog/${post.slug}`} className="hover:text-[#8c5a3c] transition">
                                                                {post.title}
                                                            </Link>
                                                        </h3>

                                                        <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed line-clamp-2">
                                                            {post.meta_description || post.content.slice(0, 80) + '...'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-4 pt-0 flex items-center justify-between border-t border-[#e6ccb2]/40 text-[10px] font-bold text-[#6c584c]">
                                                    <span>{formatDate(post.created_at)}</span>
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="w-6 h-6 rounded-full bg-[#f4ece1] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition"
                                                    >
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {filteredPosts.length > visibleCount && (
                                <div className="text-center pt-2">
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 6)}
                                        className="px-6 py-2.5 bg-white hover:bg-[#faf6f0] border border-[#e6ccb2] text-[#3d2314] font-black text-xs rounded-full shadow-2xs transition cursor-pointer uppercase tracking-wider"
                                    >
                                        LOAD MORE ARTICLES
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN (SIDEBAR: SEARCH, CATEGORIES, NEWSLETTER, POPULAR) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Search Input Box */}
                        <div className="bg-[#fffcf7] p-3 rounded-2xl border border-[#e6ccb2]/80 shadow-2xs">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full bg-[#faf6f0] border border-[#e6ccb2]/60 rounded-xl pl-9 pr-3 py-2 text-xs text-[#3d2314] font-semibold focus:outline-none focus:border-[#8c5a3c]"
                                />
                                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        {/* Categories Box */}
                        <div className="bg-[#fffcf7] p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-[#e6ccb2]/50 pb-2.5">
                                <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wider">
                                    CATEGORIES
                                </h3>
                                <BearPawIcon className="w-3.5 h-3.5 text-[#8c5a3c]" />
                            </div>

                            <div className="space-y-1 text-xs font-bold">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`w-full p-2 rounded-xl flex items-center justify-between transition cursor-pointer ${selectedCategory === 'all'
                                            ? 'bg-[#8c5a3c] text-white shadow-2xs'
                                            : 'text-[#5a4232] hover:bg-[#faf6f0]'
                                        }`}
                                >
                                    <span>All Articles</span>
                                    <span className="text-[10px] opacity-80">{totalArticlesCount}</span>
                                </button>

                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`w-full p-2 rounded-xl flex items-center justify-between transition cursor-pointer ${selectedCategory === cat.slug
                                                ? 'bg-[#8c5a3c] text-white shadow-2xs'
                                                : 'text-[#5a4232] hover:bg-[#faf6f0]'
                                            }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-[10px] opacity-80">{cat.posts_count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Popular Articles Box */}
                        <div className="bg-[#fffcf7] p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-[#e6ccb2]/50 pb-2.5">
                                <TrendingUp className="w-4 h-4 text-[#8c5a3c]" />
                                <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wider">
                                    POPULAR ARTICLES
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {popular.map((pop, idx) => (
                                    <div key={pop.id} className="flex items-start gap-3 group">
                                        <div className="w-6 h-6 rounded-full bg-[#f4ece1] text-[#8c5a3c] font-black text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <h4 className="font-bold text-xs text-[#3d2314] leading-snug group-hover:text-[#8c5a3c] transition truncate">
                                                <Link href={`/blog/${pop.slug}`}>
                                                    {pop.title}
                                                </Link>
                                            </h4>
                                            <div className="text-[9.5px] text-stone-400 font-semibold">
                                                {formatDate(pop.created_at)} • {pop.views || 0} views
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 3. BOTTOM CTA: GOT A SWEET STORY IDEA?            */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-5 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center shrink-0 shadow-2xs">
                            <BearFaceIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-sm sm:text-base text-[#3d2314]">
                                Got a sweet story idea?
                            </h3>
                            <p className="text-xs text-[#6c584c] font-semibold mt-0.5">
                                Kami senang mendengar ide cerita, kolaborasi, dan pengalaman manismu di To Meet Cafe!
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20punya%20ide%20cerita/kolaborasi%20untuk%20blog"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-full shadow-md shadow-[#8c5a3c]/15 transition inline-flex items-center gap-1.5 uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                        <span>CONTACT US</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </section>

        </div>
    );
}