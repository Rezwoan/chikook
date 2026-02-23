import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookingStore } from './store/cookingStore';
import { useRecipeStore } from './store/recipeStore';
import { useTimerNotification } from './hooks/useTimerNotification';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import ProgressBar from './components/ProgressBar';
import StepList from './components/StepList';
import OfflineIndicator from './components/OfflineIndicator';
import Settings from './components/Settings';
import RecipeLibrary from './components/RecipeLibrary';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import './styles/main.scss';

type AppView = 'library' | 'cooking';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<AppView>('library');
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const { activeRecipeId, getActiveRecipe, clearActiveRecipe } = useRecipeStore();
  const { permission, requestPermission, isSupported } = useTimerNotification();
  const { theme, toggleTheme } = useTheme();

  // Keep timer ticking
  useTimer();

  // Restore cooking view if a recipe was active on last visit
  useEffect(() => {
    if (activeRecipeId) setView('cooking');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSupported && permission === 'default') {
      requestPermission();
    }
  }, [isSupported, permission, requestPermission]);

  const handleStartCooking = () => setView('cooking');

  const handleBackToLibrary = () => setShowBackConfirm(true);

  const confirmGoBack = () => {
    setShowBackConfirm(false);
    clearActiveRecipe();
    setView('library');
  };

  const activeRecipe = getActiveRecipe();

  return (
    <div className="app-container">
      <OfflineIndicator />

      <AnimatePresence mode="wait">
        {view === 'library' ? (
          /* ── Recipe Library View ── */
          <motion.div
            key="library"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="view-wrapper"
          >
            <header className="app-header library-app-header">
              <div className="header-content">
                <div className="logo-section">
                  <div className="logo-emoji">👨‍🍳</div>
                  <div className="logo-text">
                    <h1>ChefTimer</h1>
                    <p>Recipe Manager</p>
                  </div>
                </div>
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
            <main>
              <RecipeLibrary onStartCooking={handleStartCooking} />
            </main>
          </motion.div>
        ) : (
          /* ── Cooking View ── */
          <motion.div
            key="cooking"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="view-wrapper"
          >
            <header className="app-header">
              <div className="header-content">
                <div className="logo-section">
                  <div className="logo-emoji">{activeRecipe?.emoji ?? '🍗'}</div>
                  <div className="logo-text">
                    <h1>{activeRecipe?.name ?? 'Recipe'}</h1>
                    <p>{activeRecipe ? `${activeRecipe.steps.length} steps` : ''}</p>
                  </div>
                </div>
                <div className="header-actions">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBackToLibrary}
                    className="back-btn"
                    aria-label="Back to recipes"
                  >
                    <ArrowLeft size={18} />
                    <span>Recipes</span>
                  </motion.button>
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
              </div>
              <ProgressBar onGoToLibrary={confirmGoBack} />
            </header>
            <main>
              <div>
                <StepList />
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back-to-library confirm dialog */}
      <AnimatePresence>
        {showBackConfirm && (
          <motion.div
            key="back-confirm"
            className="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBackConfirm(false)}
          >
            <motion.div
              className="confirm-dialog"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="confirm-title">Leave cooking?</p>
              <p className="confirm-body">Your progress is saved — you can resume any time.</p>
              <div className="confirm-actions">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="confirm-btn cancel"
                  onClick={() => setShowBackConfirm(false)}
                >
                  Keep Cooking
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="confirm-btn danger"
                  onClick={confirmGoBack}
                >
                  Go Back
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
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
              style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '100%', maxWidth: 360, zIndex: 1001 }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
            >
              <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToLibrary={() => {
                  setShowSettings(false);
                  clearActiveRecipe();
                  setView('library');
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

