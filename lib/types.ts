export interface VocabWord {
  id: number;
  jp: string;
  reading: string;
  vi: string;
}

export interface QuizAnswer {
  wordId: number;
  isCorrect: boolean;
  userAnswer?: string;
  correctAnswer: string;
  word: VocabWord;
}

export interface QuizConfig {
  type: 'section' | 'random';
  sectionNumber?: number;
  startId?: number;
  endId?: number;
  count?: number;
}

export interface QuizState {
  userName: string;
  quizConfig: QuizConfig | null;
  words: VocabWord[];
  currentIndex: number;
  score: number;
  answers: QuizAnswer[];
  isLoading: boolean;
  error: string | null;
}

export type QuizAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CONFIG'; payload: QuizConfig }
  | { type: 'SET_WORDS'; payload: VocabWord[] }
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_QUIZ' }
  | { type: 'RESET_ALL' };
