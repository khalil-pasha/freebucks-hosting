import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://freebucks.host"),
  title: "Free Bucks - Free Minecraft Hosting",
  description: "High performance, DDoS protected, and affordable Minecraft server hosting.",
  icons: {
    icon: "/icon.jpg",
    apple: "/apple-icon.jpg",
  },
  openGraph: {
    title: "Free Bucks - Free Minecraft Hosting",
    description: "High performance, DDoS protected, and affordable Minecraft server hosting.",
    url: "/",
    siteName: "Free Bucks",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1024,
        height: 1024,
        alt: "Free Bucks Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
