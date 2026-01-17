"use client";

import { useState, useRef, useEffect, useId } from "react";
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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  const currentLang = languages.find((l) => l.code === language);
  const currentIndex = Math.max(
    languages.findIndex((lang) => lang.code === language),
    0
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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

  useEffect(() => {
    if (!isOpen) return;
    window.requestAnimationFrame(() => {
      optionRefs.current[focusedIndex]?.focus();
    });
  }, [focusedIndex, isOpen]);

  const openDropdown = () => {
    setFocusedIndex(currentIndex);
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openDropdown();
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (index + 1) % languages.length;
      setFocusedIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex = (index - 1 + languages.length) % languages.length;
      setFocusedIndex(prevIndex);
      optionRefs.current[prevIndex]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusedIndex(0);
      optionRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const lastIndex = languages.length - 1;
      setFocusedIndex(lastIndex);
      optionRefs.current[lastIndex]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setLanguage(languages[index].code);
      setIsOpen(false);
    }
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            type="button"
            className={cn(
              "px-2 py-1 text-sm rounded-md transition-colors",
              language === lang.code
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
            aria-pressed={language === lang.code}
            aria-label={`Changer la langue en ${lang.name}`}
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
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }
          openDropdown();
        }}
        onKeyDown={handleTriggerKeyDown}
        type="button"
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-input bg-background hover:bg-accent transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`Langue: ${currentLang?.name ?? ""}`}
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-40 bg-background rounded-lg shadow-lg border border-border py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-200"
          role="listbox"
          id={listboxId}
          aria-activedescendant={`${listboxId}-option-${languages[focusedIndex]?.code}`}
        >
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              id={`${listboxId}-option-${lang.code}`}
              role="option"
              aria-selected={language === lang.code}
              tabIndex={focusedIndex === index ? 0 : -1}
              type="button"
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
