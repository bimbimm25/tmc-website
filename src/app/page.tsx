import {
  Coffee, MapPin, Utensils, Calendar,
  ShoppingBag, Gamepad2, PartyPopper, Sparkles,
  Heart, Star, Compass, Phone, MessageCircle
} from 'lucide-react';
import type { HomeDataResponse, Menu, Event, RobloxMission } from '@/types/api';

// Custom SVG Social Icons
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 2.5 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 2.5 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

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

export default async function Home() {
  const homeData = await getHomeData();

  const highlightMenus: Menu[] = homeData?.highlight_menus || [];
  const latestEvent: Event | null = homeData?.latest_event || null;
  const activeMission: RobloxMission | null = homeData?.active_mission || null;

  return (
    <div className="space-y-12 lg:space-y-16 pb-16 bg-[#faf6f0]">

      {/* ================================================= */}
      {/* 1. HERO SECTION (PAS 100% SE-LAYAR DI SEMUA HP)   */}
      {/* ================================================= */}
      <section
        className="w-full relative h-[100dvh] lg:h-screen lg:max-h-[800px] flex items-center bg-cover bg-center sm:bg-right bg-no-repeat border-b border-[#e6ccb2]/60 pt-16 sm:pt-20 pb-6 overflow-hidden"
        style={{ backgroundImage: "url('/img/hero-home.png')" }}
      >
        {/* Soft Overlay Gradien Desktop */}
        <div className="hidden lg:block absolute inset-0 bg-linear-to-r from-[#faf6f0]/95 via-[#faf6f0]/80 to-transparent max-w-2xl lg:max-w-3xl" />

        {/* Soft Overlay HP untuk Kontras Sempurna */}
        <div className="block lg:hidden absolute inset-0 bg-black/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">

            {/* Card Kontainer Teks - Pas & Compact di HP, Clean di Laptop */}
            <div className="lg:col-span-7 bg-[#faf6f0]/95 sm:bg-[#faf6f0]/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 sm:p-8 lg:p-0 rounded-3xl border border-[#e6ccb2]/80 lg:border-none shadow-xl lg:shadow-none space-y-3 sm:space-y-4 text-center sm:text-left">

              <div className="space-y-1 max-w-lg lg:max-w-xl mx-auto sm:mx-0">
                <span className="text-xs sm:text-base lg:text-xl font-extrabold text-[#8c5a3c] tracking-wide block uppercase">
                  Welcome to
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-[#3d2314] tracking-tight leading-[1.15]">
                  TO MEET<br />
                  <span className="text-[#8c5a3c] lg:text-[#3d2314]">Universe</span>
                  <Sparkles className="inline-block w-5 h-5 sm:w-7 sm:h-7 ml-1.5 text-[#e85a4f]" />
                </h1>
              </div>

              <p className="text-[11px] sm:text-sm lg:text-base text-[#5a4232] font-extrabold sm:font-bold leading-relaxed max-w-xs sm:max-w-lg mx-auto sm:mx-0">
                A cozy cafe, a world of friends, and endless sweet adventures await you!
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
      {/* 2. CHOOSE YOUR ADVENTURE                          */}
      {/* ================================================= */}
      <section id="adventure" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#8c5a3c] tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>CHOOSE YOUR ADVENTURE</span>
            <Compass className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          <a href="#locations" className="bg-[#fffcf7] p-4 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">VISIT CAFE</h3>
              <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5 leading-tight">Enjoy our cozy place, food & playground</p>
            </div>
          </a>

          <a href="#highlights" className="bg-[#fffcf7] p-4 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">MENU</h3>
              <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5 leading-tight">Delicious food & drinks made with love</p>
            </div>
          </a>

          <a href="#event" className="bg-[#fffcf7] p-4 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">EVENT & WORKSHOP</h3>
              <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5 leading-tight">Fun activities & creative workshops</p>
            </div>
          </a>

          <a href="#adventure" className="bg-[#fffcf7] p-4 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">MERCHANDISE</h3>
              <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5 leading-tight">Cute collections just for you!</p>
            </div>
          </a>

          <a href="#roblox" className="bg-[#fffcf7] p-4 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">ROBLOX</h3>
              <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5 leading-tight">Play, explore, and complete missions!</p>
            </div>
          </a>

          <a href="#event" className="bg-[#fffcf7] p-4 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs hover:shadow-md hover:border-[#8c5a3c] transition duration-200 text-center flex flex-col items-center justify-between space-y-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ece1] text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">BIRTHDAY / PRIVATE EVENT</h3>
              <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5 leading-tight">Make your special day unforgettable</p>
            </div>
          </a>

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

            <a
              href="#adventure"
              className="px-3.5 py-1.5 bg-[#f4ece1] hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-bold rounded-full text-xs transition duration-200 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>SEE FULL MENU</span>
              <Sparkles className="w-3.5 h-3.5" />
            </a>
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
      {/* 4. UPCOMING EVENT BANNER                          */}
      {/* ================================================= */}
      <section id="event" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f4ece1] border border-[#e6ccb2] rounded-3xl p-5 sm:p-8 text-[#3d2314] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 text-[#8c5a3c] text-[10px] font-black uppercase rounded-full tracking-wider border border-[#e6ccb2]">
              <Calendar className="w-3 h-3" />
              <span>UPCOMING EVENT</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase">
              {latestEvent?.title || 'CLAY ART DIY'}
              <Sparkles className="inline-block w-5 h-5 ml-1 text-amber-600" />
            </h2>

            <p className="text-xs sm:text-sm text-[#6c584c] font-semibold leading-relaxed max-w-xl">
              {latestEvent?.description || 'Create your own clay bear and take it home! Join our fun creative workshop for all ages.'}
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/628123456789?text=Halo%20To%20Meet%20Cafe,%20saya%20mau%20booking%20event%20${encodeURIComponent(latestEvent?.title || 'Clay Art DIY')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#3d2314] hover:bg-[#251208] text-white font-black text-xs rounded-full shadow-sm transition duration-200 inline-flex items-center gap-2 tracking-wider uppercase cursor-pointer"
              >
                <span>BOOK NOW VIA WHATSAPP</span>
                <Phone className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end gap-3">
            <div className="w-32 h-40 bg-white p-2 rounded-2xl shadow-sm transform -rotate-3 hover:rotate-0 transition duration-200 text-[#3d2314] text-center flex flex-col justify-between border border-[#e6ccb2]">
              <div className="w-full h-28 bg-[#faf6f0] rounded-xl flex items-center justify-center font-black text-[10px] text-[#8c5a3c]">
                CLAY BEAR
              </div>
              <span className="text-[8px] font-black uppercase tracking-wide">CLAY WORKSHOP</span>
            </div>
            <div className="w-32 h-40 bg-white p-2 rounded-2xl shadow-sm transform rotate-3 hover:rotate-0 transition duration-200 text-[#3d2314] text-center flex flex-col justify-between border border-[#e6ccb2]">
              <div className="w-full h-28 bg-[#f4ece1] rounded-xl flex items-center justify-center font-black text-[10px] text-[#8c5a3c]">
                BEAR CRAFT
              </div>
              <span className="text-[8px] font-black uppercase tracking-wide">DIY ART</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* 5. PLAY TO MEET ON ROBLOX                         */}
      {/* ================================================= */}
      <section id="roblox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#d0e1f9] border border-blue-200 rounded-3xl p-5 sm:p-8 text-[#1e3a8a] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase">
              PLAY TO MEET<br />
              <span className="text-blue-700">ON ROBLOX!</span>
            </h2>

            <p className="text-xs sm:text-sm text-blue-900/80 font-semibold leading-relaxed max-w-xl">
              Explore the cafe, complete missions, collect rewards, and have fun!
            </p>

            <div className="pt-2">
              <a
                href={activeMission?.roblox_map_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#c28457] hover:bg-[#a86a3d] text-white font-black text-xs rounded-full shadow-sm transition duration-200 inline-flex items-center gap-2 tracking-wider uppercase cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>PLAY NOW</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-blue-100 max-w-xs w-full text-left space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-[#8c5a3c] text-[10px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  THIS WEEK&apos;S MISSION
                </span>
              </div>
              <p className="text-xs font-black text-[#3d2314]">
                {activeMission?.title || 'Take a selfie at To Meet Cafe in Roblox!'}
              </p>
              <div className="text-[10px] text-[#6c584c] font-bold pt-1 border-t border-stone-100 flex items-center justify-between">
                <span>Reward:</span>
                <span className="font-black text-[#8c5a3c]">{activeMission?.reward_title || '100 EXP'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* 6. VISIT US (OUTLETS & CONTACT)                   */}
      {/* ================================================= */}
      <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">

          <div className="text-center space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] inline-flex items-center gap-1.5">
              <span>VISIT US</span>
              <Heart className="w-4 h-4 text-[#e85a4f]" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Outlet 1 */}
            <div className="bg-[#fffcf7] p-5 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-black text-[#3d2314] text-sm uppercase">HEAVENLAND PARK</h3>
                <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                  Jl. Raya Prajurit, Heavenland Park, Sidoarjo, Jawa Timur
                </p>
                <div className="text-[11px] font-black text-[#8c5a3c] pt-1">
                  Open Daily: 10.00 - 22.00 WIB
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-full text-center transition tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>DIRECTION</span>
              </a>
            </div>

            {/* Outlet 2 */}
            <div className="bg-[#fffcf7] p-5 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-black text-[#3d2314] text-sm uppercase">PONDOK MUTIARA</h3>
                <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                  Jl. Pondok Mutiara No.1, Sidoarjo, Jawa Timur
                </p>
                <div className="text-[11px] font-black text-[#8c5a3c] pt-1">
                  Open Daily: 10.00 - 22.00 WIB
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white font-black text-xs rounded-full text-center transition tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>DIRECTION</span>
              </a>
            </div>

            {/* Social & Contact Card */}
            <div className="bg-[#fffcf7] p-5 rounded-2xl border border-[#e6ccb2]/70 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider block">Follow us!</span>
                  <div className="flex items-center gap-2">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#f4ece1] text-[#3d2314] flex items-center justify-center hover:bg-[#8c5a3c] hover:text-white transition">
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#f4ece1] text-[#3d2314] flex items-center justify-center hover:bg-[#8c5a3c] hover:text-white transition">
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-black text-[#8c5a3c] uppercase tracking-wider block">Chat with us!</span>
                  <a
                    href="https://wa.me/628123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-full text-center transition flex items-center justify-center gap-1.5 tracking-wider uppercase shadow-2xs"
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

      {/* ================================================= */}
      {/* 7. FOLLOW OUR JOURNEY & INSTAGRAM CTA            */}
      {/* ================================================= */}
      <section id="journey" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-5">

          <div className="text-center space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#8c5a3c] tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>FOLLOW OUR JOURNEY</span>
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-36 bg-[#f4ece1] rounded-2xl overflow-hidden border border-[#e6ccb2]/80 shadow-2xs flex items-center justify-center group relative"
              >
                <div className="w-9 h-9 rounded-xl bg-white/90 text-[#8c5a3c] flex items-center justify-center group-hover:scale-105 transition duration-200 shadow-2xs">
                  <Coffee className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white hover:bg-[#8c5a3c] hover:text-white text-[#8c5a3c] font-black text-xs rounded-full border border-[#8c5a3c] transition duration-200 inline-flex items-center gap-2 shadow-2xs tracking-wider uppercase cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>FOLLOW US ON INSTAGRAM</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}