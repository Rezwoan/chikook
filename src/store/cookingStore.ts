import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cookingSteps } from '../data/cookingSteps';
import type { CookingStep } from '../data/cookingSteps';

interface TimerState {
  stepId: number | null;
  remainingTime: number; // in seconds
  isRunning: boolean;
  startTime: number | null; // timestamp when timer started
  duration: number; // original duration in seconds
}

interface CookingStore {
  steps: CookingStep[];
  timer: TimerState;
  currentStepIndex: number;
  
  // Actions
  toggleStep: (stepId: number) => void;
  canCompleteStep: (stepId: number) => boolean;
  startTimer: (stepId: number, duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  updateTimerRemaining: (remaining: number) => void;
  resetTimer: () => void;
  resetAllSteps: () => void;
  setTimerRunning: (isRunning: boolean) => void;
}

export const useCookingStore = create<CookingStore>()(
  persist(
    (set) => ({
      steps: cookingSteps,
      currentStepIndex: 0,
      timer: {
        stepId: null,
        remainingTime: 0,
        isRunning: false,
        startTime: null,
        duration: 0,
      },

      canCompleteStep: (stepId: number) => {
        const state = useCookingStore.getState();
        const stepIndex = state.steps.findIndex((s) => s.id === stepId);
        
        if (stepIndex === 0) return true; // First step can always be completed
        
        // Check if all previous steps are completed
        for (let i = 0; i < stepIndex; i++) {
          if (!state.steps[i].completed) {
            return false;
          }
        }
        return true;
      },

      toggleStep: (stepId: number) => {
        set((state) => {
          // Check if step can be completed
          if (!state.canCompleteStep(stepId)) {
            return state; // Don't allow toggling if prerequisites not met
          }

          const updatedSteps = state.steps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );

          // Find the step that was just toggled
          const toggledStep = updatedSteps.find((s) => s.id === stepId);
          
          // Calculate current step index
          const completedSteps = updatedSteps.filter(s => s.completed);
          const newCurrentStepIndex = completedSteps.length;
          
          // If step has a timer and was just checked (marked as completed)
          if (toggledStep && toggledStep.completed && toggledStep.timerDuration) {
            // Start the timer automatically
            return {
              steps: updatedSteps,
              currentStepIndex: newCurrentStepIndex,
              timer: {
                stepId: stepId,
                remainingTime: toggledStep.timerDuration,
                isRunning: true,
                startTime: Date.now(),
                duration: toggledStep.timerDuration,
              },
            };
          }

          return { steps: updatedSteps, currentStepIndex: newCurrentStepIndex };
        });
      },

      startTimer: (stepId: number, duration: number) => {
        set({
          timer: {
            stepId,
            remainingTime: duration,
            isRunning: true,
            startTime: Date.now(),
            duration,
          },
        });
      },

      pauseTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
            startTime: null,
          },
        }));
      },

      resumeTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: true,
            startTime: Date.now(),
          },
        }));
      },

      updateTimerRemaining: (remaining: number) => {
        set((state) => ({
          timer: {
            ...state.timer,
            remainingTime: Math.max(0, remaining),
          },
        }));
      },

      resetTimer: () => {
        set({
          timer: {
            stepId: null,
            remainingTime: 0,
            isRunning: false,
            startTime: null,
            duration: 0,
          },
        });
      },

      resetAllSteps: () => {
        set({
          steps: cookingSteps.map((step) => ({ ...step, completed: false })),
          currentStepIndex: 0,
          timer: {
            stepId: null,
            remainingTime: 0,
            isRunning: false,
            startTime: null,
            duration: 0,
          },
        });
      },

      setTimerRunning: (isRunning: boolean) => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning,
            startTime: isRunning ? Date.now() : null,
          },
        }));
      },
    }),
    {
      name: 'cooking-storage',
      partialize: (state) => ({
        steps: state.steps,
        currentStepIndex: state.currentStepIndex,
        timer: state.timer,
      }),
    }
  )
);
