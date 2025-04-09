import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Memoization cache for expensive computations
const memoizationCache: Record<string, any> = {};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Guitar theory utilities
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale degree names
export const SCALE_DEGREES = ['1', '♭2', '2', '♭3', '3', '4', '♯4/♭5', '5', '♭6', '6', '♭7', '7'];

// Interval names
export const INTERVALS = ['R', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7'];

export const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

// Get scale degree for a note relative to root
export function getScaleDegree(note: string, rootNote: string): string {
  // Use memoization for performance
  const cacheKey = `scaleDegree:${note}:${rootNote}`;
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  if (!rootNote) return note;
  const rootIndex = NOTES.indexOf(rootNote);
  const noteIndex = NOTES.indexOf(note);
  if (rootIndex === -1 || noteIndex === -1) return note;
  
  const degreeIndex = (noteIndex - rootIndex + 12) % 12;
  const result = SCALE_DEGREES[degreeIndex];
  
  // Cache the result
  memoizationCache[cacheKey] = result;
  
  return result;
}

// Get interval name for a note relative to root
export function getIntervalName(note: string, rootNote: string): string {
  // Use memoization for performance
  const cacheKey = `intervalName:${note}:${rootNote}`;
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  if (!rootNote) return note;
  const rootIndex = NOTES.indexOf(rootNote);
  const noteIndex = NOTES.indexOf(note);
  if (rootIndex === -1 || noteIndex === -1) return note;
  
  const intervalIndex = (noteIndex - rootIndex + 12) % 12;
  const result = INTERVALS[intervalIndex];
  
  // Cache the result
  memoizationCache[cacheKey] = result;
  
  return result;
}

// Updated chord definitions with accurate notes and finger positions
export const CHORDS = {
  'C Major': ['C', 'E', 'G'],
  'C Major sixth': ['C', 'E', 'G', 'A'],
  'C Major dominant seventh': ['C', 'E', 'G', 'Bb'],
  'C Major seventh': ['C', 'E', 'G', 'B'],
  'C Major ninth': ['C', 'E', 'G', 'B', 'D'],
  'C Major dominant ninth': ['C', 'E', 'G', 'Bb', 'D'],
  'C Major eleventh': ['C', 'E', 'G', 'B', 'D', 'F'],
  'C Major dominant eleventh': ['C', 'E', 'G', 'Bb', 'D', 'F'],
  'C Major thirteenth': ['C', 'E', 'G', 'B', 'D', 'F', 'A'],
  'C Major dominant 13': ['C', 'E', 'G', 'Bb', 'D', 'F', 'A'],
  'C Suspended second': ['C', 'D', 'G'],
  'C Suspended Fourth': ['C', 'F', 'G'],
  'C Major dominant 7 sus4': ['C', 'F', 'G', 'Bb'],
  'C Major dominant 9 sus4': ['C', 'F', 'G', 'Bb', 'D'],
  'C Major dominant 13 sus4': ['C', 'F', 'G', 'Bb', 'D', 'F', 'A'],
  'C Power chord': ['C', 'G'],
  'D Major': ['D', 'F#', 'A'],
  'D Major sixth': ['D', 'F#', 'A', 'B'],
  'D Major dominant seventh': ['D', 'F#', 'A', 'C'],
  'D Major seventh': ['D', 'F#', 'A', 'C#'],
  'D Major ninth': ['D', 'F#', 'A', 'C#', 'E'],
  'D Major dominant ninth': ['D', 'F#', 'A', 'C', 'E'],
  'D Major eleventh': ['D', 'F#', 'A', 'C#', 'E', 'G'],
  'D Major dominant eleventh': ['D', 'F#', 'A', 'C', 'E', 'G'],
  'D Major thirteenth': ['D', 'F#', 'A', 'C#', 'E', 'G', 'B'],
  'D Major dominant 13': ['D', 'F#', 'A', 'C', 'E', 'G', 'B'],
  'D Suspended second': ['D', 'E', 'A'],
  'D Suspended Fourth': ['D', 'G', 'A'],
  'D Major dominant 7 sus4': ['D', 'G', 'A', 'C'],
  'D Major dominant 9 sus4': ['D', 'G', 'A', 'C', 'E'],
  'D Major dominant 13 sus4': ['D', 'G', 'A', 'C', 'E', 'G', 'B'],
  'D Power chord': ['D', 'A'],
  'E Major': ['E', 'G#', 'B'],
  'E Major sixth': ['E', 'G#', 'B', 'C#'],
  'E Major dominant seventh': ['E', 'G#', 'B', 'D'],
  'E Major seventh': ['E', 'G#', 'B', 'D#'],
  'E Major ninth': ['E', 'G#', 'B', 'D#', 'F#'],
  'E Major dominant ninth': ['E', 'G#', 'B', 'D', 'F#'],
  'E Major eleventh': ['E', 'G#', 'B', 'D#', 'F#', 'A'],
  'E Major dominant eleventh': ['E', 'G#', 'B', 'D', 'F#', 'A'],
  'E Major thirteenth': ['E', 'G#', 'B', 'D#', 'F#', 'A', 'C#'],
  'E Major dominant 13': ['E', 'G#', 'B', 'D', 'F#', 'A', 'C#'],
  'E Suspended second': ['E', 'F#', 'B'],
  'E Suspended Fourth': ['E', 'A', 'B'],
  'E Major dominant 7 sus4': ['E', 'A', 'B', 'D'],
  'E Major dominant 9 sus4': ['E', 'A', 'B', 'D', 'F#'],
  'E Major dominant 13 sus4': ['E', 'A', 'B', 'D', 'F#', 'A', 'C#'],
  'E Power chord': ['E', 'B'],
  'F Major': ['F', 'A', 'C'],
  'F Major sixth': ['F', 'A', 'C', 'D'],
  'F Major dominant seventh': ['F', 'A', 'C', 'Eb'],
  'F Major seventh': ['F', 'A', 'C', 'E'],
  'F Major ninth': ['F', 'A', 'C', 'E', 'G'],
  'F Major dominant ninth': ['F', 'A', 'C', 'Eb', 'G'],
  'F Major eleventh': ['F', 'A', 'C', 'E', 'G', 'Bb'],
  'F Major dominant eleventh': ['F', 'A', 'C', 'Eb', 'G', 'Bb'],
  'F Major thirteenth': ['F', 'A', 'C', 'E', 'G', 'Bb', 'D'],
  'F Major dominant 13': ['F', 'A', 'C', 'Eb', 'G', 'Bb', 'D'],
  'F Suspended second': ['F', 'G', 'C'],
  'F Suspended Fourth': ['F', 'Bb', 'C'],
  'F Major dominant 7 sus4': ['F', 'Bb', 'C', 'Eb'],
  'F Major dominant 9 sus4': ['F', 'Bb', 'C', 'Eb', 'G'],
  'F Major dominant 13 sus4': ['F', 'Bb', 'C', 'Eb', 'G', 'Bb', 'D'],
  'F Power chord': ['F', 'C'],
  'G Major': ['G', 'B', 'D'],
  'G Major sixth': ['G', 'B', 'D', 'E'],
  'G Major dominant seventh': ['G', 'B', 'D', 'F'],
  'G Major seventh': ['G', 'B', 'D', 'F#'],
  'G Major ninth': ['G', 'B', 'D', 'F#', 'A'],
  'G Major dominant ninth': ['G', 'B', 'D', 'F', 'A'],
  'G Major eleventh': ['G', 'B', 'D', 'F#', 'A', 'C'],
  'G Major dominant eleventh': ['G', 'B', 'D', 'F', 'A', 'C'],
  'G Major thirteenth': ['G', 'B', 'D', 'F#', 'A', 'C', 'E'],
  'G Major dominant 13': ['G', 'B', 'D', 'F', 'A', 'C', 'E'],
  'G Suspended second': ['G', 'A', 'D'],
  'G Suspended Fourth': ['G', 'C', 'D'],
  'G Major dominant 7 sus4': ['G', 'C', 'D', 'F'],
  'G Major dominant 9 sus4': ['G', 'C', 'D', 'F', 'A'],
  'G Major dominant 13 sus4': ['G', 'C', 'D', 'F', 'A', 'C', 'E'],
  'G Power chord': ['G', 'D'],
  'A Major': ['A', 'C#', 'E'],
  'A Major sixth': ['A', 'C#', 'E', 'F#'],
  'A Major dominant seventh': ['A', 'C#', 'E', 'G'],
  'A Major seventh': ['A', 'C#', 'E', 'G#'],
  'A Major ninth': ['A', 'C#', 'E', 'G#', 'B'],
  'A Major dominant ninth': ['A', 'C#', 'E', 'G', 'B'],
  'A Major eleventh': ['A', 'C#', 'E', 'G#', 'B', 'D'],
  'A Major dominant eleventh': ['A', 'C#', 'E', 'G', 'B', 'D'],
  'A Major thirteenth': ['A', 'C#', 'E', 'G#', 'B', 'D', 'F#'],
  'A Major dominant 13': ['A', 'C#', 'E', 'G', 'B', 'D', 'F#'],
  'A Suspended second': ['A', 'B', 'E'],
  'A Suspended Fourth': ['A', 'D', 'E'],
  'A Major dominant 7 sus4': ['A', 'D', 'E', 'G'],
  'A Major dominant 9 sus4': ['A', 'D', 'E', 'G', 'B'],
  'A Major dominant 13 sus4': ['A', 'D', 'E', 'G', 'B', 'D', 'F#'],
  'A Power chord': ['A', 'E'],
  'B Major': ['B', 'D#', 'F#'],
  'B Major sixth': ['B', 'D#', 'F#', 'G#'],
  'B Major dominant seventh': ['B', 'D#', 'F#', 'A'],
  'B Major seventh': ['B', 'D#', 'F#', 'A#'],
  'B Major ninth': ['B', 'D#', 'F#', 'A#', 'C#'],
  'B Major dominant ninth': ['B', 'D#', 'F#', 'A', 'C#'],
  'B Major eleventh': ['B', 'D#', 'F#', 'A#', 'C#', 'E'],
  'B Major dominant eleventh': ['B', 'D#', 'F#', 'A', 'C#', 'E'],
  'B Major thirteenth': ['B', 'D#', 'F#', 'A#', 'C#', 'E', 'G#'],
  'B Major dominant 13': ['B', 'D#', 'F#', 'A', 'C#', 'E', 'G#'],
  'B Suspended second': ['B', 'C#', 'F#'],
  'B Suspended Fourth': ['B', 'E', 'F#'],
  'B Major dominant 7 sus4': ['B', 'E', 'F#', 'A'],
  'B Major dominant 9 sus4': ['B', 'E', 'F#', 'A', 'C#'],
  'B Major dominant 13 sus4': ['B', 'E', 'F#', 'A', 'C#', 'E', 'G#'],
  'B Power chord': ['B', 'F#'],
  'C Minor': ['C', 'D#', 'G'],
  'C Minor 6th': ['C', 'D#', 'G', 'A'],
  'C Minor Seventh': ['C', 'D#', 'G', 'A#'],
  'C Minor ninth': ['C', 'D#', 'G', 'A#', 'D'],
  'C Minor eleventh': ['C', 'D#', 'G', 'A#', 'D', 'F'],
  'C Minor 13th': ['C', 'D#', 'G', 'A#', 'D', 'F', 'A'],
  'D Minor': ['D', 'F', 'A'],
  'D Minor 6th': ['D', 'F', 'A', 'B'],
  'D Minor Seventh': ['D', 'F', 'A', 'C'],
  'D Minor ninth': ['D', 'F', 'A', 'C', 'E'],
  'D Minor eleventh': ['D', 'F', 'A', 'C', 'E', 'G'],
  'D Minor 13th': ['D', 'F', 'A', 'C', 'E', 'G', 'B'],
  'E Minor': ['E', 'G', 'B'],
  'E Minor 6th': ['E', 'G', 'B', 'C#'],
  'E Minor Seventh': ['E', 'G', 'B', 'D'],
  'E Minor ninth': ['E', 'G', 'B', 'D', 'F#'],
  'E Minor eleventh': ['E', 'G', 'B', 'D', 'F#', 'A'],
  'E Minor 13th': ['E', 'G', 'B', 'D', 'F#', 'A', 'C#'],
  'F Minor': ['F', 'G#', 'C'],
  'F Minor 6th': ['F', 'G#', 'C', 'D'],
  'F Minor Seventh': ['F', 'G#', 'C', 'D#'],
  'F Minor ninth': ['F', 'G#', 'C', 'D#', 'G'],
  'F Minor eleventh': ['F', 'G#', 'C', 'D#', 'G', 'A#'],
  'F Minor 13th': ['F', 'G#', 'C', 'D#', 'G', 'A#', 'D'],
  'G Minor': ['G', 'A#', 'D'],
  'G Minor 6th': ['G', 'A#', 'D', 'E'],
  'G Minor Seventh': ['G', 'A#', 'D', 'F'],
  'G Minor ninth': ['G', 'A#', 'D', 'F', 'A'],
  'G Minor eleventh': ['G', 'A#', 'D', 'F', 'A', 'C'],
  'G Minor 13th': ['G', 'A#', 'D', 'F', 'A', 'C', 'E'],
  'A Minor': ['A', 'C', 'E'],
  'A Minor 6th': ['A', 'C', 'E', 'F#'],
  'A Minor Seventh': ['A', 'C', 'E', 'G'],
  'A Minor ninth': ['A', 'C', 'E', 'G', 'B'],
  'A Minor eleventh': ['A', 'C', 'E', 'G', 'B', 'D'],
  'A Minor 13th': ['A', 'C', 'E', 'G', 'B', 'D', 'F#'],
  'B Minor': ['B', 'D', 'F#'],
  'B Minor 6th': ['B', 'D', 'F#', 'G#'],
  'B Minor Seventh': ['B', 'D', 'F#', 'A'],
  'B Minor ninth': ['B', 'D', 'F#', 'A', 'C#'],
  'B Minor eleventh': ['B', 'D', 'F#', 'A', 'C#', 'E'],
  'B Minor 13th': ['B', 'D', 'F#', 'A', 'C#', 'E', 'G#']
};

// Chord positions with fingerings - mapping chord names to specific fretboard positions
export const CHORD_POSITIONS = {
  'C Major': [
    {
      // x32010 - Open C shape
      fretStart: 0,
      fingerings: [null, 3, 2, 0, 1, 0], // null = muted, 0 = open, 1-4 = fingers
      notes: ['×', 'C', 'E', 'G', 'C', 'E'],
      barres: [],
      position: "Open Position"
    },
    {
      // 8 10 10 9 8 8 - C shape barre
      fretStart: 7,
      fingerings: [1, 3, 4, 2, 1, 1], 
      notes: ['C', 'E', 'G', 'C', 'E', 'G'],
      barres: [{fret: 8, startString: 0, endString: 5}],
      position: "8th Position"
    },
    {
      // x 3 5 5 5 3 - C shape barre at 3rd fret
      fretStart: 2,
      fingerings: [null, 1, 3, 4, 2, 1],
      notes: ['×', 'C', 'G', 'C', 'E', 'G'],
      barres: [{fret: 3, startString: 1, endString: 5}],
      position: "3rd Position"
    }
  ],
  'G Major': [
    {
      // 320003 - Open G shape
      fretStart: 0,
      fingerings: [3, 2, 0, 0, 0, 3], // Fingerings in [Low E, A, D, G, B, High E] order
      notes: ['G', 'B', 'D', 'G', 'B', 'G'],
      barres: [],
      position: "Open Position"
    },
    {
      // 3 5 5 4 3 3 - G shape barre
      fretStart: 2,
      fingerings: [1, 3, 4, 2, 1, 1],
      notes: ['G', 'B', 'D', 'G', 'B', 'D'],
      barres: [{fret: 3, startString: 0, endString: 5}],
      position: "3rd Position"
    }
  ],
  'D Major': [
    {
      // xx0232 - Open D shape
      fretStart: 0,
      fingerings: [null, null, 0, 2, 3, 2],
      notes: ['×', '×', 'D', 'A', 'D', 'F#'],
      barres: [],
      position: "Open Position"
    },
    {
      // x 5 7 7 7 5 - D shape barre
      fretStart: 4,
      fingerings: [null, 1, 3, 4, 2, 1],
      notes: ['×', 'D', 'A', 'D', 'F#', 'A'],
      barres: [{fret: 5, startString: 1, endString: 5}],
      position: "5th Position"
    }
  ],
  'A Major': [
    {
      // x02220 - Open A shape
      fretStart: 0,
      fingerings: [null, 0, 2, 2, 2, 0],
      notes: ['×', 'A', 'E', 'A', 'C#', 'E'],
      barres: [],
      position: "Open Position"
    },
    {
      // 5 7 7 6 5 5 - A shape barre
      fretStart: 4,
      fingerings: [1, 3, 4, 2, 1, 1],
      notes: ['A', 'E', 'A', 'C#', 'E', 'A'],
      barres: [{fret: 5, startString: 0, endString: 5}],
      position: "5th Position"
    }
  ],
  'E Major': [
    {
      // 022100 - Open E shape
      fretStart: 0,
      fingerings: [0, 2, 2, 1, 0, 0],
      notes: ['E', 'B', 'E', 'G#', 'B', 'E'],
      barres: [],
      position: "Open Position"
    },
    {
      // 0 2 2 1 0 0 - E shape
      fretStart: 0,
      fingerings: [0, 2, 2, 1, 0, 0],
      notes: ['E', 'B', 'E', 'G#', 'B', 'E'],
      barres: [],
      position: "Open Position"
    }
  ],
  'A Minor': [
    {
      // x02210 - Open Am shape
      fretStart: 0,
      fingerings: [null, 0, 2, 2, 1, 0],
      notes: ['×', 'A', 'E', 'A', 'C', 'E'],
      barres: [],
      position: "Open Position"
    },
    {
      // 5 7 7 5 5 5 - Am shape barre
      fretStart: 4,
      fingerings: [1, 3, 4, 1, 1, 1],
      notes: ['A', 'E', 'A', 'C', 'E', 'A'],
      barres: [{fret: 5, startString: 0, endString: 5}],
      position: "5th Position"
    }
  ],
  'E Minor': [
    {
      // 022000 - Open Em shape
      fretStart: 0,
      fingerings: [0, 2, 2, 0, 0, 0],
      notes: ['E', 'B', 'E', 'G', 'B', 'E'],
      barres: [],
      position: "Open Position"
    },
    {
      // 0 2 2 0 0 0 - Em shape
      fretStart: 0,
      fingerings: [0, 2, 2, 0, 0, 0],
      notes: ['E', 'B', 'E', 'G', 'B', 'E'],
      barres: [],
      position: "Open Position"
    }
  ],
  'D Minor': [
    {
      // xx0231 - Open Dm shape
      fretStart: 0,
      fingerings: [null, null, 0, 2, 3, 1],
      notes: ['×', '×', 'D', 'A', 'D', 'F'],
      barres: [],
      position: "Open Position"
    },
    {
      // x 5 7 7 6 5 - Dm shape barre
      fretStart: 4,
      fingerings: [null, 1, 3, 4, 2, 1],
      notes: ['×', 'D', 'A', 'D', 'F', 'A'],
      barres: [{fret: 5, startString: 1, endString: 5}],
      position: "5th Position"
    }
  ],
  'G Minor': [
    {
      // 3x0333 - Open Gm shape (not standard)
      fretStart: 2,
      fingerings: [1, null, 0, 2, 3, 4],
      notes: ['G', '×', 'D', 'G', 'Bb', 'D'],
      barres: [],
      position: "3rd Position"
    },
    {
      // 3 5 5 3 3 3 - Gm shape barre
      fretStart: 2,
      fingerings: [1, 3, 4, 1, 1, 1],
      notes: ['G', 'D', 'G', 'Bb', 'D', 'G'],
      barres: [{fret: 3, startString: 0, endString: 5}],
      position: "3rd Position Barre"
    }
  ],
  'C Minor': [
    {
      // x35543 - Cm shape (movable)
      fretStart: 2,
      fingerings: [null, 1, 3, 4, 2, 1],
      notes: ['×', 'C', 'G', 'C', 'Eb', 'G'],
      barres: [{fret: 3, startString: 1, endString: 5}],
      position: "3rd Position"
    },
    {
      // 8 10 10 8 8 8 - Cm shape barre
      fretStart: 7,
      fingerings: [1, 3, 4, 1, 1, 1],
      notes: ['C', 'G', 'C', 'Eb', 'G', 'C'],
      barres: [{fret: 8, startString: 0, endString: 5}],
      position: "8th Position"
    }
  ],
  'B Minor': [
    {
      // x24432 - Bm shape (movable)
      fretStart: 1,
      fingerings: [null, 1, 3, 4, 2, 1],
      notes: ['×', 'B', 'F#', 'B', 'D', 'F#'],
      barres: [{fret: 2, startString: 1, endString: 5}],
      position: "2nd Position"
    },
    {
      // 7 9 9 7 7 7 - Bm shape barre
      fretStart: 6,
      fingerings: [1, 3, 4, 1, 1, 1],
      notes: ['B', 'F#', 'B', 'D', 'F#', 'B'],
      barres: [{fret: 7, startString: 0, endString: 5}],
      position: "7th Position"
    }
  ],
  'F Major': [
    {
      // 133211 - F barre chord
      fretStart: 0,
      fingerings: [1, 3, 3, 2, 1, 1],
      notes: ['F', 'C', 'F', 'A', 'C', 'F'],
      barres: [{fret: 1, startString: 0, endString: 5}],
      position: "1st Position"
    },
    {
      // xx3211 - F shape (partial)
      fretStart: 0,
      fingerings: [null, null, 3, 2, 1, 1],
      notes: ['×', '×', 'F', 'A', 'C', 'F'],
      barres: [{fret: 1, startString: 4, endString: 5}],
      position: "1st Position (Partial)"
    }
  ],
  'F Minor': [
    {
      // 133111 - Fm barre chord
      fretStart: 0,
      fingerings: [1, 3, 3, 1, 1, 1],
      notes: ['F', 'C', 'F', 'Ab', 'C', 'F'],
      barres: [{fret: 1, startString: 0, endString: 5}],
      position: "1st Position"
    }
  ]
};

// Map chord types to their base chords for finger positions
export const CHORD_TYPE_MAPPING = {
  'Major': 'Major',
  'Minor': 'Minor',
  'Major sixth': 'Major',
  'Major seventh': 'Major',
  'Minor Seventh': 'Minor',
  'Major dominant seventh': 'Major',
  'Suspended second': 'Major',
  'Suspended Fourth': 'Major',
  'Power chord': 'Power'
};

// Finger color mapping
export const FINGER_COLORS = {
  1: '#4CAF50', // Green for index finger
  2: '#2196F3', // Blue for middle finger
  3: '#FF9800', // Orange for ring finger
  4: '#9C27B0', // Purple for pinky
  0: 'transparent', // Open string
  null: 'transparent' // Muted string
};

// Cache for scales - we'll initialize this later
const scalePatternCache: Record<string, boolean[][]> = {};

// Extended scale definitions for all major scales and modes
// Using proper Western music theory notation (flats vs sharps)
export const SCALES = {
  // Major scales - using proper Western music theory notation
  'C Major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G Major': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D Major': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A Major': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E Major': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'B Major': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  'F# Major': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
  'C# Major': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'],
  // Flat key signatures - using proper Western music theory notation
  'F Major': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'Bb Major': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'Eb Major': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab Major': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'Db Major': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'Gb Major': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  'Cb Major': ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'],
  
  // Natural minor scales (Aeolian mode)
  'A Minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'E Minor': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  'B Minor': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
  'F# Minor': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
  'C# Minor': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
  'G# Minor': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
  'D# Minor': ['D#', 'F', 'F#', 'G#', 'A#', 'B', 'C#'],
  'A# Minor': ['A#', 'C', 'C#', 'D#', 'F', 'F#', 'G#'],
  // Flat key signatures for minor scales
  'D Minor': ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  'G Minor': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  'C Minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'F Minor': ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
  'Bb Minor': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
  'Eb Minor': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
  'Ab Minor': ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb'],
  
  // Dorian mode
  'C Dorian': ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
  'D Dorian': ['D', 'E', 'F', 'G', 'A', 'B', 'C'],
  'E Dorian': ['E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
  'F Dorian': ['F', 'G', 'Ab', 'Bb', 'C', 'D', 'Eb'],
  'G Dorian': ['G', 'A', 'Bb', 'C', 'D', 'E', 'F'],
  'A Dorian': ['A', 'B', 'C', 'D', 'E', 'F#', 'G'],
  'B Dorian': ['B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
  'Bb Dorian': ['Bb', 'C', 'Db', 'Eb', 'F', 'G', 'Ab'],
  'Eb Dorian': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'Db'],
  'Ab Dorian': ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F', 'Gb'],
  
  // Phrygian mode
  'C Phrygian': ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'D Phrygian': ['D', 'Eb', 'F', 'G', 'A', 'Bb', 'C'],
  'E Phrygian': ['E', 'F', 'G', 'A', 'B', 'C', 'D'],
  'F Phrygian': ['F', 'Gb', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
  'G Phrygian': ['G', 'Ab', 'Bb', 'C', 'D', 'Eb', 'F'],
  'A Phrygian': ['A', 'Bb', 'C', 'D', 'E', 'F', 'G'],
  'B Phrygian': ['B', 'C', 'D', 'E', 'F#', 'G', 'A'],
  
  // Lydian mode
  'C Lydian': ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
  'D Lydian': ['D', 'E', 'F#', 'G#', 'A', 'B', 'C#'],
  'E Lydian': ['E', 'F#', 'G#', 'A#', 'B', 'C#', 'D#'],
  'F Lydian': ['F', 'G', 'A', 'B', 'C', 'D', 'E'],
  'G Lydian': ['G', 'A', 'B', 'C#', 'D', 'E', 'F#'],
  'A Lydian': ['A', 'B', 'C#', 'D#', 'E', 'F#', 'G#'],
  'B Lydian': ['B', 'C#', 'D#', 'F', 'F#', 'G#', 'A#'],
  'Bb Lydian': ['Bb', 'C', 'D', 'E', 'F', 'G', 'A'],
  'Eb Lydian': ['Eb', 'F', 'G', 'A', 'Bb', 'C', 'D'],
  'Ab Lydian': ['Ab', 'Bb', 'C', 'D', 'Eb', 'F', 'G'],
  
  // Mixolydian mode
  'C Mixolydian': ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
  'D Mixolydian': ['D', 'E', 'F#', 'G', 'A', 'B', 'C'],
  'E Mixolydian': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D'],
  'F Mixolydian': ['F', 'G', 'A', 'Bb', 'C', 'D', 'Eb'],
  'G Mixolydian': ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
  'A Mixolydian': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G'],
  'B Mixolydian': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A'],
  'Bb Mixolydian': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'Ab'],
  'Eb Mixolydian': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db'],
  
  // Locrian mode
  'C Locrian': ['C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb'],
  'D Locrian': ['D', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C'],
  'E Locrian': ['E', 'F', 'G', 'A', 'Bb', 'C', 'D'],
  'F Locrian': ['F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb'],
  'G Locrian': ['G', 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F'],
  'A Locrian': ['A', 'Bb', 'C', 'D', 'Eb', 'F', 'G'],
  'B Locrian': ['B', 'C', 'D', 'E', 'F', 'G', 'A'],
  
  // Harmonic minor
  'A Harmonic Minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G#'],
  'E Harmonic Minor': ['E', 'F#', 'G', 'A', 'B', 'C', 'D#'],
  'B Harmonic Minor': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A#'],
  'F# Harmonic Minor': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'F'],
  'C# Harmonic Minor': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'C'],
  'G# Harmonic Minor': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'G'],
  'D# Harmonic Minor': ['D#', 'F', 'F#', 'G#', 'A#', 'B', 'D'],
  
  // Flat key harmonic minor
  'D Harmonic Minor': ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#'],
  'G Harmonic Minor': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F#'],
  'C Harmonic Minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'],
  'F Harmonic Minor': ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'E'],
  'Bb Harmonic Minor': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'A'],
  'Eb Harmonic Minor': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'D'],
  
  // Melodic minor (ascending)
  'A Melodic Minor': ['A', 'B', 'C', 'D', 'E', 'F#', 'G#'],
  'E Melodic Minor': ['E', 'F#', 'G', 'A', 'B', 'C#', 'D#'],
  'B Melodic Minor': ['B', 'C#', 'D', 'E', 'F#', 'G#', 'A#'],
  'F# Melodic Minor': ['F#', 'G#', 'A', 'B', 'C#', 'D#', 'F'],
  'C# Melodic Minor': ['C#', 'D#', 'E', 'F#', 'G#', 'A#', 'C'],
  
  // Flat key melodic minor
  'D Melodic Minor': ['D', 'E', 'F', 'G', 'A', 'B', 'C#'],
  'G Melodic Minor': ['G', 'A', 'Bb', 'C', 'D', 'E', 'F#'],
  'C Melodic Minor': ['C', 'D', 'Eb', 'F', 'G', 'A', 'B'],
  'F Melodic Minor': ['F', 'G', 'Ab', 'Bb', 'C', 'D', 'E'],
  'Bb Melodic Minor': ['Bb', 'C', 'Db', 'Eb', 'F', 'G', 'A'],
  'Eb Melodic Minor': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'D'],
  
  // Pentatonic scales
  'C Major Pentatonic': ['C', 'D', 'E', 'G', 'A'],
  'G Major Pentatonic': ['G', 'A', 'B', 'D', 'E'],
  'D Major Pentatonic': ['D', 'E', 'F#', 'A', 'B'],
  'A Major Pentatonic': ['A', 'B', 'C#', 'E', 'F#'],
  'E Major Pentatonic': ['E', 'F#', 'G#', 'B', 'C#'],
  'B Major Pentatonic': ['B', 'C#', 'D#', 'F#', 'G#'],
  'F# Major Pentatonic': ['F#', 'G#', 'A#', 'C#', 'D#'],
  
  // Flat key major pentatonics
  'F Major Pentatonic': ['F', 'G', 'A', 'C', 'D'],
  'Bb Major Pentatonic': ['Bb', 'C', 'D', 'F', 'G'],
  'Eb Major Pentatonic': ['Eb', 'F', 'G', 'Bb', 'C'],
  'Ab Major Pentatonic': ['Ab', 'Bb', 'C', 'Eb', 'F'],
  
  // Minor pentatonics
  'A Minor Pentatonic': ['A', 'C', 'D', 'E', 'G'],
  'E Minor Pentatonic': ['E', 'G', 'A', 'B', 'D'],
  'B Minor Pentatonic': ['B', 'D', 'E', 'F#', 'A'],
  'F# Minor Pentatonic': ['F#', 'A', 'B', 'C#', 'E'],
  'C# Minor Pentatonic': ['C#', 'E', 'F#', 'G#', 'B'],
  
  // Flat key minor pentatonics
  'D Minor Pentatonic': ['D', 'F', 'G', 'A', 'C'],
  'G Minor Pentatonic': ['G', 'Bb', 'C', 'D', 'F'],
  'C Minor Pentatonic': ['C', 'Eb', 'F', 'G', 'Bb'],
  'F Minor Pentatonic': ['F', 'Ab', 'Bb', 'C', 'Eb'],
  'Bb Minor Pentatonic': ['Bb', 'Db', 'Eb', 'F', 'Ab'],
  
  // Blues scales
  'A Blues': ['A', 'C', 'D', 'Eb', 'E', 'G'],
  'E Blues': ['E', 'G', 'A', 'Bb', 'B', 'D'],
  'B Blues': ['B', 'D', 'E', 'F', 'F#', 'A'],
  'F# Blues': ['F#', 'A', 'B', 'C', 'C#', 'E'],
  'C# Blues': ['C#', 'E', 'F#', 'G', 'G#', 'B'],
  
  // Flat key blues scales
  'D Blues': ['D', 'F', 'G', 'Ab', 'A', 'C'],
  'G Blues': ['G', 'Bb', 'C', 'Db', 'D', 'F'],
  'C Blues': ['C', 'Eb', 'F', 'Gb', 'G', 'Bb'],
  'F Blues': ['F', 'Ab', 'Bb', 'B', 'C', 'Eb'],
  'Bb Blues': ['Bb', 'Db', 'Eb', 'E', 'F', 'Ab'],
  'Eb Blues': ['Eb', 'Gb', 'Ab', 'A', 'Bb', 'Db'],
};

