import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import ChordModal from './ChordModal';

interface InteractiveHoverButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  setShowChords?: (show: boolean) => void;
}

export const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  isActive = false,
  onClick,
  className,
  setShowChords
}) => {
  const { selectedNote, setSelectedChord } = useGuitarStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showChordModal, setShowChordModal] = useState(false);
  
  // Determine if the button should be disabled (when no root note is selected)
  const isDisabled = !selectedNote;

  // Debug values
  const [isClicked, setIsClicked] = useState(false);
  
  // Reset click state after visual feedback
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  // Handle button click
  const handleButtonClick = () => {
    // Log for debugging
    console.log("[Chord Button] Button clicked", { isDisabled, selectedNote, isActive });
    
    if (isDisabled) {
      // Show tooltip when disabled button is clicked
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000); // Hide after 3 seconds
      return;
    }
    
    setIsClicked(true);
    
    // Open the chord modal
    setShowChordModal(true);
    
    // Toggle chord display if directly requested
    if (onClick) {
      console.log("[Chord Button] Calling provided onClick handler");
      onClick();
    }
    
    // Update chord visibility if handler is provided
    if (setShowChords) {
      console.log("[Chord Button] Calling setShowChords with", true);
      setShowChords(true);
    }
  };

  return (
    <div className="relative">
      {/* Main button - with fully rounded edges */}
      <button
        className={cn(
          "px-3 py-1.5 text-sm rounded-full bg-black text-white hover:bg-metal-darkest transition-colors",
          isActive && !isDisabled && "border-2 border-metal-blue shadow-neon-blue",
          !isActive && "border border-metal-blue",
          isDisabled && "opacity-60 cursor-not-allowed",
          isClicked && "animate-pulse",
          className
        )}
        onClick={handleButtonClick}
        aria-disabled={isDisabled}
        title={isDisabled ? "Select a root note first to enable chord display" : "Show chord positions on the fretboard"}
      >
        Chords
      </button>

      {/* Tooltip - positioned below the button */}
      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-56 rounded-md bg-black text-white text-xs p-2 shadow-lg z-50">
          Please select a root note first to view chord positions
          <div className="absolute left-4 top-0 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
        </div>
      )}

      {/* Chord modal dialog */}
      <ChordModal 
        isOpen={showChordModal} 
        onClose={() => setShowChordModal(false)}
        setSelectedChord={setSelectedChord}
        setShowChords={setShowChords}
      />
    </div>
  );
};