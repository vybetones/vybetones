// ===== Выбор типа гаммы =====
import React from 'react';
import type { ScaleType } from '../types';
import { SCALE_DEFINITIONS } from '../lib/scales';

interface ScaleSelectorProps {
  selected: ScaleType;
  onChange: (scale: ScaleType) => void;
}

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({ selected, onChange }) => {
  const scales = Object.entries(SCALE_DEFINITIONS) as [ScaleType, typeof SCALE_DEFINITIONS[ScaleType]][];

  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-400 uppercase tracking-wide">Гамма</label>
      <div className="flex flex-wrap gap-1.5">
        {scales.map(([key, def]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium transition-all
              ${selected === key 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95'}
            `}
          >
            {def.name.split('(')[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
