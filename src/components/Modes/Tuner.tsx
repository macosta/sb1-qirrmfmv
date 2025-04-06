import React, { useEffect, useState, useCallback, memo } from 'react';
import { cn, STANDARD_TUNING, frequencyToNote } from '../../lib/utils';
import { useTuner } from '../../hooks/useAudio';
import { Mic, MicOff, Repeat } from 'lucide-react';

const StringIndicator: React.FC<{ 
  note: string, 
  stringName: string,
  isHighlighted: boolean,
  isSelected: boolean, 
  onClick: () => void 
}> = memo(({ note, stringName, isHighlighted, isSelected, onClick }) => (
  <button
    className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
      isSelected 
        ? "border-primary-500 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
        : isHighlighted
        ? "border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 animate-pulse"
        : "border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700"
    )}
    onClick={onClick}
    aria-label={`Select ${stringName} string`}
    aria-pressed={isSelected}
  >
    {note}
  </button>
));

StringIndicator.displayName = 'StringIndicator';

const Tuner: React.FC = () => {
  const { isListening, frequency, startListening, stopListening } = useTuner();
  const [targetString, setTargetString] = useState(0); // 0 = high E, 5 = low E
  const [note, setNote] = useState<{ note: string; octave: number; cents: number } | null>(null);
  const [highlightedString, setHighlightedString] = useState<string | null>(null);
  const [tunerHistory, setTunerHistory] = useState<number[]>([]);
  const [isTunerStable, setIsTunerStable] = useState(false);
  
  // Get standard tuning (E, B, G, D, A, E)
  const tuning = STANDARD_TUNING;
  
  // Guitar string notes in display order (high E to low E)
  const displayStrings = ['E', 'B', 'G', 'D', 'A', 'E'];
  
  // Process frequency data and update tuner state
  useEffect(() => {
    if (frequency) {
      const detected = frequencyToNote(frequency);
      
      // Update tuner history for stability calculation
      setTunerHistory(prev => {
        const newHistory = [...prev, frequency];
        if (newHistory.length > 10) {
          newHistory.shift();
        }
        return newHistory;
      });
      
      // Calculate if the tuner reading is stable
      if (tunerHistory.length >= 5) {
        const recentValues = tunerHistory.slice(-5);
        const avg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
        const maxDiff = Math.max(...recentValues.map(val => Math.abs(val - avg)));
        
        // If all recent values are within 1Hz of the average, consider it stable
        setIsTunerStable(maxDiff < 1);
      }
      
      // Check which string this note is closest to
      const closestString = displayStrings.findIndex(stringNote => 
        stringNote === detected.note
      );
      
      setHighlightedString(detected.note);
      setNote(detected);
    } else {
      setHighlightedString(null);
      setNote(null);
      setTunerHistory([]);
      setIsTunerStable(false);
    }
  }, [frequency, displayStrings, tunerHistory]);
  
  // Calculate tuning status
  const isInTune = note && Math.abs(note.cents) < 5;
  const isTooLow = note && note.cents < -5;
  const isTooHigh = note && note.cents > 5;
  
  // Handle string selection
  const handleSelectString = useCallback((index: number) => {
    setTargetString(index);
  }, []);
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Guitar Tuner</h2>
        
        <button 
          className={cn(
            "p-3 rounded-full transition-colors",
            isListening ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary-500 hover:bg-primary-600 text-white"
          )}
          onClick={isListening ? stopListening : startListening}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <div className={cn(
            "text-6xl font-bold mb-2 transition-all",
            isTunerStable && isInTune ? "text-green-500 scale-110" : "",
            isTunerStable && isTooLow ? "text-blue-500" : "",
            isTunerStable && isTooHigh ? "text-red-500" : ""
          )}>
            {note ? note.note : '--'}
          </div>
          <div className="text-sm text-gray-500">
            {note ? `Octave: ${note.octave}` : 'Play a string'}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
          <div 
            className={cn(
              "absolute top-0 bottom-0 w-1 bg-primary-500 transition-all",
              !note && "opacity-0",
              isTunerStable && "w-2"
            )}
            style={{ 
              left: note ? `calc(50% + ${note.cents * 1.5}px)` : '50%',
              transform: 'translateX(-50%)'
            }}
          />
          
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400 dark:bg-gray-500" />
          
          <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gray-400 dark:bg-gray-500" />
          <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gray-400 dark:bg-gray-500" />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>-50 cents</span>
          <span className={cn(isInTune && isTunerStable && "text-green-500 font-bold")}>Perfect</span>
          <span>+50 cents</span>
        </div>
        
        <div className="mt-4 text-center">
          {isTooLow && (
            <div className="flex items-center justify-center text-blue-500">
              <span>Tune higher</span>
              <span className="inline-block ml-1 transform -rotate-90">↑</span>
            </div>
          )}
          {isInTune && isTunerStable && (
            <div className="text-green-500 flex items-center justify-center">
              <span>In tune!</span>
              <span className="ml-1">✓</span>
            </div>
          )}
          {isTooHigh && (
            <div className="flex items-center justify-center text-red-500">
              <span>Tune lower</span>
              <span className="inline-block ml-1 transform rotate-90">↑</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Choose String</h3>
        
        <div className="flex justify-center space-x-2">
          {displayStrings.map((stringNote, i) => (
            <StringIndicator
              key={i}
              note={stringNote}
              stringName={i === 0 ? "high E" : i === 5 ? "low E" : stringNote}
              isHighlighted={stringNote === highlightedString && isTunerStable}
              isSelected={targetString === i}
              onClick={() => handleSelectString(i)}
            />
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Target: {displayStrings[targetString]} string</p>
        </div>
        
        {/* Reference pitch button */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md flex items-center space-x-2 transition-colors"
            onClick={() => {
              // This would play a reference tone for the selected string
              // Implement with Web Audio API later
              console.log(`Play reference tone for ${displayStrings[targetString]} string`);
            }}
            aria-label={`Play reference tone for ${displayStrings[targetString]} string`}
          >
            <Repeat className="w-4 h-4" />
            <span>Play Reference Tone</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Tuner);