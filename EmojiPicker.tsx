import React from 'react';
import { EMOJIS } from '../constants';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji, onClose }) => {
  return (
    <div className="absolute bottom-full mb-2 w-full sm:w-auto left-0 sm:left-auto right-0 sm:right-auto bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg p-2 shadow-xl z-10">
      <div className="grid grid-cols-6 gap-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelectEmoji(emoji)}
            className="text-2xl p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-150"
            aria-label={`Select emoji ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;