'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { useEffect, useState } from 'react';

const WORDS_PER_SECTION = 20;
const TOTAL_WORDS = 1001;
const TOTAL_SECTIONS = Math.ceil(TOTAL_WORDS / WORDS_PER_SECTION);

export default function QuizSelectionPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  const [showRandomConfig, setShowRandomConfig] = useState(false);
  const [randomCount, setRandomCount] = useState(20);
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(TOTAL_WORDS);

  useEffect(() => {
    if (!state.userName) {
      router.replace('/');
    }
  }, [state.userName, router]);

  const handleSelectSection = (sectionNumber: number) => {
    const startId = (sectionNumber - 1) * WORDS_PER_SECTION + 1;
    const endId = Math.min(sectionNumber * WORDS_PER_SECTION, TOTAL_WORDS);
    dispatch({
      type: 'SET_CONFIG',
      payload: { type: 'section', sectionNumber, startId, endId },
    });
    router.push('/quiz/session');
  };

  const handleStartRandom = () => {
    if (rangeFrom > rangeTo || randomCount < 4) return;
    dispatch({
      type: 'SET_CONFIG',
      payload: {
        type: 'random',
        startId: rangeFrom,
        endId: rangeTo,
        count: randomCount,
      },
    });
    router.push('/quiz/session');
  };

  const handleLogout = () => {
    dispatch({ type: 'RESET_ALL' });
    router.push('/');
  };

  if (!state.userName) return null;

  return (
    <div className="flex-1 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6 md:py-10">
      <div className="w-full max-w-3xl animate-fadeInUp">
        {/* Greeting + logout */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-500 text-sm">Xin chào,</p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
              {state.userName}! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Chọn phần luyện tập hoặc tạo bài test ngẫu nhiên.</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 ml-3 py-2 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-200 hover:text-slate-700 transition-all active:scale-95"
          >
            ← Thoát
          </button>
        </div>

        {/* Random test button */}
        <div className="mb-6">
          <button
            onClick={() => setShowRandomConfig(!showRandomConfig)}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:border-indigo-200 transition-all group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl group-hover:bg-indigo-200 transition-colors shrink-0">
                🎲
              </div>
              <div className="text-left">
                <span className="font-semibold text-indigo-700 block text-sm sm:text-base">Tạo bài test ngẫu nhiên</span>
                <span className="text-xs sm:text-sm text-indigo-500">Tùy chỉnh số câu và mốc từ vựng</span>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-indigo-400 transition-transform duration-200 shrink-0 ${showRandomConfig ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showRandomConfig && (
            <div className="mt-2 p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm animate-fadeIn space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Số câu hỏi</label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(Math.max(4, Math.min(100, parseInt(e.target.value) || 4)))}
                  min={4}
                  max={100}
                  className="w-full py-3 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Từ ID</label>
                  <input
                    type="number"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={TOTAL_WORDS}
                    className="w-full py-3 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Đến ID</label>
                  <input
                    type="number"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(Math.min(TOTAL_WORDS, parseInt(e.target.value) || TOTAL_WORDS))}
                    min={1}
                    max={TOTAL_WORDS}
                    className="w-full py-3 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Phạm vi: #{rangeFrom}–#{rangeTo} ({Math.max(0, rangeTo - rangeFrom + 1)} từ)
              </div>
              <button
                onClick={handleStartRandom}
                disabled={rangeFrom > rangeTo || randomCount < 4}
                className="w-full py-3.5 px-5 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
              >
                Bắt đầu ({randomCount} câu) →
              </button>
            </div>
          )}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-slate-700">Luyện theo phần</h2>
          <span className="text-xs sm:text-sm text-slate-400">{TOTAL_SECTIONS} phần</span>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: TOTAL_SECTIONS }, (_, i) => {
            const sectionNum = i + 1;
            const startId = i * WORDS_PER_SECTION + 1;
            const endId = Math.min((i + 1) * WORDS_PER_SECTION, TOTAL_WORDS);
            const wordCount = endId - startId + 1;

            return (
              <button
                key={sectionNum}
                onClick={() => handleSelectSection(sectionNum)}
                className="group p-3 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200 active:scale-[0.95] text-left min-h-[72px]"
              >
                <div className="text-xs font-medium text-indigo-500">Phần {sectionNum}</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors mt-0.5">
                  #{startId}–{endId}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{wordCount} từ</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
