// ===== Переключатель позиций аккорда =====
import React from 'react';
import type { ChordPosition } from '../lib/chordPositions';

interface ChordPositionSelectorProps {
  positions: ChordPosition[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const ChordPositionSelector: React.FC<ChordPositionSelectorProps> = ({
  positions,
  selectedIndex,
  onChange
}) => {
  if (positions.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-400 uppercase tracking-wide">Позиция</label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {positions.map((pos, index) => (
          <button
            key={index}
            onClick={() => onChange(index)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedIndex === index
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95'}
            `}
          >
            <div>{pos.name}</div>
            <div className="text-[10px] opacity-70">{pos.fingerCount} пальца</div>
          </button>
        ))}
      </div>
    </div>
  );
};
