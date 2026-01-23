import Link from 'next/link';

/**
 * Footer Component
 * - Minimal, clean
 * - Premium streaming platform style
 */
export default function Footer() {
    const links = [
        { href: '/about', label: 'About' },
        { href: '/terms', label: 'Terms' },
        { href: '/privacy', label: 'Privacy' },
        { href: '/dmca', label: 'DMCA' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <footer className="border-t border-gray-800/50 mt-8">
            <div className="container py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Logo & Copyright */}
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-red-600">PhePhim</span>
                        <span className="text-xs text-gray-500">© {new Date().getFullYear()} Trần Việt Tiến - Học viện kỹ thuật Mật mã</span>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap justify-center gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
