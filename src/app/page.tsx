import Link from 'next/link';
import {
  Coffee, MapPin, Utensils, Calendar,
  ShoppingBag, Gamepad2, PartyPopper, Sparkles,
  Heart, Star, Compass, Phone, MessageCircle, Clock, Play, ArrowRight
} from 'lucide-react';

import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

import type { HomeDataResponse, Menu, Event, RobloxMission } from '@/types/api';

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
    const res = await fetch('http://127.0.0.1:8000/api/home-data', {
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
    const res = await fetch('http://127.0.0.1:8000/api/banners/home', {
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
        : `http://127.0.0.1:8000/storage/${homeBanner.image}`)
    : '/img/hero-home.png';

  return (
    <div className="space-y-12 lg:space-y-16 pb-16 bg-[#faf6f0]">

      {/* ================================================= */}
      {/* 1. HERO SECTION (DINAMIS & SUPPORTS <BR>)         */}
      {/* ================================================= */}
      <section
        className="w-full relative h-[100dvh] lg:h-screen lg:max-h-[800px] flex items-center bg-cover bg-center sm:bg-right bg-no-repeat border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-6 overflow-hidden transition-all duration-300"
        style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
      >
        {/* Soft Overlay Gradien Desktop */}
        <div className="hidden lg:block absolute inset-0 bg-linear-to-r from-[#faf6f0]/95 via-[#faf6f0]/80 to-transparent max-w-2xl lg:max-w-3xl" />

        {/* Soft Overlay HP untuk Kontras Sempurna */}
        <div className="block lg:hidden absolute inset-0 bg-black/25" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">

            {/* Card Kontainer Teks */}
            <div className="lg:col-span-7 bg-[#faf6f0]/95 sm:bg-[#faf6f0]/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 sm:p-8 lg:p-0 rounded-3xl border border-[#e6ccb2]/80 lg:border-none shadow-xl lg:shadow-none space-y-3 sm:space-y-4 text-center sm:text-left">

              <div className="space-y-1 max-w-lg lg:max-w-xl mx-auto sm:mx-0">
                <span className="text-xs sm:text-base lg:text-xl font-extrabold text-[#8c5a3c] tracking-wide block uppercase">
                  Welcome to
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-[#3d2314] tracking-tight leading-[1.15]">
                  {homeBanner?.title ? (
                    <FormatTextWithBreak text={homeBanner.title} />
                  ) : (
                    <>
                      TO MEET<br />
                      <span className="text-[#8c5a3c] lg:text-[#3d2314]">Universe</span>
                    </>
                  )}
                  <Sparkles className="inline-block w-5 h-5 sm:w-7 sm:h-7 ml-1.5 text-[#e85a4f]" />
                </h1>
              </div>

              <p className="text-[11px] sm:text-sm lg:text-base text-[#5a4232] font-extrabold sm:font-bold leading-relaxed max-w-xs sm:max-w-lg mx-auto sm:mx-0">
                {homeBanner?.subtitle ? (
                  <FormatTextWithBreak text={homeBanner.subtitle} />
                ) : (
                  'A cozy cafe, a world of friends, and endless sweet adventures await you!'
                )}
                <Heart className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 text-[#e85a4f] fill-current" />
              </p>

              {/* Tombol CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-1 sm:pt-2">
                <a
                  href="#locations"
                  className="px-5 py-2.5 sm:py-3 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-extrabold rounded-full text-xs sm:text-sm transition duration-200 shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>VISIT OUR CAFE</span>
                </a>
                <a
                  href="#adventure"
                  className="px-5 py-2.5 sm:py-3 bg-[#3d2314] hover:bg-[#281208] text-white font-extrabold rounded-full text-xs sm:text-sm transition duration-200 shadow-md flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
                >
                  <span>EXPLORE TO MEET</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

            {/* Balon Percakapan Statis Beruang (Desktop Only) */}
            <div className="lg:col-span-5 hidden lg:flex justify-end relative h-full">
              <div className="absolute right-8 xl:right-12 -top-12 z-20">
                <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-[#e6ccb2] text-center text-[#3d2314] font-black text-xs inline-flex items-center gap-1.5 relative">
                  <span>Hi, I&apos;m To Meet Bear!</span>
                  <Heart className="w-3.5 h-3.5 text-[#e85a4f] fill-current" />

                  {/* Ekor Balon */}
                  <div className="absolute -bottom-1.5 right-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                </div>
              </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">

          {/* 1. Visit Cafe */}
          <a
            href="#locations"
            className="bg-[#fffcf7] p-4 sm:p-5 md:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img
                src="/img/icon-visit-cafe.png"
                alt="Visit Cafe"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>
            <div className="space-y-1 w-full">
              <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                VISIT CAFE
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-tight max-w-[130px] mx-auto">
                Cek lokasi buat makan yang enak, main, dan seru-seruan bareng keluarga.
              </p>
            </div>
          </a>

          {/* 2. Menu */}
          <Link
            href="/menu"
            className="bg-[#fffcf7] p-4 sm:p-5 md:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img
                src="/img/icon-menu.png"
                alt="Menu"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>
            <div className="space-y-1 w-full">
              <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                MENU
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-tight max-w-[130px] mx-auto">
                Makanan dan minuman yang enak dan dibuat dengan cinta
              </p>
            </div>
          </Link>

          {/* 3. Event & Workshop */}
          <Link
            href="/event"
            className="bg-[#fffcf7] p-4 sm:p-5 md:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img
                src="/img/icon-event.png"
                alt="Event & Workshop"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>
            <div className="space-y-1 w-full">
              <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                EVENT & WORKSHOP
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-tight max-w-[130px] mx-auto">
                Bikin, belajar, dan seru-seruan bareng lewat aktivitas seru di To Meet.
              </p>
            </div>
          </Link>

          {/* 4. Merchandise */}
          <Link
            href="/merchandise"
            className="bg-[#fffcf7] p-4 sm:p-5 md:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img
                src="/img/icon-merchandise.png"
                alt="Merchandise"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>
            <div className="space-y-1 w-full">
              <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                MERCHANDISE
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-tight max-w-[130px] mx-auto">
                Bawa pulang koleksi favoritmu dari To Meet.
              </p>
            </div>
          </Link>

          {/* 5. Roblox */}
          <Link
            href="/roblox"
            className="bg-[#fffcf7] p-4 sm:p-5 md:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img
                src="/img/icon-roblox.png"
                alt="Roblox"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>
            <div className="space-y-1 w-full">
              <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide">
                ROBLOX
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-tight max-w-[130px] mx-auto">
                Yuk, masuk ke dunia To Meet di Roblox dan jelajahi map-nya!
              </p>
            </div>
          </Link>

          {/* 6. Birthday / Private Event */}
          <Link
            href="/birthday"
            className="bg-[#fffcf7] p-4 sm:p-5 md:p-6 rounded-3xl border border-[#e6ccb2]/80 shadow-xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img
                src="/img/icon-birthday.png"
                alt="Birthday / Private Event"
                className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
              />
            </div>
            <div className="space-y-1 w-full">
              <h3 className="font-black text-xs sm:text-sm text-[#3d2314] uppercase tracking-wide leading-tight">
                BIRTHDAY / PRIVATE EVENT
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#6c584c] font-semibold leading-tight max-w-[130px] mx-auto">
                Ulang tahun jadi makin seru kalau dirayain bareng To Meet!
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* ================================================= */}
      {/* 3. TODAY'S HIGHLIGHTS                             */}
      {/* ================================================= */}
      <section id="highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#fffcf7] p-5 sm:p-8 rounded-3xl border border-[#e6ccb2]/70 shadow-2xs space-y-5">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e6ccb2]/50 pb-3 gap-2">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-2xl font-black text-[#3d2314] flex items-center gap-1.5">
                <span>TODAY&apos;S HIGHLIGHTS</span>
                <Heart className="w-4 h-4 text-[#e85a4f]" />
              </h2>
            </div>

            <Link
              href="/menu"
              className="px-3.5 py-1.5 bg-[#f4ece1] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-bold rounded-full text-xs transition duration-200 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>SEE FULL MENU</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlightMenus.length > 0 ? (
              highlightMenus.map((menu: Menu) => (
                <div key={menu.id} className="bg-[#faf6f0] rounded-2xl p-3.5 border border-[#e6ccb2]/60 shadow-2xs flex flex-col justify-between space-y-3 relative group hover:shadow-md transition duration-200">

                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex flex-col gap-1 z-10">
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

                  {/* Gambar Produk */}
                  <div className="w-full h-40 bg-white rounded-xl overflow-hidden border border-[#e6ccb2]/60 flex items-center justify-center relative">
                    {menu.image ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${menu.image}`}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <Coffee className="w-8 h-8 text-[#e6ccb2]" />
                    )}
                  </div>

                  {/* Detail Info */}
                  <div className="space-y-0.5">
                    <h3 className="font-black text-[#3d2314] text-xs sm:text-sm truncate">{menu.name}</h3>
                    <div className="font-black text-[#8c5a3c] text-xs pt-0.5">
                      Rp {new Intl.NumberFormat('id-ID').format(menu.price)}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-[#6c584c] font-semibold text-xs">
                Belum ada data menu terhubung dari Admin Panel.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* 4. VIDEO EXPERIENCE SECTION (YOUTUBE EMBED)       */}
      {/* ================================================= */}
      <section id="experience" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#fffcf7] p-5 sm:p-8 lg:p-10 rounded-[2.5rem] border border-[#e6ccb2]/80 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

            {/* Kolom Kiri: Video Player Responsive */}
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-[#e6ccb2]/70 bg-black">
                <iframe
                  src="https://www.youtube.com/embed/EpK4HAGh1zc"
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
        <div className="bg-[#fffcf7] border border-[#e6ccb2]/80 rounded-[2.5rem] p-5 sm:p-7 lg:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

            {/* Sisi Kiri: Frame Gambar Banner Utuh */}
            <div className="lg:col-span-6 flex justify-center">
              <Link
                href="/event"
                className="group relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-[#e6ccb2]/60 shadow-xs flex items-center justify-center p-3 transition duration-300 hover:border-[#8c5a3c] hover:shadow-md"
              >
                <img
                  src="/img/HEADER-CLAY-ART.png"
                  alt="To Meet Cafe Events & Workshops"
                  className="w-full h-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Sisi Kanan: Konten Informasi & Tombol Aksi */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4ece1] rounded-full text-[10px] sm:text-xs font-black text-[#8c5a3c] tracking-widest uppercase border border-[#e6ccb2]/80">
                <Calendar className="w-3.5 h-3.5 text-[#8c5a3c]" />
                <span>EVENTS & WORKSHOPS</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                Temukan Keseruan Event & Workshop Menarik
              </h2>

              <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed">
                Mulai dari kelas kreasi seni edukatif hingga perayaan ulang tahun spesial keluarga. Cek jadwal kegiatan seru terbaru dan reservasi tempatmu sekarang!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1 justify-center lg:justify-start">
                <Link
                  href="/event"
                  className="px-6 py-2.5 sm:py-3 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-xs rounded-full shadow-md shadow-[#8c5a3c]/15 transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <span>LIHAT SEMUA EVENT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20tanya%20info%20event%20dan%20workshop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 sm:py-3 bg-white hover:bg-[#faf6f0] text-[#3d2314] font-black text-xs rounded-full border border-[#e6ccb2] transition inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#8c5a3c] fill-current" />
                  <span>BOOK VIA WA</span>
                </a>
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
              <div className="bg-[#fffcf7]/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-[#e6ccb2] max-w-sm w-full text-left space-y-3 shadow-xl">

                <div className="flex items-center justify-between text-[#8c5a3c] text-[10px] sm:text-xs font-black uppercase tracking-wider border-b border-[#e6ccb2]/40 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>THIS WEEK&apos;S MISSION</span>
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[9px] font-black">
                    ACTIVE
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-black text-[#3d2314] leading-snug">
                  {activeMission?.title || 'Take a selfie at To Meet Cafe in Roblox!'}
                </p>

                <div className="text-[11px] text-[#6c584c] font-bold pt-2 border-t border-[#e6ccb2]/40 flex items-center justify-between">
                  <span>Reward:</span>
                  <span className="font-black text-[#8c5a3c] bg-[#f4ece1] px-2.5 py-0.5 rounded-lg border border-[#e6ccb2]/60">
                    {activeMission?.reward_title || 'Free EXP / Sticker'}
                  </span>
                </div>

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
            <div className="bg-[#fcf7f0] p-5 sm:p-6 rounded-[2rem] border border-[#e6ccb2]/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-5">
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
                    src="/img/tmc-heaveland-park.png"
                    alt="To Meet Cafe Heavenland Park"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

              </div>

              {/* Tombol Direction */}
              <div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-32 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] active:bg-[#5c3a25] text-white font-black text-xs rounded-full text-center transition tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-xs cursor-pointer"
                >
                  <span>DIRECTION</span>
                  <MapPin className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Outlet Pondok Mutiara */}
            <div className="bg-[#fcf7f0] p-5 sm:p-6 rounded-[2rem] border border-[#e6ccb2]/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-5">
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
                  href="https://maps.google.com"
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
            <div className="bg-[#fcf7f0] p-5 sm:p-6 rounded-[2rem] border border-[#e6ccb2]/80 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">

              {/* Follow Us */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e85a4f]" />
                  <span className="text-xs font-black text-[#3d2314]">Follow us!</span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#3d2314] text-white flex items-center justify-center hover:bg-[#8c5a3c] transition duration-200 shadow-2xs"
                    title="Instagram"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#3d2314] text-white flex items-center justify-center hover:bg-[#8c5a3c] transition duration-200 shadow-2xs"
                    title="TikTok"
                  >
                    <FaTiktok className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://youtube.com/@tomeetcafe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#3d2314] text-white flex items-center justify-center hover:bg-[#8c5a3c] transition duration-200 shadow-2xs"
                    title="YouTube"
                  >
                    <FaYoutube className="w-4 h-4" />
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
                    href="https://wa.me/628123456789"
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