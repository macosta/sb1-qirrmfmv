import { NOTES, getNoteAtFret, CHORDS } from '../../lib/utils';

// Type for note marker styling
export interface NoteMarkerStyle {
  backgroundColor: string;
  color: string;
  border: string;
  boxShadow?: string;
}

/**
 * Determines whether a note should be displayed on the fretboard
 */
export function shouldShowNote(
  note: string,
  isInScale: boolean,
  stringIndex: number,
  fretIndex: number,
  options: {
    selectedNote: string | null;
    selectedScale: string | null;
    selectedChord: string | null;
    chordNotes: string[];
    chordPositions: { string: number; fret: number; note?: string; role?: string }[];
    showChords: boolean;
    showTriads: boolean;
    hasActiveSelection: boolean;
    showAllNotes: boolean;
    showRoot: boolean;
    tuning: string[];
  }
): boolean {
  const { 
    selectedNote, 
    selectedScale, 
    selectedChord, 
    chordNotes, 
    chordPositions, 
    showChords, 
    showTriads, 
    hasActiveSelection, 
    showAllNotes, 
    showRoot, 
    tuning 
  } = options;

  const isInChord = chordNotes.includes(note);
  const inChordPosition = chordPositions.some(pos => 
    pos.string === stringIndex && pos.fret === fretIndex
  );
  
  // Get the actual note at this position (important for open strings)
  const actualNote = fretIndex === 0 ? tuning[stringIndex] : note;
  const isRoot = actualNote === selectedNote;

  // If showing chords, we need special handling
  if (showChords) {
    // For open strings or fretted positions, check if the note is in the chord
    if (fretIndex === 0 ? !chordNotes.includes(tuning[stringIndex]) : !isInChord) {
      return false; // Not in chord, don't show
    }

    // If showTriads is enabled, only show notes that are part of chord positions
    if (showTriads) {
      return inChordPosition;
    }
    
    // If showTriads is disabled or undefined, show all occurrences of chord notes
    return true;
  }
  
  // If no active selection, don't show any notes
  if (!hasActiveSelection) return false;
  
  // If a specific note is selected and this is that note (including open strings)
  if (selectedNote && !selectedScale && !showChords) {
    // For open strings, compare the open string note directly
    if (fretIndex === 0) {
      return showAllNotes || tuning[stringIndex] === selectedNote;
    }
    // For fretted positions
    if (note === selectedNote) return true;
    return showAllNotes;
  }
  
  // If a scale is selected, show notes according to scale settings
  if (selectedScale) {
    return isInScale;
  }
  
  // Default fallback - this uses showAllNotes from the store
  return showAllNotes || (isRoot && showRoot);
}

/**
 * Gets a style object for a note marker based on the note and context
 */
export function getNoteMarkerStyle(
  note: string,
  isInScale: boolean,
  options: {
    selectedNote: string | null;
    selectedChord: string | null;
    selectedScale: string | null;
    showChords: boolean;
    chordNotes: string[];
    hasActiveSelection: boolean;
    noteColorMode: 'single' | 'multi';
    noteColor: string;
    noteColorMap: Record<string, string>;
  }
): NoteMarkerStyle | null {
  const { 
    selectedNote, 
    selectedChord,
    selectedScale,
    showChords, 
    chordNotes, 
    hasActiveSelection,
    noteColorMode,
    noteColor,
    noteColorMap
  } = options;

  const isRoot = note === selectedNote;
  
  // If showing chords, style appropriately
  if (showChords && chordNotes.length > 0) {
    if (!chordNotes.includes(note)) {
      return null; // Don't show non-chord notes
    }
    
    const isChordRoot = note === selectedNote || (selectedChord && chordNotes[0] === note);
    
    if (isChordRoot) {
      return {
        backgroundColor: 'rgb(255, 255, 255)', // White for root
        color: 'black',
        border: '2px solid #ff0000',
        boxShadow: '0 0 5px #ff0000'
      };
    }
    
    // Other chord tones - different colors based on function
    const isThird = chordNotes[1] === note;
    const isFifth = chordNotes[2] === note;
    const isSeventh = chordNotes.length > 3 && chordNotes[3] === note;
    
    // In multi-color mode, use note-specific colors
    if (noteColorMode === 'multi') {
      return {
        backgroundColor: noteColorMap[note] || (isThird ? '#4CAF50' : isFifth ? '#2196F3' : '#FF9800'),
        color: 'white',
        border: 'none'
      };
    }
    
    // In single-color mode, use different shades of the selected color
    if (noteColorMode === 'single') {
      // For single color mode, use the selected color for all chord tones
      return {
        backgroundColor: noteColor,
        color: 'white',
        border: 'none'
      };
    }
    
    // Fallback to traditional chord function colors if needed
    if (isThird) {
      return {
        backgroundColor: '#4CAF50', // Green for thirds
        color: 'white',
        border: 'none'
      };
    } else if (isFifth) {
      return {
        backgroundColor: '#2196F3', // Blue for fifths
        color: 'white',
        border: 'none'
      };
    } else if (isSeventh) {
      return {
        backgroundColor: '#9C27B0', // Purple for sevenths
        color: 'white',
        border: 'none'
      };
    } else {
      return {
        backgroundColor: '#FF9800', // Orange for other extensions
        color: 'white',
        border: 'none'
      };
    }
  }
  
  // If no active selection, don't show any notes
  if (!hasActiveSelection && !selectedNote && !selectedScale) {
    return {
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'black',
      border: 'none'
    };
  }
  
  // For scale notes or individual note display
  if (isRoot) {
    return {
      backgroundColor: 'rgb(255, 255, 255)', // White for root
      color: 'black',
      border: '2px solid #ff0000',
      boxShadow: '0 0 5px #ff0000'
    };
  }
  
  if (isInScale) {
    return {
      backgroundColor: noteColorMode === 'multi' ? noteColorMap[note] || '#4CAF50' : noteColor,
      color: 'white',
      border: 'none'
    };
  }
  
  // Default note style
  return {
    backgroundColor: 'white',
    color: 'black',
    border: 'none'
  };
}

/**
 * Gets a nice color for a tuning note based on context
 */
export function getTuningNoteColor(
  note: string,
  options: {
    selectedNote: string | null;
    selectedChord: string | null;
    selectedScale: string | null;
    showChords: boolean;
    chordNotes: string[];
    scales: Record<string, string[]>;
    noteColorMode: 'single' | 'multi';
    noteColor: string;
    noteColorMap: Record<string, string>;
  }
): string {
  const { 
    selectedNote, 
    selectedChord, 
    selectedScale, 
    showChords, 
    chordNotes, 
    scales,
    noteColorMode, 
    noteColor,
    noteColorMap
  } = options;
  
  // Check if note is the root or in chord/scale
  const isRoot = note === selectedNote;
  const isInChord = showChords && chordNotes.includes(note);
  const isInScale = selectedScale && scales[selectedScale]?.includes(note);
  
  // If it's the root note, always return white
  if (isRoot) {
    return 'rgb(255, 255, 255)';
  }
  
  // For chord or scale notes, use the appropriate color based on mode
  if ((showChords && isInChord) || (selectedScale && isInScale)) {
    return noteColorMode === 'multi' ? noteColorMap[note] || '#4CAF50' : noteColor;
  }

  return 'rgb(100, 100, 100)'; // Default color for other notes
}