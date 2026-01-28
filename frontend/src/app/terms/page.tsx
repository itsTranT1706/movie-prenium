
import Link from 'next/link';

export const metadata = {
    title: "Điều khoản sử dụng - PhePhim",
    description: "Điều khoản sử dụng dịch vụ tại PhePhim.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#141414] text-[#e5e5e5] font-sans selection:bg-red-600/30">

            {/* HEADER */}
            <div className="bg-black/50 border-b border-white/10 relative z-50 backdrop-blur-md">
                <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-red-600 font-bold text-2xl tracking-tighter">PHEPHIM</Link>
                    <div className="text-sm font-medium text-neutral-400 hidden sm:block">Legal Center</div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-6 py-12 md:py-20 lg:flex gap-16">

                {/* SIDEBAR NAVIGATION (Sticky) */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-32 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Mục lục</h3>
                            <nav className="space-y-1">
                                <NavLink href="#1-acceptance" label="1. Chấp thuận" active />
                                <NavLink href="#2-service" label="2. Dịch vụ" />
                                <NavLink href="#3-user-conduct" label="3. Quy tắc ứng xử" />
                                <NavLink href="#4-disclaimer" label="4. Miễn trừ trách nhiệm" />
                                <NavLink href="#5-changes" label="5. Thay đổi" />
                            </nav>
                        </div>
                        <div className="pt-8 border-t border-white/10">
                            <Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                Cần trợ giúp? Liên hệ
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 max-w-4xl space-y-16">

                    {/* PAGE TITLE */}
                    <div className="space-y-6 pb-12 border-b border-white/10">
                        <div className="inline-block px-3 py-1 bg-white/10 rounded text-xs font-bold uppercase tracking-wider text-white mb-4">
                            Updated: Jan 2025
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Điều Khoản Sử Dụng
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed">
                            Chào mừng đến với PhePhim. Những điều khoản này quy định việc bạn sử dụng dịch vụ của chúng tôi. Bằng việc truy cập, bạn đồng ý với các thỏa thuận này.
                        </p>
                    </div>

                    {/* SECTIONS */}
                    <div className="space-y-16 text-lg leading-relaxed text-neutral-300">

                        <section id="1-acceptance" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">1. Sự chấp thuận</h2>
                            <p className="mb-4">
                                Việc bạn truy cập và sử dụng website PhePhim (bao gồm cả việc xem phim, tìm kiếm, hoặc tương tác với bất kỳ tính năng nào) đồng nghĩa với việc bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ toàn bộ các Điều khoản sử dụng này.
                            </p>
                            <p>
                                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng ngừng sử dụng dịch vụ ngay lập tức.
                            </p>
                        </section>

                        <section id="2-service" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">2. Mô tả dịch vụ</h2>
                            <ul className="list-disc pl-6 space-y-3 marker:text-red-600">
                                <li>
                                    <strong>Công cụ tìm kiếm:</strong> PhePhim hoạt động như một công cụ tìm kiếm và lập chỉ mục nội dung video công khai trên internet.
                                </li>
                                <li>
                                    <strong>Không lưu trữ:</strong> Chúng tôi tuyên bố rõ ràng rằng PhePhim <strong className="text-white">không lưu trữ, không tải lên và không quản lý</strong> bất kỳ tệp tin video nào trên máy chủ của chúng tôi.
                                </li>
                                <li>
                                    <strong>Nguồn thứ ba:</strong> Tất cả nội dung được hiển thị thông qua cơ chế nhúng (embed) từ các nền tảng chia sẻ video phổ biến như YouTube, Dailymotion, Fembed, v.v.
                                </li>
                            </ul>
                        </section>

                        <section id="3-user-conduct" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">3. Quy tắc ứng xử của người dùng</h2>
                            <p className="mb-4">Khi sử dụng dịch vụ, bạn cam kết KHÔNG thực hiện các hành vi sau:</p>
                            <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-6 space-y-4 text-base">
                                <p>🚫 Sử dụng dịch vụ cho mục đích thương mại, buôn bán hoặc phân phối lại nội dung.</p>
                                <p>🚫 Can thiệp, làm gián đoạn hoặc cố gắng truy cập trái phép vào máy chủ và hệ thống mạng của PhePhim.</p>
                                <p>🚫 Sử dụng các công cụ tự động (bot, scraper) để thu thập dữ liệu mà không có sự cho phép.</p>
                                <p>🚫 Đăng tải các bình luận xúc phạm, thù địch hoặc vi phạm pháp luật.</p>
                            </div>
                        </section>

                        <section id="4-disclaimer" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">4. Miễn trừ trách nhiệm</h2>
                            <p className="mb-4">
                                Dịch vụ được cung cấp trên cơ sở "nguyên trạng" (AS IS) và "có sẵn" (AS AVAILABLE).
                            </p>
                            <p className="mb-4">
                                PhePhim không đưa ra bất kỳ cam kết hay bảo đảm nào về:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Tính liên tục và không bị gián đoạn của dịch vụ.</li>
                                <li>Độ chính xác hoặc tính hợp pháp của nội dung từ các nguồn bên thứ ba.</li>
                                <li>Việc dịch vụ sẽ đáp ứng hoàn toàn nhu cầu cá nhân của bạn.</li>
                            </ul>
                        </section>

                        <section id="5-changes" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">5. Thay đổi điều khoản</h2>
                            <p>
                                Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào để phù hợp với quy định pháp luật hoặc thay đổi trong dịch vụ. Việc bạn tiếp tục sử dụng website sau khi có sự thay đổi được coi là sự chấp thuận đối với các điều khoản mới.
                            </p>
                        </section>

                    </div>

                </main>
            </div>

        </div>
    );
}

function NavLink({ href, label, active = false }: { href: string, label: string, active?: boolean }) {
    return (
        <a
            href={href}
            className={`block py-2 text-sm border-l-2 pl-4 transition-colors ${active
                ? 'border-red-600 text-white font-bold'
                : 'border-transparent text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                }`}
        >
            {label}
        </a>
    )
}
