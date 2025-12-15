import React from 'react';

const GlobalStyles: React.FC = () => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1f2937; /* bg-gray-800 */
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #4f46e5; /* bg-indigo-600 */
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #6366f1; /* bg-indigo-500 */
    }
  `}</style>
);

export default GlobalStyles;