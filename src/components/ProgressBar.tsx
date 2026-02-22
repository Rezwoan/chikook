import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useCookingStore } from '../store/cookingStore';

const ProgressBar: React.FC = () => {
  const steps = useCookingStore((state) => state.steps);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const completedCount = steps.filter((step) => step.completed).length;
  const totalCount = steps.length;
  const percentage = (completedCount / totalCount) * 100;

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: percentage / 100,
        duration: 0.8,
        ease: 'power2.out',
        transformOrigin: 'left',
      });
    }
  }, [percentage]);

  return (
    <div className="progress-section">
      <div className="progress-header">
        <h2>Cooking Progress</h2>
        <span className="progress-count">
          {completedCount} / {totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div ref={progressRef} className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-success)' }}
        >
          🎉 Congratulations! Your chicken is ready! 🎉
        </motion.div>
      )}

      {completedCount > 0 && completedCount < totalCount && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
          Keep going! You're {Math.round(percentage)}% done.
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
