import React, { useMemo, memo } from 'react';
import { cn } from '../../lib/utils';

interface ChordDiagramProps {
  className?: string;
  rootNote?: string;
  chordType?: 'Major' | 'Minor';
}

interface ChordPosition {
  fretStart: number;
  fingerings: (number | null)[];
  barres: { fret: number; startString: number; endString: number }[];
  position: string;
  notes: string[];
}

// Memoized chord positions cache for performance
const chordPositionsCache: Record<string, ChordPosition[]> = {};

// Helper to get chord positions for any root note/chord type
const getChordPositions = (rootNote: string, chordType: 'Major' | 'Minor'): ChordPosition[] => {
  if (!rootNote) return [];
  
  // Create a cache key based on root note and chord type
  const cacheKey = `${rootNote}-${chordType}`;
  
  // Return cached result if available
  if (chordPositionsCache[cacheKey]) {
    return chordPositionsCache[cacheKey];
  }
  
  // For demonstration purposes - real implementation would store all chord positions
  let positions: ChordPosition[] = [];
  
  if (rootNote === 'C' && chordType === 'Major') {
    positions = [
      // Open C Major (x32010)
      {
        fretStart: 0,
        fingerings: [null, 3, 2, 0, 1, 0],
        barres: [],
        position: "Open Position",
        notes: ["×", "C", "E", "G", "C", "E"]
      },
      // C Major Barre (5th string, 3rd fret) (x3555x)
      {
        fretStart: 2,
        fingerings: [null, 3, 1, 1, 1, null],
        barres: [{ fret: 5, startString: 2, endString: 4 }],
        position: "3rd Position",
        notes: ["×", "C", "G", "C", "E", "×"]
      },
      // C Major Barre (6th string, 8th fret) (8x10109)
      {
        fretStart: 7,
        fingerings: [1, null, 3, 4, 2, 1],
        barres: [{ fret: 8, startString: 0, endString: 5 }],
        position: "8th Position",
        notes: ["C", "×", "G", "C", "E", "C"]
      },
      // C Major Barre (5th string, 8th fret) (x10109x)
      {
        fretStart: 7,
        fingerings: [null, 3, 2, 1, 1, null],
        barres: [{ fret: 10, startString: 1, endString: 3 }],
        position: "8th Position (5th string)",
        notes: ["×", "C", "G", "C", "E", "×"]
      },
      // C Major Barre (6th string, 15th fret) (15 x 17 17 17 15)
      {
        fretStart: 14,
        fingerings: [1, null, 4, 3, 2, 1],
        barres: [{ fret: 15, startString: 0, endString: 5 }],
        position: "15th Position",
        notes: ["C", "×", "G", "C", "E", "C"]
      },
      // C Major Barre (5th string, 15th fret) (x 15 17 17 17 15)
      {
        fretStart: 14,
        fingerings: [null, 1, 4, 3, 2, 1],
        barres: [{ fret: 15, startString: 1, endString: 5 }],
        position: "15th Position (5th string)",
        notes: ["×", "C", "G", "C", "E", "C"]
      },
      // C Major Barre (4th string, 10th fret) (x x 10 9 8 x)
      {
        fretStart: 7,
        fingerings: [null, null, 4, 3, 1, null],
        barres: [],
        position: "10th Position (4th string)",
        notes: ["×", "×", "G", "C", "E", "×"]
      }
    ];
  } else if (rootNote === 'E' && chordType === 'Major') {
    positions = [
      {
        fretStart: 0,
        fingerings: [0, 2, 2, 1, 0, 0],
        barres: [],
        position: "Open Position",
        notes: ["E", "B", "E", "G#", "B", "E"]
      }
    ];
  } else if (rootNote === 'A' && chordType === 'Major') {
    positions = [
      {
        fretStart: 0,
        fingerings: [null, 0, 2, 2, 2, 0],
        barres: [],
        position: "Open Position",
        notes: ["×", "A", "E", "A", "C#", "E"]
      }
    ];
  } else if (rootNote === 'E' && chordType === 'Minor') {
    positions = [
      {
        fretStart: 0,
        fingerings: [0, 2, 2, 0, 0, 0],
        barres: [],
        position: "Open Position",
        notes: ["E", "B", "E", "G", "B", "E"]
      }
    ];
  } else if (rootNote === 'A' && chordType === 'Minor') {
    positions = [
      {
        fretStart: 0,
        fingerings: [null, 0, 2, 2, 1, 0],
        barres: [],
        position: "Open Position",
        notes: ["×", "A", "E", "A", "C", "E"]
      }
    ];
  } else {
    // Generate a basic placeholder for other chords
    positions = [
      {
        fretStart: 0,
        fingerings: [null, null, null, null, null, null],
        barres: [],
        position: "No position available",
        notes: ["×", "×", "×", "×", "×", "×"]
      }
    ];
  }
  
  // Cache the result for future use
  chordPositionsCache[cacheKey] = positions;
  
  return positions;
};

