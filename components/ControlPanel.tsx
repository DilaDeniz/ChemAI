import React, { useState, useEffect, useContext, useRef } from 'react';
import type { FilterState } from '../types';
import { getSearchSuggestions } from '../services/geminiService';
import { LocalizationContext } from '../contexts/LocalizationContext';
import { downloadAsFile } from '../utils/download';

interface ControlPanelProps {
  onSearch: (compound: string, filters: FilterState) => void;
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
}

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ onSearch, history, setHistory, isLoading }) => {
    const { t, language } = useContext(LocalizationContext);
    const [compound, setCompound] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        capsule: false,
        liquid: false,
        tablet: false,
    });
    const searchRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (compound.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const debounce = setTimeout(() => {
            getSearchSuggestions(compound, language).then(setSuggestions);
            setShowSuggestions(true);
        }, 300);
        return () => clearTimeout(debounce);
    }, [compound, language]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFilters(prev => ({ ...prev, [name]: checked }));
    };

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return;
        setCompound(searchTerm);
        setShowSuggestions(false);
        onSearch(searchTerm, filters);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(compound);
    };

    const handleHistoryClick = (item: string) => {
        handleSearch(item);
    };

    const handleSuggestionClick = (suggestion: string) => {
        handleSearch(suggestion);
    };
    
    const handleDownloadHistory = () => {
        downloadAsFile(history.join('\n'), 'ChemAI_History.txt', 'text/plain');
    };

    return (
        <div className="p-4 flex flex-col h-full">
            {/* Non-growing top section for search and filters */}
            <div>
                {/* Search Section */}
                <section ref={searchRef}>
                    <h2 className="text-lg font-semibold text-indigo-400 mb-2">{t('searchTitle')}</h2>
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={compound}
                            onChange={(e) => setCompound(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder={t('searchPlaceholder')}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                             <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {suggestions.map((s, i) => (
                                    <li key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-2 cursor-pointer hover:bg-indigo-600 text-gray-300">
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading || !compound.trim()}
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
                        >
                            {isLoading ? t('analyzing') : t('analyze')}
                        </button>
                    </form>
                </section>

                {/* Filters Section */}
                <section className="mt-6">
                    <h2 className="text-lg font-semibold text-indigo-400 mb-2">{t('filtersTitle')}</h2>
                    <div className="space-y-2">
                        {Object.keys(filters).map((filter) => (
                             <label key={filter} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name={filter}
                                    checked={filters[filter as keyof FilterState]}
                                    onChange={handleFilterChange}
                                    className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-300 capitalize">{t(filter as keyof typeof filters)}</span>
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            {/* History Section - grows to fill remaining space */}
            <section className="flex flex-col flex-1 mt-6 pt-6 border-t border-gray-700 min-h-0">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-indigo-400">{t('historyTitle')}</h2>
                    <button onClick={handleDownloadHistory} className="text-gray-400 hover:text-white transition-colors" title={t('downloadHistory')}>
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                </div>
                <ul className="overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    {history.length > 0 ? history.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handleHistoryClick(item)}
                                className="w-full text-left p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors truncate"
                            >
                                {item}
                            </button>
                        </li>
                    )) : (
                        <li className="text-gray-500 italic">{t('noHistory')}</li>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default ControlPanel;