import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { M90Renderer } from '../renderer/WebGLRenderer';
import type { PatternType } from '../renderer/WebGLRenderer';

interface CamoCanvasProps {
  seed: number;
  scale: number;
  complexity: number;
  colors: [number, number, number][];
  width: number;
  height: number;
  patternType: PatternType;
  isAnimating: boolean;
  animationSpeed: number;
  digitalCamo: boolean;
  pixelSize: number;
}

export interface CamoCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

const CamoCanvas = forwardRef<CamoCanvasHandle, CamoCanvasProps>(
  ({ seed, scale, complexity, colors, width, height, patternType, isAnimating, animationSpeed, digitalCamo, pixelSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<M90Renderer | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    // Resize canvas to fill viewport
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        if (rendererRef.current) {
          rendererRef.current.render(seed, scale, complexity, colors, patternType, 0, 1, digitalCamo ? pixelSize : 0);
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }, [seed, scale, complexity, colors, patternType, digitalCamo, pixelSize]);

    // Render on param changes (skip if animation loop is active)
    useEffect(() => {
      if (isAnimating && patternType === 'dazzle') return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!rendererRef.current) {
        rendererRef.current = new M90Renderer(canvas);
      }

      rendererRef.current.render(seed, scale, complexity, colors, patternType, 0, 1, digitalCamo ? pixelSize : 0);
    }, [seed, scale, complexity, colors, width, height, patternType, isAnimating, digitalCamo, pixelSize]);

    // Animation loop for dazzle stripe scrolling
    useEffect(() => {
      if (!isAnimating || patternType !== 'dazzle') return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!rendererRef.current) {
        rendererRef.current = new M90Renderer(canvas);
      }

      let rafId: number;
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;
        rendererRef.current!.render(seed, scale, complexity, colors, patternType, elapsed, animationSpeed, digitalCamo ? pixelSize : 0);
        rafId = requestAnimationFrame(animate);
      };

      rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }, [isAnimating, patternType, seed, scale, complexity, colors, animationSpeed, digitalCamo, pixelSize]);

    useEffect(() => {
      return () => {
        rendererRef.current?.dispose();
        rendererRef.current = null;
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    );
  }
);

CamoCanvas.displayName = 'CamoCanvas';

export { CamoCanvas };
