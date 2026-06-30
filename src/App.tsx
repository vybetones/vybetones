import { useState, useEffect, useMemo } from 'react';
import { Fretboard } from './components/Fretboard';
import { ModeSelector } from './components/ModeSelector';
import { NoteSelector } from './components/NoteSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { ChordSelector } from './components/ChordSelector';
import { ChordPositionSelector } from './components/ChordPositionSelector';
import { BoxSelector } from './components/BoxSelector';
import { FindNoteMode } from './components/FindNoteMode';
import { GuessNoteMode } from './components/GuessNoteMode';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { useGameState } from './hooks/useGameState';
import { useAudio } from './hooks/useAudio';
import { getNoteFrequency } from './lib/fretboard';
import { findChordPositions, getTabDisplay } from './lib/chordPositions';
import type { FretNote, NoteName } from './types';

function App() {
  const {
    settings,
    stats,
    mode,
    selectedRoot,
    selectedScale,
    selectedChord,
    currentQuestion,
    lastResult,
    setSelectedRoot,
    setSelectedScale,
    setSelectedChord,
    changeMode,
    updateSettings,
    generateQuestion,
    checkAnswer,
    resetStats
  } = useGameState();

  const { playCorrect, playWrong, playNote } = useAudio();
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ string: number; fret: number } | null>(null);
  const [noteInfo, setNoteInfo] = useState<string | null>(null);
  const [selectedChordPosition, setSelectedChordPosition] = useState(0);
  const [selectedBox, setSelectedBox] = useState(0); // 0 = все боксы, 1-5 = конкретный бокс

  // Вычисляем позиции аккорда
  const chordPositions = useMemo(() => {
    if (mode === 'chord') {
      return findChordPositions(selectedRoot, selectedChord, settings.tuning, settings.fretCount);
    }
    return [];
  }, [mode, selectedRoot, selectedChord, settings.tuning, settings.fretCount]);

  // Сбрасываем позицию при смене аккорда или тональности
  useEffect(() => {
    setSelectedChordPosition(0);
  }, [selectedRoot, selectedChord]);

  // Генерация вопроса при смене режима
  useEffect(() => {
    if (mode === 'find_note' || mode === 'guess_note') {
      setSelectedNote(null);
      generateQuestion();
    }
  }, [mode]);

  // Обработка клика по ноте
  const handleNoteClick = (fretNote: FretNote) => {
    if (mode === 'explore' || mode === 'scale' || mode === 'chord') {
      setSelectedNote({ string: fretNote.string, fret: fretNote.fret });
      setNoteInfo(`${fretNote.note}${settings.showOctaves ? fretNote.octave : ''} — Струна ${6 - fretNote.string}, Лад ${fretNote.fret}`);
      if (settings.soundEnabled) {
        playNote(getNoteFrequency(fretNote.note, fretNote.octave));
      }
    } else if (mode === 'find_note') {
      setSelectedNote({ string: fretNote.string, fret: fretNote.fret });
      const correct = checkAnswer([{ string: fretNote.string, fret: fretNote.fret }]);
      if (settings.soundEnabled) {
        correct ? playCorrect() : playWrong();
      }
    }
  };

  // Обработка ответа в режиме "Угадай ноту"
  const handleGuessAnswer = (note: NoteName) => {
    const correct = checkAnswer(note);
    if (settings.soundEnabled) {
      correct ? playCorrect() : playWrong();
    }
  };

  // Показывать селекторы только в режимах исследования
  const showSelectors = mode === 'explore' || mode === 'scale' || mode === 'chord';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 p-3 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Fretboard Trainer
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(true)}
              className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-all"
              title="Статистика"
            >
              📊
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-all"
              title="Настройки"
            >
              ⚙️
            </button>
          </div>
        </div>
        <ModeSelector mode={mode} onChange={changeMode} />
      </header>

      {/* Main content */}
      <main className="flex-1 p-3 space-y-4 pb-24">
        {/* Селекторы для режимов исследования */}
        {showSelectors && (
          <div className="space-y-3">
            <NoteSelector selected={selectedRoot} onChange={setSelectedRoot} label="Тональность" />
            {mode === 'scale' && (
              <>
                <ScaleSelector selected={selectedScale} onChange={setSelectedScale} />
                <BoxSelector
                  selectedBox={selectedBox}
                  onChange={setSelectedBox}
                  totalBoxes={5}
                />
              </>
            )}
            {mode === 'chord' && (
              <>
                <ChordSelector selected={selectedChord} onChange={setSelectedChord} />
                {chordPositions.length > 0 && (
                  <ChordPositionSelector
                    positions={chordPositions}
                    selectedIndex={selectedChordPosition}
                    onChange={setSelectedChordPosition}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Режим тренировки */}
        {mode === 'find_note' && currentQuestion && (
          <FindNoteMode
            targetNote={currentQuestion.targetNote || null}
            onNoteClick={handleNoteClick}
            lastResult={lastResult}
            onNextQuestion={generateQuestion}
            streak={stats.currentStreak}
            score={stats.correctAnswers}
            onResetSelection={() => setSelectedNote(null)}
          />
        )}

        {mode === 'guess_note' && currentQuestion && (
          <GuessNoteMode
            targetString={currentQuestion.targetString ?? null}
            targetFret={currentQuestion.targetFret ?? null}
            lastResult={lastResult}
            onAnswer={handleGuessAnswer}
            onNextQuestion={generateQuestion}
            streak={stats.currentStreak}
            score={stats.correctAnswers}
            tuningNotes={settings.tuning.notes}
            onResetSelection={() => setSelectedNote(null)}
          />
        )}

        {/* Информация о выбранной ноте */}
        {noteInfo && (mode === 'explore' || mode === 'scale' || mode === 'chord') && (
          <div className="bg-zinc-800/50 rounded-lg p-3 text-center text-sm text-zinc-300">
            {noteInfo}
          </div>
        )}

        {/* Информация о позиции аккорда */}
        {mode === 'chord' && chordPositions[selectedChordPosition] && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
            <div className="text-sm text-purple-300 font-medium">
              Позиция {selectedChordPosition + 1} из {chordPositions.length}
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-mono">
              {getTabDisplay(chordPositions[selectedChordPosition])}
            </div>
          </div>
        )}

        {/* Гриф */}
        <Fretboard
          tuning={settings.tuning}
          fretCount={settings.fretCount}
          root={showSelectors ? selectedRoot : undefined}
          scaleType={mode === 'scale' ? selectedScale : undefined}
          chordType={mode === 'chord' ? selectedChord : undefined}
          mode={mode}
          leftHanded={settings.leftHanded}
          showOctaves={settings.showOctaves}
          showIntervals={settings.showIntervals}
          onNoteClick={handleNoteClick}
          selectedNote={selectedNote}
          lastResult={lastResult}
          barreFret={
            mode === 'chord' && chordPositions[selectedChordPosition]?.barreFret
              ? chordPositions[selectedChordPosition].barreFret
              : undefined
          }
          selectedBox={selectedBox}
          highlightPositions={
            mode === 'find_note' && currentQuestion?.correctPositions && lastResult
              ? currentQuestion.correctPositions
              : mode === 'chord' && chordPositions[selectedChordPosition]
              ? chordPositions[selectedChordPosition].frets
                  .map((fret, stringIndex) => fret !== null ? { string: stringIndex, fret } : null)
                  .filter((p): p is { string: number; fret: number } => p !== null)
              : undefined
          }
          questionHighlight={
            mode === 'guess_note' && currentQuestion?.targetString !== undefined && currentQuestion?.targetFret !== undefined
              ? { string: currentQuestion.targetString, fret: currentQuestion.targetFret }
              : undefined
          }
        />
      </main>

      {/* Модальные окна */}
      {showStats && (
        <Stats stats={stats} onReset={resetStats} onClose={() => setShowStats(false)} />
      )}
      {showSettings && (
        <Settings settings={settings} onUpdate={updateSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;
