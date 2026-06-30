// ===== Музыкальная логика: ноты, интервалы, октавы =====
import type { NoteName, Interval, GuitarTuning } from '../types';

// Все 12 нот (хроматический ряд)
export const ALL_NOTES: NoteName[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Стандартный строй гитары (от 6-й к 1-й струне)
export const STANDARD_TUNING: GuitarTuning = {
  name: 'Standard',
  notes: ['E', 'A', 'D', 'G', 'B', 'E']
};

// Альтернативные строи
export const DROP_D_TUNING: GuitarTuning = {
  name: 'Drop D',
  notes: ['D', 'A', 'D', 'G', 'B', 'E']
};

export const HALF_STEP_DOWN_TUNING: GuitarTuning = {
  name: 'Half Step Down',
  notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#']
};

// Получить индекс ноты (0-11)
export function getNoteIndex(note: NoteName): number {
  return ALL_NOTES.indexOf(note);
}

// Получить ноту по индексу (с учётом модуля 12)
export function getNoteByIndex(index: number): NoteName {
  const normalizedIndex = ((index % 12) + 12) % 12;
  return ALL_NOTES[normalizedIndex];
}

// Получить ноту на грифе
export function getFretNote(
  openString: NoteName,
  fret: number,
  stringIndex: number,
  standardTuning: NoteName[]
): { note: NoteName; octave: number } {
  const openNoteIndex = getNoteIndex(openString);
  const noteIndex = (openNoteIndex + fret) % 12;
  const note = getNoteByIndex(noteIndex);
  
  // Базовая октава для открытых струн стандартного строя
  // 6-я струна (E) = 2-я октава, 5-я (A) = 2-я, 4-я (D) = 3-я
  // 3-я (G) = 3-я, 2-я (B) = 3-я, 1-я (E) = 4-я
  const baseOctaves = [2, 2, 3, 3, 3, 4];
  const baseOctave = baseOctaves[stringIndex] || 3;
  
  // Октава увеличивается при переходе через C
  const openIndex = getNoteIndex(openString);
  const noteIdx = getNoteIndex(note);
  let octave = baseOctave;
  
  // Если нота ниже открытой (прошли через C), увеличиваем октаву
  if (fret > 0) {
    const cIndex = getNoteIndex('C');
    // Проверяем, пересекли ли мы C
    const openToC = ((cIndex - openIndex) + 12) % 12;
    if (fret >= openToC && openToC > 0) {
      octave += 1;
    }
  }
  
  return { note, octave };
}

// Получить интервал между двумя нотами
export function getInterval(from: NoteName, to: NoteName): Interval {
  const fromIndex = getNoteIndex(from);
  const toIndex = getNoteIndex(to);
  return ((toIndex - fromIndex) + 12) % 12;
}

// Получить ноту с учётом интервала от корня
export function getNoteFromInterval(root: NoteName, interval: Interval): NoteName {
  const rootIndex = getNoteIndex(root);
  return getNoteByIndex(rootIndex + interval);
}

// Названия интервалов
export const INTERVAL_NAMES: Record<number, string> = {
  0: 'Root',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7'
};

// Названия ступеней гаммы
export const DEGREE_NAMES: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII'
};

// Получить все позиции ноты на грифе
export function getAllNotePositions(
  note: NoteName,
  tuning: NoteName[],
  fretCount: number
): Array<{ string: number; fret: number; octave: number }> {
  const positions: Array<{ string: number; fret: number; octave: number }> = [];
  
  for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
    const openString = tuning[stringIndex];
    for (let fret = 0; fret <= fretCount; fret++) {
      const { note: fretNote, octave } = getFretNote(openString, fret, stringIndex, tuning);
      if (fretNote === note) {
        positions.push({ string: stringIndex, fret, octave });
      }
    }
  }
  
  return positions;
}

// Проверить, является ли нота энгармонически эквивалентной
export function areNotesEquivalent(note1: NoteName, note2: NoteName): boolean {
  return getNoteIndex(note1) === getNoteIndex(note2);
}
