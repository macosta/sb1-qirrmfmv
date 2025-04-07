import React, { useState } from 'react';
import { Zap, Sliders, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import useGuitarStore from '../../store/useGuitarStore';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { InteractiveScalesButton } from './InteractiveScalesButton';
import Modal from './Modal';
import FretboardDisplayModal from './FretboardDisplayModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface FretboardControlsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showChords: boolean;
  setShowChords: (show: boolean) => void;
}

const FretboardControlsModal: React.FC<FretboardControlsModalProps> = ({
  open,
  onOpenChange,
  showChords,
  setShowChords,
}) => {
  const {
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
  } = useGuitarStore();

  const [fretModalOpen, setFretModalOpen] = useState(false);
  
  // Determine if the controls should be disabled
  const isDisabled = !selectedNote;
  
  // If there's no selected note, show guidance message
  if (isDisabled) {
    return (
      <Modal
        title="Fretboard Controls"
        description="Control panel for fretboard display settings and visualization options"
        open={open}
        onOpenChange={onOpenChange}
        size="md"
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <AlertCircle className="text-amber-500 w-12 h-12" />
          <h2 className="text-xl font-medium text-gray-800 dark:text-metal-lightblue">
            Root Note Required
          </h2>
          <p className="text-center text-gray-600 dark:text-metal-silver">
            Please select a root note first to access fretboard controls.
          </p>
          <button 
            onClick={() => onOpenChange(false)}
            className="mt-4 px-4 py-2 bg-metal-blue text-white rounded-md hover:bg-metal-lightblue transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Fretboard Controls"
      description="Control panel for fretboard display settings and visualization options"
      open={open}
      onOpenChange={onOpenChange}
      size="md"
    >
      <div className="space-y-6">
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
          <h3 className="text-sm font-bold text-black dark:text-metal-silver mb-2" id="markers-label">
            Fretboard Marker
          </h3>
          <ToggleGroup
            type="single"
            disabled={!selectedNote || (!showChords && !selectedScale)}
            value={fretMarkers}
            onValueChange={(value) => value && setFretMarkers(value as any)}
            className="bg-black rounded-full p-1 flex flex-wrap justify-center w-full"
            aria-labelledby="markers-label"
          >
            <ToggleGroupItem value="notes" aria-label="Show note names">Notes</ToggleGroupItem>
            <ToggleGroupItem value="degrees" aria-label="Show scale degrees">Degrees</ToggleGroupItem>
            <ToggleGroupItem value="intervals" aria-label="Show intervals">Intervals</ToggleGroupItem>
            <ToggleGroupItem value="none" aria-label="Hide note markers">None</ToggleGroupItem>
          </ToggleGroup>

          {/* Checkboxes */}
          <div className="flex flex-col space-y-2 mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTriads}
                onChange={toggleShowTriads}
                className="form-checkbox h-4 w-4 text-metal-blue rounded border-metal-blue"
                aria-label="Show triads only"
              />
              <span className="text-sm text-black dark:text-metal-silver">Triads</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAllNotes}
                onChange={toggleShowAllNotes}
                className="form-checkbox h-4 w-4 text-metal-blue rounded border-metal-blue"
                aria-label="Show all notes"
              />
              <span className="text-sm text-black dark:text-metal-silver">All Notes</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRoot}
                onChange={toggleShowRoot}
                className="form-checkbox h-4 w-4 text-metal-blue rounded border-metal-blue"
                aria-label="Show root notes"
              />
              <span className="text-sm text-black dark:text-metal-silver">Root</span>
            </label>
          </div>
        </div>

        {/* Scale Fingering System */}
        <div>
          <h3 className="text-sm font-bold text-black dark:text-metal-silver mb-2" id="scale-system-label">
            Scale Fingering System
          </h3>
          <ToggleGroup
            type="single"
            value={scaleSystem}
            onValueChange={(value) => value && setScaleSystem(value as any)}
            className="bg-black rounded-full p-1 flex justify-center w-full"
            aria-labelledby="scale-system-label"
          >
            <ToggleGroupItem value="3nps" aria-label="Three notes per string system">3nps</ToggleGroupItem>
            <ToggleGroupItem value="caged" aria-label="CAGED system">CAGED</ToggleGroupItem>
            <ToggleGroupItem value="none" aria-label="No fingering system">None</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Fretboard Display Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setFretModalOpen(true)}
                className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver rounded-md hover:bg-gray-200 dark:hover:bg-metal-dark transition-colors"
                aria-label="Open fretboard display settings"
              >
                <Sliders className="w-4 h-4" />
                <span>Fretboard Display</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Adjust fretboard appearance and note coloring</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Fretboard Display Modal */}
      <FretboardDisplayModal 
        open={fretModalOpen} 
        onOpenChange={setFretModalOpen}
      />
    </Modal>
  );
};

export default React.memo(FretboardControlsModal);