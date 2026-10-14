import type { Metadata, Viewport } from "next";
import { AccountProvider } from "@/presentation/components/layout/AccountProvider";
import { BackToTopFab } from "@/presentation/components/layout/BackToTop";
import { Preloader } from "@/presentation/components/layout/Preloader";
import { SearchProvider } from "@/presentation/components/layout/SearchProvider";
import { SiteFooter } from "@/presentation/components/layout/SiteFooter";
import { SiteHeader } from "@/presentation/components/layout/SiteHeader";
import { fontVariables } from "@/presentation/fonts";
import { getMegaMenu } from "@/presentation/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Chaitanya Health & Wellness",
    template: "%s · Chaitanya Health & Wellness",
  },
  description:
    "Spa and naturopathy centre in Bakhundol, Lalitpur — Ayurvedic, oriental and modern therapies, wellness packages and natural products.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const megaMenu = await getMegaMenu();

  return (
    // The preloader script may tag <html> before hydration.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only rounded-control bg-brand px-md py-sm font-body text-[14px] text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[400]"
        >
          Skip to content
        </a>
        <AccountProvider>
        <SearchProvider>
          <Preloader />
          <SiteHeader megaMenu={megaMenu} />
          <main id="main">{children}</main>
          <SiteFooter />
          <BackToTopFab />
        </SearchProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
