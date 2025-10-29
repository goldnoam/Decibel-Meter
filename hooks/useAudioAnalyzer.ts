import { useState, useEffect, useRef, useCallback } from 'react';

type AnalyzerHook = {
  start: () => Promise<void>;
  stop: () => void;
  error: string | null;
  isRecording: boolean;
  db: number;
};

export const useAudioAnalyzer = (): AnalyzerHook => {
  const [db, setDb] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number>(0);

  const processAudio = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    let sumSquares = 0.0;
    for (const amplitude of dataArrayRef.current) {
      const value = (amplitude / 128.0) - 1.0;
      sumSquares += value * value;
    }

    const rms = Math.sqrt(sumSquares / dataArrayRef.current.length);
    if (rms > 0) {
      // This is a simplified, non-calibrated conversion to a dB-like scale.
      const calculatedDb = 20 * Math.log10(rms) + 100;
      setDb(Math.max(0, Math.min(140, calculatedDb))); // Clamp between 0 and 140
    }

    animationFrameId.current = requestAnimationFrame(processAudio);
  }, []);

  const stop = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setDb(0);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (isRecording) return;

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      // FIX: Cast window to 'any' to access vendor-prefixed 'webkitAudioContext' for older browser compatibility.
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
      sourceRef.current.connect(analyserRef.current);

      setIsRecording(true);
      animationFrameId.current = requestAnimationFrame(processAudio);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Permission denied: ${err.message}. Please allow microphone access in your browser settings.`);
      } else {
        setError('An unknown error occurred while accessing the microphone.');
      }
      stop();
    }
  }, [isRecording, processAudio, stop]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, error, isRecording, db };
};
