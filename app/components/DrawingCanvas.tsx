'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const maxClicks = 40;
  const symmetry = 24;
  const drawingPoints = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation frame
    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      drawingPoints.current.forEach((point, index) => {
        const angle = 360 / symmetry;
        
        for (let i = 0; i < symmetry; i++) {
          ctx.rotate((angle * Math.PI) / 180);
          
          // Draw with gradient effect
          const gradientSteps = 8;
          for (let j = 0; j < gradientSteps; j++) {
            const alpha = (1 - j / gradientSteps) * 0.8;
            const hue = ((index / maxClicks) * 360 + Date.now() * 0.1) % 360;
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.lineWidth = 4 - (j * 3) / gradientSteps;
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.px, point.py);
            ctx.stroke();

            // Draw reflected line
            ctx.save();
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.px, point.py);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      ctx.restore();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (clickCount >= maxClicks) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;
    
    const angle = (Math.PI * 2 / maxClicks) * clickCount;
    const radius = Math.sqrt(x * x + y * y);
    
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;

    drawingPoints.current.push({
      x: px,
      y: py,
      px: px * 0.3,
      py: py * 0.3,
      index: clickCount
    });

    if (clickCount > 0) {
      const prevPoint = drawingPoints.current[clickCount - 1];
      drawingPoints.current.push({
        x: px,
        y: py,
        px: prevPoint.x,
        py: prevPoint.y,
        index: clickCount + maxClicks/2
      });
    }

    setClickCount(prev => prev + 1);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xl font-dancing text-center bg-black/50 px-6 py-2 rounded-full"
      >
        {clickCount < maxClicks ? (
          `Click to Draw (${maxClicks - clickCount} left)`
        ) : (
          'Pattern Complete! ✨'
        )}
      </motion.div>
    </div>
  );
};

export default DrawingCanvas; 