import React, { useState, useRef, useEffect } from 'react';
import { TARGET_LANGUAGES, LanguageOption } from '../types';

interface LanguageSelectorProps {
  selected: LanguageOption;
  onChange: (lang: LanguageOption) => void;
  disabled?: boolean;
  label: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selected,
  onChange,
  disabled,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter languages based on search input
  const filteredLanguages = TARGET_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl shadow-sm transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 dark:hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selected.flag}</span>
          <span className="font-medium truncate">{selected.nativeName}</span>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-50 dark:border-slate-700 last:border-0
                    ${selected.code === lang.code ? 'bg-indigo-50/60 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}
                  `}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className={`font-medium flex-1 ${selected.code === lang.code ? 'font-semibold' : ''}`}>
                    {lang.nativeName} <span className="text-slate-400 dark:text-slate-500 font-normal text-xs ml-1">({lang.name})</span>
                  </span>
                  {selected.code === lang.code && (
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};