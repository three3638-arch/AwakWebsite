/** 全站硬件品类 ID */
export const ALL_PRODUCT_IDS = ['ring', 'band', 'watch', 'glasses'] as const;
export type ProductId = (typeof ALL_PRODUCT_IDS)[number];

/** 官网 Web 端暂不展示的硬件品类 */
export const HIDDEN_PRODUCT_IDS = ['watch', 'glasses'] as const satisfies readonly ProductId[];

const HIDDEN_SET = new Set<string>(HIDDEN_PRODUCT_IDS);

export function isProductVisible(id: ProductId): boolean {
  return !HIDDEN_SET.has(id);
}

/** 当前对外展示的硬件品类（戒指、手环） */
export const VISIBLE_PRODUCT_IDS = ALL_PRODUCT_IDS.filter(isProductVisible) as Array<
  Exclude<ProductId, (typeof HIDDEN_PRODUCT_IDS)[number]>
>;

/** 购买中心品类 ID（与路由 /store/:category 一致） */
export const ALL_STORE_CATEGORY_IDS = ['ring', 'bracelet', 'watch', 'glasses'] as const;
export type StoreCategoryId = (typeof ALL_STORE_CATEGORY_IDS)[number];

const STORE_TO_PRODUCT: Record<StoreCategoryId, ProductId> = {
  ring: 'ring',
  bracelet: 'band',
  watch: 'watch',
  glasses: 'glasses',
};

/** 购买中心导航是否展示该品类（隐藏 ≠ 删除，数据仍保留） */
export function isStoreCategoryVisible(storeId: StoreCategoryId): boolean {
  return isProductVisible(STORE_TO_PRODUCT[storeId]);
}

export const VISIBLE_STORE_CATEGORY_IDS = ALL_STORE_CATEGORY_IDS.filter(isStoreCategoryVisible);
