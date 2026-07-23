# Arsam.net Admin Panel - Project Memory

## Project Overview
- Real estate/land (arsa/gayrimenkul) admin panel, sahibinden.com clone focused on arsa & gayrimenkul
- Stack: React 19, Vite 8, TypeScript 6, Vanilla Extract CSS, Base UI, Storybook 10, pnpm
- Routing: react-router v8 (createBrowserRouter)
- State: @tanstack/react-query, @tanstack/react-form, @tanstack/react-table, @tanstack/react-virtual

## Architecture (Updated July 2026)
- **27 Primitives** `src/components/primitives/`
- **35+ Composites** `src/components/composites/` (includes AI components)
- **15 Screens** `src/screens/`
- **15 Routes** via `src/router.tsx` + `src/layouts/AdminLayout.tsx`
- **8 Page wrappers** `src/pages/`
- **10 Mock data files** `src/mocks/`
- Types in `src/types/component-props.ts` + `src/types/domain.ts`
- Tokens in `src/tokens/` (contract.css.ts, themes.css.ts, globals.css.ts, fluid.ts)
- 3 themes (corporate-blue, neutral-slate, warm-amber) + dark mode for corporate-blue

## Key AI-First Components
- `AIChatPanel` - Persistent chat with 6 message types, drawer/docked modes, FAB
- `AIInsightCard/Feed` - 5 insight types (anomaly/prediction/recommendation/summary/risk)
- `AISmartSearch` - Natural language query parsing, category chips, result tabs

## Completed Enhancements (4 Phases)
- Faz 1: DataTable virtualization, CascadingSelect, FilterBar location+price, Validation States, Bulk Export, CategoryTree Search
- Faz 2: Map Preview, Batch Photo, Permission Search, Fraud Indicators, Audit Export, Toast Queue, Auto-suggest Rejection
- Faz 3: BulkImportPage, LocationManagementPage, PricingPromotionPage, SellerVerificationPage
- Faz 4: Keyboard Shortcuts, Sparklines, Command History, Dark Mode

## Common Token Issues (for future agents)
- `vars.font.size` has: sm, md, lg, xl, 2xl, 3xl, 4xl (NO xs)
- `vars.color.success/warning/danger/info` have: 50, 100, 600, 700, 800, 900 (NO 500)
- `vars.color.bg` has: canvas, surface, subtle, elevated, disabled, overlay (NO muted)
- `vars.color.border` has: default, strong, subtle (NO focus)
- exactOptionalPropertyTypes is ON - use conditional spread for optional props
