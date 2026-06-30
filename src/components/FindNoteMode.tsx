// ===== Режим "Найди ноту" =====
import React, { useEffect } from 'react';
import type { NoteName, FretNote } from '../types';
import { ALL_NOTES } from '../lib/notes';

interface FindNoteModeProps {
  targetNote: NoteName | null;
  onNoteClick: (fretNote: FretNote) => void;
  lastResult: { correct: boolean; message: string } | null;
  onNextQuestion: () => void;
  streak: number;
  score: number;
  onResetSelection?: () => void;
}

export const FindNoteMode: React.FC<FindNoteModeProps> = ({
  targetNote,
  onNoteClick,
  lastResult,
  onNextQuestion,
  streak,
  score,
  onResetSelection
}) => {
  return (
    <div className="space-y-4">
      {/* Заголовок с вопросом */}
      <div className="text-center space-y-2">
        <div className="text-sm text-zinc-400">Найди на грифе:</div>
        <div className="text-4xl font-bold text-white">
          {targetNote || '—'}
        </div>
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-emerald-400">✓ {score}</span>
          <span className="text-yellow-400">🔥 {streak}</span>
        </div>
      </div>

      {/* Результат */}
      {lastResult && (
        <div className={`
          text-center p-3 rounded-lg font-medium
          ${lastResult.correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}
        `}>
          {lastResult.message}
        </div>
      )}

      {/* Кнопка следующего вопроса */}
      {lastResult && (
        <button
          onClick={() => {
            onResetSelection?.();
            onNextQuestion();
          }}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold text-lg active:scale-95 transition-all"
        >
          Следующий вопрос →
        </button>
      )}
    </div>
  );
};
