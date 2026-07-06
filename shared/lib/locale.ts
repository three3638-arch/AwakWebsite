export const DEFAULT_LOCALE = 'zh';

export const SUPPORTED_LOCALES = ['zh', 'en'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(s: string): s is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

export function withLocale(locale: string, path: string): string {
  const qIndex = path.indexOf('?');
  const pathname = qIndex >= 0 ? path.slice(0, qIndex) : path;
  const search = qIndex >= 0 ? path.slice(qIndex) : '';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const base = normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
  return `${base}${search}`;
}

export function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (isSupportedLocale(parts[0])) {
    const rest = parts.slice(1);
    return rest.length ? '/' + rest.join('/') : '/';
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function swapLocalePath(pathname: string, search: string, newLocale: AppLocale): string {
  const stripped = stripLocalePrefix(pathname);
  const logical = stripped === '/' ? '/' : stripped;
  return withLocale(newLocale, logical) + search;
}

export function isEmbedMode(search: string): boolean {
  return new URLSearchParams(search).get('embed') === '1';
}
