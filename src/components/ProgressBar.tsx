import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookingStore } from '../store/cookingStore';
import { useRecipeStore } from '../store/recipeStore';
import { ChevronLeft } from 'lucide-react';

interface ProgressBarProps {
  onGoToLibrary?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ onGoToLibrary }) => {
  const steps = useCookingStore((state) => state.steps);
  const getActiveRecipe = useRecipeStore((state) => state.getActiveRecipe);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const activeRecipe = getActiveRecipe();

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
            🎉 Your {activeRecipe?.name ?? 'dish'} is ready!
          </motion.p>
        )}
        {completedCount === totalCount && totalCount > 0 && onGoToLibrary && (
          <motion.button
            key="back-cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 0.15 }}
            className="completion-back-btn"
            onClick={onGoToLibrary}
          >
            <ChevronLeft size={16} />
            Back to Recipes
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressBar;
