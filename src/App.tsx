import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useCookingStore } from './store/cookingStore';
import { useTimerNotification } from './hooks/useTimerNotification';
import { useTimer } from './hooks/useTimer';
import { useThreeBackground } from './hooks/useThreeBackground';
import ProgressBar from './components/ProgressBar';
import StepList from './components/StepList';
import OfflineIndicator from './components/OfflineIndicator';
import Settings from './components/Settings';
import { Settings as SettingsIcon } from 'lucide-react';
import './styles/main.scss';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const resetAllSteps = useCookingStore((state) => state.resetAllSteps);
  const { permission, requestPermission, isSupported } = useTimerNotification();
  
  // Initialize Three.js background
  const threeCanvasRef = useThreeBackground();
  
  // Initialize timer hook to keep it running
  useTimer();

  useEffect(() => {
    // Request notification permission on first load
    if (isSupported && permission === 'default') {
      requestPermission();
    }

    // GSAP animation for header on mount
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, [isSupported, permission, requestPermission]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all steps? This will clear your progress.')) {
      resetAllSteps();
    }
  };

  return (
    <div className="app-container">
      {/* Three.js animated background */}
      <canvas ref={threeCanvasRef} id="three-canvas" />
      
      <OfflineIndicator />
      
      {/* Mobile-First Header */}
      <header ref={headerRef} className="app-header">
        <div className="header-content">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="logo-section"
          >
            <div className="logo-emoji">🍗</div>
            <div className="logo-text">
              <h1>ChefTimer</h1>
              <p>Perfect Chicken Recipe</p>
            </div>
          </motion.div>

          {/* Settings Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(true)}
            className="settings-btn"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Settings Panel with overlay */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="settings-overlay"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content - Mobile Optimized */}
      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressBar />
          <StepList />
        </motion.div>
      </main>
    </div>
  );
}

export default App;

