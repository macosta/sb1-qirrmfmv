import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Play, ChevronRight, GalleryVerticalEnd, PanelRight, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import { useStringAudio } from '../../hooks/useAudio';
import { NOTES, SCALES } from '../../lib/utils';
import Modal from './Modal';

interface ScalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Calculate scale counts dynamically based on what's available in the SCALES object
const majorScales = Object.keys(SCALES).filter(scale => scale.includes('Major') && !scale.includes('Pentatonic'));
const minorScales = Object.keys(SCALES).filter(scale => scale.includes('Minor') && !scale.includes('Pentatonic') && !scale.includes('Harmonic') && !scale.includes('Melodic'));
const modeScales = Object.keys(SCALES).filter(scale => 
  scale.includes('Dorian') || 
  scale.includes('Phrygian') || 
  scale.includes('Lydian') || 
  scale.includes('Mixolydian') || 
  scale.includes('Locrian')
);
const harmonicMelodicScales = Object.keys(SCALES).filter(scale => scale.includes('Harmonic') || scale.includes('Melodic'));
const pentatonicScales = Object.keys(SCALES).filter(scale => scale.includes('Pentatonic'));
const bluesScales = Object.keys(SCALES).filter(scale => scale.includes('Blues'));

// Group scales by type with actual counts
const scaleCategories = [
  {
    name: "Major Scales (Ionian)",
    scales: majorScales,
    count: majorScales.length
  },
  {
    name: "Minor Scales (Aeolian)",
    scales: minorScales,
    count: minorScales.length
  },
  {
    name: "Additional Modes",
    scales: modeScales,
    count: modeScales.length
  },
  {
    name: "Harmonic & Melodic Minor",
    scales: harmonicMelodicScales,
    count: harmonicMelodicScales.length
  },
  {
    name: "Pentatonic Scales",
    scales: pentatonicScales,
    count: pentatonicScales.length
  },
  {
    name: "Blues Scales",
    scales: bluesScales,
    count: bluesScales.length
  }
];

// Scale info cache for performance
const scaleInfoCache: Record<string, ScaleInfo> = {};

// Filter scales based on selected root note
const filterScalesByRoot = (scales: string[], rootNote: string): string[] => {
  if (!rootNote) return scales;
  
  return scales.filter(scale => {
    const scaleParts = scale.split(' ');
    return scaleParts[0] === rootNote;
  });
};

// Type definition for scale information
interface ScaleInfo {
  name: string;
  notes: string[];
  type: string;
  description: string;
  commonChords: string[];
  modes?: string[];
}

// Simple tooltip component
const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positions = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1",
    left: "right-full top-1/2 transform -translate-x-2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform translate-x-2 -translate-y-1/2 ml-1",
  };
  
  const arrowPositions = {
    top: "top-full left-1/2 transform -translate-x-1/2 -translate-y-1 border-t-black dark:border-t-metal-darker border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 border-b-black dark:border-b-metal-darker border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 transform -translate-x-1 -translate-y-1/2 border-l-black dark:border-l-metal-darker border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 transform translate-x-1 -translate-y-1/2 border-r-black dark:border-r-metal-darker border-t-transparent border-b-transparent border-l-transparent",
  };
  
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute z-50 ${positions[position]}`}>
          <div className="bg-black/90 dark:bg-metal-darker/95 text-white px-2 py-1 rounded text-xs max-w-[250px] whitespace-normal break-words">
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${arrowPositions[position]}`} />
        </div>
      )}
    </div>
  );
};

// Function to determine scale type from name - memoized
const getScaleType = (scaleName: string): string => {
  if (scaleName.includes('Major Pentatonic')) return 'Major Pentatonic';
  if (scaleName.includes('Minor Pentatonic')) return 'Minor Pentatonic';
  if (scaleName.includes('Harmonic Minor')) return 'Harmonic Minor';
  if (scaleName.includes('Melodic Minor')) return 'Melodic Minor';
  if (scaleName.includes('Blues')) return 'Blues';
  if (scaleName.includes('Dorian')) return 'Dorian Mode';
  if (scaleName.includes('Phrygian')) return 'Phrygian Mode';
  if (scaleName.includes('Lydian')) return 'Lydian Mode';
  if (scaleName.includes('Mixolydian')) return 'Mixolydian Mode';
  if (scaleName.includes('Locrian')) return 'Locrian Mode';
  if (scaleName.includes('Major')) return 'Major (Ionian Mode)';
  if (scaleName.includes('Minor')) return 'Minor (Aeolian Mode)';
  return 'Unknown';
};

