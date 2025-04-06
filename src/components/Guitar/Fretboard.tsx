import React, { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { cn, getFretboardNotes, getScalePattern, CHORDS, SCALES, getNoteAtFret, getScaleDegree, getIntervalName, getAllChordPositions, STANDARD_TUNING } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import { useStringAudio } from '../../hooks/useAudio';
import { Play, Pause, Minus, Plus, Music, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import FretboardDisplayModal, { noteColorMap } from '../UI/FretboardDisplayModal';
import { InteractiveHoverButton } from '../UI/InteractiveHoverButton';
import { InteractiveScalesButton } from '../UI/InteractiveScalesButton';
import { ToggleGroup, ToggleGroupItem } from '../UI/ToggleGroup';
import FretboardNoteDisplay from '../UI/FretboardNoteDisplay';
import { shouldShowNote, getNoteMarkerStyle, getTuningNoteColor } from './FretboardUtils';
import { useMobileDetection } from '../../hooks/useMediaQuery';
import { useDebounce } from '../../hooks/useDebounce';
import './fretboard.css';

interface FretboardProps {
  className?: string;
  showChords?: boolean;
  setShowChords?: (show: boolean) => void;
  setChordInfo?: (info: { name: string | null; type: 'Major' | 'Minor' | 'Chord'; positions: any[] }) => void;
}

const Fretboard: React.FC<FretboardProps> = memo(({ 
  className, 
  showChords: externalShowChords, 
  setShowChords: externalSetShowChords,
  setChordInfo
}) => {
  const { 
    tuning, 
    numFrets, 
    visibleFrets,
    setVisibleFrets,
    showTriads,
    toggleShowTriads,
    toggleShowAllNotes,
    toggleShowRoot,
    fretMarkers,
    showAllNotes,
    showRoot,
    selectedScale,
    selectedNote,
    selectedChord,
    setFretMarkers,
    hasActiveSelection,
    scaleSystem,
    setScaleSystem,
    playNote,
    fretboardOrientation,
    setFretboardOrientation,
    setSelectedNote,
    setSelectedScale,
    setSelectedChord,
    noteColorMode,
    noteColor,
  } = useGuitarStore();
  
  const { playString } = useStringAudio();
  const [fretModalOpen, setFretModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugOverlay, setShowDebugOverlay] = useState(false);
  
  // Use internal state if no external control is provided
  const [internalShowChords, setInternalShowChords] = useState(false);
  const showChords = externalShowChords ?? internalShowChords;
  const setShowChords = externalSetShowChords ?? setInternalShowChords;
  
  // State to detect mobile view
  const isMobile = useMobileDetection();
  const [fretboardVertical, setFretboardVertical] = useState(false);
  
  // Define standardTuning from the imported STANDARD_TUNING
  const standardTuning = STANDARD_TUNING;
  
  // Update fretboard vertical state based on mobile detection
  useEffect(() => {
    setFretboardVertical(isMobile);
  }, [isMobile]);

  // Debounced note selection for better performance
  const debouncedSelectedNote = useDebounce(selectedNote, 100);
  
  // Debug when props or state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("[Fretboard] State/props update:", { 
        showChords, 
        externalShowChords, 
        internalShowChords,
        selectedNote,
        selectedChord,
        selectedScale,
        isMobile,
        fretboardVertical
      });
    }
  }, [showChords, externalShowChords, internalShowChords, selectedNote, selectedChord, selectedScale, isMobile, fretboardVertical]);
  
  // Update internal chord display state when a chord is selected
  useEffect(() => {
    if (selectedChord && !showChords) {
      console.log("[Fretboard] Auto-enabling chord display mode due to chord selection");
      setInternalShowChords(true);
    }
  }, [selectedChord, showChords]);
  
  // Calculate fretboard notes - ensuring this calculation is done properly
  const fretboardNotes = useMemo(() => {
    return getFretboardNotes(tuning, numFrets);
  }, [tuning, numFrets]);
  
  // Calculate scale pattern if a scale is selected
  const scalePattern = useMemo(() => {
    return getScalePattern(selectedScale, tuning, numFrets);
  }, [selectedScale, tuning, numFrets]);
  
  // Generate chord positions for the selected note or chord
  const chordPositions = useMemo(() => {
    if ((!selectedNote && !selectedChord) || !showChords) return [];
    
    if (selectedChord) {
      return getAllChordPositions(selectedChord, tuning, numFrets);
    } else if (selectedNote) {
      // Build chord name - try major first, then minor if needed
      const majorChordName = `${selectedNote} Major`;
      const minorChordName = `${selectedNote} Minor`;
      
      if (CHORDS[majorChordName as keyof typeof CHORDS]) {
        return getAllChordPositions(majorChordName, tuning, numFrets);
      } else if (CHORDS[minorChordName as keyof typeof CHORDS]) {
        return getAllChordPositions(minorChordName, tuning, numFrets);
      }
    }
    
    return [];
  }, [selectedNote, selectedChord, tuning, numFrets, showChords]);
  
  // Get the chord notes as an array for filtering
  const chordNotes = useMemo(() => {
    if ((!selectedNote && !selectedChord) || !showChords) return [];
    
    // If a specific chord is selected, use its notes
    if (selectedChord && CHORDS[selectedChord as keyof typeof CHORDS]) {
      return CHORDS[selectedChord as keyof typeof CHORDS];
    }
    
    // Otherwise build chord name from selected note
    if (selectedNote) {
      const majorChordName = `${selectedNote} Major`;
      const minorChordName = `${selectedNote} Minor`;
      
      // Check if the chord exists in our database and get its notes
      if (CHORDS[majorChordName as keyof typeof CHORDS]) {
        return CHORDS[majorChordName as keyof typeof CHORDS];
      } else if (CHORDS[minorChordName as keyof typeof CHORDS]) {
        return CHORDS[minorChordName as keyof typeof CHORDS];
      }
    }
    
    return [];
  }, [selectedNote, selectedChord, showChords]);
  
  // Update parent state when needed
  React.useEffect(() => {
    if (setChordInfo && showChords && chordPositions.length > 0) {
      // Determine if it's a major or minor chord
      let chordType: 'Major' | 'Minor' | 'Chord' = 'Chord';
      let chordName = selectedNote;
      
      if (selectedChord) {
        const parts = selectedChord.split(' ');
        chordName = parts[0];
        if (selectedChord.includes('Major')) {
          chordType = 'Major';
        } else if (selectedChord.includes('Minor')) {
          chordType = 'Minor';
        }
      } else if (selectedNote) {
        // Build chord name
        const majorChordName = `${selectedNote} Major`;
        const minorChordName = `${selectedNote} Minor`;
        
        // Check if the chord exists in our database
        if (CHORDS[majorChordName as keyof typeof CHORDS]) {
          chordType = 'Major';
        } else if (CHORDS[minorChordName as keyof typeof CHORDS]) {
          chordType = 'Minor';
        }
      }
      
      setChordInfo({
        name: chordName,
        type: chordType,
        positions: chordPositions
      });
    }
  }, [chordPositions, selectedNote, selectedChord, showChords, setChordInfo]);
  
  // Update debug info when selections change
  useEffect(() => {
    if (showDebugOverlay) {
      updateGlobalDebugInfo();
    }
  }, [selectedNote, selectedScale, selectedChord, showChords, showTriads, showAllNotes, showRoot]);
  
  // Update global state debug info
  const updateGlobalDebugInfo = useCallback(() => {
    const selectedChordType = selectedChord 
      ? (selectedChord.includes('Major') ? 'Major' : selectedChord.includes('Minor') ? 'Minor' : 'Other') 
      : null;
    
    const selectedScaleType = selectedScale
      ? selectedScale.split(' ').slice(1).join(' ')
      : null;
    
    const currentNotes = (() => {
      if (selectedChord && CHORDS[selectedChord as keyof typeof CHORDS]) {
        return CHORDS[selectedChord as keyof typeof CHORDS];
      } else if (selectedScale && SCALES[selectedScale as keyof typeof SCALES]) {
        return SCALES[selectedScale as keyof typeof SCALES];
      } else if (selectedNote) {
        return [selectedNote];
      }
      return [];
    })();
    
    setDebugInfo({
      type: 'global',
      state: {
        selectedNote,
        selectedChord,
        selectedChordType,
        selectedScale,
        selectedScaleType,
        chordNotes: chordNotes,
        currentlyVisibleNotes: currentNotes,
        displayOptions: {
          showChords,
          showTriads,
          showAllNotes,
          showRoot,
          fretMarkers,
          hasActiveSelection,
          scaleSystem,
          noteColorMode,
          noteColor
        },
        chordPositions: chordPositions.slice(0, 5), // Limit to first 5 to avoid overflow
        visibleFrets,
        fretboardOrientation,
        tuning,
        isMobile,
        fretboardVertical
      }
    });
  }, [
    selectedNote, selectedChord, selectedScale, chordNotes, 
    showChords, showTriads, showAllNotes, showRoot, fretMarkers,
    hasActiveSelection, scaleSystem, visibleFrets, 
    fretboardOrientation, tuning, chordPositions, noteColorMode, noteColor,
    isMobile, fretboardVertical
  ]);
  
  const handleFretClick = useCallback((stringIndex: number, fretIndex: number) => {
    // Get the note at this fret position for debug display
    const openNote = tuning[stringIndex];
    const noteAtFret = getNoteAtFret(openNote, fretIndex);
    
    // Play the note
    playNote(stringIndex, fretIndex);
    playString(stringIndex, fretIndex);
    
    // Calculate whether this note is in scale/chord
    const isInScale = selectedScale ? (
      fretIndex === 0 
        ? scalePattern[stringIndex][0] 
        : scalePattern[stringIndex][fretIndex]
    ) : false;
    
    const isInChord = chordNotes.includes(noteAtFret);
    const inChordPosition = chordPositions.some(pos => 
      pos.string === stringIndex && pos.fret === fretIndex
    );
    
    // Enhanced debug info for note interactions
    if (showDebugOverlay) {
      const displayStringIndex = fretboardOrientation === 'standard' ? 5 - stringIndex : stringIndex;

      // Update the debug info with detailed information
      setDebugInfo({
        type: 'note',
        stringInfo: {
          displayStringIndex: displayStringIndex, // Visual position (0-5)
          actualStringIndex: stringIndex, // Actual index in tuning array
          openNote: tuning[stringIndex], // Note when string is played open
          stringThickness: displayStringIndex >= 3 ? 'bass' : 'treble'
        },
        tuningColumn: {
          note: openNote,
          isRoot: openNote === selectedNote,
          shouldHighlight: openNote === selectedNote,
          style: {
            backgroundColor: 'rgb(100, 100, 100)',
            color: 'white',
            fontFamily: "'Oswald', sans-serif"
          }
        },
        noteInfo: {
          note: noteAtFret, // The actual note at this fret
          fret: fretIndex,
          isOpenNote: fretIndex === 0,
          openNoteValue: tuning[stringIndex]
        },
        musicTheory: {
          selectedRoot: selectedNote,
          degree: selectedNote ? getScaleDegree(noteAtFret, selectedNote) : null,
          interval: selectedNote ? getIntervalName(noteAtFret, selectedNote) : null
        },
        scaleInfo: {
          selectedScale: selectedScale,
          inScale: isInScale,
          scalePattern: selectedScale ? `Pattern at this position: ${isInScale ? 'Yes' : 'No'}` : 'No scale selected'
        },
        chordInfo: {
          selectedChord: selectedChord,
          showChords: showChords,
          isInChord: isInChord,
          chordNotes: chordNotes,
          inChordPosition: inChordPosition
        },
        displayLogic: {
          shouldShow: shouldShowNote(noteAtFret, isInScale, stringIndex, fretIndex, {
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
          }),
          visibilityReason: "Using FretboardUtils.shouldShowNote logic"
        }
      });
    }
  }, [
    playNote, playString, tuning, selectedScale, scalePattern, 
    chordNotes, chordPositions, showChords, showTriads, 
    fretboardOrientation, selectedNote, selectedChord, 
    showDebugOverlay, hasActiveSelection, showAllNotes, showRoot
  ]);

  // Handler for interval/degree/note display
  const formatNote = useCallback((note: string) => {
    if (!selectedNote) return (
      <FretboardNoteDisplay 
        note={note} 
        isRoot={false} 
        fretMarkers={fretMarkers}
      />
    );
    
    if (fretMarkers === 'none') return null;
    
    return (
      <FretboardNoteDisplay 
        note={note} 
        isRoot={note === selectedNote}
        fretMarkers={fretMarkers}
        degree={getScaleDegree(note, selectedNote)}
        interval={getIntervalName(note, selectedNote)} 
      />
    );
  }, [fretMarkers, selectedNote]);
  
  // Mock note selection for debug purposes
  const handleDebugNoteSelect = useCallback((note: string) => {
    setSelectedNote(note);
    setSelectedScale('');
    setSelectedChord('');
    if (showDebugOverlay) {
      updateGlobalDebugInfo();
    }
  }, [setSelectedNote, setSelectedScale, setSelectedChord, showDebugOverlay, updateGlobalDebugInfo]);
  
  // Render debug note selection row for testing
  const renderDebugNoteSelector = useCallback(() => {
    if (!showDebugOverlay) return null;
    
    const debugNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    return (
      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mb-4">
        <div className="text-sm font-bold mb-2">Debug: Select Root Note</div>
        <div className="flex gap-2">
          {debugNotes.map(note => (
            <button 
              key={note}
              className={cn(
                "px-3 py-1 rounded",
                note === selectedNote 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 dark:bg-gray-700"
              )}
              onClick={() => handleDebugNoteSelect(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
    );
  }, [showDebugOverlay, selectedNote, handleDebugNoteSelect]);
  
  // Zoom in/out handlers for mobile
  const handleZoomIn = useCallback(() => {
    if (visibleFrets > 4) {
      setVisibleFrets(visibleFrets - 2);
    }
  }, [visibleFrets, setVisibleFrets]);

  const handleZoomOut = useCallback(() => {
    if (visibleFrets < numFrets) {
      setVisibleFrets(Math.min(visibleFrets + 2, numFrets));
    }
  }, [visibleFrets, numFrets, setVisibleFrets]);
  
  return (
    <div className={cn("relative w-full", className)}>
      {/* Debug Overlay */}
      {showDebugOverlay && debugInfo && (
        <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 max-w-md overflow-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">
              {debugInfo.type === 'note' ? 'Note Debug Info' : 'Global State Debug'}
            </h3>
            <button 
              onClick={() => setShowDebugOverlay(false)}
              className="p-1 bg-red-500/50 hover:bg-red-500 rounded-full"
              aria-label="Close debug overlay"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
            </button>
          </div>
          
          {renderDebugNoteSelector()}
          
          <div className="text-xs overflow-y-auto pr-2 max-h-[60vh]">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {/* Responsive Fretboard Container */}
      <div className={cn(
        "relative bg-black rounded-lg overflow-hidden",
        fretboardVertical && "fretboard-container vertical-fretboard-container"
      )}>
        <div className={cn(
          "overflow-x-auto",
          fretboardVertical && "fretboard-scroll-container"
        )}>
          <div className="w-full min-w-[320px] lg:min-w-0">
            <div className={cn(
              "fretboard-wrapper slim-fretboard",
              fretboardVertical && "vertical-fretboard"
            )}>
              {/* Top fret numbers */}
              <div className="flex h-5 bg-black border-b border-gray-700" role="row" aria-hidden="true">
                <div className="w-10 flex-shrink-0">
                  {/* Nut indicator */}
                  <div className="h-full flex justify-center items-center text-gray-500 text-xs">
                    Nut
                  </div>
                </div>
                
                {/* Fret numbers */}
                {Array.from({ length: visibleFrets }).map((_, i) => (
                  <div key={i} className="fret-cell flex justify-center items-center text-gray-400 text-xs" role="columnheader">
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Fretboard background - appears behind everything */}
              <div className="relative">
                <div className="fretboard-background"></div>
                
                {/* Strings and fret positions */}
                <div className="flex flex-col" role="rowgroup">
                  {standardTuning.map((openNote, stringIndex) => {
                    // Map string index to the corresponding index in the tuning array
                    // This is the critical fix: use the correct string index for each tuning orientation
                    const actualStringIndex = fretboardOrientation === 'standard'
                      ? 5 - stringIndex  // For standard orientation (high E to low E display)
                      : stringIndex;     // For flipped orientation (low E to high E display)
                    
                    // Set string thickness and color based on string type
                    const isBassTuning = fretboardOrientation === 'standard'
                      ? stringIndex >= 3  // Standard: bottom 3 strings (D, A, E)
                      : stringIndex <= 2; // Flipped: top 3 strings (E, A, D)
                    
                    const stringThickness = isBassTuning ? 1.8 : 1.2;
                    
                    const stringColor = isBassTuning
                      ? 'linear-gradient(to bottom, rgba(200, 150, 80, 0.7), rgba(220, 170, 100, 0.9), rgba(200, 150, 80, 0.7))'
                      : 'linear-gradient(to bottom, rgba(192, 192, 192, 0.7), rgba(220, 220, 220, 0.9), rgba(192, 192, 192, 0.7))';
                    
                    // Get tuning note color based on context
                    const tuningNoteColor = getTuningNoteColor(openNote, {
                      selectedNote,
                      selectedChord,
                      selectedScale,
                      showChords,
                      chordNotes,
                      scales: SCALES,
                      noteColorMode,
                      noteColor,
                      noteColorMap
                    });
                    
                    const isRoot = openNote === selectedNote;
                    
                    return (
                      <div key={stringIndex} className="string-row" role="row" aria-label={`${openNote} string`}>
                        {/* Tuning note */}
                        <div 
                          className="tuning-column"
                          onClick={() => {
                            handleFretClick(actualStringIndex, 0);
                          }}
                          role="cell"
                          aria-label={`Open ${openNote} string`}
                        >
                          <div 
                            className="w-7 h-7 rounded-full flex justify-center items-center font-bold text-sm shadow-md"
                            style={{ 
                              backgroundColor: tuningNoteColor,
                              color: isRoot ? 'black' : 'white',
                              border: isRoot ? '2px solid #ff0000' : 'none',
                              boxShadow: isRoot ? '0 0 5px #ff0000' : 'none',
                              fontFamily: "'Oswald', sans-serif"
                            }}
                          >
                            {openNote}
                          </div>
                        </div>
                        
                        {/* Fret grid with string line */}
                        <div className="fret-grid" role="gridcell">
                          {/* Horizontal string line - positioned in the middle */}
                          <div 
                            className="string-line"
                            style={{ 
                              height: `${stringThickness}px`,
                              background: stringColor,
                              boxShadow: '0 0 2px rgba(255, 255, 255, 0.3)'
                            }}
                          />
                          
                          {/* Fret lines */}
                          <div className="fret-cells-container">
                            {Array.from({ length: visibleFrets }).map((_, i) => {
                              // Get the fret number (1-based)
                              const fretNumber = i + 1;
                              
                              return (
                                <div key={i} className="fret-position relative" role="gridcell" aria-colindex={i + 1}>
                                  {/* Fret wire - right edge of each fret position */}
                                  {i < visibleFrets - 1 && (
                                    <div 
                                      className="fret-wire"
                                      style={{
                                        right: 0,
                                        boxShadow: '0 0 1px rgba(255, 255, 255, 0.4)'
                                      }}
                                      aria-hidden="true"
                                    />
                                  )}
                                  
                                  {/* Click area covering the full fret space */}
                                  <div 
                                    className="absolute inset-0 cursor-pointer hover:bg-gray-900/30"
                                    onClick={() => {
                                      handleFretClick(actualStringIndex, fretNumber);
                                    }}
                                    aria-label={`${openNote} string, fret ${fretNumber}`}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        handleFretClick(actualStringIndex, fretNumber);
                                      }
                                    }}
                                  />
                                  
                                  {/* Note visualization */}
                                  {(() => {
                                    // Get the correct open note for this string
                                    const openStringNote = tuning[actualStringIndex];

                                    // Calculate the note at this fret position using the correct string note
                                    const note = getNoteAtFret(openStringNote, fretNumber);
                                    
                                    const isInScale = selectedScale ? scalePattern[actualStringIndex][fretNumber] : false;
                                    
                                    // Use the utility functions for note display logic
                                    const shouldShow = shouldShowNote(note, isInScale, actualStringIndex, fretNumber, {
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
                                    });
                                    
                                    const markerStyle = getNoteMarkerStyle(note, isInScale, {
                                      selectedNote,
                                      selectedChord,
                                      selectedScale,
                                      showChords,
                                      chordNotes,
                                      hasActiveSelection,
                                      noteColorMode,
                                      noteColor,
                                      noteColorMap
                                    });

                                    return (
                                      shouldShow && markerStyle && (
                                        <div 
                                          className="note-marker"
                                          style={{ 
                                            backgroundColor: markerStyle.backgroundColor,
                                            color: markerStyle.color,
                                            border: markerStyle.border,
                                            boxShadow: markerStyle.boxShadow
                                          }}
                                          aria-label={`${note} note`}
                                        >
                                          {formatNote(note)}
                                        </div>
                                      )
                                    );
                                  })()}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Bottom fret markers */}
              <div className="flex h-5 bg-black" role="row" aria-hidden="true">
                <div className="w-10 flex-shrink-0" />
                
                {Array.from({ length: visibleFrets }).map((_, i) => (
                  <div key={i} className="fret-cell flex justify-center items-center">
                    {markerPositions.includes(i + 1) && (
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    )}
                    {(i + 1) === 12 && (
                      <div className="w-2 h-2 rounded-full bg-gray-600 ml-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile zoom controls */}
        {isMobile && (
          <div className="mobile-zoom-controls">
            <button 
              className="mobile-zoom-btn"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              className="mobile-zoom-btn"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Fretboard Display Modal */}
      <FretboardDisplayModal 
        open={fretModalOpen} 
        onOpenChange={(open) => setFretModalOpen(open)}
      />
    </div>
  );
});

Fretboard.displayName = 'Fretboard';

// Standard marker positions
const markerPositions = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

export default Fretboard;