import React, { useState } from 'react';
import ChordDiagram from '../Chords/ChordDiagram';
import useGuitarStore from '../../store/useGuitarStore';
import { Music, ArrowLeftRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NOTES } from '../../lib/utils';

const ChordLearner: React.FC = () => {
  const { selectedNote, setSelectedNote } = useGuitarStore();
  const [selectedChordType, setSelectedChordType] = useState<'Major' | 'Minor'>('Major');
  
  const chordTypes = ['Major', 'Minor'] as const;
  
  // Update the chord when note or type changes
  const handleSelectChord = (note: string) => {
    setSelectedNote(note);
  };
  
  // Toggle between Major and Minor
  const toggleChordType = () => {
    setSelectedChordType(prev => prev === 'Major' ? 'Minor' : 'Major');
  };
  
  return (
    <div className="p-6 bg-white dark:bg-metal-darker rounded-lg shadow-md dark:shadow-neon-blue dark:border dark:border-metal-blue">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-metal-lightblue">
          Chord Explorer
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-metal-blue" />
            <span className="font-medium">Root: </span>
            <span className="font-bold">{selectedNote || 'None Selected'}</span>
          </div>
          
          <button 
            onClick={toggleChordType}
            className="flex items-center space-x-2 px-3 py-1.5 bg-metal-darkest text-white rounded-md hover:bg-metal-dark"
          >
            <span>{selectedChordType}</span>
            <ArrowLeftRight className="w-4 h-4" />
            <span>{selectedChordType === 'Major' ? 'Minor' : 'Major'}</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-metal-silver">Choose a chord root:</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {NOTES.map(note => (
            <button
              key={note}
              className={cn(
                "py-2 px-4 rounded-md transition-colors",
                selectedNote === note 
                  ? "bg-metal-blue text-white shadow-neon-blue"
                  : "bg-gray-100 dark:bg-metal-darkest text-gray-700 dark:text-metal-silver hover:bg-gray-200 dark:hover:bg-metal-dark"
              )}
              onClick={() => handleSelectChord(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        {selectedNote ? (
          <ChordDiagram 
            rootNote={selectedNote} 
            chordType={selectedChordType} 
          />
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-metal-darkest rounded-lg">
            <p className="text-gray-500 dark:text-metal-silver">
              Select a root note above to view chord diagrams
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordLearner;