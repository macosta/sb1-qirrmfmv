import React, { useState } from 'react';
import Modal from './Modal';
import { User, Mail, Edit, Camera, Save } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onOpenChange }) => {
  const [displayName, setDisplayName] = useState('Guitar Player');
  const [email, setEmail] = useState('player@guitarapp.com');
  const [bio, setBio] = useState('I love playing guitar!');
  const [profilePicture, setProfilePicture] = useState('/default-avatar.jpg');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <Modal
      title="Profile"
      open={open}
      onOpenChange={onOpenChange}
      size="md"
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-metal-blue">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              className="absolute bottom-0 right-0 p-2 rounded-full bg-metal-blue text-white hover:bg-metal-lightblue transition-colors"
              aria-label="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-metal-silver mb-1">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-metal-darker rounded-md bg-white dark:bg-metal-darkest text-gray-900 dark:text-metal-silver"
              />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-metal-silver">{displayName}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-metal-blue hover:text-metal-lightblue"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-metal-silver mb-1">
              Email
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-metal-darker rounded-md bg-white dark:bg-metal-darkest text-gray-900 dark:text-metal-silver disabled:opacity-50"
              />
              <Mail className="w-5 h-5 text-metal-blue" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-metal-silver mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-metal-darker rounded-md bg-white dark:bg-metal-darkest text-gray-900 dark:text-metal-silver disabled:opacity-50 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-metal-darkest">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-gray-700 dark:text-metal-silver bg-gray-100 dark:bg-metal-darkest rounded-md hover:bg-gray-200 dark:hover:bg-metal-darker transition-colors"
          >
            Cancel
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-metal-blue text-white rounded-md hover:bg-metal-lightblue transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;