import React, { useContext } from 'react';
import { LocalizationContext } from '../contexts/LocalizationContext';

interface SourcesPanelProps {
  sources: any[];
}

const ExternalLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" />
        <path d="M8.603 14.397a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.665l-3 3z" />
    </svg>
);


const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources }) => {
    const { t } = useContext(LocalizationContext);

    if (!sources || sources.length === 0) {
        return null;
    }

    // Filter for web sources and remove potential duplicates
    const webSources = sources
        .filter(source => source.web && source.web.uri)
        .reduce((acc, current) => {
            if (!acc.find(item => item.web.uri === current.web.uri)) {
                acc.push(current);
            }
            return acc;
        }, []);

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center border-b border-gray-700 pb-2 mb-3">
                <h2 className="text-lg font-bold text-indigo-400">{t('sourcesTitle')}</h2>
            </div>
            <ul className="space-y-2">
                {webSources.map((source, index) => (
                    <li key={index} className="text-sm">
                        <a
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-indigo-300 hover:text-indigo-200 hover:underline transition-colors group"
                        >
                           <ExternalLinkIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400 group-hover:text-indigo-300"/>
                           <span className="truncate" title={source.web.title || 'Untitled Source'}>
                                {source.web.title || source.web.uri}
                           </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SourcesPanel;
