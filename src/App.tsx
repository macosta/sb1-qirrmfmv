import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGuitarStore from './store/useGuitarStore';
import { cn } from './lib/utils';
import { useStringAudio } from './hooks/useAudio';
import { Music, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './components/UI/ToggleGroup';
import { InteractiveHoverButton } from './components/UI/InteractiveHoverButton';
import { InteractiveScalesButton } from './components/UI/InteractiveScalesButton';
import MusicalInfoDisplay from './components/UI/MusicalInfoDisplay';
import { useMobileDetection } from './hooks/useMediaQuery';
import ErrorBoundary from './components/ErrorBoundary';
import { Card, CardContent } from './components/UI/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/UI/tooltip';
import { Button } from './components/UI/button';

// Components
import NoteSelector from './components/UI/NoteSelector';
import Fretboard from './components/Guitar/Fretboard';
import ChordLearner from './components/Modes/ChordLearner';
import Tuner from './components/Modes/Tuner';
import Metronome from './components/Modes/Metronome';
import Navigation from './components/UI/Navigation';
import FretboardDisplayModal from './components/UI/FretboardDisplayModal';
import MobileControlPanel from './components/UI/MobileControlPanel';
import FretboardControlsModal from './components/UI/FretboardControlsModal';

// Lazy-loaded components
const Scales = lazy(() => import('./components/Modes/Scales'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="p-6 bg-white dark:bg-metal-darker rounded-lg shadow-md dark:shadow-neon-blue dark:border dark:border-metal-blue">
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metal-blue"></div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-metal-lightblue">Loading...</h2>
    </div>
  </div>
);

function App() {
  const { 
    mode,
    theme, 
    selectedNote, 
    selectedScale,
    selectedChord,
    fretMarkers, 
    setFretMarkers,
    showTriads,
    toggleShowTriads,
    toggleShowAllNotes,
    toggleShowRoot,
    scaleSystem,
    setScaleSystem,
    setFretboardOrientation,
    showNotesBar,
    toggleShowNotesBar
  } = useGuitarStore();
  
  const [showChords, setShowChords] = useState(false);
  const [fretModalOpen, setFretModalOpen] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [controlsModalOpen, setControlsModalOpen] = useState(false);
  const { playString } = useStringAudio();
  
  // Use the custom hook for mobile detection
  const isMobile = useMobileDetection();
  
  useEffect(() => {
    // Set appropriate fretboard orientation for mobile
    if (isMobile) {
      setFretboardOrientation('standard');
      setMobileControlsOpen(false);
      
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(() => {
          console.log('Screen orientation lock not supported');
        });
      }
    }
    
    // Trigger a resize event to ensure all components adjust
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, [isMobile, setFretboardOrientation]);

  return (
    <TooltipProvider>
      <div className={cn(
        "min-h-screen bg-gray-50 dark:bg-metal-dark text-gray-900 dark:text-gray-100 transition-colors duration-300",
        isMobile && "mobile-layout"
      )}>
        {/* Main Navigation Bar - Only show on desktop */}
        {!isMobile && <Navigation />}
        
        {/* Mobile Control Panel */}
        {isMobile && (
          <MobileControlPanel
            isOpen={mobileControlsOpen}
            onToggle={() => setMobileControlsOpen(!mobileControlsOpen)}
            showChords={showChords}
            setShowChords={setShowChords}
          />
        )}
        
        {/* Note Selection Bar */}
        <div className={cn(
          "relative",
          isMobile && "mt-14" // Add margin for mobile header
        )}>
          <button
            onClick={toggleShowNotesBar}
            className="w-full bg-black dark:bg-metal-darker border-b border-metal-blue shadow-neon-blue p-2 flex items-center justify-between"
            aria-expanded={showNotesBar}
            aria-controls="notes-bar"
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
                id="notes-bar"
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
        </div>
      
        <div className={cn(
          "max-w-full mx-auto px-4 py-6",
          isMobile && "pt-4" // Reduced padding for mobile
        )}>
          <div className="w-full">
            {/* Main content */}
            <div className="space-y-6">
              {/* Desktop Control Panel */}
              {!isMobile && (
                <div className="relative flex flex-col md:flex-row justify-between md:items-center mb-2 py-1 px-2 bg-white dark:bg-metal-darkest border dark:border-metal-blue rounded-lg shadow-sm dark:shadow-neon-blue transition-colors duration-300">
                  {/* Musical Information Display */}
                  <MusicalInfoDisplay
                    selectedNote={selectedNote}
                    selectedScale={selectedScale}
                    selectedChord={selectedChord}
                    className="px-3"
                  />

                  {/* Controls Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setControlsModalOpen(true)}
                        variant="default"
                        size="default"
                        className="font-metal-mania ml-auto shadow-neon-blue"
                        aria-label="Open fretboard controls"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Fretboard Controls</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Manage fretboard display settings and markers</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}

              {/* Guitar visualization */}
              <Card className={cn(
                "transition-all duration-300",
                isMobile && "h-[calc(100vh-12rem)] mt-0"
              )}>
                <CardContent className="p-4 overflow-x-auto">
                  <ErrorBoundary>
                    {mode === 'fretboard' && (
                      <Fretboard showChords={showChords} setShowChords={setShowChords} />
                    )}
                    {mode === 'chords' && <ChordLearner />}
                    {mode === 'scales' && (
                      <Suspense fallback={<LoadingFallback />}>
                        <Scales />
                      </Suspense>
                    )}
                    {mode === 'tuner' && <Tuner />}
                    {mode === 'metronome' && <Metronome />}
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Fretboard Display Modal */}
        <FretboardDisplayModal 
          open={fretModalOpen} 
          onOpenChange={setFretModalOpen}
        />

        {/* Fretboard Controls Modal */}
        <FretboardControlsModal
          open={controlsModalOpen}
          onOpenChange={setControlsModalOpen}
          showChords={showChords}
          setShowChords={setShowChords}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;