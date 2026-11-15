import type { Metadata } from "next";
import { IBM_Plex_Mono, Kanit, Prompt } from "next/font/google";
import { BRAND_NAME } from "@/core/config/brand";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} · Learning Platform (ม.1–ม.3)`,
  description:
    "ศูนย์การเรียนรู้และฝึกปฏิบัติวิทยาการคำนวณ อัลกอริทึม Python และความมั่นคงไซเบอร์ สำหรับนักเรียน ม.1–ม.3",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${kanit.variable} ${prompt.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-[#F4F7FD] text-[#11264A] antialiased selection:bg-[#1364E7]/15 selection:text-[#092551]">
        {children}
      </body>
    </html>
  );
}
