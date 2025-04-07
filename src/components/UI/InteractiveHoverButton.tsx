import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import ChordModal from './ChordModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { useMobileDetection } from '../../hooks/useMediaQuery';

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
  const [showChordModal, setShowChordModal] = useState(false);
  
  // Determine if the button should be disabled (when no root note is selected)
  const isDisabled = !selectedNote;

  // Debug values
  const [isClicked, setIsClicked] = useState(false);
  
  // Detect mobile device for UI adaptation
  const isMobile = useMobileDetection();
  
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

  // Determine button text based on device and state
  const buttonText = isDisabled && isMobile 
    ? "Select Root" 
    : "Chords";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
            disabled={isDisabled}
          >
            {buttonText}
          </button>
        </TooltipTrigger>
        {isDisabled && !isMobile && (
          <TooltipContent side="bottom" className="max-w-xs">
            <p>Select a root note first to enable chord display</p>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Chord modal dialog */}
      <ChordModal 
        isOpen={showChordModal} 
        onClose={() => setShowChordModal(false)}
        setSelectedChord={setSelectedChord}
        setShowChords={setShowChords}
      />
    </TooltipProvider>
  );
};