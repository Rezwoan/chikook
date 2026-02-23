import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';
import { useCookingStore } from '../../store/cookingStore';
import { stopAlarm } from '../../utils/alarm';
import TimerControls from './TimerControls';
import { Clock, AlarmClock, BellRing } from 'lucide-react';

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
    <AnimatePresence mode="wait">
      {isAlarming ? (
        /* ── M3 Alarm Card ─── */
        <motion.div
          key="alarm"
          className="timer-display timer-alarm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
            <motion.div
              animate={{ rotate: [-15, 15, -15, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <AlarmClock style={{ width: 44, height: 44, color: 'var(--md-on-error-container)' }} />
            </motion.div>

            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '1.375rem',
                fontWeight: 400,
                color: 'var(--md-on-error-container)',
                letterSpacing: 0,
                marginBottom: '0.25rem',
              }}>
                Time's up!
              </p>
              <p style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.031em',
                color: 'var(--md-on-error-container)',
                opacity: 0.72,
              }}>
                Stop the alarm to mark step done
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStopAlarm}
              className="icon-btn alarm-stop"
              aria-label="Stop alarm"
            >
              <BellRing style={{ width: 18, height: 18 }} />
              <span>Stop Alarm</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* ── M3 Timer Card ─── */
        <motion.div
          key="timer"
          className="timer-display"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Clock
                style={{
                  width: 16,
                  height: 16,
                  color: 'var(--md-primary)',
                  ...(isRunning ? { animation: 'pulse 1.5s ease-in-out infinite' } : {}),
                }}
              />
              <span style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.031em',
                textTransform: 'uppercase',
                color: 'var(--md-on-surface-variant)',
              }}>
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
            <TimerControls />
          </div>

          {/* M3 Display Medium — Roboto Mono time digits */}
          <motion.div
            key={totalSeconds}
            initial={{ opacity: 0.7, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            className="timer-value"
          >
            {formatTime(remainingTime)}
          </motion.div>

          {/* M3 Linear Progress */}
          <div style={{
            width: '100%', height: '4px',
            background: 'var(--md-outline-variant)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '0.875rem',
          }}>
            <motion.div
              style={{ height: '100%', background: 'var(--md-primary)', borderRadius: '9999px' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimerDisplay;