/**
 * Gets the note at a specific fret position for a given string
 * @param stringNote The open string note
 * @param fret The fret number (0 for open string)
 * @returns The note at the fret position
 */
export function getNoteAtFret(stringNote: string, fret: number): string {
  // Use memoization for performance
  const cacheKey = `noteAtFret:${stringNote}:${fret}`;
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  const noteIndex = NOTES.indexOf(stringNote);
  if (noteIndex === -1) return 'C';
  
  const result = NOTES[(noteIndex + fret) % 12];
  
  // Cache the result
  memoizationCache[cacheKey] = result;
  
  return result;
}

/**
 * Generates a 2D array of all notes on the fretboard
 * @param tuning The tuning array (from high to low strings)
 * @param frets The number of frets to calculate
 * @returns A 2D array of notes [string][fret]
 */
export function getFretboardNotes(tuning = STANDARD_TUNING, frets = 24): string[][] {
  // Create cache key based on tuning and frets
  const cacheKey = `fretboardNotes:${tuning.join('-')}:${frets}`;
  
  // Check if we already calculated this
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  const fretboardNotes: string[][] = [];
  
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    const openNote = tuning[stringIndex];
    const stringNotes: string[] = [];
    
    for (let fret = 0; fret <= frets; fret++) {
      stringNotes.push(getNoteAtFret(openNote, fret));
    }
    
    fretboardNotes.push(stringNotes);
  }
  
  // Cache the result
  memoizationCache[cacheKey] = fretboardNotes;
  
  return fretboardNotes;
}

