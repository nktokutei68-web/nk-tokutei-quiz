import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NK TOKUTEI QUIZ — Luyện từ vựng tiếng Nhật",
  description:
    "Ứng dụng luyện từ vựng tiếng Nhật dành cho học viên NK Tokutei. Trắc nghiệm theo phần hoặc ngẫu nhiên.",
  keywords: ["Japanese", "vocabulary", "quiz", "tiếng Nhật", "từ vựng", "tokutei"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${notoSansJP.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-[#f8fafc] text-slate-800"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        <QuizProvider>
          {/* Header */}
          <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2.5 group">
                <span className="text-xl">🇯🇵</span>
                <span className="text-lg font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors">
                  NK TOKUTEI QUIZ
                </span>
              </a>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 flex flex-col">{children}</main>
        </QuizProvider>
      </body>
    </html>
  );
}
