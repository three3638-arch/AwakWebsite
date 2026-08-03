/** 全站硬件品类 ID */
export const ALL_PRODUCT_IDS = ['ring', 'band', 'watch', 'glasses'] as const;
export type ProductId = (typeof ALL_PRODUCT_IDS)[number];

/** 官网手机端暂不展示的硬件品类 */
export const HIDDEN_PRODUCT_IDS = ['watch', 'glasses'] as const satisfies readonly ProductId[];

const HIDDEN_SET = new Set<string>(HIDDEN_PRODUCT_IDS);

export function isProductVisible(id: ProductId): boolean {
  return !HIDDEN_SET.has(id);
}

/** 当前对外展示的硬件品类（戒指、手环） */
export const VISIBLE_PRODUCT_IDS = ALL_PRODUCT_IDS.filter(isProductVisible) as Array<
  Exclude<ProductId, (typeof HIDDEN_PRODUCT_IDS)[number]>
>;
