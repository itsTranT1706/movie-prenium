'use client';

import Link from "next/link";
import { Mail, MessageSquare, Send, ArrowRight, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ContactContent() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 overflow-x-hidden">

            {/* HEADER - Corporate Style */}
            <div className="bg-black/50 border-b border-white/10 relative z-50 backdrop-blur-md">
                <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-red-600 font-bold text-2xl tracking-tighter">PHEPHIM</Link>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                        <span className="text-[11px] font-bold tracking-wider text-neutral-300 uppercase">Contact Support</span>
                    </div>
                </div>
            </div>

            {/* Ambient Backlighting */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container max-w-6xl mx-auto relative z-10 px-4">

                {/* Header Block */}
                <div className="mb-16 md:mb-24 animate-fade-in-up">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                        LIÊN HỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">PHEPHIM.</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-xl leading-relaxed">
                        Chúng tôi luôn ở đây để lắng nghe từ bạn. Dù là báo lỗi, góp ý hay chỉ là lời chào.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left Column: Direct Info Cards */}
                    <div className="space-y-8 animate-fade-in-up animation-delay-200">
                        <div className="grid gap-6">
                            <ContactCard
                                icon={<Mail className="w-6 h-6" />}
                                title="Email Hỗ Trợ"
                                value="support@phephim.com"
                                tag="Priority"
                                color="text-red-500"
                                bgColor="bg-red-500/10"
                            />
                            <ContactCard
                                icon={<MessageSquare className="w-6 h-6" />}
                                title="Telegram Community"
                                value="@PhePhimChat"
                                tag="Live 24/7"
                                color="text-blue-400"
                                bgColor="bg-blue-400/10"
                            />
                            <ContactCard
                                icon={<MapPin className="w-6 h-6" />}
                                title="Trụ Sở Chính"
                                value="Hanoi, Vietnam"
                                tag="Office"
                                color="text-white"
                                bgColor="bg-white/10"
                            />
                        </div>

                        {/* FAQ Teaser Box */}
                        <div className="p-8 rounded-3xl bg-neutral-900 border border-white/5 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Thắc mắc thường gặp</h3>
                                <p className="text-neutral-400 mb-6">Tiết kiệm thời gian bằng cách xem qua danh sách các câu hỏi phổ biến của chúng tôi.</p>
                                <div className="flex items-center gap-2 text-white font-bold group-hover:translate-x-2 transition-transform">
                                    Xem FAQ <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Form */}
                    <div className="relative animate-fade-in-up animation-delay-400">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[32px] blur-sm -m-1" />

                        <div className="relative bg-[#0F0F0F] rounded-[28px] p-8 md:p-10 border border-white/10 shadow-2xl">
                            <form className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Thông tin cơ bản</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-black focus:border-white/30 transition-all placeholder:text-neutral-700" placeholder="Họ tên" />
                                        <input type="email" className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-black focus:border-white/30 transition-all placeholder:text-neutral-700" placeholder="Email" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Chủ đề</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-black focus:border-white/30 transition-all text-neutral-300">
                                            <option>Báo lỗi phim / Link hỏng</option>
                                            <option>Yêu cầu phim mới</option>
                                            <option>Hợp tác / Quảng cáo</option>
                                            <option>Khác</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Nội dung</label>
                                    <textarea className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-black focus:border-white/30 transition-all min-h-[160px] placeholder:text-neutral-700 resize-none" placeholder="Chi tiết vấn đề của bạn..."></textarea>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => toast.info('Tính năng đang phát triển', { description: 'Chúng tôi đang hoàn thiện hệ thống hỗ trợ. Vui lòng thử lại sau.' })}
                                    className="w-full bg-white text-black font-black text-lg py-5 rounded-xl hover:bg-neutral-200 transition-all hover:scale-[1.01] shadow-lg shadow-white/5 flex items-center justify-center gap-3"
                                >
                                    <Send className="w-5 h-5" />
                                    Gửi Tin Nhắn
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon, title, value, tag, color, bgColor }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-neutral-900/50 border border-white/5 rounded-2xl hover:bg-neutral-900 transition-colors group">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center ${color} border border-white/5`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-neutral-500 font-medium">{title}</p>
                    <p className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">{value}</p>
                </div>
            </div>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-neutral-400 border border-white/5">{tag}</span>
        </div>
    );
}
