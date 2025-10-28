import React, { useContext } from 'react';
import { LocalizationContext } from '../contexts/LocalizationContext';

const Header: React.FC = () => {
  const { language, setLanguage } = useContext(LocalizationContext);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 p-4 shadow-lg flex justify-between items-center z-10 flex-shrink-0">
      <div className="flex items-center space-x-3">
         <div className="p-2 bg-indigo-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
         </div>
         <h1 className="text-xl font-bold text-white tracking-wide">ChemAI</h1>
      </div>
       <button 
        onClick={toggleLanguage}
        className="font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-indigo-300 py-2 px-4 rounded-md transition-colors"
       >
        {language.toUpperCase()}
       </button>
    </header>
  );
};

export default Header;