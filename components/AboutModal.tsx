import React from 'react';
import { XMarkIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: { [key: string]: string };
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-sm m-4 text-center relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t.about}</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Noam Gold
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          GOOGLE AI STUDIO 2025
        </p>
      </div>
    </div>
  );
};

export default AboutModal;