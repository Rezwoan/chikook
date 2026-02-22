import React from 'react';
import { useCookingStore } from '../store/cookingStore';
import StepItem from './StepItem';
import { AnimatePresence } from 'framer-motion';

const StepList: React.FC = () => {
  const steps = useCookingStore((state) => state.steps);

  return (
    <div className="steps-container">
      <AnimatePresence>
        {steps.map((step, index) => (
          <StepItem key={step.id} step={step} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StepList;
