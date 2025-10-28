import React, { createContext } from 'react';

export const translations = {
  en: {
    searchTitle: "Drug, Element or Compound",
    searchPlaceholder: "e.g., Aspirin",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    filtersTitle: "Filters",
    capsule: "Capsule",
    liquid: "Liquid",
    tablet: "Tablet",
    historyTitle: "Formula History",
    downloadHistory: "Download History",
    noHistory: "No search history.",
    generalInfoTitle: "General Information",
    summaryTitle: "Findings & Summary",
    interactionsTitle: "Interactions & Optimization",
    panelPlaceholder: "Enter a compound and click 'Analyze' to see the results here.",
    error: "Error",
    downloadData: "Download Data"
  },
  tr: {
    searchTitle: "İlaç, Element ya da Bileşik",
    searchPlaceholder: "e.g., Aspirin",
    analyze: "Analiz Et",
    analyzing: "Analiz Ediliyor...",
    filtersTitle: "Filtreler",
    capsule: "Kapsül",
    liquid: "Sıvı",
    tablet: "Tablet",
    historyTitle: "Geçmiş Formüller",
    downloadHistory: "Geçmişi İndir",
    noHistory: "Arama geçmişi yok.",
    generalInfoTitle: "Genel Bilgiler",
    summaryTitle: "Bulgular ve Özet",
    interactionsTitle: "Etkileşimler ve Optimizasyon",
    panelPlaceholder: "Sonuçları burada görmek için bir bileşik girin ve 'Analiz Et'e tıklayın.",
    error: "Hata",
    downloadData: "Veriyi İndir"
  },
};

type Language = 'en' | 'tr';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

export const LocalizationContext = createContext<LocalizationContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key) => translations.tr[key] || key,
});
