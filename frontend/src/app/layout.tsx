import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { AuthProviderWrapper } from "@/components/providers";
import { ScrollToTop } from "@/components/ui";
import { Toaster } from "sonner";

// Cinematic font for movie titles
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

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
    <html lang="en" className={`dark ${bebasNeue.variable}`}>
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

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(23, 23, 23, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
