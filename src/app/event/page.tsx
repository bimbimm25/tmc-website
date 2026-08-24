'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar, Clock, Sparkles, Heart,
    Phone, Users, CheckCircle2, ArrowRight,
    Gift, Palette, Smile, AlertCircle, RefreshCw, Info, ImageOff, MapPin, X
} from 'lucide-react';

function BearPawIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5.7 2.5 1.6 2.5z" />
        </svg>
    );
}

export interface EventItem {
    id: number;
    title: string;
    category?: string;
    type?: string;
    description: string;
    duration?: string;
    capacity?: number | string | null;
    event_date?: string | null;
    location_name?: string | null;
    price: number;
    image?: string | null;
    is_popular?: boolean | number;
    is_active?: boolean | number;
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

// Helper Komponen: Render Teks yang Mendukung List (- / •) dan Enter (<br> / \n)
function FormatDescription({ text }: { text?: string | null }) {
    if (!text) return <span>Aktivitas seru dan edukatif di To Meet Cafe.</span>;

    // Normalisasi tag <br> menjadi baris baru
    const cleanText = text.replace(/<br\s*\/?>/gi, '\n');
    const lines = cleanText.split('\n');

    return (
        <div className="space-y-1 text-left">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                // Cek apakah baris diawali tanda minus (-), bintang (*), atau bullet (•)
                if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
                    const content = trimmed.replace(/^[-*•]\s*/, '');
                    return (
                        <div key={idx} className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-[#6c584c]">
                            <span className="text-[#8c5a3c] font-black leading-none mt-0.5">•</span>
                            <span className="font-semibold">{content}</span>
                        </div>
                    );
                }

                // Baris teks reguler
                return (
                    <p key={idx} className="text-[10.5px] leading-relaxed text-[#6c584c] font-semibold">
                        {trimmed}
                    </p>
                );
            })}
        </div>
    );
}

// Helper Komponen: Format Teks Banner dengan Dukungan <br>
function FormatTextWithBreak({ text }: { text?: string | null }) {
    if (!text) return null;
    const lines = text.split(/<br\s*\/?>|\n/gi);
    return (
        <>
            {lines.map((line, index) => (
                <span key={index}>
                    {line}
                    {index < lines.length - 1 && <br />}
                </span>
            ))}
        </>
    );
}

