import React, { useState, useEffect } from 'react';
import { Theme, DecibelDataPoint } from './types';
import { MAX_DATA_POINTS, translations } from './constants';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import DecibelMeter from './components/DecibelMeter';
import SettingsModal from './components/SettingsModal';
import AboutModal from './components/AboutModal';
import { CogIcon, MicrophoneIcon, StopIcon } from './components/icons';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [language, setLanguage] = useState<string>('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const { start, stop, error, isRecording, db } = useAudioAnalyzer();

  const [avgDb, setAvgDb] = useState<number>(0);
  const [maxDb, setMaxDb] = useState<number>(0);
  const [dbHistory, setDbHistory] = useState<DecibelDataPoint[]>([]);

  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && Object.values(Theme).includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
       setTheme(Theme.Dark); // Default to dark
    }
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (isRecording) {
      if (db > maxDb) setMaxDb(db);

      setDbHistory(prevHistory => {
        const newPoint = { time: Date.now(), db };
        const newHistory = [...prevHistory, newPoint];
        return newHistory.length > MAX_DATA_POINTS ? newHistory.slice(1) : newHistory;
      });
    } else {
      // Reset on stop
      setMaxDb(0);
      setDbHistory([]);
    }
  }, [db, isRecording, maxDb]);

  useEffect(() => {
    if (isRecording && dbHistory.length > 0) {
      const sum = dbHistory.reduce((total, point) => total + point.db, 0);
      setAvgDb(sum / dbHistory.length);
    } else if (!isRecording) {
      setAvgDb(0);
    }
  }, [dbHistory, isRecording]);
  
  const handleToggleRecording = () => {
    if(isRecording) {
        stop();
    } else {
        start();
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t.appTitle}</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={t.settings}
        >
          <CogIcon className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 flex flex-col items-center justify-center">
        {isRecording ? (
          <DecibelMeter
            currentDb={db}
            avgDb={avgDb}
            maxDb={maxDb}
            dbHistory={dbHistory}
            theme={theme}
            t={t}
          />
        ) : (
          <div className="text-center flex flex-col items-center justify-center h-[70vh]">
            <h2 className="text-3xl font-semibold mb-4">{t.readyToMeasure}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              {t.permissionPrompt}
            </p>
            {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md mb-4 max-w-md">{error}</p>}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 flex justify-center">
         <button
            onClick={handleToggleRecording}
            className={`flex items-center justify-center w-20 h-20 rounded-full text-white shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
              isRecording ? 'bg-red-600 hover:bg-red-700 focus:ring-red-400' : 'bg-green-600 hover:bg-green-700 focus:ring-green-400'
            }`}
            aria-label={isRecording ? t.stopMeter : t.startMeter}
          >
           {isRecording ? <StopIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-10 h-10" />}
        </button>
      </footer>
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        onAboutClick={() => setIsAboutOpen(true)}
        t={t}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} t={t} />
    </div>
  );
};

export default App;