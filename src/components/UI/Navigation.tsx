import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import useGuitarStore, { Mode } from '../../store/useGuitarStore';
import { 
  Mic, 
  Clock, 
  Sun,
  Moon,
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';
import SettingsModal from './SettingsModal';
import ProfileModal from './ProfileModal';
import { useMobileDetection } from '../../hooks/useMediaQuery';

const Navigation: React.FC = () => {
  const { mode, setMode, theme, toggleTheme } = useGuitarStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use the custom hook for responsive design
  const isMobile = useMobileDetection();
  
  const navigationItems = [
    { id: 'fretboard', name: 'Fretboard', icon: null },
    { id: 'tuner', name: 'Tuner', icon: Mic },
    { id: 'metronome', name: 'Metronome', icon: Clock },
  ] as const;

  const handleProfileClick = () => {
    setProfileOpen(true);
    setMobileMenuOpen(false); // Close mobile menu if open
  };
  
  return (
    <nav className="bg-gradient-to-r from-metal-darker to-metal-dark border-b border-metal-blue shadow-neon-blue">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span 
            className="text-2xl font-bold text-white animate-neon-pulse" 
            style={{ fontFamily: "'Metal Mania', cursive" }}
          >
            Guitar Gods
          </span>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center justify-center p-2 rounded-md text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              className={cn(
                "px-4 py-2 flex items-center space-x-2 transition-all duration-300",
                "uppercase tracking-wider text-sm font-medium",
                id === 'fretboard' && mode === id 
                  ? "bg-metal-blue text-white rounded"
                  : mode === id 
                    ? "bg-metal-blue text-white shadow-neon-blue rounded"
                    : "text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker rounded"
              )}
              style={{ fontFamily: "'Oswald', sans-serif" }}
              onClick={() => setMode(id as Mode)}
            >
              {Icon && <Icon className={cn(
                "w-5 h-5",
                mode === id && "text-metal-highlight"
              )} />}
              <span className="hidden md:inline">{name}</span>
            </button>
          ))}
          
          <button 
            onClick={toggleTheme}
            className="p-2 ml-2 rounded flex items-center justify-center transition-all duration-300 text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          
          <button 
            onClick={handleProfileClick}
            className="p-2 rounded flex items-center justify-center transition-all duration-300 text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker ml-2"
            aria-label="User Profile"
          >
            <User className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded flex items-center justify-center transition-all duration-300 text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker ml-2"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-metal-darkest border-t border-metal-blue">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                className={cn(
                  "w-full px-3 py-2 flex items-center justify-between rounded-md transition-all duration-300",
                  "uppercase tracking-wider text-sm font-medium",
                  mode === id 
                    ? "bg-metal-blue text-white shadow-neon-blue" 
                    : "text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
                )}
                style={{ fontFamily: "'Oswald', sans-serif" }}
                onClick={() => {
                  setMode(id as Mode);
                  setMobileMenuOpen(false);
                }}
              >
                <span>{name}</span>
                {Icon && <Icon className={cn(
                  "w-5 h-5",
                  mode === id && "text-metal-highlight"
                )} />}
              </button>
            ))}
            
            <div className="flex justify-between pt-2 border-t border-metal-blue mt-2">
              <button 
                onClick={toggleTheme}
                className="flex-1 p-2 rounded flex items-center justify-center transition-all duration-300 text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5 mr-2" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5 mr-2" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleProfileClick}
                className="flex-1 p-2 rounded flex items-center justify-center transition-all duration-300 text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker ml-2"
                aria-label="User Profile"
              >
                <User className="w-5 h-5 mr-2" />
                <span>Profile</span>
              </button>
              
              <button 
                className="flex-1 p-2 rounded flex items-center justify-center transition-all duration-300 text-metal-silver hover:text-metal-lightblue hover:bg-metal-darker ml-2"
                onClick={() => {
                  setSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 mr-2" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Profile Modal */}
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </nav>
  );
};

export default Navigation;