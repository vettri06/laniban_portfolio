# TODO: Implement Interactive 3D Tubes Background Component

**Priority:** High  
**Component:** TubesBackground - Interactive 3D Neon Tubes Cursor Effect  
**Source:** `threejs-components` library (CDN: `https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js`)

---

## Task 1: Create Component File

**File to Create:** `src/components/TubesBackground.tsx`

**Exact Implementation:**

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Helper for random hex colors
const randomColors = (count: number): string[] => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
  tubeColors?: string[];
  lightColors?: string[];
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true,
  tubeColors = ["#f967fb", "#53bc28", "#6958d5"],
  lightColors = ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Load from CDN - MUST USE THIS EXACT URL
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: tubeColors,
            lights: {
              intensity: 200,
              colors: lightColors
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          // Library handles resize internally
        };

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, [tubeColors, lightColors]);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const newTubeColors = randomColors(3);
    const newLightColors = randomColors(4);
    
    tubesRef.current.tubes.setColors(newTubeColors);
    tubesRef.current.tubes.setLightsColors(newLightColors);
  };

  return (
    <div 
      className={cn("relative w-full h-full min-h-[400px] overflow-hidden", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      
      {/* Content Overlay - pointer-events-none allows clicks to pass through to canvas */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
```

**CRITICAL NOTES:**
- MUST use exact CDN URL: `https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js`
- The `@ts-ignore` comment is REQUIRED because the CDN module has no TypeScript definitions
- `tubesRef.current.tubes.setColors()` and `setLightsColors()` are the CORRECT API methods

---

## Task 2: Integrate into Hero Section

**File to Modify:** `src/Home.tsx`

**Current State:** Hero section has simple styling with no background effect.

**Required Changes:**

1. Import the component at the top:
```tsx
import { TubesBackground } from '@/components/TubesBackground';
```

2. Wrap the hero content with TubesBackground:

**BEFORE (Current):**
```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col items-center justify-center text-center">
        <h1 className="mb-3 text-balance text-3xl font-bold leading-tight sm:mb-4 sm:text-4xl md:text-5xl">
          Welcome to My Portfolio
        </h1>
        {/* ... rest of content */}
      </div>
    </div>
  );
}
```

**AFTER (Required):**
```tsx
export default function Home() {
  return (
    <TubesBackground className="min-h-screen bg-background">
      <div className="pointer-events-auto min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col items-center justify-center text-center">
          <h1 className="mb-3 text-balance text-3xl font-bold leading-tight sm:mb-4 sm:text-4xl md:text-5xl text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)]">
            Welcome to My Portfolio
          </h1>
          <p className="mb-6 max-w-xl text-sm text-white/90 sm:mb-8 sm:text-base md:text-lg drop-shadow-md">
            Explore my work and achievements.
          </p>
          <nav className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              to="/certificates"
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 sm:w-auto sm:text-base"
            >
              View Certificates
            </Link>
          </nav>
        </div>
      </div>
    </TubesBackground>
  );
}
```

**CRITICAL STYLING REQUIREMENTS:**
- Add `pointer-events-auto` to the inner content wrapper to make buttons/links clickable
- Add `text-white` and `drop-shadow-[0_0_20px_rgba(0,0,0,1)]` to headings for visibility against neon tubes
- Add `text-white/90` to paragraphs with `drop-shadow-md`
- Remove the outer `div` wrapper - TubesBackground becomes the container

---

## Task 3: Add Click-to-Randomize Instructions

**File to Modify:** `src/Home.tsx`

Add instructions below the main content to inform users about the click interaction:

```tsx
<div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/50 animate-pulse">
  <span className="text-xs uppercase tracking-widest">Click anywhere to randomize colors</span>
</div>
```

---

## Task 4: Update Global Styles (if needed)

**File:** `src/index.css`

Ensure no conflicts with the canvas:

```css
/* Ensure canvas doesn't get clipped */
canvas {
  display: block;
}

/* Ensure TubesBackground container fills space */
.tubes-background {
  position: relative;
  width: 100%;
  height: 100%;
}
```

---

## Task 5: Verify Dependencies

**File:** `package.json`

Ensure these dependencies exist (already present in your codebase):
- `lucide-react` - for icons (optional)
- `clsx` and `tailwind-merge` - already in `@/lib/utils`

**NO additional npm install needed** - the `threejs-components` library loads from CDN.

---

## Implementation Checklist

- [x] Created `src/components/TubesBackground.tsx` with exact code above
- [x] Updated `index.html` and `src/Certificates.tsx` to use Tubes background
- [x] Added `pointer-events-auto` to content wrapper in React
- [x] Updated text visibility with drop shadows
- [x] Enabled click-to-randomize interaction
- [x] Verified cursor interaction works well all over the website
- [x] Ensured no TypeScript errors
- [x] Tested responsive behavior on resize

---

## 🐛 BUG FIX APPLIED - TubesBackground Not Showing

**Date:** 2026-04-14  
**Status:** ✅ FIXED

### Root Cause Analysis

**Problem:** TubesBackground component exists but is not rendered in the UI.

**Causes Found:**

1. **Missing Home.tsx File**
   - `src/Home.tsx` was deleted during cleanup (mentioned in progress.md)
   - App.tsx had an infinite redirect: `<Navigate to="/" replace />`
   - No component was rendering at the root `/` route

2. **App.tsx Broken Route**
   ```tsx
   // BEFORE (Broken):
   <Route path="/" element={<Navigate to="/" replace />} />
   // This creates an infinite loop - navigating to / redirects to /
   ```

### Fixes Applied

#### Fix 1: Re-created `src/Home.tsx`
```tsx
import { Link } from 'react-router-dom'
import { TubesBackground } from './components/TubesBackground'

export default function Home() {
  return (
    <TubesBackground className="min-h-screen bg-[#04070d]">
      <div className="pointer-events-auto min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* ... content with text-white and drop shadows ... */}
      </div>
    </TubesBackground>
  )
}
```

#### Fix 2: Updated `src/App.tsx`
```tsx
import Home from './Home'

// BEFORE:
<Route path="/" element={<Navigate to="/" replace />} />

// AFTER:
<Route path="/" element={<Home />} />
```

### Files Modified
- **CREATED:** `src/Home.tsx` - Re-created with TubesBackground integration
- **MODIFIED:** `src/App.tsx` - Fixed root route to render Home component

### Critical Styling Notes

The TubesBackground renders a canvas that fills its container. For content to be visible:

1. **Text must be white with drop shadow:**
   ```tsx
   <h1 className="text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)]">...</h1>
   <p className="text-white/90 drop-shadow-md">...</p>
   ```

2. **Content wrapper needs `pointer-events-auto`:**
   ```tsx
   <div className="pointer-events-auto">...</div>
   ```
   Without this, clicks pass through to the canvas and links/buttons won't work.

3. **Canvas needs explicit background color:**
   ```tsx
   <TubesBackground className="bg-[#04070d]">...</TubesBackground>
   ```
   The canvas itself is transparent - the container provides the dark background.

---

## Expected Behavior

1. **On Load:** Canvas displays with 3 neon tubes (pink, green, purple) with colored lights
2. **Mouse Move:** Tubes follow cursor position in 3D space
3. **Click:** Instantly randomizes all tube and light colors
4. **Content:** All text/buttons remain visible and interactive on top of the effect

---

## Troubleshooting

**If tubes don't appear:**
- Check browser console for CDN load errors
- Verify `threejs-components` CDN is accessible
- Check for CORS issues (unlikely with jsdelivr)

**If clicking doesn't randomize colors:**
- Verify `tubesRef.current.tubes.setColors` exists
- Check console for "Failed to load TubesCursor" error
- Ensure `enableClickInteraction` prop is not set to `false`

**If content is not clickable:**
- Verify `pointer-events-auto` is on the content wrapper
- Check z-index hierarchy (content should be z-10)

---

## Files Modified Summary

1. **NEW:** `src/components/TubesBackground.tsx` - Main component
2. **MODIFIED:** `src/Home.tsx` - Integration point

**No other files should be modified.**
