"use client"

/**
 * Language Selector Component
 * Dropdown to select language with flag emojis
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, isLoading } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as LanguageCode);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={language}
        onValueChange={handleLanguageChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{SUPPORTED_LANGUAGES[language].flag}</span>
              <span>{SUPPORTED_LANGUAGES[language].nativeName}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
