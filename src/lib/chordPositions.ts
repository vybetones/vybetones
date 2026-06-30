// ===== Генерация позиций аккордов по системе CAGED =====
import type { ChordType, NoteName, GuitarTuning } from '../types';
import { getNoteIndex, getNoteByIndex, ALL_NOTES } from './notes';

export interface ChordPosition {
  frets: (number | null)[]; // null = не играть (приглушена), 0 = открытая струна
  baseFret: number; // начальный лад (для барре)
  name: string; // название позиции (C, A, G, E, D форма)
  fingerCount: number; // количество используемых пальцев
  barreFret?: number; // лад барре (если есть)
}

// Формы CAGED для major аккордов
// [6-я струна, 5-я, 4-я, 3-я, 2-я, 1-я]
// null = не играть
const MAJOR_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 2, 0, 1, 0], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 2, 2, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 2, 0, 0, 0, 3], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 2, 1, 0, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 3, 2], rootString: 2, rootFret: 0 },
};

// Формы CAGED для minor аккордов
const MINOR_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 5, 5, 4, 3], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 2, 1, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 5, 5, 3, 3, 3], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 2, 0, 0, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 3, 1], rootString: 2, rootFret: 0 },
};

// Формы CAGED для dominant 7 аккордов
const DOM7_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 2, 3, 1, 0], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 0, 2, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 2, 0, 0, 0, 1], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 0, 1, 0, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 1, 2], rootString: 2, rootFret: 0 },
};

// Формы CAGED для maj7 аккордов
const MAJ7_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 2, 0, 0, 0], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 1, 2, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 2, 0, 0, 0, 2], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 1, 1, 0, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 2, 2], rootString: 2, rootFret: 0 },
};

// Формы CAGED для m7 аккордов
const M7_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 5, 3, 4, 3], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 0, 1, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 5, 3, 3, 3, 3], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 0, 0, 0, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 1, 1], rootString: 2, rootFret: 0 },
};

// Формы CAGED для sus2 аккордов
const SUS2_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 5, 5, 3, 3], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 2, 0, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 5, 5, 5, 3, 3], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 4, 4, 2, 2], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 3, 0], rootString: 2, rootFret: 0 },
};

// Формы CAGED для sus4 аккордов
const SUS4_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 3, 0, 1, 1], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 2, 2, 3, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 3, 0, 0, 1, 3], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 2, 2, 2, 0, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 2, 3, 3], rootString: 2, rootFret: 0 },
};

// Формы CAGED для diminished аккордов
const DIM_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 4, 2, 4, 2], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 1, 2, 1, 0], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 4, 2, 4, 2, 3], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 1, 2, 0, 2, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 1, 2, 1], rootString: 2, rootFret: 0 },
};

// Формы CAGED для augmented аккордов
const AUG_FORMS: Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> = {
  'C': { frets: [null, 3, 2, 1, 1, 1], rootString: 1, rootFret: 3 },
  'A': { frets: [null, 0, 3, 2, 2, 1], rootString: 1, rootFret: 0 },
  'G': { frets: [3, 2, 1, 1, 1, 4], rootString: 0, rootFret: 3 },
  'E': { frets: [0, 3, 2, 1, 1, 0], rootString: 0, rootFret: 0 },
  'D': { frets: [null, null, 0, 3, 2, 1], rootString: 2, rootFret: 0 },
};

// Получить формы для типа аккорда
function getForms(chordType: ChordType): Record<string, { frets: (number | null)[]; rootString: number; rootFret: number }> {
  switch (chordType) {
    case 'major': return MAJOR_FORMS;
    case 'minor': return MINOR_FORMS;
    case 'dom7': return DOM7_FORMS;
    case 'maj7': return MAJ7_FORMS;
    case 'm7': return M7_FORMS;
    case 'sus2': return SUS2_FORMS;
    case 'sus4': return SUS4_FORMS;
    case 'dim': return DIM_FORMS;
    case 'aug': return AUG_FORMS;
    default: return MAJOR_FORMS;
  }
}

// Получить название формы
function getFormName(formKey: string, chordType: ChordType): string {
  const typeNames: Record<ChordType, string> = {
    major: 'мажор',
    minor: 'минор',
    dom7: '7',
    maj7: 'maj7',
    m7: 'm7',
    sus2: 'sus2',
    sus4: 'sus4',
    dim: 'dim',
    aug: 'aug'
  };
  return `${formKey} (${typeNames[chordType]})`;
}

