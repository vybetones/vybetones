// ===== Аккорды: определения и логика =====
import type { ChordType, ChordDefinition, NoteName, Interval } from '../types';
import { getNoteFromInterval } from './notes';

// Определения аккордов (интервалы от корня)
export const CHORD_DEFINITIONS: Record<ChordType, ChordDefinition> = {
  major: {
    name: 'Major',
    symbol: '',
    intervals: [0, 4, 7]
  },
  minor: {
    name: 'Minor',
    symbol: 'm',
    intervals: [0, 3, 7]
  },
  dom7: {
    name: 'Dominant 7',
    symbol: '7',
    intervals: [0, 4, 7, 10]
  },
  maj7: {
    name: 'Major 7',
    symbol: 'maj7',
    intervals: [0, 4, 7, 11]
  },
  m7: {
    name: 'Minor 7',
    symbol: 'm7',
    intervals: [0, 3, 7, 10]
  },
  sus2: {
    name: 'Suspended 2',
    symbol: 'sus2',
    intervals: [0, 2, 7]
  },
  sus4: {
    name: 'Suspended 4',
    symbol: 'sus4',
    intervals: [0, 5, 7]
  },
  dim: {
    name: 'Diminished',
    symbol: 'dim',
    intervals: [0, 3, 6]
  },
  aug: {
    name: 'Augmented',
    symbol: 'aug',
    intervals: [0, 4, 8]
  }
};

// Получить ноты аккорда
export function getChordNotes(root: NoteName, chordType: ChordType): NoteName[] {
  const chord = CHORD_DEFINITIONS[chordType];
  return chord.intervals.map(interval => getNoteFromInterval(root, interval));
}

// Получить интервалы аккорда
export function getChordIntervals(chordType: ChordType): Interval[] {
  return CHORD_DEFINITIONS[chordType].intervals;
}

// Получить название аккорда
export function getChordFullName(root: NoteName, chordType: ChordType): string {
  const chord = CHORD_DEFINITIONS[chordType];
  return `${root}${chord.symbol}`;
}

// Проверить, входит ли нота в аккорд
export function isNoteInChord(
  note: NoteName,
  root: NoteName,
  chordType: ChordType
): boolean {
  const chordNotes = getChordNotes(root, chordType);
  return chordNotes.includes(note);
}

// Получить роль ноты в аккорде
export function getNoteRoleInChord(
  note: NoteName,
  root: NoteName,
  chordType: ChordType
): string | null {
  const chord = CHORD_DEFINITIONS[chordType];
  const interval = ((note.charCodeAt(0) - root.charCodeAt(0) + 12) % 12);
  
  // Правильный расчёт интервала
  const noteIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(note);
  const rootIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(root);
  const actualInterval = ((noteIndex - rootIndex) + 12) % 12;
  
  const intervalIndex = chord.intervals.indexOf(actualInterval);
  if (intervalIndex === -1) return null;
  
  const roleNames = ['Root', 'b3', '3', '4', '5', 'b7', '7'];
  const roleMap: Record<number, string> = {
    0: 'Root',
    1: chordType === 'minor' || chordType === 'm7' || chordType === 'dim' ? 'b3' : '3',
    2: '5',
    3: chordType === 'dom7' || chordType === 'm7' ? 'b7' : '7'
  };
  
  return roleMap[intervalIndex] || `Int(${actualInterval})`;
}

// Список всех доступных типов аккордов
export function getAllChordTypes(): ChordType[] {
  return Object.keys(CHORD_DEFINITIONS) as ChordType[];
}

// Получить информацию об аккорде для отображения
export function getChordInfo(chordType: ChordType): {
  name: string;
  symbol: string;
  intervals: Interval[];
} {
  const chord = CHORD_DEFINITIONS[chordType];
  return {
    name: chord.name,
    symbol: chord.symbol,
    intervals: chord.intervals
  };
}
