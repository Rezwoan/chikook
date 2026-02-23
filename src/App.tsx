import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookingStore } from './store/cookingStore';
import { useTimerNotification } from './hooks/useTimerNotification';
import { useTimer } from './hooks/useTimer';
import ProgressBar from './components/ProgressBar';
import StepList from './components/StepList';
import OfflineIndicator from './components/OfflineIndicator';
import Settings from './components/Settings';
import { Settings as SettingsIcon } from 'lucide-react';
import './styles/main.scss';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const resetAllSteps = useCookingStore((state) => state.resetAllSteps);
  const { permission, requestPermission, isSupported } = useTimerNotification();
  
  // Initialize timer hook to keep it running
  useTimer();

  useEffect(() => {
    // Request notification permission on first load
    if (isSupported && permission === 'default') {
      requestPermission();
    }

    // GSAP animation removed - was causing header to stick at y:-60
  }, [isSupported, permission, requestPermission]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all steps? This will clear your progress.')) {
      resetAllSteps();
    }
  };

  return (
    <div className="app-container">
      <OfflineIndicator />
      
      {/* Mobile-First Header */}
      <header className="app-header">
        <div className="header-content">
          {/* Logo */}
          <motion.div
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
            <SettingsIcon className="w-6 h-6" />
            <span>Settings</span>
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
        <div>
          <ProgressBar />
          <StepList />
        </div>
      </main>
    </div>
  );
}

export default App;

