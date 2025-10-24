import type { Room, User, Theme } from './types';

export const ROOMS: Room[] = [
  { id: '1', name: 'General', description: 'General chit-chat' },
  { id: '2', name: 'Technology', description: 'All things tech' },
  { id: '3', name: 'Random', description: 'For everything else' },
];

export const INITIAL_USERS: { [key: string]: User[] } = {
  General: [
    { id: 'ai-bot', username: 'AI Bot' },
    { id: 'user-1', username: 'Alice' },
    { id: 'user-2', username: 'Bob' },
  ],
  Technology: [
    { id: 'ai-bot', username: 'AI Bot' },
    { id: 'user-3', username: 'Charlie' },
  ],
  Random: [
    { id: 'ai-bot', username: 'AI Bot' },
    { id: 'user-1', username: 'Alice' },
    { id: 'user-4', username: 'David' },
  ],
};

export const THEMES: Theme[] = [
  { id: 'default', name: 'Deep Space', class: 'from-slate-900 to-gray-800' },
  { id: 'sunset', name: 'Sunset', class: 'from-pink-600 via-red-500 to-yellow-500' },
  { id: 'ocean', name: 'Ocean', class: 'from-green-400 via-cyan-500 to-blue-600' },
  { id: 'aurora', name: 'Aurora', class: 'from-purple-800 via-indigo-700 to-teal-600' },
];

export const EMOJIS = ['😀', '😂', '😍', '👍', '❤️', '🔥', '🚀', '🤔', '🎉', '👋', '🙏', '💯'];

export const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];