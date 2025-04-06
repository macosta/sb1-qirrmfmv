import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Play, ChevronRight, GalleryVerticalEnd, PanelRight, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import { useStringAudio } from '../../hooks/useAudio';
import { NOTES, CHORDS } from '../../lib/utils';
import Modal from './Modal';

interface ChordModalProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedChord: (chord: string) => void;
  setShowChords?: (show: boolean) => void;
}

// Get filtered chords based on selected root note and category
const getFilteredChords = (rootNote: string | null, categoryType: string) => {
  if (!rootNote) return [];
  return Object.keys(CHORDS).filter(chord => 
    chord.startsWith(rootNote) && chord.includes(categoryType)
  );
};

// Chord categories with dynamic counts
const getChordCategories = (rootNote: string | null) => [
  {
    name: "Major Chords",
    type: "Major",
    count: getFilteredChords(rootNote, "Major").filter(chord => !chord.includes("Suspended")).length
  },
  {
    name: "Minor Chords",
    type: "Minor",
    count: getFilteredChords(rootNote, "Minor").length
  },
  {
    name: "Suspended Chords",
    type: "Suspended",
    count: getFilteredChords(rootNote, "Suspended").length
  },
  {
    name: "Power Chords",
    type: "Power",
    count: getFilteredChords(rootNote, "Power").length
  }
];

const ChordModal: React.FC<ChordModalProps> = ({ 
  isOpen, 
  onClose, 
  setSelectedChord,
  setShowChords 
}) => {
  const { selectedNote } = useGuitarStore();
  const { playString } = useStringAudio();
  
  // State for the modal
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedChordType, setSelectedChordType] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [chordInfo, setChordInfo] = useState<{
    name: string;
    notes: string[];
    intervals: string[];
    positions: { string: number; fret: number; finger?: number }[];
    description: string;
  } | null>(null);

  // Get chord categories with dynamic counts
  const chordCategories = getChordCategories(selectedNote);

  // Get filtered chords based on selected root note and category
  const getFilteredChords = () => {
    if (!selectedNote) return [];
    
    const categoryType = chordCategories[activeCategory].type;
    return Object.keys(CHORDS).filter(chord => 
      chord.startsWith(selectedNote) && chord.includes(categoryType)
    );
  };

  // Handle chord selection
  const handleChordSelect = (chord: string) => {
    if (!selectedNote) return;
    
    setSelectedChordType(chord);
    
    // Get chord information
    const chordNotes = CHORDS[chord as keyof typeof CHORDS] || [];
    
    // Set chord info
    const info = {
      name: chord,
      notes: chordNotes,
      intervals: chordNotes.map((note, i) => {
        if (i === 0) return 'Root';
        if (i === 1) return chord.includes('Minor') ? 'Minor 3rd' : 'Major 3rd';
        if (i === 2) return 'Perfect 5th';
        return `Extension ${i + 1}`;
      }),
      positions: [],
      description: `The ${chord} chord consists of the notes ${chordNotes.join(', ')}. ${
        chord.includes('Minor') 
          ? 'It has a darker, more melancholic sound.'
          : 'It has a bright, stable sound.'
      }`
    };
    
    setChordInfo(info);
    setShowDetails(true);
  };

  // Apply chord to fretboard
  const handleApplyChord = () => {
    if (!selectedChordType) return;
    
    setSelectedChord(selectedChordType);
    if (setShowChords) {
      setShowChords(true);
    }
    onClose();
  };

  // Play chord demonstration
  const playChord = () => {
    if (!chordInfo) return;
    
    // Play root note first
    playString(5, 0); // Low E string open
    
    // Play other chord tones in sequence
    setTimeout(() => playString(4, 2), 200); // A string 2nd fret
    setTimeout(() => playString(3, 2), 400); // D string 2nd fret
  };

  return (
    <Modal
      title="Chord Explorer"
      open={isOpen}
      onOpenChange={onClose}
      size="full"
      className="min-h-[400px]"
    >
      <div className="flex flex-col md:flex-row h-auto min-h-[400px] max-h-[80vh]">
        {/* Left sidebar - Chord categories */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-gray-200 dark:border-metal-darkest pb-4 md:pb-0 md:pr-4">
          <nav className="p-2 space-y-1">
            {chordCategories.map((category, index) => (
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
                  {category.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chord list */}
          {!showDetails ? (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-metal-lightblue mb-4">
                {chordCategories[activeCategory].name}
              </h3>

              {selectedNote && getFilteredChords().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-metal-silver">
                    No chords found for {selectedNote} in this category
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getFilteredChords().map((chord) => (
                  <button
                    key={chord}
                    className={cn(
                      "p-3 text-left rounded-md transition-colors border flex justify-between items-center",
                      selectedChordType === chord
                        ? "bg-blue-50 dark:bg-metal-dark border-blue-200 dark:border-metal-blue"
                        : "border-gray-200 dark:border-metal-darkest hover:bg-gray-50 dark:hover:bg-metal-darkest"
                    )}
                    onClick={() => handleChordSelect(chord)}
                  >
                    <div>
                      <div className="font-medium text-gray-800 dark:text-metal-lightblue">
                        {chord}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-metal-silver mt-1">
                        {CHORDS[chord as keyof typeof CHORDS]?.join(' - ')}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-metal-darker" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chord details view
            <div className="flex-1 overflow-y-auto p-4">
              {chordInfo && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-metal-lightblue">
                        {chordInfo.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-metal-silver mt-1">
                        {chordInfo.name.split(' ').slice(1).join(' ')}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-metal-darkest transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-metal-silver" />
                    </button>
                  </div>

                  {/* Chord notes */}
                  <div className="bg-gray-50 dark:bg-metal-darkest rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-metal-lightblue mb-2">
                          Notes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {chordInfo.notes.map((note, i) => (
                            <div
                              key={i}
                              className={cn(
                                "px-3 py-1 rounded-full text-sm font-medium",
                                i === 0
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 dark:bg-metal-dark text-gray-800 dark:text-metal-silver"
                              )}
                            >
                              {note}
                              <span className="text-xs ml-1 opacity-75">
                                ({chordInfo.intervals[i]})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={playChord}
                        className="p-2 rounded-full bg-blue-500 dark:bg-metal-blue text-white hover:bg-blue-600 dark:hover:bg-metal-lightblue transition-colors"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Chord description */}
                  <div className="bg-white dark:bg-metal-darker border border-gray-200 dark:border-metal-darkest rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 dark:text-metal-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-metal-lightblue mb-2">
                          About this chord
                        </h4>
                        <p className="text-gray-600 dark:text-metal-silver">
                          {chordInfo.description}
                        </p>
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
              {selectedChordType && showDetails && (
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
              
              {selectedChordType && (
                <button
                  onClick={handleApplyChord}
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

export default ChordModal;