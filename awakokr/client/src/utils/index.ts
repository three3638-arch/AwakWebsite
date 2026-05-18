/** 简单的 className 合并工具 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
