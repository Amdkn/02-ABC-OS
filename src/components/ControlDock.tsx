import React from 'react';
import { useTranslations } from 'next-intl';

export type DeviceMode = 'mobile' | 'desktop';
export type ThemeMode = 'light' | 'dark';
export type AppState = 'ready' | 'loading' | 'empty' | 'error';

interface ControlDockProps {
  device: DeviceMode;
  setDevice: (v: DeviceMode) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  appState: AppState;
  setAppState: (s: AppState) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  device,
  setDevice,
  theme,
  setTheme,
  appState,
  setAppState,
}) => {
  const t = useTranslations('common');
  return (
    <div className="dock" id="dock">
      <span className="lbl">ABC OS</span>

      {/* Device Selection */}
      <div className="seg" id="seg-device">
        <button
          onClick={() => setDevice('mobile')}
          className={device === 'mobile' ? 'on' : ''}
        >
          <span className="material-symbols-outlined">smartphone</span>
          {t('mobile')}
        </button>
        <button
          onClick={() => setDevice('desktop')}
          className={device === 'desktop' ? 'on' : ''}
        >
          <span className="material-symbols-outlined">desktop_windows</span>
          {t('desktop')}
        </button>
      </div>

      <div className="vrule"></div>

      {/* Theme Selection */}
      <div className="seg" id="seg-theme">
        <button
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'on' : ''}
          aria-label={t('ariaDarkMode')}
        >
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
        <button
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'on' : ''}
          aria-label={t('ariaLightMode')}
        >
          <span className="material-symbols-outlined">light_mode</span>
        </button>
      </div>

      <div className="vrule"></div>

      {/* App State Selection */}
      <div className="seg" id="seg-state">
        <button
          onClick={() => setAppState('ready')}
          className={appState === 'ready' ? 'on' : ''}
        >
          {t('live')}
        </button>
        <button
          onClick={() => setAppState('loading')}
          className={appState === 'loading' ? 'on' : ''}
        >
          {t('loading')}
        </button>
        <button
          onClick={() => setAppState('empty')}
          className={appState === 'empty' ? 'on' : ''}
        >
          {t('empty')}
        </button>
        <button
          onClick={() => setAppState('error')}
          className={appState === 'error' ? 'on' : ''}
        >
          {t('offline')}
        </button>
      </div>
    </div>
  );
};
