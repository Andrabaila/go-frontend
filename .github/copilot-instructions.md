# Copilot Instructions for Go Walk Project

## Architecture Overview

- **Monorepo Structure**: Turbo-managed workspace with backend (NestJS) in [apps/backend/](apps/backend/), frontend (React/Vite) in [apps/frontend/](apps/frontend/), shared packages in [packages/](packages/).
- **Backend Modules**: Feature-based modules (auth, game-objects, players, quests, tiles, users) in `src/`, each with controller, service, entity. See [apps/backend/src/app.module.ts](apps/backend/src/app.module.ts). Database: TypeORM with Postgres; entities like Player, User, Quest.
- **Frontend Components**: Grouped by features in `src/components/` (e.g., map/, player/), with hooks in `src/hooks/`, API calls in `src/api/`. See [apps/frontend/src/App.tsx](apps/frontend/src/App.tsx).
- **Data Flow**: Frontend uses Axios for API calls to backend endpoints; auth via JWT with token stored in localStorage. Player position and explored areas cached in localStorage. Fog of war implemented with dynamic map layers and persistence.
- **Game Mechanics**: Location-based exploration game with fog of war (30m radius visibility), multiplayer shared world, quests, artifacts. Map uses Leaflet.js with GeoJSON.

## Developer Workflows

- **Development**: `npm run dev` runs backend (`nest start --watch`) and frontend (`vite --open`) in parallel via Turbo.
- **Build**: `npm run build` builds all apps with Turbo dependencies.
- **Testing**: `npm run test` runs Jest (backend) and Vitest (frontend); e2e in [apps/backend/test/](apps/backend/test/).
- **Linting**: `npm run lint` enforces ESLint + Prettier; auto-fix with `lint-staged`. Husky for pre-commit hooks.
- **Debugging**: Backend debug with `npm run start:debug` in backend; frontend via Vite dev server. Geolocation errors logged to console.

## Coding Conventions

- **Imports**: Absolute paths with `@` alias, e.g., `import { usePlayerPosition } from '@/hooks'`. Types imported from `@/types` (centralized in `src/types/`).
- **File Naming**: kebab-case for files (e.g., `map-component.tsx`), PascalCase for components/hooks (e.g., `MapComponent`, `useCoins`). Limit files to 50 lines.
- **Structure**: One responsibility per file; DTOs in `dto/`, entities in module root. Feature-based grouping over type-based.
- **Patterns**: React 19 hooks only; async data with TanStack Query; state via Zustand if needed. JSDoc for public APIs explaining why, not what. No `any`, use `unknown` or precise types. Inline styles for dynamic properties (e.g., marker coordinates), Tailwind for static layout.
- **Styling**: Tailwind CSS primary, inline styles for runtime dynamics, CSS Modules for scoped styles. Fog of war layers use dynamic GeoJSON.
- **Commits**: Follow Conventional Commits (e.g., `feat: add quest tracking`).

## Key References

- See [CODING_GUIDELINES.md](CODING_GUIDELINES.md) for detailed rules, including no `any`, modern practices, file size limits.
- [README.md](README.md) for tech stack (Leaflet, Tailwind) and features (fog of war, multiplayer).
- [turbo.json](turbo.json) for task dependencies; [package.json](package.json) for scripts.</content>
  <parameter name="filePath">/home/ya/Downloads/go/.github/copilot-instructions.md
