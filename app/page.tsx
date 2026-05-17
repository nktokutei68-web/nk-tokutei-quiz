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
    <div className="flex-1 flex items-center justify-center py-8 sm:py-16 md:py-24 px-4">
      <div className="w-full max-w-sm animate-fadeInUp">
        <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-100/70 overflow-hidden">
          
          {/* Ambient inner card blob decoration */}
          <div className="absolute top-[-10%] right-[-10%] w-24 h-24 rounded-full bg-indigo-300/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 rounded-full bg-violet-300/10 blur-xl pointer-events-none" />
          
          {/* Title */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-xl font-extrabold text-slate-800">
              NK TOKUTEI
            </h1>
            <p className="text-slate-400 text-xs mt-1.5">
              Nhập tên của bạn để bắt đầu luyện tập từ vựng.
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
  );
}
