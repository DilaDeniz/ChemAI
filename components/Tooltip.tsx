import React from 'react';

interface TooltipProps {
  term: string;
  definition: string;
}

const Tooltip: React.FC<TooltipProps> = ({ term, definition }) => {
  return (
    <span className="relative group cursor-pointer">
      <span className="text-indigo-300 border-b border-dotted border-indigo-400">
        {term}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 border border-indigo-500 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {definition}
      </div>
    </span>
  );
};

export default Tooltip;
