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
          <div className="alarm-body">
            <div className="alarm-icon-wrapper">
              <motion.div
                style={{ transformOrigin: 'center bottom' }}
                animate={{ rotate: [-14, 14, -10, 10, -6, 6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.2 }}
              >
                <AlarmClock className="alarm-icon" />
              </motion.div>
            </div>

            <div className="alarm-text">
              <p className="alarm-title">Time's up!</p>
              <p className="alarm-subtitle">Stop the alarm to mark step done</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStopAlarm}
              className="icon-btn alarm-stop"
              aria-label="Stop alarm"
            >
              <BellRing />
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
          <div className="timer-header">
            <div className={`timer-label${isRunning ? ' running' : ''}`}>
              <Clock />
              <span>{isRunning ? 'Running' : 'Paused'}</span>
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
          <div className="timer-progress">
            <motion.div
              className="timer-progress-bar"
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

