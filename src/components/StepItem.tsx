import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import type { CookingStep } from '../data/cookingSteps';
import { useCookingStore } from '../store/cookingStore';
import { Check, Clock, Lock } from 'lucide-react';
import TimerDisplay from './Timer/TimerDisplay';

interface StepItemProps {
  step: CookingStep;
  index: number;
}

const getStepIcon = (iconType: string) => {
  const iconMap: Record<string, string> = {
    'flame': '🔥',
    'spice': '🧂',
    'potato': '🥔',
    'onion': '🧅',
    'spices': '🌶️',
    'ginger': '🫚',
    'chicken': '🍗',
    'spice-mix': '🌿',
    'timer': '⏲️',
    'pot-lid': '🍲',
    'spice-powder': '✨',
    'cook': '🔥',
    'add': '➕',
    'water': '💧',
    'simmer': '♨️',
    'finish': '✅',
  };
  
  return (
    <span className="step-icon" role="img" aria-label={iconType}>
      {iconMap[iconType] || '👨‍🍳'}
    </span>
  );
};

const StepItem: React.FC<StepItemProps> = ({ step, index }) => {
  const { toggleStep, canCompleteStep, timer } = useCookingStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const isActiveTimer = timer.stepId === step.id;
  const canComplete = canCompleteStep(step.id);
  const isLocked = !canComplete && !step.completed;

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 20,
        duration: 0.4,
        delay: index * 0.05,
        ease: 'power2.out',
        clearProps: 'transform',
      });
    }
  }, [index]);

  const handleToggle = () => {
    if (canComplete || step.completed) {
      toggleStep(step.id);
      
      // GSAP celebration animation on completion
      if (!step.completed && cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      }
    }
  };

  const stepClasses = `step-card ${step.completed ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isActiveTimer ? 'active' : ''}`;
  const checkboxClasses = `step-checkbox ${step.completed ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;

  return (
    <div ref={cardRef} className={stepClasses}>
      {/* Checkbox/Lock Icon */}
      <motion.button
        whileTap={{ scale: isLocked ? 1 : 0.95 }}
        onClick={handleToggle}
        disabled={isLocked && !step.completed}
        className={checkboxClasses}
        aria-label={step.completed ? 'Mark as incomplete' : isLocked ? 'Locked' : 'Mark as complete'}
      >
        {step.completed ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <Check className="w-7 h-7" strokeWidth={3} />
          </motion.div>
        ) : isLocked ? (
          <Lock className="w-6 h-6" />
        ) : (
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--color-primary)' }} />
        )}
      </motion.button>

      {/* Content */}
      <div className="step-content">
        {/* Step Header */}
        <div className="step-header">
          <span className="step-badge">STEP {step.id}</span>
          {getStepIcon(step.iconType)}
          {step.timerDuration && !step.completed && (
            <div className="timer-badge">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(step.timerDuration / 60)}m</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className={`step-description ${step.completed ? 'completed' : ''}`}>
          {step.description}
        </p>

        {/* Lock Message */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="lock-message"
          >
            <Lock className="w-3 h-3" />
            <span>Complete previous step first</span>
          </motion.div>
        )}

        {/* Active Timer Display — show when running OR alarming */}
        {isActiveTimer && (timer.isRunning || timer.isAlarming) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: '1rem' }}
          >
            <TimerDisplay />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StepItem;
