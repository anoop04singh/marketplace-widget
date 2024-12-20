import { createContext, useContext, useEffect, useState } from 'react';
import type { WidgetTheme } from '../types/widget.js';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: WidgetTheme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: WidgetTheme;
  setTheme: (theme: WidgetTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'auto',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = 'auto', ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<WidgetTheme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: WidgetTheme) => {
      setThemeState(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
