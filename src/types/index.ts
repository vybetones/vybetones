// ===== Основные типы для музыкальной теории =====

export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NoteNameFlat = 'C' | 'Db' | 'D' | 'Eb' | 'E' | 'F' | 'Gb' | 'G' | 'Ab' | 'A' | 'Bb' | 'B';

export type Interval = number; // полутоны от корня

export type ScaleType = 
  | 'major' 
  | 'minor' 
  | 'minor_pentatonic' 
  | 'major_pentatonic'
  | 'blues'
  | 'dorian'
  | 'mixolydian'
  | 'harmonic_minor';

export type ChordType = 
  | 'major' 
  | 'minor' 
  | 'dom7' 
  | 'maj7' 
  | 'm7' 
  | 'sus2' 
  | 'sus4'
  | 'dim'
  | 'aug';

export type AppMode = 
  | 'explore'      // свободное исследование
  | 'find_note'    // найди ноту
  | 'guess_note'   // угадай ноту
  | 'scale'        // изучение гамм
  | 'chord';       // изучение аккордов

export interface FretNote {
  string: number;      // 0-5 (6-я струна = 0)
  fret: number;        // 0-24
  note: NoteName;
  octave: number;
  interval?: Interval; // относительно выбранной тональности
  degree?: number;     // ступень гаммы (1-7)
  isInScale?: boolean;
  isInChord?: boolean;
  isRoot?: boolean;
}

export interface GuitarTuning {
  name: string;
  notes: NoteName[]; // от 6-й к 1-й струне
}

export interface TrainingQuestion {
  type: 'find_note' | 'guess_note';
  targetNote?: NoteName;
  targetFret?: number;
  targetString?: number;
  targetOctave?: number;
  correctPositions?: Array<{ string: number; fret: number }>;
  correctAnswer?: NoteName;
}

export interface TrainingResult {
  question: TrainingQuestion;
  userAnswer: string | Array<{ string: number; fret: number }>;
  correct: boolean;
  timestamp: number;
}

export interface TrainingStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
  bestStreak: number;
  byMode: Record<AppMode, { correct: number; total: number }>;
  recentErrors: TrainingResult[];
  history: TrainingResult[];
}

export interface AppSettings {
  tuning: GuitarTuning;
  fretCount: number;
  leftHanded: boolean;
  showOctaves: boolean;
  showIntervals: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
  timerEnabled: boolean;
  timerSeconds: number;
}

export interface ScaleDefinition {
  name: string;
  intervals: Interval[];
}

export interface ChordDefinition {
  name: string;
  symbol: string;
  intervals: Interval[];
}
