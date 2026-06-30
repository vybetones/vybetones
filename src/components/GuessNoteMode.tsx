// ===== Режим "Угадай ноту" =====
import React from 'react';
import type { NoteName } from '../types';
import { ALL_NOTES } from '../lib/notes';

interface GuessNoteModeProps {
  targetString: number | null;
  targetFret: number | null;
  lastResult: { correct: boolean; message: string } | null;
  onAnswer: (note: NoteName) => void;
  onNextQuestion: () => void;
  streak: number;
  score: number;
  tuningNotes: NoteName[];
  onResetSelection?: () => void;
}

export const GuessNoteMode: React.FC<GuessNoteModeProps> = ({
  targetString,
  targetFret,
  lastResult,
  onAnswer,
  onNextQuestion,
  streak,
  score,
  tuningNotes,
  onResetSelection
}) => {
  return (
    <div className="space-y-4">
      {/* Заголовок с позицией */}
      <div className="text-center space-y-2">
        <div className="text-sm text-zinc-400">Какая нота на позиции:</div>
        <div className="text-3xl font-bold text-white">
          {targetString !== null && targetFret !== null 
            ? `Струна ${6 - targetString}, Лад ${targetFret}`
            : '—'}
        </div>
        {targetString !== null && (
          <div className="text-lg text-zinc-300">
            Открытая струна: <span className="font-bold text-blue-400">{tuningNotes[targetString]}</span>
          </div>
        )}
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-emerald-400">✓ {score}</span>
          <span className="text-yellow-400">🔥 {streak}</span>
        </div>
      </div>

      {/* Варианты ответов */}
      {!lastResult && (
        <div className="grid grid-cols-4 gap-2">
          {ALL_NOTES.map(note => (
            <button
              key={note}
              onClick={() => onAnswer(note)}
              className="py-3 bg-zinc-800 text-white rounded-lg font-bold text-lg active:scale-95 hover:bg-zinc-700 transition-all"
            >
              {note}
            </button>
          ))}
        </div>
      )}

      {/* Результат */}
      {lastResult && (
        <>
          <div className={`
            text-center p-3 rounded-lg font-medium
            ${lastResult.correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}
          `}>
            {lastResult.message}
          </div>
          <button
            onClick={() => {
              onResetSelection?.();
              onNextQuestion();
            }}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold text-lg active:scale-95 transition-all"
          >
            Следующий вопрос →
          </button>
        </>
      )}
    </div>
  );
};