export function getChordFrets(chordName: string, tuning = STANDARD_TUNING): (number | null)[] {
  const chordNotes = CHORDS[chordName as keyof typeof CHORDS];
  if (!chordNotes) return [null, null, null, null, null, null];
  
  return tuning.map((openNote, stringIndex) => {
    for (let fret = 0; fret <= 12; fret++) {
      const noteAtFret = getNoteAtFret(openNote, fret);
      if (chordNotes.includes(noteAtFret)) {
        if (stringIndex === 0 && fret > 5) return null;
        if (stringIndex === 5 && fret > 5 && chordName.includes('Minor')) return null;
        return fret;
      }
    }
    return null;
  }).reverse();
}

/**
 * Get chord positions including fingering information
 * @param chordName The name of the chord (e.g., 'C Major', 'Em')
 * @returns An array of chord positions with fingering information
 */
export function getChordPositionsWithFingerings(chordName: string | null): any[] {
  // If no chord name is provided, return empty array
  if (!chordName) return [];
  
  // Parse the chord name to get root and type
  const [rootNote, ...typeWords] = chordName.split(' ');
  const chordType = typeWords.join(' ');
  
  // Look for exact match first
  if (CHORD_POSITIONS[chordName as keyof typeof CHORD_POSITIONS]) {
    return CHORD_POSITIONS[chordName as keyof typeof CHORD_POSITIONS];
  }
  
  // Look for a match based on the root note and type
  const rootChord = `${rootNote} ${CHORD_TYPE_MAPPING[chordType as keyof typeof CHORD_TYPE_MAPPING] || 'Major'}`;
  
  if (CHORD_POSITIONS[rootChord as keyof typeof CHORD_POSITIONS]) {
    return CHORD_POSITIONS[rootChord as keyof typeof CHORD_POSITIONS];
  }
  
  // If no matching chord is found, return an empty array
  return [];
}

