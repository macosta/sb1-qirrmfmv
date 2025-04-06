import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mic, Clock, Sun, Moon, User, Settings, Sliders, Music } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { InteractiveScalesButton } from './InteractiveScalesButton';
import useGuitarStore from '../../store/useGuitarStore';
import FretboardDisplayModal from './FretboardDisplayModal';
import ProfileModal from './ProfileModal';
import NoteSelector from './NoteSelector';
import { useMobileDetection } from '../../hooks/useMediaQuery';

interface MobileControlPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  showChords: boolean;
  setShowChords: (show: boolean) => void;
}

const MobileControlPanel: React.FC<MobileControlPanelProps> = ({
  isOpen,
  onToggle,
  showChords,
  setShowChords,
}) => {
  // Use the custom hook instead of useState + useEffect
  const isMobile = useMobileDetection();
  
  const {
    mode,
    setMode,
    theme,
    toggleTheme,
    selectedNote,
    selectedScale,
    fretMarkers,
    setFretMarkers,
    showTriads,
    toggleShowTriads,
    showAllNotes,
    toggleShowAllNotes,
    showRoot,
    toggleShowRoot,
    scaleSystem,
    setScaleSystem,
    showNotesBar,
    toggleShowNotesBar
  } = useGuitarStore();

  const [fretModalOpen, setFretModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileOpen(true);
    onToggle(); // Close the mobile menu when opening profile
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation Bar */}
      <div className="bg-gradient-to-r from-metal-darker to-metal-dark border-b border-metal-blue shadow-neon-blue">
        <div className="px-4 py-2 flex items-center justify-between">
          <span 
            className="text-2xl font-bold text-white animate-neon-pulse" 
            style={{ fontFamily: "'Metal Mania', cursive" }}
          >
            Guitar Gods
          </span>

          <div className="flex items-center space-x-2">
            <button
              className={cn(
                "p-2 rounded flex items-center justify-center transition-colors",
                mode === 'tuner' 
                  ? "bg-metal-blue text-white shadow-neon-blue" 
                  : "text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
              )}
              onClick={() => setMode('tuner')}
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              className={cn(
                "p-2 rounded flex items-center justify-center transition-colors",
                mode === 'metronome' 
                  ? "bg-metal-blue text-white shadow-neon-blue" 
                  : "text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
              )}
              onClick={() => setMode('metronome')}
            >
              <Clock className="w-5 h-5" />
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded flex items-center justify-center transition-colors text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <button 
              onClick={handleProfileClick}
              className="p-2 rounded flex items-center justify-center transition-colors text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
              aria-label="User Profile"
            >
              <User className="w-5 h-5" />
            </button>

            <button 
              className="p-2 rounded flex items-center justify-center transition-colors text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Bar Toggle */}
      <button
        onClick={toggleShowNotesBar}
        className="w-full bg-black dark:bg-metal-darker border-b border-metal-blue shadow-neon-blue p-2 flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <Music className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Notes Selection</span>
        </div>
        {showNotesBar ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {showNotesBar && (
          <motion.div
            key="notes-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden bg-black dark:bg-metal-darker border-b border-metal-blue"
          >
            <div className="p-4">
              <NoteSelector />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull handle - now a thin bar */}
      <button
        onClick={onToggle}
        className="absolute -bottom-2 left-0 right-0 h-2 bg-white dark:bg-metal-darker border-x border-b border-metal-blue shadow-neon-blue flex items-center justify-center"
      >
        <div className="w-12 h-1 bg-metal-blue rounded-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white dark:bg-metal-darker border-b border-metal-blue shadow-neon-blue"
          >
            <div className="p-4 space-y-4">
              {/* Harmonic Mode */}
              <div>
                <h3 className="text-sm font-bold text-black dark:text-metal-silver mb-2">
                  Harmonic Mode
                </h3>
                <div className="flex justify-center space-x-2">
                  <InteractiveHoverButton
                    isActive={showChords}
                    onClick={() => setShowChords(!showChords)}
                    setShowChords={setShowChords}
                    className="py-1.5 text-sm"
                  />
                  <InteractiveScalesButton
                    isActive={!!selectedScale}
                    className="py-1.5 text-sm"
                    setShowChords={setShowChords}
                  />
                </div>
              </div>

              {/* Fretboard Markers */}
              <div>
                <h3 className="text-sm font-bold text-black dark:text-metal-silver mb-2">
                  Fretboard Marker
                </h3>
                <ToggleGroup
                  type="single"
                  disabled={!selectedNote || (!showChords && !selectedScale)}
                  value={fretMarkers}
                  onValueChange={(value) => value && setFretMarkers(value as any)}
                  className="bg-black rounded-full p-1 flex flex-wrap justify-center w-full"
                >
                  <ToggleGroupItem value="notes">Notes</ToggleGroupItem>
                  <ToggleGroupItem value="degrees">Degrees</ToggleGroupItem>
                  <ToggleGroupItem value="intervals">Intervals</ToggleGroupItem>
                  <ToggleGroupItem value="none">None</ToggleGroupItem>
                </ToggleGroup>

                {/* Checkboxes */}
                <div className="flex justify-center space-x-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showTriads}
                      onChange={toggleShowTriads}
                      className="form-checkbox h-4 w-4 text-metal-blue rounded border-metal-blue"
                    />
                    <span className="text-sm text-black dark:text-metal-silver">
                      Triads
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showAllNotes}
                      onChange={toggleShowAllNotes}
                      className="form-checkbox h-4 w-4 text-metal-blue rounded border-metal-blue"
                    />
                    <span className="text-sm text-black dark:text-metal-silver">
                      All Notes
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showRoot}
                      onChange={toggleShowRoot}
                      className="form-checkbox h-4 w-4 text-metal-blue rounded border-metal-blue"
                    />
                    <span className="text-sm text-black dark:text-metal-silver">
                      Root
                    </span>
                  </label>
                </div>
              </div>

              {/* Scale Fingering System */}
              <div>
                <h3 className="text-sm font-bold text-black dark:text-metal-silver mb-2">
                  Scale Fingering System
                </h3>
                <ToggleGroup
                  type="single"
                  value={scaleSystem}
                  onValueChange={(value) => value && setScaleSystem(value as any)}
                  className="bg-black rounded-full p-1 flex justify-center w-full"
                >
                  <ToggleGroupItem value="3nps">3nps</ToggleGroupItem>
                  <ToggleGroupItem value="caged">CAGED</ToggleGroupItem>
                  <ToggleGroupItem value="none">None</ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Fretboard Display Button */}
              <button
                onClick={() => setFretModalOpen(true)}
                className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver rounded-md hover:bg-gray-200 dark:hover:bg-metal-dark transition-colors"
              >
                <Sliders className="w-4 h-4" />
                <span>Fretboard Controls</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fretboard Display Modal */}
      <FretboardDisplayModal 
        open={fretModalOpen} 
        onOpenChange={setFretModalOpen}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </div>
  );
};

export default MobileControlPanel;