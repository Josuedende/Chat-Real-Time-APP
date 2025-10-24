import React from 'react';

interface SmartRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

const SmartReplies: React.FC<SmartRepliesProps> = ({ replies, onSelect }) => {
  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-2">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply)}
          className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-sm text-gray-200 hover:bg-gray-600/50 transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default SmartReplies;