import React, { useState, useCallback, memo } from 'react';
import { cn } from '../../lib/utils';
import { useMetronome } from '../../hooks/useAudio';
import { Play, Pause, Minus, Plus, Music } from 'lucide-react';

const MetronomeBeat: React.FC<{ active: boolean; first: boolean }> = memo(({ active, first }) => (
  <div 
    className={cn(
      "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
      active ? "scale-110" : "scale-100",
      first 
        ? active 
          ? "bg-primary-500 border-primary-600 text-white" 
          : "border-primary-500 text-primary-500"
        : active 
          ? "bg-secondary-500 border-secondary-600 text-white" 
          : "border-secondary-500 text-secondary-500"
    )}
  >
    <Music className={cn("w-4 h-4", active ? "animate-pulse" : "")} />
  </div>
));

MetronomeBeat.displayName = 'MetronomeBeat';

const Metronome: React.FC = () => {
  const { 
    isPlaying, 
    bpm, 
    beatsPerMeasure, 
    currentBeat, 
    startMetronome, 
    stopMetronome, 
    updateBpm,
    setBeatsPerMeasure
  } = useMetronome();
  
  const timeSignatures = [2, 3, 4, 5, 6, 7, 8];
  const [selectedTimeSignature, setSelectedTimeSignature] = useState(2); // index in timeSignatures
  const [customBpm, setCustomBpm] = useState<string>(bpm.toString());
  const [isCustomBpmFocused, setIsCustomBpmFocused] = useState(false);
  
  const handleTimeSignatureChange = useCallback((index: number) => {
    setSelectedTimeSignature(index);
    setBeatsPerMeasure(timeSignatures[index]);
  }, [timeSignatures, setBeatsPerMeasure]);
  
  const handleBpmChange = useCallback((delta: number) => {
    const newBpm = Math.max(30, Math.min(250, bpm + delta));
    updateBpm(newBpm);
    setCustomBpm(newBpm.toString());
  }, [bpm, updateBpm]);
  
  const handleCustomBpmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric input
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomBpm(value);
  }, []);
  
  const handleCustomBpmBlur = useCallback(() => {
    setIsCustomBpmFocused(false);
    
    // Make sure the BPM is within valid range
    let newBpm = parseInt(customBpm, 10);
    if (isNaN(newBpm)) {
      newBpm = 120; // Default if invalid
    } else {
      newBpm = Math.max(30, Math.min(250, newBpm));
    }
    
    updateBpm(newBpm);
    setCustomBpm(newBpm.toString());
  }, [customBpm, updateBpm]);
  
  const handleCustomBpmKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCustomBpmBlur();
    }
  }, [handleCustomBpmBlur]);
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Metronome</h2>
        
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleBpmChange(-1)}
            aria-label="Decrease BPM by 1"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <div className="px-4 py-1 bg-primary-100 dark:bg-primary-900 rounded-md min-w-[80px] text-center">
            <input
              type="text" 
              value={customBpm}
              onChange={handleCustomBpmChange}
              onFocus={() => setIsCustomBpmFocused(true)}
              onBlur={handleCustomBpmBlur}
              onKeyDown={handleCustomBpmKeyDown}
              className={cn(
                "w-full bg-transparent text-center font-semibold focus:outline-none",
                isCustomBpmFocused ? "border-b border-primary-500" : "",
                "text-primary-800 dark:text-primary-200"
              )}
              aria-label="Beats Per Minute"
              inputMode="numeric"
            />
            <div className="text-xs text-primary-700 dark:text-primary-300">BPM</div>
          </div>
          
          <button 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleBpmChange(1)}
            aria-label="Increase BPM by 1"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* BPM control */}
      <div className="mb-6">
        <div 
          className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full relative cursor-pointer"
          role="slider"
          aria-valuemin={30}
          aria-valuemax={250}
          aria-valuenow={bpm}
          aria-label="BPM Slider"
          onClick={(e) => {
            const slider = e.currentTarget;
            const rect = slider.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const newBpm = Math.round(30 + position * (250 - 30));
            updateBpm(newBpm);
            setCustomBpm(newBpm.toString());
          }}
        >
          <div 
            className="absolute top-0 bottom-0 left-0 bg-primary-500 rounded-full"
            style={{ width: `${((bpm - 30) / (250 - 30)) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-4 h-4 bg-white border-2 border-primary-500 rounded-full transform -translate-y-1/4"
            style={{ left: `calc(${((bpm - 30) / (250 - 30)) * 100}% - 8px)` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>30</span>
          <span>BPM</span>
          <span>250</span>
        </div>
        
        <div className="flex justify-center space-x-3 mt-6">
          <button 
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-md"
            onClick={() => handleBpmChange(-5)}
            aria-label="Decrease BPM by 5"
          >
            -5
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-md"
            onClick={() => handleBpmChange(-1)}
            aria-label="Decrease BPM by 1"
          >
            -1
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-md"
            onClick={() => handleBpmChange(1)}
            aria-label="Increase BPM by 1"
          >
            +1
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-md"
            onClick={() => handleBpmChange(5)}
            aria-label="Increase BPM by 5"
          >
            +5
          </button>
        </div>
      </div>
      
      {/* Time signature selection */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Time Signature</h3>
        <div className="flex justify-center space-x-2">
          {timeSignatures.map((ts, i) => (
            <button 
              key={i}
              className={cn(
                "w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors",
                selectedTimeSignature === i
                  ? "border-primary-500 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 font-bold"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
              )}
              onClick={() => handleTimeSignatureChange(i)}
              aria-label={`${ts}/4 time signature`}
              aria-pressed={selectedTimeSignature === i}
            >
              {ts}/4
            </button>
          ))}
        </div>
      </div>
      
      {/* Beat visualization */}
      <div className="mb-6">
        <div className="flex justify-center space-x-3 mb-8">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <MetronomeBeat 
              key={i}
              active={isPlaying && currentBeat === i}
              first={i === 0}
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            className={cn(
              "px-6 py-3 rounded-full flex items-center space-x-2 text-white transition-colors",
              isPlaying 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-primary-500 hover:bg-primary-600"
            )}
            onClick={isPlaying ? stopMetronome : startMetronome}
            aria-label={isPlaying ? "Stop metronome" : "Start metronome"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Tempo presets */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Common Tempos</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Largo', bpm: 50 },
            { name: 'Adagio', bpm: 70 },
            { name: 'Andante', bpm: 90 },
            { name: 'Moderato', bpm: 110 },
            { name: 'Allegro', bpm: 130 },
            { name: 'Vivace', bpm: 160 }
          ].map((tempo) => (
            <button
              key={tempo.name}
              className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-center transition-colors"
              onClick={() => {
                updateBpm(tempo.bpm);
                setCustomBpm(tempo.bpm.toString());
              }}
              aria-label={`${tempo.name} tempo (${tempo.bpm} BPM)`}
            >
              {tempo.name} ({tempo.bpm})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Metronome);