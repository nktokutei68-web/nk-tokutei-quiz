'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizState, QuizAction } from '@/lib/types';

const initialState: QuizState = {
  userName: '',
  quizConfig: null,
  words: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  isLoading: false,
  error: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, userName: action.payload };
    case 'SET_CONFIG':
      return { ...state, quizConfig: action.payload };
    case 'SET_WORDS':
      return { ...state, words: action.payload, currentIndex: 0, score: 0, answers: [], error: null };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: [...state.answers, action.payload],
        score: action.payload.isCorrect ? state.score + 1 : state.score,
      };
    case 'NEXT_QUESTION':
      return { ...state, currentIndex: state.currentIndex + 1 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET_QUIZ':
      return { ...state, words: [], currentIndex: 0, score: 0, answers: [], error: null, quizConfig: null };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

interface QuizContextValue {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
