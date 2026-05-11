# AWAK 全站设计规范（首页对齐 + 工程单一事实来源）

本文档与 [`src/index.css`](src/index.css)、[`src/lib/siteNav.ts`](src/lib/siteNav.ts) 保持一致：**样式以 CSS / Tailwind 令牌为准**，避免页面硬编码分叉。

---

## 0) 单一事实来源（必读）

| 领域 | 来源 |
|------|------|
| 颜色、间距、圆角、动效令牌 | [`src/index.css`](src/index.css)（`:root`、`@theme`） |
| 品牌强调色（UI） | Tailwind：`bg-accent`、`text-accent`、`hover:bg-accent-hover`；底层 `--color-accent: #c8f000` |
| 顶栏高度 | `--nav-height`（72px）、`--nav-height-expanded`（90px）—**勿**在第二段 `:root` 再定义 `--nav-height` |
| 主导航链接路径 | [`src/lib/siteNav.ts`](src/lib/siteNav.ts) |
| 文案 i18n | [`src/locales/en/common.json`](src/locales/en/common.json)、[`src/locales/zh/common.json`](src/locales/zh/common.json) |

---

## 1) 品牌基调（视觉语言）

- **整体氛围**：暗色背景、强对比的白字层级、克制的灰度分级，唯一高饱和强调色（酸绿）。
- **信息策略**：标题大且轻（多为 `font-normal`），正文更松（行高 1.7 左右），用字重而不是颜色数量来制造层级。
- **强调策略**：只在关键 CTA / 选中态 / 重要交互反馈使用 `accent`，避免多彩 UI。
- **图标**：与首页一致使用 **lucide-react**；同类控件统一尺寸与 `strokeWidth`。

---

## 2) 颜色令牌

### 2.1 品牌强调色（已拍板：全站一枚）

- **主强调色**：`#c8f000`（= `--color-accent` / `bg-accent` / `text-accent`）。
- **悬停**：`#d4ff00`（`hover:bg-accent-hover` / `--color-accent-hover`）。
- **酸绿上的文字**：`text-ink`（`#0a0a0a`），勿在按钮上混用多种近似的十六进制黄绿（历史上曾混用 `#C8FF00`、`#DDF700` 等，已全部收敛到语义类）。

### 2.2 表面与文字（语义类优先）

- **暗色页面基底**：`bg-base`（`--color-base`）、`bg-surface-1` … `bg-surface-4`。
- **暗底文字**：`text-fg-primary`、`text-fg-secondary`、`text-fg-tertiary`、`text-fg-quaternary`。
- **亮色分区**：`bg-bg-light`（`#F5F5F3`）；亮底文字 `text-ink`、`text-ink-2`、`text-ink-3`。
- 详细注释见 [`src/index.css`](src/index.css)「颜色令牌」区块（约 L96–L137）。

---

## 3) 字体与排版

- **字体族**：全站 **`font-sans`**（DM Sans + Noto Sans SC）。禁止 `font-['DM_Sans','Noto_Sans_SC',…]`。
- **标题**：偏大、偏轻（`font-normal`），`tracking-tight` / `tracking-tighter`；Hero 参考 [`src/components/Hero.tsx`](src/components/Hero.tsx)：`text-[clamp(40px,12vw,72px)]`、`leading-none`。
- **正文**：`leading-[1.7]` 左右；颜色用 `text-fg-*` 分级。
- **字号刻度**：可参考 `--text-display-*`、`--text-heading-*`、`--text-body-*`、`--text-caption-*`（[`src/index.css`](src/index.css) 约 L148–L160）。

---

## 4) 栅格、版式与顶栏

### 4.1 水平边距（全站主策略）

- **与首页 / Navbar 一致**：区块使用 **`px-6` + `md:px-[170px]`**（全宽 section + 内容区左右内边距）。
- **生态页**等与首页对齐，已统一为 `md:px-[170px]`（不再使用 `md:px-[120px]` 与 170px 混用）。
- **可选**：内容需最大宽度时，在外层加 `max-w-[1200px] mx-auto`，内边距仍用上述规则。
- **例外**：联系页等仍使用工具类 **`.container-max`**（[`src/index.css`](src/index.css)：`max-width: 1200px` + 左右 24px）— 若改版需整体替换为 `170px` 策略，应一次性调整该工具类而非单页硬编码。

### 4.2 顶栏

- 未滚动：**`--nav-height-expanded`（90px）**；滚动压实：**`--nav-height`（72px）**。
- 实现见 [`src/components/Navbar.tsx`](src/components/Navbar.tsx)。sticky 子导航使用 `top-[var(--nav-height)]`。

### 4.3 Section 竖向节奏

- 参考 `--gap-section`、`--gap-block`（[`src/index.css`](src/index.css)）。

---

## 5) 导航与链接

