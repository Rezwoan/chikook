import { useEffect, useRef } from 'react';
import { useCookingStore } from '../store/cookingStore';

export const useTimer = () => {
  const { timer, updateTimerRemaining, resetTimer, setTimerRunning } = useCookingStore();
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!timer.isRunning || timer.remainingTime <= 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = (now - lastUpdateRef.current) / 1000; // Convert to seconds
      lastUpdateRef.current = now;

      const newRemaining = Math.max(0, timer.remainingTime - elapsed);
      updateTimerRemaining(newRemaining);

      if (newRemaining > 0) {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        // Timer completed
        setTimerRunning(false);
        
        // Trigger completion events (notifications, sound, vibration)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Timer Complete!', {
            body: 'Your cooking step is done.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
          });
        }

        // Play sound
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {
          // Autoplay might be blocked
        });

        // Vibrate on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }
    };

    lastUpdateRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timer.isRunning, timer.remainingTime, updateTimerRemaining, resetTimer, setTimerRunning]);

  // Handle page visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, timer logic will pause naturally
      } else {
        // Tab is visible again, reset last update time
        lastUpdateRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    ...timer,
    formatTime,
  };
};
