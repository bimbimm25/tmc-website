'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Briefcase, MapPin, DollarSign, Clock, ArrowRight,
    Sparkles, Heart, Smile, Users, Award, ShieldCheck,
    Coffee, GraduationCap, PartyPopper, CheckCircle2,
    Send, X, Quote, ChevronRight, AlertCircle, Compass
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

// Fungsi parsing tag <br> dan karakter enter \n
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
    type: string;
    salary_range?: string;
    description?: string;
    requirements?: string;
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

    const scrollToPositions = () => {
        openPositionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleOpenApply = (job: CareerItem) => {
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
            {/* 1. HERO SECTION FULL 1 LAYAR (HOMEPAGE STYLE)     */}
            {/* ================================================= */}
            <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden">
                {/* Background Image Full Cover */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt="To Meet Cafe Career"
                        className="w-full h-full object-cover object-right lg:object-center"
                    />
                    {/* Gradient Overlay Sebelah Kiri */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-3/4 lg:w-3/5" />
                </div>

                {/* Konten Text Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl space-y-4">
                        <span className="text-xs sm:text-sm font-black text-[#8c5a3c] tracking-[0.2em] uppercase">
                            CAREER OPPORTUNITIES
                        </span>

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

                        <p className="text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                            {renderFormattedText(
                                banner?.subtitle,
                                'Mari bertumbuh dan menciptakan momen kebahagiaan manis bersama To Meet Cafe & Playground.'
                            )}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <button
                                onClick={scrollToPositions}
                                className="px-6 py-3 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                            >
                                <Briefcase className="w-4 h-4" />
                                <span>LIHAT LOWONGAN</span>
                            </button>

                            <a
                                href="#our-values"
                                className="px-6 py-3 bg-[#3d2314] hover:bg-[#2a170d] text-white font-black text-xs rounded-full transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer shadow-md"
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
            {/* 3. WHY JOIN US & OPEN POSITIONS (2-COLUMN)        */}
            {/* ================================================= */}
            <section ref={openPositionsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Kiri: Alasan Bergabung */}
                    <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-4">
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
                                    <div className="font-bold text-xs text-[#3d2314]">Jenjang Karir Terbuka</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Peluang promosi internal ke posisi supervisor & manajerial.</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-[#3d2314]">Pelatihan Berkala</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Workshop hospitality, barista skill, & service excellence.</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-bold text-xs text-[#3d2314]">Lingkungan Positif</div>
                                    <div className="text-[10.5px] text-[#6c584c]">Kultur kekeluargaan tanpa toxic culture, saling menghargai.</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-[#FAF0E6]/50 rounded-2xl border border-[#e6ccb2]/60 text-center">
                            <div className="text-xs font-black text-[#8c5a3c]">Pertanyaan Rekrutmen?</div>
                            <div className="text-[11px] text-[#6c584c]">Hubungi HR kami di <span className="font-bold text-[#3d2314]">hr@tomeetcafe.com</span></div>
                        </div>
                    </div>

                    {/* Kanan: Daftar Lowongan Kerja */}
                    <div className="lg:col-span-7 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-2.5">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#8c5a3c]" />
                                <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                                    OPEN POSITIONS
                                </h2>
                            </div>
                            <span className="text-[11px] font-bold text-[#8c5a3c]">
                                {careers.length} Posisi Tersedia
                            </span>
                        </div>

                        {isLoading && (
                            <div className="bg-white p-8 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2">
                                <div className="w-6 h-6 border-2 border-[#8c5a3c] border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-xs font-bold text-[#8c5a3c]">Memuat daftar lowongan...</p>
                            </div>
                        )}

                        {!isLoading && careers.length === 0 && (
                            <div className="bg-white p-8 rounded-3xl border border-[#e6ccb2]/80 text-center space-y-2">
                                <BearFaceIcon className="w-7 h-7 text-[#8c5a3c] mx-auto" />
                                <h3 className="font-black text-xs sm:text-sm text-[#3d2314]">Belum Ada Lowongan Aktif</h3>
                                <p className="text-[11px] text-[#6c584c]">Saat ini semua posisi terisi penuh. Silakan pantau halaman ini secara berkala!</p>
                            </div>
                        )}

                        {!isLoading && careers.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs hover:border-[#8c5a3c] transition duration-200 space-y-2.5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <div>
                                        <span className="px-2 py-0.5 bg-[#FAF0E6] text-[#8c5a3c] text-[9px] font-black uppercase rounded-md">
                                            {job.department || 'Operasional Cafe'}
                                        </span>
                                        <h3 className="text-sm sm:text-base font-black text-[#3d2314] mt-0.5">{job.title}</h3>
                                    </div>
                                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-black uppercase rounded-full self-start sm:self-auto">
                                        {job.type}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#6c584c]">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-[#e85a4f]" />
                                        <span>{job.location}</span>
                                    </div>
                                    {job.salary_range && (
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>{job.salary_range}</span>
                                        </div>
                                    )}
                                </div>

                                {job.description && (
                                    <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed line-clamp-2">
                                        {job.description}
                                    </p>
                                )}

                                <div className="pt-1 flex justify-end">
                                    <button
                                        onClick={() => handleOpenApply(job)}
                                        className="px-4 py-1.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-[10.5px] rounded-xl shadow-xs transition inline-flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                                    >
                                        <span>APPLY NOW</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 4. OUR BENEFITS (COMPACT STRIP)                   */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3.5">
                    <div className="text-center space-y-0.5">
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            OUR TEAM BENEFITS
                        </h2>
                        <p className="text-[10.5px] text-[#6c584c] font-semibold">Keuntungan dan fasilitas nyata untuk seluruh tim kami</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                            <div className="text-[10.5px] font-black text-[#3d2314]">Gaji Kompetitif</div>
                            <div className="text-[9px] text-[#6c584c]">Plus bonus performa</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8c5a3c]" />
                            <div className="text-[10.5px] font-black text-[#3d2314]">BPJS Kerja</div>
                            <div className="text-[9px] text-[#6c584c]">Jaminan perlindungan</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-0.5">
                            <Coffee className="w-3.5 h-3.5 text-amber-600 mx-auto" />
                            <div className="text-[10.5px] font-black text-[#3d2314]">Free Meal & Drink</div>
                            <div className="text-[9px] text-[#6c584c]">Makan & minum harian</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-0.5">
                            <GraduationCap className="w-3.5 h-3.5 text-[#8c5a3c] mx-auto" />
                            <div className="text-[10.5px] font-black text-[#3d2314]">Training Rutin</div>
                            <div className="text-[9px] text-[#6c584c]">Pengembangan skill</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-0.5">
                            <PartyPopper className="w-3.5 h-3.5 text-rose-500 mx-auto" />
                            <div className="text-[10.5px] font-black text-[#3d2314]">Team Gathering</div>
                            <div className="text-[9px] text-[#6c584c]">Acara seru & liburan</div>
                        </div>

                        <div className="bg-[#FAF0E6]/50 p-2.5 rounded-2xl border border-[#e6ccb2]/60 space-y-0.5">
                            <Award className="w-3.5 h-3.5 text-amber-500 mx-auto" />
                            <div className="text-[10.5px] font-black text-[#3d2314]">Diskon Khusus</div>
                            <div className="text-[9px] text-[#6c584c]">Menu & merchandise</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. OUR CULTURE IN ACTION                          */}
            {/* ================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6ccb2]/60 pb-2.5">
                    <div>
                        <h2 className="text-sm sm:text-base font-black text-[#3d2314] uppercase tracking-wide">
                            OUR CULTURE IN ACTION
                        </h2>
                        <p className="text-[11px] text-[#6c584c] font-semibold">Momen keceriaan, kekompakan, dan kolaborasi sehari-hari di To Meet Cafe</p>
                    </div>
                    <button
                        onClick={scrollToPositions}
                        className="px-3.5 py-1.5 bg-[#FAF0E6] hover:bg-[#e6ccb2] text-[#8c5a3c] font-black text-[10.5px] rounded-full transition uppercase tracking-wider self-start sm:self-auto cursor-pointer"
                    >
                        GABUNG BERSAMA KAMI
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-2 rounded-2xl border border-[#e6ccb2]/80 space-y-1 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/hero-home.png" alt="Barista Training" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-black text-[#3d2314]">Barista Training</div>
                    </div>

                    <div className="bg-white p-2 rounded-2xl border border-[#e6ccb2]/80 space-y-1 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/hero-home.png" alt="Playground Crew" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-black text-[#3d2314]">Playground Crew</div>
                    </div>

                    <div className="bg-white p-2 rounded-2xl border border-[#e6ccb2]/80 space-y-1 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/hero-home.png" alt="Birthday Party Support" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-black text-[#3d2314]">Birthday Event Crew</div>
                    </div>

                    <div className="bg-white p-2 rounded-2xl border border-[#e6ccb2]/80 space-y-1 text-center shadow-2xs">
                        <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-[#e6ccb2]/50">
                            <img src="/img/hero-home.png" alt="Team Outing" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-black text-[#3d2314]">Annual Team Outing</div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 6. WHAT OUR TEAM SAYS                             */}
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
                                &quot;Bekerja di sini sangat menyenangkan! Selain belajar teknik kopi tingkat lanjut, melihat tawa anak-anak dan keluarga setiap hari bikin energi selalu terisi penuh.&quot;
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-2 border-t border-[#e6ccb2]/50">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs">
                                DA
                            </div>
                            <div>
                                <div className="font-black text-xs text-[#3d2314]">Dimas Anggara</div>
                                <div className="text-[9.5px] text-[#6c584c] font-semibold">Head Barista • 2 Tahun</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <Quote className="w-5 h-5 text-[#8c5a3c]/30" />
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed italic">
                                &quot;Suasana kerjanya sangat suportif. Manajemen mendengarkan ide-ide kreatif tim, dan peluang karirnya sangat terbuka lebar bagi siapa saja yang berdedikasi.&quot;
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-2 border-t border-[#e6ccb2]/50">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs">
                                SN
                            </div>
                            <div>
                                <div className="font-black text-xs text-[#3d2314]">Siti Nurhaliza</div>
                                <div className="text-[9.5px] text-[#6c584c] font-semibold">Event Coordinator</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-2xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <Quote className="w-5 h-5 text-[#8c5a3c]/30" />
                            <p className="text-[11px] text-[#5a4232] font-semibold leading-relaxed italic">
                                &quot;Mulai dari part-time saat kuliah, sekarang sudah dipercaya memegang tim shift operasional. Pelatihan dan bimbingan mentor di sini luar biasa!&quot;
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-2 border-t border-[#e6ccb2]/50">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#8c5a3c] flex items-center justify-center font-black text-xs">
                                RZ
                            </div>
                            <div>
                                <div className="font-black text-xs text-[#3d2314]">Rizky Pratama</div>
                                <div className="text-[9.5px] text-[#6c584c] font-semibold">Shift Supervisor</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 7. BIG CTA SECTION                                */}
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
                            Kirimkan CV dan portofolio Anda sekarang juga. Mari ciptakan kebahagiaan manis bersama To Meet Cafe & Playground!
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
            {/* MODAL APPLY CV                                    */}
            {/* ================================================= */}
            {isApplyModalOpen && selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-100 overflow-hidden transform transition-all my-auto">

                        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
                            <div>
                                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                                    Lamar Posisi: {selectedJob.title}
                                </h3>
                                <p className="text-[10.5px] text-stone-500 font-medium">
                                    Lokasi: {selectedJob.location} • {selectedJob.type}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsApplyModalOpen(false)}
                                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
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
                                        className="w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#8c5a3c] hover:file:bg-amber-100 transition cursor-pointer"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsApplyModalOpen(false)}
                                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xl transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 bg-[#8c5a3c] hover:bg-[#73482f] text-white text-xs font-bold rounded-2xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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