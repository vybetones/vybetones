// ===== Хук для управления состоянием игры =====
import { useState, useCallback, useEffect } from 'react';
import type { AppMode, NoteName, ScaleType, ChordType, TrainingQuestion, TrainingResult, TrainingStats, AppSettings } from '../types';
import { ALL_NOTES, STANDARD_TUNING, getAllNotePositions } from '../lib/notes';
import { loadSettings, saveSettings, loadStats, saveStats, updateStats, resetStats as resetStatsLib } from '../lib/storage';

export function useGameState() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [stats, setStats] = useState<TrainingStats>(loadStats);
  const [mode, setMode] = useState<AppMode>('explore');
  const [selectedRoot, setSelectedRoot] = useState<NoteName>('C');
  const [selectedScale, setSelectedScale] = useState<ScaleType>('major');
  const [selectedChord, setSelectedChord] = useState<ChordType>('major');
  const [currentQuestion, setCurrentQuestion] = useState<TrainingQuestion | null>(null);
  const [lastResult, setLastResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [timer, setTimer] = useState<number | null>(null);

  // Сохранение настроек при изменении
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Сохранение статистики при изменении
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Генерация вопроса для режима "Найди ноту"
  const generateFindNoteQuestion = useCallback(() => {
    const randomNote = ALL_NOTES[Math.floor(Math.random() * ALL_NOTES.length)];
    const positions = getAllNotePositions(randomNote, settings.tuning.notes, settings.fretCount);
    
    // Сохраняем ВСЕ позиции этой ноты на грифе как правильные ответы
    const question: TrainingQuestion = {
      type: 'find_note',
      targetNote: randomNote,
      correctPositions: positions.map(p => ({ string: p.string, fret: p.fret }))
    };
    
    setCurrentQuestion(question);
    setLastResult(null);
  }, [settings.tuning, settings.fretCount]);

  // Генерация вопроса для режима "Угадай ноту"
  const generateGuessNoteQuestion = useCallback(() => {
    const stringIndex = Math.floor(Math.random() * 6);
    const fret = Math.floor(Math.random() * (settings.fretCount + 1));
    const openString = settings.tuning.notes[stringIndex];
    
    // Вычисляем ноту на этом ладу
    const noteIndex = ALL_NOTES.indexOf(openString);
    const targetNoteIndex = (noteIndex + fret) % 12;
    const targetNote = ALL_NOTES[targetNoteIndex];
    
    const question: TrainingQuestion = {
      type: 'guess_note',
      targetString: stringIndex,
      targetFret: fret,
      correctAnswer: targetNote
    };
    
    setCurrentQuestion(question);
    setLastResult(null);
  }, [settings.tuning, settings.fretCount]);

  // Генерация вопроса в зависимости от режима
  const generateQuestion = useCallback(() => {
    if (mode === 'find_note') {
      generateFindNoteQuestion();
    } else if (mode === 'guess_note') {
      generateGuessNoteQuestion();
    }
  }, [mode, generateFindNoteQuestion, generateGuessNoteQuestion]);

  // Проверка ответа
  const checkAnswer = useCallback((answer: string | Array<{ string: number; fret: number }>) => {
    if (!currentQuestion) return false;

    let correct = false;

    if (currentQuestion.type === 'find_note' && Array.isArray(answer)) {
      // Проверяем, совпадает ли ответ с любой из правильных позиций
      correct = answer.some(ansPos => 
        currentQuestion.correctPositions!.some(correctPos => 
          ansPos.string === correctPos.string && ansPos.fret === correctPos.fret
        )
      );
    } else if (currentQuestion.type === 'guess_note' && typeof answer === 'string') {
      correct = answer === currentQuestion.correctAnswer;
    }

    const result: TrainingResult = {
      question: currentQuestion,
      userAnswer: answer,
      correct,
      timestamp: Date.now()
    };

    setStats(prev => updateStats(prev, mode, result));
    setLastResult({
      correct,
      message: correct ? 'Правильно! ✓' : `Неправильно. Ответ: ${currentQuestion.correctAnswer || 'см. гриф'}`
    });

    return correct;
  }, [currentQuestion, mode]);

  // Смена режима
  const changeMode = useCallback((newMode: AppMode) => {
    setMode(newMode);
    setCurrentQuestion(null);
    setLastResult(null);
  }, []);

  // Обновление настроек
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Сброс статистики
  const resetStats = useCallback(() => {
    const newStats = resetStatsLib();
    setStats(newStats);
  }, []);

  return {
    settings,
    stats,
    mode,
    selectedRoot,
    selectedScale,
    selectedChord,
    currentQuestion,
    lastResult,
    timer,
    setTimer,
    setSelectedRoot,
    setSelectedScale,
    setSelectedChord,
    changeMode,
    updateSettings,
    generateQuestion,
    checkAnswer,
    resetStats
  };
}
