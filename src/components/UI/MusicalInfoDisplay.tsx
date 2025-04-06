import React from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileDetection } from '../../hooks/useMediaQuery';

interface MusicalInfoDisplayProps {
  selectedNote: string | null;
  selectedScale: string | null;
  selectedChord: string | null;
  className?: string;
}

// Helper function to get mode name from scale
const getModeName = (scale: string) => {
  if (!scale) return null;
  if (scale.includes('Major')) return 'Ionian Mode';
  if (scale.includes('Minor')) return 'Aeolian Mode';
  if (scale.includes('Dorian')) return 'Dorian Mode';
  if (scale.includes('Phrygian')) return 'Phrygian Mode';
  if (scale.includes('Lydian')) return 'Lydian Mode';
  if (scale.includes('Mixolydian')) return 'Mixolydian Mode';
  if (scale.includes('Locrian')) return 'Locrian Mode';
  return null;
};

const MusicalInfoDisplay: React.FC<MusicalInfoDisplayProps> = ({
  selectedNote,
  selectedScale,
  selectedChord,
  className,
}) => {
  const hasInfo = selectedNote || selectedScale || selectedChord;
  const isMobile = useMobileDetection();
  
  if (!hasInfo) return null;

  const InfoPill: React.FC<{
    label: string;
    value: string;
  }> = ({ label, value }) => (
    <div 
      className={cn(
        "flex-shrink-0 px-4 py-1.5",
        "bg-gray-100 dark:bg-metal-darker",
        "rounded-full border border-gray-200 dark:border-metal-blue",
        "transition-colors duration-300"
      )}
    >
      <span className={cn(
        "font-medium",
        isMobile ? "text-sm" : "text-base",
        "text-gray-700 dark:text-metal-silver"
      )}>
        {label}: <span className="text-metal-blue">{value}</span>
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center",
          isMobile 
            ? "space-x-2 overflow-x-auto scrollbar-hide pb-2" 
            : "space-x-3",
          className
        )}
      >
        {selectedNote && (
          <InfoPill label="Root" value={selectedNote} />
        )}
        
        {selectedScale && (
          <InfoPill 
            label="Scale" 
            value={selectedScale.split(' ').slice(1).join(' ')} 
          />
        )}
        
        {selectedScale && getModeName(selectedScale) && (
          <InfoPill 
            label="Mode" 
            value={getModeName(selectedScale)!} 
          />
        )}
        
        {selectedChord && (
          <InfoPill label="Chord" value={selectedChord} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MusicalInfoDisplay;