import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"]
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
      <body className={`${playfair.variable} ${jakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
