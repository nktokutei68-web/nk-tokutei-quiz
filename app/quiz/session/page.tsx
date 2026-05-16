'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { fetchWordsByRange, fetchRandomWordsInRange, fetchRandomWords } from '@/lib/fetchWords';
import { QuizAnswer, VocabWord } from '@/lib/types';
import ProgressBar from '@/components/ProgressBar';
import MultipleChoiceQuiz from '@/components/MultipleChoiceQuiz';

export default function QuizSessionPage() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();

  const [words, setWords] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [extraWords, setExtraWords] = useState<VocabWord[]>([]);

  // Use ref to always have the latest answers (avoids stale closure)
  const answersRef = useRef<QuizAnswer[]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (!state.userName) {
      router.replace('/');
      return;
    }
    if (!state.quizConfig) {
      router.replace('/quiz');
      return;
    }
    loadWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWords = async () => {
    if (!state.quizConfig) return;
    setIsLoading(true);
    setError(null);
    try {
      let data: VocabWord[];
      if (state.quizConfig.type === 'section') {
        data = await fetchWordsByRange(state.quizConfig.startId!, state.quizConfig.endId!);
      } else {
        data = await fetchRandomWordsInRange(
          state.quizConfig.startId!,
          state.quizConfig.endId!,
          state.quizConfig.count!
        );
      }

      // Fetch extra words for distractors (from the whole library)
      const extra = await fetchRandomWords(40);
      setExtraWords(extra);
      setWords(data);
      setCurrentIndex(0);
      answersRef.current = [];
      scoreRef.current = 0;
      setAnswered(false);
      setQuestionKey(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải từ vựng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = useCallback((answer: QuizAnswer) => {
    answersRef.current = [...answersRef.current, answer];
    if (answer.isCorrect) {
      scoreRef.current += 1;
    }
    setAnswered(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= words.length) {
      // Store results in context using ref (always up-to-date)
      dispatch({ type: 'SET_WORDS', payload: words });
      answersRef.current.forEach((a) => dispatch({ type: 'ANSWER_QUESTION', payload: a }));
      router.push('/results');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false);
      setQuestionKey((prev) => prev + 1);
    }
  }, [currentIndex, words, dispatch, router]);

  if (!state.userName || !state.quizConfig) return null;

  // Loading
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="animate-float mb-6">
          <span className="text-5xl">📚</span>
        </div>
        <div className="space-y-3 w-full max-w-md">
          <div className="h-3 bg-slate-200 rounded-full animate-pulse w-1/3 mx-auto" />
          <div className="h-28 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <p className="text-slate-400 mt-6 text-sm">Đang tải từ vựng...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <span className="text-5xl mb-4">😵</span>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-slate-500 text-center mb-6 max-w-md text-sm">{error}</p>
        <button
          onClick={loadWords}
          className="py-2.5 px-6 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all active:scale-95 shadow-sm"
        >
          🔄 Thử lại
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const allWordsForOptions = [...words, ...extraWords];

  // Label
  const configLabel = state.quizConfig.type === 'section'
    ? `Phần ${state.quizConfig.sectionNumber}`
    : `Test ngẫu nhiên (#${state.quizConfig.startId}–${state.quizConfig.endId})`;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 md:py-8">
      <div className="w-full max-w-lg">
        {/* Config label */}
        <div className="flex items-center justify-center mb-5">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {configLabel}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar current={currentIndex + 1} total={words.length} />
        </div>

        {/* Quiz */}
        <div key={questionKey}>
          <MultipleChoiceQuiz
            word={currentWord}
            allWords={allWordsForOptions}
            onAnswer={handleAnswer}
          />
        </div>

        {/* Next button */}
        {answered && (
          <div className="mt-6 animate-fadeIn">
            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              {currentIndex + 1 >= words.length ? '📊 Xem kết quả' : 'Tiếp theo →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
