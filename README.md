# Go Walk

## 1. Description

**Go Walk** is a multiplayer location-based exploration game.  
Players navigate a real-world map or virtual representation to explore, collect, and interact with the game world. The focus is on exploration, character progression, and in-game economy — there is no combat.

### Key Features

- Most objects are global, some are available only on special map layers (e.g., time-based or visible only to certain players).
- **Fog of War**:
  - Visible around the player in a 30-meter radius.
  - Progress is preserved between sessions.
  - If other players modify the map since the last session, the player must re-explore it. Modified areas remain visible but become non-interactive.
  - Players can share explored areas and purchase exploration data.

- Cutting-edge TypeScript:
  - Strict type checking with experimental options (`erasableSyntaxOnly`, `noUncheckedSideEffectImports`)
  - Modern ECMAScript modules (`ESNext`)
  - Bundler mode with `allowImportingTsExtensions` and `verbatimModuleSyntax`

- Modern React features:
  - React 19 with concurrent features
  - Hooks fully enforced by ESLint
  - Fast Refresh enabled via `@vitejs/plugin-react`

---

## 2. Technology Stack

- **Map:** Leaflet.js + GeoJSON (OpenStreetMap as source)
- **Frontend:** TypeScript + React + Tailwind CSS + CSS Modules + Inline styles for dynamic UI
- **Backend:** Node.js + Database (MongoDB/PostgreSQL recommended)
- **Testing:** Vitest + Testing Library + jsdom
- **Mobile Build:** React Native
- **Bundler:** Vite (with cutting-edge TS support and aliasing)

---

## 3. Functionality

### World Exploration

- Move in the real world or on a virtual map.
- Discover new areas by exploring the map.
- Fog of War hides unexplored regions; new visibility circles open as the player moves.
- Collect artifacts, information, and quests at specific locations.
- Achievements based on explored areas, distance traveled, and completed story elements.
- Create and edit custom objects.

### Multiplayer Features

- Shared world with personal layers for each player.
- Players can share explored regions.
- Competitive metrics:
  - Who explores the most territory.
  - Who covers the most distance.
  - Who completes the most quests and contributes most to the shared game world.

---

## 4. MVP: Single Explorer

- **Area:** Stary Imielin, Warsaw (approx. 1.5 × 1.5 km, ~2 km²).
- Player explores the map and clears Fog of War.
- Progress is saved locally (localStorage) or minimally on the server.
- Indicators for:
  - Map completion percentage
  - Collected artifacts
  - Completed quests
- One mission/campaign to test gameplay.
- Player goal: explore the whole map, collect all artifacts, complete all quests, finish the mission.
- Character progression depends on achieved goals.
- Purpose: validate the core exploration mechanic with players.

---

## 5. Modern Styling Approaches

### 5.1 Base Document Styles (`index.css`)

- Root typography (system font stack, line height, font smoothing)
- Color scheme (light/dark mode via `prefers-color-scheme`)
- Default link and button styles
- Basic theme overrides (background and text colors)

### 5.2 Global Styles (`global.css`)

- Modern reset (margin, padding, box-sizing)
- Full-size root containers (`html, body, #root { height: 100%; width: 100%; }`)
- Minimal baseline styles on top of Tailwind Preflight
- No `.app` container (replaced by Tailwind utility classes directly in JSX)

### 5.3 Tailwind CSS

- Primary styling approach for layout and components
- Utility classes for spacing, flex/grid layouts, responsiveness
- Used for interactive elements (buttons, overlays, map layers)
- Quick hover effects, transitions, and adaptive design

### 5.4 Inline Styles

- Dynamic runtime properties:
  - Marker coordinates
  - Highlighting the active player
  - Border colors based on state
  - Window/container-dependent sizes
  - Width/height computed via JS (progress-based or responsive layouts)

---

## 6. Cutting-Edge Development Practices

- **Strict TypeScript:** full type safety with experimental compiler options.
- **Linting & Formatting:** ESLint + Prettier integration, unused directives enforced.
- **Absolute Imports:** configured with `@` alias, synced with TS paths.
- **Vitest:** modern unit testing with `setupTests.ts` for global test setup (`@testing-library/jest-dom`).
- **Fast Refresh & Hooks:** enforced via ESLint plugins and Vite React plugin.
- **Fog of War Mechanics:** implemented with local caching, dynamic map layers, and persistence across sessions.

---

## 7. Getting Started

1. Install dependencies:

```bash
npm install
```