export default function EventPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [eventBanner, setEventBanner] = useState<BannerItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    async function fetchEventPageData() {
        try {
            setIsLoading(true);
            setIsError(false);

            const [resEvents, resBanner] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/events', { cache: 'no-store' }),
                fetch('http://127.0.0.1:8000/api/banners/event', { cache: 'no-store' }).catch(() => null)
            ]);

            if (!resEvents.ok) {
                throw new Error('Gagal mengambil data event');
            }

            const jsonEvents = await resEvents.json();
            if (jsonEvents && Array.isArray(jsonEvents.data)) {
                // Filter hanya data event & workshop (kecualikan birthday)
                const filtered = jsonEvents.data.filter((item: EventItem) => {
                    const type = (item.type || '').toLowerCase();
                    const cat = (item.category || '').toLowerCase();
                    return !type.includes('birthday') && !cat.includes('birthday');
                });
                setEvents(filtered);
            } else {
                setEvents([]);
            }

            if (resBanner && resBanner.ok) {
                const jsonBanner = await resBanner.json();
                setEventBanner(jsonBanner.data || null);
            }
        } catch (err) {
            console.error('Gagal mengambil data event dari API:', err);
            setIsError(true);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchEventPageData();
    }, []);

    // Mengumpulkan kategori unik secara dinamis dari produk admin
    const availableCategories = useMemo(() => {
        if (events.length === 0) return ['all'];
        const unique = Array.from(new Set(
            events.map(item => item.category || (item.type === 'event_workshop' ? 'Workshop' : 'Event')).filter(Boolean)
        )) as string[];
        return ['all', ...unique];
    }, [events]);

    // Filter daftar event berdasarkan tab kategori terpilih
    const filteredEvents = useMemo(() => {
        return events.filter((item) => {
            if (item.is_active === false) return false;
            if (selectedCategory === 'all') return true;

            const cat = (item.category || (item.type === 'event_workshop' ? 'Workshop' : 'Event')).toLowerCase();
            return cat === selectedCategory.toLowerCase();
        });
    }, [events, selectedCategory]);

    const heroImageSrc = eventBanner?.image
        ? (eventBanner.image.startsWith('http')
            ? eventBanner.image
            : eventBanner.image.startsWith('/img')
                ? eventBanner.image
                : `http://127.0.0.1:8000/storage/${eventBanner.image}`)
        : '/img/hero-home.png';

    return (
        <div className="bg-[#faf6f0] min-h-screen pb-12 space-y-6 sm:space-y-8">

            {/* ================================================= */}
            {/* 1. HERO SECTION (DINAMIS DARI DASHBOARD ADMIN)    */}
            {/* ================================================= */}
            <section className="w-full relative h-[100dvh] lg:h-screen lg:max-h-[720px] flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                        {/* Kolom Kiri: Teks & CTA */}
                        <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-center lg:text-left order-2 lg:order-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#8c5a3c] text-[10px] font-black tracking-wider uppercase border border-[#e6ccb2]/80">
                                <span>CREATE. PLAY. MAKE MEMORIES.</span>
                                <BearPawIcon className="w-3 h-3" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                {eventBanner?.title ? (
                                    <FormatTextWithBreak text={eventBanner.title} />
                                ) : (
                                    'EVENT & WORKSHOP'
                                )}
                            </h1>

                            <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed max-w-md mx-auto lg:mx-0">
                                {eventBanner?.subtitle ? (
                                    <FormatTextWithBreak text={eventBanner.subtitle} />
                                ) : (
                                    'Ikuti berbagai kelas seni edukatif, workshop kreasi seru, dan aktivitas akhir pekan menyenangkan di To Meet Cafe.'
                                )}
                            </p>

                            <div className="pt-1 flex justify-center lg:justify-start">
                                <a
                                    href={eventBanner?.cta_link || "https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20booking%20event%20dan%20workshop"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                                >
                                    <span>{eventBanner?.cta_text || 'BOOK VIA WHATSAPP'}</span>
                                    <Phone className="w-3.5 h-3.5 fill-current" />
                                </a>
                            </div>
                        </div>

                        {/* Kolom Kanan: Foto Hero Banner Dinamis */}
                        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-[2rem] overflow-hidden shadow-lg border-3 border-white">
                                <img
                                    src={heroImageSrc}
                                    alt="To Meet Event & Workshop Activities"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. DAFTAR EVENT & WORKSHOP                        */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-4 sm:p-6 lg:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5">

                    {/* Header & Filter Tabs Dinamis */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#e6ccb2]/50 pb-3">
                        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wide">
                            <BearPawIcon className="w-3.5 h-3.5 text-[#8c5a3c]" />
                            <h2>WHAT&apos;S HAPPENING</h2>
                        </div>

                        {/* Filter Tabs Dinamis */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                            {availableCategories.map((cat) => {
                                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-black transition tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5 uppercase ${isSelected
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-[#faf6f0] text-[#6c584c] hover:bg-[#f4ece1] border border-[#e6ccb2]/60'
                                            }`}
                                    >
                                        <Palette className="w-3 h-3" />
                                        <span>{cat === 'all' ? 'ALL ACTIVITIES' : cat}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="py-12 text-center space-y-2">
                            <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                Memuat kegiatan...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {!isLoading && isError && (
                        <div className="py-8 text-center space-y-2.5 bg-[#faf6f0] rounded-2xl border border-rose-200 p-5">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Gagal Memuat Data</h4>
                            <p className="text-[11px] text-[#6c584c] font-semibold max-w-xs mx-auto">
                                Pastikan server backend Laravel sudah berjalan.
                            </p>
                            <button
                                onClick={fetchEventPageData}
                                className="px-3.5 py-1.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-bold text-[10px] rounded-full transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <RefreshCw className="w-3 h-3" />
                                <span>Coba Lagi</span>
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && filteredEvents.length === 0 && (
                        <div className="py-12 text-center space-y-1.5 bg-[#faf6f0] rounded-2xl border border-[#e6ccb2]/60 p-5">
                            <div className="w-9 h-9 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                <Info className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-xs text-[#3d2314]">Belum Ada Kegiatan</h4>
                            <p className="text-[10px] text-[#6c584c] font-semibold max-w-xs mx-auto">
                                Belum ada aktivitas yang ditambahkan pada kategori ini.
                            </p>
                        </div>
                    )}

                    {/* Grid Event Cards */}
                    {!isLoading && !isError && filteredEvents.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                            {filteredEvents.map((item) => {
                                const isPopular = Boolean(item.is_popular);
                                const hasImage = Boolean(item.image && item.image.trim() !== '');
                                const imageSrc = hasImage
                                    ? (item.image!.startsWith('http') ? item.image! : (item.image!.startsWith('/img') ? item.image! : `http://127.0.0.1:8000/storage/${item.image}`))
                                    : null;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedEvent(item)}
                                        className="bg-[#faf6f0] rounded-2xl p-3 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-2.5 relative group hover:shadow-md hover:border-[#8c5a3c] transition duration-200 cursor-pointer"
                                    >

                                        {isPopular && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                                                    POPULAR
                                                </span>
                                            </div>
                                        )}

                                        {/* Poster Visual */}
                                        <div className="w-full aspect-[16/10] bg-white rounded-xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center p-3 space-y-1 text-[#a08a7b]">
                                                    <ImageOff className="w-5 h-5 opacity-60" />
                                                    <span className="text-[9px] font-bold tracking-wider uppercase">Belum ada poster</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Detail Teks & List Deskripsi */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                                    {item.category || item.type || 'WORKSHOP'}
                                                </span>
                                                {item.location_name && (
                                                    <span className="text-[8px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                                        {item.location_name}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-black text-[#3d2314] text-xs sm:text-sm leading-snug line-clamp-1">
                                                {item.title}
                                            </h3>

                                            {/* Render Deskripsi Cerdas (List Bullet & Enter) */}
                                            <div className="line-clamp-3 pt-0.5">
                                                <FormatDescription text={item.description} />
                                            </div>
                                        </div>

                                        {/* Footer Card */}
                                        <div className="space-y-2 pt-1.5 border-t border-[#e6ccb2]/40">
                                            <div className="flex items-center justify-between text-[10px] font-black text-[#8c5a3c]">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-[#8c5a3c]" />
                                                    <span>{item.duration || (item.capacity ? `${item.capacity} Pax` : '60 MIN')}</span>
                                                </div>
                                                <div className="text-[#3d2314] text-xs font-black">
                                                    Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(`https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20booking%20kegiatan%20${encodeURIComponent(item.title)}`, '_blank');
                                                }}
                                                className="w-full py-2 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-[10px] rounded-xl text-center transition flex items-center justify-center gap-1.5 uppercase shadow-2xs tracking-wider cursor-pointer"
                                            >
                                                <span>BOOK NOW</span>
                                                <Phone className="w-3 h-3 fill-current" />
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </section>

            {/* ================================================= */}
            {/* 3. MODAL DETAIL POPUP EVENT & WORKSHOP            */}
            {/* ================================================= */}
            {selectedEvent && (
                <div
                    onClick={() => setSelectedEvent(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#fffcf7] w-full max-w-lg rounded-3xl p-5 sm:p-6 border border-[#e6ccb2] shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#f4ece1] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-full aspect-[16/10] bg-white rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center">
                            {selectedEvent.image ? (
                                <img
                                    src={
                                        selectedEvent.image.startsWith('http')
                                            ? selectedEvent.image
                                            : selectedEvent.image.startsWith('/img')
                                                ? selectedEvent.image
                                                : `http://127.0.0.1:8000/storage/${selectedEvent.image}`
                                    }
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Calendar className="w-12 h-12 text-[#e6ccb2]" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                    {selectedEvent.category || selectedEvent.type || 'WORKSHOP'}
                                </span>
                                <span className="px-2 py-0.5 bg-[#f4ece1] text-[#8c5a3c] text-[9px] font-black uppercase rounded-md">
                                    {selectedEvent.location_name || 'Semua Lokasi'}
                                </span>
                            </div>

                            <h3 className="font-black text-[#3d2314] text-lg sm:text-xl leading-tight">
                                {selectedEvent.title}
                            </h3>

                            {/* Render Full Deskripsi & List Fasilitas */}
                            <div className="py-2 border-y border-[#e6ccb2]/40 space-y-1.5">
                                <span className="text-[10px] font-black text-[#3d2314] uppercase block">
                                    Fasilitas & Detail Acara:
                                </span>
                                <FormatDescription text={selectedEvent.description} />
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-[#8c5a3c] block">Biaya / Tiket</span>
                                <span className="font-black text-[#3d2314] text-base sm:text-lg">
                                    Rp {new Intl.NumberFormat('id-ID').format(selectedEvent.price)}
                                </span>
                            </div>

                            <a
                                href={`https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20booking%20kegiatan%20${encodeURIComponent(selectedEvent.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-full transition flex items-center gap-1.5 uppercase shadow-xs"
                            >
                                <Phone className="w-3.5 h-3.5 fill-current" />
                                <span>BOOK VIA WA</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* 4. EASY BOOKING STEPS                             */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fdf3f1] p-4 sm:p-6 lg:p-7 rounded-3xl border border-rose-100/80 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    <div className="lg:col-span-4 space-y-2 text-center lg:text-left">
                        <div className="text-[9px] font-black text-[#8c5a3c] tracking-widest uppercase">
                            EASY BOOKING
                        </div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                            Book Your<br />Fun Activity Now!
                        </h2>
                        <p className="text-[11px] text-[#6c584c] font-semibold leading-relaxed">
                            Pilih workshop favoritmu dan konfirmasi jadwal langsung melalui WhatsApp.
                        </p>
                        <div className="pt-1">
                            <a
                                href="https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20booking%20activity"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 bg-[#3d2314] hover:bg-[#201007] text-white font-black text-[11px] rounded-full shadow-xs transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <span>BOOK VIA WHATSAPP</span>
                                <Phone className="w-3 h-3 fill-current" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div className="bg-white/80 p-3 rounded-2xl border border-rose-100/80 text-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center mx-auto">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div className="font-black text-[#8c5a3c] text-[10px]">1</div>
                            <div className="font-bold text-[10px] sm:text-[11px] text-[#3d2314]">Pilih Acara</div>
                        </div>

                        <div className="bg-white/80 p-3 rounded-2xl border border-rose-100/80 text-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-emerald-600 flex items-center justify-center mx-auto">
                                <Phone className="w-4 h-4 fill-current" />
                            </div>
                            <div className="font-black text-[#8c5a3c] text-[10px]">2</div>
                            <div className="font-bold text-[10px] sm:text-[11px] text-[#3d2314]">Chat Admin</div>
                        </div>

                        <div className="bg-white/80 p-3 rounded-2xl border border-rose-100/80 text-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-emerald-600 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="font-black text-[#8c5a3c] text-[10px]">3</div>
                            <div className="font-bold text-[10px] sm:text-[11px] text-[#3d2314]">Konfirmasi</div>
                        </div>

                        <div className="bg-white/80 p-3 rounded-2xl border border-rose-100/80 text-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                <Gift className="w-4 h-4" />
                            </div>
                            <div className="font-black text-[#8c5a3c] text-[10px]">4</div>
                            <div className="font-bold text-[10px] sm:text-[11px] text-[#3d2314]">Have Fun!</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. BENEFITS SECTION                               */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#fffcf7] p-4 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <Smile className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-[11px] text-[#3d2314] uppercase">All Ages Welcome</h4>
                            <p className="text-[9px] text-[#6c584c] font-semibold">Fun activities for all</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <Palette className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-[11px] text-[#3d2314] uppercase">Materials Provided</h4>
                            <p className="text-[9px] text-[#6c584c] font-semibold">Safe & non-toxic</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                            <h4 className="font-black text-[11px] text-[#3d2314] uppercase">Small Groups</h4>
                            <p className="text-[9px] text-[#6c584c] font-semibold">Engaging & cozy</p>
                        </div>

                        <div className="flex flex-col items-center space-y-1">
                            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center">
                                <Heart className="w-4 h-4 text-[#e85a4f] fill-current" />
                            </div>
                            <h4 className="font-black text-[11px] text-[#3d2314] uppercase">Sweet Memories</h4>
                            <p className="text-[9px] text-[#6c584c] font-semibold">Precious moments</p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}