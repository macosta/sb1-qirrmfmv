import { useCallback, useState, useRef, useEffect } from 'react';
import { STANDARD_TUNING, getNoteFrequency } from '../lib/utils';

// Create a shared audio context to prevent multiple instances
const createAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  // Lazily initialize AudioContext to avoid issues on page load
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (e) {
    console.error('Web Audio API not supported in this browser:', e);
    return null;
  }
};

// Singleton pattern for AudioContext
let sharedAudioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (!sharedAudioContext) {
    sharedAudioContext = createAudioContext();
  }
  return sharedAudioContext;
};

export function useStringAudio() {
  const soundCache = useRef<Map<string, AudioBuffer>>(new Map());
  
  // Optimized string playback with buffer caching
  const playString = useCallback((stringIndex: number, fret: number) => {
    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;
      
      // Unique key for this string/fret combination
      const soundKey = `string_${stringIndex}_fret_${fret}`;
      
      // Get the base note for the string (in standard tuning)
      const baseNote = STANDARD_TUNING[stringIndex];
      
      // Calculate the frequency based on the note and fret
      const baseFreq = getNoteFrequency(baseNote, 3 + Math.floor(stringIndex / 2));
      const freq = baseFreq * Math.pow(2, fret / 12);
      
      // Check if we have this sound cached
      if (soundCache.current.has(soundKey)) {
        const cachedBuffer = soundCache.current.get(soundKey);
        const source = audioContext.createBufferSource();
        source.buffer = cachedBuffer!;
        
        // Create gain node for envelope
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.00001, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 2);
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start playback
        source.start();
        setTimeout(() => {
          source.stop();
        }, 2000);
        
        return;
      }
      
      // If not cached, generate the sound
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      
      // Create gain node for envelope
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.00001, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 2);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start and stop
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 2000);
      
      // For future optimization: Cache the buffer by recording the sound
      // This is a placeholder for actual implementation
      // soundCache.current.set(soundKey, generatedBuffer);
      
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }, []);
  
  return { playString };
}

export function useMetronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Cleanup function to ensure all resources are released
  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
      }
      if (audioContextRef.current) {
        // Close the audio context when component unmounts
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);
  
  const playTickSound = useCallback((isAccent: boolean) => {
    try {
      // Reuse existing context or create new one
      if (!audioContextRef.current) {
        audioContextRef.current = getAudioContext();
      }
      
      const audioContext = audioContextRef.current;
      if (!audioContext) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // First beat of measure has a higher pitch
      oscillator.frequency.value = isAccent ? 1000 : 800;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.00001, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Metronome audio error:', error);
    }
  }, []);
  
  const startMetronome = useCallback(() => {
    if (isPlaying) return;
    
    const interval = 60000 / bpm;
    setCurrentBeat(0);
    
    // Play the first beat immediately
    playTickSound(true);
    
    const id = window.setInterval(() => {
      setCurrentBeat((prev) => {
        const nextBeat = (prev + 1) % beatsPerMeasure;
        // Play tick sound - true for first beat (accent)
        playTickSound(nextBeat === 0);
        return nextBeat;
      });
    }, interval);
    
    intervalIdRef.current = id;
    setIsPlaying(true);
  }, [bpm, beatsPerMeasure, isPlaying, playTickSound]);
  
  const stopMetronome = useCallback(() => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsPlaying(false);
  }, []);
  
  const updateBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(30, Math.min(250, newBpm));
    setBpm(clampedBpm);
    
    // Update interval if metronome is playing
    if (isPlaying && intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      
      const newInterval = 60000 / clampedBpm;
      const id = window.setInterval(() => {
        setCurrentBeat((prev) => {
          const nextBeat = (prev + 1) % beatsPerMeasure;
          playTickSound(nextBeat === 0);
          return nextBeat;
        });
      }, newInterval);
      
      intervalIdRef.current = id;
    }
  }, [isPlaying, beatsPerMeasure, playTickSound]);
  
  return {
    isPlaying,
    bpm,
    beatsPerMeasure,
    currentBeat,
    startMetronome,
    stopMetronome,
    updateBpm,
    setBeatsPerMeasure,
  };
}

// Optimized tuner implementation with better frequency detection
export function useTuner() {
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    analyzerRef.current = null;
    setIsListening(false);
    setFrequency(null);
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  // Improved pitch detection algorithm
  const detectPitch = useCallback(() => {
    if (!analyzerRef.current || !audioContextRef.current) return;
    
    const analyzer = analyzerRef.current;
    const audioContext = audioContextRef.current;
    
    const bufferLength = analyzer.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyzer.getFloatTimeDomainData(buffer);
    
    // Check if the signal is strong enough
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += Math.abs(buffer[i]);
    }
    
    const average = sum / bufferLength;
    if (average < 0.01) { // Signal too weak
      setFrequency(null);
      animationFrameRef.current = requestAnimationFrame(detectPitch);
      return;
    }
    
    // Normalized autocorrelation for better pitch detection
    let maxCorrelation = 0;
    let correlationPos = 0;
    const correlationThreshold = 0.9; // Only accept strong correlations
    
    for (let i = 0; i < bufferLength / 2; i++) {
      let correlation = 0;
      let sumOfSquares = 0;
      
      for (let j = 0; j < bufferLength / 2; j++) {
        correlation += buffer[j] * buffer[j + i];
        sumOfSquares += buffer[j] * buffer[j] + buffer[j + i] * buffer[j + i];
      }
      
      // Normalize correlation
      correlation = correlation / (Math.sqrt(sumOfSquares / 2) || 1);
      
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        correlationPos = i;
      }
    }
    
    if (correlationPos > 0 && maxCorrelation > correlationThreshold) {
      const fundamentalFreq = audioContext.sampleRate / correlationPos;
      if (fundamentalFreq > 60 && fundamentalFreq < 1200) { // Guitar frequency range
        setFrequency(fundamentalFreq);
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(detectPitch);
  }, []);
  
  const startListening = useCallback(async () => {
    try {
      if (isListening) return;
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        } 
      });
      
      // Initialize audio context
      const audioContext = getAudioContext();
      if (!audioContext) return;
      
      // Create analyzer
      const analyzerNode = audioContext.createAnalyser();
      analyzerNode.fftSize = 2048; // More precision for lower notes
      analyzerNode.smoothingTimeConstant = 0.8; // Some smoothing for stability
      
      // Connect microphone to analyzer
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzerNode);
      
      // Store references
      audioContextRef.current = audioContext;
      analyzerRef.current = analyzerNode;
      mediaStreamRef.current = stream;
      
      // Start detection loop
      setIsListening(true);
      animationFrameRef.current = requestAnimationFrame(detectPitch);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      cleanup();
    }
  }, [isListening, detectPitch, cleanup]);
  
  const stopListening = useCallback(() => {
    cleanup();
  }, [cleanup]);
  
  return {
    isListening,
    frequency,
    startListening,
    stopListening,
  };
}