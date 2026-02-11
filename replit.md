# Replit Agent Guide

## Overview

This is a Spotify-inspired playlist viewer application. It displays a single playlist with its songs in a dark-themed UI that mimics Spotify's design language. The app is read-only — it fetches playlist and song data from a PostgreSQL database and renders them in a polished, music-player-style interface. The server seeds the database with initial data on startup.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a three-folder monorepo pattern:
- **`client/`** — React frontend (SPA)
- **`server/`** — Express backend (API server)
- **`shared/`** — Code shared between client and server (schema, route definitions, types)

### Frontend (client/)
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with CSS variables for theming, dark mode by default (Spotify-like dark theme with green `#1DB954` accent)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, located in `client/src/components/ui/`
- **Fonts**: Inter and Manrope via Google Fonts
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express 5 on Node.js, running via `tsx`
- **API Pattern**: REST endpoints defined in `server/routes.ts`, with route path constants shared via `shared/routes.ts`
- **Database**: PostgreSQL via `pg` Pool, with Drizzle ORM for queries
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface using `DatabaseStorage` class — all DB access goes through this layer
- **Dev Server**: Vite dev server is integrated as Express middleware in development (see `server/vite.ts`)
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Shared Code (shared/)
- **`schema.ts`**: Drizzle ORM table definitions (`playlists`, `songs`) and Zod insert schemas via `drizzle-zod`
- **`routes.ts`**: API route path constants and response schemas, plus a `buildUrl` helper for parameter substitution

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Two tables — `playlists` (id, name, description, author, coverUrl, likes) and `songs` (id, playlistId, title, artist, album, coverUrl, duration, meaning)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Connection**: Requires `DATABASE_URL` environment variable pointing to a PostgreSQL instance
- **Seeding**: Done automatically in `server/routes.ts` via `seedDatabase()` function during route registration

### API Endpoints
- `GET /api/playlists/:id` — Returns a single playlist by ID
- `GET /api/playlists/:id/songs` — Returns all songs for a playlist

### Build & Scripts
- `npm run dev` — Starts development server with Vite HMR
- `npm run build` — Builds client (Vite) and server (esbuild) to `dist/`
- `npm run start` — Runs production build
- `npm run db:push` — Pushes Drizzle schema to the database

## External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Uses `pg` (node-postgres) pool and `connect-pg-simple` for session storage capability.
- **Google Fonts** — Inter, Manrope, DM Sans, Fira Code, Geist Mono, and Architects Daughter fonts loaded via CDN.
- **Replit Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` for development experience on Replit (conditionally loaded).
- **Radix UI** — Full suite of accessible headless UI primitives powering the shadcn/ui component library.
- **Lucide React** — Icon library used throughout the UI.