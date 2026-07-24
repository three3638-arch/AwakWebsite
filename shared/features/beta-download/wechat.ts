export function isWeChatBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** Resolve site-root APK path to an absolute URL for copy / open-in-browser flows. */
export function resolveApkUrl(apkPath: string): string {
  if (/^https?:\/\//i.test(apkPath)) return apkPath;
  if (typeof window === 'undefined') return apkPath;
  return new URL(apkPath, window.location.origin).href;
}
