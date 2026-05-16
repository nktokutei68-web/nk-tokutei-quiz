import { QuizConfig, QuizAnswer } from './types';

export interface TestHistoryEntry {
  id: string;
  userName: string;
  date: string;
  quizConfig: QuizConfig;
  score: number;
  total: number;
  wrongWords: { jp: string; reading: string; vi: string }[];
}

const STORAGE_KEY = 'nk_tokutei_quiz_history';

export function getHistory(): TestHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResult(
  userName: string,
  quizConfig: QuizConfig,
  answers: QuizAnswer[]
): TestHistoryEntry {
  const entry: TestHistoryEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    userName,
    date: new Date().toISOString(),
    quizConfig,
    score: answers.filter((a) => a.isCorrect).length,
    total: answers.length,
    wrongWords: answers
      .filter((a) => !a.isCorrect)
      .map((a) => ({ jp: a.word.jp, reading: a.word.reading, vi: a.correctAnswer })),
  };

  const history = getHistory();
  history.unshift(entry);
  // Keep max 50 entries
  const trimmed = history.slice(0, 50);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full — remove oldest
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed.slice(0, 20)));
  }

  return entry;
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getConfigLabel(config: QuizConfig): string {
  if (config.type === 'section') return `Phần ${config.sectionNumber}`;
  return `Ngẫu nhiên #${config.startId}–${config.endId}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month} ${hour}:${min}`;
}
