import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { homeDescription, SITE_NAME, SITE_URL } from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lineage - Design UX for human and agent collaboration",
  description: homeDescription,
  keywords: [
    "Lineage",
    "mean-weasel",
    "human agent collaboration",
    "design lineage",
    "generated asset workflow",
    "AI design tooling",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Lineage - Design UX for human and agent collaboration",
    description: homeDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lineage - Design UX for human and agent collaboration",
    description: homeDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Analytics />
        <div className="bg-atmosphere" />
        <Nav />
        <div className="site-shell">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
