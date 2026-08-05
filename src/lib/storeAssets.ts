/** 购买中心戒指产品图（置于 public/store/ring/） */
const base = import.meta.env.BASE_URL;

export const RING_STORE_IMAGES = {
  titaniumSilver: `${base}store/ring/titanium-silver.png`,
  obsidianBlack: `${base}store/ring/obsidian-black.png`,
  brilliantGold: `${base}store/ring/brilliant-gold.png`,
  matteGrey: `${base}store/ring/matte-grey.png`,
  pinkPurple: `${base}store/ring/pink-purple.png`,
  inTheBox: `${base}store/ring/in-the-box.png`,
} as const;

/** 购买中心手环产品图（置于 public/store/bracelet/） */
export const BRACELET_STORE_IMAGES = {
  obsidianBlack: `${base}store/bracelet/obsidian-black.png`,
  titaniumSilver: `${base}store/bracelet/titanium-silver.png`,
  liquidGold: `${base}store/bracelet/liquid-gold.png`,
  roseGold: `${base}store/bracelet/rose-gold.png`,
  inTheBox: `${base}store/bracelet/in-the-box.png`,
} as const;

/** 官网智能手环暂不展示的款型（隐藏 ≠ 删除） */
export const HIDDEN_BRACELET_VARIANT_NAMES = ['氟橡胶款', '小牛皮款', '金属定制款'] as const;

const HIDDEN_BRACELET_VARIANT_SET = new Set<string>(HIDDEN_BRACELET_VARIANT_NAMES);

export function isBraceletVariantVisible(name: string): boolean {
  return !HIDDEN_BRACELET_VARIANT_SET.has(name);
}

type StoreColorOption = {
  id: string;
  name: string;
  hex?: string;
  img?: string;
  price: number;
  originalPrice?: number;
  enName?: string;
};

export type StoreVariant = {
  name: string;
  img?: string;
  showPrice?: boolean;
  colors?: StoreColorOption[];
};

/** 购买中心当前品类对外展示的款型列表 */
export function getStoreDisplayVariants(category: {
  id: string;
  variants?: StoreVariant[];
}): StoreVariant[] {
  const variants = category.variants ?? [];
  if (category.id !== 'bracelet') return variants;
  return variants.filter((v) => isBraceletVariantVisible(v.name));
}
