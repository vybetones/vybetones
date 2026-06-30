// ===== Настройки =====
import React from 'react';
import type { AppSettings, GuitarTuning } from '../types';
import { STANDARD_TUNING, DROP_D_TUNING, HALF_STEP_DOWN_TUNING } from '../lib/notes';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  onClose: () => void;
}

const TUNINGS: GuitarTuning[] = [
  STANDARD_TUNING,
  DROP_D_TUNING,
  HALF_STEP_DOWN_TUNING
];

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Настройки</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl">×</button>
        </div>

        {/* Строй */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Строй гитары</label>
          <div className="flex flex-wrap gap-2">
            {TUNINGS.map(tuning => (
              <button
                key={tuning.name}
                onClick={() => onUpdate({ tuning })}
                className={`
                  px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${settings.tuning.name === tuning.name 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}
                `}
              >
                {tuning.name}
              </button>
            ))}
          </div>
          <div className="text-xs text-zinc-500">
            {settings.tuning.notes.join(' ')}
          </div>
        </div>

        {/* Количество ладов */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Количество ладов</label>
          <div className="flex gap-2">
            {[12, 15, 22, 24].map(count => (
              <button
                key={count}
                onClick={() => onUpdate({ fretCount: count })}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-medium transition-all
                  ${settings.fretCount === count 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}
                `}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Ориентация */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Леворукий режим</span>
          <button
            onClick={() => onUpdate({ leftHanded: !settings.leftHanded })}
            className={`
              w-12 h-6 rounded-full transition-all
              ${settings.leftHanded ? 'bg-blue-500' : 'bg-zinc-700'}
            `}
          >
            <div className={`
              w-5 h-5 bg-white rounded-full transition-transform
              ${settings.leftHanded ? 'translate-x-6' : 'translate-x-0.5'}
            `} />
          </button>
        </div>

        {/* Отображение */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Показывать октавы</span>
            <button
              onClick={() => onUpdate({ showOctaves: !settings.showOctaves })}
              className={`
                w-12 h-6 rounded-full transition-all
                ${settings.showOctaves ? 'bg-blue-500' : 'bg-zinc-700'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform
                ${settings.showOctaves ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Показывать интервалы</span>
            <button
              onClick={() => onUpdate({ showIntervals: !settings.showIntervals })}
              className={`
                w-12 h-6 rounded-full transition-all
                ${settings.showIntervals ? 'bg-blue-500' : 'bg-zinc-700'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform
                ${settings.showIntervals ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Звуки</span>
            <button
              onClick={() => onUpdate({ soundEnabled: !settings.soundEnabled })}
              className={`
                w-12 h-6 rounded-full transition-all
                ${settings.soundEnabled ? 'bg-blue-500' : 'bg-zinc-700'}
              `}
            >
              <div className={`
                w-5 h-5 bg-white rounded-full transition-transform
                ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600 transition-all"
        >
          Готово
        </button>
      </div>
    </div>
  );
};
