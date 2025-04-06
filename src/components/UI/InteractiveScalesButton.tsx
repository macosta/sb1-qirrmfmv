import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import ScalesModal from './ScalesModal';

interface InteractiveScalesButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  setShowChords?: (show: boolean) => void;
}

export const InteractiveScalesButton: React.FC<InteractiveScalesButtonProps> = ({
  isActive = false,
  onClick,
  className,
  setShowChords
}) => {
  const { selectedNote } = useGuitarStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showScalesModal, setShowScalesModal] = useState(false);
  
  // Debug values
  const [isClicked, setIsClicked] = useState(false);
  
  // Reset click state after visual feedback
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);
  
  // Determine if the button should be disabled (when no root note is selected)
  const isDisabled = !selectedNote;

  // Handle button click - open the modal
  const handleButtonClick = () => {
    // Log for debugging
    console.log("[Scales Button] Button clicked", { isDisabled, selectedNote, isActive });
    
    if (isDisabled) {
      // Show tooltip when disabled button is clicked
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000); // Hide after 3 seconds
      return;
    }
    
    setIsClicked(true);
    
    // Open the scales modal
    setShowScalesModal(true);
    
    // Call onClick if provided
    if (onClick) {
      console.log("[Scales Button] Calling provided onClick handler");
      onClick();
    }
    
    // Turn off chords mode when scales is selected
    if (setShowChords) {
      console.log("[Scales Button] Calling setShowChords with", false);
      setShowChords(false);
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
          isDisabled && "opacity-70 cursor-not-allowed border-metal-darkest",
          isClicked && "animate-pulse",
          className
        )}
        onClick={handleButtonClick}
        aria-disabled={isDisabled}
        title={isDisabled ? "Select a root note first to enable scale display" : "Show scale positions on the fretboard"}
      >
        Scales
      </button>

      {/* Tooltip - positioned below the button */}
      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-56 rounded-md bg-black text-white text-xs p-2 shadow-lg z-50">
          Please select a root note first to view scale positions
          <div className="absolute left-4 top-0 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
        </div>
      )}

      {/* Scales modal dialog */}
      <ScalesModal 
        isOpen={showScalesModal} 
        onClose={() => setShowScalesModal(false)} 
      />
    </div>
  );
};