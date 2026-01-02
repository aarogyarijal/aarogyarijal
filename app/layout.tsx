import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: {
    default: "Aarogya Rijal | Software Engineer & Full-Stack Developer",
    template: "%s | Aarogya Rijal",
  },
  description:
    "Portfolio of Aarogya Rijal - Software Engineer specializing in full-stack development, AI/ML, and geospatial technologies. Experience at Baato Maps, Starthawk, and WPI CEEO.",
  keywords: [
    "Aarogya Rijal",
    "Software Engineer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "AI/ML",
    "Machine Learning",
    "Worcester Polytechnic Institute",
    "WPI",
    "Portfolio",
    "Web Development",
    "Software Development",
  ],
  authors: [{ name: "Aarogya Rijal" }],
  creator: "Aarogya Rijal",
  publisher: "Aarogya Rijal",
  metadataBase: new URL("https://aarogyarijal.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aarogyarijal.com",
    title: "Aarogya Rijal | Software Engineer & Full-Stack Developer",
    description:
      "Portfolio of Aarogya Rijal - Software Engineer specializing in full-stack development, AI/ML. Experience at WPI, Sirkoi, Foundercloud, Baato Maps, Starthawk, and Tufts.",
    siteName: "Aarogya Rijal Portfolio",
    images: [
      {
        url: "/pfp.jpeg",
        width: 1200,
        height: 630,
        alt: "Aarogya Rijal - Software Engineer",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aarogya Rijal",
    url: "https://aarogyarijal.com",
    image: "https://aarogyarijal.com/pfp.jpeg",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer specializing in full-stack development, AI/ML.",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Worcester Polytechnic Institute",
    },
    sameAs: [
      "https://github.com/aarogyarijal",
      "https://www.linkedin.com/in/aarogyarijal",
    ],
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Development",
      "Machine Learning",
      "Artificial Intelligence",
      "Web Development",
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
