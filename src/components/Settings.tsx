import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Download, Bell, BellOff, RotateCcw, Check } from 'lucide-react';
import { useCookingStore } from '../store/cookingStore';
import { useTimerNotification } from '../hooks/useTimerNotification';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const resetAllSteps = useCookingStore((state) => state.resetAllSteps);
  const { permission, requestPermission, isSupported } = useTimerNotification();

  useEffect(() => {
    // Listen for install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This will clear all completed steps and timers.')) {
      resetAllSteps();
      onClose();
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem('sound-enabled', (!soundEnabled).toString());
  };

  // Load sound preference
  useEffect(() => {
    const stored = localStorage.getItem('sound-enabled');
    if (stored !== null) {
      setSoundEnabled(stored === 'true');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="settings-panel">
      {/* Header */}
      <div className="settings-header">
        <h2>Settings</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="close-btn"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Sound Toggle */}
      <div className="settings-section">
        <div className="section-header">
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          <h3>Sound Effects</h3>
        </div>
        <p className="section-description">Timer completion sounds</p>
        <div className="toggle-switch">
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {soundEnabled ? 'On' : 'Off'}
          </span>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={toggleSound}
            aria-label="Toggle sound effects"
          />
        </div>
      </div>

      {/* Notifications */}
      {isSupported && (
        <div className="settings-section">
          <div className="section-header">
            {permission === 'granted' ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            <h3>Notifications</h3>
          </div>
          <p className="section-description">
            {permission === 'granted'
              ? 'Enabled'
              : permission === 'denied'
              ? 'Blocked'
              : 'Get notified when timers complete'}
          </p>
          {permission !== 'granted' && permission !== 'denied' ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={requestPermission}
              className="action-btn"
            >
              Enable Notifications
            </motion.button>
          ) : permission === 'denied' ? (
            <div className="action-btn blocked">
              Blocked in settings
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
              <Check className="w-5 h-5" />
              <span>Enabled</span>
            </div>
          )}
        </div>
      )}

      {/* Install App */}
      <div className="settings-section">
        <div className="section-header">
          <Download className="w-5 h-5" />
          <h3>Install App</h3>
        </div>
        {isInstalled ? (
          <p className="section-description">
            ✓ App is installed! Access it from your home screen.
          </p>
        ) : installPrompt ? (
          <>
            <p className="section-description">
              Install for offline access and a native app experience.
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleInstall}
              className="action-btn"
            >
              Install Now
            </motion.button>
          </>
        ) : (
          <div className="install-instructions">
            <p className="section-description">To install this app:</p>
            <ul>
              <li>• Android: Menu → "Install app"</li>
              <li>• iOS: Share → "Add to Home Screen"</li>
              <li>• Desktop: Look for install icon in address bar</li>
            </ul>
          </div>
        )}
      </div>

      {/* Reset Progress */}
      <div className="settings-section">
        <div className="section-header">
          <RotateCcw className="w-5 h-5" />
          <h3>Reset Progress</h3>
        </div>
        <p className="section-description">Clear all steps and start over</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="action-btn danger"
        >
          Reset All
        </motion.button>
      </div>

      {/* App Info */}
      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        <p>ChefTimer v1.0.0</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Made with ❤️ for perfect cooking</p>
      </div>
    </div>
  );
};

export default Settings;
