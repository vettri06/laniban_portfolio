import React, { useEffect, useRef } from 'react';
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
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        const canvas = canvasRef.current;
        const maxTextureSize = 4096;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.min(window.innerWidth, maxTextureSize);
        const height = Math.min(window.innerHeight, maxTextureSize);

        // Keep GPU texture size bounded to avoid WebGPU max texture dimension errors.
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        // Load from CDN - MUST USE THIS EXACT URL
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvas, {
          tubes: {
            colors: tubeColors,
            lights: {
              intensity: 120,
              colors: lightColors
            }
          }
        });

        tubesRef.current = app;

        const handleResize = () => {
          const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
          const nextWidth = Math.min(window.innerWidth, maxTextureSize);
          const nextHeight = Math.min(window.innerHeight, maxTextureSize);
          canvas.width = Math.floor(nextWidth * nextDpr);
          canvas.height = Math.floor(nextHeight * nextDpr);
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
      className={cn("relative w-full min-h-screen overflow-hidden", className)}
      onClick={handleClick}
    >
      <div className="fixed inset-0 h-[100vh] w-[100vw] overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 block h-full w-full"
          style={{ touchAction: 'none' }}
        />
      </div>
      
      {/* Content Overlay - pointer-events-none allows clicks to pass through to canvas */}
      <div className="relative z-10 w-full min-h-screen pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
