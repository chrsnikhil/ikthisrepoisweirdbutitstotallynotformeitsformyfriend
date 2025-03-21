'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type p5Type from 'p5';

interface Point {
  x: number;
  y: number;
  color: p5Type.Color;
}

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    const initP5 = async () => {
      const p5 = (await import('p5')).default;

      const sketch = (p: p5Type) => {
        let points: Point[] = [];
        
        p.setup = () => {
          const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
          canvas.parent(canvasRef.current!);
          p.background(0);
          p.noStroke();
        };

        p.draw = () => {
          p.background(0, 10);
          
          if (p.mouseIsPressed) {
            const color = p.color(
              p.random(150, 255),
              p.random(100, 200),
              p.random(150, 255),
              p.random(150, 200)
            );
            
            points.push({
              x: p.mouseX,
              y: p.mouseY,
              color: color
            });
          }

          points.forEach((point) => {
            p.fill(point.color);
            p.circle(point.x, point.y, 20);
            
            // Mirror effect
            p.circle(p.width - point.x, point.y, 20);
            p.circle(point.x, p.height - point.y, 20);
            p.circle(p.width - point.x, p.height - point.y, 20);
          });

          // Limit the number of points to prevent performance issues
          if (points.length > 100) {
            points = points.slice(-100);
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);
          p.background(0);
        };
      };

      new p5(sketch);
    };

    initP5();
  }, []);

  return <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default dynamic(() => Promise.resolve(DrawingCanvas), {
  ssr: false
}); 