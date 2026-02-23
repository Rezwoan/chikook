import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import type { CookingStep } from '../data/cookingSteps';
import { useCookingStore } from '../store/cookingStore';
import { Check, Clock, Lock } from 'lucide-react';
import TimerDisplay from './Timer/TimerDisplay';

interface StepItemProps {
  step: CookingStep;
  index: number;
}

const iconMap: Record<string, string> = {
  flame: '🔥', spice: '🧂', potato: '🥔', onion: '🧅',
  spices: '🌶️', ginger: '🫚', chicken: '🍗', 'spice-mix': '🌿',
  timer: '⏲️', 'pot-lid': '🍲', 'spice-powder': '✨', cook: '🔥',
  add: '➕', water: '💧', simmer: '♨️', finish: '✅',
};

const StepItem: React.FC<StepItemProps> = ({ step, index }) => {
  const { toggleStep, canCompleteStep, timer } = useCookingStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const isActiveTimer = timer.stepId === step.id;
  const canComplete = canCompleteStep(step.id);
  const isLocked = !canComplete && !step.completed;

  // M3 entrance: slide up + fade
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, delay: index * 0.04, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }
  }, [index]);

  const handleToggle = () => {
    if (canComplete || step.completed) {
      toggleStep(step.id);
      if (!step.completed && cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1.03, duration: 0.15,
          yoyo: true, repeat: 1, ease: 'power2.inOut',
        });
      }
    }
  };

  const cardClass = [
    'step-card',
    step.completed ? 'completed' : '',
    isLocked ? 'locked' : '',
    isActiveTimer ? 'active' : '',
  ].filter(Boolean).join(' ');

  const checkboxClass = [
    'step-checkbox',
    step.completed ? 'completed' : '',
    isLocked ? 'locked' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={cardRef} className={cardClass}>
      {/* M3 Checkbox */}
      <motion.button
        whileTap={{ scale: isLocked ? 1 : 0.92 }}
        onClick={handleToggle}
        disabled={isLocked && !step.completed}
        className={checkboxClass}
        aria-label={step.completed ? 'Mark as incomplete' : isLocked ? 'Locked — complete previous step first' : 'Mark as complete'}
      >
        {step.completed ? (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <Check strokeWidth={2.5} style={{ width: 20, height: 20 }} />
          </motion.div>
        ) : isLocked ? (
          <Lock style={{ width: 16, height: 16 }} />
        ) : null}
      </motion.button>

      {/* M3 Card Content */}
      <div className="step-content">
        <div className="step-header">
          {/* M3 Assist chip — step number */}
          <span className="step-badge">Step {step.id}</span>

          {/* Emoji Icon */}
          <span className="step-icon" role="img" aria-label={step.iconType}>
            {iconMap[step.iconType] ?? '👨‍🍳'}
          </span>

          {/* M3 Suggestion chip — timer duration */}
          {step.timerDuration && !step.completed && (
            <div className="timer-badge">
              <Clock style={{ width: 11, height: 11 }} />
              <span>{Math.floor(step.timerDuration / 60)}m</span>
            </div>
          )}
        </div>

        {/* Body Medium */}
        <p className={`step-description${step.completed ? ' completed' : ''}`}>
          {step.description}
        </p>

        {/* Lock hint */}
        <AnimatePresence>
          {isLocked && (
            <motion.div
              key="lock"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="lock-message"
            >
              <Lock style={{ width: 11, height: 11 }} />
              <span>Complete previous step first</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline timer panel */}
        <AnimatePresence>
          {isActiveTimer && (timer.isRunning || timer.isAlarming) && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            >
              <TimerDisplay />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StepItem;