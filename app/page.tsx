'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaHeart } from 'react-icons/fa';
import DrawingCanvas from './components/DrawingCanvas';

export default function Home() {
  const [showDrawing, setShowDrawing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize floating hearts
    const initialHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: dimensions.height + 100
    }));
    setHearts(initialHearts);
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const createHearts = (e: React.MouseEvent) => {
    const heart = document.createElement('div');
    heart.className = 'heart-animation';
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 relative overflow-hidden flex items-center justify-center p-4"
      onClick={createHearts}
    >
      <AnimatePresence>
        {!showDrawing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center"
          >
            <motion.div
              className="w-full bg-white/90 rounded-[3rem] p-8 md:p-12 shadow-xl border-2 border-pink-200 flex flex-col items-center justify-center text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-8 text-pink-600 font-playfair"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 1 }}
              >
                Happy Birthday, Yazhini!
              </motion.h1>

              <motion.p
                className="text-xl md:text-3xl text-pink-500 mb-10 font-dancing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                To the most wonderful person in my life...
              </motion.p>

              <motion.div
                className="space-y-6 w-full max-w-xl mx-auto text-lg md:text-xl text-pink-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="font-dancing">
                  Every moment with you is a gift, and today is extra special because it's all about you.
                  Your smile lights up my world, and your love makes everything beautiful.
                </p>
              </motion.div>

              <motion.button
                onClick={() => setShowDrawing(true)}
                className="mt-12 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full text-xl font-semibold shadow-xl hover:shadow-pink-200/50 transition-all duration-300 flex items-center justify-center hover:from-pink-500 hover:to-pink-600 relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(236, 72, 153, 0.7)",
                    "0 0 0 20px rgba(236, 72, 153, 0)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                <div className="relative z-10 text-xl md:text-2xl font-dancing p-4">
                  Click for a<br />Special Surprise<br />✨
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-300 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10"
          >
            <DrawingCanvas />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-500"
            initial={{ x: heart.x, y: heart.y }}
            animate={{
              y: -100,
              x: heart.x + Math.sin(heart.id) * 100,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <FaHeart className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;700&display=swap');

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-dancing {
          font-family: 'Dancing Script', cursive;
        }

        .heart-animation {
          position: fixed;
          font-size: 24px;
          color: #ec4899;
          pointer-events: none;
          animation: float-heart 1s ease-out forwards;
        }

        @keyframes float-heart {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2.5) translateY(-50px) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
} 