// Memoized scale descriptions
const scaleDescriptions = {
  'Major (Ionian Mode)': "The major scale (Ionian mode) is the foundation of Western music theory. It has a bright, happy sound.",
  'Minor (Aeolian Mode)': "The natural minor scale (Aeolian mode) has a darker, more melancholic sound compared to the major scale.",
  'Harmonic Minor': "The harmonic minor scale raises the 7th degree of the natural minor scale, creating a stronger pull to the tonic.",
  'Melodic Minor': "The melodic minor scale raises both the 6th and 7th degrees when ascending, but uses the natural minor when descending.",
  'Major Pentatonic': "The major pentatonic scale is a five-note scale derived from the major scale. It has a bright, simple sound that works well in many styles.",
  'Minor Pentatonic': "The minor pentatonic scale is a five-note scale derived from the minor scale. It's widely used in rock, blues, and many other genres.",
  'Blues': "The blues scale adds a flat 5th (blue note) to the minor pentatonic scale, giving it that characteristic blues sound.",
  'Dorian Mode': "The Dorian mode is the second mode of the major scale. It's a minor scale with a raised 6th, giving it a slightly brighter sound.",
  'Phrygian Mode': "The Phrygian mode is the third mode of the major scale. It's a minor scale with a lowered 2nd, giving it a Spanish or Middle Eastern flavor.",
  'Lydian Mode': "The Lydian mode is the fourth mode of the major scale. It's a major scale with a raised 4th, giving it a dreamy, floating quality.",
  'Mixolydian Mode': "The Mixolydian mode is the fifth mode of the major scale. It's a major scale with a lowered 7th, common in rock, jazz, and folk music.",
  'Locrian Mode': "The Locrian mode is the seventh mode of the major scale. It's a diminished scale rarely used as a tonal center in Western music.",
  'Unknown': "A pattern of whole and half steps that forms the foundation of melodies and harmonies."
};

// Get description based on scale type - memoized
const getScaleDescription = (scaleType: string): string => {
  return scaleDescriptions[scaleType as keyof typeof scaleDescriptions] || scaleDescriptions['Unknown'];
};

// Function to get common chords for a scale - optimized with explicit return types
const getCommonChords = (scaleName: string, notes: string[]): string[] => {
  const root = scaleName.split(' ')[0];
  
  // Basic chord progressions based on scale type
  if (scaleName.includes('Major')) {
    return [
      `${root} Major`,
      `${notes[1]} Minor`,
      `${notes[2]} Minor`,
      `${notes[3]} Major`,
      `${notes[4]} Major`,
      `${notes[5]} Minor`,
      `${notes[6]} Diminished`
    ];
  } 
  
  if (scaleName.includes('Minor')) {
    return [
      `${root} Minor`,
      `${notes[1]} Diminished`,
      `${notes[2]} Major`,
      `${notes[3]} Minor`,
      `${notes[4]} Minor`,
      `${notes[5]} Major`,
      `${notes[6]} Major`
    ];
  } 
  
  if (scaleName.includes('Pentatonic')) {
    // Simplified chord set for pentatonic scales
    return scaleName.includes('Major Pentatonic') 
      ? [`${root} Major`, `${notes[1]} Minor`, `${notes[3]} Major`]
      : [`${root} Minor`, `${notes[2]} Minor`, `${notes[3]} Major`];
  }
  
  // Default to basic major or minor triads from the scale
  return notes.map(note => `${note} ${scaleName.includes('Major') ? 'Major' : 'Minor'}`);
};

