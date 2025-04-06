import React, { memo } from 'react';
import Modal from './Modal';
import useGuitarStore from '../../store/useGuitarStore';
import { cn } from '../../lib/utils';
import { SwitchCamera, Sliders, Repeat, Palette, ChevronDown } from 'lucide-react';
import { useMobileDetection } from '../../hooks/useMediaQuery';

interface FretboardDisplayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Predefined colors for the color picker
const colorOptions = [
  { name: "Green", value: "#4CAF50" },
  { name: "Blue", value: "#2196F3" },
  { name: "Red", value: "#F44336" },
  { name: "Purple", value: "#9C27B0" },
  { name: "Orange", value: "#FF9800" },
  { name: "Teal", value: "#009688" },
  { name: "Pink", value: "#E91E63" },
  { name: "Indigo", value: "#3F51B5" },
];

// Multi-color mapping for notes (used in multi-color mode)
export const noteColorMap = {
  'C': '#F44336',
  'C#': '#E91E63',
  'D': '#9C27B0',
  'D#': '#673AB7',
  'E': '#3F51B5',
  'F': '#2196F3',
  'F#': '#03A9F4',
  'G': '#00BCD4',
  'G#': '#009688',
  'A': '#4CAF50',
  'A#': '#8BC34A',
  'B': '#FFC107',
  'Db': '#E91E63',
  'Eb': '#673AB7',
  'Gb': '#03A9F4',
  'Ab': '#009688',
  'Bb': '#8BC34A',
};

const FretboardDisplayModal: React.FC<FretboardDisplayModalProps> = ({ open, onOpenChange }) => {
  const { 
    fretboardOrientation, 
    toggleFretboardOrientation,
    setFretboardOrientation,
    visibleFrets,
    numFrets,
    setVisibleFrets,
    noteColorMode,
    setNoteColorMode,
    noteColor,
    setNoteColor,
  } = useGuitarStore();

  // Use the custom hook instead of useState + useEffect
  const isMobile = useMobileDetection();

  return (
    <Modal
      title="Fretboard Display"
      description="Control panel for fretboard display settings and visualization options"
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-4xl"
    >
      {/* Mobile Pull Handle */}
      {isMobile && (
        <div className="absolute -top-8 left-0 right-0 h-8 flex items-center justify-center">
          <div className="w-12 h-1.5 bg-metal-blue rounded-full" />
          <ChevronDown className="absolute text-metal-blue w-6 h-6" />
        </div>
      )}

      <div className="space-y-6">
        {/* Fretboard Orientation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-metal-silver">
              <SwitchCamera className="w-4 h-4" />
              <span>Fretboard Orientation</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all duration-300",
                  fretboardOrientation === 'standard'
                    ? "bg-metal-blue text-white shadow-neon-blue"
                    : "bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver"
                )}
                onClick={() => setFretboardOrientation('standard')}
              >
                Standard
              </button>
              <button
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all duration-300",
                  fretboardOrientation === 'flipped'
                    ? "bg-metal-blue text-white shadow-neon-blue"
                    : "bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver"
                )}
                onClick={() => setFretboardOrientation('flipped')}
              >
                Flipped
              </button>
            </div>
          </div>
          
          {/* Visual representation of fretboard orientation */}
          <div className="mt-3 p-3 bg-gray-50 dark:bg-metal-darkest rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-metal-silver">String Order:</span>
              <button
                onClick={toggleFretboardOrientation}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-metal-darker rounded hover:bg-gray-200 dark:hover:bg-metal-dark transition-colors"
              >
                <Repeat className="w-3 h-3" />
                <span>Toggle View</span>
              </button>
            </div>
            
            <div className="flex flex-col space-y-2 border border-gray-200 dark:border-metal-darker rounded-md p-2">
              {fretboardOrientation === 'standard' ? (
                <>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">E</span>
                    <span>High E string (thinnest)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">B</span>
                    <span>B string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">G</span>
                    <span>G string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">D</span>
                    <span>D string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">A</span>
                    <span>A string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">E</span>
                    <span>Low E string (thickest)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">E</span>
                    <span>Low E string (thickest)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">A</span>
                    <span>A string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">D</span>
                    <span>D string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">G</span>
                    <span>G string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">B</span>
                    <span>B string</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-metal-silver">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-metal-darker">E</span>
                    <span>High E string (thinnest)</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-metal-silver">
              {fretboardOrientation === 'standard'
                ? "Looking at the guitar fretboard from the player's perspective (standard view)"
                : "Looking at the guitar fretboard from the front of the guitar (flipped view)"}
            </div>
          </div>
        </div>
        
        {/* Note Color Mode Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-metal-silver">
              <Palette className="w-4 h-4" />
              <span>Note Color Style</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all duration-300",
                  noteColorMode === 'single'
                    ? "bg-metal-blue text-white shadow-neon-blue"
                    : "bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver"
                )}
                onClick={() => setNoteColorMode('single')}
              >
                Single Color
              </button>
              <button
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-md transition-all duration-300",
                  noteColorMode === 'multi'
                    ? "bg-metal-blue text-white shadow-neon-blue"
                    : "bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver"
                )}
                onClick={() => setNoteColorMode('multi')}
              >
                Multi Color
              </button>
            </div>
          </div>
          
          {/* Color selection (only show when single color mode is active) */}
          {noteColorMode === 'single' && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-metal-darkest rounded-md">
              <div className="mb-2">
                <span className="text-sm text-gray-700 dark:text-metal-silver">Select Note Color:</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "w-full py-1 px-2 rounded-md text-xs text-white transition-all",
                      noteColor === color.value ? "ring-2 ring-offset-2 ring-blue-500" : ""
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNoteColor(color.value)}
                    title={color.name}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-3 flex items-center">
                <span className="text-xs text-gray-500 dark:text-metal-silver mr-2">Preview:</span>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: noteColor }}
                >
                  C
                </div>
              </div>
            </div>
          )}
          
          {/* Multi-color preview */}
          {noteColorMode === 'multi' && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-metal-darkest rounded-md">
              <div className="mb-2">
                <span className="text-sm text-gray-700 dark:text-metal-silver">Multi-color Mode (each note has its own color):</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(noteColorMap).slice(0, 12).map(([note, color]) => (
                  <div 
                    key={note}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: color }}
                    title={`${note}`}
                  >
                    {note}
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-metal-silver">
                In multi-color mode, each note has a unique color that remains consistent across the fretboard.
              </div>
            </div>
          )}
        </div>
        
        {/* Visible Frets Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-metal-silver">
              <Sliders className="w-4 h-4" />
              <span>Visible Frets</span>
            </label>
            <span className="text-sm font-medium text-metal-blue">{visibleFrets} of {numFrets}</span>
          </div>

          {/* Fret selection buttons */}
          <div className="flex justify-between space-x-2">
            {[4, 12, 15, 19, 24].map(fretCount => (
              <button
                key={fretCount}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-md transition-all duration-300",
                  visibleFrets === fretCount
                    ? "bg-metal-blue text-white shadow-neon-blue"
                    : "bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver"
                )}
                onClick={() => setVisibleFrets(fretCount)}
              >
                {fretCount}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded bg-metal-blue text-white shadow-neon-blue hover:bg-metal-lightblue transition-colors duration-300"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(FretboardDisplayModal);