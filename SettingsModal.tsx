import React, { useState, useEffect, useRef } from 'react';
import type { User, Theme } from '../types';
import { THEMES } from '../constants';
import { UserIcon, CloseIcon, WifiIcon } from './Icons';
import Avatar from './Avatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile: (newName: string, newStatus: string, newAvatar?: string) => void;
  currentTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const { isOpen, onClose, currentUser, onUpdateProfile, currentTheme, onSelectTheme } = props;
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newStatus, setNewStatus] = useState(currentUser.status || '');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(currentUser.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isOpen) {
      setNewUsername(currentUser.username);
      setNewStatus(currentUser.status || '');
      setAvatarPreview(currentUser.avatarUrl);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) {
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile(newUsername, newStatus, avatarPreview);
  };
  
  const hasChanges = newUsername.trim() !== '' && (newUsername !== currentUser.username || newStatus !== (currentUser.status || '') || avatarPreview !== currentUser.avatarUrl);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

        {/* Profile Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Your Profile</h3>
          <div className="flex items-center gap-4 mb-4">
             <div className="relative">
                <Avatar user={{ ...currentUser, avatarUrl: avatarPreview }} size="20" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 text-white hover:bg-blue-500 transition-transform hover:scale-110"
                >
                  <UserIcon className="w-4 h-4"/>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
             </div>
             <div className="space-y-3 flex-1">
                <input
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <input
                  type="text"
                  placeholder="Status (e.g., Online)"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Select Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  currentTheme.id === theme.id ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-500'
                }`}
              >
                <div className={`w-full h-16 rounded-md bg-gradient-to-br ${theme.class}`}></div>
                <p className="mt-2 text-sm font-medium text-gray-200">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>
        
        <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Save Changes
        </button>

      </div>
    </div>
  );
};

export default SettingsModal;