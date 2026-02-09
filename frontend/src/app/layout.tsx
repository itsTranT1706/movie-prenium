import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Header, Footer, BottomNav, MobileTopNav } from "@/shared/components/layout";
import { AuthProviderWrapper } from "@/features/auth";
import { ScrollToTop } from "@/shared/components/ui";
import { LoadingProvider } from "@/shared/contexts";
import { NavigationLoadingProvider } from "@/shared/components/providers";
import { Toaster } from "sonner";

export const dynamic = 'force-dynamic';

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
  manifest: "/manifest.json",
  themeColor: "#e50914",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PhePhim",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${bebasNeue.variable}`}>
      <body className="min-h-screen bg-black text-white font-sans antialiased">
        <LoadingProvider>
          <NavigationLoadingProvider>
            <AuthProviderWrapper>
              {/* Fixed Header - hidden on mobile via CSS inside Header */}
              <Header />

              {/* Mobile Top Category Navigation */}
              <MobileTopNav />

              {/* Main Content - padding for mobile navs */}
              <main className="min-h-screen pt-12 lg:pt-0 pb-16 lg:pb-0">
                {children}
              </main>

              {/* Footer */}
              <Footer />

              {/* Mobile Bottom Navigation */}
              <BottomNav />

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
          </NavigationLoadingProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
