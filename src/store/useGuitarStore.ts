import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STANDARD_TUNING } from '../lib/utils';
import { 
  Mode, 
  Theme, 
  FretMarker, 
  ScaleSystem, 
  FretboardOrientation, 
  NoteColorMode,
  GuitarState
} from '../types';

// Function to detect system color scheme preference
const getSystemThemePreference = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const useGuitarStore = create<GuitarState>()(
  persist(
    (set) => ({
      // Default state
      mode: 'fretboard',
      theme: getSystemThemePreference(),
      tuning: STANDARD_TUNING,
      numFrets: 24,
      visibleFrets: 24,
      activeString: null,
      activeFret: null,
      fretboardOrientation: 'standard',
      fretMarkers: 'notes',
      showTriads: false,
      showChords: false,
      showAllNotes: true,
      showRoot: true,
      showFingers: true,
      selectedNote: '',
      selectedScale: '',
      selectedChord: '',
      scaleSystem: 'none',
      hasActiveSelection: true,
      noteColorMode: 'single',
      noteColor: '#4CAF50', // Default green color
      showNotesBar: true,
      
      // Actions
      setMode: (mode) => set({ mode }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
      setTuning: (tuning) => set({ tuning }),
      setNumFrets: (numFrets) => set({ numFrets }),
      setVisibleFrets: (visibleFrets) => set({ visibleFrets }),
      setActiveString: (activeString) => set({ activeString }),
      setActiveFret: (activeFret) => set({ activeFret }),
      playNote: (string, fret) => {
        set({ activeString: string, activeFret: fret });
        setTimeout(() => set({ activeString: null, activeFret: null }), 500);
      },
      setFretMarkers: (fretMarkers) => set({ fretMarkers }),
      setSelectedNote: (note) => set({ 
        selectedNote: note,
        hasActiveSelection: true,
        selectedScale: '',
        selectedChord: '',
        mode: 'fretboard'
      }),
      setSelectedScale: (scale) => set({ 
        selectedScale: scale,
        hasActiveSelection: true,
        showChords: false,
        selectedNote: scale ? scale.split(' ')[0] : '',
        selectedChord: '',
        mode: 'fretboard'
      }),
      setSelectedChord: (chord) => set({ 
        selectedChord: chord,
        hasActiveSelection: chord !== '',
        showChords: true,
        selectedNote: chord ? chord.split(' ')[0] : '',
        selectedScale: '',
        mode: 'fretboard'
      }),
      setScaleSystem: (scaleSystem) => set({ scaleSystem }),
      toggleShowTriads: () => set((state) => ({ showTriads: !state.showTriads })),
      toggleShowAllNotes: () => set((state) => ({ showAllNotes: !state.showAllNotes })),
      toggleShowRoot: () => set((state) => ({ showRoot: !state.showRoot })),
      toggleShowFingers: () => set((state) => ({ showFingers: !state.showFingers })),
      setHasActiveSelection: (hasActiveSelection) => set({ hasActiveSelection }),
      setFretboardOrientation: (orientation) => set({ fretboardOrientation: orientation }),
      toggleFretboardOrientation: () => set((state) => ({
        fretboardOrientation: state.fretboardOrientation === 'standard' ? 'flipped' : 'standard'
      })),
      setNoteColorMode: (noteColorMode) => set({ noteColorMode }),
      setNoteColor: (noteColor) => set({ noteColor }),
      setShowNotesBar: (showNotesBar) => set({ showNotesBar }),
      toggleShowNotesBar: () => set((state) => ({ showNotesBar: !state.showNotesBar })),
    }),
    {
      name: 'guitar-maestro-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        visibleFrets: state.visibleFrets,
        fretboardOrientation: state.fretboardOrientation,
        showChords: state.showChords,
        noteColorMode: state.noteColorMode,
        noteColor: state.noteColor,
        showNotesBar: state.showNotesBar,
        showFingers: state.showFingers
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on page load
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);

export default useGuitarStore;