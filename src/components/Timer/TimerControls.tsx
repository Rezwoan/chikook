import React from 'react';
import { motion } from 'framer-motion';
import { useCookingStore } from '../../store/cookingStore';
import { Pause, Play, RotateCcw } from 'lucide-react';

const TimerControls: React.FC = () => {
  const { timer, pauseTimer, resumeTimer, resetTimer } = useCookingStore();

  return (
    <div className="flex items-center gap-2">
      {/* Pause/Resume Button */}
      {timer.isRunning ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={pauseTimer}
          className="p-2 rounded-full bg-accent text-white hover:bg-opacity-80 transition-colors"
          aria-label="Pause timer"
        >
          <Pause className="w-4 h-4" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resumeTimer}
          className="p-2 rounded-full bg-success text-white hover:bg-opacity-80 transition-colors"
          aria-label="Resume timer"
        >
          <Play className="w-4 h-4" />
        </motion.button>
      )}

      {/* Reset Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={resetTimer}
        className="p-2 rounded-full bg-text-light text-white hover:bg-opacity-80 transition-colors"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default TimerControls;
