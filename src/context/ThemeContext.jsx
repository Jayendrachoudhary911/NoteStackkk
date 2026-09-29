import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export const M3_EXPRESSIVE_PALETTE = {
  blue: {
    accent: "#88b7f0",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, #0e346e8c 0%, #09090b 75%)",
    light: {
      bg: "#D7E3FF",
      text: "#001B3F",
      container: "#EEF2FF",
      onContainer: "#004785",
      badgeBg: "#BACDF8"
    },
    dark: {
      bg: "#d3e7ff",
      text: "#203362",
      container: "#e2f0ff",
      onContainer: "#457ed8",
      badgeBg: "#003F7D"
    }
  },

  amber: {
    accent: "#f5d397",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(110, 75, 0, 0.55) 0%, #09090b 75%)",
    light: {
      bg: "#FFDEA5",
      text: "#271900",
      container: "#FFF2D9",
      onContainer: "#765B00",
      badgeBg: "#F0CA85"
    },
    dark: {
      bg: "#ffefbe",
      text: "#271900",
      container: "#fff5e2",
      onContainer: "#d99f17",
      badgeBg: "#594300"
    }
  },

  green: {
    accent: "#8cefcb",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(0, 85, 42, 0.55) 0%, #09090b 75%)",
    light: {
      bg: "#A6F5BA",
      text: "#00210E",
      container: "#DBFCE3",
      onContainer: "#006D37",
      badgeBg: "#8CE3A3"
    },
    dark: {
      bg: "#b6ffd7",
      text: "#21542e",
      container: "#e4fff0",
      onContainer: "#17c14d",
      badgeBg: "#005228"
    }
  },

  orange: {
    accent: "#ffd6b4",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(115, 45, 0, 0.55) 0%, #09090b 75%)",
    light: {
      bg: "#FFDBCA",
      text: "#341000",
      container: "#FFECE2",
      onContainer: "#984013",
      badgeBg: "#F6C1A7"
    },
    dark: {
      bg: "#ffdac5",
      text: "#703e26",
      container: "#ffeae2",
      onContainer: "#fb712c",
      badgeBg: "#772F03"
    }
  },

  purple: {
    accent: "#c8b6ff",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(75, 36, 140, 0.55) 0%, #09090b 75%)",
    light: {
      bg: "#EBDCFF",
      text: "#25005A",
      container: "#F6EEFF",
      onContainer: "#6940A5",
      badgeBg: "#D4BFF2"
    },
    dark: {
      bg: "#e2d1ff",
      text: "#44236f",
      container: "#ecdeff",
      onContainer: "#a473ff",
      badgeBg: "#422271"
    }
  },

  white: {
    accent: "#ffffff",
    ambientGradient: "radial-gradient(ellipse at 80% 30%, rgba(255, 255, 255, 0.15) 0%, #09090b 75%)",
    light: {
      bg: "#ffffff",
      text: "#0f172a",
      container: "#f1f5f9",
      onContainer: "#0f172a",
      badgeBg: "#e2e8f0"
    },
    dark: {
      bg: "#ffffff",
      text: "#000000",
      container: "#27272a",
      onContainer: "#ffffff",
      badgeBg: "#3f3f46"
    }
  }
};

const ThemeContext = createContext();

export const ThemeCustomProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(() => {
    return localStorage.getItem('notestack_theme_mode') || 'dark';
  });
  const [accentKey, setAccentKeyState] = useState(() => {
    return localStorage.getItem('notestack_accent_key') || 'blue';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Animated theme & accent transition helper
  const triggerTransition = (callback) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transitioning');
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          callback();
        });
      } else {
        callback();
      }
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 450);
    } else {
      callback();
    }
  };

  const setThemeMode = (modeOrFn) => {
    triggerTransition(() => {
      setThemeModeState(modeOrFn);
    });
  };

  const setAccentKey = (keyOrFn) => {
    triggerTransition(() => {
      setAccentKeyState(keyOrFn);
    });
  };

  // Listen to OS system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute resolved mode ('light' | 'dark')
  const resolvedMode = useMemo(() => {
    if (themeMode === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemIsDark]);

  // Persist preferences & update CSS variables
  useEffect(() => {
    localStorage.setItem('notestack_theme_mode', themeMode);
    localStorage.setItem('notestack_accent_key', accentKey);

    const root = document.documentElement;
    const palette = M3_EXPRESSIVE_PALETTE[accentKey] || M3_EXPRESSIVE_PALETTE.blue;
    const isDark = resolvedMode === 'dark';
    const modeConfig = isDark ? palette.dark : palette.light;

    root.setAttribute('data-theme', resolvedMode);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--ambient-gradient', isDark ? palette.ambientGradient : 'none');
    root.style.setProperty('--accent-container', modeConfig.container);
    root.style.setProperty('--accent-foreground', modeConfig.onContainer);
    root.style.setProperty('--badge-bg', modeConfig.badgeBg);

    if (isDark) {
      root.style.setProperty('--background', '#09090b');
      root.style.setProperty('--foreground', '#f3f4f6');
      root.style.setProperty('--surface', '#111216');
      root.style.setProperty('--surface-container', '#16181f');
      root.style.setProperty('--surface-container-high', '#1f222d');
      root.style.setProperty('--surface-container-low', '#0b0c10');
      root.style.setProperty('--muted', '#242731');
      root.style.setProperty('--muted-foreground', '#9ca3af');
      root.style.setProperty('--elevation-1', 'inset 0 1px 1px rgba(255, 255, 255, 0.11), inset 0 -1px 1px rgba(255, 255, 255, 0.07), 0 1px 0px rgba(0,0,0,0.1)');
      root.style.setProperty('--elevation-2', 'inset 0 1px 1px rgba(255, 255, 255, 0.11), 0 1px 0px rgba(0,0,0,0.1)');
    } else {
      root.style.setProperty('--background', '#f8fafc');
      root.style.setProperty('--foreground', '#0f172a');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface-container', '#f1f5f9');
      root.style.setProperty('--surface-container-high', '#e2e8f0');
      root.style.setProperty('--surface-container-low', '#ffffff');
      root.style.setProperty('--muted', '#e2e8f0');
      root.style.setProperty('--muted-foreground', '#64748b');
      root.style.setProperty('--elevation-1', '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)');
      root.style.setProperty('--elevation-2', '0 1px 2px rgba(0,0,0,0.03)');
    }
  }, [themeMode, accentKey, resolvedMode]);

  const toggleColorMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentPalette = M3_EXPRESSIVE_PALETTE[accentKey] || M3_EXPRESSIVE_PALETTE.blue;

  return (
    <ThemeContext.Provider value={{
      mode: resolvedMode,
      themeMode,
      setThemeMode,
      resolvedMode,
      toggleColorMode,
      accentKey,
      setAccentKey,
      palette: M3_EXPRESSIVE_PALETTE,
      currentPalette
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeCustomProvider');
  }
  return context;
};