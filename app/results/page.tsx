'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { useEffect, useMemo, useRef } from 'react';
import { saveTestResult } from '@/lib/history';

export default function ResultsPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!state.userName || state.answers.length === 0) {
      router.replace('/');
    }
  }, [state.userName, state.answers, router]);

  // Save to history once
  const savedRef = useRef(false);
  useEffect(() => {
    if (!savedRef.current && state.userName && state.answers.length > 0 && state.quizConfig) {
      saveTestResult(state.userName, state.quizConfig, state.answers);
      savedRef.current = true;
    }
  }, [state.userName, state.answers, state.quizConfig]);

  const total = state.answers.length || 1;
  const score = state.answers.filter((a) => a.isCorrect).length;
  const pct = Math.round((score / total) * 100);
  const wrongAnswers = useMemo(() => state.answers.filter((a) => !a.isCorrect), [state.answers]);

  const r = 60;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  const handleRetry = () => {
    const cfg = state.quizConfig;
    dispatch({ type: 'RESET_QUIZ' });
    if (cfg) { 
      dispatch({ type: 'SET_CONFIG', payload: cfg }); 
      router.push('/quiz/session'); 
    } else {
      router.push('/quiz');
    }
  };

  if (!state.userName || state.answers.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-4 py-6 sm:py-10">
      <div className="w-full max-w-lg animate-fadeInUp">
        
        {/* Score indicator card */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 flex flex-col items-center mb-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Kết quả luyện tập</p>
          
          <div className="relative w-40 h-40 mb-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="70" cy="70" r={r} fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} filter="url(#glow)" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{score}/{total}</span>
              <span className="text-xs font-bold text-indigo-500/80 tracking-wider uppercase mt-0.5">{pct}% đúng</span>
            </div>
          </div>
        </div>

        {/* Incorrect words log */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <span>⚠️</span> Từ vựng cần ôn lại ({wrongAnswers.length})
            </h3>
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {wrongAnswers.map((a, i) => (
                <div key={`${a.wordId}-${i}`} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/50 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="min-w-0 mr-3">
                    <span className="text-[10px] font-extrabold text-indigo-500 tracking-wider uppercase">{a.word.reading}</span>
                    <h4 className="text-base font-black text-slate-800 leading-tight mt-0.5">{a.word.jp}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center text-emerald-600 font-extrabold text-xs sm:text-sm bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                      ✓ {a.correctAnswer}
                    </span>
                    {a.userAnswer && a.userAnswer !== a.correctAnswer && (
                      <p className="text-[10px] text-rose-400 font-bold line-through mt-1">✗ {a.userAnswer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-3">
          <button 
            onClick={handleRetry} 
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-base hover:opacity-95 active:scale-[0.98] shadow-md shadow-indigo-100 transition-all duration-300 min-h-[52px]"
          >
            🔄 Luyện tập lại phần này
          </button>
          
          <button 
            onClick={() => { dispatch({ type: 'RESET_QUIZ' }); router.push('/quiz'); }} 
            className="w-full py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/60 text-slate-700 font-extrabold text-base hover:bg-white hover:border-slate-350 active:scale-[0.98] shadow-sm transition-all duration-300 min-h-[52px]"
          >
            📑 Chọn phần thi khác
          </button>
          
          <button 
            onClick={() => { dispatch({ type: 'RESET_ALL' }); router.push('/'); }} 
            className="w-full py-3 rounded-2xl text-slate-400 font-extrabold text-xs uppercase tracking-wider hover:text-slate-600 active:scale-[0.98] transition-all duration-300"
          >
            ← Về trang chủ
          </button>
        </div>
        
      </div>
    </div>
  );
}
