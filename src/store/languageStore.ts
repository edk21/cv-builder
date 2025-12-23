import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, translations } from "@/lib/i18n/translations";
import { useEffect, useState } from "react";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "fr",

      setLanguage: (lang) => set({ language: lang }),

      t: (key) => {
        const { language } = get();
        return translations[language][key] || translations.fr[key] || key;
      },
    }),
    {
      name: "cv-builder-language",
    }
  )
);

// Hook helper for easier usage with hydration safety
export function useTranslation() {
  const { language, setLanguage, t } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return default language translations during SSR/hydration
  const safeT = (key: string) => {
    if (!mounted) {
      return translations.fr[key] || key;
    }
    return t(key);
  };

  return { language, setLanguage, t: safeT };
}

