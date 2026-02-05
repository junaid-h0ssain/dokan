import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

function createThemeStore() {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  const initialTheme: Theme = storedTheme || 'light';

  const { subscribe, set } = writable<Theme>(initialTheme);

  return {
    subscribe,
    setTheme: (theme: Theme) => {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      set(theme);
    },
    toggleTheme: () => {
      set(current => {
        const newTheme: Theme = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return newTheme;
      });
    },
  };
}

export const themeStore = createThemeStore();