// Get all occurrences of chord notes across the fretboard
export function getAllChordPositions(chordName: string | null, tuning = STANDARD_TUNING, frets = 24): { string: number; fret: number; note: string; role: string; finger?: number; }[] {
  // Cache key for memoization
  const cacheKey = `chordPositions:${chordName}:${tuning.join(',')}:${frets}`;
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  if (!chordName) return [];
  
  // Get the chord notes and determine chord type
  const chordNotes = CHORDS[chordName as keyof typeof CHORDS];
  if (!chordNotes) return [];
  
  // Parse chord name to get root and type
  const [rootNote, ...typeWords] = chordName.split(' ');
  const chordType = typeWords.join(' ');
  
  // Get fingering information for this chord
  const chordPositions = getChordPositionsWithFingerings(chordName);
  
  // If we have specific fingerings available, use them
  if (chordPositions.length > 0) {
    // Use the first chord position (most common)
    const chordPosition = chordPositions[0];
    
    // Map the fingerings to positions on the fretboard
    const positions: { string: number, fret: number, note: string, role: string, finger?: number }[] = [];
    
    // IMPORTANT: fingerings are defined in Low E to high E order (index 0 = low E, index 5 = high E)
    // But our tuning array and fretboard display is in the opposite order
    chordPosition.fingerings.forEach((finger: number | null, stringIdx: number) => {
      // Skip muted strings
      if (finger === null) return;
      
      // For open strings (finger = 0), fret is 0
      const fret = finger === 0 ? 0 : chordPosition.fretStart + finger;
      
      // Map the string index correctly from the CHORD_POSITIONS definition to the actual string
      // In CHORD_POSITIONS, 0 = low E (6th string) and 5 = high E (1st string)
      // But in our tuning array and display, we use the opposite: 0 = E (1st string) and 5 = E (6th string)
      const actualStringIndex = 5 - stringIdx;
      
      // Get the note at this position
      const openNote = tuning[actualStringIndex];
      const noteAtFret = getNoteAtFret(openNote, fret);
      
      // Determine the role of this note in the chord
      let role = 'chord';
      
      if (noteAtFret === rootNote) {
        role = 'root';
      } else if (noteAtFret === chordNotes[1]) {
        role = 'third';
      } else if (noteAtFret === chordNotes[2]) {
        role = 'fifth';
      } else {
        // Handle extended chord tones
        const noteIndex = chordNotes.indexOf(noteAtFret);
        if (noteIndex >= 3) {
          if (chordType.includes('seventh') || chordType.includes('7')) {
            role = 'seventh';
          } else if (chordType.includes('ninth') || chordType.includes('9')) {
            role = 'ninth';
          } else if (chordType.includes('eleventh') || chordType.includes('11')) {
            role = 'eleventh';
          } else if (chordType.includes('thirteenth') || chordType.includes('13')) {
            role = 'thirteenth';
          } else if (chordType.includes('sixth') || chordType.includes('6')) {
            role = 'sixth';
          }
        }
      }
      
      // Add to positions array
      positions.push({
        string: actualStringIndex,
        fret: fret,
        note: noteAtFret,
        role: role,
        ...(finger !== 0 && { finger: finger })
      });
    });
    
    // Add barre information if needed
    chordPosition.barres.forEach((barre: { fret: number, startString: number, endString: number }) => {
      // Barre strings are also defined in Low E (0) to High E (5) order, so we need to map them
      for (let i = barre.startString; i <= barre.endString; i++) {
        // Map the string index from chord position notation to our tuning array indexing
        const actualStringIndex = 5-i;
        
        // Check if this position is already in the positions array
        const existingPos = positions.find(pos => 
          pos.string === actualStringIndex && pos.fret === barre.fret
        );
        
        // If not already in positions, add it
        if (!existingPos) {
          const openNote = tuning[actualStringIndex];
          const noteAtFret = getNoteAtFret(openNote, barre.fret);
          
          // Determine the role of this note in the chord
          let role = 'chord';
          if (noteAtFret === rootNote) {
            role = 'root';
          } else if (noteAtFret === chordNotes[1]) {
            role = 'third';
          } else if (noteAtFret === chordNotes[2]) {
            role = 'fifth';
          } else if (chordNotes[3] && noteAtFret === chordNotes[3]) {
            role = 'seventh';
          }
          
          positions.push({
            string: actualStringIndex,
            fret: barre.fret,
            note: noteAtFret,
            role: role,
            finger: 1 // Barre is always with index finger
          });
        }
      }
    });
    
    // Cache the results
    memoizationCache[cacheKey] = positions;
    
    return positions;
  }
  
  // Fallback: Find all occurrences of chord notes across the fretboard
  const positions: { string: number, fret: number, note: string, role: string }[] = [];
  
  tuning.forEach((stringNote, stringIndex) => {
    for (let fret = 0; fret <= frets; fret++) {
      const noteAtFret = getNoteAtFret(stringNote, fret);
      if (chordNotes.includes(noteAtFret)) {
        // Determine the note's role in the chord
        let role = 'chord';
        
        if (noteAtFret === rootNote) {
          role = 'root';
        } else if (noteAtFret === chordNotes[1]) {
          role = 'third';
        } else if (noteAtFret === chordNotes[2]) {
          role = 'fifth';
        } else {
          // Handle extended chord tones
          const noteIndex = chordNotes.indexOf(noteAtFret);
          if (noteIndex >= 3) {
            if (chordType.includes('seventh') || chordType.includes('7')) {
              role = 'seventh';
            } else if (chordType.includes('ninth') || chordType.includes('9')) {
              role = 'ninth';
            } else if (chordType.includes('eleventh') || chordType.includes('11')) {
              role = 'eleventh';
            } else if (chordType.includes('thirteenth') || chordType.includes('13')) {
              role = 'thirteenth';
            } else if (chordType.includes('sixth') || chordType.includes('6')) {
              role = 'sixth';
            }
          }
        }
        
        positions.push({
          string: stringIndex,
          fret: fret,
          note: noteAtFret,
          role: role
        });
      }
    }
  });
  
  // Cache the results
  memoizationCache[cacheKey] = positions;
  
  return positions;
}

