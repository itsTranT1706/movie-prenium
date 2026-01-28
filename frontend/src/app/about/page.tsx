
'use client';

import Link from "next/link";
import { NavigationLink } from "@/components/ui/navigation-link";
import { Play, Star, Zap, Monitor, Film, TrendingUp, Users, Smartphone } from "lucide-react";

// Metadata moved to layout or parent since this is now a client component

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-600/30 overflow-x-hidden">

            {/* HEADER - Corporate Style */}
            <div className="bg-black/50 border-b border-white/10 relative z-50 backdrop-blur-md">
                <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <NavigationLink href="/" loadingType="fade" className="text-red-600 font-bold text-2xl tracking-tighter">PHEPHIM</NavigationLink>
                    <div className="text-sm font-medium text-neutral-400 hidden sm:block">About Us</div>
                </div>
            </div>

            {/* 1. Cinematic Hero Section - Immersive & Bold */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    {/* Animated Gradient Mesh */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#0a0a0a] to-[#0a0a0a] animate-spin-slow opacity-60" style={{ animationDuration: '60s' }} />
                    <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/ab180a27-b661-44cd-9579-9dcaf57ea38d/e6de5a19-c70e-4dd8-80ce-177bf9493c4e/VN-vi-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay scale-110 animate-ken-burns" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                <div className="container relative z-10 flex flex-col items-center text-center px-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-[#121212] mb-8 shadow-2xl animate-fade-in-up hover:border-white/20 transition-colors cursor-default">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
                        <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-300 uppercase font-sans">The New Era of Streaming</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 relative animate-fade-in-up animation-delay-200">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">PHEPHIM</span>
                        <span className="absolute -inset-1 text-red-600/20 blur-2xl -z-10 select-none pointer-events-none">PHEPHIM</span>
                    </h1>

                    <p className="text-xl md:text-3xl text-neutral-400 font-light max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up animation-delay-400">
                        Không chỉ là xem phim. Đó là <span className="text-white font-medium">trải nghiệm điện ảnh</span> ngay tại ngôi nhà của bạn.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animation-delay-500">
                        <NavigationLink href="/" loadingType="fade" className="group relative px-8 py-4 bg-red-600 rounded-lg font-bold text-lg tracking-wide uppercase overflow-hidden transition-all hover:scale-105 hover:bg-red-700 hover:shadow-2xl hover:shadow-red-900/40">
                            <span className="relative z-10 flex items-center gap-2">
                                Bắt Đầu Ngay <Play className="w-5 h-5 fill-current" />
                            </span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
                        </NavigationLink>
                        <Link href="/contact" className="px-8 py-4 bg-transparent border border-white/20 rounded-lg font-bold text-lg tracking-wide uppercase hover:bg-white/5 hover:border-white transition-all text-neutral-300 hover:text-white">
                            Liên Hệ Hợp Tác
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-3 bg-white rounded-full" />
                    </div>
                </div>
            </section>

            {/* 2. Marquee / Social Proof - "Infinite Content" */}
            <div className="border-y border-white/5 bg-neutral-900/30 backdrop-blur-sm relative z-20 overflow-hidden py-6">
                <div className="flex animate-marquee whitespace-nowrap gap-16 text-neutral-500 font-black text-4xl md:text-6xl uppercase tracking-tighter opacity-30 select-none">
                    {/* First Set */}
                    <span>Action</span> <span>Drama</span> <span>Comedy</span> <span>Horror</span> <span>Sci-Fi</span> <span>Romance</span> <span>Anime</span> <span>Documentary</span>
                    <span>Thriller</span> <span>Adventure</span> <span>Fantasy</span> <span>Mystery</span> <span>Crime</span> <span>Family</span> <span>History</span> <span>War</span>

                    {/* Second Set (Duplicate for seamless loop) */}
                    <span>Action</span> <span>Drama</span> <span>Comedy</span> <span>Horror</span> <span>Sci-Fi</span> <span>Romance</span> <span>Anime</span> <span>Documentary</span>
                    <span>Thriller</span> <span>Adventure</span> <span>Fantasy</span> <span>Mystery</span> <span>Crime</span> <span>Family</span> <span>History</span> <span>War</span>
                </div>
            </div>

            {/* 3. The "Why Us" Section - Grid Layout with Hover Effects */}
            <section className="py-32 container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Tại sao chọn <span className="text-red-600">PhePhim?</span></h2>
                        <div className="h-1 w-24 bg-red-600 rounded-full" />
                    </div>
                    <p className="text-xl text-neutral-400 max-w-xl text-right md:text-left">
                        Chúng tôi tái định nghĩa cách bạn thưởng thức điện ảnh trực tuyến với công nghệ và đam mê.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PremiumFeatureCard
                        icon={<Monitor className="w-8 h-8" />}
                        title="Chất Lượng 4K HDR"
                        desc="Tận hưởng từng khung hình sắc nét với công nghệ streaming tiên tiến nhất."
                        delay={0}
                    />
                    <PremiumFeatureCard
                        icon={<Smartphone className="w-8 h-8" />}
                        title="Đa Nền Tảng"
                        desc="Xem trên TV, laptop, tablet hay điện thoại đều mượt mà và đồng bộ."
                        delay={100}
                    />
                    <PremiumFeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Không Giật Lag"
                        desc="Hạ tầng server mạnh mẽ đặt tại nhiều quốc gia đảm bảo tốc độ tải siêu tốc."
                        delay={200}
                    />
                    <PremiumFeatureCard
                        icon={<Film className="w-8 h-8" />}
                        title="Thư Viện Khổng Lồ"
                        desc="Hơn 10,000+ tựa phim cập nhật mới mỗi ngày. Bạn không bao giờ thiếu phim xem."
                        delay={300}
                    />
                </div>
            </section>

            {/* 4. "The Story" - Asymmetrical Layout with Visuals */}
            <section className="py-32 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

                <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group">
                            <div className="absolute inset-0 bg-neutral-900 animate-pulse" /> {/* Placeholder if image fails */}
                            {/* Abstract Visual Representation of "Cinema" */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black p-8 flex items-center justify-center">
                                <div className="w-full h-full relative border border-white/10 rounded-lg p-6 flex flex-col justify-between group-hover:border-red-600/50 transition-colors duration-500">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="space-y-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <div className="h-2 w-3/4 bg-white/20 rounded" />
                                        <div className="h-2 w-1/2 bg-white/20 rounded" />
                                        <div className="h-2 w-full bg-white/20 rounded" />
                                    </div>
                                    <div className="text-8xl font-black text-white/5 absolute right-4 bottom-4 group-hover:text-red-600/10 transition-colors">4K</div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-8 -right-8 bg-[#1a1a1a] p-6 rounded-xl border border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-300 hidden md:block">
                            <div className="text-4xl font-bold text-red-500 mb-1">100%</div>
                            <div className="text-sm font-medium text-neutral-400 uppercase tracking-widest">Miễn Phí</div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">Câu chuyện của chúng tôi</h3>
                        <h2 className="text-4xl md:text-6xl font-black leading-tight">
                            Từ đam mê nhỏ <br /> đến cộng đồng lớn.
                        </h2>
                        <div className="space-y-6 text-lg text-neutral-400 leading-relaxed">
                            <p>
                                PhePhim bắt đầu không phải như một công ty công nghệ, mà là một nhóm những người nghiện phim. Chúng tôi chán nản với các trang web quảng cáo dày đặc, giật lag và chất lượng thấp.
                            </p>
                            <p>
                                Chúng tôi tự hỏi: <em className="text-white">"Tại sao trải nghiệm xem phim miễn phí lại không thể tốt như Netflix?"</em>
                            </p>
                            <p>
                                Và thế là PhePhim ra đời. Sứ mệnh của chúng tôi là dân chủ hóa trải nghiệm điện ảnh chất lượng cao. Chúng tôi tin rằng ai cũng xứng đáng được thưởng thức những tác phẩm nghệ thuật tốt nhất mà không gặp rào cản kỹ thuật.
                            </p>
                        </div>

                        <div className="pt-8 grid grid-cols-3 gap-8">
                            <StatItem number="2M+" label="Người dùng" />
                            <StatItem number="15K+" label="Bộ phim" />
                            <StatItem number="24/7" label="Hỗ trợ" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Minimalist Footer CTA */}
            <section className="py-40 container text-center relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-red-600/20 via-blue-600/20 to-purple-600/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

                <div className="relative z-10 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                        Sẵn sàng bấm <span className="text-red-600">Play?</span>
                    </h2>
                    <NavigationLink href="/" loadingType="fade" className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black font-bold text-xl rounded-full hover:scale-105 hover:bg-neutral-200 transition-all duration-300">
                        Khám Phá Kho Phim <Play className="w-5 h-5 fill-black" />
                    </NavigationLink>
                </div>
            </section>

        </div>
    );
}

// Sub-components

function PremiumFeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
    return (
        <div
            className="p-8 rounded-2xl bg-neutral-900 border border-white/5 hover:border-red-600/30 transition-all duration-500 hover:-translate-y-2 group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors">{title}</h3>
            <p className="text-neutral-500 leading-relaxed group-hover:text-neutral-300 transition-colors">{desc}</p>
        </div>
    )
}

function StatItem({ number, label }: { number: string, label: string }) {
    return (
        <div className="space-y-1">
            <div className="text-4xl font-black text-white">{number}</div>
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{label}</div>
        </div>
    )
}
