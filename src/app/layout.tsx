import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import DemoModeBanner from "@/components/DemoModeBanner";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Villa First - Colocation Premium a Bali",
  description:
    "Trouve ta villa de reve a Bali et rencontre des colocataires qui partagent tes vibes. Matching intelligent, villas verifiees, communaute de confiance.",
  keywords: [
    "bali",
    "colocation",
    "villa",
    "digital nomad",
    "canggu",
    "ubud",
    "seminyak",
    "premium",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          <DemoModeBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
