import React from 'react';
import { motion } from 'framer-motion';
import { useCookingStore } from '../../store/cookingStore';
import { Pause, Play, RotateCcw } from 'lucide-react';

const TimerControls: React.FC = () => {
  const { timer, pauseTimer, resumeTimer, resetTimer } = useCookingStore();

  return (
    <div className="timer-controls">
      {/* Play / Pause — M3 Filled Tonal primary button */}
      {timer.isRunning ? (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={pauseTimer}
          className="icon-btn standard"
          aria-label="Pause timer"
        >
          <Pause />
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={resumeTimer}
          className="icon-btn primary"
          aria-label="Resume timer"
        >
          <Play />
        </motion.button>
      )}

      {/* Reset — M3 Standard Icon Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={resetTimer}
        className="icon-btn standard"
        aria-label="Reset timer"
      >
        <RotateCcw />
      </motion.button>
    </div>
  );
};

export default TimerControls;

