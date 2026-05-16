'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { useEffect, useMemo, useRef } from 'react';
import { saveTestResult } from '@/lib/history';

function getMotivation(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return { emoji: '🎉', message: 'Xuất sắc!', color: 'text-amber-600' };
  if (pct >= 0.7) return { emoji: '💪', message: 'Tốt lắm!', color: 'text-emerald-600' };
  if (pct >= 0.5) return { emoji: '📚', message: 'Khá tốt, luyện thêm nhé!', color: 'text-indigo-600' };
  return { emoji: '🌱', message: 'Hãy luyện thêm!', color: 'text-purple-600' };
}

export default function ResultsPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!state.userName || state.answers.length === 0) router.replace('/');
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
  const motivation = getMotivation(score, total);
  const pct = Math.round((score / total) * 100);
  const wrongAnswers = useMemo(() => state.answers.filter((a) => !a.isCorrect), [state.answers]);

  const r = 60;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  const handleRetry = () => {
    const cfg = state.quizConfig;
    dispatch({ type: 'RESET_QUIZ' });
    if (cfg) { dispatch({ type: 'SET_CONFIG', payload: cfg }); router.push('/quiz/session'); }
    else router.push('/quiz');
  };

  if (!state.userName || state.answers.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-lg animate-fadeInUp">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
              <circle cx="70" cy="70" r={r} fill="none" stroke="#6366f1" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800">{score}/{total}</span>
              <span className="text-xs text-slate-400">{pct}%</span>
            </div>
          </div>
          <span className="text-4xl mb-2">{motivation.emoji}</span>
          <h2 className={`text-lg font-bold ${motivation.color}`}>{motivation.message}</h2>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">📖 Từ sai ({wrongAnswers.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {wrongAnswers.map((a, i) => (
                <div key={`${a.wordId}-${i}`} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div><span className="text-xs text-indigo-500">{a.word.reading}</span><br/><span className="text-base font-bold text-slate-800">{a.word.jp}</span></div>
                  <div className="text-right ml-3"><span className="text-emerald-600 font-medium text-sm">{a.correctAnswer}</span>
                    {a.userAnswer && a.userAnswer !== a.correctAnswer && <p className="text-xs text-red-400 line-through">{a.userAnswer}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          <button onClick={handleRetry} className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 active:scale-[0.98] shadow-sm min-h-[52px]">🔄 Làm lại</button>
          <button onClick={() => { dispatch({ type: 'RESET_QUIZ' }); router.push('/quiz'); }} className="w-full py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 active:scale-[0.98] shadow-sm min-h-[52px]">📋 Chọn phần khác</button>
          <button onClick={() => { dispatch({ type: 'RESET_ALL' }); router.push('/'); }} className="w-full py-3 rounded-xl text-slate-400 font-medium text-sm hover:text-slate-600 active:scale-[0.98]">← Về trang chủ</button>
        </div>
      </div>
    </div>
  );
}
