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
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fadeInUp">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-50 mb-6 animate-float">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
            NK TOKUTEI
            <span className="block text-indigo-600">QUIZ</span>
          </h1>
          <p className="text-slate-500 text-base mt-3">
            Luyện từ vựng tiếng Nhật mỗi ngày
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleStart} className="space-y-3">
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn..."
            maxLength={30}
            className="w-full py-3.5 px-5 rounded-xl bg-white border border-slate-200 text-slate-800 text-base placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 shadow-sm"
            autoFocus
          />
          <button
            id="start-button"
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm shadow-indigo-200"
          >
            Bắt đầu →
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          1001 từ vựng • Không cần đăng ký
        </p>
      </div>
    </div>
  );
}
