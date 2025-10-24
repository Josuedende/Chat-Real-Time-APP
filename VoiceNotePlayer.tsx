import React, { useState, useRef, useEffect } from 'react';
import { MicIcon } from './Icons'; // Assuming MicIcon can be repurposed or a PlayIcon is available

interface VoiceNotePlayerProps {
  src: string; // In a real app, this would be a URL to the audio file
  duration: number; // in seconds
}

const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ src, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            return 0;
          }
          return prev + 100 / (duration * 10);
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);
  
  // Reset progress if playback finishes
  useEffect(() => {
    if (!isPlaying) {
       if (progress >= 100) setProgress(0);
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  return (
    <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg my-1 w-64">
      <button onClick={togglePlay} className="p-2 bg-blue-500/50 rounded-full text-white">
        {/* Basic Play/Pause icon simulation */}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          {isPlaying ? 
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/> :
            <path d="M8 5v14l11-7z"/>
          }
        </svg>
      </button>
      <div className="flex-1 h-1 bg-gray-500 rounded-full overflow-hidden">
        <div className="h-full bg-blue-400" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs text-gray-400 w-10 text-right">{formatTime(duration)}</span>
    </div>
  );
};

export default VoiceNotePlayer;