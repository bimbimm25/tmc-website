import Link from 'next/link';
import {
  Coffee, MapPin, Utensils, Calendar,
  ShoppingBag, Gamepad2, PartyPopper, Sparkles,
  Heart, Star, Compass, Phone, MessageCircle, Clock, Play, ArrowRight, Share2
} from 'lucide-react';

import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

import type { HomeDataResponse, Menu, Event, RobloxMission } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Interface Data Banner dari Backend
interface BannerData {
  id: number;
  page_key: string;
  title?: string | null;
  subtitle?: string | null;
  image?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  is_active: boolean | number;
}

// Helper Komponen: Render string yang mengandung tag <br> atau Enter (\n) menjadi baris baru asli
function FormatTextWithBreak({ text }: { text?: string | null }) {
  if (!text) return null;

  // Memecah teks berdasarkan <br>, <br/>, <br />, atau newline \n
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

// Fetch Data Utama Homepage
async function getHomeData(): Promise<HomeDataResponse['data'] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/home-data`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json: HomeDataResponse = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return null;
  }
}

// Fetch Banner Dinamis dari Dashboard Admin (Target: page_key 'home')
async function getHomeBanner(): Promise<BannerData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/banners/home`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.warn("Banner API offline / fallback used:", error);
    return null;
  }
}

