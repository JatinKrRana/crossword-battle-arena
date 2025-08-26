# 🧩 Crossword Battle Arena

Crossword Battle Arena is a **real-time competitive crossword puzzle game** where a human player goes head-to-head against an **AI opponent powered by Gemini**.  
The game blends the intellectual challenge of crosswords with the excitement of competitive multiplayer and personality-driven AI interactions.  

---

## ✨ Features

- **Interactive Crossword Engine**  
  - 10x10 crossword grid with 2–3 predefined puzzles  
  - Click-to-select cells and type answers  
  - Highlight active word being solved  
  - Instant validation (correct/incorrect feedback)  

- **AI Opponent (Gemini Integration)**  
  - Solves words with realistic delays (3–8s)  
  - Occasional mistakes to feel human-like  
  - Personality-driven chat (trash-talk, hints, compliments)  
  - Adapts behavior based on game state  

- **Real-time Competition**  
  - Player and AI solve simultaneously  
  - Live updates on who solved what  
  - Time-based bonus scoring  
  - Game ends when puzzle is complete with winner announced  

- **Chat System**  
  - Dynamic AI messages during gameplay  
  - Includes banter, hints, and win/lose messages  

- **Game Management**  
  - Start new game button  
  - Scoreboard & leaderboard  
  - Game-over screen with final stats  
  - Simple matchmaking  

- **Authentication & User Profiles**  
  - Clerk-based user authentication  
  - Profile with avatar, name, and stats  

---

## 🛠️ Tech Stack

- **Frontend**: React + Next.js  
- **Backend / Database**: Firebase (real-time)  
- **Authentication**: Clerk  
- **AI Integration**: Gemini API  
- **Deployment**: Vercel  

---

## 📸 Screenshots  

*(Add your screenshots here after running the app)*  

1. **Home Screen / Login**  
<img width="2148" height="1304" alt="Screenshot 2025-08-26 033425" src="https://github.com/user-attachments/assets/0e5353fb-7e03-4a64-98d8-fff283555e71" />


2. **Gameplay with AI**  
<img width="2155" height="1291" alt="Screenshot 2025-08-26 033718" src="https://github.com/user-attachments/assets/23f8c696-b459-40d9-987f-5e173899a849" />

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)  
- Firebase project setup  
- Clerk account for authentication  
- Gemini API key  

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/crossword-battle-arena.git
   cd crossword-battle-arena
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add environment variables:
   Create a .env.local file in the project root with:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000
 to view it in the browser.

---

## 🌐 Deployment

This project is deployed on **Vercel**:  
👉 [Live Demo](https://your-vercel-link.vercel.app/)

### Steps:
- Push your code to GitHub  
- Connect the repo to [Vercel](https://vercel.com/)  
- Add environment variables in Vercel’s dashboard  
- Deploy 🚀  

---

## 📊 Future Scope

- Dynamic crossword puzzle generation  
- Player vs Player matchmaking  
- Enhanced AI personalities & difficulty levels  
- Mobile app (React Native)  
- Seasonal leaderboards and achievements  
- Monetization: premium puzzles, AI packs  
