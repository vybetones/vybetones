// ===== Гаммы: определения и логика =====
import type { ScaleType, ScaleDefinition, NoteName, Interval } from '../types';
import { getNoteFromInterval } from './notes';

// Определения гамм (интервалы от корня)
export const SCALE_DEFINITIONS: Record<ScaleType, ScaleDefinition> = {
  major: {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11]
  },
  minor: {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10]
  },
  minor_pentatonic: {
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10]
  },
  major_pentatonic: {
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9]
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10]
  },
  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10]
  },
  mixolydian: {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10]
  },
  harmonic_minor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11]
  }
};

// Получить ноты гаммы
export function getScaleNotes(root: NoteName, scaleType: ScaleType): NoteName[] {
  const scale = SCALE_DEFINITIONS[scaleType];
  return scale.intervals.map(interval => getNoteFromInterval(root, interval));
}

// Получить интервалы гаммы
export function getScaleIntervals(scaleType: ScaleType): Interval[] {
  return SCALE_DEFINITIONS[scaleType].intervals;
}

// Получить название гаммы
export function getScaleName(scaleType: ScaleType): string {
  return SCALE_DEFINITIONS[scaleType].name;
}

// Получить ступень ноты в гамме
export function getNoteDegreeInScale(
  note: NoteName, 
  root: NoteName, 
  scaleType: ScaleType
): number | null {
  const scaleNotes = getScaleNotes(root, scaleType);
  const noteIndex = scaleNotes.indexOf(note);
  return noteIndex >= 0 ? noteIndex + 1 : null;
}

// Проверить, входит ли нота в гамму
export function isNoteInScale(
  note: NoteName, 
  root: NoteName, 
  scaleType: ScaleType
): boolean {
  const scaleNotes = getScaleNotes(root, scaleType);
  return scaleNotes.includes(note);
}

// Список всех доступных типов гамм
export function getAllScaleTypes(): ScaleType[] {
  return Object.keys(SCALE_DEFINITIONS) as ScaleType[];
}

// Получить информацию о гамме для отображения
export function getScaleInfo(scaleType: ScaleType): {
  name: string;
  intervals: Interval[];
  intervalNames: string[];
} {
  const scale = SCALE_DEFINITIONS[scaleType];
  const intervalNames = scale.intervals.map(i => {
    const names: Record<number, string> = {
      0: 'Root', 1: 'b2', 2: '2', 3: 'b3', 4: '3',
      5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
    };
    return names[i] || String(i);
  });
  
  return {
    name: scale.name,
    intervals: scale.intervals,
    intervalNames
  };
}
