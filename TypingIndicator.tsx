import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 justify-start">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
          A
        </div>
        <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
                <span className="font-bold text-sm">AI Bot</span>
                 <span className="text-xs text-gray-500">is typing...</span>
            </div>
            <div className="mt-2 p-3 rounded-lg bg-gray-700 text-white flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
            </div>
        </div>
    </div>
  );
};

export default TypingIndicator;