'use client';

import { useState } from 'react';
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

  const [options] = useState<Option[]>(() => {
    const distractors = allWords
      .filter((w) => w.id !== word.id && w.vi !== word.vi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => ({ id: w.id, vi: w.vi, isCorrect: false }));
    return shuffleArray([{ id: word.id, vi: word.vi, isCorrect: true }, ...distractors]);
  });

  const handleSelect = (opt: Option) => {
    if (hasAnswered) return;
    setSelectedId(opt.id);
    setHasAnswered(true);
    onAnswer({ wordId: word.id, isCorrect: opt.isCorrect, userAnswer: opt.vi, correctAnswer: word.vi, word });
  };

  const getStyle = (opt: Option) => {
    if (!hasAnswered) return 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 hover:scale-[1.01]';
    if (opt.isCorrect) return 'bg-gradient-to-r from-emerald-50 to-emerald-50/30 border-emerald-400 text-emerald-700 animate-correctPulse font-extrabold shadow-sm shadow-emerald-50';
    if (opt.id === selectedId && !opt.isCorrect) return 'bg-gradient-to-r from-rose-50 to-rose-50/30 border-rose-400 text-rose-700 animate-shake font-extrabold shadow-sm shadow-rose-50';
    return 'bg-slate-50 border-slate-100 text-slate-400/80 opacity-70';
  };

  const isCorrect = selectedId !== null && options.find(o => o.id === selectedId)?.isCorrect === true;

  return (
    <div className="flex flex-col items-center gap-4.5 w-full max-w-lg mx-auto animate-fadeIn">
      {/* Premium Japanese Flashcard */}
      <div className="w-full rounded-3xl bg-gradient-to-tr from-white to-indigo-50/20 border border-slate-200/80 p-6 sm:p-10 flex flex-col items-center justify-center shadow-xl shadow-slate-100/50 relative overflow-hidden">
        {/* Ambient decoration */}
        <div className="absolute top-3 right-4 text-[9px] font-extrabold text-indigo-500 bg-indigo-50/80 border border-indigo-100/50 px-2.5 py-0.5 rounded-full tracking-widest uppercase">
          #{word.id}
        </div>
        <span className="text-indigo-500/80 text-sm sm:text-base font-extrabold tracking-wide mb-1 select-none">{word.reading}</span>
        <span className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight text-center drop-shadow-sm leading-tight select-all">
          {word.jp}
        </span>
      </div>

      {/* Choice Buttons */}
      <div className="w-full grid grid-cols-1 gap-2.5">
        {options.map((opt, i) => {
          const isOptSelected = opt.id === selectedId;
          return (
            <button
              key={`opt-${opt.id}-${i}`}
              onClick={() => handleSelect(opt)}
              disabled={hasAnswered}
              className={`w-full py-4 px-5 rounded-2xl border text-left font-semibold transition-all duration-300 active:scale-[0.98] shadow-sm min-h-[52px] text-sm sm:text-base flex items-center justify-between ${getStyle(opt)}`}
            >
              <div className="flex items-center min-w-0 mr-3">
                <span className="text-slate-400 mr-3 font-extrabold shrink-0">{String.fromCharCode(65 + i)}.</span>
                <span className="truncate">{opt.vi}</span>
              </div>
              {hasAnswered && opt.isCorrect && (
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {hasAnswered && isOptSelected && !opt.isCorrect && (
                <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback Banner */}
      {hasAnswered && (
        <div className={`w-full p-4 rounded-2xl text-center font-extrabold text-sm sm:text-base border shadow-sm animate-fadeIn flex items-center justify-center gap-2 ${
          isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-50/30' : 'bg-rose-50 border-rose-200 text-rose-700 shadow-rose-50/30'
        }`}>
          {isCorrect ? (
            <>
              <span>🎉</span>
              <span>ĐÁP ÁN CHÍNH XÁC!</span>
            </>
          ) : (
            <>
              <span>❌</span>
              <span>SAI RỒI! ĐÁP ÁN ĐÚNG LÀ: <span className="underline decoration-2 underline-offset-4">{word.vi}</span></span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
