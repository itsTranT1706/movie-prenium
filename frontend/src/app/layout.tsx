import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AuthProviderWrapper } from "@/components/providers";
import { ScrollToTop } from "@/components/ui";

export const metadata: Metadata = {
  title: "PhePhim - Premium Movie Streaming",
  description: "Discover, stream, and enjoy your favorite movies and series in HD & 4K",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white font-sans antialiased">
        <AuthProviderWrapper>
          {/* Fixed Header */}
          <Header />

          {/* Main Content */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Scroll to Top Button */}
          <ScrollToTop />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
