# Real-Time Chat

A frontend-only chat application that simulates a modern messaging experience, featuring an intelligent chatbot powered by the Google Generative AI API.

![Project Screenshot Placeholder](https://via.placeholder.com/800x450/1a202c/FFFFFF?text=Real-Time+Chat+UI)
*(A screenshot of the application would go here)*

---

## ✨ Features

### Core Chat & Messaging
- **Channels & Direct Messaging:** Join public channels or start private one-to-one conversations with other online users.
- **Real-Time Simulation:** A frontend simulation of a real-time messaging environment.
- **Unread Message Counters:** See at a glance which conversations have new messages.
- **Message Read Status:** Simulated indicators for message sent (✓), delivered (✓✓), and read (✓✓ colored).
- **Typing Indicators:** See when the AI Bot is composing a response.
- **User Presence:** See which users are online and view their custom status messages.

### Rich Media & Interaction
- **Message Editing & Deleting:** Full control over your sent messages.
- **Replies:** Reply directly to specific messages to maintain conversational context.
- **Emoji Reactions:** React to any message with a selection of common emojis.
- **@Mentions:** Mention users in channels to notify them, with a helpful suggestion box.
- **Pinned Messages:** Pin important messages to the top of any conversation for easy access.
- **Image Sharing:** Attach and send images directly in the chat.
- **Voice Notes:** Record and send simulated voice messages with a playable UI.
- **Link Previews:** URLs automatically generate a rich preview card with title, description, and image.
- **Emoji Picker:** A built-in emoji picker to easily add expressions to your messages.
- **Message Search:** Instantly search the message history of the current conversation.

### 🧠 AI-Powered Features (via Google's Generative AI)
- **Intelligent Chatbot:** Have a conversation with the AI Bot in any channel or in a direct message. It maintains context within each conversation.
- **Streaming Responses:** The bot's responses are streamed word-by-word for a dynamic, "live" feel.
- **Smart Replies:** Get contextual, AI-generated smart reply suggestions based on the last message received.

### 🎨 User Customization
- **Customizable Profiles:** Set your username, a custom avatar/profile picture, and a status message.
- **Theme Selector:** Choose from several beautiful gradient themes to personalize your experience. Theme choice is saved locally.
- **Session Management:** Log in with a username and log out to end your session.

---

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI:** [Google Generative AI API](https://ai.google.dev/) (`@google/genai`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown)

---

## 🚀 Getting Started

This is a frontend-only application that can be run directly in a browser with a local server.

### Prerequisites
- A modern web browser.
- A Google Generative AI API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Running
1. **Download the Files:** Place all the project files into a single folder.
2. **Set up your API Key:**
   - In a real-world scenario, you would use a bundler (like Vite or Create React App) and an `.env` file.
   - For this simulation, you will need to replace `process.env.API_KEY` in `App.tsx` with your actual API key string:
     ```typescript
     // In App.tsx, find this line:
     aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });

     // And replace it with your key:
     aiRef.current = new GoogleGenAI({ apiKey: 'YOUR_API_KEY_HERE' });
     ```
3. **Serve the Files:**
   - You need a simple local server to handle the module imports correctly. You can use any lightweight server. If you have Node.js installed, you can use `serve`:
     ```bash
     # Install the server globally
     npm install -g serve

     # Run the server from your project folder
     serve .
     ```
   - The terminal will provide you with a local URL (e.g., `http://localhost:3000`).
4. **Open in Browser:** Open the provided URL in your web browser to start using the chat application.

---

## 📂 Project Structure

```
/
├── components/
│   ├── Avatar.tsx
│   ├── ChatWindow.tsx
│   ├── EmojiPicker.tsx
│   ├── Icons.tsx
│   ├── LinkPreview.tsx
│   ├── MentionSuggestions.tsx
│   ├── Message.tsx
│   ├── MessageMenu.tsx
│   ├── MessageStatus.tsx
│   ├── PinnedMessagesBar.tsx
│   ├── ReplyPreview.tsx
│   ├── SearchBar.tsx
│   ├── SettingsModal.tsx
│   ├── Sidebar.tsx
│   ├── SmartReplies.tsx
│   ├── TypingIndicator.tsx
│   ├── UsernameModal.tsx
│   └── VoiceNotePlayer.tsx
├── constants.ts
├── types.ts
├── App.tsx
├── index.html
├── index.tsx
├── metadata.json
└── README.md
```

---
## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
