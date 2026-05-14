/**
 * Unicorn Studio UMD：全局单例加载，供首页多处 embed 共用。
 * @see https://github.com/hiunicornstudio/unicornstudio.js
 */

export const UNICORN_STUDIO_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js';

declare global {
  interface Window {
    UnicornStudio?: { init: () => void; isInitialized?: boolean };
  }
}

let unicornScriptPromise: Promise<void> | null = null;

export function loadUnicornStudioScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (unicornScriptPromise) return unicornScriptPromise;

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${UNICORN_STUDIO_SCRIPT_SRC}"]`,
  );
  if (existing) {
    unicornScriptPromise = new Promise((resolve, reject) => {
      if (window.UnicornStudio?.init) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Unicorn Studio script failed')), {
        once: true,
      });
    });
    return unicornScriptPromise;
  }

  unicornScriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = UNICORN_STUDIO_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Unicorn Studio script failed'));
    (document.head || document.body).appendChild(s);
  });
  return unicornScriptPromise;
}

export function runUnicornStudioInit(): void {
  const u = window.UnicornStudio;
  if (u?.init) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => u.init(), { once: true });
    } else {
      u.init();
    }
  }
}
