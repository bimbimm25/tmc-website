'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Phone, Menu as MenuIcon, X, ChevronDown,
    Utensils, ShoppingBag, Calendar, Gamepad2,
    Sparkles, MapPin, Newspaper, Briefcase, Info, Home,
    HelpCircle
} from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dropdown Desktop States
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Dropdown Mobile States (Accordion)
    const [mobileOfferingsOpen, setMobileOfferingsOpen] = useState(false);
    const [mobileExperiencesOpen, setMobileExperiencesOpen] = useState(false);

    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Deteksi scroll untuk sticky header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 25) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Tutup dropdown saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Tutup drawer & dropdown saat rute berpindah
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
    }, [pathname]);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const isOfferingsActive = isActive('/menu') || isActive('/merchandise');
    const isExperiencesActive = isActive('/event') || isActive('/roblox') || isActive('/birthday');

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
                        ? 'py-2.5 bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#e6ccb2]/60 shadow-xs'
                        : 'py-3.5 sm:py-4 bg-transparent border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">

                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 transition duration-300 ${isScrolled
                                    ? 'bg-[#fffcf7] border border-[#e6ccb2]/80 group-hover:border-[#e85a4f]'
                                    : 'bg-white/90 backdrop-blur-xs border border-white/80'
                                }`}>
                                <img
                                    src="/img/logo-tomeet.png"
                                    alt="To Meet Cafe Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className={`font-black text-xs sm:text-[13px] tracking-[0.2em] uppercase transition-colors duration-200 ${isScrolled
                                    ? 'text-[#3d2314] group-hover:text-[#e85a4f]'
                                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-[#e85a4f]'
                                }`}>
                                TO MEET CAFE
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav ref={dropdownRef} className="hidden xl:flex items-center gap-5 lg:gap-6 text-[10.5px] font-black tracking-wider uppercase">

                            {/* Home */}
                            <Link
                                href="/"
                                className={`transition-colors duration-200 relative py-1 ${isActive('/') && !pathname.includes('about')
                                        ? 'text-[#e85a4f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e85a4f] after:rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                        : isScrolled
                                            ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                            : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                    }`}
                            >
                                HOME
                            </Link>

                            {/* About Us */}
                            <Link
                                href="/about"
                                className={`transition-colors duration-200 relative py-1 ${isActive('/about')
                                        ? 'text-[#e85a4f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e85a4f] after:rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                        : isScrolled
                                            ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                            : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                    }`}
                            >
                                ABOUT US
                            </Link>

                            {/* Dropdown 1: OUR OFFERINGS */}
                            <div
                                className="relative py-1"
                                onMouseEnter={() => setOpenDropdown('offerings')}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === 'offerings' ? null : 'offerings')}
                                    className={`flex items-center gap-1 transition-colors duration-200 cursor-pointer ${isOfferingsActive
                                            ? 'text-[#e85a4f] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                            : isScrolled
                                                ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                                : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                        }`}
                                >
                                    <span>MENU</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'offerings' ? 'rotate-180 text-[#e85a4f]' : ''
                                        }`} />
                                </button>

                                {openDropdown === 'offerings' && (
                                    <div className="absolute top-full left-0 w-52 bg-[#fffcf7] border border-[#e6ccb2] rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <Link
                                            href="/menu"
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${isActive('/menu')
                                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                                }`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#e6ccb2]/60 flex items-center justify-center text-[#e85a4f]">
                                                <Utensils className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <div className="font-black text-[11px] leading-tight">CAFE MENU</div>
                                                <div className="text-[9px] text-[#6c584c] lowercase font-semibold">makanan & minuman</div>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/merchandise"
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${isActive('/merchandise')
                                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                                }`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#e6ccb2]/60 flex items-center justify-center text-[#e85a4f]">
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <div className="font-black text-[11px] leading-tight">MERCHANDISE</div>
                                                <div className="text-[9px] text-[#6c584c] lowercase font-semibold">boneka, topi & aksesoris</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown 2: EXPERIENCES */}
                            <div
                                className="relative py-1"
                                onMouseEnter={() => setOpenDropdown('experiences')}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenDropdown(openDropdown === 'experiences' ? null : 'experiences')}
                                    className={`flex items-center gap-1 transition-colors duration-200 cursor-pointer ${isExperiencesActive
                                            ? 'text-[#e85a4f] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                            : isScrolled
                                                ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                                : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                        }`}
                                >
                                    <span>EXPERIENCES</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'experiences' ? 'rotate-180 text-[#e85a4f]' : ''
                                        }`} />
                                </button>

                                {openDropdown === 'experiences' && (
                                    <div className="absolute top-full left-0 w-60 bg-[#fffcf7] border border-[#e6ccb2] rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <Link
                                            href="/event"
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${isActive('/event')
                                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                                }`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#e6ccb2]/60 flex items-center justify-center text-[#e85a4f]">
                                                <Calendar className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <div className="font-black text-[11px] leading-tight">EVENT & WORKSHOP</div>
                                                <div className="text-[9px] text-[#6c584c] lowercase font-semibold">kegiatan seru cafe</div>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/roblox"
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${isActive('/roblox')
                                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                                }`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#e6ccb2]/60 flex items-center justify-center text-[#e85a4f]">
                                                <Gamepad2 className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <div className="font-black text-[11px] leading-tight">ROBLOX WORLD</div>
                                                <div className="text-[9px] text-[#6c584c] lowercase font-semibold">game & badge rewards</div>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/birthday"
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl transition ${isActive('/birthday')
                                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                                }`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-[#faf6f0] border border-[#e6ccb2]/60 flex items-center justify-center text-[#e85a4f]">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                            </div>
                                            <div>
                                                <div className="font-black text-[11px] leading-tight">BIRTHDAY & PRIVATE</div>
                                                <div className="text-[9px] text-[#6c584c] lowercase font-semibold">sewa tempat & ultah</div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Visit Us */}
                            <Link
                                href="/visit-us"
                                className={`transition-colors duration-200 relative py-1 ${isActive('/visit-us')
                                        ? 'text-[#e85a4f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e85a4f] after:rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                        : isScrolled
                                            ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                            : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                    }`}
                            >
                                VISIT US
                            </Link>

                            {/* Blog */}
                            <Link
                                href="/blog"
                                className={`transition-colors duration-200 relative py-1 ${isActive('/blog')
                                        ? 'text-[#e85a4f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e85a4f] after:rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                        : isScrolled
                                            ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                            : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                    }`}
                            >
                                BLOG
                            </Link>

                            {/* Career */}
                            <Link
                                href="/career"
                                className={`transition-colors duration-200 relative py-1 ${isActive('/career')
                                        ? 'text-[#e85a4f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e85a4f] after:rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                        : isScrolled
                                            ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                            : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                    }`}
                            >
                                CAREER
                            </Link>

                            {/* FAQ */}
                            <Link
                                href="/faq"
                                className={`transition-colors duration-200 relative py-1 ${isActive('/faq')
                                        ? 'text-[#e85a4f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e85a4f] after:rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                                        : isScrolled
                                            ? 'text-[#3d2314] hover:text-[#e85a4f]'
                                            : 'text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-[#e85a4f]'
                                    }`}
                            >
                                FAQ
                            </Link>

                        </nav>

                        {/* WhatsApp CTA Button */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/6282141609328"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:inline-flex px-5 py-2 text-[11px] font-black tracking-wider uppercase rounded-full shadow-md bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white transition-all duration-300 items-center gap-2 shrink-0 cursor-pointer shadow-rose-500/20"
                            >
                                <Phone className="w-3.5 h-3.5 fill-current" />
                                <span>WHATSAPP</span>
                            </a>

                            {/* Hamburger Button (Mobile) */}
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`xl:hidden p-2 rounded-xl transition shadow-2xs backdrop-blur-md cursor-pointer ${isScrolled
                                        ? 'bg-white/90 border border-[#e6ccb2] text-[#3d2314] hover:bg-[#f4ece1]'
                                        : 'bg-black/30 border border-white/30 text-white hover:bg-black/40'
                                    }`}
                                aria-label="Toggle Navigation Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-[#3d2314]/50 backdrop-blur-xs transition-opacity duration-300 xl:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Side Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 w-4/5 max-w-xs h-full bg-[#faf6f0] border-l border-[#e6ccb2] shadow-2xl p-5 flex flex-col justify-between transition-transform duration-300 ease-out overflow-y-auto xl:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="space-y-5">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-white border border-[#e6ccb2]/80 p-1 flex items-center justify-center shadow-2xs">
                                <img
                                    src="/img/logo-tomeet.png"
                                    alt="To Meet Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-black text-[#3d2314] text-xs tracking-wider uppercase">TO MEET CAFE</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1.5 rounded-lg text-[#3d2314] hover:bg-[#f4ece1] transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links Mobile */}
                    <nav className="flex flex-col space-y-1.5 text-xs font-black tracking-wider uppercase">

                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition flex items-center gap-2.5 ${isActive('/') && !pathname.includes('about')
                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                }`}
                        >
                            <Home className="w-4 h-4 text-[#e85a4f]" />
                            <span>HOME</span>
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition flex items-center gap-2.5 ${isActive('/about')
                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                }`}
                        >
                            <Info className="w-4 h-4 text-[#e85a4f]" />
                            <span>ABOUT US</span>
                        </Link>

                        {/* Accordion 1: Our Offerings */}
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setMobileOfferingsOpen(!mobileOfferingsOpen)}
                                className={`w-full p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${isOfferingsActive
                                        ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                        : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Utensils className="w-4 h-4 text-[#e85a4f]" />
                                    <span>MENU</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileOfferingsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileOfferingsOpen && (
                                <div className="pl-6 space-y-1 pt-1">
                                    <Link
                                        href="/menu"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-2 rounded-xl text-[11px] block transition ${isActive('/menu')
                                                ? 'text-[#e85a4f] font-black'
                                                : 'text-[#5a4232] hover:text-[#e85a4f]'
                                            }`}
                                    >
                                        • CAFE MENU
                                    </Link>
                                    <Link
                                        href="/merchandise"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-2 rounded-xl text-[11px] block transition ${isActive('/merchandise')
                                                ? 'text-[#e85a4f] font-black'
                                                : 'text-[#5a4232] hover:text-[#e85a4f]'
                                            }`}
                                    >
                                        • MERCHANDISE
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Accordion 2: Experiences */}
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setMobileExperiencesOpen(!mobileExperiencesOpen)}
                                className={`w-full p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${isExperiencesActive
                                        ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                        : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-4 h-4 text-[#e85a4f]" />
                                    <span>EXPERIENCES</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExperiencesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileExperiencesOpen && (
                                <div className="pl-6 space-y-1 pt-1">
                                    <Link
                                        href="/event"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-2 rounded-xl text-[11px] block transition ${isActive('/event')
                                                ? 'text-[#e85a4f] font-black'
                                                : 'text-[#5a4232] hover:text-[#e85a4f]'
                                            }`}
                                    >
                                        • EVENT & WORKSHOP
                                    </Link>
                                    <Link
                                        href="/roblox"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-2 rounded-xl text-[11px] block transition ${isActive('/roblox')
                                                ? 'text-[#e85a4f] font-black'
                                                : 'text-[#5a4232] hover:text-[#e85a4f]'
                                            }`}
                                    >
                                        • ROBLOX WORLD
                                    </Link>
                                    <Link
                                        href="/birthday"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`p-2 rounded-xl text-[11px] block transition ${isActive('/birthday')
                                                ? 'text-[#e85a4f] font-black'
                                                : 'text-[#5a4232] hover:text-[#e85a4f]'
                                            }`}
                                    >
                                        • BIRTHDAY & PRIVATE
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/visit-us"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition flex items-center gap-2.5 ${isActive('/visit-us')
                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                }`}
                        >
                            <MapPin className="w-4 h-4 text-[#e85a4f]" />
                            <span>VISIT US</span>
                        </Link>

                        <Link
                            href="/blog"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition flex items-center gap-2.5 ${isActive('/blog')
                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                }`}
                        >
                            <Newspaper className="w-4 h-4 text-[#e85a4f]" />
                            <span>BLOG</span>
                        </Link>

                        <Link
                            href="/career"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition flex items-center gap-2.5 ${isActive('/career')
                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                }`}
                        >
                            <Briefcase className="w-4 h-4 text-[#e85a4f]" />
                            <span>CAREER</span>
                        </Link>

                        <Link
                            href="/faq"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition flex items-center gap-2.5 ${isActive('/faq')
                                    ? 'bg-[#fdf3f1] text-[#e85a4f]'
                                    : 'text-[#3d2314] hover:bg-[#fdf3f1] hover:text-[#e85a4f]'
                                }`}
                        >
                            <HelpCircle className="w-4 h-4 text-[#e85a4f]" />
                            <span>FAQ</span>
                        </Link>

                    </nav>
                </div>

                {/* WhatsApp Mobile Footer */}
                <div className="pt-4 border-t border-[#e6ccb2]/60">
                    <a
                        href="https://wa.me/6282141609328"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#e85a4f] hover:bg-[#d4483e] active:bg-[#c33d34] text-white text-xs font-black rounded-full shadow-md text-center flex items-center justify-center gap-2 tracking-wider transition cursor-pointer uppercase"
                    >
                        <Phone className="w-3.5 h-3.5 fill-current" />
                        <span>CHAT VIA WHATSAPP</span>
                    </a>
                </div>
            </div>  
        </>
    );
}