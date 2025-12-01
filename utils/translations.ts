export type LanguageCode = 'en' | 'bn' | 'hi' | 'ur' | 'zh';

export interface TranslationDictionary {
  appTitle: string;
  history: string;
  poweredBy: string;
  introTitle1: string;
  introTitle2: string;
  introDesc: string;
  dropTitle: string;
  dropSubtitle: string;
  or: string;
  useCamera: string;
  dropToReplace: string;
  dropActive: string;
  translateTo: string;
  processBtn: string;
  processingBtn: string;
  originalText: string;
  translation: string;
  detecting: string;
  noText: string;
  imageContent: string;
  takePhoto: string;
  cancel: string;
  snap: string;
  clearAll: string;
  noHistory: string;
  historyDesc: string;
  removeImage: string;
  errorProcess: string;
  errorCamera: string;
  errorDrop: string;
  toggleTheme: string;
  retry: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appTitle: "EasyRx",
    history: "History",
    poweredBy: "Powered by Gemini",
    introTitle1: "Extract & Translate",
    introTitle2: "Text from Images",
    introDesc: "Upload a photo or capture one to instantly extract text and translate it into your preferred language with AI.",
    dropTitle: "Drop an image here",
    dropSubtitle: "or click to upload",
    or: "OR",
    useCamera: "Use Camera",
    dropToReplace: "Drop to replace",
    dropActive: "Drop image here",
    translateTo: "Translate to",
    processBtn: "Extract & Translate",
    processingBtn: "Translating...",
    originalText: "Original Text",
    translation: "Translation",
    detecting: "Detecting...",
    noText: "No text content detected",
    imageContent: "Image content",
    takePhoto: "Take Photo",
    cancel: "Cancel",
    snap: "Snap",
    clearAll: "Clear All",
    noHistory: "No recent history",
    historyDesc: "Translations you make will appear here",
    removeImage: "Remove image",
    errorProcess: "Failed to process image. Please try again or use a clearer image.",
    errorCamera: "Unable to access camera. Please allow permission or try uploading a file.",
    errorDrop: "Please drop an image file.",
    toggleTheme: "Toggle dark mode",
    retry: "Retry"
  },
  bn: {
    appTitle: "EasyRx",
    history: "ইতিহাস",
    poweredBy: "জেমিনি দ্বারা চালিত",
    introTitle1: "টেক্সট বের করুন",
    introTitle2: "এবং অনুবাদ করুন",
    introDesc: "ছবি আপলোড করুন বা ছবি তুলুন এবং এআই এর মাধ্যমে আপনার পছন্দের ভাষায় অনুবাদ করুন।",
    dropTitle: "এখানে একটি ছবি দিন",
    dropSubtitle: "বা আপলোড করতে ক্লিক করুন",
    or: "অথবা",
    useCamera: "ক্যামেরা ব্যবহার করুন",
    dropToReplace: "প্রতিস্থাপন করতে এখানে দিন",
    dropActive: "এখানে ছবি দিন",
    translateTo: "অনুবাদ করুন",
    processBtn: "বের করুন এবং অনুবাদ করুন",
    processingBtn: "অনুবাদ করা হচ্ছে...",
    originalText: "মূল টেক্সট",
    translation: "অনুবাদ",
    detecting: "শনাক্ত করা হচ্ছে...",
    noText: "কোন টেক্সট পাওয়া যায়নি",
    imageContent: "ছবির বিষয়বস্তু",
    takePhoto: "ছবি তুলুন",
    cancel: "বাতিল",
    snap: "তুলুন",
    clearAll: "সব মুছুন",
    noHistory: "কোন ইতিহাস নেই",
    historyDesc: "আপনার অনুবাদগুলো এখানে দেখা যাবে",
    removeImage: "ছবি সরান",
    errorProcess: "প্রক্রিয়া ব্যর্থ হয়েছে। আবার চেষ্টা করুন বা স্পষ্ট ছবি ব্যবহার করুন।",
    errorCamera: "ক্যামেরা অ্যাক্সেস করা যাচ্ছে না। অনুমতি দিন বা ফাইল আপলোড করুন।",
    errorDrop: "অনুগ্রহ করে একটি ছবি ফাইল দিন।",
    toggleTheme: "থিম পরিবর্তন করুন",
    retry: "পুনরায় চেষ্টা করুন"
  },
  hi: {
    appTitle: "EasyRx",
    history: "इतिहास",
    poweredBy: "जेमिनी द्वारा संचालित",
    introTitle1: "टेक्स्ट निकालें",
    introTitle2: "और अनुवाद करें",
    introDesc: "फोटो अपलोड करें या खींचें और एआई के साथ अपनी पसंदीदा भाषा में तुरंत अनुवाद करें।",
    dropTitle: "यहाँ एक छवि छोड़ें",
    dropSubtitle: "या अपलोड करने के लिए क्लिक करें",
    or: "या",
    useCamera: "कैमरा का उपयोग करें",
    dropToReplace: "बदलने के लिए यहाँ छोड़ें",
    dropActive: "यहाँ छवि छोड़ें",
    translateTo: "इसमें अनुवाद करें",
    processBtn: "निकालें और अनुवाद करें",
    processingBtn: "अनुवाद हो रहा है...",
    originalText: "मूल पाठ",
    translation: "अनुवाद",
    detecting: "पता लगाया जा रहा है...",
    noText: "कोई पाठ नहीं मिला",
    imageContent: "छवि सामग्री",
    takePhoto: "फोटो लें",
    cancel: "रद्द करें",
    snap: "स्नैप",
    clearAll: "सभी साफ़ करें",
    noHistory: "कोई हालिया इतिहास नहीं",
    historyDesc: "आपके द्वारा किए गए अनुवाद यहाँ दिखाई देंगे",
    removeImage: "छवि हटाएँ",
    errorProcess: "छवि संसाधित करने में विफल। कृपया पुन: प्रयास करें या स्पष्ट छवि का उपयोग करें।",
    errorCamera: "कैमरे तक पहुँचने में असमर्थ। कृपया अनुमति दें या फ़ाइल अपलोड करें।",
    errorDrop: "कृपया एक छवि फ़ाइल छोड़ें।",
    toggleTheme: "थीम बदलें",
    retry: "पुनः प्रयास करें"
  },
  ur: {
    appTitle: "EasyRx",
    history: "تاریخ",
    poweredBy: "جیمنی کے ذریعے",
    introTitle1: "متن نکالیں",
    introTitle2: "اور ترجمہ کریں",
    introDesc: "تصویر اپ لوڈ کریں یا کھینچیں اور AI کے ساتھ اپنی پسندیدہ زبان میں فوری ترجمہ کریں۔",
    dropTitle: "تصویر یہاں ڈالیں",
    dropSubtitle: "یا اپ لوڈ کرنے کے لیے کلک کریں",
    or: "یا",
    useCamera: "کیمرہ استعمال کریں",
    dropToReplace: "تبدیل کرنے کے لیے یہاں ڈالیں",
    dropActive: "تصویر یہاں ڈالیں",
    translateTo: "ترجمہ کریں",
    processBtn: "نکالیں اور ترجمہ کریں",
    processingBtn: "ترجمہ ہو رہا ہے...",
    originalText: "اصل متن",
    translation: "ترجمہ",
    detecting: "شناخت ہو رہی ہے...",
    noText: "کوئی متن نہیں ملا",
    imageContent: "تصویر کا مواد",
    takePhoto: "تصویر لیں",
    cancel: "منسوخ کریں",
    snap: "تصویر کھینچیں",
    clearAll: "سب صاف کریں",
    noHistory: "کوئی حالیہ تاریخ نہیں",
    historyDesc: "آپ کے ترجمے یہاں ظاہر ہوں گے",
    removeImage: "تصویر ہٹائیں",
    errorProcess: "تصویر پر کارروائی کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں یا واضح تصویر استعمال کریں۔",
    errorCamera: "کیمرے تک رسائی سے قاصر۔ براہ کرم اجازت دیں یا فائل اپ لوڈ کریں۔",
    errorDrop: "براہ کرم تصویر کی فائل ڈالیں۔",
    toggleTheme: "تھیم تبدیل کریں",
    retry: "دوبارہ کوشش کریں"
  },
  zh: {
    appTitle: "EasyRx",
    history: "历史记录",
    poweredBy: "由 Gemini 提供支持",
    introTitle1: "提取并翻译",
    introTitle2: "图片中的文字",
    introDesc: "上传或拍摄照片，使用 AI 即时提取文字并将其翻译成您喜欢的语言。",
    dropTitle: "将图片拖放到此处",
    dropSubtitle: "或点击上传",
    or: "或",
    useCamera: "使用相机",
    dropToReplace: "拖放以替换",
    dropActive: "将图片放在这里",
    translateTo: "翻译成",
    processBtn: "提取并翻译",
    processingBtn: "翻译中...",
    originalText: "原文",
    translation: "译文",
    detecting: "检测中...",
    noText: "未检测到文字内容",
    imageContent: "图片内容",
    takePhoto: "拍照",
    cancel: "取消",
    snap: "拍照",
    clearAll: "全部清除",
    noHistory: "无近期历史",
    historyDesc: "您的翻译将显示在这里",
    removeImage: "移除图片",
    errorProcess: "处理图片失败。请重试或使用更清晰的图片。",
    errorCamera: "无法访问相机。请授予权限或尝试上传文件。",
    errorDrop: "请拖放图片文件。",
    toggleTheme: "切换主题",
    retry: "重试"
  }
};