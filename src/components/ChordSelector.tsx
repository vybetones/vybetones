// ===== Выбор типа аккорда =====
import React from 'react';
import type { ChordType } from '../types';
import { CHORD_DEFINITIONS } from '../lib/chords';

interface ChordSelectorProps {
  selected: ChordType;
  onChange: (chord: ChordType) => void;
}

export const ChordSelector: React.FC<ChordSelectorProps> = ({ selected, onChange }) => {
  const chords = Object.entries(CHORD_DEFINITIONS) as [ChordType, typeof CHORD_DEFINITIONS[ChordType]][];

  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-400 uppercase tracking-wide">Аккорд</label>
      <div className="flex flex-wrap gap-1.5">
        {chords.map(([key, def]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium transition-all
              ${selected === key 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95'}
            `}
          >
            {def.symbol || def.name}
          </button>
        ))}
      </div>
    </div>
  );
};
