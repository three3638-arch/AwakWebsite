import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_LOCALE, isSupportedLocale, withLocale } from '../lib/locale';

export function useLocalePath() {
  const { lang } = useParams<{ lang?: string }>();
  const locale = useMemo(
    () => (lang && isSupportedLocale(lang) ? lang : DEFAULT_LOCALE),
    [lang],
  );
  const withPath = useCallback((path: string) => withLocale(locale, path), [locale]);
  return { locale, withPath };
}
