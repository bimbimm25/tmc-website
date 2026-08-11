import { Coffee, ArrowUp } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#f4ece1] text-[#3d2314] pt-16 pb-8 border-t border-[#e6ccb2]/60 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#ddc6b6]">

                    {/* Brand & Tagline */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#8c5a3c] text-white flex items-center justify-center font-bold shadow-md">
                                <Coffee className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-black text-[#3d2314] text-lg tracking-wide block leading-none">TOMEET</span>
                                <span className="text-[10px] font-extrabold text-[#8c5a3c] uppercase tracking-widest block mt-0.5">CAFE & PLAYGROUND</span>
                            </div>
                        </div>
                        <p className="text-xs text-[#6c584c] max-w-sm leading-relaxed font-semibold">
                            A cozy place to meet, to play, and to create sweet memories with our To Meet Bear family.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-2xl bg-white border border-[#e6ccb2] text-[#8c5a3c] hover:bg-[#8c5a3c] hover:text-white transition duration-200 flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-7 grid grid-cols-3 gap-4">
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">EXPLORE</h4>
                            <ul className="space-y-2 text-xs font-bold text-[#6c584c]">
                                <li><a href="#highlights" className="hover:text-[#8c5a3c] transition">Menu Highlights</a></li>
                                <li><a href="#event" className="hover:text-[#8c5a3c] transition">Event & Workshop</a></li>
                                <li><a href="#adventure" className="hover:text-[#8c5a3c] transition">Merchandise</a></li>
                                <li><a href="#roblox" className="hover:text-[#8c5a3c] transition">Roblox Game</a></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">MORE</h4>
                            <ul className="space-y-2 text-xs font-bold text-[#6c584c]">
                                <li><a href="#journey" className="hover:text-[#8c5a3c] transition">Career</a></li>
                                <li><a href="#journey" className="hover:text-[#8c5a3c] transition">Blog</a></li>
                                <li><a href="#locations" className="hover:text-[#8c5a3c] transition">About Us</a></li>
                                <li>
                                    <a href="http://127.0.0.1:8000/login" target="_blank" rel="noopener noreferrer" className="hover:text-[#8c5a3c] transition">
                                        Admin Panel
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-[#8c5a3c] uppercase tracking-wider">HELP</h4>
                            <ul className="space-y-2 text-xs font-bold text-[#6c584c]">
                                <li><a href="#locations" className="hover:text-[#8c5a3c] transition">FAQ</a></li>
                                <li><a href="#locations" className="hover:text-[#8c5a3c] transition">House Rules</a></li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Copyright & Scroll Top */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#8c5a3c]/70">
                    <div>
                        © {new Date().getFullYear()} To Meet Cafe & Playground. All Rights Reserved.
                    </div>
                    <a href="#" className="w-10 h-10 rounded-2xl bg-[#8c5a3c] text-white flex items-center justify-center hover:bg-[#73482f] transition shadow-md">
                        <ArrowUp className="w-4 h-4" />
                    </a>
                </div>

            </div>
        </footer>
    );
}