/**
 * Generates a 2D boolean array indicating whether each position on the fretboard
 * is part of the given scale
 * @param scaleName The name of the scale (e.g., "C Major", "A Minor")
 * @param tuning The tuning array (from high to low strings)
 * @param frets The number of frets
 * @returns A 2D boolean array where true indicates the note is in the scale
 */
export function getScalePattern(scaleName: string, tuning = STANDARD_TUNING, frets = 24): boolean[][] {
  // Create a cache key for this pattern
  const cacheKey = `scalePattern:${scaleName}:${tuning.join(',')}:${frets}`;
  
  // Check if we already have this pattern calculated
  if (scalePatternCache[cacheKey]) {
    return scalePatternCache[cacheKey];
  }
  
  // If no scale is selected, return an array of false
  if (!scaleName) {
    const emptyPattern = Array(tuning.length).fill(null).map(() => Array(frets + 1).fill(false));
    return emptyPattern;
  }
  
  // Get the scale notes
  let scaleNotes = SCALES[scaleName as keyof typeof SCALES];
  
  // If the scale isn't in our predefined scales, try to parse it
  if (!scaleNotes) {
    // Extract root note and scale type (e.g., "C Major" -> "C" and "Major")
    const parts = scaleName.split(' ');
    if (parts.length >= 2) {
      const rootNote = parts[0];
      const scaleType = parts.slice(1).join(' ');
      
      // Find a similar scale in our database and transpose it
      const scaleKeys = Object.keys(SCALES);
      let templateScale = null;
      
      // Look for a scale with the same type
      for (const key of scaleKeys) {
        if (key.endsWith(scaleType)) {
          templateScale = key;
          break;
        }
      }
      
      if (templateScale) {
        const templateNotes = SCALES[templateScale as keyof typeof SCALES];
        const templateRoot = templateScale.split(' ')[0];
        
        // Transpose the template scale to the target root note
        scaleNotes = transposeScale(templateNotes, templateRoot, rootNote);
      }
    }
    
    // If we still don't have scale notes, return a default pattern
    if (!scaleNotes) {
      const emptyPattern = Array(tuning.length).fill(null).map(() => Array(frets + 1).fill(false));
      return emptyPattern;
    }
  }
  
  // Normalize scale notes to handle flats/sharps
  const normalizedScaleNotes = normalizeNotes(scaleNotes);
  
  // Create a 2D array indicating which positions are in the scale
  const pattern: boolean[][] = [];
  
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    const openNote = tuning[stringIndex];
    const stringPattern: boolean[] = [];
    
    for (let fret = 0; fret <= frets; fret++) {
      const noteAtFret = getNoteAtFret(openNote, fret);
      const normalizedNote = normalizeNote(noteAtFret);
      
      // Check if the note is in the scale
      stringPattern.push(normalizedScaleNotes.includes(normalizedNote));
    }
    
    pattern.push(stringPattern);
  }
  
  // Store in cache
  scalePatternCache[cacheKey] = pattern;
  
  return pattern;
}

