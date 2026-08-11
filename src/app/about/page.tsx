import Link from 'next/link';
import {
    Heart, Users, Sparkles, Award, MapPin,
    Calendar, ShoppingBag, Gamepad2,
    Smile, Utensils, Star, ExternalLink
} from 'lucide-react';

// Custom SVG Icons (Nol Emoji)
function BearPawIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-2.8 0-5 1.8-5 4 0 1.2.7 2 1.8 2 1.3 0 2.2-.6 3.2-.6s1.9.6 3.2.6c1.1 0 1.8-.8 1.8-2 0-2.2-2.2-4-5-4zm-5.5-3.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2S5 7.4 5 8.5s.7 2 1.5 2zm11 0c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2zm-7.5-3c.9 0 1.6-1.1 1.6-2.5S10.9 2.5 10 2.5 8.4 3.6 8.4 5s.7 2.5 1.6 2.5zm4 0c.9 0 1.6-1.1 1.6-2.5s-.7-2.5-1.6-2.5-1.6 1.1-1.6 2.5.7 2.5 1.6 2.5z" />
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

export default function AboutPage() {
    return (
        <div className="bg-[#faf6f0] min-h-screen overflow-hidden space-y-0">

            {/* ================================================= */}
            {/* 1. HERO SECTION (100% PAS PRESISI 1 LAYAR LAPTOP) */}
            {/* ================================================= */}
            <section className="w-full relative h-screen min-h-[600px] flex items-center bg-[#faf6f0] border-b border-[#e6ccb2]/60 pt-20 pb-6 lg:py-0 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

                        {/* Teks Content Kiri */}
                        <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-center lg:text-left order-2 lg:order-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#e85a4f] text-[10px] font-black border border-[#e6ccb2]/80 shadow-2xs">
                                <span>ABOUT TO MEET</span>
                                <BearPawIcon className="w-3.5 h-3.5" />
                            </div>

                            <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black text-[#3d2314] tracking-tight leading-[1.15]">
                                More than a cafe,<br />
                                It&apos;s a happy place to meet & create memories.
                                <Heart className="inline-block w-5 h-5 sm:w-6 sm:h-6 ml-2 text-[#e85a4f] fill-transparent" strokeWidth={3} />
                            </h1>

                            <p className="text-xs sm:text-sm text-[#5a4232] leading-relaxed font-bold max-w-md mx-auto lg:mx-0">
                                To Meet is a cozy bear-themed cafe & playground created for everyone to enjoy sweet treats, good times, and heartwarming moments together.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                                <a
                                    href="#story"
                                    className="px-6 py-2.5 sm:py-3 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-extrabold rounded-full text-xs transition duration-200 shadow-md shadow-rose-500/20 flex items-center gap-2 tracking-wider"
                                >
                                    <span>OUR STORY</span>
                                    <BearPawIcon className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Gambar Kanan Separuh */}
                        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-lg aspect-[4/3] lg:aspect-[16/11] rounded-[2.25rem] overflow-hidden shadow-xl border-4 border-white">
                                <img
                                    src="/img/hero-home.png"
                                    alt="To Meet Cafe Atmosphere"
                                    className="w-full h-full object-cover object-right"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 2. OUR STORY SECTION                              */}
            {/* ================================================= */}
            <section id="story" className="w-full py-16 lg:py-20 bg-white border-b border-[#e6ccb2]/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

                        <div className="lg:col-span-6 flex justify-center">
                            <div className="w-full max-w-md aspect-[4/3] bg-[#f4ece1] rounded-[2rem] border border-[#e6ccb2] flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-2xs relative">
                                <div className="absolute top-4 left-4 text-[#e85a4f]/20"><Heart className="w-12 h-12 fill-current" /></div>
                                <div className="absolute bottom-4 right-4 text-[#8c5a3c]/10"><BearPawIcon className="w-16 h-16" /></div>

                                <div className="w-16 h-16 rounded-2xl bg-white text-[#8c5a3c] flex items-center justify-center shadow-md relative z-10 border border-[#e6ccb2]/60">
                                    <BearFaceIcon className="w-8 h-8" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-lg text-[#3d2314] tracking-tight">TO MEET STORE</h4>
                                    <p className="text-xs text-[#6c584c] font-semibold mt-1">The first warm place we built.</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 text-[#e85a4f] font-black tracking-widest text-[11px] uppercase">
                                <span>OUR STORY</span>
                                <BearPawIcon className="w-3.5 h-3.5" />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-[#3d2314] tracking-tight">
                                How To Meet Universe Started
                            </h2>

                            <div className="space-y-3 text-xs sm:text-sm text-[#5a4232] font-semibold leading-relaxed">
                                <p>
                                    To Meet started with a simple dream — to create a place where people can come together, relax, and feel at home.
                                </p>
                                <p>
                                    From our very first cafe, we put our hearts into every little detail: from our bear friends, cozy interior, to the treats we serve.
                                </p>
                                <p>
                                    Today, To Meet is more than just a cafe. It&apos;s a space for laughter, celebrations, creativity, and unforgettable memories.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 3. OUR MISSION & VALUES                           */}
            {/* ================================================= */}
            <section className="w-full py-16 lg:py-20 bg-[#faf6f0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        <div className="lg:col-span-3 text-center lg:text-left space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                OUR MISSION<br />& VALUES
                                <Heart className="inline-block w-5 h-5 ml-2 text-[#e85a4f] fill-[#e85a4f]" />
                            </h2>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">

                            <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-3">
                                <div className="w-10 h-10 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <BearFaceIcon className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">HAPPINESS</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We create happiness in every bite, every sip, and every moment.
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-3">
                                <div className="w-10 h-10 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">TOGETHERNESS</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We believe in the joy of being together and building connections.
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-3">
                                <div className="w-10 h-10 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <BearPawIcon className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">CREATIVITY</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We inspire creativity through fun experiences, activities, and designs.
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2]/60 shadow-2xs text-center space-y-3">
                                <div className="w-10 h-10 rounded-full bg-[#fdf3f1] text-[#e85a4f] flex items-center justify-center mx-auto">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-xs text-[#3d2314] uppercase tracking-wide">QUALITY</h4>
                                <p className="text-[10px] text-[#6c584c] font-semibold leading-relaxed">
                                    We are committed to quality in our food, service, and environment.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 4. TO MEET UNIVERSE ECOSYSTEM                     */}
            {/* ================================================= */}
            <section className="w-full py-16 lg:py-20 bg-white border-y border-[#e6ccb2]/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        <div className="lg:col-span-3 text-center lg:text-left space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                TO MEET<br />UNIVERSE
                                <Sparkles className="inline-block w-5 h-5 ml-2 text-[#e85a4f]" />
                            </h2>
                            <p className="text-xs text-[#6c584c] font-semibold leading-relaxed">
                                To Meet Universe is our world filled with bear friends, cozy places, and exciting adventures.
                            </p>
                            <div className="pt-1">
                                <a
                                    href="/#roblox"
                                    className="px-5 py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-extrabold rounded-full text-[10px] uppercase transition duration-200 shadow-sm inline-flex items-center gap-1.5"
                                >
                                    <span>EXPLORE ROBLOX MAP</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-5 gap-3.5">

                            <div className="space-y-2.5 text-center">
                                <div className="w-full aspect-[4/5] bg-[#faf6f0] rounded-2xl flex items-center justify-center border border-[#e6ccb2]/60">
                                    <MapPin className="w-7 h-7 text-[#8c5a3c]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] text-[#3d2314] uppercase">CAFE & PLAYGROUND</h4>
                                    <p className="text-[9px] text-[#6c584c] font-semibold mt-0.5">Enjoy yummy food & drinks in a fun playground!</p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-center">
                                <div className="w-full aspect-[4/5] bg-[#faf6f0] rounded-2xl flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Gamepad2 className="w-7 h-7 text-[#8c5a3c]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] text-[#3d2314] uppercase">ROBLOX WORLD</h4>
                                    <p className="text-[9px] text-[#6c584c] font-semibold mt-0.5">Step into our virtual world on Roblox and play!</p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-center">
                                <div className="w-full aspect-[4/5] bg-[#faf6f0] rounded-2xl flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Calendar className="w-7 h-7 text-[#8c5a3c]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] text-[#3d2314] uppercase">EVENTS & WORKSHOPS</h4>
                                    <p className="text-[9px] text-[#6c584c] font-semibold mt-0.5">Join our exciting events and creative workshops!</p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-center">
                                <div className="w-full aspect-[4/5] bg-[#faf6f0] rounded-2xl flex items-center justify-center border border-[#e6ccb2]/60">
                                    <ShoppingBag className="w-7 h-7 text-[#8c5a3c]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] text-[#3d2314] uppercase">MERCHANDISE</h4>
                                    <p className="text-[9px] text-[#6c584c] font-semibold mt-0.5">Take home our cute merch and keep memories.</p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-center col-span-2 md:col-span-1">
                                <div className="w-full aspect-[4/5] bg-[#faf6f0] rounded-2xl flex items-center justify-center border border-[#e6ccb2]/60">
                                    <Heart className="w-7 h-7 text-[#8c5a3c]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-[10px] text-[#3d2314] uppercase">SWEET MEMORIES</h4>
                                    <p className="text-[9px] text-[#6c584c] font-semibold mt-0.5">Because at To Meet, every moment is sweet.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* 5. WHAT MAKES US SPECIAL & STATS                  */}
            {/* ================================================= */}
            <section className="w-full py-16 bg-[#faf6f0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#fffcf7] p-6 lg:p-8 rounded-3xl border border-[#e6ccb2]/60 shadow-2xs">
                        <div className="lg:col-span-3 text-center lg:text-left">
                            <h2 className="text-xl sm:text-2xl font-black text-[#3d2314] tracking-tight leading-tight uppercase">
                                WHAT MAKES<br />US SPECIAL?
                                <Sparkles className="inline-block w-4 h-4 ml-2 text-[#e85a4f]" />
                            </h2>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <BearFaceIcon className="w-7 h-7 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[11px] text-[#3d2314] uppercase">BEAR THEME</h4>
                                    <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5">Our lovable bear friends are everywhere!</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <Smile className="w-7 h-7 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[11px] text-[#3d2314] uppercase">COZY VIBES</h4>
                                    <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5">Warm, aesthetic, and instagrammable place.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <Utensils className="w-7 h-7 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[11px] text-[#3d2314] uppercase">DELICIOUS TREATS</h4>
                                    <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5">Made with love using quality ingredients.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3">
                                <Users className="w-7 h-7 text-[#8c5a3c] shrink-0" />
                                <div>
                                    <h4 className="font-black text-[11px] text-[#3d2314] uppercase">FOR EVERYONE</h4>
                                    <p className="text-[10px] text-[#6c584c] font-semibold mt-0.5">Kids, teens, families — all welcome!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#fdf3f1] p-6 sm:p-8 rounded-3xl border border-rose-100/60 text-center shadow-2xs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f] mb-0.5">
                                    <Star className="w-4 h-4" />
                                    <span className="text-2xl sm:text-3xl font-black">5+</span>
                                </div>
                                <div className="text-[11px] font-black text-[#3d2314] uppercase">YEARS OF HAPPINESS</div>
                                <p className="text-[9px] text-[#6c584c] font-semibold">Thank you for being part of our journey!</p>
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f] mb-0.5">
                                    <Smile className="w-4 h-4" />
                                    <span className="text-2xl sm:text-3xl font-black">50K+</span>
                                </div>
                                <div className="text-[11px] font-black text-[#3d2314] uppercase">HAPPY CUSTOMERS</div>
                                <p className="text-[9px] text-[#6c584c] font-semibold">We&apos;re grateful for all your love & support!</p>
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f] mb-0.5">
                                    <BearPawIcon className="w-4 h-4" />
                                    <span className="text-2xl sm:text-3xl font-black">10+</span>
                                </div>
                                <div className="text-[11px] font-black text-[#3d2314] uppercase">EVENTS EACH MONTH</div>
                                <p className="text-[9px] text-[#6c584c] font-semibold">Creating fun and memorable experiences!</p>
                            </div>

                            <div className="space-y-0.5">
                                <div className="flex items-center justify-center gap-1 text-[#e85a4f] mb-0.5">
                                    <Heart className="w-4 h-4 fill-current" />
                                    <span className="text-2xl sm:text-3xl font-black">1</span>
                                </div>
                                <div className="text-[11px] font-black text-[#3d2314] uppercase">BIG FAMILY</div>
                                <p className="text-[9px] text-[#6c584c] font-semibold">Because To Meet is more than just a place.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================================================= */}
            {/* 6. BOTTOM CTA SECTION                             */}
            {/* ================================================= */}
            <section className="w-full pb-16 bg-[#faf6f0]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-[#3d2314]">
                            Let&apos;s create more sweet memories together!
                        </h3>
                        <p className="text-xs text-[#6c584c] font-semibold">
                            Come, meet, enjoy, and be part of the To Meet family.
                        </p>
                    </div>

                    <div className="flex justify-center pt-1">
                        <Link
                            href="/#locations"
                            className="px-7 py-3 bg-[#e85a4f] hover:bg-[#d4483e] text-white font-extrabold rounded-full text-xs transition duration-200 shadow-md shadow-rose-500/20 inline-flex items-center gap-2 tracking-wider"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>VISIT OUR CAFES</span>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}