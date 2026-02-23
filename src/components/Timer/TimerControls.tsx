import React from 'react';
import { motion } from 'framer-motion';
import { useCookingStore } from '../../store/cookingStore';
import { Pause, Play, RotateCcw } from 'lucide-react';

const btnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '32px', height: '32px', borderRadius: '50%',
  border: '1px solid var(--color-border)',
  cursor: 'pointer', background: 'var(--color-bg-elevated)',
  color: 'var(--color-text-primary)',
};

const TimerControls: React.FC = () => {
  const { timer, pauseTimer, resumeTimer, resetTimer } = useCookingStore();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      {timer.isRunning ? (
        <motion.button whileTap={{ scale: 0.9 }} onClick={pauseTimer} style={btnStyle} aria-label="Pause timer">
          <Pause style={{ width: '14px', height: '14px' }} />
        </motion.button>
      ) : (
        <motion.button whileTap={{ scale: 0.9 }} onClick={resumeTimer} style={{ ...btnStyle, background: 'var(--color-success)', borderColor: 'var(--color-success)', color: '#fff' }} aria-label="Resume timer">
          <Play style={{ width: '14px', height: '14px' }} />
        </motion.button>
      )}
      <motion.button whileTap={{ scale: 0.9 }} onClick={resetTimer} style={btnStyle} aria-label="Reset timer">
        <RotateCcw style={{ width: '14px', height: '14px' }} />
      </motion.button>
    </div>
  );
};

export default TimerControls;

