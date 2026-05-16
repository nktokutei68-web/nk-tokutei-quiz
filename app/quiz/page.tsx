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

  // Random test config
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

  if (!state.userName) return null;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 md:py-10">
      <div className="w-full max-w-3xl animate-fadeInUp">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-slate-500 text-sm">Xin chào,</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {state.userName}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Chọn phần luyện tập hoặc tạo bài test ngẫu nhiên.</p>
        </div>

        {/* Random test button */}
        <div className="mb-8">
          <button
            onClick={() => setShowRandomConfig(!showRandomConfig)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl group-hover:bg-indigo-200 transition-colors">
                🎲
              </div>
              <div className="text-left">
                <span className="font-semibold text-indigo-700 block">Tạo bài test ngẫu nhiên</span>
                <span className="text-sm text-indigo-500">Tùy chỉnh số câu và mốc từ vựng</span>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-indigo-400 transition-transform duration-200 ${showRandomConfig ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Random config panel */}
          {showRandomConfig && (
            <div className="mt-3 p-5 rounded-xl bg-white border border-slate-200 shadow-sm animate-fadeIn space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Số câu hỏi
                </label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(Math.max(4, Math.min(100, parseInt(e.target.value) || 4)))}
                  min={4}
                  max={100}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Từ ID bắt đầu
                  </label>
                  <input
                    type="number"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={TOTAL_WORDS}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    Đến ID
                  </label>
                  <input
                    type="number"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(Math.min(TOTAL_WORDS, parseInt(e.target.value) || TOTAL_WORDS))}
                    min={1}
                    max={TOTAL_WORDS}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400">
                Phạm vi: từ #{rangeFrom} đến #{rangeTo} ({Math.max(0, rangeTo - rangeFrom + 1)} từ có sẵn)
              </div>
              <button
                onClick={handleStartRandom}
                disabled={rangeFrom > rangeTo || randomCount < 4}
                className="w-full py-3 px-5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm"
              >
                Bắt đầu test ({randomCount} câu) →
              </button>
            </div>
          )}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-700">Luyện theo phần</h2>
          <span className="text-sm text-slate-400">{TOTAL_SECTIONS} phần • {TOTAL_WORDS} từ</span>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: TOTAL_SECTIONS }, (_, i) => {
            const sectionNum = i + 1;
            const startId = i * WORDS_PER_SECTION + 1;
            const endId = Math.min((i + 1) * WORDS_PER_SECTION, TOTAL_WORDS);
            const wordCount = endId - startId + 1;

            return (
              <button
                key={sectionNum}
                onClick={() => handleSelectSection(sectionNum)}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200 active:scale-[0.97] text-left"
              >
                <div className="text-xs font-medium text-indigo-500 mb-1">Phần {sectionNum}</div>
                <div className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  #{startId}–{endId}
                </div>
                <div className="text-xs text-slate-400 mt-1">{wordCount} từ</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
