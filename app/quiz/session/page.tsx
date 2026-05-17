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
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  async function loadWords() {
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
      dispatch({ type: 'SET_WORDS', payload: words });
      answersRef.current.forEach((a) => dispatch({ type: 'ANSWER_QUESTION', payload: a }));
      router.push('/results');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false);
      setQuestionKey((prev) => prev + 1);
    }
  }, [currentIndex, words, dispatch, router]);

  const handleExit = () => {
    dispatch({ type: 'RESET_QUIZ' });
    router.push('/quiz');
  };

  if (!state.userName || !state.quizConfig) return null;

  // Loading
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <span className="text-4xl animate-bounce">⚙️</span>
        </div>
        <div className="space-y-3.5 w-full max-w-md bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="h-3 bg-indigo-100 rounded-full animate-pulse w-1/3 mx-auto" />
          <div className="h-20 bg-slate-100/50 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100/50 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100/50 rounded-xl animate-pulse" />
        </div>
        <p className="text-slate-500 font-bold mt-6 text-sm animate-pulse">Đang đồng bộ từ vựng QLSX...</p>
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
        <div className="flex gap-3">
          <button
            onClick={handleExit}
            className="py-3 px-5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-semibold hover:bg-slate-200 transition-all active:scale-95"
          >
            ← Quay về
          </button>
          <button
            onClick={loadWords}
            className="py-3 px-5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all active:scale-95 shadow-sm"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const allWordsForOptions = [...words, ...extraWords];

  const configLabel = state.quizConfig.type === 'section'
    ? `Phần ${state.quizConfig.sectionNumber}`
    : `Test ngẫu nhiên (#${state.quizConfig.startId}–${state.quizConfig.endId})`;

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="w-full max-w-lg">
        {/* Top bar: back button + label */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="py-2 px-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/50 text-slate-500 text-xs sm:text-sm font-bold hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 shadow-sm"
          >
            ← Quay về
          </button>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100/50 shadow-sm">
            {configLabel}
          </span>
        </div>

        {/* Exit confirmation modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl animate-fadeInUp relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-20 h-20 rounded-full bg-rose-200/20 blur-xl pointer-events-none" />
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-xl text-rose-500 mb-3 animate-bounce">
                  ⚠️
                </div>
                <h3 className="text-lg font-black text-slate-800">Tạm dừng ôn tập?</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">Tiến trình làm bài QLSX hiện tại của bạn sẽ không được lưu lại. Bạn chắc chắn muốn quay về?</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 border border-slate-200/50 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all duration-300 active:scale-[0.98] shadow-sm"
                >
                  Tiếp tục học
                </button>
                <button
                  onClick={handleExit}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-50 to-red-600 text-white font-bold text-sm hover:opacity-95 transition-all duration-300 active:scale-[0.98] shadow-md shadow-rose-100"
                >
                  Xác nhận thoát
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-5">
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

        {/* Next button — fixed at bottom on mobile */}
        {answered && (
          <div className="mt-5 pb-2 animate-fadeIn">
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-base hover:opacity-95 transition-all duration-200 active:scale-[0.98] shadow-md shadow-indigo-150 min-h-[52px]"
            >
              {currentIndex + 1 >= words.length ? '📊 Xem kết quả cuộc thi' : 'Từ tiếp theo →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
