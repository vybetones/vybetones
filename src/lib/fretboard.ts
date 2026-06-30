// ===== Генерация грифа гитары =====
import type { FretNote, NoteName, GuitarTuning, ScaleType, ChordType } from '../types';
import { getFretNote, getInterval, getNoteIndex } from './notes';
import { isNoteInScale, getNoteDegreeInScale, getScaleNotes } from './scales';
import { isNoteInChord, getChordNotes } from './chords';

export interface FretboardConfig {
  tuning: GuitarTuning;
  fretCount: number;
  root?: NoteName;
  scaleType?: ScaleType;
  chordType?: ChordType;
  showAllNotes?: boolean;
}

// Сгенерировать все ноты на грифе
export function generateFretboard(config: FretboardConfig): FretNote[][] {
  const { tuning, fretCount, root, scaleType, chordType } = config;
  const fretboard: FretNote[][] = [];
  
  const scaleNotes = root && scaleType ? getScaleNotes(root, scaleType) : [];
  const chordNotes = root && chordType ? getChordNotes(root, chordType) : [];
  
  for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
    const stringNotes: FretNote[] = [];
    const openString = tuning.notes[stringIndex];
    
    for (let fret = 0; fret <= fretCount; fret++) {
      const { note, octave } = getFretNote(openString, fret, stringIndex, tuning.notes);
      
      const fretNote: FretNote = {
        string: stringIndex,
        fret,
        note,
        octave
      };
      
      // Если выбрана тональность и гамма
      if (root && scaleType) {
        fretNote.interval = getInterval(root, note);
        fretNote.isInScale = isNoteInScale(note, root, scaleType);
        fretNote.isRoot = note === root;
        
        const degree = getNoteDegreeInScale(note, root, scaleType);
        if (degree !== null) {
          fretNote.degree = degree;
        }
      }
      
      // Если выбран аккорд
      if (root && chordType) {
        fretNote.isInChord = isNoteInChord(note, root, chordType);
        fretNote.isRoot = note === root;
        if (root && note === root) {
          fretNote.interval = 0;
          fretNote.degree = 1; // Тоника = ступень 1
        } else if (root) {
          fretNote.interval = getInterval(root, note);
          // Маппинг интервалов на ступени для аккордов
          const intervalToDegree: Record<number, number> = {
            2: 2,   // 2 (sus2)
            3: 3,   // b3 (minor)
            4: 3,   // 3 (major)
            5: 4,   // 4 (sus4)
            7: 5,   // 5
            8: 5,   // #5 (aug)
            6: 5,   // b5 (dim)
            10: 7,  // b7 (dom7, m7)
            11: 7   // 7 (maj7)
          };
          if (fretNote.interval !== undefined && intervalToDegree[fretNote.interval] !== undefined) {
            fretNote.degree = intervalToDegree[fretNote.interval];
          }
        }
      }
      
      stringNotes.push(fretNote);
    }
    
    fretboard.push(stringNotes);
  }
  
  return fretboard;
}

// Получить маркеры ладов (точки на грифе)
export function getFretMarkers(fretCount: number): number[] {
  const markers = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
  return markers.filter(m => m <= fretCount);
}

// Получить двойные маркеры (12, 24 лады)
export function getDoubleFretMarkers(fretCount: number): number[] {
  const doubleMarkers = [12, 24];
  return doubleMarkers.filter(m => m <= fretCount);
}

// Получить частоту ноты (для звука)
export function getNoteFrequency(note: NoteName, octave: number): number {
  const noteIndex = getNoteIndex(note);
  const a4 = 440;
  const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9); // A4 = 9 в массиве
  return a4 * Math.pow(2, semitonesFromA4 / 12);
}

// Получить название ноты для отображения
export function getNoteDisplayName(note: NoteName, showOctave: boolean, octave: number): string {
  return showOctave ? `${note}${octave}` : note;
}

// Получить интервал для отображения
export function getIntervalDisplay(interval: number | undefined): string {
  if (interval === undefined) return '';
  const names: Record<number, string> = {
    0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3',
    5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
  };
  return names[interval] || String(interval);
}
