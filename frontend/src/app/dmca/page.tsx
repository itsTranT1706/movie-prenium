
import Link from 'next/link';
import { Mail, AlertCircle } from 'lucide-react';

export const metadata = {
    title: "Bản quyền & DMCA - PhePhim",
    description: "Chính sách bản quyền và quy trình báo cáo vi phạm.",
};

export default function DmcaPage() {
    return (
        <div className="min-h-screen bg-[#141414] text-[#e5e5e5] font-sans selection:bg-red-600/30">

            {/* HEADER */}
            <div className="bg-black/50 border-b border-white/10 relative z-50 backdrop-blur-md">
                <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-red-600 font-bold text-2xl tracking-tighter">PHEPHIM</Link>
                    <div className="text-sm font-medium text-neutral-400 hidden sm:block">Intellectual Property</div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-6 py-12 md:py-20 lg:flex gap-16">

                {/* SIDEBAR NAVIGATION (Sticky) */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-32 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Các phần</h3>
                            <nav className="space-y-1">
                                <NavLink href="#policy" label="Chính sách chung" active />
                                <NavLink href="#disclaimer" label="Miễn trừ trách nhiệm" />
                                <NavLink href="#reporting" label="Quy trình báo cáo" />
                                <NavLink href="#contact" label="Thông tin liên hệ" />
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 max-w-4xl space-y-16">

                    {/* PAGE TITLE */}
                    <div className="space-y-6 pb-12 border-b border-white/10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Bản Quyền & DMCA
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed">
                            PhePhim cam kết tôn trọng quyền sở hữu trí tuệ và tuân thủ Đạo luật Bản quyền Kỹ thuật số Thiên niên kỷ (DMCA).
                        </p>
                    </div>

                    {/* SECTIONS */}
                    <div className="space-y-16 text-lg leading-relaxed text-neutral-300">

                        <section id="policy" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">Chính sách chung</h2>
                            <p>
                                Chúng tôi sẽ phản hồi các thông báo rõ ràng về việc cáo buộc vi phạm bản quyền tuân theo DMCA. Chính sách của chúng tôi là gỡ bỏ mọi nội dung bị phát hiện vi phạm bản quyền và chấm dứt tài khoản của những người vi phạm nhiều lần.
                            </p>
                        </section>

                        <section id="disclaimer" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">Miễn trừ trách nhiệm nội dung</h2>
                            <div className="bg-[#1f1f1f] p-6 rounded-xl border border-white/5 flex gap-4">
                                <AlertCircle className="w-6 h-6 text-neutral-400 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="mb-2 font-bold text-white">PhePhim không lưu trữ nội dung.</p>
                                    <p className="text-base text-neutral-400">
                                        PhePhim hoạt động như một công cụ tìm kiếm. Chúng tôi không tải lên, không lưu trữ và không truyền phát bất kỳ video nào từ máy chủ của mình. Mọi nội dung đều được nhúng từ các nguồn thứ ba (YouTube, Fembed, Dailymotion...).
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section id="reporting" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">Quy trình báo cáo vi phạm</h2>
                            <p className="mb-4">
                                Để gửi yêu cầu gỡ bỏ nội dung hợp lệ, vui lòng cung cấp thông báo bằng văn bản bao gồm các thông tin sau:
                            </p>
                            <ul className="grid gap-4 mt-6">
                                <li className="flex gap-4">
                                    <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">1</span>
                                    <span>Chữ ký điện tử hoặc vật lý của người được ủy quyền đại diện cho chủ sở hữu bản quyền.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">2</span>
                                    <span>Mô tả chi tiết về tác phẩm có bản quyền mà bạn cho rằng đã bị vi phạm.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">3</span>
                                    <span>Mô tả vị trí (URL) của tài liệu vi phạm trên trang web của chúng tôi.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">4</span>
                                    <span>Thông tin liên hệ của bạn (Địa chỉ, số điện thoại và email).</span>
                                </li>
                            </ul>
                        </section>

                        <section id="contact" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">Thông tin liên hệ</h2>
                            <p className="mb-6">
                                Vui lòng gửi tất cả các thông báo DMCA đến Đại lý Bản quyền được chỉ định của chúng tôi qua email:
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors">
                                <Mail className="w-5 h-5" />
                                <a href="mailto:dmca@phephim.com">dmca@phephim.com</a>
                            </div>
                            <p className="mt-4 text-sm text-neutral-500">
                                * Chúng tôi thường phản hồi trong vòng 1-2 ngày làm việc.
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
