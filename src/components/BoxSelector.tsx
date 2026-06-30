import React from 'react';

interface BoxSelectorProps {
  selectedBox: number; // 0 = все, 1-5 = конкретный бокс
  onChange: (box: number) => void;
  totalBoxes: number;
}

export const BoxSelector: React.FC<BoxSelectorProps> = ({
  selectedBox,
  onChange,
  totalBoxes
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-400 uppercase tracking-wide">Бокс</label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onChange(0)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${selectedBox === 0
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95'}
          `}
        >
          Все
        </button>
        {Array.from({ length: totalBoxes }, (_, i) => i + 1).map(box => (
          <button
            key={box}
            onClick={() => onChange(box)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedBox === box
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:scale-95'}
            `}
          >
            {box}
          </button>
        ))}
      </div>
    </div>
  );
};
