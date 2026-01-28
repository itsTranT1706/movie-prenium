
import Link from 'next/link';

export const metadata = {
    title: "Chính sách riêng tư - PhePhim",
    description: "Cam kết bảo mật thông tin người dùng của PhePhim.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#141414] text-[#e5e5e5] font-sans selection:bg-red-600/30">

            {/* HEADER */}
            <div className="bg-black/50 border-b border-white/10 relative z-50 backdrop-blur-md">
                <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-red-600 font-bold text-2xl tracking-tighter">PHEPHIM</Link>
                    <div className="text-sm font-medium text-neutral-400 hidden sm:block">Privacy Center</div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-6 py-12 md:py-20 lg:flex gap-16">

                {/* SIDEBAR NAVIGATION (Sticky) */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-32 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Content</h3>
                            <nav className="space-y-1">
                                <NavLink href="#1-collection" label="1. Thu thập dữ liệu" active />
                                <NavLink href="#2-usage" label="2. Sử dụng thông tin" />
                                <NavLink href="#3-cookies" label="3. Cookies & Tracking" />
                                <NavLink href="#4-security" label="4. Bảo mật" />
                                <NavLink href="#5-third-party" label="5. Bên thứ ba" />
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 max-w-4xl space-y-16">

                    {/* PAGE TITLE */}
                    <div className="space-y-6 pb-12 border-b border-white/10">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Chính Sách Quyền Riêng Tư
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed">
                            Tại PhePhim, sự riêng tư của bạn là ưu tiên hàng đầu. Tài liệu này giải thích minh bạch về cách chúng tôi xử lý thông tin của bạn.
                        </p>
                    </div>

                    {/* SECTIONS */}
                    <div className="space-y-16 text-lg leading-relaxed text-neutral-300">

                        <section id="1-collection" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">1. Dữ liệu chúng tôi thu thập</h2>
                            <p className="mb-4">
                                Chúng tôi hạn chế tối đa việc thu thập thông tin cá nhân. Các loại dữ liệu chúng tôi có thể ghi nhận bao gồm:
                            </p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành và thông tin về thiết bị để tối ưu hóa hiển thị.</li>
                                <li><strong>Nhật ký truy cập:</strong> Thời gian truy cập, các trang đã xem và tương tác của bạn trên website.</li>
                                <li><strong>Thông tin liên hệ:</strong> Chỉ khi bạn chủ động gửi email hỗ trợ cho chúng tôi (Email, tên).</li>
                            </ul>
                        </section>

                        <section id="2-usage" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">2. Cách sử dụng thông tin</h2>
                            <p className="mb-4">Dữ liệu được sử dụng cho các mục đích hợp pháp và minh bạch:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Duy trì sự ổn định và hiệu suất của hệ thống Streaming.</li>
                                <li>Cá nhân hóa trải nghiệm người dùng (ví dụ: ghi nhớ vị trí xem phim).</li>
                                <li>Phát hiện và ngăn chặn các hành vi gian lận hoặc tấn công mạng.</li>
                            </ul>
                            <div className="mt-6 bg-red-600/10 border border-red-600/20 p-4 rounded text-base text-white font-medium">
                                Tuyệt đối KHÔNG bán, cho thuê hoặc chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba vì mục đích thương mại.
                            </div>
                        </section>

                        <section id="3-cookies" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">3. Cookies & Tracking Technologies</h2>
                            <p className="mb-4">
                                Chúng tôi sử dụng Cookies để lưu trữ các tùy chọn của người dùng (ví dụ: âm lượng, cài đặt giao diện). Bạn có thể tắt Cookies trong trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm xem phim.
                            </p>
                        </section>

                        <section id="4-security" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">4. Bảo mật dữ liệu</h2>
                            <p>
                                Chúng tôi áp dụng các biện pháp kỹ thuật tiên tiến (như mã hóa SSL/TLS) để bảo vệ dữ liệu của bạn trong quá trình truyền tải. Tuy nhiên, không có phương thức truyền tải nào trên internet là an toàn tuyệt đối 100%.
                            </p>
                        </section>

                        <section id="5-third-party" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold text-white mb-6">5. Liên kết bên thứ ba</h2>
                            <p>
                                Website có thể chứa các liên kết dẫn đến các trang web khác (ví dụ: máy chủ video Fembed, YouTube). Chúng tôi không chịu trách nhiệm về nội dung hoặc chính sách bảo mật của các trang web đó. Chúng tôi khuyến khích bạn đọc kỹ chính sách của từng trang web bạn truy cập.
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
