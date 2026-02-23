import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Download, Bell, BellOff, RotateCcw, Check, Sun, Moon, BookOpen } from 'lucide-react';
import { useCookingStore } from '../store/cookingStore';
import { useTimerNotification } from '../hooks/useTimerNotification';
import type { Theme } from '../hooks/useTheme';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  onGoToLibrary: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, theme, onToggleTheme, onGoToLibrary }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const resetAllSteps = useCookingStore((state) => state.resetAllSteps);
  const { permission, requestPermission, isSupported } = useTimerNotification();

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    if (window.matchMedia('(display-mode: standalone)').matches) setIsInstalled(true);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('sound-enabled');
    if (stored !== null) setSoundEnabled(stored === 'true');
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') { setInstallPrompt(null); setIsInstalled(true); }
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This will clear all completed steps and timers.')) {
      resetAllSteps();
      onClose();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('sound-enabled', next.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="close-btn" aria-label="Close settings">
          <X />
        </motion.button>
      </div>

      {/* ── Recipes ── */}
      <div className="settings-section">
        <div className="section-header">
          <BookOpen />
          <h3>Recipes</h3>
        </div>
        <p className="section-description">Manage your saved recipes or import new ones</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onGoToLibrary} className="action-btn">
          <BookOpen style={{ width: 16, height: 16 }} />
          <span>Open Recipe Library</span>
        </motion.button>
      </div>

      {/* ── Appearance (Theme) ── */}
      <div className="settings-section">
        <div className="section-header">
          {theme === 'dark' ? <Moon /> : <Sun />}
          <h3>Appearance</h3>
        </div>
        <p className="section-description">Choose your preferred color scheme</p>
        <div className="theme-selector">
          <button
            className={`theme-option${theme === 'light' ? ' active' : ''}`}
            onClick={() => theme !== 'light' && onToggleTheme()}
            aria-label="Light theme"
          >
            <Sun style={{ width: 18, height: 18 }} />
            <span>Light</span>
          </button>
          <button
            className={`theme-option${theme === 'dark' ? ' active' : ''}`}
            onClick={() => theme !== 'dark' && onToggleTheme()}
            aria-label="Dark theme"
          >
            <Moon style={{ width: 18, height: 18 }} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* ── Sound ── */}
      <div className="settings-section">
        <div className="section-header">
          {soundEnabled ? <Volume2 /> : <VolumeX />}
          <h3>Sound Effects</h3>
        </div>
        <p className="section-description">Play a beep when timer completes</p>
        <div className="toggle-row">
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '0.875rem', color: 'var(--md-on-surface-variant)', letterSpacing: '0.016em' }}>
            {soundEnabled ? 'On' : 'Off'}
          </span>
          <input type="checkbox" className="md-switch" checked={soundEnabled} onChange={toggleSound} aria-label="Toggle sound effects" />
        </div>
      </div>

      {isSupported && (
        <div className="settings-section">
          <div className="section-header">
            {permission === 'granted' ? <Bell /> : <BellOff />}
            <h3>Notifications</h3>
          </div>
          <p className="section-description">
            {permission === 'granted' ? 'Timer notifications are enabled'
              : permission === 'denied' ? 'Notifications blocked in browser settings'
              : 'Get notified when timers complete'}
          </p>
          {permission !== 'granted' && permission !== 'denied' ? (
            <motion.button whileTap={{ scale: 0.95 }} onClick={requestPermission} className="action-btn">
              <Bell style={{ width: 16, height: 16 }} />
              <span>Enable Notifications</span>
            </motion.button>
          ) : permission === 'denied' ? (
            <div className="action-btn blocked">
              <BellOff style={{ width: 16, height: 16 }} />
              <span>Blocked in browser</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--md-primary)', fontFamily: 'Roboto, sans-serif', fontSize: '0.875rem', fontWeight: 500 }}>
              <Check style={{ width: 18, height: 18 }} />
              <span>Notifications enabled</span>
            </div>
          )}
        </div>
      )}

      <div className="settings-section">
        <div className="section-header">
          <Download />
          <h3>Install App</h3>
        </div>
        {isInstalled ? (
          <p className="section-description">App installed - launch from your home screen.</p>
        ) : installPrompt ? (
          <>
            <p className="section-description">Install for offline access and native feel.</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleInstall} className="action-btn">
              <Download style={{ width: 16, height: 16 }} />
              <span>Install Now</span>
            </motion.button>
          </>
        ) : (
          <div className="install-instructions">
            <p>To install ChefTimer:</p>
            <ul>
              <li>Android: Menu -&gt; "Add to Home Screen"</li>
              <li>iOS: Share -&gt; "Add to Home Screen"</li>
              <li>Desktop: Install icon in address bar</li>
            </ul>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div className="section-header">
          <RotateCcw />
          <h3>Reset Progress</h3>
        </div>
        <p className="section-description">Clear all steps and start over</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleReset} className="action-btn danger">
          <RotateCcw style={{ width: 16, height: 16 }} />
          <span>Reset All</span>
        </motion.button>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center', fontFamily: 'Roboto, sans-serif', fontSize: '0.75rem', color: 'var(--md-on-surface-variant)', letterSpacing: '0.025em' }}>
        <p>ChefTimer v1.0.0</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>Made with heart for perfect cooking</p>
      </div>
    </div>
  );
};

export default Settings;
