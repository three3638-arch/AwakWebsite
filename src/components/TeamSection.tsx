import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import { VISIBLE_PRODUCT_IDS } from '../lib/visibleProducts';

const CARD_IDS = VISIBLE_PRODUCT_IDS;

const PRODUCT_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/products/ring',
  band: '/products/band',
};

const STORE_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/store/ring',
  band: '/store/bracelet',
};

const homeBase = import.meta.env.BASE_URL;

const CARD_IMAGE: Record<(typeof CARD_IDS)[number], string> = {
  ring: `${homeBase}home/team-ring-card.png`,
  band: `${homeBase}home/team-band-card.png`,
};

const GRID_COLS_CLASS =
  CARD_IDS.length <= 2 ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-4 lg:grid-cols-4';

type TeamDataRow = { label: string; value: string };

export default function TeamSection() {
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <section
      id="team"
      className="relative z-[3] m-0 mt-0 mb-0 w-full bg-transparent px-6 pt-8 pb-0 md:px-8 md:pt-10 md:pb-0 lg:m-0 lg:mt-0 lg:mb-0 lg:h-[100vh] lg:max-h-[100vh] lg:min-h-0 lg:overflow-hidden lg:bg-black lg:p-0 lg:px-0 lg:py-0"
    >
      {/* 桌面：顶部多段黑→透明，避免硬分割 */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[55] hidden h-[22%] min-h-[140px] lg:block"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 14%, rgba(0,0,0,0.28) 32%, rgba(0,0,0,0.12) 52%, rgba(0,0,0,0.04) 72%, rgba(0,0,0,0.015) 88%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden
      />

      {/* 四图：lg 全宽满高 + divide 细线；小屏 2×2 / md 四列 */}
      <div className={`grid min-h-0 flex-1 grid-cols-2 divide-x divide-[rgba(255,255,255,0.1)] ${GRID_COLS_CLASS} lg:absolute lg:inset-x-0 lg:top-[14%] lg:h-[82%] lg:grid lg:min-h-0 lg:gap-0 lg:divide-x`}>
        {CARD_IDS.map((id, index) => {
          const img = CARD_IMAGE[id];

          const brand = t(`home.team.cards.${id}.brand`);
          const category = t(`home.team.cards.${id}.category`);
          const subtitle = t(`home.team.cards.${id}.subtitle`);
          const dataRowsRaw = t(`home.team.cards.${id}.dataRows`, { returnObjects: true });
          const dataRows: TeamDataRow[] = Array.isArray(dataRowsRaw)
            ? (dataRowsRaw as TeamDataRow[])
            : [];

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.15, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="group relative flex min-h-[42vw] cursor-pointer flex-col overflow-hidden bg-neutral-900/90 sm:min-h-[36vw] md:min-h-0 md:aspect-[3/5] md:max-h-[min(72vh,720px)] lg:min-h-0 lg:max-h-none lg:aspect-auto lg:bg-black"
              onClick={() => navigate(withPath(PRODUCT_LINK[id]))}
            >
              <img
                src={img}
                alt={brand}
                className="home-float-slow absolute inset-0 h-full w-full max-lg:!animate-none object-cover opacity-90 transition-all duration-[1.4s] ease-out group-hover:scale-[1.02] group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />

              <div
                className="pointer-events-none absolute inset-0 z-[20] bg-gradient-to-t from-black/75 via-black/25 to-transparent lg:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[20] hidden bg-gradient-to-b from-black/60 via-black/20 to-transparent lg:block"
                aria-hidden
              />

              <div className="home-team-overlay pointer-events-none absolute inset-0 z-[100] flex max-w-full flex-col items-center justify-center px-4 text-center md:px-6 max-lg:pb-10 lg:items-start lg:justify-start lg:px-0 lg:pb-0 lg:pt-0 lg:text-left">
                <h3 className="font-medium uppercase leading-[1.15] tracking-[-0.02em] text-[#FFFFFF] [font-size:clamp(1.75rem,2.2vw,2rem)]">
                  {brand}
                </h3>
                <p className="mt-1 max-w-[95%] text-[12px] font-normal uppercase leading-[1.4] tracking-widest text-[#FFFFFF] md:text-[13px] md:tracking-[0.2em] lg:max-w-[18rem]">
                  {category}
                </p>
                {subtitle?.trim() ? (
                  <p className="mt-2 max-w-[min(95%,280px)] text-[13px] font-normal leading-[1.5] text-[#FFFFFF] md:text-[14px] lg:max-w-[16rem]">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              {/* PC：悬停才显示右上角箭头（无描边、无文案） */}
              <div className="pointer-events-none absolute right-4 top-4 z-[120] hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
                <button
                  type="button"
                  className="tech-team-cta-arrow pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border-0 bg-white/12 text-[1.35rem] leading-none text-white shadow-none outline-none ring-0 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-label={t('home.team.cta')}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(withPath(STORE_LINK[id]));
                  }}
                >
                  <span aria-hidden>→</span>
                </button>
              </div>

              {/* PC：悬停时底部数据表（毛玻璃；悬停 translateY 30% 下移） */}
              <div
                className="pointer-events-none absolute bottom-[10%] left-1/2 z-[105] hidden h-[25%] w-[80%] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-[30%] group-hover:opacity-100 lg:block"
                aria-hidden
              >
                <div className="box-border flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-white/25 bg-white/12 px-2.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150">
                  <table className="h-full w-full border-collapse text-left [font-size:clamp(9px,0.62vw,11px)] leading-tight text-white/95">
                    <tbody>
                      {dataRows.slice(0, 4).map((row, ri) => (
                        <tr key={ri} className="border-b border-white/[0.12] last:border-b-0">
                          <th
                            scope="row"
                            className="w-[46%] max-w-[46%] py-[3px] pr-2 align-middle font-normal text-white/55"
                          >
                            {row.label}
                          </th>
                          <td className="py-[3px] align-middle font-normal text-white/90">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 平板/手机：底部悬停 CTA（PC 使用右上角按钮） */}
              <div className="absolute inset-x-0 bottom-0 z-[110] flex translate-y-3 justify-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
                <button
                  type="button"
                  className="pointer-events-auto mb-4 rounded-[12px] border border-[rgba(255,255,255,0.14)] bg-white px-8 py-2.5 text-sm font-medium text-black transition-colors hover:border-[#DDF700] md:px-10 md:py-3"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(withPath(STORE_LINK[id]));
                  }}
                >
                  {t('home.team.cta')} <span className="text-lg">→</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
