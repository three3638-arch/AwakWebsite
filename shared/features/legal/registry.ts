import type { AppLocale } from '../../lib/locale';
import meta from '../../../content/legal/meta.json';

import termsZh from '../../../content/legal/zh/terms.md?raw';
import privacyZh from '../../../content/legal/zh/privacy.md?raw';
import healthDataConsentZh from '../../../content/legal/zh/health-data-consent.md?raw';
import deviceSafetyZh from '../../../content/legal/zh/device-safety.md?raw';

import termsEn from '../../../content/legal/en/terms.md?raw';
import privacyEn from '../../../content/legal/en/privacy.md?raw';
import healthDataConsentEn from '../../../content/legal/en/health-data-consent.md?raw';
import deviceSafetyEn from '../../../content/legal/en/device-safety.md?raw';

export const LEGAL_SLUGS = [
  'terms',
  'privacy',
  'health-data-consent',
  'device-safety',
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(s: string): s is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(s);
}

export const legalDocuments: Record<AppLocale, Record<LegalSlug, string>> = {
  zh: {
    terms: termsZh,
    privacy: privacyZh,
    'health-data-consent': healthDataConsentZh,
    'device-safety': deviceSafetyZh,
  },
  en: {
    terms: termsEn,
    privacy: privacyEn,
    'health-data-consent': healthDataConsentEn,
    'device-safety': deviceSafetyEn,
  },
};

export type LegalDocumentMeta = {
  slug: LegalSlug;
  version: string;
  updatedAt: string;
  titleKey: string;
};

export const legalDocumentMeta: LegalDocumentMeta[] = meta.documents as LegalDocumentMeta[];

export function getLegalMeta(slug: LegalSlug): LegalDocumentMeta | undefined {
  return legalDocumentMeta.find((d) => d.slug === slug);
}

export const legalGlobalMeta = {
  version: meta.version,
  updatedAt: meta.updatedAt,
};
