import React from 'react';
import { cn } from '../../lib/utils';

// Utility component for rendering note text with proper formatting
interface NoteDisplayProps {
  note: string;
  isRoot: boolean;
  scaleSystem?: string;
  fretMarkers?: 'notes' | 'degrees' | 'intervals' | 'none';
  interval?: string;
  degree?: string;
}

const formatNoteText = (note: string) => {
  if (note.includes('#')) {
    return (
      <span className="main-note">
        {note.replace('#', '')}♯
      </span>
    );
  } else if (note.includes('b')) {
    return (
      <span className="main-note">
        {note.replace('b', '')}♭
      </span>
    );
  }
  return <span className="main-note">{note}</span>;
};

// Enharmonic note display with both representations
const EnharmonicNoteDisplay = ({ note }: { note: string }) => {
  const enharmonicMap: Record<string, string> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };
  
  if (note in enharmonicMap) {
    return (
      <div className="enharmonic-container">
        <span className="main-note">{formatNoteText(note)}</span>
        <span className="alt-note">{enharmonicMap[note]}</span>
      </div>
    );
  }
  
  return formatNoteText(note);
};

const FretboardNoteDisplay: React.FC<NoteDisplayProps> = ({
  note,
  isRoot,
  fretMarkers = 'notes',
  interval,
  degree,
}) => {
  if (fretMarkers === 'none') return null;
  
  if (fretMarkers === 'degrees' && degree) {
    return (
      <span className="text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {degree}
      </span>
    );
  }
  
  if (fretMarkers === 'intervals' && interval) {
    return (
      <span className="text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {interval}
      </span>
    );
  }
  
  // Default to showing notes
  return <EnharmonicNoteDisplay note={note} />;
};

export default FretboardNoteDisplay;