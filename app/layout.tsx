import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    default: "Claude Next.js Starterkit",
    template: "%s | Claude Next.js Starterkit",
  },
  description: "Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui 기반 스타터킷",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // next-themes가 클라이언트에서 html에 class="dark"를 주입하므로,
      // 서버 렌더링 결과와 비교해 발생하는 hydration 경고를 의도적으로 숨긴다.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
