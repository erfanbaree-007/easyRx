import React from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  labels: {
    unlockPro: string;
    planFreeDesc: string;
    planProDesc: string;
    freePlan: string;
    proPlan: string;
    featureScans: string;
    featureSpeed: string;
    featureQuality: string;
    featureAds: string;
    subscribeBtn: string;
    restorePurchase: string;
    popular: string;
    limitReached?: string;
    limitReachedDesc?: string;
  };
  isLimitReached?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  labels,
  isLimitReached
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]"></div>
           <h2 className="text-3xl font-bold text-white relative z-10 text-center px-4">
             {isLimitReached ? labels.limitReached : labels.unlockPro}
           </h2>
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-sm"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>

        <div className="p-6 sm:p-8">
          {isLimitReached && (
            <div className="mb-8 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
              <p className="text-red-600 dark:text-red-400 font-medium">
                {labels.limitReachedDesc}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Free Plan */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col relative opacity-75 hover:opacity-100 transition-opacity">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{labels.freePlan}</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{labels.planFreeDesc}</p>
               <div className="text-3xl font-bold text-slate-800 dark:text-white mb-6">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
               
               <ul className="space-y-3 mb-6 flex-1">
                 <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                   <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                   {labels.featureScans}
                 </li>
                 <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                   <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                   {labels.featureAds}
                 </li>
               </ul>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 p-6 flex flex-col relative bg-indigo-50/20 dark:bg-indigo-900/10">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                 {labels.popular}
               </div>
               
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{labels.proPlan}</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{labels.planProDesc}</p>
               <div className="text-3xl font-bold text-slate-800 dark:text-white mb-6">$4.99<span className="text-sm font-normal text-slate-500">/mo</span></div>
               
               <ul className="space-y-3 mb-6 flex-1">
                 <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-medium">
                   <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                     <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                   </div>
                   Unlimited Scans
                 </li>
                 <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-medium">
                   <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                     <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                   </div>
                   Faster Processing
                 </li>
                 <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 font-medium">
                   <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                     <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                   </div>
                   No Ads
                 </li>
               </ul>

               <button
                 onClick={onUpgrade}
                 className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
               >
                 {labels.subscribeBtn}
               </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 underline">
              {labels.restorePurchase}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};