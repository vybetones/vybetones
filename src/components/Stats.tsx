// ===== Статистика =====
import React from 'react';
import type { TrainingStats, AppMode } from '../types';
import { getAccuracy, getModeAccuracy } from '../lib/storage';

interface StatsProps {
  stats: TrainingStats;
  onReset: () => void;
  onClose: () => void;
}

export const Stats: React.FC<StatsProps> = ({ stats, onReset, onClose }) => {
  const accuracy = getAccuracy(stats);
  const modeNames: Record<AppMode, string> = {
    explore: 'Обзор',
    find_note: 'Найди ноту',
    guess_note: 'Угадай ноту',
    scale: 'Гаммы',
    chord: 'Аккорды'
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Статистика</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl">×</button>
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalQuestions}</div>
            <div className="text-xs text-zinc-400">Вопросов</div>
          </div>
          <div className="bg-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{accuracy}%</div>
            <div className="text-xs text-zinc-400">Точность</div>
          </div>
          <div className="bg-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.currentStreak}</div>
            <div className="text-xs text-zinc-400">Серия</div>
          </div>
          <div className="bg-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.bestStreak}</div>
            <div className="text-xs text-zinc-400">Лучшая серия</div>
          </div>
        </div>

        {/* По режимам */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">По режимам</h3>
          {(Object.keys(modeNames) as AppMode[]).map(mode => {
            const modeStats = stats.byMode[mode];
            const modeAcc = getModeAccuracy(stats, mode);
            if (modeStats.total === 0) return null;
            return (
              <div key={mode} className="flex justify-between items-center bg-zinc-800 rounded-lg p-3">
                <span className="text-sm text-zinc-300">{modeNames[mode]}</span>
                <div className="flex gap-3 text-sm">
                  <span className="text-emerald-400">{modeStats.correct}/{modeStats.total}</span>
                  <span className="text-zinc-400">{modeAcc}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Последние ошибки */}
        {stats.recentErrors.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">Последние ошибки</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {stats.recentErrors.slice(0, 5).map((err, i) => (
                <div key={i} className="bg-red-500/10 rounded-lg p-2 text-xs text-red-300">
                  {err.question.type === 'find_note' 
                    ? `Искал: ${err.question.targetNote}` 
                    : `Позиция: струна ${err.question.targetString! + 1}, лад ${err.question.targetFret}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
          >
            Сбросить
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-600 transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
