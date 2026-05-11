/** 全站主导航链接（硬件下拉 + 页面链接）— 与 Navbar 单一数据源，避免各页分叉 */

export const NAV_HARDWARE_ITEMS = [
  { id: 'ring' as const, path: '/products/ring' },
  { id: 'band' as const, path: '/products/band' },
  { id: 'watch' as const, path: '/products/watch' },
  { id: 'glasses' as const, path: '/products/glasses' },
] as const;

export const NAV_SECONDARY_PAGES = [
  { key: 'ecosystem' as const, path: '/ecosystem' as const },
  { key: 'news' as const, path: '/news' as const },
  { key: 'contact' as const, path: '/contact' as const },
] as const;

export type NavHardwareId = (typeof NAV_HARDWARE_ITEMS)[number]['id'];
export type NavSecondaryKey = (typeof NAV_SECONDARY_PAGES)[number]['key'];
