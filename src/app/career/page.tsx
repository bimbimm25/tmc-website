'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
    Briefcase, MapPin, DollarSign, Clock, ArrowRight,
    Sparkles, Heart, Smile, Users, Award, ShieldCheck,
    Coffee, GraduationCap, PartyPopper, CheckCircle2,
    Send, X, Quote, ChevronRight, AlertCircle, Compass,
    FileText, Gift, Check, Building
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

// Helper: Memformat Label Lokasi Outlet Sesuai Nilai Backend
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

// Helper: Parser Markdown & Baris Teks
function FormatRichContent({ text }: { text?: string | null }) {
    if (!text || text.trim() === '') {
        return <p className="text-xs text-[#6c584c] italic">Informasi belum ditambahkan.</p>;
    }

    const cleanText = text.replace(/<br\s*\/?>/gi, '\n');
    const lines = cleanText.split('\n');

    return (
        <div className="space-y-1.5 text-left">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-1" />;

                if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
                    const content = trimmed.replace(/^[-*•]\s*/, '');
                    return (
                        <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-[#5a4232]">
                            <span className="text-[#8c5a3c] font-black leading-none mt-1 shrink-0">•</span>
                            <span className="font-semibold">{content}</span>
                        </div>
                    );
                }

                return (
                    <p key={idx} className="text-xs leading-relaxed text-[#5a4232] font-semibold">
                        {trimmed}
                    </p>
                );
            })}
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
}