const ChordDiagram: React.FC<ChordDiagramProps> = ({ className, rootNote = 'C', chordType = 'Major' }) => {
  // Memoize chord positions based on selected root note and chord type
  const chordPositions = useMemo(() => {
    return getChordPositions(rootNote, chordType);
  }, [rootNote, chordType]);

  // Memoize the third and fifth degrees for chord theory explanation
  const chordDegrees = useMemo(() => {
    // Get chromatic scale starting from root note
    const chromaticScale = [...Array(12)].map((_, i) => {
      const noteIndex = (i + ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(rootNote)) % 12;
      return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex];
    });
    
    // Get third and fifth based on chord type
    const third = chordType === 'Major' ? chromaticScale[4] : chromaticScale[3];
    const fifth = chromaticScale[7];
    
    return { third, fifth };
  }, [rootNote, chordType]);

  return (
    <div className={cn("bg-white dark:bg-metal-darker rounded-lg shadow-md p-6", className)}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {rootNote} {chordType} Chord Positions
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Playable {rootNote} {chordType.toLowerCase()} chord voicings on standard tuning (E A D G B E)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chordPositions.map((position, posIndex) => (
          <div key={posIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-center font-bold mb-2 text-gray-700 dark:text-gray-300">{position.position}</h3>
            
            {/* Fretboard */}
            <div className="relative">
              {/* Nut at the top if it's the open position */}
              {position.fretStart === 0 && (
                <div className="h-2 bg-gray-800 dark:bg-gray-200 rounded-sm mb-1"></div>
              )}
              
              {position.fretStart !== 0 && (
                <div className="absolute -left-7 top-12 text-sm text-gray-500 dark:text-gray-400">
                  {position.fretStart + 1}fr
                </div>
              )}
              
              {/* Strings and frets */}
              <div className="relative w-full">
                {/* Strings (vertical lines) */}
                <div className="flex justify-between mb-1">
                  {['E', 'A', 'D', 'G', 'B', 'e'].map((stringName, stringIdx) => (
                    <div key={stringIdx} className="flex flex-col items-center">
                      {/* String labels at top */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stringName}</div>
                      
                      {/* The string marker at the top (open, muted) */}
                      <div className="h-6 flex items-center justify-center">
                        {position.fingerings[stringIdx] === 0 ? (
                          <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-700 dark:border-gray-300 text-xs">
                            O
                          </div>
                        ) : position.fingerings[stringIdx] === null ? (
                          <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                            ×
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Frets (horizontal spaces) */}
                {[0, 1, 2, 3, 4].map((fretOffset) => {
                  const currentFret = position.fretStart + fretOffset;
                  
                  return (
                    <div 
                      key={fretOffset} 
                      className="flex justify-between items-center relative h-10 border-b border-gray-300 dark:border-gray-600"
                    >
                      {/* Barre indicators */}
                      {position.barres.map((barre, barreIdx) => {
                        if (barre.fret === currentFret + 1) {
                          const startPercent = (barre.startString / 5) * 100;
                          const endPercent = ((5 - barre.endString) / 5) * 100;
                          
                          return (
                            <div 
                              key={barreIdx}
                              className="absolute top-1/2 transform -translate-y-1/2 h-6 bg-gray-400 dark:bg-gray-500 rounded-full z-10"
                              style={{ 
                                left: `${startPercent}%`, 
                                right: `${endPercent}%` 
                              }}
                            ></div>
                          );
                        }
                        return null;
                      })}
                      
                      {/* String positions */}
                      {[0, 1, 2, 3, 4, 5].map((stringIdx) => {
                        const finger = position.fingerings[stringIdx];
                        const isRoot = position.notes[stringIdx] === rootNote;
                        const isFretted = finger !== null && finger > 0 && (currentFret + 1) === (position.fretStart + finger);
                        
                        return (
                          <div 
                            key={stringIdx} 
                            className="relative h-full flex items-center justify-center"
                            style={{ width: '20px' }}
                          >
                            {/* Vertical string line */}
                            <div 
                              className={cn(
                                "absolute top-0 bottom-0 w-px bg-gray-400 dark:bg-gray-500",
                                stringIdx === 0 || stringIdx === 5 ? "bg-gray-600 dark:bg-gray-300" : ""
                              )}
                            ></div>
                            
                            {/* Finger position marker */}
                            {isFretted && (
                              <div 
                                className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm z-20",
                                  isRoot 
                                    ? "bg-blue-500 text-white" // Root note (C)
                                    : "bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-800" // Regular note
                                )}
                              >
                                {finger}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              
              {/* Notes Display */}
              <div className="flex justify-between mt-3">
                {position.notes.map((note, noteIdx) => (
                  <div key={noteIdx} className="text-center">
                    <span 
                      className={cn(
                        "text-xs font-medium",
                        note === rootNote ? "text-blue-500 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Root Note ({rootNote})</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-700 dark:bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Other Notes ({chordType === 'Major' ? 'Major 3rd, 5th' : 'Minor 3rd, 5th'})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-700 dark:border-gray-300 text-xs mr-2">
              O
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Open String</span>
          </div>
          <div className="flex items-center">
            <div className="text-xl font-bold text-gray-700 dark:text-gray-300 mr-2">×</div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Muted String</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Barre (finger across multiple strings)</span>
          </div>
        </div>
      </div>
      
      {/* Theory explanation */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          About {rootNote} {chordType} Chord
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          {chordType === 'Major' ? (
            <>The {rootNote} Major chord consists of the notes {rootNote} (root), {chordDegrees.third} (major 3rd), and {chordDegrees.fifth} (fifth). These notes form the {rootNote} major triad.</>
          ) : (
            <>The {rootNote} Minor chord consists of the notes {rootNote} (root), {chordDegrees.third} (minor 3rd), and {chordDegrees.fifth} (fifth). These notes form the {rootNote} minor triad.</>
          )}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          There are multiple ways to play this chord on a guitar, from the basic open position to various barre chord shapes.
          The diagrams above show the most common and practical fingerings for {rootNote} {chordType} across the fretboard.
        </p>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ChordDiagram);