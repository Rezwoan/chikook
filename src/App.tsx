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

  const handleBackToLibrary = () => {
    if (confirm('Stop cooking and go back to recipes? Your current progress will be saved.')) {
      clearActiveRecipe();
      setView('library');
    }
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
              <ProgressBar />
            </header>
            <main>
              <div>
                <StepList />
              </div>
            </main>
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

