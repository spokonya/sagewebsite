import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"]
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sage.app"),
  title: "Sage — Your Voice-First Second Brain",
  description:
    "Speak your mind. Sage transcribes, connects, and resurfaces your ideas so the thoughts that matter never fade.",
  openGraph: {
    title: "Sage — Your Voice-First Second Brain",
    description:
      "A voice-first second brain that transcribes, connects, and resurfaces your ideas.",
    url: "https://sage.app",
    siteName: "Sage",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage — Your Voice-First Second Brain",
    description: "Speak your mind. Watch it come alive.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/bagnard-sans"
          rel="stylesheet"
        />
      </head>
      <body className={`${cormorant.variable} ${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
