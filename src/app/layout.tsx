import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CV Crafter - Créez votre CV professionnel",
    template: "%s | CV Crafter"
  },
  description: "Créez, personnalisez et téléchargez votre CV professionnel en quelques minutes. Templates modernes et prévisualisation en temps réel.",
  keywords: ["CV", "curriculum vitae", "resume", "builder", "créer CV", "CV maker", "PDF"],
  authors: [{ name: "McKen Team" }],
  creator: "McKen Team",
  publisher: "McKen Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "CV Crafter - Créez votre CV professionnel",
    description: "Créez votre CV professionnel en quelques minutes avec nos templates modernes.",
    url: "https://cv-builder.app",
    siteName: "CV Crafter",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Crafter - Créez votre CV professionnel",
    description: "Créez votre CV professionnel en quelques minutes.",
    creator: "@mcken_team",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

