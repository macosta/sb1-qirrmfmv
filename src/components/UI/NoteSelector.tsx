import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { NOTES } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';

interface NoteSelectorProps {
  onNoteSelected?: () => void;
}

const NoteSelector: React.FC<NoteSelectorProps> = ({ onNoteSelected }) => {
  const { selectedNote, setSelectedNote, showNotesBar } = useGuitarStore();
  
  // Handle note click with callback for better performance
  const handleNoteClick = useCallback((note: string) => {
    setSelectedNote(note);
    // Call the onNoteSelected callback if provided
    if (onNoteSelected) {
      onNoteSelected();
    }
  }, [setSelectedNote, onNoteSelected]);
  
  // Format note text to handle sharps correctly
  const formatNoteText = useCallback((note: string) => {
    if (note.includes('#')) {
      return (
        <>
          {note.replace('#', '')}<sup className="text-xs">♯</sup>
        </>
      );
    }
    return note;
  }, []);
  
  // Memoize the note buttons to prevent unnecessary re-renders
  const noteButtons = useMemo(() => {
    return NOTES.map(note => (
      <button
        key={note}
        className={cn(
          "py-1.5 px-2 rounded transition-all duration-300 text-center font-semibold text-sm",
          "min-h-8", // Reduced height for mobile
          "focus:outline-none focus:ring-2 focus:ring-metal-blue focus:ring-opacity-50",
          "aria-pressed:scale-95", // Visual feedback when clicking
          selectedNote === note
            ? "bg-metal-blue text-white" 
            : "bg-metal-darkest text-metal-silver hover:bg-metal-highlight hover:text-black"
        )}
        onClick={() => handleNoteClick(note)}
        aria-pressed={selectedNote === note}
        aria-label={`Select ${note} note`}
      >
        {formatNoteText(note)}
      </button>
    ));
  }, [selectedNote, handleNoteClick, formatNoteText]);
  
  // If notes bar is hidden, don't render anything
  if (!showNotesBar) return null;

  return (
    <div className="w-full text-white">
      <div className="flex flex-col md:flex-row items-center gap-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
        <span className="text-metal-silver mr-2 uppercase tracking-wider mb-1 md:mb-0 text-xs">Select Root Note:</span>
        
        <div className="grid grid-cols-6 gap-1 w-full">
          {noteButtons}
        </div>
      </div>
      {!selectedNote && (
        <div className="mt-2 text-center text-amber-400 text-xs animate-pulse">
          👆 Select a root note above to enable chord and scale visualizations
        </div>
      )}
    </div>
  );
};

export default memo(NoteSelector);