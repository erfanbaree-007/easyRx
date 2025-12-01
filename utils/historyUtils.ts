import { TranslationResponse, HistoryItem } from '../types';

const HISTORY_KEY = 'snaptranslate_history';
const MAX_HISTORY = 20;

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to parse history', e);
    return [];
  }
};

export const saveToHistory = (response: TranslationResponse, targetLanguage: string): HistoryItem[] => {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...response,
    id: Date.now().toString(),
    timestamp: Date.now(),
    targetLanguage,
  };
  
  // Add new item to the beginning and limit to MAX_HISTORY
  const updated = [newItem, ...history].slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history', e);
    // If quota is exceeded, we might want to clear old items or handle it gracefully
  }
  
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const formatTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
};