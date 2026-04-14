# Progress Log

## Date: 2026-04-14

---

### Certificates Page Blank Screen Fix - COMPLETED

**Problem:** When deployed to Vercel, navigating to `/certificates` showed a blank screen with no content.

**Root Causes Identified:**
1. `vercel.json` missing explicit routing for `/certificates` path
2. Vite config using Windows-style paths that break on Vercel's Linux environment
3. React Router `basename="/"` causing routing conflicts
4. No fallback handling if React fails to load

**Fixes Applied:**

#### 1. Fixed `vercel.json`
**File:** `vercel.json`
- Added explicit rewrite rules for `/certificates` → `/certificates.html`
- Added catch-all rewrite for certificates sub-paths
- Added `cleanUrls: true` for cleaner URL handling

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/certificates",
      "destination": "/certificates.html"
    },
    {
      "source": "/certificates/:match*",
      "destination": "/certificates.html"
    },
    {
      "source": "/((?!.*\\.).*)",
      "destination": "/index.html"
    }
  ],
  "cleanUrls": true
}
```

#### 2. Fixed `vite.config.ts`
**File:** `vite.config.ts`
- Changed from `new URL().pathname` (Windows path issue) to `path.resolve(__dirname, ...)`
- This ensures cross-platform compatibility

```typescript
// Before (Windows paths break on Vercel):
main: new URL('./index.html', import.meta.url).pathname,

// After (cross-platform):
main: path.resolve(__dirname, 'index.html'),
```

#### 3. Fixed `src/App.tsx`
**File:** `src/App.tsx`
- Removed `basename="/"` that was causing routing conflicts
- Added 404 fallback page for better UX

```tsx
// Before:
<Router basename="/">

// After:
<Router>
```

#### 4. Added Loading Fallback to `certificates.html`
**File:** `certificates.html`
- Added 10-second timeout that displays error message if React fails to mount
- Provides user-friendly fallback with link back to home

```javascript
setTimeout(function() {
  var root = document.getElementById('root');
  if (root && root.querySelector('.loading')) {
    root.innerHTML = '...error message...';
  }
}, 10000);
```

**Status:** ✅ Completed and committed

**Next Steps:**
- Deploy to Vercel and verify `/certificates` loads correctly
- If issues persist, check Vercel deployment logs for build errors

---

## Previous Review Findings (24 bugs identified)

See `review.md` for complete list of bugs including:
- Missing CSS variables
- Mobile menu toggle issues
- Unused dependencies
- Accessibility concerns
- Performance optimizations needed

---

### UI/UX & Code Quality Improvements - COMPLETED

**Date:** 2026-04-14

**Fixes Applied:**

#### 1. Layout & Animation Fixes
- Added missing `--grid-gap` CSS variable to `index.html`.
- Fixed mobile menu toggle bug by using CSS classes instead of inline styles.
- Added null checks for custom cursor in `index.html`.
- Optimized particle connection algorithm performance (O(n²) to distance-squared check).
- Balanced 3D tilt animation intensity (very subtle for large boxes, active for small cards).
- Replaced static particle system with global **Interactive 3D Tubes** background.

#### 2. Certificates Gallery Fixes
- Added image error handling and loading states to the lightbox in `Certificates.tsx`.
- Removed redundant/hardcoded dates from certificates.
- Fixed "Back to Home" navigation by using standard `<a>` tag to exit React context.
- Integrated **TubesBackground** component into the React gallery for a cohesive look.

#### 3. Codebase Optimization
- Enabled TypeScript `strict: true` and fixed resulting type errors.
- Removed 11 unused dependencies (e.g., `framer-motion`, `recharts`, `zod`).
- Deleted unused `App.css` and redundant `Home.tsx` placeholder.
- Added `<noscript>` fallback for better accessibility and SEO.
- Configured Vercel rewrites to handle `/certificates.html` routing correctly.

---

### TubesBackground Component Integration - COMPLETED

**Date:** 2026-04-14

**Problem:** TubesBackground component was created but not showing in the UI.

**Root Cause:**
- `src/Home.tsx` was deleted during cleanup, leaving no component to render at root `/` route
- `App.tsx` had an infinite redirect (`<Navigate to="/" replace />`) instead of rendering a component

**Fixes Applied:**

#### 1. Re-created `src/Home.tsx`
- Integrated TubesBackground as the container
- Added content with `pointer-events-auto` for clickable elements
- Applied `text-white` with `drop-shadow-[0_0_20px_rgba(0,0,0,1)]` for visibility
- Added click-to-randomize instructions at bottom

#### 2. Fixed `src/App.tsx`
- Changed root route from `<Navigate to="/" replace />` to `<Home />`
- Removed unnecessary Navigate import

**Key Implementation Details:**
- Canvas needs explicit dark background: `bg-[#04070d]`
- Text needs white color + drop shadows to be visible against neon tubes
- Content wrapper needs `pointer-events-auto` for links/buttons to work
- Tubes follow cursor movement in 3D space
- Click anywhere to randomize tube and light colors

**Files Modified:**
- **CREATED:** `src/Home.tsx`
- **MODIFIED:** `src/App.tsx`

**Status:** ✅ Completed