// Get related modes for a scale - optimized
const getRelatedModes = (scaleName: string): string[] => {
  // Only show related modes for major and natural minor scales
  if (scaleName.includes('Major') && !scaleName.includes('Pentatonic') && !scaleName.includes('Mode')) {
    const root = scaleName.split(' ')[0];
    return [
      `${NOTES[(NOTES.indexOf(root) + 2) % 12]} Dorian`,
      `${NOTES[(NOTES.indexOf(root) + 4) % 12]} Phrygian`,
      `${NOTES[(NOTES.indexOf(root) + 5) % 12]} Lydian`,
      `${NOTES[(NOTES.indexOf(root) + 7) % 12]} Mixolydian`,
      `${NOTES[(NOTES.indexOf(root) + 9) % 12]} Aeolian`,
      `${NOTES[(NOTES.indexOf(root) + 11) % 12]} Locrian`
    ];
  }
  
  // For minor scales, show the relative major and other modes
  if (scaleName.includes('Minor') && !scaleName.includes('Pentatonic') && !scaleName.includes('Harmonic') && !scaleName.includes('Melodic')) {
    const root = scaleName.split(' ')[0];
    const relativeMajorIndex = (NOTES.indexOf(root) + 3) % 12;
    const relativeMajor = NOTES[relativeMajorIndex];
    
    return [
      `${relativeMajor} Major`,
      `${NOTES[(relativeMajorIndex + 2) % 12]} Dorian`,
      `${NOTES[(relativeMajorIndex + 4) % 12]} Phrygian`,
      `${NOTES[(relativeMajorIndex + 5) % 12]} Lydian`,
      `${NOTES[(relativeMajorIndex + 7) % 12]} Mixolydian`,
      `${NOTES[(relativeMajorIndex + 11) % 12]} Locrian`
    ];
  }
  
  return [];
};

// Get scale information with computed properties - memoized 
const getScaleInfo = (scaleName: string): ScaleInfo => {
  // Check cache first
  if (scaleInfoCache[scaleName]) {
    return scaleInfoCache[scaleName];
  }
  
  const notes = SCALES[scaleName as keyof typeof SCALES] || [];
  const type = getScaleType(scaleName);
  
  const scaleInfo = {
    name: scaleName,
    notes,
    type,
    description: getScaleDescription(type),
    commonChords: getCommonChords(scaleName, notes),
    modes: getRelatedModes(scaleName)
  };
  
  // Cache the result
  scaleInfoCache[scaleName] = scaleInfo;
  
  return scaleInfo;
};

// Custom heading styles for subheadings
const subheadingStyle = {
  color: '#3F51B5',
  fontWeight: 600,
  lineHeight: 1.3
};

// Custom body text styles
const bodyTextStyle = {
  fontSize: '16px',
  lineHeight: 1.5
};

