import React, { useMemo, useState, useCallback, useEffect, memo } from 'react';
import { cn, getFretboardNotes, getScalePattern, CHORDS, SCALES, getNoteAtFret, getScaleDegree, getIntervalName, getAllChordPositions, STANDARD_TUNING, getChordPositionsWithFingerings } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import { useStringAudio } from '../../hooks/useAudio';
import { Play, Pause, Minus, Plus, Music, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import FretboardDisplayModal, { noteColorMap } from '../UI/FretboardDisplayModal';
import { InteractiveHoverButton } from '../UI/InteractiveHoverButton';
import { InteractiveScalesButton } from '../UI/InteractiveScalesButton';
import { ToggleGroup, ToggleGroupItem } from '../UI/ToggleGroup';
import FretboardNoteDisplay from '../UI/FretboardNoteDisplay';
import { shouldShowNote, getNoteMarkerStyle, getTuningNoteColor, getFingerForPosition, getFingerColor, getFingerFromFingerings } from './FretboardUtils';
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
    showFingers,
    toggleShowFingers
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
    if (import.meta.env.DEV) {
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

  // Get fingering positions for current chord
  const fingerPositions = useMemo(() => {
    if (!selectedChord || !showChords || !showFingers) return [];
    return getChordPositionsWithFingerings(selectedChord);
  }, [selectedChord, showChords, showFingers]);
  
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
          noteColor,
          showFingers
        },
        chordPositions: chordPositions.slice(0, 5), // Limit to first 5 to avoid overflow
        fingerPositions: fingerPositions.length > 0 ? fingerPositions[0] : null,
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
    isMobile, fretboardVertical, fingerPositions, showFingers
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
      // Correct string display index for the current orientation
      const displayStringIndex = stringIndex;

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
        fingerInfo: {
          showFingers: showFingers,
          finger: getFingerForPosition(stringIndex, fretIndex, {
            selectedChord,
            showFingers,
            chordPositions
          }),
          directFinger: fingerPositions.length > 0 ? getFingerFromFingerings(5 - stringIndex, fretIndex, {
            selectedChord,
            fingerPositions
          }) : null
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
            tuning,
            showFingers
          }),
          visibilityReason: "Using FretboardUtils.shouldShowNote logic"
        }
      });
    }
  }, [
    playNote, playString, tuning, selectedScale, scalePattern, 
    chordNotes, chordPositions, showChords, showTriads, 
    fretboardOrientation, selectedNote, selectedChord, 
    showDebugOverlay, hasActiveSelection, showAllNotes, showRoot,
    showFingers, fingerPositions
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
  
  // Toggle finger position display
  const handleToggleFingers = useCallback(() => {
    toggleShowFingers();
  }, [toggleShowFingers]);

  // Render finger toggle button
  const renderFingerToggle = useCallback(() => {
    return (
      <div className="fingers-toggle mb-4 flex items-center justify-center">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={showFingers}
              onChange={handleToggleFingers}
              className="sr-only"
              disabled={!showChords}
            />
            <div className={cn(
              "block w-10 h-6 rounded-full transition-colors duration-300",
              showFingers ? "bg-metal-blue" : "bg-gray-300 dark:bg-metal-dark",
              !showChords && "opacity-50 cursor-not-allowed"
            )}></div>
            <div className={cn(
              "dot absolute left-1 top-1 w-4 h-4 rounded-full transition duration-300 bg-white",
              showFingers && "transform translate.x-4"
            )} style={{ transform: showFingers ? 'translateX(16px)' : 'translateX(0)' }}></div>
          </div>
          <span className={cn(
            "ml-2 text-sm font-medium",
            !showChords && "opacity-50"
          )}>
            <Hand className="inline-block mr-1 h-4 w-4" /> Show Finger Positions
          </span>
        </label>
      </div>
    );
  }, [showFingers, handleToggleFingers, showChords]);

  // Toggle debug overlay
  const toggleDebugOverlay = useCallback(() => {
    setShowDebugOverlay(prev => !prev);
    if (!showDebugOverlay) {
      updateGlobalDebugInfo();
    }
  }, [showDebugOverlay, updateGlobalDebugInfo]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Debug Toggle Button */}
      <div className="absolute top-0 right-0 z-50">
        <button
          onClick={toggleDebugOverlay}
          className={cn(
            "p-1 rounded text-xs",
            showDebugOverlay 
              ? "bg-red-500 text-white" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          )}
        >
          {showDebugOverlay ? "Hide Debug" : "Debug"}
        </button>
      </div>
      
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
      
      {/* Finger Positions Toggle */}
      {showChords && renderFingerToggle()}
      
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
                  {/* Render strings in order from high E to low E */}
                  {[0, 1, 2, 3, 4, 5].map((stringIndex) => {
                    // Get the string note from tuning array
                    // Since STANDARD_TUNING is already in [E, A, D, G, B, E] order (low to high),
                    // we need to access it in reverse to get high to low
                    const actualStringIndex = 5 - stringIndex;
                    const openNote = tuning[actualStringIndex];
                    
                    // Set string thickness and color based on string type
                    const isBassTuning = stringIndex >= 3; // Bottom 3 strings (D, A, E) are bass
                    
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
                                  
                                  {/* Debug marker - Display string and fret info on hover when debug mode is on */}
                                  {showDebugOverlay && (
                                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white opacity-30 pointer-events-none">
                                      S:{actualStringIndex} F:{fretNumber}
                                    </div>
                                  )}
                                  
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
                                      tuning,
                                      showFingers
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

                                    // FIXED: Get finger directly from the fingerings array for correct mapping
                                    let fingerNumber = null;
                                    if (showChords && showFingers && fingerPositions.length > 0) {
                                      // Use the new function for direct access to fingerings array
                                      fingerNumber = getFingerFromFingerings(stringIndex, fretNumber, {
                                        selectedChord,
                                        fingerPositions
                                      });
                                    } else {
                                      // Fall back to the original function for other cases
                                      fingerNumber = getFingerForPosition(actualStringIndex, fretNumber, {
                                        selectedChord,
                                        showFingers,
                                        chordPositions
                                      });
                                    }

                                    // Get finger color based on finger number
                                    const fingerColor = getFingerColor(fingerNumber);

                                    return (
                                      <>
                                        {shouldShow && markerStyle && (
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
                                        )}

                                        {/* Finger position marker */}
                                        {showChords && showFingers && fingerNumber !== null && (
                                          <div 
                                            className={`finger-marker finger-${fingerNumber}`}
                                            style={{ backgroundColor: fingerColor }}
                                            aria-label={`Finger ${fingerNumber === 0 ? 'open' : fingerNumber}`}
                                          >
                                            {fingerNumber === 0 ? 'O' : 
                                             fingerNumber === null ? 'X' : 
                                             fingerNumber}
                                          </div>
                                        )}

                                        {/* Muted string indicator (X) */}
                                        {showChords && showFingers && fingerNumber === null && (
                                          <div 
                                            className="finger-marker finger-x"
                                            aria-label="Muted string"
                                          >
                                            ×
                                          </div>
                                        )}

                                        {/* Debug info for current position */}
                                        {showDebugOverlay && (fingerNumber !== null || shouldShow) && (
                                          <div 
                                            className="absolute top-0 right-0 bg-black/70 text-[6px] text-white p-0.5 rounded pointer-events-none"
                                          >
                                            {fingerNumber !== null && `F:${fingerNumber}`}
                                            {shouldShow && ` ${note}`}
                                          </div>
                                        )}
                                      </>
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

      {/* Debug Chord Position Info */}
      {showDebugOverlay && selectedChord && (
        <div className="mt-4 p-4 bg-black/80 text-white rounded-lg">
          <h4 className="text-lg font-bold mb-2">Chord Position Debug</h4>
          <div className="text-sm space-y-2">
            <div>
              <strong>Selected Chord:</strong> {selectedChord}
            </div>
            <div>
              <strong>Chord Notes:</strong> {chordNotes.join(', ')}
            </div>
            <div>
              <strong>Finger Positions:</strong>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {fingerPositions.length > 0 ? (
                <div>
                  <div className="font-bold">Position: {fingerPositions[0].position}</div>
                  <div className="flex space-x-2 mb-2">
                    <div><strong>Fret Start:</strong> {fingerPositions[0].fretStart}</div>
                    <div><strong>Barres:</strong> {fingerPositions[0].barres.length}</div>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left">String</th>
                        <th className="text-left">Finger</th>
                        <th className="text-left">Note</th>
                        <th className="text-left">Fret</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* String display is high E to low E (0-5) */}
                      {fingerPositions[0].fingerings.slice().reverse().map((finger, idx) => {
                        // Map displayed string index (0-5) to actual string index in reversed tuning
                        const visualStringIdx = idx; // This is high E (0) to low E (5)
                        const actualStringIdx = 5 - idx; // This maps to the tuning array correct index
                        const stringOpenNote = tuning[actualStringIdx];
                        
                        // If finger is null, the string is muted
                        if (finger === null) {
                          return (
                            <tr key={idx} className="border-t border-gray-700">
                              <td>{visualStringIdx} ({stringOpenNote})</td>
                              <td>X</td>
                              <td>Muted</td>
                              <td>-</td>
                            </tr>
                          );
                        }
                        
                        // For open strings
                        if (finger === 0) {
                          return (
                            <tr key={idx} className="border-t border-gray-700">
                              <td>{visualStringIdx} ({stringOpenNote})</td>
                              <td>Open</td>
                              <td>{stringOpenNote}</td>
                              <td>0</td>
                            </tr>
                          );
                        }
                        
                        // For fretted notes
                        const fret = fingerPositions[0].fretStart + finger;
                        const noteAtFret = getNoteAtFret(stringOpenNote, fret);
                        
                        return (
                          <tr key={idx} className="border-t border-gray-700">
                            <td>{visualStringIdx} ({stringOpenNote})</td>
                            <td>{finger}</td>
                            <td>{noteAtFret}</td>
                            <td>{fret}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Barre information */}
                  {fingerPositions[0].barres.length > 0 && (
                    <div className="mt-4">
                      <div className="font-bold">Barres:</div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            <th className="text-left">Fret</th>
                            <th className="text-left">Start String</th>
                            <th className="text-left">End String</th>
                            <th className="text-left">Finger</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fingerPositions[0].barres.map((barre, idx) => (
                            <tr key={idx} className="border-t border-gray-700">
                              <td>{barre.fret}</td>
                              <td>{barre.startString}</td>
                              <td>{barre.endString}</td>
                              <td>1 (Index)</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-400">No finger positions available for this chord</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Fretboard Display Modal */}
      <FretboardDisplayModal 
        open={fretModalOpen} 
        onOpenChange={setFretModalOpen}
      />
    </div>
  );
});

Fretboard.displayName = 'Fretboard';

// Standard marker positions
const markerPositions = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

export default Fretboard;