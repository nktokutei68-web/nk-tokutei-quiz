'use client';

import { useState, useMemo } from 'react';
import { VocabWord, QuizAnswer } from '@/lib/types';

interface MultipleChoiceQuizProps {
  word: VocabWord;
  allWords: VocabWord[];
  onAnswer: (answer: QuizAnswer) => void;
}

interface Option {
  id: number;    // word ID for unique identification
  vi: string;    // display text
  isCorrect: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MultipleChoiceQuiz({ word, allWords, onAnswer }: MultipleChoiceQuizProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const options: Option[] = useMemo(() => {
    // Get distractors: different word ID AND different meaning text
    const distractors = allWords
      .filter((w) => w.id !== word.id && w.vi !== word.vi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => ({ id: w.id, vi: w.vi, isCorrect: false }));

    const correct: Option = { id: word.id, vi: word.vi, isCorrect: true };

    return shuffleArray([correct, ...distractors]);
  }, [word, allWords]);

  const handleSelect = (option: Option) => {
    if (hasAnswered) return;
    setSelectedOptionId(option.id);
    setHasAnswered(true);

    onAnswer({
      wordId: word.id,
      isCorrect: option.isCorrect,
      userAnswer: option.vi,
      correctAnswer: word.vi,
      word,
    });
  };

  const getOptionStyle = (option: Option) => {
    if (!hasAnswered) {
      return 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700';
    }
    // Always highlight the correct answer green
    if (option.isCorrect) {
      return 'bg-emerald-50 border-emerald-300 text-emerald-700 animate-correctPulse';
    }
    // If this option was selected AND it's wrong, show red
    if (option.id === selectedOptionId && !option.isCorrect) {
      return 'bg-red-50 border-red-300 text-red-700 animate-shake';
    }
    // Other unselected wrong options
    return 'bg-slate-50 border-slate-200 text-slate-400';
  };

  const isCorrectAnswer = selectedOptionId !== null &&
    options.find(o => o.id === selectedOptionId)?.isCorrect === true;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto animate-fadeIn">
      {/* Word display */}
      <div className="w-full rounded-xl bg-white border border-slate-200 p-6 md:p-8 flex flex-col items-center justify-center shadow-sm">
        <span className="text-indigo-400 text-base md:text-lg font-medium mb-1">
          {word.reading}
        </span>
        <span className="text-4xl md:text-5xl font-black text-slate-800">
          {word.jp}
        </span>
        <span className="text-xs text-slate-400 mt-2">#{word.id}</span>
      </div>

      {/* Options */}
      <div className="w-full grid grid-cols-1 gap-2.5">
        {options.map((option, index) => (
          <button
            key={`opt-${option.id}-${index}`}
            onClick={() => handleSelect(option)}
            disabled={hasAnswered}
            className={`w-full py-3.5 px-5 rounded-xl border text-left font-medium transition-all duration-200 active:scale-[0.98] shadow-sm ${getOptionStyle(option)}`}
          >
            <span className="text-slate-400 mr-2.5 font-semibold">{String.fromCharCode(65 + index)}.</span>
            {option.vi}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {hasAnswered && (
        <div className={`w-full p-3.5 rounded-xl text-center font-medium text-sm animate-fadeIn ${
          isCorrectAnswer
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {isCorrectAnswer
            ? '🎉 Chính xác!'
            : `❌ Sai rồi! Đáp án: ${word.vi}`}
        </div>
      )}
    </div>
  );
}
