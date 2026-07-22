# clever-knight-game
An interactive web-based strategy board game featuring real-time multiplayer logic, user authentication, and custom UI/UX animations.
# 🏇 CleverKnight (הפרש החכם) - Interactive Strategy Game

An advanced, futuristic web-based 2-player board game inspired by chess knight mechanics, dynamic move calculations, and strategic area control. Built with Vanilla JavaScript (ES6+), HTML5, and custom CSS3 Glassmorphism UI.

---

## 🎮 Game Overview & Strategic Objective

- **Goal:** Form a connected line of 4 knights (rows, columns, diagonals, or 2x2 square formations) inside the designated central battle grid.
- **Knight Movement:** All piece relocations follow the classic chess 'L' jump pattern. Outer board cells serve as strategic tactical positioning zones.
- **Stacking Mechanics:** Up to 3 knight pieces can stack on a single board cell. Strategic ownership belongs strictly to the player holding the top piece.

---

## ✨ Key Features & Core Logic

### 👥 Dual Player Authentication System
- Dedicated Register & Sign-In interface with real-time feedback.
- Client-side security with strong password validation (length, uppercase, lowercase, numbers, special characters).
- Account management stored in `localStorage` and active dual-session flow in `sessionStorage`.

### 💡 Dynamic Legal Move Calculation & Guidance
- Programmatic JavaScript logic calculating permitted 'L'-shape paths in real-time.
- Drag & Drop / Click validation: Invalid target attempts instantly highlight allowed destination tiles across the grid.

### ⚡ Dynamic Turn Management & Active Player HUD
- Turn-switching system that dynamically highlights the active player's HUD profile.
- Smooth pulsing glow CSS keyframe animations indicating whose turn it is.

### ⏱️ Turn Timer & Session Reset Controls
- Integrated countdown timer enforcing fast-paced tactical decisions.
- Dynamic reset and log-out options to maintain session security and clean state management.

### 📊 Persistent Scoreboard & Win Tracking
- Real-time victory tracker accumulating round scores (`wins1`, `wins2`) across consecutive matches.

### 🎉 Epic Victory Celebration & Sound FX
- Complex algorithmic win detector evaluating 4-in-a-row sequences (rows, columns, diagonals, and 2x2 blocks).
- Triumphant win modal featuring sound effects, glowing overlay, and animated confetti cannons powered by Canvas Confetti.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Interface:** HTML5, CSS3 (CSS Grid, Flexbox, Keyframe Animations, Glassmorphism design).
- **Core Game Engine:** Vanilla JavaScript (ES6+), DOM Manipulation, Event Listeners, Complex Array Scanning Algorithms.
- **Data Persistence:** `localStorage` (user registrations) & `sessionStorage` (active match state, session auth, scores).
- **Libraries:** Canvas Confetti JS.

---

## 👩‍💻 Author
Developed by **Rachel Rosenblum**
