import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#f4ece1] text-[#3d2314] pt-14 pb-8 border-t border-[#e6ccb2]/70 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#ddc6b6]">

                    {/* Brand & Tagline */}
                    <div className="md:col-span-5 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fffcf7] border border-[#e6ccb2] p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:border-[#8c5a3c] transition duration-300">
                                <img
                                    src="/img/logo-tomeet.png"
                                    alt="To Meet Cafe Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-black text-[#3d2314] text-sm sm:text-base tracking-[0.18em] uppercase group-hover:text-[#8c5a3c] transition-colors duration-200">
                                TO MEET CAFE
                            </span>
                        </Link>

                        <p className="text-xs text-[#6c584c] max-w-sm leading-relaxed font-semibold">
                            A cozy place to meet, to play, and to create sweet memories with our To Meet Bear family.
                        </p>

                        {/* Social Media Links */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-xl bg-white border border-[#e6ccb2]/80 text-[#8c5a3c] hover:bg-[#8c5a3c] hover:text-white transition duration-200 flex items-center justify-center shadow-2xs"
                            >
                                <FaInstagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="w-9 h-9 rounded-xl bg-white border border-[#e6ccb2]/80 text-[#8c5a3c] hover:bg-[#8c5a3c] hover:text-white transition duration-200 flex items-center justify-center shadow-2xs"
                            >
                                <FaTiktok className="w-4 h-4" />
                            </a>
                            <a
                                href="https://youtube.com/@tomeetcafe"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-xl bg-white border border-[#e6ccb2]/80 text-[#8c5a3c] hover:bg-[#8c5a3c] hover:text-white transition duration-200 flex items-center justify-center shadow-2xs"
                            >
                                <FaYoutube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-4">
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-widest">
                                EXPLORE
                            </h4>
                            <ul className="space-y-2 text-xs font-bold text-[#6c584c]">
                                <li>
                                    <Link href="/menu" className="hover:text-[#8c5a3c] transition">
                                        Digital Menu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/event" className="hover:text-[#8c5a3c] transition">
                                        Event & Workshop
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/merchandise" className="hover:text-[#8c5a3c] transition">
                                        Merchandise
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/roblox" className="hover:text-[#8c5a3c] transition">
                                        Roblox World
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-widest">
                                MORE
                            </h4>
                            <ul className="space-y-2 text-xs font-bold text-[#6c584c]">
                                <li>
                                    <Link href="/about" className="hover:text-[#8c5a3c] transition">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/birthday" className="hover:text-[#8c5a3c] transition">
                                        Birthday & Private
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#locations" className="hover:text-[#8c5a3c] transition">
                                        Outlet Locations
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="http://127.0.0.1:8000/login"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#8c5a3c] transition"
                                    >
                                        Admin Panel
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3 col-span-2 sm:col-span-1">
                            <h4 className="text-[11px] font-black text-[#8c5a3c] uppercase tracking-widest">
                                HELP & CONTACT
                            </h4>
                            <ul className="space-y-2 text-xs font-bold text-[#6c584c]">
                                <li>
                                    <a
                                        href="https://wa.me/628123456789"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#8c5a3c] transition"
                                    >
                                        Customer Care
                                    </a>
                                </li>
                                <li>
                                    <Link href="/#locations" className="hover:text-[#8c5a3c] transition">
                                        FAQ & Reservation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#locations" className="hover:text-[#8c5a3c] transition">
                                        House Rules
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Copyright & Scroll Top */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#8c5a3c]/80 pt-4">
                    <p className="text-center sm:text-left text-[11px] pl-10 sm:pl-12">
                        © {new Date().getFullYear()} TO MEET CAFE. All Rights Reserved.
                    </p>
                    <a
                        href="#"
                        aria-label="Scroll to top"
                        className="w-9 h-9 rounded-xl bg-[#8c5a3c] hover:bg-[#73482f] text-white flex items-center justify-center transition shadow-sm cursor-pointer shrink-0"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </footer>
    );
}