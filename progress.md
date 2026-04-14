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
