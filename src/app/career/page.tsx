'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
    Briefcase, MapPin, DollarSign, Clock, ArrowRight,
    Sparkles, Heart, Smile, Users, Award, ShieldCheck,
    Coffee, GraduationCap, PartyPopper, CheckCircle2,
    Send, X, Quote, ChevronRight, AlertCircle, Compass,
    FileText, Gift, Check, Building, Mail, ChevronDown, ChevronLeft,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Cache in-memory level modul agar saat navigasi page langsung instan tanpa glitch
let cachedCareerBanner: BannerItem | null = null;
let cachedCareerList: CareerItem[] | null = null;

function BearFaceIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a3 3 0 100-6 3 3 0 000 6zm16 0a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    );
}

function BearPawIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5.7 2.5 1.6 2.5z" />
        </svg>
    );
}

// Ornamen Pemisah Section yang Bersih & Berkarakter
function SectionDivider() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-center gap-3">
            <div className="h-px bg-gradient-to-r from-transparent via-[#e6ccb2]/70 to-[#e6ccb2]/30 flex-1 max-w-xs" />
            <div className="flex items-center gap-1.5 text-[#8c5a3c]/40">
                <BearPawIcon className="w-3.5 h-3.5" />
            </div>
            <div className="h-px bg-gradient-to-l from-transparent via-[#e6ccb2]/70 to-[#e6ccb2]/30 flex-1 max-w-xs" />
        </div>
    );
}

function formatLocationName(loc?: any): { label: string; badgeColor: string } {
    if (!loc) {
        return {
            label: 'SEMUA LOKASI',
            badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300'
        };
    }

    let rawStr = '';
    if (typeof loc === 'object') {
        rawStr = loc.name || loc.title || loc.label || loc.location || '';
    } else {
        rawStr = String(loc);
    }

    const normalized = rawStr.toLowerCase().replace(/[-_]/g, ' ').trim();

    if (normalized.includes('central kitchen') || normalized.includes('central')) {
        return {
            label: 'CENTRAL KITCHEN',
            badgeColor: 'bg-orange-50 text-orange-800 border-orange-300'
        };
    }

    if (normalized.includes('office') || normalized.includes('kantor')) {
        return {
            label: 'OFFICE TO MEET CAFE',
            badgeColor: 'bg-blue-50 text-blue-800 border-blue-300'
        };
    }

    if (normalized.includes('mutiara') || normalized.includes('pondok')) {
        return {
            label: 'PONDOK MUTIARA',
            badgeColor: 'bg-amber-50 text-amber-800 border-amber-300'
        };
    }

    if (normalized.includes('heavenland') || normalized.includes('heaven')) {
        return {
            label: 'HEAVENLAND PARK',
            badgeColor: 'bg-rose-50 text-rose-700 border-rose-300'
        };
    }

    if (normalized.includes('semua') || normalized === 'all' || normalized === '') {
        return {
            label: 'SEMUA LOKASI',
            badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300'
        };
    }

    return {
        label: rawStr.toUpperCase(),
        badgeColor: 'bg-[#FAF0E6] text-[#8c5a3c] border-[#e6ccb2]'
    };
}

function FormatRichContent({ text, maxItems }: { text?: string | null; maxItems?: number }) {
    if (!text || text.trim() === '') {
        return <p className="text-xs text-[#6c584c] italic">Informasi belum ditambahkan.</p>;
    }

    const cleanText = text.replace(/<br\s*\/?>/gi, '\n');
    const allLines = cleanText.split('\n').filter(line => line.trim() !== '');

    const lines = maxItems ? allLines.slice(0, maxItems) : allLines;
    const hasMore = maxItems ? allLines.length > maxItems : false;

    return (
        <div className="space-y-1.5 text-left">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                const content = trimmed.replace(/^[-*•\d+.]\s*/, '');

                return (
                    <div key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8c5a3c] shrink-0 mt-[6px]" />
                        <span className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                            {content}
                        </span>
                    </div>
                );
            })}

            {hasMore && (
                <p className="text-[10px] font-bold text-[#8c5a3c] italic pt-0.5">
                    + dan lainnya (lihat detail)
                </p>
            )}
        </div>
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

export interface CareerItem {
    id: number;
    title: string;
    department?: string;
    location: string;
    branch?: string;
    location_name?: string;
    type: string;
    salary_range?: string;
    description?: string;
    requirements?: string;
    benefits?: string;
    is_active: boolean;
}

export interface BannerItem {
    id: number;
    title?: string | null;
    subtitle?: string | null;
    image?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
}

