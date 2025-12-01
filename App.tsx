import React, { useState, useRef, useEffect } from 'react';
import { CameraModal } from './components/CameraModal';
import { LanguageSelector } from './components/LanguageSelector';
import { ResultCard } from './components/ResultCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { performOcrAndTranslate } from './services/geminiService';
import { TranslationResponse, TARGET_LANGUAGES, LanguageOption, HistoryItem } from './types';
import { fileToBase64, resizeImage } from './utils/imageUtils';
import { getHistory, saveToHistory, clearHistory } from './utils/historyUtils';
import { translations, LanguageCode } from './utils/translations';

// Supported UI Languages
const UI_LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<LanguageOption>(TARGET_LANGUAGES[0]); // Default English
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // UI Language State
  const [uiLanguage, setUiLanguage] = useState<LanguageCode>('en');
  const [isUiLangOpen, setIsUiLangOpen] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uiLangRef = useRef<HTMLDivElement>(null);

  // Load history, UI language, and Theme on mount
  useEffect(() => {
    setHistory(getHistory());
    
    // Language
    const savedLang = localStorage.getItem('uiLanguage') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setUiLanguage(savedLang);
    }

    // Theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close UI lang menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uiLangRef.current && !uiLangRef.current.contains(event.target as Node)) {
        setIsUiLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUiLanguageChange = (code: LanguageCode) => {
    setUiLanguage(code);
    localStorage.setItem('uiLanguage', code);
    setIsUiLangOpen(false);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const t = translations[uiLanguage];
  const isRtl = uiLanguage === 'ur';

  const handleFileSelect = async (file: File) => {
    setError(null);
    setSelectedFile(file);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null); // Reset previous result

    // Cleanup object URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      } else {
        setError(t.errorDrop);
      }
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64Raw = await fileToBase64(selectedFile);
      // Resize to optimize token usage and latency
      const base64Resized = await resizeImage(base64Raw);
      
      const translation = await performOcrAndTranslate(base64Resized, targetLang.name);
      setResult(translation);
      
      // Save to history
      const updatedHistory = saveToHistory(translation, targetLang.name);
      setHistory(updatedHistory);
      
    } catch (err: any) {
      console.error(err);
      setError(t.errorProcess);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    // Determine target language object from history item
    const matchedLang = TARGET_LANGUAGES.find(l => l.name === item.targetLanguage);
    if (matchedLang) {
      setTargetLang(matchedLang);
    }
    
    setResult({
      originalText: item.originalText,
      translatedText: item.translatedText,
      detectedLanguage: item.detectedLanguage,
      imageDescription: item.imageDescription,
    });
    
    // We don't have the image file for history items, so we clear the file input
    // but keep the result visible.
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 pb-12 transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* EasyRx Logo */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
               {/* Chat bubble body */}
               <path d="M4 12C4 7.58172 7.58172 4 12 4H28C32.4183 4 36 7.58172 36 12V24C36 28.4183 32.4183 32 28 32H16L6 38V32H12C7.58172 32 4 28.4183 4 24V12Z" fill="#059669"/>
               
               {/* R */}
               <path d="M12 11V23" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
               <path d="M12 11H17C19.2091 11 21 12.7909 21 15C21 17.2091 19.2091 19 17 19H12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
               <path d="M17 19L22 26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
               
               {/* x */}
               <path d="M12 29L14.5 20.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0"/> {/* Hidden old path */}
               <path d="M20 23.5L26 18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
               <path d="M26 23.5L20 18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight hidden sm:block">EasyRx</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.toggleTheme}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>

            {/* UI Language Selector */}
             <div className="relative" ref={uiLangRef}>
                <button 
                  onClick={() => setIsUiLangOpen(!isUiLangOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${isUiLangOpen ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'bg-transparent border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  aria-label="Change language"
                  aria-expanded={isUiLangOpen}
                >
                  <span className="text-xl leading-none">{UI_LANGUAGES.find(l => l.code === uiLanguage)?.flag}</span>
                  <span className="text-sm font-semibold hidden sm:inline">{UI_LANGUAGES.find(l => l.code === uiLanguage)?.name}</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isUiLangOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                
                {isUiLangOpen && (
                  <div className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-top`}>
                    <div className="py-1">
                      {UI_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleUiLanguageChange(lang.code)}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 ${uiLanguage === lang.code ? 'bg-indigo-50/60 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-200'}`}
                        >
                           <div className="flex items-center gap-3">
                             <span className="text-xl leading-none">{lang.flag}</span>
                             <span>{lang.name}</span>
                           </div>
                           {uiLanguage === lang.code && (
                             <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                           )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
             </div>

             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

             <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               <span className="hidden sm:inline">{t.history}</span>
             </button>
            <a href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden lg:block">
              {t.poweredBy}
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Intro / Empty State */}
        {!selectedFile && !result && (
          <div className="text-center space-y-4 py-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              {t.introTitle1} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">{t.introTitle2}</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
              {t.introDesc}
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Input */}
          <div className="lg:col-span-5 space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              className={`
                relative group rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900
                h-80 lg:h-[500px] flex flex-col items-center justify-center cursor-pointer
                ${isDragging 
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02] shadow-2xl ring-4 ring-indigo-100/50 dark:ring-indigo-900/30 z-20' 
                  : 'border-slate-300 dark:border-slate-700'
                }
                ${selectedFile && !isDragging
                  ? 'border-indigo-100 dark:border-slate-800 shadow-sm' 
                  : ''
                }
                ${!selectedFile && !isDragging
                  ? 'hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  : ''
                }
              `}
            >
              {/* Dragging Overlay */}
              {isDragging && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-indigo-50/90 dark:bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl mb-4 animate-bounce">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{t.dropActive}</p>
                </div>
              )}
              
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                    className="hidden" // Hidden because we handle click on parent
                  />
                  <div className="text-center p-6 space-y-4 relative z-10 pointer-events-none">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t.dropTitle}</h3>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{t.dropSubtitle}</p>
                    </div>
                  </div>
                  
                  {/* Camera Button */}
                  <div className="relative mt-4 z-20">
                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                     <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-slate-500 dark:text-slate-500 font-medium">{t.or}</span></div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                       e.stopPropagation(); 
                       setIsCameraOpen(true);
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all z-20 relative"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    {t.useCamera}
                  </button>
                </>
              ) : (
                <div className="relative w-full h-full bg-slate-900 group-hover:opacity-95 transition-opacity">
                   {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                   )}
                   {/* Overlay to indicate replacement is possible */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <p className="text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-md">{t.dropToReplace}</p>
                   </div>
                   
                   <button 
                     onClick={handleClear}
                     className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors z-20"
                     title={t.removeImage}
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                   </button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
              <LanguageSelector 
                selected={targetLang} 
                onChange={setTargetLang} 
                disabled={isProcessing}
                label={t.translateTo}
              />
              
              <button
                onClick={processImage}
                disabled={!selectedFile || isProcessing}
                className={`
                  w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all
                  ${!selectedFile || isProcessing 
                    ? 'bg-indigo-300 dark:bg-indigo-900/50 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0'}
                `}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.processingBtn}
                  </>
                ) : (
                  <>
                    <span>{t.processBtn}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 grid grid-rows-2 gap-6 h-[800px] lg:h-auto">
             <div className="h-full min-h-[300px]">
                <ResultCard
                  title={t.originalText}
                  content={result?.originalText || ''}
                  description={result?.imageDescription}
                  language={result?.detectedLanguage || (isProcessing ? t.detecting : undefined)}
                  isLoading={isProcessing}
                  isEmpty={!result?.originalText && !isProcessing}
                  errorMessage={error || undefined}
                  onRetry={processImage}
                  labels={{ noText: t.noText, imageContent: t.imageContent, retry: t.retry }}
                />
             </div>
             <div className="h-full min-h-[300px]">
                <ResultCard
                  title={t.translation}
                  content={result?.translatedText || ''}
                  language={targetLang.name}
                  isLoading={isProcessing}
                  isEmpty={!result?.translatedText && !isProcessing}
                  labels={{ noText: t.noText, imageContent: t.imageContent, retry: t.retry }}
                />
             </div>
          </div>
        </div>
      </main>

      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleFileSelect}
        labels={{
          takePhoto: t.takePhoto,
          cancel: t.cancel,
          snap: t.snap,
          errorCamera: t.errorCamera
        }}
      />
      
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
        labels={{
          history: t.history,
          clearAll: t.clearAll,
          noHistory: t.noHistory,
          historyDesc: t.historyDesc
        }}
      />
    </div>
  );
};