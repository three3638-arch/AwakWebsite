import FooterSections from '../components/FooterSections';

/** PC 官网 — 品牌故事（占位页，可后续替换为完整叙事） */
export default function BrandStoryPage() {
  return (
    <div className="min-h-screen bg-white text-[#080808]">
      <section className="px-6 pb-24 pt-28 md:px-[170px] md:pt-36">
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">品牌故事</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/55">内容筹备中，敬请期待。</p>
      </section>
      <FooterSections />
    </div>
  );
}
