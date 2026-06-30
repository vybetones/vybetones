// ===== Переключатель режимов =====
import React from 'react';
import type { AppMode } from '../types';

interface ModeSelectorProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

const MODES: { key: AppMode; label: string; icon: string }[] = [
  { key: 'explore', label: 'Обзор', icon: '🎸' },
  { key: 'scale', label: 'Гаммы', icon: '🎵' },
  { key: 'chord', label: 'Аккорды', icon: '🎶' },
  { key: 'find_note', label: 'Найди', icon: '🔍' },
  { key: 'guess_note', label: 'Угадай', icon: '❓' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className="flex gap-1 bg-zinc-900/80 p-1 rounded-xl backdrop-blur-sm">
      {MODES.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`
            flex-1 flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-xs font-medium transition-all
            ${mode === m.key 
              ? 'bg-zinc-700 text-white shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200 active:scale-95'}
          `}
        >
          <span className="text-base">{m.icon}</span>
          <span className="text-[10px]">{m.label}</span>
        </button>
      ))}
    </div>
  );
};