export default function CareerPage() {
    const [careers, setCareers] = useState<CareerItem[]>(() => cachedCareerList || []);
    const [banner, setBanner] = useState<BannerItem | null>(() => cachedCareerBanner);
    const [isBannerChecked, setIsBannerChecked] = useState<boolean>(() => cachedCareerBanner !== null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
    const [detailJob, setDetailJob] = useState<CareerItem | null>(null);
    const [selectedJob, setSelectedJob] = useState<CareerItem | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formError, setFormError] = useState('');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const openPositionsRef = useRef<HTMLDivElement>(null);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

    // Slide Mobile
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleScrollMobile = () => {
        if (!sliderRef.current) return;
        const container = sliderRef.current;
        const index = Math.round(container.scrollLeft / container.clientWidth);
        setCurrentSlideIndex(index);
    };

    const scrollToSlide = (index: number) => {
        if (!sliderRef.current) return;
        const container = sliderRef.current;
        container.scrollTo({
            left: index * container.clientWidth,
            behavior: 'smooth'
        });
        setCurrentSlideIndex(index);
    };

    // Body Scroll Lock saat modal terbuka
    useEffect(() => {
        const isModalActive = Boolean(isApplyModalOpen || detailJob);

        if (isModalActive) {
            const originalHtmlOverflow = document.documentElement.style.overflow;
            const originalBodyOverflow = document.body.style.overflow;

            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            const preventScroll = (e: TouchEvent | WheelEvent) => {
                const target = e.target as HTMLElement;
                const modalApply = document.getElementById('career-apply-modal-card');
                const modalDetail = document.getElementById('career-detail-modal-card');

                if ((modalApply && modalApply.contains(target)) || (modalDetail && modalDetail.contains(target))) {
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
        }
    }, [isApplyModalOpen, detailJob]);

    async function fetchCareerData() {
        try {
            setIsLoading(true);
            const [bannerRes, careersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/banners/career`, { cache: 'default' }),
                fetch(`${API_BASE_URL}/api/careers`, { cache: 'no-store' })
            ]);

            if (bannerRes.ok) {
                const bJson = await bannerRes.json();
                if (bJson?.data) {
                    cachedCareerBanner = bJson.data;
                    setBanner(bJson.data);
                }
            }

            if (careersRes.ok) {
                const cJson = await careersRes.json();
                if (cJson?.data) {
                    cachedCareerList = cJson.data;
                    setCareers(cJson.data);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsBannerChecked(true);
        }
    }

    useEffect(() => {
        fetchCareerData();
    }, []);

    const filteredCareers = useMemo(() => {
        return careers.filter((job) => {
            if (!job.is_active) return false;
            if (selectedLocationFilter === 'all') return true;

            const rawLocation = String(job.location_name || job.location || job.branch || '').toLowerCase().replace(/[-_]/g, ' ');

            if (rawLocation.includes('semua') || rawLocation === 'all' || rawLocation === '') {
                return true;
            }

            if (selectedLocationFilter === 'central_kitchen') {
                return rawLocation.includes('central kitchen') || rawLocation.includes('central');
            }

            if (selectedLocationFilter === 'office') {
                return rawLocation.includes('office') || rawLocation.includes('kantor');
            }

            if (selectedLocationFilter === 'mutiara') {
                return rawLocation.includes('mutiara') || rawLocation.includes('pondok');
            }

            if (selectedLocationFilter === 'heavenland') {
                return rawLocation.includes('heavenland') || rawLocation.includes('heaven');
            }

            return true;
        });
    }, [careers, selectedLocationFilter]);

    const scrollToPositions = () => {
        openPositionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleOpenApply = (job: CareerItem) => {
        setDetailJob(null);
        setSelectedJob(job);
        setFormError('');
        setSubmitSuccess(false);
        setIsApplyModalOpen(true);
    };

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !resumeFile) {
            setFormError('Harap lampirkan berkas CV / Resume Anda.');
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError('');

            const formData = new FormData();
            formData.append('career_id', selectedJob.id.toString());
            formData.append('full_name', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('cover_letter', coverLetter);
            formData.append('resume', resumeFile);

            const res = await fetch(`${API_BASE_URL}/api/careers/apply`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Gagal mengirim lamaran.');

            setSubmitSuccess(true);
            setTimeout(() => {
                setIsApplyModalOpen(false);
                setFullName('');
                setEmail('');
                setPhone('');
                setCoverLetter('');
                setResumeFile(null);
                setSubmitSuccess(false);
            }, 2500);
        } catch (err: any) {
            setFormError(err.message || 'Terjadi kesalahan sistem saat mengirim form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const heroImage = useMemo(() => {
        if (banner?.image) {
            return banner.image.startsWith('http')
                ? banner.image
                : banner.image.startsWith('/img')
                    ? banner.image
                    : `${API_BASE_URL}/storage/${banner.image}`;
        }
        return isBannerChecked ? '/img/hero-home.png' : '';
    }, [banner, isBannerChecked]);

    return (
        <div className="min-h-screen space-y-0 pb-12 sm:pb-16 bg-[#faf6f0]/30">

            {/* ================================================= */}
            {/* 1. HERO SECTION                                   */}
            {/* ================================================= */}
            <section
                className={`relative w-full h-screen min-h-dvh flex items-center overflow-hidden border-b border-[#e6ccb2]/60 transition-colors duration-500 ${heroImage ? 'bg-transparent' : 'bg-[#FAF0E6]/30'
                    }`}
            >
                <div className="absolute inset-0 z-0">
                    {heroImage && (
                        <img
                            src={heroImage}
                            alt="To Meet Cafe Career"
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            onLoad={(e) => {
                                (e.currentTarget as HTMLElement).classList.remove('opacity-0');
                                (e.currentTarget as HTMLElement).classList.add('opacity-100');
                            }}
                            className="w-full h-full object-cover object-[75%_center] lg:object-center opacity-0 transition-opacity duration-700 ease-out"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-white via-white/85 to-transparent w-120 sm:w-2/3 lg:w-1/2 pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div
                        className={`w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-3 sm:space-y-4 text-left transition-all duration-700 ease-out ${isBannerChecked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                            }`}
                    >
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#8c5a3c] text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
                                <span>CAREER OPPORTUNITIES</span>
                                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3d2314] tracking-tight leading-[1.08] uppercase">
                            {banner?.title ? (
                                renderFormattedText(banner.title)
                            ) : isBannerChecked ? (
                                <>
                                    GROW TOGETHER <br />
                                    CREATE HAPPINESS <br />
                                    <span className="text-[#8c5a3c]">TOGETHER</span>
                                </>
                            ) : null}
                        </h1>

                        <p className="text-xs sm:text-[15px] text-[#5a4232] font-semibold leading-relaxed max-w-65 sm:max-w-md">
                            {banner?.subtitle ? (
                                renderFormattedText(banner.subtitle)
                            ) : isBannerChecked ? (
                                'Mari bertumbuh dan menciptakan momen kebahagiaan manis bersama di To Meet Cafe.'
                            ) : null}
                        </p>

                        <div className="pt-1 flex flex-row items-center gap-2 sm:gap-3">
                            <button
                                onClick={scrollToPositions}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            >
                                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{banner?.cta_text || 'LIHAT LOWONGAN'}</span>
                            </button>

                            <a
                                href={banner?.cta_link || "#our-values"}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full transition inline-flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md whitespace-nowrap"
                            >
                                <span>OUR VALUES</span>
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. OUR CORE VALUES SECTION                        */}
            {/* ================================================= */}
            <section id="our-values" className="py-12 sm:py-16 scroll-mt-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <div className="inline-flex items-center mt-10"></div>
                        <h2 className="text-xl sm:text-3xl font-black text-[#3d2314] tracking-tight uppercase">
                            OUR CORE VALUES
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                            Fondasi utama yang membuat seluruh tim To Meet selalu kompak, solid, dan penuh semangat setiap hari.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                        {/* Value 1 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-2 text-center flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-[#e85a4f] mx-auto flex items-center justify-center shadow-2xs">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                                    Heartfelt Hospitality
                                </h3>
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                    Melayani pengunjung dan rekan kerja dengan tulus, ramah, dan senyuman hangat.
                                </p>
                            </div>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-2 text-center flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center shadow-2xs">
                                    <Smile className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                                    Playful Creativity
                                </h3>
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                    Membawa keceriaan dalam setiap hidangan, workshop, dan interaksi tanpa batas.
                                </p>
                            </div>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-2 text-center flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-amber-600 mx-auto flex items-center justify-center shadow-2xs">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                                    One Big Family
                                </h3>
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                    Saling mendukung, mendengarkan, dan bertumbuh dalam suasana kerja yang sehat.
                                </p>
                            </div>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-2 text-center flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <div className="w-11 h-11 rounded-2xl bg-[#FAF0E6] text-emerald-600 mx-auto flex items-center justify-center shadow-2xs">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                                    Quality Excellence
                                </h3>
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                    Menjaga standar kualitas terbaik dari rasa hidangan hingga kenyamanan playground.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PEMISAH SECTION 1 KE SECTION 2 */}
            <SectionDivider />

            {/* ================================================= */}
            {/* 3. WHY JOIN US & OPEN POSITIONS SECTION           */}
            {/* ================================================= */}
            <section ref={openPositionsRef} className="py-12 sm:py-16 scroll-mt-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                        {/* Kiri: Alasan Bergabung (Sticky Sidebar Ringkas) */}
                        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-5 lg:sticky lg:top-24">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#8c5a3c] uppercase">
                                    <BearPawIcon className="w-4 h-4" />
                                    <span>MENGAPA BERGABUNG?</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] leading-tight uppercase">
                                    Tempat Tepat Untuk Meniti Karir & Berkarya
                                </h2>
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                    Kami membuka ruang belajar dan berkembang di industri F&B dan Family Entertainment yang menyenangkan.
                                </p>
                            </div>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-xs sm:text-sm text-[#3d2314]">Tim yang saling mendukung</div>
                                        <div className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">Saling membantu, menghargai, dan tumbuh bersama.</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-xs sm:text-sm text-[#3d2314]">Kesempatan belajar setiap hari</div>
                                        <div className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">Belajar hal baru dan mengembangkan skill harian.</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-xs sm:text-sm text-[#3d2314]">Suasana Positif & Nyaman</div>
                                        <div className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">Lingkungan kerja yang ramah dan penuh semangat.</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-xs sm:text-sm text-[#3d2314]">Jenjang Karier Terbuka</div>
                                        <div className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">Peluang promosi dan posisi lebih tinggi bagi yang berprestasi.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3.5 bg-[#FAF0E6]/60 rounded-2xl border border-[#e6ccb2]/70 text-center space-y-1">
                                <div className="text-xs sm:text-sm font-black text-[#8c5a3c]">Pertanyaan Rekrutmen?</div>
                                <div className="text-[12px] sm:text-[13px] text-[#6c584c]">
                                    Hubungi HR kami di <a href="mailto:tmc.rekrutmen@gmail.com" className="font-bold text-[#3d2314] transition hover:text-[#8c5a3c]">tmc.rekrutmen@gmail.com</a>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Filter Lokasi & Daftar Kartu Lowongan */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Header + Tabs Filter Lokasi Outlet */}
                            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3 lg:space-y-0">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6">

                                    {/* Kiri: Title & Badge Jumlah Lowongan */}
                                    <div className="flex items-center justify-between lg:justify-start gap-2.5 sm:gap-3 shrink-0">
                                        <div className="flex items-center gap-2.5">
                                            <Briefcase className="w-5 h-5 text-[#8c5a3c] shrink-0" />
                                            <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide whitespace-nowrap">
                                                OPEN POSITIONS
                                            </h2>
                                        </div>
                                        <span className="text-xs sm:text-sm font-bold text-[#8c5a3c] bg-[#FAF0E6] px-3 py-1 rounded-full whitespace-nowrap shrink-0 border border-[#e6ccb2]/60 shadow-2xs">
                                            {filteredCareers.length} Lowongan
                                        </span>
                                    </div>

                                    {/* A. KHUSUS MOBILE: ELEGANT DROPDOWN */}
                                    <div className="block lg:hidden relative z-20 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsLocationDropdownOpen(prev => !prev)}
                                            className="w-full bg-[#FAF0E6]/60 hover:bg-[#FAF0E6] border border-[#e6ccb2]/80 rounded-2xl px-3.5 py-2.5 flex items-center justify-between transition-all duration-200 shadow-2xs cursor-pointer text-left active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="w-2 h-2 rounded-full bg-[#8c5a3c] shrink-0" />
                                                <div className="truncate">
                                                    <span className="text-[9.5px] uppercase font-bold text-[#8c5a3c]/80 tracking-widest block leading-none">
                                                        Lokasi Penempatan:
                                                    </span>
                                                    <span className="text-xs sm:text-sm font-black text-[#3d2314] tracking-wide block mt-0.5 truncate">
                                                        {selectedLocationFilter === 'all'
                                                            ? 'Semua Lokasi'
                                                            : selectedLocationFilter === 'mutiara'
                                                                ? 'Pondok Mutiara'
                                                                : selectedLocationFilter === 'central_kitchen'
                                                                    ? 'Central Kitchen'
                                                                    : 'Office'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`w-6 h-6 rounded-full bg-white/80 border border-[#e6ccb2]/60 flex items-center justify-center text-[#8c5a3c] transition-transform duration-300 shrink-0 ${isLocationDropdownOpen ? 'rotate-180 bg-[#8c5a3c] text-white' : ''
                                                }`}>
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </div>
                                        </button>

                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isLocationDropdownOpen
                                                ? 'grid-rows-[1fr] opacity-100 mt-2'
                                                : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="bg-white rounded-2xl border border-[#e6ccb2]/70 shadow-md p-1.5 space-y-0.5">
                                                    {[
                                                        { id: 'all', label: 'Semua Lokasi' },
                                                        { id: 'mutiara', label: 'Pondok Mutiara' },
                                                        { id: 'central_kitchen', label: 'Central Kitchen' },
                                                        { id: 'office', label: 'Office' }
                                                    ].map((loc) => {
                                                        const isSelected = selectedLocationFilter === loc.id;
                                                        return (
                                                            <button
                                                                key={loc.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedLocationFilter(loc.id);
                                                                    setIsLocationDropdownOpen(false);
                                                                }}
                                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-left cursor-pointer ${isSelected
                                                                    ? 'bg-[#FAF0E6] text-[#8c5a3c] font-black'
                                                                    : 'text-[#5a4232] hover:bg-stone-50 font-bold text-xs'
                                                                    }`}
                                                            >
                                                                <span className="text-xs tracking-wide">
                                                                    {loc.label}
                                                                </span>
                                                                {isSelected && (
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8c5a3c] shrink-0" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* B. KHUSUS DESKTOP: HORIZONTAL TABS */}
                                    <div className="hidden lg:flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1">
                                        {[
                                            { id: 'all', label: 'Semua' },
                                            { id: 'mutiara', label: 'Pondok Mutiara' },
                                            { id: 'central_kitchen', label: 'Central Kitchen' },
                                            { id: 'office', label: 'Office' }
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setSelectedLocationFilter(tab.id)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 whitespace-nowrap ${selectedLocationFilter === tab.id
                                                    ? 'bg-[#8c5a3c] text-white shadow-2xs'
                                                    : 'bg-stone-50 text-[#6c584c] border border-[#e6ccb2]/70 hover:bg-[#FAF0E6]'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="bg-white p-16 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-3">
                                    <div className="w-8 h-8 border-3 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs sm:text-sm font-bold text-[#8c5a3c]">Memuat daftar lowongan...</p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!isLoading && filteredCareers.length === 0 && (
                                <div className="bg-white p-12 sm:p-16 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2.5">
                                    <BearFaceIcon className="w-10 h-10 text-[#8c5a3c] mx-auto opacity-70" />
                                    <h3 className="font-black text-sm sm:text-base text-[#3d2314]">Belum Ada Lowongan Aktif</h3>
                                    <p className="text-xs sm:text-sm text-[#6c584c] max-w-sm mx-auto">
                                        {selectedLocationFilter !== 'all'
                                            ? 'Tidak ada lowongan aktif untuk kategori lokasi ini saat ini.'
                                            : 'Saat ini semua posisi terisi penuh. Silakan cek berkala kembali!'}
                                    </p>
                                </div>
                            )}

                            {/* DAFTAR PEKERJAAN: SLIDER DI MOBILE & GRID DI DESKTOP */}
                            {!isLoading && filteredCareers.length > 0 && (
                                <div className="space-y-4">

                                    {/* A. TAMPILAN MOBILE: SLIDE SATU PER SATU */}
                                    <div className="block sm:hidden relative">
                                        <div className="flex items-center justify-between px-1 pb-2">
                                            <span className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                                Posisi ({currentSlideIndex + 1} dari {filteredCareers.length})
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => scrollToSlide(Math.max(0, currentSlideIndex - 1))}
                                                    disabled={currentSlideIndex === 0}
                                                    className="w-7 h-7 rounded-full bg-white border border-[#e6ccb2]/80 text-[#8c5a3c] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs active:scale-95 transition"
                                                    aria-label="Lowongan Sebelumnya"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => scrollToSlide(Math.min(filteredCareers.length - 1, currentSlideIndex + 1))}
                                                    disabled={currentSlideIndex === filteredCareers.length - 1}
                                                    className="w-7 h-7 rounded-full bg-white border border-[#e6ccb2]/80 text-[#8c5a3c] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs active:scale-95 transition"
                                                    aria-label="Lowongan Berikutnya"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            ref={sliderRef}
                                            onScroll={handleScrollMobile}
                                            className="flex items-stretch overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scroll-smooth scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
                                            style={{
                                                scrollbarWidth: 'none',
                                                msOverflowStyle: 'none',
                                            }}
                                        >
                                            {filteredCareers.map((job) => {
                                                const rawLocation = (job as any).location_name || (job as any).location || (job as any).branch;
                                                const locInfo = formatLocationName(rawLocation);

                                                return (
                                                    <div
                                                        key={job.id}
                                                        className="w-full shrink-0 snap-center bg-white p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs flex flex-col justify-between space-y-4"
                                                    >
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10.5px] font-black uppercase rounded-md tracking-wider">
                                                                    {job.department || 'Operasional'}
                                                                </span>
                                                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase rounded-full">
                                                                    {job.type}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <h3 className="text-base font-black text-[#3d2314] leading-snug">
                                                                    {job.title}
                                                                </h3>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10.5px] font-black uppercase tracking-wide ${locInfo.badgeColor}`}>
                                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                                    <span className="truncate max-w-32.5">{locInfo.label}</span>
                                                                </div>

                                                                {job.salary_range && (
                                                                    <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-2.5 py-0.5 rounded-lg border border-emerald-200/60 text-[10.5px] font-bold">
                                                                        <DollarSign className="w-3 h-3 shrink-0" />
                                                                        <span>{job.salary_range}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {job.description && (
                                                                <div className="pt-2 border-t border-[#e6ccb2]/40 space-y-1.5">
                                                                    <span className="block text-[10.5px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                                                        Tanggung Jawab Utama:
                                                                    </span>
                                                                    <div className="bg-[#FAF0E6]/30 p-3 rounded-2xl border border-[#e6ccb2]/40 text-xs sm:text-sm text-[#5a4232]">
                                                                        <FormatRichContent text={job.description} maxItems={3} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="pt-3 border-t border-[#e6ccb2]/40 grid grid-cols-2 gap-2 mt-auto">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDetailJob(job)}
                                                                className="w-full py-2.5 bg-[#FAF0E6] hover:bg-[#e6ccb2] text-[#8c5a3c] font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                                                            >
                                                                <FileText className="w-3.5 h-3.5" />
                                                                <span>Detail</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenApply(job)}
                                                                className="w-full py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                                                            >
                                                                <span>Lamar</span>
                                                                <ArrowRight className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {filteredCareers.length > 1 && (
                                            <div className="flex items-center justify-center gap-1.5 pt-2">
                                                {filteredCareers.map((_, dotIdx) => (
                                                    <button
                                                        key={dotIdx}
                                                        type="button"
                                                        onClick={() => scrollToSlide(dotIdx)}
                                                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlideIndex === dotIdx
                                                            ? 'w-6 bg-[#8c5a3c]'
                                                            : 'w-1.5 bg-[#e6ccb2]/80 hover:bg-[#8c5a3c]/50'
                                                            }`}
                                                        aria-label={`Ke slide lowongan ${dotIdx + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* B. TAMPILAN DESKTOP/TABLET: GRID 2 KOLOM */}
                                    <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-5">
                                        {filteredCareers.map((job) => {
                                            const rawLocation = (job as any).location_name || (job as any).location || (job as any).branch;
                                            const locInfo = formatLocationName(rawLocation);

                                            return (
                                                <div
                                                    key={job.id}
                                                    className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs hover:border-[#8c5a3c] hover:shadow-md transition duration-200 flex flex-col justify-between h-full space-y-4 group"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] sm:text-[11px] font-black uppercase rounded-md tracking-wider">
                                                                {job.department || 'Operasional'}
                                                            </span>
                                                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] sm:text-[10px] font-black uppercase rounded-full">
                                                                {job.type}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <h3 className="text-sm sm:text-base font-black text-[#3d2314] group-hover:text-[#8c5a3c] transition leading-snug">
                                                                {job.title}
                                                            </h3>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] sm:text-[10.5px] font-black uppercase tracking-wide ${locInfo.badgeColor}`}>
                                                                <MapPin className="w-3 h-3 shrink-0" />
                                                                <span className="truncate max-w-[130px]">{locInfo.label}</span>
                                                            </div>

                                                            {job.salary_range && (
                                                                <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-2.5 py-0.5 rounded-lg border border-emerald-200/60 text-[10px] sm:text-[10.5px] font-bold">
                                                                    <DollarSign className="w-3 h-3 shrink-0" />
                                                                    <span>{job.salary_range}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {job.description && (
                                                            <div className="pt-2 border-t border-[#e6ccb2]/40 space-y-1.5">
                                                                <span className="block text-[10px] sm:text-[11px] font-black text-[#8c5a3c] uppercase tracking-wider">
                                                                    Tanggung Jawab Utama:
                                                                </span>
                                                                <div className="bg-[#FAF0E6]/30 p-3 rounded-2xl border border-[#e6ccb2]/40 text-xs sm:text-sm text-[#5a4232]">
                                                                    <FormatRichContent text={job.description} maxItems={3} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pt-3 border-t border-[#e6ccb2]/40 grid grid-cols-2 gap-2 mt-auto">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDetailJob(job)}
                                                            className="w-full py-2.5 bg-[#FAF0E6] hover:bg-[#e6ccb2] text-[#8c5a3c] font-black text-[11px] sm:text-xs rounded-xl transition flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span>Detail</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenApply(job)}
                                                            className="w-full py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-[11px] sm:text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                                                        >
                                                            <span>Lamar</span>
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* PEMISAH SECTION 2 KE SECTION 3 */}
            <SectionDivider />

            {/* ================================================= */}
            {/* 4. WHAT OUR TEAM SAYS SECTION                     */}
            {/* ================================================= */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <div className="inline-flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                            <span className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-widest">TESTIMONI TIM</span>
                            <span className="w-6 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-[#3d2314] uppercase tracking-wide">
                            WHAT OUR TEAM SAYS
                        </h2>
                        <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                            Kisah nyata dan pengalaman berharga dari anggota keluarga beruang To Meet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <Quote className="w-6 h-6 text-[#8c5a3c]/30" />
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed italic">
                                    &quot;Banyak banget pelajaran dan pengalaman seru selama bekerja di To Meet, dengan tim yang solid dan asik diajak kerja sama. Terima kasih sudah memberikan kesempatan bagi saya untuk tumbuh dan berkembang&quot;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-[#e6ccb2]/50">
                                <div className="w-9 h-9 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs">
                                    A
                                </div>
                                <div>
                                    <div className="font-black text-xs sm:text-sm text-[#3d2314]">Adel</div>
                                    <div className="text-xs sm:text-sm text-[#6c584c] font-semibold">Kitchen Leader</div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <Quote className="w-6 h-6 text-[#8c5a3c]/30" />
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed italic">
                                    &quot;Selama saya bekerja di To Meet, banyak ilmu yang saya dapat, baik dari bagaimana cara tim bekerja, bagaimana SOP dan operasional yang baik dan benar, juga dengan kebersamaan antara saya dan tim. Saya sangat berterima kasih juga kepada beberapa orang yang selalu mendukung saya dalam berkembang dan memberikan saya kesempatan untuk menunjukkan bahwa saya bisa bekerja dengan baik.&quot;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-[#e6ccb2]/50">
                                <div className="w-9 h-9 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs">
                                    A
                                </div>
                                <div>
                                    <div className="font-black text-xs sm:text-sm text-[#3d2314]">Affanin</div>
                                    <div className="text-xs sm:text-sm text-[#6c584c] font-semibold">Front Leader</div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#8c5a3c] hover:shadow-xs transition duration-200">
                            <div className="space-y-2.5">
                                <Quote className="w-6 h-6 text-[#8c5a3c]/30" />
                                <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed italic">
                                    &quot;Bekerja di To Meet Cafe benar-benar pengalaman yang berkesan. Suasannya nyaman banget, seperti rumah kedua, tim dan manajemennya juga suportif. Aku banyak belajar hal baru di sini dan diberi peluang yang luas untuk mengembangkan karir.&quot;
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-[#e6ccb2]/50">
                                <div className="w-9 h-9 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs">
                                    V
                                </div>
                                <div>
                                    <div className="font-black text-xs sm:text-sm text-[#3d2314]">Vania</div>
                                    <div className="text-xs sm:text-sm text-[#6c584c] font-semibold">Greater Leader</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PEMISAH SECTION 3 KE SECTION 4 */}
            <SectionDivider />

            {/* ================================================= */}
            {/* 5. BIG CTA SECTION                                */}
            {/* ================================================= */}
            <section className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#8c5a3c] text-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center lg:text-left z-10 max-w-xl">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10.5px] sm:text-xs font-black uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>KAMI TUNGGU KEDATANGANMU</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase leading-tight">
                                Ready to be part of our bear family?
                            </h2>
                            <p className="text-xs sm:text-sm text-stone-200 font-semibold leading-relaxed">
                                Kirimkan CV dan portofolio Anda sekarang juga. Mari ciptakan kebahagiaan manis bersama di To Meet Cafe & Playground!
                            </p>
                        </div>

                        <div className="z-10 shrink-0">
                            <button
                                onClick={scrollToPositions}
                                className="px-7 py-3 sm:px-8 sm:py-3.5 bg-white hover:bg-[#FAF0E6] active:bg-stone-200 text-[#3d2314] font-black text-xs sm:text-sm rounded-full shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <span>APPLY SEKARANG</span>
                                <ArrowRight className="w-4 h-4 text-[#8c5a3c]" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* MODAL 1: DETAIL LENGKAP POSISI PEKERJAAN          */}
            {/* ================================================= */}
            {detailJob && (
                <div
                    onClick={() => setDetailJob(null)}
                    className="fixed inset-0 z-99999 w-screen h-[100dvh] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overscroll-contain overflow-y-auto"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="career-detail-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-[#e6ccb2] shadow-2xl space-y-5 relative my-auto max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={() => setDetailJob(null)}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#FAF0E6] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-2.5 border-b border-[#e6ccb2]/60 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10.5px] sm:text-xs font-black uppercase rounded-md">
                                    {detailJob.department || 'Operasional Cafe'}
                                </span>
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] sm:text-xs font-black uppercase rounded-md">
                                    {detailJob.type}
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] leading-tight">
                                {detailJob.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-bold pt-1">
                                {(() => {
                                    const rawLocation = (detailJob as any).location_name || (detailJob as any).location || (detailJob as any).branch;
                                    const loc = formatLocationName(rawLocation);
                                    return (
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-black uppercase ${loc.badgeColor}`}>
                                            <Building className="w-3.5 h-3.5 shrink-0" />
                                            <span>Penempatan: {loc.label}</span>
                                        </div>
                                    );
                                })()}

                                {detailJob.salary_range && (
                                    <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-3 py-1 rounded-lg border border-emerald-200/60 text-xs font-black">
                                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                                        <span>Gaji: {detailJob.salary_range}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {detailJob.description && detailJob.description.trim() !== '' && (
                            <div className="space-y-2">
                                <h3 className="text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-[#8c5a3c]" />
                                    <span>Deskripsi Pekerjaan:</span>
                                </h3>
                                <div className="bg-[#FAF0E6]/40 p-4 rounded-2xl border border-[#e6ccb2]/60 text-xs sm:text-sm text-[#5a4232]">
                                    <FormatRichContent text={detailJob.description} />
                                </div>
                            </div>
                        )}

                        {detailJob.requirements && detailJob.requirements.trim() !== '' && (
                            <div className="space-y-2">
                                <h3 className="text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#8c5a3c]" />
                                    <span>Persyaratan (Requirements):</span>
                                </h3>
                                <div className="bg-[#FAF0E6]/40 p-4 rounded-2xl border border-[#e6ccb2]/60 text-xs sm:text-sm text-[#5a4232]">
                                    <FormatRichContent text={detailJob.requirements} />
                                </div>
                            </div>
                        )}

                        {detailJob.benefits && detailJob.benefits.trim() !== '' && (
                            <div className="space-y-2">
                                <h3 className="text-xs sm:text-sm font-black text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <Gift className="w-4 h-4 text-[#e85a4f]" />
                                    <span>Benefit Pekerjaan:</span>
                                </h3>
                                <div className="bg-[#FAF0E6]/40 p-4 rounded-2xl border border-[#e6ccb2]/60 text-xs sm:text-sm text-[#5a4232]">
                                    <FormatRichContent text={detailJob.benefits} />
                                </div>
                            </div>
                        )}

                        <div className="pt-3 border-t border-[#e6ccb2]/50 flex items-center justify-end gap-2.5">
                            <button
                                onClick={() => setDetailJob(null)}
                                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => handleOpenApply(detailJob)}
                                className="px-6 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <span>Lamar Posisi Ini</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* MODAL 2: APPLY FORM CV                            */}
            {/* ================================================= */}
            {isApplyModalOpen && selectedJob && (
                <div
                    onClick={() => setIsApplyModalOpen(false)}
                    className="fixed inset-0 z-[99999] w-screen h-dvh flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overscroll-contain overflow-y-auto"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="career-apply-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#e6ccb2] overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="px-6 py-4.5 border-b border-[#e6ccb2]/60 flex items-center justify-between bg-[#FAF0E6]/60">
                            <div>
                                <h3 className="font-bold text-[#3d2314] text-base sm:text-lg">
                                    Lamar Posisi: {selectedJob.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-[#6c584c] font-medium mt-0.5">
                                    Penempatan: {formatLocationName((selectedJob as any).location_name || (selectedJob as any).location || (selectedJob as any).branch).label} • {selectedJob.type}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsApplyModalOpen(false)}
                                className="p-1.5 text-stone-400 hover:text-[#3d2314] rounded-xl hover:bg-white/80 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="p-8 sm:p-10 text-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h4 className="font-black text-lg text-stone-900">Lamaran Terkirim!</h4>
                                <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto">
                                    Terima kasih! Berkas lamaran Anda telah berhasil diteruskan ke tim HRD To Meet Cafe.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4">
                                {formError && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                                        Nama Lengkap <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Contoh: Bima Ardiansyah"
                                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#8c5a3c] font-semibold"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                                            Email Aktif <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nama@email.com"
                                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#8c5a3c] font-semibold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                                            Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="08123456789"
                                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#8c5a3c] font-semibold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                                        Surat Pengantar / Catatan Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Ceritakan secara singkat pengalaman dan motivasi Anda bergabung..."
                                        className="w-full border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#8c5a3c] leading-relaxed resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                                        Upload Berkas CV / Resume (PDF/DOCX, Max 5MB) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-xs sm:text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#FAF0E6] file:text-[#8c5a3c] hover:file:bg-[#e6ccb2] transition cursor-pointer"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end gap-2.5 border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsApplyModalOpen(false)}
                                        className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>Mengirim...</span>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Kirim Lamaran</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}