'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';

export default function HomePage() {
  const [name, setName] = useState('');
  const { dispatch } = useQuiz();
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: 'SET_NAME', payload: name.trim() });
    router.push('/quiz');
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 sm:py-16 md:py-24">
      <div className="w-full max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Brand Story & QLSX Features */}
        <div className="lg:col-span-7 space-y-6 text-left animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm shadow-indigo-50">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Tiêu Chuẩn Công Nghiệp Nhật Bản
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            Học Tiếng Nhật Chuyên Ngành
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 drop-shadow-sm">
              Quản Lý Sản Xuất (QLSX)
            </span>
          </h1>
          
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl leading-relaxed">
            Học và kiểm tra từ vựng chuyên ngành sản xuất, nhà xưởng, 5S, cải tiến Kaizen và an toàn lao động tại Nhật Bản. <strong>NK TOKUTEI</strong> là đơn vị tiên phong đào tạo kỹ năng QLSX chuyên sâu.
          </p>

          {/* Pillars of QLSX Training */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            
            {/* Pillar 1: 5S & Kaizen */}
            <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md border border-slate-100 shadow-sm flex items-start gap-3 hover:scale-[1.02] hover:bg-white transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 shadow-sm shadow-amber-50">
                <svg className="w-5 h-5 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">5S & Kaizen Nhật Bản</h3>
                <p className="text-xs text-slate-500 mt-1">Nắm vững quy trình Seiri, Seiton... và cải tiến liên tục tại nhà máy.</p>
              </div>
            </div>

            {/* Pillar 2: Safety */}
            <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md border border-slate-100 shadow-sm flex items-start gap-3 hover:scale-[1.02] hover:bg-white transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-50">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">An Toàn Lao Động</h3>
                <p className="text-xs text-slate-500 mt-1">Thuật ngữ cảnh báo, nhận diện mối nguy (Hiyari Hatto) & an toàn sản xuất.</p>
              </div>
            </div>

            {/* Pillar 3: Equipment */}
            <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md border border-slate-100 shadow-sm flex items-start gap-3 hover:scale-[1.02] hover:bg-white transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-50">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Từ Vựng Nhà Xưởng</h3>
                <p className="text-xs text-slate-500 mt-1">Tên gọi thiết bị, máy móc, nguyên vật liệu và dụng cụ lắp ráp cơ khí.</p>
              </div>
            </div>

            {/* Pillar 4: Operations */}
            <div className="p-4 rounded-xl bg-white/70 backdrop-blur-md border border-slate-100 shadow-sm flex items-start gap-3 hover:scale-[1.02] hover:bg-white transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 shadow-sm shadow-violet-50">
                <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Quy Trình & QA/QC</h3>
                <p className="text-xs text-slate-500 mt-1">Từ vựng về kiểm tra chất lượng, dây chuyền sản xuất, đóng gói, xuất hàng.</p>
              </div>
            </div>

          </div>
        </div>
        
        {/* Right Side: High-end Login Form Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto animate-fadeInUp">
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-100/70 overflow-hidden">
            
            {/* Ambient inner card blob decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 rounded-full bg-indigo-300/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 rounded-full bg-violet-300/10 blur-xl pointer-events-none" />
            
            {/* Form Hero */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50/80 mb-4 shadow-inner border border-indigo-100/50">
                <span className="text-3xl animate-float">⚙️</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">
                Bắt đầu học ngay
              </h2>
              <p className="text-slate-400 text-xs mt-1.5">
                Nhập tên của bạn để theo dõi tiến độ và lịch sử làm bài.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleStart} className="space-y-4 relative z-10">
              <div className="relative">
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên học viên..."
                  maxLength={30}
                  className="w-full py-3.5 px-5 rounded-xl bg-white/90 border border-slate-200 text-slate-800 text-base placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-sm"
                  autoFocus
                />
              </div>
              <button
                id="start-button"
                type="submit"
                disabled={!name.trim()}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:opacity-95 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200"
              >
                Vào học →
              </button>
            </form>

            <div className="text-center text-slate-400 text-xs mt-6 relative z-10 border-t border-slate-100/60 pt-4 flex justify-around">
              <span>📚 1001 từ vựng</span>
              <span>🔒 Lưu offline</span>
              <span>🛠️ Miễn phí</span>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
