import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import ScalesModal from './ScalesModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { useMobileDetection } from '../../hooks/useMediaQuery';

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
  const [showScalesModal, setShowScalesModal] = useState(false);
  
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
  
  // Determine if the button should be disabled (when no root note is selected)
  const isDisabled = !selectedNote;

  // Handle button click - open the modal
  const handleButtonClick = () => {
    // Log for debugging
    console.log("[Scales Button] Button clicked", { isDisabled, selectedNote, isActive });
    
    if (isDisabled) {
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

  // Determine button text based on device and state
  const buttonText = isDisabled && isMobile 
    ? "Select Root" 
    : "Scales";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
            disabled={isDisabled}
          >
            {buttonText}
          </button>
        </TooltipTrigger>
        {isDisabled && !isMobile && (
          <TooltipContent side="bottom" className="max-w-xs">
            <p>Select a root note first to view scale positions</p>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Scales modal dialog */}
      <ScalesModal 
        isOpen={showScalesModal} 
        onClose={() => setShowScalesModal(false)} 
      />
    </TooltipProvider>
  );
};