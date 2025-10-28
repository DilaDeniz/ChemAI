import React, { useContext } from 'react';
import Tooltip from './Tooltip';
import { LocalizationContext } from '../contexts/LocalizationContext';
import { downloadAsFile } from '../utils/download';

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);


const renderContent = (content: string) => {
    if (!content) return null;

    // Regex to find the custom tooltip syntax: [term]-->(definition)
    const tooltipRegex = /\[([^\]]+)\]-->\(([^)]+)\)/g;

    return content.split('\n').map((line, i) => {
        // Markdown-like syntax replacements
        if (/^\s*###\s/.test(line)) return <h3 key={i} className="text-lg font-semibold mt-4 mb-1 text-indigo-300">{line.replace(/^\s*###\s/, '')}</h3>;
        if (/^\s*##\s/.test(line)) return <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-indigo-300">{line.replace(/^\s*##\s/, '')}</h2>;
        if (/^\s*#\s/.test(line)) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3 text-indigo-300">{line.replace(/^\s*#\s/, '')}</h1>;
        if (/^\s*[\*-]\s/.test(line)) return <li key={i} className="ml-5 list-disc">{line.replace(/^\s*[\*-]\s/, '')}</li>;
        if (line.trim() === '') return <br key={i} />;

        const parts = line.split(tooltipRegex);
        
        return (
            <p key={i} className="my-1">
                {parts.map((part, index) => {
                    if (index % 3 === 1) { // This is the term
                        const definition = parts[index + 1];
                        return <Tooltip key={index} term={part} definition={definition} />;
                    }
                    if (index % 3 === 2) { // This is the definition, already used
                        return null;
                    }
                    return part; // This is regular text
                })}
            </p>
        );
    });
};

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full p-16">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
    const { t } = useContext(LocalizationContext);
    return (
        <div className="flex flex-col justify-center items-center h-full text-center text-gray-500 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p>{t('panelPlaceholder')}</p>
        </div>
    );
};

interface PanelProps {
  title: string;
  compound: string;
  content: string;
  isLoading: boolean;
}

const DataPanel: React.FC<PanelProps> = ({ title, compound, content, isLoading }) => {
    const { t } = useContext(LocalizationContext);
    
    const handleDownload = () => {
        const fileName = `${compound}_${title.replace(/\s/g, '_')}.txt`;
        downloadAsFile(content, fileName, 'text/plain');
    };

    return (
        <div className="p-4 h-full flex flex-col bg-gray-800/50 rounded-lg min-h-0">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-indigo-400">
                    {title} {compound && <span className="text-white font-mono text-lg ml-2">{compound}</span>}
                </h2>
                {content && !isLoading && (
                    <button onClick={handleDownload} className="text-gray-400 hover:text-white transition-colors" title={t('downloadData')}>
                        <DownloadIcon className="w-5 h-5"/>
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar min-h-0">
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 pr-2">
                    {isLoading ? <LoadingSpinner /> : content ? renderContent(content) : <Placeholder title={title} />}
                </div>
            </div>
        </div>
    );
};

export default DataPanel;
