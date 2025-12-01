import { SubscriptionState, PlanType } from '../types';

const SUB_KEY = 'easyrx_subscription';
const FREE_DAILY_LIMIT = 3;

export const getSubscriptionState = (): SubscriptionState => {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(SUB_KEY);
  
  if (stored) {
    const state = JSON.parse(stored) as SubscriptionState;
    // Reset counter if it's a new day
    if (state.lastScanDate !== today) {
      const newState = { ...state, scansToday: 0, lastScanDate: today };
      localStorage.setItem(SUB_KEY, JSON.stringify(newState));
      return newState;
    }
    return state;
  }

  // Default state
  const defaultState: SubscriptionState = {
    plan: 'free',
    scansToday: 0,
    lastScanDate: today,
  };
  localStorage.setItem(SUB_KEY, JSON.stringify(defaultState));
  return defaultState;
};

export const incrementScanCount = (): SubscriptionState => {
  const state = getSubscriptionState();
  const newState = { ...state, scansToday: state.scansToday + 1 };
  localStorage.setItem(SUB_KEY, JSON.stringify(newState));
  return newState;
};

export const upgradeToPro = (): SubscriptionState => {
  const state = getSubscriptionState();
  const newState: SubscriptionState = { ...state, plan: 'pro' };
  localStorage.setItem(SUB_KEY, JSON.stringify(newState));
  return newState;
};

export const canScan = (): boolean => {
  const state = getSubscriptionState();
  if (state.plan === 'pro') return true;
  return state.scansToday < FREE_DAILY_LIMIT;
};

export const getRemainingFreeScans = (): number => {
  const state = getSubscriptionState();
  if (state.plan === 'pro') return Infinity;
  return Math.max(0, FREE_DAILY_LIMIT - state.scansToday);
};