/**
 * Transposes a scale from one root note to another
 * @param scaleNotes The original scale notes
 * @param fromRoot The original root note
 * @param toRoot The target root note
 * @returns The transposed scale notes
 */
function transposeScale(scaleNotes: string[], fromRoot: string, toRoot: string): string[] {
  // Normalize notes to handle flats/sharps
  const normalizedFromRoot = normalizeNote(fromRoot);
  const normalizedToRoot = normalizeNote(toRoot);
  
  // Calculate the interval between the roots
  const fromIndex = NOTES.indexOf(normalizedFromRoot);
  const toIndex = NOTES.indexOf(normalizedToRoot);
  
  if (fromIndex === -1 || toIndex === -1) {
    return scaleNotes; // Cannot transpose if roots are not recognized
  }
  
  const interval = (toIndex - fromIndex + 12) % 12;
  
  // Transpose each note in the scale
  return scaleNotes.map(note => {
    const normalizedNote = normalizeNote(note);
    const noteIndex = NOTES.indexOf(normalizedNote);
    
    if (noteIndex === -1) {
      return note; // Cannot transpose if note is not recognized
    }
    
    const newIndex = (noteIndex + interval) % 12;
    return NOTES[newIndex];
  });
}

/**
 * Normalizes a note to handle flats and sharps
 * @param note The note to normalize
 * @returns The normalized note
 */
