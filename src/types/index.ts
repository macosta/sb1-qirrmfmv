/**
 * Centralized type definitions for the Guitar God app
 */

// App state types
export type Mode = 'fretboard' | 'chords' | 'scales' | 'tuner' | 'metronome';
export type Theme = 'light' | 'dark';
export type FretMarker = 'notes' | 'degrees' | 'intervals' | 'none';
export type ScaleSystem = '3nps' | 'caged' | 'none' | 'degrees';
export type FretboardOrientation = 'standard' | 'flipped';
export type NoteColorMode = 'single' | 'multi';

// Guitar-related types
export interface Tuning {
  name: string;
  notes: string[];
  description?: string;
}

export interface ChordPosition {
  fretStart: number;
  fingerings: (number | null)[];
  barres: { fret: number; startString: number; endString: number }[];
  position: string;
  notes: string[];
}

export interface ChordDefinition {
  notes: string[];
  positions?: ChordPosition[];
  category?: 'Major' | 'Minor' | 'Dominant' | 'Diminished' | 'Augmented' | 'Suspended' | 'Power';
  description?: string;
}

export interface ScaleDefinition {
  notes: string[];
  type: string;
  modeOf?: string;
  description?: string;
}

export interface ScaleInfo {
  name: string;
  notes: string[];
  type: string;
  description: string;
  commonChords: string[];
  modes?: string[];
}

// UI-related types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export interface NoteDisplayProps {
  note: string;
  isRoot: boolean;
  degree?: string;
  interval?: string;
  fretMarkers?: FretMarker;
}

export interface NoteMarkerStyle {
  backgroundColor: string;
  color: string;
  border: string;
  boxShadow?: string;
}

// Audio-related types
export interface NoteInfo {
  note: string; 
  octave: number; 
  cents: number;
}

// Store state
export interface GuitarState {
  // App state
  mode: Mode;
  theme: Theme;
  showNotesBar: boolean;
  
  // Guitar configuration
  tuning: string[];
  numFrets: number;
  visibleFrets: number;
  activeString: number | null;
  activeFret: number | null;
  fretboardOrientation: FretboardOrientation;
  
  // Display options
  fretMarkers: FretMarker;
  showTriads: boolean;
  showChords: boolean;
  showAllNotes: boolean;
  showRoot: boolean;
  
  // Note visualization options
  noteColorMode: NoteColorMode;
  noteColor: string;
  
  // Music theory
  selectedNote: string | null;
  selectedScale: string | null;
  selectedChord: string | null;
  scaleSystem: ScaleSystem;
  
  // Active selection state
  hasActiveSelection: boolean;
  
  // Function actions
  setMode: (mode: Mode) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setTuning: (tuning: string[]) => void;
  setNumFrets: (numFrets: number) => void;
  setVisibleFrets: (frets: number) => void;
  setActiveString: (string: number | null) => void;
  setActiveFret: (fret: number | null) => void;
  playNote: (string: number, fret: number) => void;
  setFretMarkers: (markers: FretMarker) => void;
  setSelectedNote: (note: string) => void;
  setSelectedScale: (scale: string) => void;
  setSelectedChord: (chord: string) => void;
  setScaleSystem: (system: ScaleSystem) => void;
  toggleShowTriads: () => void;
  toggleShowAllNotes: () => void;
  toggleShowRoot: () => void;
  setHasActiveSelection: (active: boolean) => void;
  setFretboardOrientation: (orientation: FretboardOrientation) => void;
  toggleFretboardOrientation: () => void;
  setNoteColorMode: (mode: NoteColorMode) => void;
  setNoteColor: (color: string) => void;
  setShowNotesBar: (show: boolean) => void;
  toggleShowNotesBar: () => void;
}