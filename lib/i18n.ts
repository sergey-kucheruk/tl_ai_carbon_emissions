'use client';

import React from 'react';
import { type Locale } from '@/i18n/config';

type Messages = typeof import('@/i18n/messages/en.json');

let messagesCache: Record<Locale, Messages> | null = null;

export async function getMessages(locale: Locale): Promise<Messages> {
  if (!messagesCache) {
    messagesCache = {} as Record<Locale, Messages>;
  }

  if (!messagesCache[locale]) {
    messagesCache[locale] = (await import(`@/i18n/messages/${locale}.json`)).default;
  }

  return messagesCache[locale];
}

export function useTranslations(locale: Locale) {
  const [messages, setMessages] = React.useState<Messages | null>(null);

  React.useEffect(() => {
    getMessages(locale).then(setMessages);
  }, [locale]);

  return (key: string) => {
    if (!messages) return key;
    
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };
}
