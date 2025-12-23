"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import { LuGlobe as Globe, LuCheck as Check, LuChevronDown as ChevronDown } from "react-icons/lu";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "inline";
  className?: string;
}

export function LanguageSwitcher({ variant = "dropdown", className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Fermer avec la touche Escape
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "px-2 py-1 text-sm rounded-md transition-colors",
              language === lang.code
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-input bg-background hover:bg-accent transition-colors"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-background rounded-lg shadow-lg border border-border py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-accent transition-colors",
                language === lang.code && "bg-accent"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {language === lang.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
