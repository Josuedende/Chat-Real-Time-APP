export interface User {
  id: string;
  username: string;
  status?: string;
  avatarUrl?: string;
  lastSeen?: string;
}

export interface Message {
  id:string;
  content: string;
  timestamp: string;
  user: User;
  type?: 'user' | 'system';
  replyTo?: Message | null;
  reactions?: { [key: string]: string[] }; // emoji -> userId[]
  imageUrl?: string;
  isEdited?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  isPinned?: boolean;
  voiceNote?: {
    url: string;
    duration: number; // in seconds
  };
  linkPreview?: {
    url: string;
    title: string;
    description: string;
    image: string;
  };
  mentions?: string[]; // array of user IDs
}

export interface Room {
  id: string;
  name: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  class: string;
}