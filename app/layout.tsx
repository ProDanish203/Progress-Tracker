import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Header } from "@/components/shared/header";
import { metaDescription, metaTitle, siteUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: [""],
  authors: [
    { name: "Danish Siddiqui", url: "https://danish-siddiqui.vercel.app/" },
  ],
  creator: "Danish Siddiqui",
  publisher: "Danish Siddiqui",
  metadataBase: new URL(siteUrl),
  category: "Productivity Tool",
  applicationName: "Progress Tracker",
  generator: "Next.js",
  formatDetection: {
    email: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  // Open Graph
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    url: siteUrl,
    siteName: "Progress Tracker",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Progress Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: metaDescription,
    description: metaDescription,
    creator: "@danishsiddiqui",
    images: [`${siteUrl}/logo.png`],
  },
  // icons
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.png",
        href: "/logo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased w-screen min-h-screen overflow-x-clip")}>
        <Toaster richColors position="top-right" />
        <Header />
        {children}
      </body>
    </html>
  );
}
