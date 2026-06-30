// ===== Хук для воспроизведения звуков =====
import { useCallback, useRef } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number = 0.3, type: OscillatorType = 'sine') => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio playback failed:', e);
    }
  }, [getAudioContext]);

  const playCorrect = useCallback(() => {
    playTone(523.25, 0.15, 'sine'); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine'), 100); // E5
  }, [playTone]);

  const playWrong = useCallback(() => {
    playTone(200, 0.3, 'sawtooth');
  }, [playTone]);

  const playNote = useCallback((frequency: number) => {
    playTone(frequency, 0.5, 'triangle');
  }, [playTone]);

  return { playCorrect, playWrong, playNote };
}
