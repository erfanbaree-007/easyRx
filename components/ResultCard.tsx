import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  content: string;
  language?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  description?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onPlayAudio?: (text: string) => Promise<void>;
  labels: {
    noText: string;
    imageContent: string;
    retry: string;
    playAudio?: string;
  }
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  content, 
  language,
  isLoading,
  isEmpty,
  description,
  errorMessage,
  onRetry,
  onPlayAudio,
  labels
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      // Optional: Could add a toast notification here
    }
  };

  const handlePlay = async () => {
    if (content && onPlayAudio) {
      setIsPlaying(true);
      try {
        await onPlayAudio(content);
      } catch (e) {
        console.error("Audio playback error", e);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors hover:border-indigo-200 dark:hover:border-indigo-800/50 group">
      <div className={`px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors ${errorMessage ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900'}`}>
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold ${errorMessage ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>{title}</h3>
          {language && !errorMessage && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-800">
              {language}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {content && onPlayAudio && !isLoading && !errorMessage && (
             <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50 disabled:opacity-50"
                title={labels.playAudio || "Play Audio"}
             >
                {isPlaying ? (
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                )}
             </button>
          )}
          {content && !isLoading && !errorMessage && (
            <button 
              onClick={handleCopy}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
              title="Copy text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex-grow p-5 relative min-h-[200px] overflow-auto custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <p className="text-red-500 font-medium mb-4 max-w-xs">{errorMessage}</p>
             {onRetry && (
               <button 
                 onClick={onRetry} 
                 className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-sm"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                 {labels.retry}
               </button>
             )}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm p-4 text-center">
            <span className="mb-2 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="14" height="20" rx="2" ry="2" /><line x1="6" y1="18" x2="6" y2="18" /><line x1="10" y1="18" x2="18" y2="18" /></svg>
            </span>
            <p className="font-medium mb-1">{labels.noText}</p>
            {description && (
               <div className="mt-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg max-w-[240px] border border-slate-100 dark:border-slate-700">
                 <p className="text-slate-500 dark:text-slate-400 italic text-xs leading-relaxed">
                   {labels.imageContent}: "{description}"
                 </p>
               </div>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200 leading-relaxed font-normal">{content}</p>
        )}
      </div>
    </div>
  );
};