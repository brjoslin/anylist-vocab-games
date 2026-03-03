# AnyList Vocab Games

Beginner-friendly, mobile-first vocabulary app for classroom practice.

## Features (v1)
- Local-only app (no accounts, no paid services, no backend DB).
- Multiple teacher-managed lists in browser `localStorage`.
- Import from pasted text (TSV/CSV/plain lines).
- Export as TSV text for copy/paste backup.
- 3 game modes:
  1. **Listen & Spell**
  2. **See Meaning → Spell Target**
  3. **Hear Target → Choose Meaning** (4-option multiple choice)
- Session stats: correct, incorrect, accuracy, missed terms.
- Accent strictness setting:
  - OFF: diacritic-insensitive (`cancion` == `canción`)
  - ON: exact accents required.

## Mode behavior when meanings are missing
To keep usage simple in class:
- Modes 2 and 3 only use items that contain a `meaning`.
- If a list has **zero** meanings, those modes are hidden on Home.
- In mixed lists, items without meanings are skipped for modes 2 and 3.

## Tech stack
- Vite + React + TypeScript
- React Router for simple routing
- Web Speech API for text-to-speech
- Vitest for unit tests

## Prerequisites
- Node.js 18+
- npm 9+

## Run locally (step-by-step)
1. Open terminal in this project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in terminal (usually `http://localhost:5173`).

## Build for production
```bash
npm run build
npm run preview
```

## Run tests
```bash
npm test
```

## Teacher workflow
1. Open **Teacher Area**.
2. Create a list with a name and language tag (example `es-ES`).
3. Select the list.
4. Paste words in one of these formats:
   - `term`
   - `term<TAB>meaning`
   - `term,meaning`
5. Click **Import from text**.
6. Use **Load TSV for export** to copy a TSV backup.

## Student workflow
1. On Home, pick a list.
2. Choose a mode.
3. (Listening modes) choose voice/rate and press Play.
4. Answer and review immediate feedback.
5. Watch stats update live.

## Speech synthesis troubleshooting
- Some browsers load voice lists asynchronously; if no voices appear, refresh once.
- On mobile, user interaction (button press) is required before audio plays.
- If your language voice is unavailable, app falls back to browser default voice.
- Best support is usually Chrome/Edge/Safari recent versions.

## Project structure
- `src/pages/HomePage.tsx` – list selection + mode selection + settings.
- `src/pages/TeacherPage.tsx` – list CRUD + paste import/export.
- `src/pages/GamePage.tsx` – all game mode logic and per-session stats.
- `src/lib/parser.ts` – paste parser + TSV exporter.
- `src/lib/compare.ts` – answer checks + diacritic-insensitive logic.
- `src/lib/multipleChoice.ts` – meaning option generator for mode 3.
- `src/state/storage.ts` – localStorage persistence.

## How to add a new game mode later
1. Add a new mode id to `GameMode` in `src/types.ts`.
2. Add a mode card in `src/pages/HomePage.tsx`.
3. Add a render branch in `src/pages/GamePage.tsx` for UI + answer check.
4. Reuse shared helpers (`compare.ts`, `multipleChoice.ts`) or add new helpers under `src/lib`.
5. Add tests under `src/test` for new game logic.
