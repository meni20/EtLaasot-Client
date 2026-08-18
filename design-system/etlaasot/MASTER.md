# EtLaasot Design System

This file records the design decisions implemented on `dev`. Page-specific files in `pages/` may override these rules only when a workflow requires it.

## Product character

EtLaasot is a calm, confident Hebrew RTL operations product for nonprofit teams, volunteers, and trainees. Apple design principles guide clarity, agency, material depth, typography, direct feedback, and restrained motion. The interface is not a literal Apple clone and keeps the organization’s aubergine identity as a supporting accent.

## Source of truth

- TypeScript tokens: `src/theme/tokens.ts`
- MUI component system: `src/theme/them.ts`
- CSS variables, responsive foundations, and accessibility media queries: `src/index.css`

## Color

| Role | Value | Token |
| --- | --- | --- |
| Canvas | `#F5F6F8` | `--color-canvas` |
| Warm canvas | `#FAF9FB` | `--color-canvas-warm` |
| Surface | `#FFFFFF` | `--color-surface` |
| Muted surface | `#F0F2F4` | `--color-surface-muted` |
| Primary text | `#1D1D1F` | `--color-text` |
| Secondary text | `#51565C` | `--color-text-secondary` |
| Border | `#DADDE3` | `--color-border` |
| Primary action | `#2F6F61` | `--color-primary` |
| Primary soft | `#EAF4F1` | `--color-primary-soft` |
| Brand accent | `#6F4E7C` | `--color-brand` |
| Brand soft | `#F4EEF6` | `--color-brand-soft` |
| Success | `#2E7D32` | `--color-success` |
| Warning | `#A8610A` | `--color-warning` |
| Danger | `#B42318` | `--color-danger` |

Use semantic tokens; do not add raw brand colors to components. Status must include text or an icon, never color alone.

## Typography

- Family: `Noto Sans Hebrew`, then system UI fallbacks.
- Body: 16px on mobile, line-height 1.5–1.55.
- Headings: weight 650–700 with tighter leading; Hebrew tracking stays neutral.
- Data and timers may use tabular numerals.
- Components inherit typography from the MUI theme; do not hardcode font families.

## Layout

- RTL is global through MUI theme direction and the Emotion RTL cache.
- Breakpoints verified: 375, 768, 1024, and 1440.
- Use logical properties (`marginInlineEnd`, `paddingInline`, `insetInlineEnd`).
- Minimum touch target: 44×44px with at least 8px between adjacent targets.
- Use `dvh` and safe-area insets for fixed mobile chrome.
- The router owns one mobile bottom navigation; pages never render a duplicate.
- Wide tables/calendars live in explicit horizontal scroll containers instead of forcing page overflow.

## Surfaces and materials

- Cards use subtle borders and shallow shadows; hover elevation is limited to fine pointers.
- Floating navigation may use `backdrop-filter` with a solid fallback under `prefers-reduced-transparency`.
- Dialogs use a centered 22px surface on desktop and responsive sheet-like sizing on compact screens.
- Scrims isolate modal tasks; non-blocking panels keep context visible.

## Motion

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
--transition-fast: 140ms var(--ease-out);
--transition-normal: 180ms var(--ease-out);
--transition-slow: 240ms var(--ease-in-out);
```

- Motion must provide feedback, spatial continuity, or state clarity.
- Frequently used navigation is instant or near-imperceptible.
- Pressables respond on press with subtle `scale(0.94–0.97)`.
- Animate `transform` and `opacity`; never use `transition: all`.
- Gate hover transforms behind `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion` keeps color/opacity feedback and removes spatial movement.

## Forms and feedback

- Every field keeps a visible label, semantic input type/input mode, helper text, and nearby error.
- Async actions expose loading and disable repeat submission.
- Destructive actions are spatially separated and use danger semantics.
- Dialogs are labeled, icon-only buttons have Hebrew accessible names, and status updates use appropriate live regions where needed.

## Quality gates

- `npm run build`
- `npm run lint`
- `git diff --check`
- Visual checks at 375×812 and 1440×900; authenticated views also require a working local API and test credentials.
- Recheck reduced motion, reduced transparency, keyboard focus, RTL order, text scaling, safe areas, and horizontal overflow before release.
