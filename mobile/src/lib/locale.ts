export const DEFAULT_LOCALE = 'zh';

/** Must match `basename` on `BrowserRouter` and Vite `base` (`/m/` → basename `/m`). */
export const ROUTER_BASENAME = '/m';

export const SUPPORTED_LOCALES = ['zh', 'en'] as const;

function stripRouterBasenamePrefix(pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (p === ROUTER_BASENAME || p === `${ROUTER_BASENAME}/`) return '/';
  const prefix = `${ROUTER_BASENAME}/`;
  if (p.startsWith(prefix)) {
    const rest = p.slice(ROUTER_BASENAME.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return p;
}

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(s: string): s is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

/** Logical path always starts with /. Query string allowed, e.g. `/checkout?plan=plus` */
export function withLocale(locale: string, path: string): string {
  const qIndex = path.indexOf('?');
  const pathname = qIndex >= 0 ? path.slice(0, qIndex) : path;
  const search = qIndex >= 0 ? path.slice(qIndex) : '';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const base = normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
  return `${base}${search}`;
}

/** Strip leading `/:lang` so comparisons match legacy paths like `/store`. */
export function stripLocalePrefix(pathname: string): string {
  const normalizedPath = stripRouterBasenamePrefix(pathname);
  const parts = normalizedPath.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (isSupportedLocale(parts[0])) {
    const rest = parts.slice(1);
    return rest.length ? '/' + rest.join('/') : '/';
  }
  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
}

/** Same logical URL with a different locale prefix (preserves query string). */
export function swapLocalePath(pathname: string, search: string, newLocale: AppLocale): string {
  const stripped = stripLocalePrefix(pathname);
  const logical = stripped === '/' ? '/' : stripped;
  return withLocale(newLocale, logical) + search;
}
