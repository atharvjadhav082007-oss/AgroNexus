import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.dashboard': 'Dashboard',
    'nav.disaster': 'Disaster Score',
    'nav.schemes': 'Govt Schemes',
    'nav.financials': 'Financials',
    'nav.recommendations': 'Recommendations',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.aboutUs': 'About Us',

    // Dashboard
    'dash.namaste': 'Namaste',
    'dash.refreshRisk': 'Refresh Risk',
    'dash.compoundRisk': 'Compound Risk',
    'dash.financialRisk': 'Financial Risk',
    'dash.disasterRisk': 'Disaster Risk',
    'dash.farm': 'Farm',
    'dash.whyRisk': 'Why is my risk',
    'dash.rainfallForecast': '🌧️ 15-Day Rainfall Forecast (mm)',
    'dash.riskTrend': 'Risk Score Trend',
    'dash.topRecommendations': '📋 Top Recommendations',
    'dash.viewAll': 'View All',
    'dash.possibleCrisis': '⚠️ POSSIBLE CRISIS WITHIN 15 DAYS',
    'dash.acres': 'acres',

    // Risk Bands
    'band.stable': 'Stable',
    'band.watch': 'Watch',
    'band.highRisk': 'High Risk',
    'band.critical': 'Critical',

    // Chatbot
    'chat.title': 'KhetSeva AI',
    'chat.subtitle': 'कृषि सहाय्यक • Online',
    'chat.greeting': "Namaste! 🙏 I'm **KhetSeva AI Assistant** — your personal farming advisor.\n\nAsk me anything about crops, schemes, weather, or your risk scores in English or Marathi!",
    'chat.placeholder': 'Ask about crops, schemes, weather, or math...',
    'chat.poweredBy': 'Powered by Gemini AI',
    'chat.rateLimit': '⚠️ Gemini API rate limit reached. Please wait a few seconds and try again!',
    'chat.q1': '🌾 What crops should I grow?',
    'chat.q2': '📋 Am I eligible for PM-KISAN?',
    'chat.q3': '⚠️ Explain my risk score',
    'chat.q4': '💰 How to reduce loan burden?',

    // Other Pages
    'disaster.title': '🌊 Disaster Risk Analysis',
    'disaster.subtitle': '16-day forecast-based disaster prediction',
    'disaster.score': 'Disaster Risk Score',
    'disaster.risk': 'Risk',
    'disaster.hazard': 'Hazard',
    'disaster.signals': 'Risk Signals',
    'disaster.flood': 'Flood Risk',
    'disaster.drought': 'Drought Risk',
    'disaster.heatwave': 'Heatwave Risk',
    'disaster.precipitation': '15-Day Precipitation',
    'disaster.temp': '15-Day Temperature',

    'schemes.title': '🏛️ Government Schemes',
    'schemes.subtitle': 'Based on your profile, here are the schemes you can apply for.',
    'schemes.eligible': 'Eligible for You',
    'schemes.apply': 'How to Apply',
    'schemes.benefit': 'Benefit',

    'fin.title': '💰 Financial Solutions',
    'fin.subtitle': 'Risk-adjusted loan offers, insurance, and personalized financial advice.',
    'fin.loans': 'Pre-approved Loans',
    'fin.insurance': 'Crop Insurance (PMFBY)',
    'fin.score': 'Credit/Risk Score',
    'fin.apply': 'Apply Now',

    'rec.title': '📋 AI Recommendations',
    'rec.subtitle': 'Personalized farming advice based on your soil, weather, and financial data.',
    'rec.crop': 'Crop Management',
    'rec.pest': 'Pest & Disease',
    'rec.water': 'Water Management',
    'rec.market': 'Market Strategy',

    // Landing Page
    'hero.badge': 'AI-Powered Farming Solutions',
    'hero.title1': 'Smart Decisions.',
    'hero.title2': 'Stronger Harvests.',
    'hero.desc': 'KhetSeva uses AI and real-time data to predict risks, recommend the best crops, and support farmers at every step.',
    'hero.openDash': 'Open Dashboard',
    'hero.startFree': 'Start Free Today',
    'hero.tag1': 'Risk Prediction',
    'hero.tag2': 'Crop Recommendation',
    'hero.tag3': 'Weather Alerts',
    'hero.tag4': 'Govt. Schemes',
  },

  mr: {
    // Navbar
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.disaster': 'आपत्ती गुण',
    'nav.schemes': 'शासकीय योजना',
    'nav.financials': 'आर्थिक उपाय',
    'nav.recommendations': 'शिफारसी',
    'nav.profile': 'माझी माहिती',
    'nav.logout': 'लॉगआउट',
    'nav.login': 'लॉगिन',
    'nav.getStarted': 'सुरुवात करा',
    'nav.home': 'मुख्यपृष्ठ',
    'nav.features': 'वैशिष्ट्ये',
    'nav.howItWorks': 'हे कसे कार्य करते',
    'nav.aboutUs': 'आमच्याबद्दल',

    // Dashboard
    'dash.namaste': 'नमस्कार',
    'dash.refreshRisk': 'जोखीम अपडेट करा',
    'dash.compoundRisk': 'एकूण जोखीम',
    'dash.financialRisk': 'आर्थिक जोखीम',
    'dash.disasterRisk': 'आपत्ती जोखीम',
    'dash.farm': 'शेत माहिती',
    'dash.whyRisk': 'माझी जोखीम अशी का आहे',
    'dash.rainfallForecast': '🌧️ १५ दिवसांचा पाऊस अंदाज (मिमी)',
    'dash.riskTrend': 'जोखीम बदल कल',
    'dash.topRecommendations': '📋 मुख्य शिफारसी',
    'dash.viewAll': 'सर्व पहा',
    'dash.possibleCrisis': '⚠️ १५ दिवसांत संकटाची शक्यता',
    'dash.acres': 'एकर',

    // Risk Bands
    'band.stable': 'सुरक्षित',
    'band.watch': 'लक्ष ठेवा',
    'band.highRisk': 'उच्च जोखीम',
    'band.critical': 'गंभीर',

    // Chatbot
    'chat.title': 'शेतसेवा AI',
    'chat.subtitle': 'कृषि सहाय्यक • ऑनलाईन',
    'chat.greeting': "नमस्कार! 🙏 मी **शेतसेवा AI सहाय्यक** आहे — तुमचा वैयक्तिक शेती सल्लागार.\n\nमला पिके, शासकीय योजना, हवामान किंवा तुमच्या जोखीम गुणांबद्दल मराठी किंवा इंग्रजीत काहीही विचारा!",
    'chat.placeholder': 'पिके, योजना, हवामानाबद्दल विचारा...',
    'chat.poweredBy': 'Gemini AI द्वारे संचलित',
    'chat.rateLimit': '⚠️ Gemini API मर्यादा संपली आहे. कृपया काही सेकंद थांबून पुन्हा प्रयत्न करा!',
    'chat.q1': '🌾 या हंगामात कोणते पीक घ्यावे?',
    'chat.q2': '📋 मला पीएम-किसान योजना मिळेल का?',
    'chat.q3': '⚠️ माझी जोखीम समजावून सांगा',
    'chat.q4': '💰 कर्जाचा भार कसा कमी करावा?',

    // Other Pages
    'disaster.title': '🌊 आपत्ती जोखीम विश्लेषण',
    'disaster.subtitle': '१६ दिवसांच्या अंदाजानुसार आपत्तीचा अंदाज',
    'disaster.score': 'आपत्ती जोखीम गुण',
    'disaster.risk': 'जोखीम',
    'disaster.hazard': 'धोका',
    'disaster.signals': 'जोखीम संकेत',
    'disaster.flood': 'पुराचा धोका',
    'disaster.drought': 'दुष्काळाचा धोका',
    'disaster.heatwave': 'उष्णतेच्या लाटेचा धोका',
    'disaster.precipitation': '१५ दिवसांचा पाऊस',
    'disaster.temp': '१५ दिवसांचे तापमान',

    'schemes.title': '🏛️ शासकीय योजना',
    'schemes.subtitle': 'तुमच्या माहितीनुसार, तुम्ही या योजनांसाठी अर्ज करू शकता.',
    'schemes.eligible': 'तुमच्यासाठी पात्र',
    'schemes.apply': 'अर्ज कसा करावा',
    'schemes.benefit': 'फायदा',

    'fin.title': '💰 आर्थिक उपाय',
    'fin.subtitle': 'जोखीम-समायोजित कर्ज, विमा आणि वैयक्तिक आर्थिक सल्ला.',
    'fin.loans': 'मंजूर कर्जे',
    'fin.insurance': 'पीक विमा (PMFBY)',
    'fin.score': 'क्रेडिट/जोखीम गुण',
    'fin.apply': 'आता अर्ज करा',

    'rec.title': '📋 AI शिफारसी',
    'rec.subtitle': 'तुमच्या माती, हवामान आणि आर्थिक माहितीवर आधारित वैयक्तिक शेती सल्ला.',
    'rec.crop': 'पीक व्यवस्थापन',
    'rec.pest': 'कीड व रोग',
    'rec.water': 'पाणी व्यवस्थापन',
    'rec.market': 'बाजारपेठ धोरण',

    // Landing Page
    'hero.badge': 'AI-संचलित शेती उपाय',
    'hero.title1': 'हुशार निर्णय.',
    'hero.title2': 'उत्तम पीक.',
    'hero.desc': 'शेतसेवा AI आणि रिअल-टाइम डेटा वापरून धोक्यांचा अंदाज लावते, सर्वोत्तम पिकांची शिफारस करते आणि प्रत्येक टप्प्यावर शेतकऱ्यांना मदत करते.',
    'hero.openDash': 'डॅशबोर्ड उघडा',
    'hero.startFree': 'आजच मोफत सुरुवात करा',
    'hero.tag1': 'जोखीम अंदाज',
    'hero.tag2': 'पिकांची शिफारस',
    'hero.tag3': 'हवामान सूचना',
    'hero.tag4': 'शासकीय योजना',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('khetseva_lang');
    return (saved === 'mr' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('khetseva_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
