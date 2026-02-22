# Digital Wedding Invitation - Sai Nagendra Weds Sushma

## Project Overview
A digital wedding invitation web app for "Sai Nagendra Weds Sushma" (March 7th, 2026). Built as a React SPA with an AI chat assistant page.

## Tech Stack
- **Framework**: React 19 + TypeScript (~5.9)
- **Build**: Vite 7 (module type)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Animation**: Motion (Framer Motion)
- **Routing**: React Router DOM v7
- **Maps**: MapLibre GL
- **Icons**: Lucide React
- **Markdown**: react-markdown + remark-gfm

## Commands
- `npm run dev` — Start dev server (binds 0.0.0.0)
- `npm run build` — TypeScript check + Vite build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Project Structure
- `src/App.tsx` — Root component with routing (LandingPage, AIChatPage)
- `src/components/` — Page sections and feature components
  - `AIChatPage.tsx` — AI chat assistant interface
  - `TravelAssistanceSection.tsx` — Travel/transport/map section
  - `WeddingTimelineSection.tsx` — Event timeline
  - `WeddingVideoSection.tsx` — Video section
  - `WelcomePopup.tsx` — Welcome modal
  - `ui/` — Reusable UI components (shadcn + custom)
- `src/hooks/` — Custom hooks
- `src/lib/` — Utilities and API client (`marriageApi.ts`)

## Conventions
- Use functional components with hooks
- Tailwind for all styling (no CSS modules)
- shadcn/ui pattern for reusable components in `src/components/ui/`
- CVA (class-variance-authority) + clsx + tailwind-merge for component variants