export default async function Home() {
  const [homeData, homeBanner] = await Promise.all([
    getHomeData(),
    getHomeBanner()
  ]);

  const highlightMenus: Menu[] = homeData?.highlight_menus || [];
  const latestEvent: Event | null = homeData?.latest_event || null;
  const activeMission: RobloxMission | null = homeData?.active_mission || null;

  // Tentukan gambar banner (Dinamis dari Dashboard Admin atau Fallback Default)
  const heroBackgroundImage = homeBanner?.image
    ? (homeBanner.image.startsWith('http')
      ? homeBanner.image
      : homeBanner.image.startsWith('/img')
        ? homeBanner.image
        : `${API_BASE_URL}/storage/${homeBanner.image}`)
    : '/img/hero-home.png';

  return (
    <div className="space-y-12 lg:space-y-16 pb-16">

      {/* ================================================= */}
      {/* 1. HERO SECTION (DINAMIS & SUPPORTS <BR>)         */}
      {/* ================================================= */}
      {/* ================================================= */}
      {/* 1. HERO SECTION (PERSIS SESUAI REFERENSI MOBILE)  */}
      {/* ================================================= */}
      <section className="relative w-full h-screen min-h-dvh flex items-center overflow-hidden border-b border-[#e6ccb2]/50">
        {/* 1. Background Cover Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackgroundImage}
            alt="To Meet Cafe Atmosphere"
            className="w-full h-full object-cover object-[75%_center] lg:object-right xl:object-center"
          />

          {/* Gradient Overlay: Lembut di mobile dan solid di desktop agar teks kontras & beruang tetap terlihat utuh */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent w-full sm:w-3/4 lg:w-3/5 xl:w-1/2" />
          <div className="block lg:hidden absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
        </div>

        {/* 2. Konten Hero Text & Action */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-14 sm:pt-16">
          <div className="max-w-md lg:max-w-xl space-y-2.5 sm:space-y-3.5 text-left">

            {/* Pill Badge Mungil */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#e85a4f] text-[9.5px] font-black tracking-wider uppercase border border-[#e6ccb2]/80 shadow-2xs">
              <span>WELCOME TO MEET</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>

            {/* Title Proporsional & Rapi */}
            <h1 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-black text-[#2e170c] tracking-tight leading-[1.18]">
              {homeBanner?.title ? (
                <FormatTextWithBreak text={homeBanner.title} />
              ) : (
                <>
                  More than a cafe, <br />
                  It&apos;s a happy place to meet <br />
                  <span className="text-[#8c5a3c]">& create memories.</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-[14px] text-[#4a3427] font-semibold leading-relaxed max-w-md">
              {homeBanner?.subtitle ? (
                <FormatTextWithBreak text={homeBanner.subtitle} />
              ) : (
                'To Meet is a cozy bear-themed cafe & playground created for everyone to enjoy sweet treats, good times, and heartwarming moments together.'
              )}
            </p>

            {/* Tombol Aksi Kapsul Berdampingan Seperti Referensi */}
            <div className="pt-2 flex flex-row items-center gap-2 sm:gap-3">
              <a
                href="#locations"
                className="px-4 sm:px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:scale-95 text-white font-black rounded-full text-[10.5px] sm:text-xs transition duration-200 shadow-md shadow-rose-500/20 inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer whitespace-nowrap"
              >
                <span>VISIT OUR CAFES</span>
                <MapPin className="w-3.5 h-3.5 shrink-0" />
              </a>

              <a
                href="#adventure"
                className="px-4 sm:px-5 py-2.5 bg-[#3d2314] hover:bg-[#2a170d] active:scale-95 text-white font-black text-[10.5px] sm:text-xs rounded-full transition inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer shadow-md whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>EXPLORE TO MEET</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SECTION: CHOOSE YOUR ADVENTURE                    */}
      {/* ================================================= */}
      <section id="adventure" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Header Title */}
        <div className="text-center space-y-1 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#8c5a3c] tracking-widest uppercase">
            <Compass className="w-4 h-4 text-[#8c5a3c]" />
            <h2>CHOOSE YOUR ADVENTURE</h2>
            <Compass className="w-4 h-4 text-[#8c5a3c]" />
          </div>
        </div>

        {/* Adventure Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 items-stretch">

          {/* 1. Visit Cafe */}
          <a
            href="/visit-us"
            className="bg-white p-3.5 sm:p-4 md:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3">
              <img
                src="/img/icon-visit-cafe.png"
                alt="Visit Cafe"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>

            <div className="w-full flex flex-col justify-end flex-1">
              {/* Slot Judul Terkunci Tinggi (Konsisten 1 atau 2 baris) */}
              <div className="h-8 sm:h-9 flex items-center justify-center">
                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                  VISIT CAFE
                </h3>
              </div>
              {/* Slot Deskripsi Terkunci Tinggi */}
              <div className="h-9 sm:h-11 flex items-center justify-center mt-1">
                <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-snug line-clamp-2">
                  Cek lokasi makan enak, playground, dan santai bareng keluarga.
                </p>
              </div>
            </div>
          </a>

          {/* 2. Menu */}
          <Link
            href="/menu"
            className="bg-white p-3.5 sm:p-4 md:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3">
              <img
                src="/img/icon-menu.png"
                alt="Menu"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>

            <div className="w-full flex flex-col justify-end flex-1">
              <div className="h-8 sm:h-9 flex items-center justify-center">
                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                  MENU
                </h3>
              </div>
              <div className="h-9 sm:h-11 flex items-center justify-center mt-1">
                <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-snug line-clamp-2">
                  Makanan dan minuman lezat yang dibuat penuh cinta.
                </p>
              </div>
            </div>
          </Link>

          {/* 3. Event & Workshop */}
          <Link
            href="/event"
            className="bg-white p-3.5 sm:p-4 md:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3">
              <img
                src="/img/icon-event.png"
                alt="Event & Workshop"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>

            <div className="w-full flex flex-col justify-end flex-1">
              <div className="h-8 sm:h-9 flex items-center justify-center">
                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                  EVENT & WORKSHOP
                </h3>
              </div>
              <div className="h-9 sm:h-11 flex items-center justify-center mt-1">
                <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-snug line-clamp-2">
                  Aktivitas seru, kreasi manis, dan workshop interaktif.
                </p>
              </div>
            </div>
          </Link>

          {/* 4. Merchandise */}
          <Link
            href="/merchandise"
            className="bg-white p-3.5 sm:p-4 md:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3">
              <img
                src="/img/icon-merchandise.png"
                alt="Merchandise"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>

            <div className="w-full flex flex-col justify-end flex-1">
              <div className="h-8 sm:h-9 flex items-center justify-center">
                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                  MERCHANDISE
                </h3>
              </div>
              <div className="h-9 sm:h-11 flex items-center justify-center mt-1">
                <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-snug line-clamp-2">
                  Bawa pulang suvenir dan boneka beruang lucu To Meet.
                </p>
              </div>
            </div>
          </Link>

          {/* 5. Roblox */}
          <Link
            href="/roblox"
            className="bg-white p-3.5 sm:p-4 md:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3">
              <img
                src="/img/icon-roblox.png"
                alt="Roblox"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>

            <div className="w-full flex flex-col justify-end flex-1">
              <div className="h-8 sm:h-9 flex items-center justify-center">
                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                  ROBLOX
                </h3>
              </div>
              <div className="h-9 sm:h-11 flex items-center justify-center mt-1">
                <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-snug line-clamp-2">
                  Jelajahi dunia cafe virtual 3D dan selesaikan misinya!
                </p>
              </div>
            </div>
          </Link>

          {/* 6. Birthday / Private Event */}
          <Link
            href="/birthday"
            className="bg-white p-3.5 sm:p-4 md:p-5 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between group cursor-pointer h-full"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 mb-3">
              <img
                src="/img/icon-birthday.png"
                alt="Birthday / Private Event"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>

            <div className="w-full flex flex-col justify-end flex-1">
              <div className="h-8 sm:h-9 flex items-center justify-center">
                <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                  BIRTHDAY & EVENT
                </h3>
              </div>
              <div className="h-9 sm:h-11 flex items-center justify-center mt-1">
                <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-snug line-clamp-2">
                  Rayakan momen spesial penuh kebahagiaan di To Meet!
                </p>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ================================================= */}
      {/* 3. TODAY'S HIGHLIGHTS                             */}
      {/* ================================================= */}
      <section id="highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs space-y-5">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e6ccb2]/50 pb-3 gap-2">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-2xl font-black text-[#3d2314] flex items-center gap-1.5 uppercase tracking-wide">
                <span>TODAY&apos;S HIGHLIGHTS</span>
                <Heart className="w-4 h-4 text-[#e85a4f] fill-current" />
              </h2>
            </div>

            <Link
              href="/menu"
              className="px-3.5 py-1.5 bg-[#f4ece1] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-black rounded-full text-xs transition duration-200 flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider"
            >
              <span>SEE FULL MENU</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
            {highlightMenus.length > 0 ? (
              highlightMenus.map((menu: Menu) => (
                <div
                  key={menu.id}
                  className="bg-[#FAF0E6]/60 rounded-3xl p-3 sm:p-3.5 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-2.5 relative group hover:shadow-md hover:border-[#8c5a3c] transition duration-200 cursor-pointer"
                >
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 pointer-events-none">
                    {menu.is_bestseller && (
                      <span className="px-2.5 py-0.5 bg-[#d4a373] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        BEST SELLER
                      </span>
                    )}
                    {menu.is_recommended && (
                      <span className="px-2.5 py-0.5 bg-[#e85a4f] text-white text-[8px] font-black uppercase rounded-full shadow-2xs tracking-wider">
                        RECOMMEND
                      </span>
                    )}
                  </div>

                  {/* Gambar Produk: Persegi Rasio 1:1 */}
                  <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative">
                    {menu.image ? (
                      <img
                        src={`${API_BASE_URL}/storage/${menu.image}`}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <Coffee className="w-8 h-8 text-[#e6ccb2]" />
                    )}
                  </div>

                  {/* Detail Info */}
                  <div className="space-y-0.5 pt-0.5">
                    <h3 className="font-black text-[#3d2314] text-xs sm:text-sm truncate">
                      {menu.name}
                    </h3>
                    <div className="font-black text-[#8c5a3c] text-xs sm:text-[13px]">
                      Rp {new Intl.NumberFormat('id-ID').format(menu.price)}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-[#6c584c] font-semibold text-xs bg-[#FAF0E6]/40 rounded-2xl border border-[#e6ccb2]/50">
                Belum ada menu sorotan yang aktif
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* 4. VIDEO EXPERIENCE SECTION (YOUTUBE EMBED)       */}
      {/* ================================================= */}
      <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2.5rem] border border-[#e6ccb2]/80 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

            {/* Kolom Kiri: Video Player Responsive */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-[#e6ccb2]/70 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/EpK4HAGh1zc"
                  loading="lazy"
                  title="Cafe dengan playground anak ter estetik di sidoarjo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Kolom Kanan: Deskripsi & Informasi Video */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4ece1] rounded-full text-[10px] sm:text-xs font-black text-[#8c5a3c] tracking-widest uppercase border border-[#e6ccb2]/80">
                <Play className="w-3 h-3 fill-current text-[#8c5a3c]" />
                <span>EXPERIENCE TO MEET</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight">
                Cafe & Playground Ter-Estetik di Sidoarjo
              </h2>

              <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                Yuk intip keseruan suasana di To Meet Cafe! Nikmati menu makanan & minuman lezat bertema beruang yang menggemaskan, spot foto estetik, serta area playground yang aman dan nyaman untuk si kecil.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href="https://www.youtube.com/watch?v=EpK4HAGh1zc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#c4302b] hover:bg-[#a8241f] text-white font-extrabold rounded-full text-xs transition duration-200 shadow-sm flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <FaYoutube className="w-4 h-4" />
                  <span>WATCH ON YOUTUBE</span>
                </a>
                <a
                  href="#locations"
                  className="px-5 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-extrabold rounded-full text-xs transition duration-200 shadow-sm flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>KUNJUNGI KAMI</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 5. UPCOMING EVENT SECTION (CLEAN SINGLE CARD)     */}
      {/* ================================================= */}
      <section id="event" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-[#e6ccb2]/60 shadow-md">
          <img
            src="/img/HEADER-CLAY-ART.png"
            alt="To Meet Cafe Events & Workshops"
            className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b110d]/90 via-[#1b110d]/70 to-[#1b110d]/35 lg:to-[#1b110d]/20" />

          <div className="relative z-10 grid grid-cols-1 gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-12 lg:items-center lg:px-12 lg:py-12">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#f9d8ac] backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5" />
                <span>EVENTS & WORKSHOPS</span>
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                Temukan Keseruan Event & Workshop Menarik
              </h2>

              <p className="mx-auto max-w-xl text-xs font-semibold leading-relaxed text-stone-100 sm:text-sm lg:mx-0">
                Mulai dari kelas kreasi seni edukatif hingga perayaan ulang tahun spesial keluarga. Cek jadwal kegiatan seru terbaru dan reservasi tempatmu sekarang!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 lg:justify-start">
                <Link
                  href="/event"
                  className="inline-flex items-center gap-2 rounded-full bg-[#8c5a3c] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#8c5a3c]/20 transition hover:bg-[#73482f] active:bg-[#5c3a25]"
                >
                  <span>LIHAT SEMUA EVENT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="https://wa.me/6282141609328?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20info%20event%20dan%20workshop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/90 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#3d2314] shadow-2xs transition hover:bg-[#faf6f0]"
                >
                  <Phone className="h-3.5 w-3.5 fill-current text-[#8c5a3c]" />
                  <span>BOOK VIA WA</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 lg:justify-self-end">
              <div className="mx-auto w-full max-w-sm rounded-[1.75rem] border border-white/20 bg-white/10 p-4 text-left text-white shadow-xl backdrop-blur-md sm:p-5">
                <div className="border-b border-white/20 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#f9d8ac]">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>COMING SOON</span>
                  </span>
                </div>

                <div className="space-y-3 pt-3">
                  <p className="text-xs font-black uppercase leading-snug text-white sm:text-sm">
                    Belum ada event tersedia. Tunggu kegiatan selanjutnya di To Meet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 6. PLAY TO MEET ON ROBLOX                         */}
      {/* ================================================= */}
      <section id="roblox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-[#e6ccb2]/60 shadow-md bg-cover bg-center text-white"
          style={{ backgroundImage: "url('/img/BANNER-ROBLOX.png')" }}
        >
          {/* Overlay agar teks terbaca tajam */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 lg:to-transparent" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Sisi Kiri: Headline & Tombol Aksi */}
            <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase border border-white/30 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ROBLOX UNIVERSE</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-md">
                PLAY TO MEET<br />
                <span className="text-amber-300">ON ROBLOX!</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-100 font-semibold leading-relaxed max-w-xl drop-shadow-xs">
                Jelajahi dunia virtual cafe kami, selesaikan misi mingguan, dan kumpulkan reward menarik bersama teman-teman!
              </p>

              <div className="pt-2">
                <a
                  href={activeMission?.roblox_map_link || 'https://www.roblox.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 sm:px-8 sm:py-3.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white font-black text-xs rounded-full shadow-lg shadow-rose-600/30 transition duration-200 inline-flex items-center gap-2 tracking-wider uppercase cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>PLAY NOW</span>
                </a>
              </div>
            </div>

            {/* Sisi Kanan: Card Misi Aktif dari Admin */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-[#e6ccb2] max-w-sm w-full text-left space-y-3 shadow-xl">

                <div className="flex items-center justify-between text-[#8c5a3c] text-[10px] sm:text-xs font-black uppercase tracking-wider border-b border-[#e6ccb2]/40 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>THIS WEEK&apos;S MISSION</span>
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[9px] font-black">
                    ACTIVE
                  </span>
                </div>

                {activeMission ? (
                  <>
                    <p className="text-xs sm:text-sm font-black text-[#3d2314] leading-snug">
                      {activeMission.title}
                    </p>

                    <div className="text-[11px] text-[#6c584c] font-bold pt-2 border-t border-[#e6ccb2]/40 flex items-center justify-between">
                      <span>Reward:</span>
                      <span className="font-black text-[#8c5a3c] bg-[#f4ece1] px-2.5 py-0.5 rounded-lg border border-[#e6ccb2]/60">
                        {activeMission.reward_title}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm font-black text-[#6c584c] leading-snug">
                    belum ada data misi tersedia
                  </p>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* SECTION: VISIT US (LOCATIONS & CONTACT)           */}
      {/* ================================================= */}
      <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 scroll-mt-24">
        <div className="space-y-6 sm:space-y-8">

          {/* Title Section dengan Spacing Lega */}
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight uppercase">
              VISIT US
            </h2>
            <Heart className="w-5 h-5 text-[#e85a4f] fill-current" />
          </div>

          {/* Cards Container: Grid 3 Kolom di Laptop, Stack di HP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">

            {/* 1. Outlet Heavenland Park */}
            <div className="bg-[#f8f1ea] p-5 sm:p-6 rounded-[2rem] border border-[#d8b598]/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-5 opacity-90">
              <div className="grid grid-cols-12 gap-3.5 items-center">

                {/* Teks Kiri */}
                <div className="col-span-7 space-y-2">
                  <h3 className="font-black text-[#3d2314] text-sm uppercase tracking-wide">
                    HEAVENLAND PARK
                  </h3>
                  <p className="text-[11px] text-[#6c584c] font-bold leading-relaxed">
                    Jl. Raya Prajurit, Heavenland Park<br />
                    Sidoarjo, Jawa Timur
                  </p>
                  <div className="pt-1">
                    <span className="text-[10px] text-[#8c5a3c] font-black uppercase tracking-wider block">
                      Renovasi
                    </span>
                    <span className="text-xs text-[#3d2314] font-black">
                      Cabang sedang di renovasi
                    </span>
                  </div>
                </div>

                {/* Foto Kanan */}
                <div className="col-span-5 aspect-square bg-[#f4ece1] rounded-2xl overflow-hidden border border-[#e6ccb2]/60 shadow-2xs relative">
                  <img
                    src="/img/tmc-heaveland-park.png"
                    alt="To Meet Cafe Heavenland Park"
                    className="w-full h-full object-cover object-center grayscale-[0.3] opacity-80"
                  />
                  <div className="absolute inset-0 bg-[#f4ece1]/30" />
                </div>

              </div>

              {/* Tombol Direction */}
              <div>
                <button
                  type="button"
                  className="w-40 py-2.5 bg-[#c7b0a0] text-white font-black text-[10px] rounded-full text-center transition tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-xs cursor-not-allowed opacity-90"
                  disabled
                >
                  <span>Sedang Renovasi</span>
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Outlet Pondok Mutiara */}
            <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-[#e6ccb2]/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-5">
              <div className="grid grid-cols-12 gap-3.5 items-center">

                {/* Teks Kiri */}
                <div className="col-span-7 space-y-2">
                  <h3 className="font-black text-[#3d2314] text-sm uppercase tracking-wide">
                    PONDOK MUTIARA
                  </h3>
                  <p className="text-[11px] text-[#6c584c] font-bold leading-relaxed">
                    Jl. Pondok Mutiara No.1<br />
                    Sidoarjo, Jawa Timur
                  </p>
                  <div className="pt-1">
                    <span className="text-[10px] text-[#8c5a3c] font-black uppercase tracking-wider block">
                      Open Daily
                    </span>
                    <span className="text-xs text-[#3d2314] font-black">
                      10.00 – 22.00 WIB
                    </span>
                  </div>
                </div>

                {/* Foto Kanan */}
                <div className="col-span-5 aspect-square bg-[#f4ece1] rounded-2xl overflow-hidden border border-[#e6ccb2]/60 shadow-2xs">
                  <img
                    src="/img/tmc-pondok-mutiara.png"
                    alt="To Meet Cafe Pondok Mutiara"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

              </div>

              {/* Tombol Direction */}
              <div>
                <a
                  href="https://maps.app.goo.gl/8mZuEJCFvSwbcALe7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-32 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-xs rounded-full text-center transition tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-xs cursor-pointer"
                >
                  <span>DIRECTION</span>
                  <MapPin className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 3. Social & Contact Card */}
            <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-[#e6ccb2]/80 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">

              {/* Follow Us */}
              <div className="space-y-3 w-full min-w-0">
                {/* Header Title */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#FAF0E6] flex items-center justify-center text-[#e85a4f] shrink-0">
                    <Share2 className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-black text-[#3d2314] uppercase tracking-wider">
                    Follow Our Journey!
                  </span>
                </div>

                {/* Description - Hapus whitespace-nowrap, tambahkan break-words dan max-width */}
                <p className="text-[11px] sm:text-xs text-[#6c584c] font-medium leading-relaxed break-words max-w-sm">
                  Ikuti update menu baru, keseruan workshop, dan promo spesial kami
                </p>

                {/* Social Media Links (Pill / Capsule Style - Auto wrap & adaptif) */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/tomeet.cafe?stkn=NnBva3lubWk5OHFk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF0E6]/80 hover:bg-[#8c5a3c] text-[#3d2314] hover:text-white border border-[#e6ccb2]/80 transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                    title="Instagram @tomeet.cafe"
                  >
                    <div className="w-5 h-5 rounded-full bg-white text-[#e85a4f] group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition shrink-0">
                      <FaInstagram className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-black tracking-tight whitespace-nowrap">Instagram</span>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@tomeet.cafe?_r=1&_t=ZS-99dEumOyfiS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF0E6]/80 hover:bg-[#3d2314] text-[#3d2314] hover:text-white border border-[#e6ccb2]/80 transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                    title="TikTok @tomeet.cafe"
                  >
                    <div className="w-5 h-5 rounded-full bg-white text-[#3d2314] group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition shrink-0">
                      <FaTiktok className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[11px] font-black tracking-tight whitespace-nowrap">TikTok</span>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@tomeetcafe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF0E6]/80 hover:bg-[#e85a4f] text-[#3d2314] hover:text-white border border-[#e6ccb2]/80 transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
                    title="YouTube @tomeetcafe"
                  >
                    <div className="w-5 h-5 rounded-full bg-white text-[#e85a4f] group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition shrink-0">
                      <FaYoutube className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-black tracking-tight whitespace-nowrap">YouTube</span>
                  </a>
                </div>
              </div>

              {/* Chat With Us */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e85a4f]" />
                  <span className="text-xs font-black text-[#3d2314]">Chat with us!</span>
                </div>
                <div>
                  <a
                    href="https://wa.me/6282141609328"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] active:bg-[#449d44] text-white font-black text-xs rounded-full text-center transition flex items-center justify-center gap-2 tracking-wider uppercase shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>CHAT VIA WHATSAPP</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}