// Подсчитать количество уникальных пальцев
function countUniqueFingers(frets: (number | null)[]): number {
  const playedFrets = frets.filter((f): f is number => f !== null && f > 0);
  if (playedFrets.length === 0) return 0;
  
  const minFret = Math.min(...playedFrets);
  const fingers: number[] = [];
  
  frets.forEach(fret => {
    if (fret === null || fret === 0) return;
    const relativeFret = fret - minFret;
    let finger: number;
    if (relativeFret === 0) finger = 1;
    else if (relativeFret === 1) finger = 2;
    else if (relativeFret === 2) finger = 3;
    else finger = 4;
    
    if (fingers.indexOf(finger) === -1) {
      fingers.push(finger);
    }
  });
  
  return fingers.length;
}

// Сдвинуть форму на нужный лад
function shiftForm(
  form: { frets: (number | null)[]; rootString: number; rootFret: number },
  shift: number,
  tuning: GuitarTuning,
  fretCount: number
): (number | null)[] {
  const result: (number | null)[] = [];
  
  for (let i = 0; i < 6; i++) {
    const fret = form.frets[i];
    if (fret === null) {
      result.push(null);
    } else {
      const newFret = fret + shift;
      // Проверяем что нота в пределах грифа
      if (newFret > fretCount) {
        result.push(null);
      } else {
        result.push(newFret);
      }
    }
  }
  
  return result;
}

// Найти все позиции аккорда на грифе
export function findChordPositions(
  root: NoteName,
  chordType: ChordType,
  tuning: GuitarTuning,
  fretCount: number
): ChordPosition[] {
  const forms = getForms(chordType);
  const positions: ChordPosition[] = [];
  
  const rootIndex = getNoteIndex(root);
  
  // Для каждой формы CAGED
  const formKeys = Object.keys(forms);
  for (const formKey of formKeys) {
    const form = forms[formKey];
    
    // Вычисляем корень формы в нотах
    const openString = tuning.notes[form.rootString];
    const openStringIndex = getNoteIndex(openString);
    const formRootIndex = (openStringIndex + form.rootFret) % 12;
    
    // Вычисляем сдвиг для получения нужного корня
    const shift = ((rootIndex - formRootIndex) + 12) % 12;
    
    // Сдвигаем форму
    const frets = shiftForm(form, shift, tuning, fretCount);
    
    // Проверяем что позиция валидна
    const playedNotes = frets.filter((f): f is number => f !== null);
    if (playedNotes.length < 3) continue;
    
    // Проверяем размах
    const fretSpread = Math.max(...playedNotes) - Math.min(...playedNotes);
    if (fretSpread > 4) continue;
    
    // Проверяем что есть хотя бы одна нота на нижних 3 струнах (1-3)
    const hasTrebleNotes = frets.slice(3).some((f): f is number => f !== null);
    if (!hasTrebleNotes) continue;
    
    // Подсчитываем пальцы
    const fingerCount = countUniqueFingers(frets);
    if (fingerCount > 4) continue;
    
    const baseFret = Math.min(...playedNotes);
    
    // Проверяем есть ли барре (на минимальном ладу 2+ струны)
    const stringsOnBaseFret = frets.filter(f => f === baseFret).length;
    const barreFret = stringsOnBaseFret >= 2 ? baseFret : undefined;
    
    positions.push({
      frets,
      baseFret,
      name: shift === 0 && form.rootFret === 0 ? 'Открытая' : getFormName(formKey, chordType),
      fingerCount,
      barreFret: barreFret ? Number(barreFret) : undefined
    });
  }
  
  // Удаляем дубликаты позиций
  const uniquePositions: ChordPosition[] = [];
  const seenFrets: string[] = [];
  
  for (const pos of positions) {
    const fretsKey = pos.frets.map(f => f === null ? 'x' : String(f)).join(',');
    if (seenFrets.indexOf(fretsKey) === -1) {
      seenFrets.push(fretsKey);
      uniquePositions.push(pos);
    }
  }
  
  return uniquePositions;
}

// Получить табулатуру для отображения
export function getTabDisplay(position: ChordPosition): string {
  // От 1-й струны (тонкой) к 6-й (басовой) - как в обычных табах
  return position.frets
    .slice()
    .reverse()
    .map(fret => {
      if (fret === null) return '×';
      if (fret === 0) return '○';
      return String(fret);
    })
    .join(' ');
}
