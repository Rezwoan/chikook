import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';
import { useCookingStore } from '../../store/cookingStore';
import { stopAlarm } from '../../utils/alarm';
import TimerControls from './TimerControls';
import { Clock, AlarmClock } from 'lucide-react';

const TimerDisplay: React.FC = () => {
  const { remainingTime, isRunning, isAlarming, stepId, duration, formatTime } = useTimer();
  const dismissAlarm = useCookingStore((state) => state.dismissAlarm);

  const percentage = duration > 0 ? (remainingTime / duration) * 100 : 0;
  const totalSeconds = Math.ceil(remainingTime);

  const handleStopAlarm = () => {
    stopAlarm();
    if (stepId !== null) {
      dismissAlarm(stepId);
    }
  };

  return (
    <div className="timer-display">
      {/* Alarm state — replaces timer content entirely */}
      {isAlarming ? (
        <motion.div
          key="alarm-view"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1rem', padding: '0.5rem 0',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [-10, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AlarmClock style={{ width: 48, height: 48, color: 'var(--color-primary)' }} />
          </motion.div>

          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Alumni Sans SC, sans-serif',
              fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.05em', marginBottom: '0.25rem',
            }}>
              Time's Up!
            </p>
            <p style={{ fontSize: '0.813rem', color: 'var(--color-text-muted)' }}>
              Stop the alarm to mark this step done
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStopAlarm}
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-bg-primary)',
              border: 'none', borderRadius: '999px',
              padding: '0.75rem 2rem',
              fontFamily: 'Alumni Sans SC, sans-serif',
              fontSize: '1.063rem', fontWeight: 700,
              letterSpacing: '0.08em', cursor: 'pointer',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-primary) 30%, transparent)',
            }}
          >
            Stop Alarm
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock
                style={{
                  width: '20px',
                  height: '20px',
                  color: 'var(--color-primary)',
                  animation: isRunning ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              />
              <span style={{ fontSize: '0.813rem', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Timer Active
              </span>
            </div>
            <TimerControls />
          </div>

          {/* Big time display */}
          <motion.div
            key={totalSeconds}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
            className="timer-value"
          >
            {formatTime(remainingTime)}
          </motion.div>

          {/* Progress bar */}
          <div style={{
            width: '100%', height: '6px', background: 'var(--color-bg-primary)',
            borderRadius: '999px', overflow: 'hidden', margin: '0.75rem 0 0.5rem',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                borderRadius: '999px',
              }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>

          {isRunning && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Keep cooking! Timer is running…
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TimerDisplay;

