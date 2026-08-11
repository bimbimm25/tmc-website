'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Phone, Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Deteksi posisi scroll untuk efek sticky header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper untuk mengecek apakah rute sedang aktif
    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
                        ? 'py-2 bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#e6ccb2]/60 shadow-xs'
                        : 'py-4 bg-transparent border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16 transition-all duration-300">

                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#8c5a3c] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition duration-300">
                                <Coffee className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <span className="font-black text-[#3d2314] text-sm sm:text-base tracking-wide block leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                                    TOMEET
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-extrabold text-[#8c5a3c] uppercase tracking-widest block mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                                    CAFE & PLAYGROUND
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links - Dengan Active Indicator Berbeda Warna */}
                        <nav className="hidden xl:flex items-center gap-6 lg:gap-7 text-[10px] lg:text-[11px] font-black tracking-widest uppercase">

                            <Link
                                href="/"
                                className={`transition-colors duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] relative py-1 ${isActive('/') && !pathname.includes('about')
                                        ? 'text-[#8c5a3c] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#8c5a3c] after:rounded-full'
                                        : 'text-[#3d2314] hover:text-[#8c5a3c]'
                                    }`}
                            >
                                HOME
                            </Link>

                            <Link
                                href="/about"
                                className={`transition-colors duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] relative py-1 ${isActive('/about')
                                        ? 'text-[#8c5a3c] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#8c5a3c] after:rounded-full'
                                        : 'text-[#3d2314] hover:text-[#8c5a3c]'
                                    }`}
                            >
                                ABOUT US
                            </Link>

                            <Link
                                href="/menu"
                                className="text-[#3d2314] hover:text-[#8c5a3c] transition duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            >
                                MENU
                            </Link>

                            <Link
                                href="/#event"
                                className="text-[#3d2314] hover:text-[#8c5a3c] transition duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            >
                                EVENT & WORKSHOP
                            </Link>

                            <Link
                                href="/#adventure"
                                className="text-[#3d2314] hover:text-[#8c5a3c] transition duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            >
                                MERCHANDISE
                            </Link>

                            <Link
                                href="/#roblox"
                                className="text-[#3d2314] hover:text-[#8c5a3c] transition duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            >
                                ROBLOX
                            </Link>

                            <Link
                                href="/#event"
                                className="text-[#3d2314] hover:text-[#8c5a3c] transition duration-200 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            >
                                BIRTHDAY
                            </Link>

                        </nav>

                        {/* Actions & WhatsApp CTA */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/628123456789"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:inline-flex px-5 py-2.5 bg-[#8c5a3c] hover:bg-[#73482f] text-white text-[11px] font-black rounded-full shadow-md shadow-[#8c5a3c]/20 transition-all duration-300 items-center gap-2 shrink-0 cursor-pointer"
                            >
                                <Phone className="w-3.5 h-3.5 fill-current" />
                                <span>WHATSAPP</span>
                            </a>

                            {/* Hamburger Button (Mobile Only) */}
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="xl:hidden p-2 rounded-xl bg-white/80 border border-[#e6ccb2] text-[#3d2314] hover:bg-[#f4ece1] transition shadow-2xs backdrop-blur-md"
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
                className={`fixed inset-0 z-40 bg-[#3d2314]/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content Side Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 w-4/5 max-w-xs h-full bg-[#faf6f0] border-l border-[#e6ccb2] shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out xl:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#e6ccb2]/60 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#8c5a3c] text-white flex items-center justify-center font-bold">
                                <Coffee className="w-4 h-4" />
                            </div>
                            <span className="font-black text-[#3d2314] text-xs">TOMEET</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1.5 rounded-lg text-[#3d2314] hover:bg-[#f4ece1] transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-2.5 text-xs font-black tracking-wider uppercase">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition ${isActive('/') && !pathname.includes('about')
                                    ? 'bg-[#f4ece1] text-[#8c5a3c] font-black'
                                    : 'text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c]'
                                }`}
                        >
                            HOME
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`p-2.5 rounded-xl transition ${isActive('/about')
                                    ? 'bg-[#f4ece1] text-[#8c5a3c] font-black'
                                    : 'text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c]'
                                }`}
                        >
                            ABOUT US
                        </Link>

                        <Link
                            href="/#adventure"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2.5 rounded-xl text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c] transition"
                        >
                            MENU
                        </Link>

                        <Link
                            href="/#event"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2.5 rounded-xl text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c] transition"
                        >
                            EVENT & WORKSHOP
                        </Link>

                        <Link
                            href="/#adventure"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2.5 rounded-xl text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c] transition"
                        >
                            MERCHANDISE
                        </Link>

                        <Link
                            href="/#roblox"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2.5 rounded-xl text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c] transition"
                        >
                            ROBLOX
                        </Link>

                        <Link
                            href="/#event"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2.5 rounded-xl text-[#3d2314] hover:bg-[#f4ece1] hover:text-[#8c5a3c] transition"
                        >
                            BIRTHDAY
                        </Link>
                    </nav>
                </div>

                <a
                    href="https://wa.me/628123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#8c5a3c] hover:bg-[#73482f] text-white text-xs font-black rounded-full shadow-md text-center flex items-center justify-center gap-2 tracking-wider transition"
                >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>CHAT VIA WHATSAPP</span>
                </a>
            </div>
        </>
    );
}