function normalizeNote(note: string): string {
  // Use memoization for performance
  const cacheKey = `normalizeNote:${note}`;
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  let result = note;
  
  // Convert flats to equivalent sharps for consistency
  // This is a simplified approach and doesn't handle double flats/sharps
  if (note.includes('b')) {
    const noteWithoutFlat = note.replace('b', '');
    const noteIndex = NOTES.indexOf(noteWithoutFlat);
    
    if (noteIndex > 0) {
      result = NOTES[noteIndex - 1];
    } else if (noteIndex === 0) {
      result = NOTES[11]; // Special case: Cb -> B
    }
  }
  
  // If note has # or is a natural note, return as is if it's in our NOTES array
  if (NOTES.includes(note)) {
    result = note;
  }
  
  // For any other case, default to C (this is a fallback)
  if (!NOTES.includes(result)) {
    result = 'C';
  }
  
  // Cache the result
  memoizationCache[cacheKey] = result;
  
  return result;
}

/**
 * Normalizes an array of notes
 * @param notes The notes to normalize
 * @returns The normalized notes
 */
function normalizeNotes(notes: string[]): string[] {
  return notes.map(note => normalizeNote(note));
}

// Calculate frequency for a given note and octave
export function getNoteFrequency(note: string, octave: number): number {
  // Cache this calculation, as it's used frequently
  const cacheKey = `noteFreq:${note}:${octave}`;
  if (memoizationCache[cacheKey]) {
    return memoizationCache[cacheKey];
  }
  
  const A4 = 440;
  const A4Index = NOTES.indexOf('A') + (4 * 12);
  const noteIndex = NOTES.indexOf(note) + (octave * 12);
  const halfStepsFromA4 = noteIndex - A4Index;
  const frequency = A4 * Math.pow(2, halfStepsFromA4 / 12);
  
  // Cache the result
  memoizationCache[cacheKey] = frequency;
  
  return frequency;
}

// Convert frequency to the closest note
export function frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
  const A4 = 440;
  const halfStepRatio = Math.pow(2, 1/12);
  
  const halfStepsFromA4 = Math.round(12 * Math.log2(frequency / A4));
  const expectedFrequency = A4 * Math.pow(halfStepRatio, halfStepsFromA4);
  const cents = Math.round(1200 * Math.log2(frequency / expectedFrequency));
  
  const noteIndex = (NOTES.indexOf('A') + halfStepsFromA4) % 12;
  const octave = Math.floor((NOTES.indexOf('A') + halfStepsFromA4 + 9) / 12);
  
  return {
    note: NOTES[noteIndex < 0 ? noteIndex + 12 : noteIndex],
    octave,
    cents
  };
}

// Map of enharmonic equivalents (both directions)
export const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};

// Reset cache in development for hot module reloading
if (import.meta.env.DEV) {
  // Clear cache when module is hot reloaded
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      // Clear all caches when module is replaced
      Object.keys(memoizationCache).forEach((key) => {
        delete memoizationCache[key];
      });
      Object.keys(scalePatternCache).forEach((key) => {
        delete scalePatternCache[key];
      });
    });
  }
}