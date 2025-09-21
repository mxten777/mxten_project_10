
import GamePage from './pages/GamePage';
import { create } from 'zustand';
import React from 'react';

interface ThemeState {
  dark: boolean;
  toggleDark: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  dark: false,
  toggleDark: () => set((state) => ({ dark: !state.dark })),
}));


function App() {
  const { dark, toggleDark } = useThemeStore();
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div className={dark ? 'dark bg-gray-900 min-h-screen' : 'bg-white min-h-screen'}>
      <div className="flex justify-end p-2">
        <button
          className="px-3 py-1 rounded border text-xs font-bold dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-white text-gray-800 border-gray-300"
          onClick={toggleDark}
        >
          {dark ? '라이트모드' : '다크모드'}
        </button>
      </div>
      <GamePage />
    </div>
  );
}

export default App;
