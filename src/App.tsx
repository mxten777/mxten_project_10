
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
    <div className={`min-h-screen transition-all duration-500 ${
      dark 
        ? 'dark bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100'
    }`}>
      {/* 배경 애니메이션 효과 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* 상단 테마 토글 */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          className={`px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 backdrop-blur-md border
            ${dark 
              ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
              : 'bg-black/10 text-gray-800 border-black/20 hover:bg-black/20 hover:text-white'
            }
          `}
          onClick={toggleDark}
        >
          {dark ? '🌞 라이트모드' : '🌙 다크모드'}
        </button>
      </div>
      
      <div className="relative z-10">
        <GamePage />
      </div>
    </div>
  );
}

export default App;
