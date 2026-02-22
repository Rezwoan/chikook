import React from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../../hooks/useTimer';
import TimerControls from './TimerControls';
import { Clock } from 'lucide-react';

const TimerDisplay: React.FC = () => {
  const { remainingTime, isRunning, formatTime } = useTimer();

  const totalSeconds = Math.ceil(remainingTime);
  const percentage = remainingTime > 0 ? (remainingTime / useTimer().duration) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-accent shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent animate-pulse" />
          <span className="text-sm font-semibold text-text-light">Timer Active</span>
        </div>
        <TimerControls />
      </div>

      {/* Timer Display */}
      <div className="text-center mb-3">
        <motion.div
          key={totalSeconds}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-5xl font-bold text-primary font-display"
        >
          {formatTime(remainingTime)}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-secondary rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {isRunning && (
        <p className="text-xs text-center text-text-light mt-2">
          Keep cooking! Timer is running...
        </p>
      )}
    </div>
  );
};

export default TimerDisplay;