const ScalesModal: React.FC<ScalesModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedNote, 
    setSelectedScale,
    theme
  } = useGuitarStore();
  
  const { playString } = useStringAudio();
  
  // State for the modal
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedScale, setLocalSelectedScale] = useState<string | null>(null);
  const [scaleInfo, setScaleInfo] = useState<ScaleInfo | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Memoize filtered scales for performance
  const filteredScales = useMemo(() => {
    const category = scaleCategories[activeCategory];
    return selectedNote 
      ? filterScalesByRoot(category.scales, selectedNote)
      : category.scales;
  }, [selectedNote, activeCategory]);
  
  // Memoize categories with counts
  const categoriesWithCounts = useMemo(() => {
    return scaleCategories.map((category, index) => {
      const filteredCount = selectedNote 
        ? filterScalesByRoot(category.scales, selectedNote).length 
        : category.scales.length;
      
      return {
        ...category,
        activeCount: filteredCount
      };
    });
  }, [selectedNote]);
  
  // Update scale info when selected scale changes
  useEffect(() => {
    if (selectedScale) {
      setScaleInfo(getScaleInfo(selectedScale));
    }
  }, [selectedScale]);
  
  // Select a scale in the store and close the modal
  const handleSelectScale = useCallback((scale: string) => {
    setSelectedScale(scale); // Update the global store
    onClose(); // Close the modal
  }, [setSelectedScale, onClose]);
  
  // Handle scale selection and toggle details view
  const handleScaleClick = useCallback((scale: string) => {
    setLocalSelectedScale(scale);
    setShowDetails(true); // Automatically show details when a scale is selected
  }, []);
  
  // Play a scale demonstration
  const playScale = useCallback((notes: string[]) => {
    if (!notes.length) return;
    
    // If a custom root is selected, transpose the scale
    let scaleToPlay = notes;
    if (selectedNote && notes[0] !== selectedNote) {
      const scaleRoot = notes[0];
      const rootIndex = NOTES.indexOf(scaleRoot);
      const selectedRootIndex = NOTES.indexOf(selectedNote);
      
      if (rootIndex !== -1 && selectedRootIndex !== -1) {
        const interval = (selectedRootIndex - rootIndex + 12) % 12;
        scaleToPlay = notes.map(note => {
          const noteIndex = NOTES.indexOf(note);
          if (noteIndex === -1) return note;
          const newIndex = (noteIndex + interval) % 12;
          return NOTES[newIndex];
        });
      }
    }
    
    // Map scale notes to fretboard positions and play them
    scaleToPlay.forEach((note, index) => {
      setTimeout(() => {
        // Find a suitable position for the note on the fretboard
        // For simplicity, we'll just use fixed positions per string
        const stringIndex = Math.min(index % 6, 5); // Use up to 6 strings (0-5)
        const noteIndex = NOTES.indexOf(note);
        
        // Calculate fret position based on the string's open note
        // This is a simplified version
        let fret = 0;
        const stringNote = NOTES[(NOTES.indexOf('E') + (stringIndex * 5)) % 12];
        const stringNoteIndex = NOTES.indexOf(stringNote);
        
        if (stringNoteIndex !== -1 && noteIndex !== -1) {
          fret = (noteIndex - stringNoteIndex + 12) % 12;
        }
        
        playString(stringIndex, fret);
      }, index * 200); // 200ms between notes
    });
  }, [selectedNote, playString]);
  
  // When examining a chord
  const handleChordClick = useCallback((chord: string) => {
    // Simplified chord playback - just play the root note
    const chordRoot = chord.split(' ')[0];
    const rootIndex = NOTES.indexOf(chordRoot);
    
    if (rootIndex !== -1) {
      // Find a good position on the low E string
      const fret = rootIndex === 0 ? 0 : rootIndex; // E is 0, others are their indices
      playString(0, fret); // Low E string
      
      // For major chords, add the major third and fifth
      setTimeout(() => {
        if (chord.includes('Major')) {
          playString(2, fret + 2); // Major third on G string
          setTimeout(() => playString(1, fret + 2), 100); // Fifth on A string
        } else if (chord.includes('Minor')) {
          playString(2, fret + 1); // Minor third on G string
          setTimeout(() => playString(1, fret + 2), 100); // Fifth on A string
        }
      }, 200);
    }
  }, [playString]);
  
  return (
    <Modal
      title="Scale Explorer"
      open={isOpen}
      onOpenChange={onClose}
      size="full"
      className="min-h-[400px]"
    >
      <div className="flex flex-col md:flex-row h-auto min-h-[400px] max-h-[80vh]">
        {/* Left sidebar - Scale categories */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-gray-200 dark:border-metal-darkest pb-4 md:pb-0 md:pr-4">
          <nav className="p-2 space-y-1">
            {categoriesWithCounts.map((category, index) => (
              <button
                key={category.name}
                className={cn(
                  "w-full px-3 py-2 text-left rounded-md transition-colors flex items-center",
                  activeCategory === index
                    ? "bg-blue-100 dark:bg-metal-dark text-blue-700 dark:text-metal-lightblue font-medium"
                    : "text-gray-700 dark:text-metal-silver hover:bg-gray-100 dark:hover:bg-metal-darkest"
                )}
                onClick={() => {
                  setActiveCategory(index);
                  setShowDetails(false);
                }}
              >
                <span className="flex-1">{category.name}</span>
                <span className="flex items-center justify-center w-6 h-6 text-xs bg-gray-200 dark:bg-metal-darkest rounded-full ml-2">
                  {category.activeCount}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scale list */}
          {!showDetails ? (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-metal-lightblue mb-4">
                {scaleCategories[activeCategory].name}
              </h3>

              {selectedNote && filteredScales.length === 0 && (
                <div className="text-center py-8" style={bodyTextStyle}>
                  <p className="text-gray-500 dark:text-metal-silver">Only showing options for the selected note: <strong>{selectedNote}</strong></p>
                  <p className="mt-2 text-gray-500 dark:text-metal-silver">No scales found for this root note in this category.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredScales.map((scale) => (
                  <div key={scale} className="relative">
                    {/* Highlight effect for selected scale */}
                    {selectedScale === scale && (
                      <div className="absolute inset-0 border-2 border-blue-500 dark:border-metal-blue rounded-md z-0 pointer-events-none" 
                        style={{
                          boxShadow: '0 0 0 2px rgba(0, 149, 255, 0.3)'
                        }}
                      />
                    )}
                    <button
                      className={cn(
                        "w-full p-3 text-left rounded-md transition-colors border flex justify-between items-center relative z-10",
                        selectedScale === scale
                          ? "bg-blue-50 dark:bg-metal-dark border-blue-200 dark:border-metal-blue"
                          : "border-gray-200 dark:border-metal-darkest hover:bg-gray-50 dark:hover:bg-metal-darkest"
                      )}
                      onClick={() => handleScaleClick(scale)}
                      aria-label={`View details for ${scale} scale`}
                    >
                      <div>
                        <div 
                          className="font-medium text-gray-800 dark:text-metal-lightblue"
                          style={{ fontSize: '16px', lineHeight: 1.3 }}
                        >
                          {scale}
                        </div>
                        <div className="text-gray-500 dark:text-metal-silver mt-1" style={bodyTextStyle}>
                          {SCALES[scale as keyof typeof SCALES]?.join(' - ')}
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 transition-colors",
                        selectedScale === scale
                          ? "text-blue-500 dark:text-metal-blue"
                          : "text-gray-400 dark:text-metal-darker"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Scale details view
            <div className="flex-1 overflow-y-auto p-4">
              {scaleInfo && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-metal-lightblue">
                        {scaleInfo.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-metal-silver mt-1">
                        {scaleInfo.type}
                      </p>
                    </div>
                    <Tooltip content="Back to scale list">
                      <button
                        onClick={() => setShowDetails(false)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-metal-darkest hover:bg-gray-200 dark:hover:bg-metal-dark transition-colors"
                        aria-label="Close details view"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-metal-silver" />
                      </button>
                    </Tooltip>
                  </div>
                  
                  {/* Scale notes and play button */}
                  <div className="bg-gray-50 dark:bg-metal-darkest rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 
                        className="font-medium mb-1"
                        style={{
                          ...subheadingStyle,
                          color: theme === 'dark' ? '#7986CB' : '#3F51B5'
                        }}
                      >
                        Notes: <span className={cn("font-medium", theme === 'dark' ? "text-metal-lightblue" : "text-blue-600")}>
                          {scaleInfo.notes.join(' - ')}
                        </span>
                      </h4>
                    </div>
                    <Tooltip content="Play scale notes in sequence">
                      <button
                        onClick={() => playScale(scaleInfo.notes)}
                        className="p-2 rounded-full bg-blue-500 dark:bg-metal-blue text-white hover:bg-blue-600 dark:hover:bg-metal-lightblue transition-colors flex items-center space-x-1"
                        aria-label="Play scale"
                      >
                        <Play className="w-4 h-4" />
                        <span className="text-sm">Play</span>
                      </button>
                    </Tooltip>
                  </div>
                  
                  {/* Scale description */}
                  <div className="bg-white dark:bg-metal-darker border border-gray-200 dark:border-metal-darkest rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 dark:text-metal-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 
                          className="font-medium mb-1"
                          style={{
                            ...subheadingStyle,
                            color: theme === 'dark' ? '#7986CB' : '#3F51B5'
                          }}
                        >
                          Description
                        </h4>
                        <p className="text-gray-600 dark:text-metal-silver" style={bodyTextStyle}>
                          {scaleInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Common chord progressions */}
                  <div className="bg-white dark:bg-metal-darker border border-gray-200 dark:border-metal-darkest rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <GalleryVerticalEnd className="w-5 h-5 text-blue-500 dark:text-metal-blue flex-shrink-0 mt-0.5" />
                      <div className="w-full">
                        <h4 
                          className="font-medium mb-2"
                          style={{
                            ...subheadingStyle,
                            color: theme === 'dark' ? '#7986CB' : '#3F51B5'
                          }}
                        >
                          Common Chords
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {scaleInfo.commonChords.map((chord, index) => (
                            <Tooltip key={index} content="Click to hear chord">
                              <button
                                className="text-left px-3 py-2 rounded-md bg-gray-50 dark:bg-metal-darkest hover:bg-gray-100 dark:hover:bg-metal-dark transition-colors"
                                onClick={() => handleChordClick(chord)}
                                aria-label={`Play ${chord} chord`}
                                style={bodyTextStyle}
                              >
                                {chord}
                              </button>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Related modes */}
                  {scaleInfo.modes && scaleInfo.modes.length > 0 && (
                    <div className="bg-white dark:bg-metal-darker border border-gray-200 dark:border-metal-darkest rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <PanelRight className="w-5 h-5 text-blue-500 dark:text-metal-blue flex-shrink-0 mt-0.5" />
                        <div className="w-full">
                          <h4 
                            className="font-medium mb-2"
                            style={{
                              ...subheadingStyle,
                              color: theme === 'dark' ? '#7986CB' : '#3F51B5'
                            }}
                          >
                            Related Modes
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {scaleInfo.modes.map((mode, index) => (
                              <Tooltip key={index} content="View this mode's details">
                                <button
                                  className="text-left px-3 py-2 rounded-md bg-gray-50 dark:bg-metal-darkest hover:bg-gray-100 dark:hover:bg-metal-dark transition-colors"
                                  onClick={() => setLocalSelectedScale(mode)}
                                  aria-label={`View ${mode} details`}
                                  style={bodyTextStyle}
                                >
                                  {mode}
                                </button>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Scale theory */}
                  <div className="bg-white dark:bg-metal-darker border border-gray-200 dark:border-metal-darkest rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-500 dark:bg-metal-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 
                          className="font-medium mb-1"
                          style={{
                            ...subheadingStyle,
                            color: theme === 'dark' ? '#7986CB' : '#3F51B5'
                          }}
                        >
                          Scale Theory
                        </h4>
                        <p className="text-gray-600 dark:text-metal-silver mb-2" style={bodyTextStyle}>
                          {scaleInfo.type.includes('Major') ? 
                            "Formula: W-W-H-W-W-W-H (whole and half steps)" :
                            scaleInfo.type.includes('Minor') ?
                              "Formula: W-H-W-W-H-W-W (whole and half steps)" :
                              scaleInfo.type.includes('Pentatonic') ?
                                "Formula: Removed 4th and 7th from the major scale" :
                                "This scale has a unique intervallic structure."
                          }
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {scaleInfo.notes.map((note, i) => (
                            <div key={i} className="px-2 py-1 rounded bg-gray-100 dark:bg-metal-darkest text-xs flex flex-col items-center">
                              <span className="font-medium text-gray-800 dark:text-metal-lightblue">{note}</span>
                              <span className="text-gray-500 dark:text-metal-silver text-[10px]">
                                {i === 0 ? "Root" : `${i+1}${['th', 'st', 'nd', 'rd', 'th', 'th', 'th'][Math.min(i, 6)]}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer with actions */}
          <div className="border-t border-gray-200 dark:border-metal-darkest p-4 flex justify-between items-center">
            <div>
              {selectedScale && showDetails && (
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver rounded-md hover:bg-gray-200 dark:hover:bg-metal-dark transition-colors flex items-center space-x-1"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Back to List</span>
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver rounded-md hover:bg-gray-200 dark:hover:bg-metal-dark transition-colors"
              >
                Cancel
              </button>
              
              {selectedScale && (
                <button
                  onClick={() => handleSelectScale(selectedScale)}
                  className="px-3 py-1.5 bg-blue-500 dark:bg-metal-blue text-white rounded-md hover:bg-blue-600 dark:hover:bg-metal-lightblue transition-colors"
                >
                  Apply to Fretboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(ScalesModal);