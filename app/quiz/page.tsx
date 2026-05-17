'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import { useEffect, useState } from 'react';
import { getHistory, clearHistory, getConfigLabel, formatDate, TestHistoryEntry } from '@/lib/history';

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
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(getHistory());
  }, []);

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
        <div className="flex items-center justify-between mb-6 bg-white/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="min-w-0">
            <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Học viên NK TOKUTEI</p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 truncate mt-0.5">
              {state.userName} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Chọn phần từ vựng QLSX hoặc bắt đầu kiểm tra ngẫu nhiên.</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 ml-3 py-2 px-3 rounded-xl bg-slate-100/80 border border-slate-200/40 text-slate-500 text-xs sm:text-sm font-semibold hover:bg-slate-200 hover:text-slate-700 transition-all duration-300 active:scale-95 shadow-sm"
          >
            ← Thoát
          </button>
        </div>

        {/* Random test button */}
        <div className="mb-6">
          <button
            onClick={() => setShowRandomConfig(!showRandomConfig)}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-50/60 to-violet-50/60 border border-indigo-100/50 hover:border-indigo-200 transition-all duration-300 group active:scale-[0.99] shadow-sm backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xl text-white group-hover:scale-105 transition-all duration-300 shrink-0 shadow-md shadow-indigo-100">
                🎲
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-800 block text-sm sm:text-base">Tạo bài kiểm tra ngẫu nhiên</span>
                <span className="text-xs text-slate-400">Tùy chỉnh số câu và phạm vi ID từ vựng</span>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-indigo-500 transition-transform duration-300 shrink-0 ${showRandomConfig ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showRandomConfig && (
            <div className="mt-2.5 p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-lg shadow-indigo-50/20 animate-fadeIn space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số câu hỏi</label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(Math.max(4, Math.min(100, parseInt(e.target.value) || 4)))}
                  min={4}
                  max={100}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-800 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-inner"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Từ ID</label>
                  <input
                    type="number"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={TOTAL_WORDS}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-800 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Đến ID</label>
                  <input
                    type="number"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(Math.min(TOTAL_WORDS, parseInt(e.target.value) || TOTAL_WORDS))}
                    min={1}
                    max={TOTAL_WORDS}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-800 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-inner"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Phạm vi được chọn: <span className="text-indigo-600 font-bold">#{rangeFrom}</span> – <span className="text-indigo-600 font-bold">#{rangeTo}</span> (Tổng cộng: {Math.max(0, rangeTo - rangeFrom + 1)} thuật ngữ)
              </div>
              <button
                onClick={handleStartRandom}
                disabled={rangeFrom > rangeTo || randomCount < 4}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:opacity-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-md shadow-indigo-100"
              >
                Bắt đầu làm bài ({randomCount} câu) →
              </button>
            </div>
          )}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <span>🛠️</span> Luyện theo phần chuyên ngành
          </h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50">{TOTAL_SECTIONS} phần</span>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
          {Array.from({ length: TOTAL_SECTIONS }, (_, i) => {
            const sectionNum = i + 1;
            const startId = i * WORDS_PER_SECTION + 1;
            const endId = Math.min((i + 1) * WORDS_PER_SECTION, TOTAL_WORDS);
            const wordCount = endId - startId + 1;

            return (
              <button
                key={sectionNum}
                onClick={() => handleSelectSection(sectionNum)}
                className="group p-3.5 sm:p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 hover:border-indigo-300/80 hover:bg-white hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300 active:scale-[0.95] text-left flex flex-col justify-between min-h-[88px] relative overflow-hidden"
              >
                {/* Decorative border highlight */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  <div className="text-[10px] sm:text-xs font-extrabold text-indigo-600 tracking-wider uppercase">Phần {sectionNum}</div>
                  <div className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors mt-1">
                    #{startId}–{endId}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 border-t border-slate-100 pt-1.5 w-full">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{wordCount} thuật ngữ</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 text-indigo-500 font-bold">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* History section */}
        {history.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/50 hover:bg-white hover:shadow-md transition-all duration-300 active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📊</span>
                <span className="font-extrabold text-slate-800 text-sm sm:text-base">Lịch sử luyện tập ({history.length})</span>
              </div>
              <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showHistory && (
              <div className="mt-2.5 space-y-2.5 animate-fadeIn">
                {history.map((entry) => {
                  const pct = Math.round((entry.score / entry.total) * 100);
                  const isExpanded = expandedEntry === entry.id;
                  return (
                    <div key={entry.id} className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-350 transition-all duration-300">
                      <button
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50/50 transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center text-[10px] font-black shrink-0 shadow-sm ${
                            pct >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : pct >= 50 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                          }`}>
                            <span className="text-sm font-black">{pct}%</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-slate-800 truncate">{getConfigLabel(entry.quizConfig)}</div>
                            <div className="text-xs text-slate-400 font-medium mt-0.5">{formatDate(entry.date)} • {entry.score}/{entry.total} câu đúng</div>
                          </div>
                        </div>
                        {entry.wrongWords.length > 0 && (
                          <svg className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                      {isExpanded && entry.wrongWords.length > 0 && (
                        <div className="px-4 pb-4 border-t border-slate-100/60 bg-slate-50/30">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider py-3">Từ vựng cần ôn tập lại ({entry.wrongWords.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {entry.wrongWords.map((w, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-rose-50/80 border border-rose-100/50 text-rose-700 px-3 py-1.5 rounded-xl shadow-sm">
                                <span className="font-extrabold">{w.jp}</span>
                                <span className="text-slate-400 font-medium">({w.reading})</span>
                                <span className="text-rose-400 font-bold">=</span>
                                <span className="font-bold">{w.vi}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => { clearHistory(); setHistory([]); setShowHistory(false); }}
                  className="w-full py-3 text-sm text-rose-500 hover:text-rose-600 font-extrabold transition-all duration-300 active:scale-[0.98] border border-dashed border-rose-200 hover:bg-rose-50/30 rounded-xl mt-2"
                >
                  🗑️ Xóa sạch lịch sử luyện tập
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
