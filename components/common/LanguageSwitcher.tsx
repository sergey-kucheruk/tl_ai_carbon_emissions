'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from '@/lib/providers/locale';
import { locales, localeNames, type Locale } from '@/i18n/config';

const localeCodes: Record<Locale, string> = {
  en: 'EN',
  pl: 'PL',
  sk: 'SK',
  de: 'DE',
  it: 'IT',
  hr: 'HR',
};

const countryCodes: Record<Locale, string> = {
  en: 'GB',
  pl: 'PL',
  sk: 'SK',
  de: 'DE',
  it: 'IT',
  hr: 'HR',
};

// SVG flag components
const FlagIcon = ({ code }: { code: string }) => {
  const flagUrl = `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
  return (
    <img 
      src={flagUrl} 
      alt={code}
      className="w-5 h-4 object-cover rounded-sm"
      loading="lazy"
    />
  );
};

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (selectedLocale: Locale) => {
    setLocale(selectedLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white text-gray-800 cursor-pointer hover:border-gray-400 min-w-[150px] justify-between"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <FlagIcon code={countryCodes[locale]} />
            <span className="font-medium">{localeNames[locale]} ({localeCodes[locale]})</span>
          </div>
          <svg
            className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
            <ul
              className="py-1"
              role="listbox"
            >
              {locales.map((loc) => (
                <li key={loc} role="option">
                  <button
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className={`w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                      locale === loc ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FlagIcon code={countryCodes[loc]} />
                      <span>{localeNames[loc]}&nbsp;({localeCodes[loc]})</span>
                    </span>
                    {locale === loc && (
                      <svg
                        className="w-3.5 h-3.5 ml-auto text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
