## Overview
- Implement Phase 1 focusing on design system, shared domain types, and a functional Dashboard with mocked data.
- Keep code modular under `src/` with clear separation: `types`, `components/ui`, `components/dashboard`, `pages`, `contexts`, and `utils`.
- Verify existing setup (React + TypeScript + Tailwind) and dark mode support via a `ThemeProvider`.

## Assumptions & Initial Checks
- Confirm project is a React + TypeScript app (Vite or CRA).
- Confirm Tailwind CSS is configured (`tailwind.config.js`, `postcss.config.js`, `index.css` with `@tailwind` directives).
- Confirm `clsx` and `tailwind-merge` are installed; add `recharts`.
- Confirm routing strategy (React Router) or plan a simple `Dashboard` mount in `App.tsx`.

## Dependencies
- Install `recharts` for charts: `npm install recharts`.
- Use existing `clsx` and `tailwind-merge` for class composition.
- Ensure Tailwind plugins needed for dark mode are enabled (`darkMode: 'class'`).

## Directory Structure
- `src/types/index.ts` — shared domain interfaces.
- `src/contexts/ThemeContext.tsx` — dark mode provider & hook.
- `src/components/ui/` — reusable atoms (Card, Buttons, Inputs, Select, Badges, Modal).
- `src/components/dashboard/` — KPICard, FinanceChart, TimelineCard, PriorityPanel, WeekView.
- `src/pages/Dashboard.tsx` — grid layout assembling dashboard components.
- `src/mock/dashboard.ts` — initial mocked data for layout.

## Core Types (src/types/index.ts)
- `Client`: `id`, `name`, `phone`, `email`, `address`, `status`.
- `ServiceOrder`: `id`, `clientId`, `title`, `description`, `status`, `priority`, `scheduledAt`, `assignedTo`.
- `FinancialTransaction`: `id`, `type`, `amount`, `date`, `category`, `referenceId`.
- `StockItem`: `id`, `name`, `sku`, `quantity`, `minQuantity`, `location`.
- `KPI`: `label`, `value`, `delta`, `trend`.
- `User`: `id`, `name`, `role`, `email`, `avatarUrl`, `active`.

## Shared UI Components (src/components/ui)
- `Card`: container with padding, border, optional `title` and `actions` slots.
- `StatusBadge`: `status` prop mapped to color (`open`/`in_progress`/`done`/`cancelled`).
- `PriorityBadge`: `priority` prop mapped to color (`low`/`medium`/`high`/`urgent`).
- `Button`: variants (`primary`, `secondary`, `ghost`, `destructive`), sizes, loading state.
- `Input` / `Select`: labeled form controls with error state and helper text.
- `Modal`: controlled dialog with header, body, footer slots; close callbacks.

## Dashboard Components (src/components/dashboard)
- `KPICard`: displays `KPI` with label, value, delta indicator.
- `FinanceChart`: area chart using `recharts` with income/expense series; responsive container.
- `TimelineCard`: list of today’s `ServiceOrder` items grouped by time; uses `StatusBadge` and `PriorityBadge`.
- `PriorityPanel`: highlights urgent/overdue `ServiceOrder`s; supports quick actions.
- `WeekView`: 7-day summary counts for scheduled service orders; mini calendar-like UI.

## Page Logic (src/pages/Dashboard.tsx)
- Compose a responsive grid:
  - Row 1: 3–4 `KPICard`s (e.g., orders today, revenue, pending, stock alerts).
  - Row 2: `FinanceChart` (wide) + `PriorityPanel` (narrow).
  - Row 3: `TimelineCard` (wide) + `WeekView` (narrow).
- Use mock data from `src/mock/dashboard.ts` to populate components.
- Respect dark mode via `ThemeContext` and Tailwind `dark` classes.

## Mock Data (src/mock/dashboard.ts)
- Provide arrays for `kpis`, `transactions` (aggregated to chart series), `serviceOrdersToday`, and `weekSummary`.
- Keep structures aligned with `src/types/index.ts` to ease later API integration.

## Routing & Entry
- If React Router is present: add route `'/dashboard'` to render `Dashboard`.
- If not: render `Dashboard` directly in `App.tsx` for Phase 1.

## Dark Mode & Theming
- Implement `ThemeProvider` with `theme` state (`light` | `dark`) persisted to `localStorage`.
- Toggle applies `dark` class to `document.documentElement`.
- Provide `useTheme()` hook for consuming components.

## Quality & Verification
- Run `npm run dev`; page loads without errors.
- Check React DevTools for warnings; fix prop types and keys.
- Verify responsiveness at breakpoints (`sm`, `md`, `lg`, `xl`).
- Verify dark mode styles across all UI atoms and dashboard components.

## Deliverables (Phase 1)
- Domain types defined and exported.
- UI atoms ready and used across dashboard.
- Dashboard page with mocked data and responsive grid.
- Dark mode toggle working globally.
- Recharts integrated in `FinanceChart`.

## Next Phases (High-Level)
- Phase 2: Service Orders & Clients pages + detail views with reusable lists/forms.
- Phase 3: Resource Management (Equipments, Stock, Service Catalog).
- Phase 4: Finance & Schedule (Financial, Appointments, ScheduleConfig).
- Phase 5: Administration & Misc (Users, Settings, Profile, Notifications, MaintenanceHistory).

## Acceptance Criteria
- All components render without runtime errors.
- No major accessibility regressions (labels for inputs, focus rings on buttons, semantic landmarks).
- Consistent styling via shared atoms; no inline one‑off styles.
- Code lint passes (if ESLint configured) and basic unit render tests can be added later.