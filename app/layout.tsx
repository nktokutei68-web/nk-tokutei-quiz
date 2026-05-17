import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";
import Link from "next/link";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NK TOKUTEI - Từ vựng QLSX",
  description:
    "Ứng dụng luyện tập từ vựng tiếng Nhật chuyên ngành Quản lý Sản xuất (QLSX) dành cho học viên NK TOKUTEI.",
  keywords: ["Japanese", "vocabulary", "quiz", "tiếng Nhật", "từ vựng", "tokutei", "QLSX", "quản lý sản xuất"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${notoSansJP.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-[#eef2ff] text-slate-800 relative overflow-x-hidden"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {/* Background Decorative Mesh & Floating Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none opacity-45 sm:opacity-60">
          {/* Glowing Blob 1 */}
          <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-indigo-200/40 mix-blend-multiply filter blur-3xl animate-blob" />
          {/* Glowing Blob 2 */}
          <div className="absolute top-[35%] right-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-violet-200/40 mix-blend-multiply filter blur-3xl animate-blob [animation-delay:4s]" />
          {/* Glowing Blob 3 */}
          <div className="absolute bottom-[-10%] left-[20%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-emerald-100/30 mix-blend-multiply filter blur-3xl animate-blob [animation-delay:8s]" />
          
          {/* Soft Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        </div>

        <QuizProvider>
          {/* Header */}
          <header className="w-full border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 group-hover:scale-105 transition-all duration-300">
                  {/* Shadow layer */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 opacity-40 blur-md translate-y-1" />
                  {/* Main logo */}
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg ring-1 ring-white/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
                    <span className="relative text-white text-sm font-black tracking-tighter" style={{ letterSpacing: '-0.05em' }}>NK</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                    NK TOKUTEI
                  </span>
                  <span className="text-[10px] font-bold text-indigo-500 tracking-wider -mt-1 uppercase">
                    Từ vựng QLSX
                  </span>
                </div>
              </Link>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 flex flex-col relative">{children}</main>
        </QuizProvider>
      </body>
    </html>
  );
}

