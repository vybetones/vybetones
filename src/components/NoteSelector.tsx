// ===== Выбор ноты (тональности) =====
import React from 'react';
import type { NoteName } from '../types';
import { ALL_NOTES } from '../lib/notes';

interface NoteSelectorProps {
  selected: NoteName;
  onChange: (note: NoteName) => void;
  label?: string;
}

export const NoteSelector: React.FC<NoteSelectorProps> = ({ selected, onChange, label }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs text-zinc-400 uppercase tracking-wide">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {ALL_NOTES.map(note => (
          <button
            key={note}
            onClick={() => onChange(note)}
            className={`
              w-10 h-10 rounded-lg font-bold text-sm transition-all
              ${selected === note 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95'}
            `}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};