export default function CareerPage() {
    const [careers, setCareers] = useState<CareerItem[]>([]);
    const [banner, setBanner] = useState<BannerItem | null>(null);
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

    // Kunci scroll body dan html ketika modal pop-up aktif
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
                fetch(`${API_BASE_URL}/api/banners/career`, { cache: 'no-store' }),
                fetch(`${API_BASE_URL}/api/careers`, { cache: 'no-store' })
            ]);

            if (bannerRes.ok) {
                const bJson = await bannerRes.json();
                if (bJson?.data) setBanner(bJson.data);
            }

            if (careersRes.ok) {
                const cJson = await careersRes.json();
                if (cJson?.data) setCareers(cJson.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCareerData();
    }, []);

    // Filter Pekerjaan Berdasarkan Tab Lokasi Outlet
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

    const heroImage = banner?.image
        ? (banner.image.startsWith('http')
            ? banner.image
            : banner.image.startsWith('/img')
                ? banner.image
                : `${API_BASE_URL}/storage/${banner.image}`)
        : '/img/hero-home.png';

    return (
        <div className="min-h-screen space-y-10 sm:space-y-14 pb-14">

            {/* ================================================= */}
            {/* 1. HERO SECTION                                   */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden border-b border-[#e6ccb2]/50">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Cafe Career"
                        className="w-full h-full object-cover object-[75%_center] lg:object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full sm:w-2/3 lg:w-1/2" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
                    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-3 sm:space-y-4 text-left">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[#8c5a3c] text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
                                <span>CAREER OPPORTUNITIES</span>
                                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3d2314] tracking-tight leading-[1.08] uppercase">
                            {renderFormattedText(
                                banner?.title,
                                <>
                                    GROW TOGETHER <br />
                                    CREATE HAPPINESS <br />
                                    <span className="text-[#8c5a3c]">TOGETHER</span>
                                </>
                            )}
                        </h1>

                        <p className="text-xs sm:text-[15px] text-[#5a4232] font-semibold leading-relaxed max-w-[260px] sm:max-w-md">
                            {renderFormattedText(
                                banner?.subtitle,
                                'Mari bertumbuh dan menciptakan momen kebahagiaan manis bersama di To Meet Cafe.'
                            )}
                        </p>

                        <div className="pt-1 flex flex-row items-center gap-2 sm:gap-3">
                            <button
                                onClick={scrollToPositions}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full shadow-md shadow-rose-500/20 transition inline-flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                            >
                                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>LIHAT LOWONGAN</span>
                            </button>

                            <a
                                href="#our-values"
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
            {/* 2. OUR VALUES SECTION                             */}
            {/* ================================================= */}
            <section id="our-values" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 scroll-mt-20">
                <div className="text-center space-y-0.5">
                    <div className="inline-flex items-center gap-2">
                        <span className="w-5 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                        <h2 className="text-base sm:text-xl font-black text-[#3d2314] tracking-tight uppercase">
                            OUR CORE VALUES
                        </h2>
                        <span className="w-5 h-0.5 bg-[#e6ccb2] rounded-full"></span>
                    </div>
                    <p className="text-[11px] text-[#6c584c] font-semibold">
                        Fondasi utama yang membuat tim To Meet selalu kompak dan solid
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-1.5 text-center">
                        <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#e85a4f] mx-auto flex items-center justify-center">
                            <Heart className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase">Heartfelt Hospitality</h3>
                        <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                            Melayani pengunjung dan rekan kerja dengan tulus, ramah, dan senyuman hangat.
                        </p>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-1.5 text-center">
                        <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-[#8c5a3c] mx-auto flex items-center justify-center">
                            <Smile className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase">Playful Creativity</h3>
                        <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                            Membawa keceriaan dalam setiap hidangan, workshop, dan interaksi tanpa batas.
                        </p>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-1.5 text-center">
                        <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-amber-600 mx-auto flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase">One Big Family</h3>
                        <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                            Saling mendukung, mendengarkan, dan bertumbuh dalam suasana kerja yang sehat.
                        </p>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-1.5 text-center">
                        <div className="w-9 h-9 rounded-2xl bg-[#FAF0E6] text-emerald-600 mx-auto flex items-center justify-center">
                            <Award className="w-4 h-4" />
                        </div>
                        <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase">Quality Excellence</h3>
                        <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed">
                            Menjaga standar kualitas terbaik dari rasa hidangan hingga kenyamanan playground.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. WHY JOIN US & OPEN POSITIONS (GRID 2-2)        */}
            {/* ================================================= */}
            <section ref={openPositionsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Kiri: Alasan Bergabung (Sticky Sidebar) */}
                    <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4 lg:sticky lg:top-24">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#8c5a3c] uppercase">
                                <BearPawIcon className="w-3.5 h-3.5" />
                                <span>MENGAPA BERGABUNG?</span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-black text-[#3d2314] leading-tight uppercase">
                                Tempat Tepat Untuk Meniti Karir & Berkarya
                            </h2>
                            <p className="text-xs text-[#5a4232] font-semibold leading-relaxed">
                                Kami membuka ruang belajar dan berkembang di industri F&B dan Family Entertainment yang menyenangkan.
                            </p>
                        </div>

                        <div className="space-y-2.5 pt-1">
                            <div className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-[#3d2314]">Tim yang saling mendukung</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Saling membantu, menghargai, dan tumbuh bersama.</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-[#3d2314]">Kesempatan belajar setiap hari</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Belajar hal baru dan mengembangkan skill harian.</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-[#3d2314]">Suasana Positif & Nyaman</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Lingkungan kerja yang ramah dan penuh semangat.</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-[#3d2314]">Jenjang Karier Terbuka</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Peluang promosi dan posisi lebih tinggi bagi yang berprestasi.</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-[#FAF0E6]/50 rounded-2xl border border-[#e6ccb2]/60 text-center">
                            <div className="text-xs font-black text-[#8c5a3c]">Pertanyaan Rekrutmen?</div>
                            <div className="text-[10.5px] text-[#6c584c]">Hubungi HR kami di <span className="font-bold text-[#3d2314]">tmc.rekrutmen@gmail.com</span></div>
                        </div>
                    </div>

                    {/* Kanan: Filter Lokasi & Grid Kartu Lowongan 2-2 */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* Header + Tabs Filter Lokasi Outlet */}
                        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-[#8c5a3c]" />
                                    <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                                        OPEN POSITIONS
                                    </h2>
                                    <span className="text-xs font-bold text-[#8c5a3c] bg-[#FAF0E6] px-2 py-0.5 rounded-full">
                                        {filteredCareers.length} Lowongan
                                    </span>
                                </div>

                                {/* Filter Tabs Lokasi */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
                                    <button
                                        onClick={() => setSelectedLocationFilter('all')}
                                        className={`px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${selectedLocationFilter === 'all'
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-stone-50 text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                            }`}
                                    >
                                        Semua
                                    </button>

                                    <button
                                        onClick={() => setSelectedLocationFilter('mutiara')}
                                        className={`px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${selectedLocationFilter === 'mutiara'
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-stone-50 text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                            }`}
                                    >
                                        Pondok Mutiara
                                    </button>

                                    <button
                                        onClick={() => setSelectedLocationFilter('central_kitchen')}
                                        className={`px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${selectedLocationFilter === 'central_kitchen'
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-stone-50 text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                            }`}
                                    >
                                        Central Kitchen
                                    </button>

                                    <button
                                        onClick={() => setSelectedLocationFilter('office')}
                                        className={`px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${selectedLocationFilter === 'office'
                                                ? 'bg-[#8c5a3c] text-white shadow-xs'
                                                : 'bg-stone-50 text-[#6c584c] border border-[#e6ccb2]/60 hover:bg-[#FAF0E6]'
                                            }`}
                                    >
                                        Office
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="bg-white p-12 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2">
                                <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-xs font-bold text-[#8c5a3c]">Memuat daftar lowongan...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filteredCareers.length === 0 && (
                            <div className="bg-white p-10 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2">
                                <BearFaceIcon className="w-8 h-8 text-[#8c5a3c] mx-auto opacity-70" />
                                <h3 className="font-black text-sm text-[#3d2314]">Belum Ada Lowongan Aktif</h3>
                                <p className="text-xs text-[#6c584c] max-w-sm mx-auto">
                                    {selectedLocationFilter !== 'all'
                                        ? 'Tidak ada lowongan aktif untuk kategori lokasi ini saat ini.'
                                        : 'Saat ini semua posisi terisi penuh. Silakan cek berkala kembali!'}
                                </p>
                            </div>
                        )}

                        {/* DAFTAR PEKERJAAN: GRID 2-2 KE BAWAH */}
                        {!isLoading && filteredCareers.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredCareers.map((job) => {
                                    const rawLocation = (job as any).location_name || (job as any).location || (job as any).branch;
                                    const locInfo = formatLocationName(rawLocation);

                                    return (
                                        <div
                                            key={job.id}
                                            className="bg-white p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs hover:border-[#8c5a3c] hover:shadow-md transition duration-200 flex flex-col justify-between h-full space-y-4 group"
                                        >
                                            {/* Bagian Atas: Badge Departemen, Tipe, Judul & Metadata */}
                                            <div className="space-y-2.5">
                                                {/* Header Badges */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[9.5px] font-black uppercase rounded-md tracking-wider">
                                                        {job.department || 'Operasional'}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black uppercase rounded-full">
                                                        {job.type}
                                                    </span>
                                                </div>

                                                {/* Job Title */}
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-black text-[#3d2314] group-hover:text-[#8c5a3c] transition leading-snug">
                                                        {job.title}
                                                    </h3>
                                                </div>

                                                {/* Lokasi & Gaji Badges */}
                                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[9.5px] font-black uppercase tracking-wide ${locInfo.badgeColor}`}>
                                                        <MapPin className="w-3 h-3 shrink-0" />
                                                        <span className="truncate max-w-[140px]">{locInfo.label}</span>
                                                    </div>

                                                    {job.salary_range && (
                                                        <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-2.5 py-0.5 rounded-lg border border-emerald-200/60 text-[9.5px] font-bold">
                                                            <DollarSign className="w-3 h-3 shrink-0" />
                                                            <span>{job.salary_range}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Preview Deskripsi Singkat (Max 3 Baris) */}
                                                {job.description && (
                                                    <p className="text-[11px] text-[#6c584c] font-medium leading-relaxed line-clamp-3 pt-1 border-t border-[#e6ccb2]/40">
                                                        {job.description.replace(/<br\s*\/?>/gi, ' ').replace(/[-*•]/g, '').trim()}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bagian Bawah: Tombol Aksi Kerap Rata */}
                                            <div className="pt-3 border-t border-[#e6ccb2]/40 grid grid-cols-2 gap-2 mt-auto">
                                                <button
                                                    onClick={() => setDetailJob(job)}
                                                    className="w-full py-2 bg-[#FAF0E6] hover:bg-[#e6ccb2] text-[#8c5a3c] font-black text-[10px] sm:text-[10.5px] rounded-xl transition flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    <span>Detail</span>
                                                </button>

                                                <button
                                                    onClick={() => handleOpenApply(job)}
                                                    className="w-full py-2 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-[10px] sm:text-[10.5px] rounded-xl shadow-xs transition flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer"
                                                >
                                                    <span>Lamar</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 4. WHAT OUR TEAM SAYS                             */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
                <div className="text-center space-y-0.5">
                    <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                        WHAT OUR TEAM SAYS
                    </h2>
                    <p className="text-[11px] text-[#6c584c] font-semibold">Kisah nyata dari anggota keluarga beruang To Meet</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <Quote className="w-5 h-5 text-[#8c5a3c]/30" />
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed italic">
                                &quot;Banyak banget pelajaran dan pengalaman seru selama bekerja di To Meet, dengan tim yang solid dan asik diajak kerja sama. Terima kasih sudah memberikan kesempatan bagi saya untuk tumbuh dan berkembang&quot;
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-2 border-t border-[#e6ccb2]/50">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs">
                                A
                            </div>
                            <div>
                                <div className="font-black text-xs text-[#3d2314]">Adel</div>
                                <div className="text-[9.5px] text-[#6c584c] font-semibold">Kitchen Leader</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <Quote className="w-5 h-5 text-[#8c5a3c]/30" />
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed italic">
                                &quot;Selama saya bekerja di To Meet, banyak ilmu yang saya dapat, baik dari bagaimana cara tim bekerja, bagaimana SOP dan operasional yang baik dan benar, juga dengan kebersamaan antara saya dan tim. Saya sangat berterima kasih juga kepada beberapa orang yang selalu mendukung saya dalam berkembang dan memberikan saya kesempatan untuk menunjukkan bahwa saya bisa bekerja dengan baik.&quot;
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-2 border-t border-[#e6ccb2]/50">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs">
                                A
                            </div>
                            <div>
                                <div className="font-black text-xs text-[#3d2314]">Affanin</div>
                                <div className="text-[9.5px] text-[#6c584c] font-semibold">Front Leader</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <Quote className="w-5 h-5 text-[#8c5a3c]/30" />
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed italic">
                                &quot;Bekerja di To Meet Cafe benar-benar pengalaman yang berkesan. Suasannya nyaman banget, seperti rumah kedua, tim dan manajemennya juga suportif. Aku banyak belajar hal baru di sini dan diberi peluang yang luas untuk mengembangkan karir.&quot;
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-2 border-t border-[#e6ccb2]/50">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs">
                                V
                            </div>
                            <div>
                                <div className="font-black text-xs text-[#3d2314]">Vania</div>
                                <div className="text-[9.5px] text-[#6c584c] font-semibold">Greater Leader</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. BIG CTA SECTION                                */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#8c5a3c] text-white p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-5">
                    <div className="space-y-1.5 text-center lg:text-left z-10 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>KAMI TUNGGU KEDATANGANMU</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase leading-tight">
                            Ready to be part of our bear family?
                        </h2>
                        <p className="text-xs text-stone-200 font-semibold leading-relaxed">
                            Kirimkan CV dan portofolio Anda sekarang juga. Mari ciptakan kebahagiaan manis bersama di To Meet Cafe & Playground!
                        </p>
                    </div>

                    <div className="z-10 shrink-0">
                        <button
                            onClick={scrollToPositions}
                            className="px-6 py-3 bg-white hover:bg-[#FAF0E6] active:bg-stone-200 text-[#3d2314] font-black text-xs rounded-full shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                        >
                            <span>APPLY SEKARANG</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#8c5a3c]" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* MODAL 1: DETAIL LENGKAP POSISI PEKERJAAN          */}
            {/* ================================================= */}
            {detailJob && (
                <div
                    onClick={() => setDetailJob(null)}
                    className="fixed inset-0 z-[99999] w-screen h-[100dvh] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overscroll-contain overflow-y-auto"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="career-detail-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-7 border border-[#e6ccb2] shadow-2xl space-y-5 relative my-auto max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={() => setDetailJob(null)}
                            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#FAF0E6] hover:bg-[#8c5a3c] text-[#8c5a3c] hover:text-white flex items-center justify-center transition cursor-pointer z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Header Modal */}
                        <div className="space-y-2 border-b border-[#e6ccb2]/60 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[10px] font-black uppercase rounded-md">
                                    {detailJob.department || 'Operasional Cafe'}
                                </span>
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase rounded-md">
                                    {detailJob.type}
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] leading-tight">
                                {detailJob.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold pt-1">
                                {(() => {
                                    const rawLocation = (detailJob as any).location_name || (detailJob as any).location || (detailJob as any).branch;
                                    const loc = formatLocationName(rawLocation);
                                    return (
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-black uppercase ${loc.badgeColor}`}>
                                            <Building className="w-3.5 h-3.5 shrink-0" />
                                            <span>Penempatan: {loc.label}</span>
                                        </div>
                                    );
                                })()}

                                {detailJob.salary_range && (
                                    <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-3 py-1 rounded-lg border border-emerald-200/60 text-[11px] font-black">
                                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                                        <span>Gaji: {detailJob.salary_range}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi Pekerjaan */}
                        {detailJob.description && detailJob.description.trim() !== '' && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>Deskripsi Pekerjaan:</span>
                                </h3>
                                <div className="bg-[#FAF0E6]/40 p-4 rounded-2xl border border-[#e6ccb2]/60">
                                    <FormatRichContent text={detailJob.description} />
                                </div>
                            </div>
                        )}

                        {/* Persyaratan (Requirements) */}
                        {detailJob.requirements && detailJob.requirements.trim() !== '' && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8c5a3c]" />
                                    <span>Persyaratan (Requirements):</span>
                                </h3>
                                <div className="bg-[#FAF0E6]/40 p-4 rounded-2xl border border-[#e6ccb2]/60">
                                    <FormatRichContent text={detailJob.requirements} />
                                </div>
                            </div>
                        )}

                        {/* Benefit Pekerjaan */}
                        {detailJob.benefits && detailJob.benefits.trim() !== '' && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-[#3d2314] uppercase tracking-wider flex items-center gap-1.5">
                                    <Gift className="w-3.5 h-3.5 text-[#e85a4f]" />
                                    <span>Benefit Pekerjaan:</span>
                                </h3>
                                <div className="bg-[#FAF0E6]/40 p-4 rounded-2xl border border-[#e6ccb2]/60">
                                    <FormatRichContent text={detailJob.benefits} />
                                </div>
                            </div>
                        )}

                        {/* Footer Modal */}
                        <div className="pt-3 border-t border-[#e6ccb2]/50 flex items-center justify-end gap-2.5">
                            <button
                                onClick={() => setDetailJob(null)}
                                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => handleOpenApply(detailJob)}
                                className="px-6 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                            >
                                <span>Lamar Posisi Ini</span>
                                <ArrowRight className="w-3.5 h-3.5" />
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
                    className="fixed inset-0 z-[99999] w-screen h-[100dvh] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 overscroll-contain overflow-y-auto"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div
                        id="career-apply-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#e6ccb2] overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="px-5 py-4 border-b border-[#e6ccb2]/60 flex items-center justify-between bg-[#FAF0E6]/60">
                            <div>
                                <h3 className="font-bold text-[#3d2314] text-sm sm:text-base">
                                    Lamar Posisi: {selectedJob.title}
                                </h3>
                                <p className="text-[10.5px] text-[#6c584c] font-medium mt-0.5">
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
                            <div className="p-8 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <h4 className="font-black text-base text-stone-900">Lamaran Terkirim!</h4>
                                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                                    Terima kasih! Berkas lamaran Anda telah berhasil diteruskan ke tim HRD To Meet Cafe.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitApplication} className="p-5 space-y-3">
                                {formError && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                                        Nama Lengkap <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Contoh: Bima Ardiansyah"
                                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#8c5a3c] font-semibold"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                                            Email Aktif <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nama@email.com"
                                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#8c5a3c] font-semibold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                                            Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="08123456789"
                                            className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#8c5a3c] font-semibold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                                        Surat Pengantar / Catatan Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Ceritakan secara singkat pengalaman dan motivasi Anda bergabung..."
                                        className="w-full border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-[#8c5a3c] leading-relaxed resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                                        Upload Berkas CV / Resume (PDF/DOCX, Max 5MB) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FAF0E6] file:text-[#8c5a3c] hover:file:bg-[#e6ccb2] transition cursor-pointer"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsApplyModalOpen(false)}
                                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 bg-[#8c5a3c] hover:bg-[#73482f] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>Mengirim...</span>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
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