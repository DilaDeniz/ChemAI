import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getCompoundInfo, translateContent } from './services/geminiService';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import DataPanel from './components/DataPanel';
import SourcesPanel from './components/SourcesPanel';
import { LocalizationContext, translations } from './contexts/LocalizationContext';
import type { FilterState } from './types';

const App: React.FC = () => {
  const [currentCompound, setCurrentCompound] = useState<string>('');
  const [generalInfo, setGeneralInfo] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [interactions, setInteractions] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>(['Aspirin', 'Caffeine', 'H2O']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'tr'>('tr');
  const isInitialMount = useRef(true);

  const t = useCallback((key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  }, [language]);

  useEffect(() => {
    // Skip translation on initial component mount
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    // Only translate if there's content to translate
    if (generalInfo || summary || interactions) {
        setIsTranslating(true);
        setError(null);
        
        const contentToTranslate = {
            generalInfo: generalInfo,
            summary: summary,
            interactionsAndOptimization: interactions,
        };

        translateContent(contentToTranslate, language)
            .then(translatedContent => {
                setGeneralInfo(translatedContent.generalInfo);
                setSummary(translatedContent.summary);
                setInteractions(translatedContent.interactionsAndOptimization);
            })
            .catch(err => {
                console.error("Translation failed:", err);
                setError(t('error') + `: Translation failed.`);
            })
            .finally(() => {
                setIsTranslating(false);
            });
    }
  }, [language, t]);

  const handleSearch = useCallback(async (compound: string, filters: FilterState) => {
    setIsLoading(true);
    setError(null);
    setSources([]);
    setCurrentCompound(compound);

    if (!history.includes(compound)) {
        setHistory(prev => [compound, ...prev]);
    }
    
    const filterKeys = Object.entries(filters)
        .filter(([, value]) => value)
        .map(([key]) => key);

    try {
        const data = await getCompoundInfo(compound, filterKeys, language);
        setGeneralInfo(data.generalInfo);
        setSummary(data.summary);
        setInteractions(data.interactionsAndOptimization);
        setSources(data.sources);
    } catch (err) {
        if (err instanceof Error) {
            setError(`${t('error')}: ${err.message}`);
        } else {
            setError(`${t('error')}: An unknown error occurred.`);
        }
        setGeneralInfo('');
        setSummary('');
        setInteractions('');
        setSources([]);
    } finally {
        setIsLoading(false);
    }
  }, [language, history, t]);

  const loadingState = isLoading || isTranslating;

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
        <Header />
        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
          <aside className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0 bg-gray-800/70 border-r border-gray-700/50 lg:h-full lg:overflow-y-auto custom-scrollbar">
            <ControlPanel onSearch={handleSearch} history={history} setHistory={setHistory} isLoading={loadingState} />
          </aside>
          <main className="flex-grow flex flex-col p-4 overflow-y-auto custom-scrollbar">
            {error && (
              <div className="lg:col-span-3 bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
                <p className="font-bold">{t('error')}</p>
                <p>{error.replace(`${t('error')}: `, '')}</p>
              </div>
            )}
            <div className="grid lg:grid-cols-3 gap-4">
              <DataPanel title={t('generalInfoTitle')} compound={currentCompound} content={generalInfo} isLoading={loadingState} />
              <DataPanel title={t('summaryTitle')} compound={currentCompound} content={summary} isLoading={loadingState} />
              <DataPanel title={t('interactionsTitle')} compound={currentCompound} content={interactions} isLoading={loadingState} />
            </div>
            {sources.length > 0 && !loadingState && (
              <div className="mt-4">
                <SourcesPanel sources={sources} />
              </div>
            )}
          </main>
        </div>
      </div>
    </LocalizationContext.Provider>
  );
};

export default App;