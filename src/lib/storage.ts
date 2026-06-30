// ===== Локальное хранилище =====
import type { AppSettings, TrainingStats, TrainingResult, AppMode, GuitarTuning } from '../types';
import { STANDARD_TUNING } from './notes';

const SETTINGS_KEY = 'guitar_trainer_settings';
const STATS_KEY = 'guitar_trainer_stats';

// Настройки по умолчанию
export const DEFAULT_SETTINGS: AppSettings = {
  tuning: STANDARD_TUNING,
  fretCount: 15,
  leftHanded: false,
  showOctaves: false,
  showIntervals: false,
  darkMode: true,
  soundEnabled: true,
  timerEnabled: false,
  timerSeconds: 30
};

// Статистика по умолчанию
export const DEFAULT_STATS: TrainingStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  byMode: {
    explore: { correct: 0, total: 0 },
    find_note: { correct: 0, total: 0 },
    guess_note: { correct: 0, total: 0 },
    scale: { correct: 0, total: 0 },
    chord: { correct: 0, total: 0 }
  },
  recentErrors: [],
  history: []
};

// Сохранить настройки
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// Загрузить настройки
export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

// Сохранить статистику
export function saveStats(stats: TrainingStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

// Загрузить статистику
export function loadStats(): TrainingStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return DEFAULT_STATS;
}

// Обновить статистику после ответа
export function updateStats(
  stats: TrainingStats,
  mode: AppMode,
  result: TrainingResult
): TrainingStats {
  const newStats = { ...stats };
  
  newStats.totalQuestions++;
  
  if (result.correct) {
    newStats.correctAnswers++;
    newStats.currentStreak++;
    if (newStats.currentStreak > newStats.bestStreak) {
      newStats.bestStreak = newStats.currentStreak;
    }
    newStats.byMode[mode].correct++;
  } else {
    newStats.wrongAnswers++;
    newStats.currentStreak = 0;
    newStats.recentErrors = [result, ...newStats.recentErrors].slice(0, 10);
  }
  
  newStats.byMode[mode].total++;
  newStats.history = [result, ...newStats.history].slice(0, 100);
  
  return newStats;
}

// Сбросить статистику
export function resetStats(): TrainingStats {
  const newStats = DEFAULT_STATS;
  saveStats(newStats);
  return newStats;
}

// Получить процент точности
export function getAccuracy(stats: TrainingStats): number {
  if (stats.totalQuestions === 0) return 0;
  return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
}

// Получить точность по режиму
export function getModeAccuracy(stats: TrainingStats, mode: AppMode): number {
  const modeStats = stats.byMode[mode];
  if (modeStats.total === 0) return 0;
  return Math.round((modeStats.correct / modeStats.total) * 100);
}
