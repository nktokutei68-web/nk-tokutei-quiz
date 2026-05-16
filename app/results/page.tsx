'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { useEffect, useMemo } from 'react';

function getMotivation(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return { emoji: '🎉', message: 'Xuất sắc! Bạn giỏi lắm!', color: 'text-amber-600' };
  if (pct >= 0.7) return { emoji: '💪', message: 'Tốt lắm! Tiếp tục cố gắng!', color: 'text-emerald-600' };
  if (pct >= 0.5) return { emoji: '📚', message: 'Khá tốt! Luyện thêm sẽ giỏi hơn!', color: 'text-indigo-600' };
  return { emoji: '🌱', message: 'Đừng nản! Hãy luyện thêm nhé!', color: 'text-purple-600' };
}

export default function ResultsPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!state.userName || state.answers.length === 0) {
      router.replace('/');
    }
  }, [state.userName, state.answers, router]);

  const total = state.answers.length || 1;
  const score = state.answers.filter((a) => a.isCorrect).length;
  const motivation = getMotivation(score, total);
  const percentage = Math.round((score / total) * 100);

  const wrongAnswers = useMemo(
    () => state.answers.filter((a) => !a.isCorrect),
    [state.answers]
  );

  const handleRetry = () => {
    const config = state.quizConfig;
    dispatch({ type: 'RESET_QUIZ' });
    if (config) {
      dispatch({ type: 'SET_CONFIG', payload: config });
      router.push('/quiz/session');
    } else {
      router.push('/quiz');
    }
  };

  const handleChangeSection = () => {
    dispatch({ type: 'RESET_QUIZ' });
    router.push('/quiz');
  };

  if (!state.userName || state.answers.length === 0) return null;

  const circleRadius = 65;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
      <div className="w-full max-w-lg animate-fadeInUp">
        {/* Score */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40 mb-5">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r={circleRadius} fill="none" stroke="#e2e8f0" strokeWidth="7" />
              <circle
                cx="75" cy="75" r={circleRadius}
                fill="none" stroke="#6366f1" strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800">{score}/{total}</span>
              <span className="text-xs text-slate-400 mt-0.5">{percentage}%</span>
            </div>
          </div>

          <span className="text-4xl mb-2">{motivation.emoji}</span>
          <h2 className={`text-xl font-bold ${motivation.color}`}>{motivation.message}</h2>
          <p className="text-slate-500 text-sm mt-1">
            Bạn trả lời đúng {score} trên {total} câu
          </p>
        </div>

        {/* Wrong answers */}
        {wrongAnswers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-1.5">
              📖 Ôn lại các từ sai ({wrongAnswers.length})
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {wrongAnswers.map((answer, index) => (
                <div
                  key={`${answer.wordId}-${index}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-indigo-500">{answer.word.reading}</span>
                    <span className="text-lg font-bold text-slate-800">{answer.word.jp}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 font-medium text-sm">{answer.correctAnswer}</span>
                    {answer.userAnswer && answer.userAnswer !== answer.correctAnswer && (
                      <p className="text-xs text-red-400 line-through">{answer.userAnswer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleRetry}
            className="flex-1 py-3.5 px-5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all active:scale-[0.98] shadow-sm"
          >
            🔄 Thử lại
          </button>
          <button
            onClick={handleChangeSection}
            className="flex-1 py-3.5 px-5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm"
          >
            📋 Chọn phần khác
          </button>
        </div>
      </div>
    </div>
  );
}
