import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cookingSteps } from '../data/cookingSteps';
import type { CookingStep } from '../data/cookingSteps';

interface TimerState {
  stepId: number | null;
  remainingTime: number; // in seconds
  isRunning: boolean;
  isAlarming: boolean; // true when countdown hits 0 and waiting for user to dismiss
  startTime: number | null; // timestamp when timer started
  duration: number; // original duration in seconds
}

interface CookingStore {
  steps: CookingStep[];
  timer: TimerState;
  currentStepIndex: number;
  
  // Actions
  toggleStep: (stepId: number) => void;
  /** Called by useTimer when countdown hits 0 — starts alarm, waits for user to dismiss */
  triggerAlarm: () => void;
  /** Called when user clicks "Stop Alarm" — marks step done, chains next timer if any */
  dismissAlarm: (stepId: number) => void;
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
        isAlarming: false,
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
          if (!state.canCompleteStep(stepId)) return state;

          const updatedSteps = state.steps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );

          const toggledStep = updatedSteps.find((s) => s.id === stepId)!;
          const completedCount = updatedSteps.filter((s) => s.completed).length;
          const stepIndex = updatedSteps.findIndex((s) => s.id === stepId);
          const nextStep = updatedSteps[stepIndex + 1];

          if (toggledStep.completed) {
            // If the very next step has a timer, auto-start it
            if (nextStep?.timerDuration && !nextStep.completed) {
              return {
                steps: updatedSteps,
                currentStepIndex: completedCount,
                timer: {
                  stepId: nextStep.id,
                  remainingTime: nextStep.timerDuration,
                  isRunning: true,
                  isAlarming: false,
                  startTime: Date.now(),
                  duration: nextStep.timerDuration,
                },
              };
            }
            // Otherwise clear any stale timer
            return {
              steps: updatedSteps,
              currentStepIndex: completedCount,
              timer: { stepId: null, remainingTime: 0, isRunning: false, isAlarming: false, startTime: null, duration: 0 },
            };
          }

          // Un-completing: stop the timer if it was running for this or a later step
          const shouldResetTimer =
            state.timer.stepId !== null && state.timer.stepId >= stepId;
          return {
            steps: updatedSteps,
            currentStepIndex: completedCount,
            ...(shouldResetTimer
              ? { timer: { stepId: null, remainingTime: 0, isRunning: false, isAlarming: false, startTime: null, duration: 0 } }
              : {}),
          };
        });
      },

      // Called by useTimer when countdown hits zero — rings alarm, waits for user to dismiss
      triggerAlarm: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
            isAlarming: true,
          },
        }));
      },

      // Called when user clicks "Stop Alarm" — marks step done, chains next timer
      dismissAlarm: (stepId: number) => {
        set((state) => {
          const step = state.steps.find((s) => s.id === stepId);
          if (!step) return state;

          const updatedSteps = state.steps.map((s) =>
            s.id === stepId ? { ...s, completed: true } : s
          );
          const completedCount = updatedSteps.filter((s) => s.completed).length;
          const stepIndex = updatedSteps.findIndex((s) => s.id === stepId);
          const nextStep = updatedSteps[stepIndex + 1];

          // If the step after the timer-step ALSO has a timer, auto-start it
          if (nextStep?.timerDuration && !nextStep.completed) {
            return {
              steps: updatedSteps,
              currentStepIndex: completedCount,
              timer: {
                stepId: nextStep.id,
                remainingTime: nextStep.timerDuration,
                isRunning: true,
                isAlarming: false,
                startTime: Date.now(),
                duration: nextStep.timerDuration,
              },
            };
          }

          return {
            steps: updatedSteps,
            currentStepIndex: completedCount,
            timer: { stepId: null, remainingTime: 0, isRunning: false, isAlarming: false, startTime: null, duration: 0 },
          };
        });
      },

      startTimer: (stepId: number, duration: number) => {
        set({
          timer: {
            stepId,
            remainingTime: duration,
            isRunning: true,
            isAlarming: false,
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
            isAlarming: false,
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
            isAlarming: false,
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
