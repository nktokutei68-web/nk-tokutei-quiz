'use client';

import { useState, useMemo } from 'react';
import { VocabWord, QuizAnswer } from '@/lib/types';

interface MultipleChoiceQuizProps {
  word: VocabWord;
  allWords: VocabWord[];
  onAnswer: (answer: QuizAnswer) => void;
}

interface Option { id: number; vi: string; isCorrect: boolean; }

function shuffleArray<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s;
}

export default function MultipleChoiceQuiz({ word, allWords, onAnswer }: MultipleChoiceQuizProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const options: Option[] = useMemo(() => {
    const distractors = allWords
      .filter((w) => w.id !== word.id && w.vi !== word.vi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => ({ id: w.id, vi: w.vi, isCorrect: false }));
    return shuffleArray([{ id: word.id, vi: word.vi, isCorrect: true }, ...distractors]);
  }, [word, allWords]);

  const handleSelect = (opt: Option) => {
    if (hasAnswered) return;
    setSelectedId(opt.id);
    setHasAnswered(true);
    onAnswer({ wordId: word.id, isCorrect: opt.isCorrect, userAnswer: opt.vi, correctAnswer: word.vi, word });
  };

  const getStyle = (opt: Option) => {
    if (!hasAnswered) return 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700';
    if (opt.isCorrect) return 'bg-emerald-50 border-emerald-300 text-emerald-700 animate-correctPulse';
    if (opt.id === selectedId && !opt.isCorrect) return 'bg-red-50 border-red-300 text-red-700 animate-shake';
    return 'bg-slate-50 border-slate-200 text-slate-400';
  };

  const isCorrect = selectedId !== null && options.find(o => o.id === selectedId)?.isCorrect === true;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto animate-fadeIn">
      <div className="w-full rounded-xl bg-white border border-slate-200 p-5 sm:p-8 flex flex-col items-center justify-center shadow-sm">
        <span className="text-indigo-400 text-sm sm:text-base font-medium mb-0.5">{word.reading}</span>
        <span className="text-3xl sm:text-5xl font-black text-slate-800">{word.jp}</span>
        <span className="text-[10px] sm:text-xs text-slate-400 mt-1.5">#{word.id}</span>
      </div>

      <div className="w-full grid grid-cols-1 gap-2">
        {options.map((opt, i) => (
          <button
            key={`opt-${opt.id}-${i}`}
            onClick={() => handleSelect(opt)}
            disabled={hasAnswered}
            className={`w-full py-3.5 sm:py-4 px-4 sm:px-5 rounded-xl border text-left font-medium transition-all duration-200 active:scale-[0.98] shadow-sm min-h-[48px] text-sm sm:text-base ${getStyle(opt)}`}
          >
            <span className="text-slate-400 mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
            {opt.vi}
          </button>
        ))}
      </div>

      {hasAnswered && (
        <div className={`w-full p-3 rounded-xl text-center font-medium text-sm animate-fadeIn ${
          isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {isCorrect ? '🎉 Chính xác!' : `❌ Sai! Đáp án: ${word.vi}`}
        </div>
      )}
    </div>
  );
}
