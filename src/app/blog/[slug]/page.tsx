'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
    Clock, ArrowLeft, Eye, ChevronRight,
    AlertCircle, ImageOff
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface SinglePost {
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

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [post, setPost] = useState<SinglePost | null>(null);
    const [related, setRelated] = useState<SinglePost[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    // KUNCI UTAMA: Ref ini mencegah pemanggilan ganda oleh React StrictMode di Localhost
    const hasFetchedRef = useRef(false);

    async function fetchPostDetail(slug: string) {
        try {
            setIsLoading(true);
            setIsError(false);

            const res = await fetch(`${API_BASE_URL}/api/blog/${slug}`, { 
                cache: 'no-store' 
            });
            
            if (!res.ok) throw new Error('Artikel tidak ditemukan');

            const json = await res.json();
            if (json && json.data) {
                setPost(json.data.post);
                setRelated(json.data.related || []);
            }
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // Jika sudah pernah fetch untuk slug ini dalam siklus render saat ini, abaikan panggilan ke-2
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        fetchPostDetail(resolvedParams.slug);
    }, [resolvedParams.slug]);

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const getImageUrl = (img?: string | null) => {
        if (!img || img.trim() === '') return null;
        if (img.startsWith('http') || img.startsWith('/img')) return img;
        return `${API_BASE_URL}/storage/${img}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-3 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-[#8c5a3c]">Memuat isi artikel...</p>
                </div>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 px-4">
                <div className="bg-white p-8 rounded-3xl border border-[#e6ccb2] text-center max-w-md space-y-4 shadow-sm">
                    <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                    <h2 className="text-lg font-black text-[#3d2314]">Artikel Tidak Ditemukan</h2>
                    <p className="text-xs text-[#6c584c]">Mungkin artikel ini telah dipindahkan atau dinonaktifkan.</p>
                    <Link
                        href="/blog"
                        className="px-5 py-2.5 bg-[#8c5a3c] text-white text-xs font-bold rounded-full inline-block"
                    >
                        Kembali ke Blog
                    </Link>
                </div>
            </div>
        );
    }

    const coverImageUrl = getImageUrl(post.image);

    return (
        <div className="min-h-screen pt-24 sm:pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#8c5a3c]">
                    <Link href="/blog" className="flex items-center gap-1 hover:underline">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Blog</span>
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-[#3d2314] truncate">{post.title}</span>
                </div>

                {/* Post Header */}
                <div className="space-y-3">
                    <span className="px-3 py-1 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] font-black uppercase rounded-lg">
                        {post.category?.name || 'Cerita Cafe'}
                    </span>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3d2314] tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-xs text-[#6c584c] font-semibold border-b border-[#e6ccb2]/60 pb-4">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#8c5a3c]" />
                            <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-[#8c5a3c]" />
                            <span>{post.views || 0} Pembaca</span>
                        </div>
                    </div>
                </div>

                {/* Cover Image Container */}
                <div className="w-full aspect-16/10 rounded-3xl overflow-hidden border-2 border-white shadow-md bg-[#FAF0E6]/50 flex items-center justify-center">
                    {coverImageUrl ? (
                        <img
                            src={coverImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 space-y-2 text-[#a08a7b]">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-[#e6ccb2]/60 shadow-2xs">
                                <ImageOff className="w-7 h-7 text-[#8c5a3c] opacity-60" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-[#3d2314]">
                                Gambar Belum Tersedia
                            </span>
                            <p className="text-[11px] font-semibold text-[#6c584c]">
                                Artikel ini tidak memiliki foto sampul
                            </p>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4 text-xs sm:text-sm text-[#3d2314] leading-relaxed font-sans whitespace-pre-line">
                    {post.content}
                </div>

                {/* Related Articles */}
                {related.length > 0 && (
                    <div className="pt-6 space-y-4">
                        <h3 className="font-black text-sm text-[#3d2314] uppercase tracking-wider">
                            ARTIKEL LAINNYA
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {related.map((rel) => {
                                const relImgUrl = getImageUrl(rel.image);

                                return (
                                    <Link
                                        key={rel.id}
                                        href={`/blog/${rel.slug}`}
                                        prefetch={false}
                                        className="bg-white p-3 rounded-2xl border border-[#e6ccb2]/70 space-y-2 block hover:border-[#8c5a3c] transition shadow-2xs group"
                                    >
                                        <div className="w-full aspect-16/10 rounded-xl overflow-hidden bg-[#FAF0E6]/50 flex items-center justify-center border border-[#e6ccb2]/40">
                                            {relImgUrl ? (
                                                <img
                                                    src={relImgUrl}
                                                    alt={rel.title}
                                                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center p-3 space-y-1 text-[#a08a7b]">
                                                    <ImageOff className="w-5 h-5 opacity-60" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider">
                                                        Tidak ada gambar
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-black text-xs text-[#3d2314] line-clamp-2 leading-snug group-hover:text-[#8c5a3c] transition">
                                            {rel.title}
                                        </h4>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}