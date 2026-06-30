// ===== Интерактивный гриф гитары =====
import React, { useMemo } from 'react';
import type { FretNote, AppMode, NoteName, ScaleType, ChordType, GuitarTuning } from '../types';
import { generateFretboard, getFretMarkers, getDoubleFretMarkers, getIntervalDisplay } from '../lib/fretboard';
import { getScaleNotes } from '../lib/scales';
import { getNoteIndex } from '../lib/notes';

interface FretboardProps {
  tuning: GuitarTuning;
  fretCount: number;
  root?: NoteName;
  scaleType?: ScaleType;
  chordType?: ChordType;
  mode: AppMode;
  leftHanded: boolean;
  showOctaves: boolean;
  showIntervals: boolean;
  highlightPositions?: Array<{ string: number; fret: number }>;
  onNoteClick?: (fretNote: FretNote) => void;
  selectedNote?: { string: number; fret: number } | null;
  questionHighlight?: { string: number; fret: number } | null;
  lastResult?: { correct: boolean; message: string } | null;
  barreFret?: number; // лад барре для пунктирной линии
  selectedBox?: number; // выбранный бокс (0 = все, 1-5 = конкретный)
}

export const Fretboard: React.FC<FretboardProps> = ({
  tuning,
  fretCount,
  root,
  scaleType,
  chordType,
  mode,
  leftHanded,
  showOctaves,
  showIntervals,
  highlightPositions = [],
  onNoteClick,
  selectedNote = null,
  questionHighlight = null,
  lastResult = null,
  barreFret,
  selectedBox = 0
}) => {
  const fretboard = useMemo(() => {
    return generateFretboard({
      tuning,
      fretCount,
      root,
      scaleType,
      chordType
    });
  }, [tuning, fretCount, root, scaleType, chordType]);

  const fretMarkers = getFretMarkers(fretCount);
  const doubleMarkers = getDoubleFretMarkers(fretCount);
  
  const frets = leftHanded 
    ? Array.from({ length: fretCount + 1 }, (_, i) => fretCount - i)
    : Array.from({ length: fretCount + 1 }, (_, i) => i);

  const isHighlighted = (string: number, fret: number): boolean => {
    return highlightPositions.some(p => p.string === string && p.fret === fret);
  };

  const isSelected = (string: number, fret: number): boolean => {
    return selectedNote?.string === string && selectedNote?.fret === fret;
  };

  const isQuestionHighlight = (string: number, fret: number): boolean => {
    return questionHighlight?.string === string && questionHighlight?.fret === fret;
  };

  // В режиме гамм - стандартные позиции CAGED
  const getScaleBoxes = useMemo(() => {
    // Стандартные позиции с перекрытием (как на изображении)
    return [
      [0, 3],    // Позиция 1 (форма E)
      [2, 5],    // Позиция 2 (форма D)
      [5, 8],    // Позиция 3 (форма C)
      [7, 10],   // Позиция 4 (форма A)
      [10, 13]   // Позиция 5 (форма G)
    ];
  }, []);

  const getNoteColor = (fretNote: FretNote): string => {
    // В режиме гамм - выделение выбранного бокса (проверяем первым)
    if (mode === 'scale' && fretNote.isInScale && selectedBox > 0 && getScaleBoxes.length > 0) {
      const boxRange = getScaleBoxes[selectedBox - 1];
      const inBox = fretNote.fret >= boxRange[0] && fretNote.fret <= boxRange[1];
      
      if (!inBox) {
        // Ноты вне бокса - всегда приглушённые
        if (fretNote.isRoot) {
          return 'bg-red-900/40 text-red-300/60';
        }
        return 'bg-emerald-900/30 text-emerald-400/50';
      }
      
      // Ноты в боксе - яркие
      if (isSelected(fretNote.string, fretNote.fret)) {
        return 'bg-blue-500 text-white ring-2 ring-blue-300';
      }
      if (fretNote.isRoot) {
        return 'bg-red-500 text-white ring-2 ring-red-300';
      }
      return 'bg-emerald-600 text-white';
    }
    
    // В режимах тренировки
    if (mode === 'find_note' || mode === 'guess_note') {
      if (isSelected(fretNote.string, fretNote.fret)) {
        if (lastResult?.correct) {
          return 'bg-emerald-500 text-white ring-2 ring-emerald-300';
        }
        return 'bg-red-500 text-white ring-2 ring-red-300';
      }
      if (isQuestionHighlight(fretNote.string, fretNote.fret)) {
        return 'bg-yellow-400 text-black ring-2 ring-yellow-300 animate-pulse';
      }
      if (isHighlighted(fretNote.string, fretNote.fret)) {
        return 'bg-emerald-500 text-white';
      }
      return 'bg-zinc-700/30 hover:bg-zinc-600/50';
    }
    
    // В режиме аккордов с позициями
    if (mode === 'chord' && highlightPositions.length > 0) {
      if (isHighlighted(fretNote.string, fretNote.fret)) {
        if (fretNote.degree !== undefined) {
          const degreeColors: Record<number, string> = {
            1: 'bg-red-500 text-white ring-2 ring-red-300',
            2: 'bg-orange-500 text-white',
            3: 'bg-yellow-500 text-black',
            4: 'bg-green-500 text-white',
            5: 'bg-cyan-500 text-white',
            6: 'bg-blue-500 text-white',
            7: 'bg-purple-500 text-white'
          };
          return degreeColors[fretNote.degree] || 'bg-purple-500 text-white';
        }
        if (fretNote.isRoot) {
          return 'bg-red-500 text-white ring-2 ring-red-300';
        }
        return 'bg-purple-500 text-white';
      }
      return 'bg-zinc-700/30';
    }
    
    // Остальные режимы
    if (isSelected(fretNote.string, fretNote.fret)) {
      return 'bg-blue-500 text-white ring-2 ring-blue-300';
    }
    if (isQuestionHighlight(fretNote.string, fretNote.fret)) {
      return 'bg-yellow-400 text-black ring-2 ring-yellow-300 animate-pulse';
    }
    if (isHighlighted(fretNote.string, fretNote.fret)) {
      return 'bg-emerald-500 text-white';
    }
    
    // В режиме гамм - все боксы
    if (mode === 'scale' && fretNote.isInScale) {
      if (fretNote.isRoot) {
        return 'bg-red-500 text-white ring-2 ring-red-300';
      }
      return 'bg-emerald-600 text-white';
    }
    
    if (fretNote.isRoot) {
      return 'bg-red-500 text-white';
    }
    if (fretNote.isInScale || fretNote.isInChord) {
      return 'bg-emerald-600/80 text-white';
    }
    if (mode === 'explore') {
      return 'bg-zinc-600/60 text-zinc-300 hover:bg-zinc-500/80';
    }
    return 'bg-zinc-600/60 text-zinc-300';
  };

  const getNoteLabel = (fretNote: FretNote): string => {
    if (showIntervals && fretNote.interval !== undefined) {
      return getIntervalDisplay(fretNote.interval);
    }
    if (showOctaves) {
      return `${fretNote.note}${fretNote.octave}`;
    }
    return fretNote.note;
  };

  const shouldShowNote = (fretNote: FretNote): boolean => {
    if (mode === 'explore') {
      return true;
    }
    if (mode === 'scale') {
      return fretNote.isInScale || fretNote.fret === 0;
    }
    if (mode === 'chord') {
      if (highlightPositions.length > 0) {
        return isHighlighted(fretNote.string, fretNote.fret);
      }
      return fretNote.isInChord || fretNote.fret === 0;
    }
    return true;
  };

  // Проверить, приглушена ли струна в режиме аккорда
  const isMuted = (stringIndex: number): boolean => {
    if (mode !== 'chord' || highlightPositions.length === 0) return false;
    // Проверяем, есть ли хоть одна нота на этой струне в позиции
    return !highlightPositions.some(p => p.string === stringIndex);
  };

  // Показать текст ноты (только не в тренировках)
  const shouldShowLabel = (fretNote: FretNote): boolean => {
    return mode !== 'find_note' && mode !== 'guess_note';
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="relative min-w-[600px]">
        {/* Номера ладов */}
        <div className="flex mb-1 ml-10">
          {frets.map(fret => (
            <div
              key={`num-${fret}`}
              className="flex-shrink-0 w-12 h-6 flex items-center justify-center text-xs text-zinc-500 font-mono"
            >
              {fret > 0 ? fret : ''}
            </div>
          ))}
        </div>

        {/* Маркеры ладов (точки) */}
        <div className="flex mb-1 ml-10">
          {frets.map(fret => (
            <div
              key={`marker-${fret}`}
              className="flex-shrink-0 w-12 h-4 flex items-center justify-center"
            >
              {doubleMarkers.includes(fret) && (
                <div className="flex flex-col gap-1">
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                  <div className="w-2 h-2 rounded-full bg-zinc-600" />
                </div>
              )}
              {fretMarkers.includes(fret) && !doubleMarkers.includes(fret) && fret > 0 && (
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
              )}
            </div>
          ))}
        </div>

        {/* Гриф */}
        <div className="relative bg-gradient-to-b from-amber-900/30 to-amber-800/20 rounded-lg border border-zinc-700 w-max">
          {/* Лады (вертикальные линии) */}
          <div className="absolute inset-0 flex ml-10">
            {frets.map((fret, i) => (
              <div
                key={`fret-${fret}`}
                className="flex-shrink-0 w-12 relative"
              >
                {fret > 0 && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-zinc-400/60" />
                )}
              </div>
            ))}
            {/* Порожек между нулевым и первым ладом */}
            <div className="absolute left-[44px] top-0 bottom-0 w-1.5 bg-zinc-100 z-20" />
            {/* Пунктирная линия барре */}
            {barreFret !== undefined && barreFret > 0 && (
              <div 
                className="absolute top-0 bottom-0 w-0.5 border-l-2 border-dashed border-purple-400/60 z-10"
                style={{ left: `${44 + (barreFret - 1) * 48 + 26}px` }}
              />
            )}
          </div>

          {/* Струны и ноты */}
          {[...fretboard].reverse().map((stringNotes, reverseIndex) => {
            const stringIndex = 5 - reverseIndex; // Оригинальный индекс струны
            const muted = isMuted(stringIndex);
            return (
            <div key={`string-${stringIndex}`} className="flex items-center h-12 relative">
              {/* Название струны */}
              <div className="w-10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
                {muted ? (
                  <span className="text-red-400 text-base">×</span>
                ) : (
                  tuning.notes[stringIndex]
                )}
              </div>
              
              {/* Струна (толщина: басовые толще) */}
              <div className="absolute left-10 right-0 top-1/2 -translate-y-1/2 h-px bg-zinc-400/40" 
                   style={{ height: `${1 + stringIndex * 0.3}px` }} />

              {/* Ноты на струне */}
              <div className="flex ml-0 relative z-10">
                {stringNotes.map((fretNote) => (
                  <div
                    key={`note-${stringIndex}-${fretNote.fret}`}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                  >
                    {shouldShowNote(fretNote) && (
                      <button
                        onClick={() => onNoteClick?.(fretNote)}
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center
                          text-xs font-bold transition-all duration-150
                          active:scale-90 cursor-pointer
                          ${getNoteColor(fretNote)}
                        `}
                      >
                        {shouldShowLabel(fretNote) && getNoteLabel(fretNote)}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
};
