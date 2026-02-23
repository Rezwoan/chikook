import { useEffect, useRef } from 'react';
import { useCookingStore } from '../store/cookingStore';
import { startAlarm, stopAlarm } from '../utils/alarm';

export const useTimer = () => {
  const timer = useCookingStore((state) => state.timer);
  const updateTimerRemaining = useCookingStore((state) => state.updateTimerRemaining);
  const triggerAlarm = useCookingStore((state) => state.triggerAlarm);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Wall-clock end time — stays accurate across re-renders and tab switches
  const endTimeRef = useRef<number>(0);

  // Countdown tick
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!timer.isRunning || timer.remainingTime <= 0) return;

    // Anchor end time to wall clock
    endTimeRef.current = Date.now() + timer.remainingTime * 1000;

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000);
      updateTimerRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        // Trigger alarm — do NOT auto-complete; user must click "Stop Alarm"
        triggerAlarm();
        startAlarm();

        // Optional system notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ Timer Done!', {
            body: 'Tap "Stop Alarm" to mark the step complete.',
            icon: '/icons/icon-192x192.png',
          });
        }
      }
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // NOT on remainingTime — that's what made the old version slow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isRunning, timer.stepId, timer.duration]);

  // If the app reloads while the alarm was persisted as ringing, restart audio
  useEffect(() => {
    if (timer.isAlarming) {
      startAlarm();
    } else {
      stopAlarm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isAlarming]);

  // Handle tab visibility — recalculate remaining from wall clock
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && timer.isRunning && endTimeRef.current > 0) {
        const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000);
        updateTimerRemaining(remaining);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [timer.isRunning, updateTimerRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { ...timer, formatTime };
};