- 硬件下拉 + 生态/资讯/联系路径：**仅** [`src/lib/siteNav.ts`](src/lib/siteNav.ts)。
- 顶栏浅色页 / 结账 / Auth 字色逻辑见 [`src/components/Navbar.tsx`](src/components/Navbar.tsx)。

---

## 6) 卡片、按钮、分割条与图标

### 6.1 圆角（仅三档）

| 用途 | 令牌 / 类名 | 值 |
|------|----------------|-----|
| **大卡片**（主容器、大图框等） | `--radius-card-lg`、`rounded-card-lg`、`.rounded-card-lg` | **12px** |
| **中卡片**（次级块、部分表单控件外框） | `--radius-card-md`、`rounded-card-md`、`.rounded-card-md` | **10px** |
| **可点击按钮**（主/次 CTA、胶囊） | `--radius-button`、`rounded-full` / `rounded-button` | **9999px**（全圆胶囊；设计口语「99」指此，非字面 99px） |

- 旧变量 `--radius-m` / `--radius-l` 等已别名到上述两档卡片，避免再新增第四种圆角。

### 6.2 分割条（粗细统一，仅两色）

- **粗细**：一律 `--divider-width`（**1px**）。
- **暗色背景上**：`--divider-on-dark` / Tailwind `border-divider-dark` / 工具类 **`.hairline-divider-dark`**（`rgba(255,255,255,0.1)`）。
- **亮色背景上**：`--divider-on-light` / `border-divider-light` / **`.hairline-divider-light`**（`rgba(0,0,0,0.1)`）。
- 区块分割请优先用上述色，勿混用多种 `border-white/xx`。

### 6.3 图标（lucide-react，两档尺寸 × 两档颜色）

| | 暗底 | 亮底 |
|--|------|------|
| **大** `--icon-size-lg`（24px） | `.icon-lg-dark` / `text-icon-on-dark` + `size-icon-lg` | `.icon-lg-light` / `text-icon-on-light` |
| **小** `--icon-size-sm`（18px） | `.icon-sm-dark` | `.icon-sm-light` |

- **线宽建议**：大卡配合 `strokeWidth: 2`（`--icon-stroke-lg`），小卡 `1.75`（`--icon-stroke-sm`）。

### 6.4 卡片表面与按钮

- **卡片**：**不加描边、不加投影**（`border-none`、`box-shadow`/`shadow-*` 勿用于卡片容器）；选中态用**背景/透明度**区分，**不用绿色描边或绿色 focus ring**。
- **焦点环（全站）**：`:focus-visible` 为**中性灰描边**，非 `accent`。
- **暗底玻璃卡**：如 `bg-white/10 backdrop-blur-xl`（可无描边）+ 圆角 **`rounded-card-lg`** / **`rounded-card-md`**。
- **主 CTA**：**胶囊**（`rounded-full` / `--radius-button`）+ `bg-accent text-ink`。
- **次 CTA**：描边 `border-white/20` 或浅表面 + 同为胶囊圆角。
- **动效**：`--ease-out` / `--ease-spring`（[`src/index.css`](src/index.css)）；点击态可 `active:scale-[0.98]`。
- **焦点**：保留 `:focus-visible`（使用 `var(--color-accent)`）。

---

## 7) 动效（Motion）

- 进入动效以 `fadeUp`、stagger 为主，曲线对齐 `--ease-spring` / `cubic-bezier(0.16, 1, 0.3, 1)`。
- 避免过度弹跳；尊重 `prefers-reduced-motion`（新模块需可降级）。

---

## 8) 内容与数据一致

- 用户可见文案：**走 i18n**，避免与 JSON 重复的硬编码。
- 价格、规格、SKU：**单一数据源**（商店 / 结账 / 产品页勿各写一份常量）。

---

## 9) 冲突速查（统一页面时优先核对）

1. ~~强调色多枚十六进制~~ → 已收敛为 `accent` / `accent-hover`。
2. ~~`--nav-height` 64px 与 72px 重复~~ → 已删除第二段 `:root` 中对 `--nav-height` 的覆盖。
3. **水平边距**：主站内容以 **`md:px-[170px]`** 为准；`.container` / `.container-max` 仅作明确例外。
4. **字体**：禁止内联 `font-['DM_Sans'…]`。
5. **硬编码色**：表单、链接 hover、焦点环等应使用 `var(--color-accent)` 或 Tailwind 语义类。

---

## 10) 实施清单（新页面 / 改版）

1. 使用 `bg-base`、`bg-surface-*`、`text-fg-*`、`bg-accent`、`text-ink`，避免裸 `#` 色值。
2. Section：`px-6 md:px-[170px]`（或与产品约定的 `.container-max` 一致）。
3. 标题 / 正文层级对齐首页 Hero 与 [`src/components/Hero.tsx`](src/components/Hero.tsx)。
4. 主按钮统一 `bg-accent` + `text-ink`。
5. 导航链接从 [`src/lib/siteNav.ts`](src/lib/siteNav.ts) 引用或复用主导航组件行为。
