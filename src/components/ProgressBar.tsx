import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookingStore } from '../store/cookingStore';

const ProgressBar: React.FC = () => {
  const steps = useCookingStore((state) => state.steps);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="progress-section">
      {/* M3 Label row */}
      <div className="progress-header">
        <h2>Cooking Progress</h2>
        <span className="progress-count">{completedCount} / {totalCount}</span>
      </div>

      {/* M3 Linear Progress Indicator */}
      <div className="progress-bar-container" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="progress-bar-fill"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        />
      </div>

      {/* Completion badge */}
      <AnimatePresence>
        {completedCount === totalCount && totalCount > 0 && (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              marginTop: '0.625rem',
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--md-primary)',
              letterSpacing: '0.007em',
            }}
          >
            🎉 Your chicken is ready!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressBar;
