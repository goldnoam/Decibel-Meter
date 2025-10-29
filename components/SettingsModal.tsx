import React from 'react';
import { LANGUAGES } from '../constants';
import { Theme } from '../types';
import { XMarkIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onAboutClick: () => void;
  t: { [key: string]: string };
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, theme, setTheme, language, setLanguage, onAboutClick, t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md m-4 transform transition-all duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.settings}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.theme}</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setTheme(Theme.Light)}
                className={`flex-1 p-2 rounded-md text-sm font-semibold transition-all ${theme === Theme.Light ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                {t.bright}
              </button>
              <button
                onClick={() => setTheme(Theme.Dark)}
                className={`flex-1 p-2 rounded-md text-sm font-semibold transition-all ${theme === Theme.Dark ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                {t.dark}
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.language}</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* About Button */}
          <div>
            <button
              onClick={() => {
                onAboutClick();
                onClose();
              }}
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t.about}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;