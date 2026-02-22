## Plan: Interactive Chicken Cooking PWA

A React PWA featuring a 16-step chicken recipe checklist with auto-triggered timers, stunning Lottie animations, warm traditional cooking theme, and full offline support. Built with Vite + TypeScript + Tailwind for modern performance and maintainability. Key decisions: automatic timer start on step check, Lottie for hero animations, Framer Motion for micro-interactions, Zustand for state management, and warm color palette (browns, tomato accents, cornsilk backgrounds) for traditional cooking ambiance.

---

### **Steps**

1. **Initialize project structure**
   - Run `npm create vite@latest chikook-app -- --template react-ts`
   - Install dependencies: `vite-plugin-pwa`, `workbox-window`, `tailwindcss`, `framer-motion`, `lottie-react`, `zustand`, `lucide-react`
   - Configure [vite.config.ts](vite.config.ts) with PWA plugin using Workbox strategies

2. **Configure PWA manifest and assets**
   - Create [public/manifest.json](public/manifest.json) with app metadata (name: "Chicken Cooking Timer", theme: #8B4513)
   - Generate app icons (192x192, 512x512) with cooking theme imagery
   - Setup service worker config in [vite.config.ts](vite.config.ts) with cache-first strategy for assets

3. **Setup Tailwind with custom theme**
   - Initialize Tailwind CSS with [tailwind.config.js](tailwind.config.js)
   - Define custom color palette in [src/styles/theme.css](src/styles/theme.css): saddle brown primary, chocolate secondary, tomato accent, cornsilk backgrounds
   - Add custom fonts (Playfair Display for headings, Inter for body)

4. **Create cooking steps data structure**
   - Build [src/data/cookingSteps.ts](src/data/cookingSteps.ts) with interface defining: id, description, timerDuration (in minutes), completed status, icon type
   - Map all 16 cooking steps with timer durations (5min for step 9, 5min for step 10, 10min for step 12, 12-15min for step 15)

5. **Build Zustand store for app state**
   - Create [src/store/cookingStore.ts](src/store/cookingStore.ts) managing: step completion status, active timer state, current step index
   - Implement actions: `toggleStep`, `startTimer`, `pauseTimer`, `resetTimer`, `resetAllSteps`
   - Add persistence middleware to sync with localStorage

6. **Implement timer hook logic**
   - Create [src/hooks/useTimer.ts](src/hooks/useTimer.ts) using `useEffect` + `requestAnimationFrame` for accurate countdown
   - Handle browser tab visibility (Page Visibility API) to pause/resume
   - Store start timestamp for drift-free calculation
   - Create [src/hooks/useTimerPersistence.ts](src/hooks/useTimerPersistence.ts) for saving timer state to localStorage

7. **Build step list component**
   - Create [src/components/StepList.tsx](src/components/StepList.tsx) rendering all 16 steps
   - Create [src/components/StepItem.tsx](src/components/StepItem.tsx) with checkbox, description, and conditional timer display
   - Implement auto-start logic: when step with timer is checked, dispatch `startTimer` action
   - Add Framer Motion `motion.div` with scale animation on step completion

8. **Create timer display component**
   - Build [src/components/Timer/TimerDisplay.tsx](src/components/Timer/TimerDisplay.tsx) showing MM:SS countdown
   - Add [src/components/Timer/TimerControls.tsx](src/components/Timer/TimerControls.tsx) with pause/resume buttons
   - Style with large, readable digits and warm color highlights when active

9. **Implement progress tracking**
   - Create [src/components/ProgressBar.tsx](src/components/ProgressBar.tsx) displaying "X of 16 steps completed"
   - Use `<progress>` element with Tailwind styling
   - Add Framer Motion animation for progress bar fill

10. **Integrate Lottie animations**
    - Download 2-3 cooking-themed Lottie files from LottieFiles.com (chef cooking, pot boiling, checkmark celebration)
    - Place in [src/assets/lottie/](src/assets/lottie/) directory
    - Create [src/components/Icons/AnimatedIcon.tsx](src/components/Icons/AnimatedIcon.tsx) wrapper component
    - Add hero animation at app header and celebration animation on completion

11. **Add Framer Motion micro-interactions**
    - Wrap step items in `AnimatePresence` for enter/exit animations
    - Add hover effects on buttons with `whileHover` prop
    - Implement spring animation on checkbox check (scale + rotate)
    - Add confetti or celebration animation when all steps completed using Framer Motion or Lottie

12. **Implement timer completion feedback**
    - Create [src/hooks/useTimerNotification.ts](src/hooks/useTimerNotification.ts) requesting notification permission
    - Trigger Web Notifications API when timer reaches 00:00
    - Add audio alert using [src/assets/sounds/notification.mp3](src/assets/sounds/notification.mp3)
    - Implement vibration feedback for mobile devices (Vibration API)

13. **Build main app layout**
    - Create [src/App.tsx](src/App.tsx) with header, progress bar, step list, and footer
    - Add app title "Chicken Cooking Guide" with animated chef Lottie in header
    - Include reset button to clear all progress
    - Design responsive layout with Tailwind (mobile-first)

14. **Add offline status indicator**
    - Create [src/components/OfflineIndicator.tsx](src/components/OfflineIndicator.tsx) monitoring network status
    - Show banner when offline with service worker status
    - Implement update prompt when new version available

15. **Setup static icons for UI**
    - Use Lucide React for UI icons (checkbox, play, pause, reset)
    - Create [src/components/Icons/](src/components/Icons/) directory for organized imports
    - Apply warm colors to icons matching theme

16. **Optimize build configuration**
    - Configure [vite.config.ts](vite.config.ts) for code splitting and lazy loading of Lottie files
    - Enable PWA precaching for all static assets
    - Set build target for modern browsers
    - Add meta tags in [index.html](index.html) for PWA optimization

---

### **Verification**

- **Installation test**: Open app in Chrome/Edge, check for install prompt, install to home screen, verify standalone mode
- **Offline test**: Disconnect network, reload app, verify all functionality works (service worker caching)
- **Timer accuracy**: Start multiple timers, switch tabs, reload page, verify timers resume correctly and show accurate remaining time
- **Animation performance**: Test on mobile device, verify animations run at 60fps without jank
- **Accessibility**: Navigate with keyboard (Tab, Space, Enter), test with screen reader (NVDA/VoiceOver), verify ARIA labels
- **Lighthouse audit**: Run audit, ensure PWA score 90+, Performance 90+, Accessibility 95+
- **Cross-browser**: Test on Chrome, Safari, Firefox, Edge (mobile and desktop)
- **Audio/notifications**: Grant permissions, complete timer, verify sound plays and notification shows

---

### **Decisions**

- **TypeScript over JavaScript**: Chosen for type safety in timer logic (timestamp calculations, state management) to prevent runtime errors
- **Lottie + Framer Motion combo**: Lottie for stunning hero animations (chef, pot), Framer Motion for lightweight UI transitions (checkboxes, buttons) - best of both worlds
- **Zustand over Redux/Context**: Simpler API, built-in persistence, better performance for timer updates
- **Automatic timer start**: Triggers when step is checked for seamless cooking flow without extra button presses
- **Warm traditional theme**: Color palette (browns, cornsilk, tomato) evokes warmth and traditional cooking ambiance per user preference
