# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### `gujarati-calendar` (Expo, slug `/`)
Gujarati-language Hindu Panchang mobile app for Ahmedabad with no backend
(static data + AsyncStorage). Bottom tabs: ઘર (Home), પંચાંગ (Calendar),
ચોઘડિયા (Choghadiya), સેટિંગ્સ (Settings). Stack routes for date detail
(`/date/[date]`), festival detail (`/festival/[id]`), `/festivals`, `/about`.

Notable modules:
- `lib/panchang.ts` — tithi/nakshatra/yoga/karan/vaar via lunar/solar
  longitudes (ayanamsa 24.13).
- `lib/sun.ts` — NOAA sunrise/sunset, approximate moon times.
- `lib/choghadiya.ts` — 8-slot day/night Choghadiya tables per weekday.
- `lib/notifications.ts` — daily 7am Panchang reminder via expo-notifications.
- `data/festivals.ts` — curated 2026 Hindu/Gujarati festival list.
- `contexts/SettingsContext.tsx` — theme + notifications, persisted via
  AsyncStorage key `@gujarati-calendar/settings/v1`.
- Theme: orange-red gradient (saffron → vermilion → maroon), glassmorphism
  cards via `components/GlassCard.tsx`, accessible via `useColors()`.
