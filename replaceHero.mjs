import fs from 'fs';

let content = fs.readFileSync('src/pages/StorePage.tsx', 'utf-8');

// Update imports
if (!content.includes('Shield,')) {
    content = content.replace("import { Check", "import { Shield, RefreshCw, Lock, ZoomIn, Check");
}

// Add state for lightbox
if (!content.includes('const [isLightboxOpen')) {
    content = content.replace(
        "const [showStickyBar, setShowStickyBar] = useState(false);",
        "const [showStickyBar, setShowStickyBar] = useState(false);\n  const [isLightboxOpen, setIsLightboxOpen] = useState(false);\n  const [activeThumb, setActiveThumb] = useState(0);"
    );
}

const newHero = `      {/* Configurator Section - PRODUCT HERO REWRITTEN */}
      <div ref={heroRef} className="flex flex-col md:flex-row relative min-h-screen bg-[#080808] pt-[72px]">
        
        {/* LEFT: Product Images (55%) */}
        <div className="w-full md:w-[55%] flex flex-col relative z-10 px-8 py-12 items-center justify-center">
          <div className="w-full max-w-[500px] aspect-square relative flex items-center justify-center cursor-zoom-in group" onClick={() => setIsLightboxOpen(true)}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeCategory.id + selectedColor.id + activeThumb}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                src={selectedColor.img} 
                alt={activeCategory.name} 
                className="w-full h-full object-contain filter drop-shadow-[0_10px_40px_rgba(200,255,0,0.05)]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* 360° Indicator */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
              <RefreshCw className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs font-bold font-mono">360°</span>
            </div>
            
            {/* Hover hint */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 pointer-events-none">
              <ZoomIn className="w-5 h-5 text-white/70" />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-8">
            {[selectedColor.img, selectedColor.img, selectedColor.img, selectedColor.img].map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveThumb(idx)}
                className={\`w-[52px] h-[52px] rounded-lg overflow-hidden border \${activeThumb === idx ? 'border-[#C8FF00]' : 'border-white/10 opacity-50 hover:opacity-100'} transition-all\`}
              >
                <img src={img} className="w-full h-full object-contain bg-white/5" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Purchasing Info (45%) */}
        <div className="w-full md:w-[45%] bg-[#080808] md:border-l border-[rgba(255,255,255,0.06)] relative text-white">
          <div className="md:sticky md:top-[72px] md:h-[calc(100vh-72px)] overflow-y-auto px-8 md:px-12 lg:px-16 py-12 hide-scrollbar">
            
            {/* ① 产品标识行 */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-[12px] text-[#9B9B96] tracking-[0.2em] uppercase">Awak Health</span>
              <h1 className="text-[32px] font-bold text-white leading-tight">智能戒指 AWAK Ring</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#C8FF00] text-[#C8FF00]" />)}
                </div>
                <span className="text-[13px] text-white/80 font-mono">4.9 (2,847条评价)</span>
              </div>
            </div>

            {/* ② 价格区 */}
            <div className="my-6 py-5 border-t border-b border-[rgba(255,255,255,0.06)] flex flex-col gap-2">
              <div className="flex items-baseline">
                <span className="text-[40px] font-[800] text-white tabular-nums">¥349.00</span>
                <span className="text-[18px] text-[#9B9B96] line-through ml-3">¥499.00</span>
                <span className="bg-[#C8FF00] text-[#080808] text-[12px] font-bold px-2 py-[3px] rounded ml-3">限时优惠</span>
              </div>
              <span className="text-[13px] text-[#9B9B96]">或每月仅需 ¥116.33，分3期免息</span>
            </div>

            {/* ③ 颜色选择器 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[13px] text-[#9B9B96]">颜色</span>
                <span className="text-[13px] text-white">{selectedColor.name}</span>
              </div>
              <div className="flex gap-4">
                {colors.map(c => {
                  const hexMap: Record<string, string> = {
                    'obsidian': '#1A1A1A',
                    'titanium': '#E8E8E4',
                    'liquid-gold': '#C9A96E',
                    'rose-gold': '#CAA193'
                  };
                  const ringColors: Record<string, string> = {
                    'obsidian': 'rgba(255,255,255,0.2)',
                    'titanium': 'rgba(0,0,0,0.15)',
                    'liquid-gold': 'rgba(255,255,255,0.2)',
                    'rose-gold': 'rgba(255,255,255,0.2)'
                  };
                  const isSelected = selectedColor.id === c.id;
                  
                  return (
                    <button 
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={\`relative w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all \${isSelected ? 'border-2 border-[#C8FF00]' : 'border border-transparent'}\`}
                      style={{ padding: isSelected ? '4px' : '0px' }}
                    >
                      {/* Fake background to create the white gap if selected */}
                      {isSelected && <div className="absolute inset-0 rounded-full border-2 border-[#080808] z-10" />}
                      <div 
                        className="w-full h-full rounded-full relative z-0" 
                        style={{ backgroundColor: hexMap[c.id] || '#555', border: \`1px solid \${ringColors[c.id] || 'transparent'}\` }} 
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ④ 尺寸选择器 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-[#9B9B96]">戒圈尺寸</span>
                <button onClick={() => setIsSizeGuideOpen(true)} className="text-[13px] text-[#C8FF00] hover:underline">尺寸指南</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[6, 7, 8, 9, 10].map(size => {
                  const outOfStock = size === 11;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={\`relative h-10 rounded-full flex items-center justify-center text-sm font-mono transition-colors \${
                        outOfStock ? 'border border-white/10 text-white/25 cursor-not-allowed overflow-hidden' :
                        isSelected ? 'border border-[#C8FF00] bg-[#C8FF00]/10 text-white' : 
                        'border border-white/15 bg-transparent text-white/60 hover:text-white hover:border-white/30'
                      }\`}
                    >
                      {outOfStock && <div className="absolute w-[120%] h-[1px] bg-white/20 rotate-45" />}
                      US {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ⑤ CTA 操作区 */}
            <div className="flex flex-col gap-3 mb-6 mt-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Box className="w-4 h-4 text-[#9B9B96]" />
                <span className="text-[13px] text-[#9B9B96]">免费配送 · 30天无忧退换</span>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="w-full h-[52px] bg-[#C8FF00] text-[#080808] font-bold text-[15px] rounded-[8px] hover:bg-[#b3e600] transition-colors">
                加入购物车
              </button>
              <button className="w-full h-[52px] bg-transparent border border-white text-white font-bold text-[15px] rounded-[8px] hover:bg-white/5 transition-colors">
                立即购买
              </button>
            </div>

            {/* ⑥ 信任背书小图标栏 */}
            <div className="grid grid-cols-4 gap-2 mb-10 pt-8 border-t border-[rgba(255,255,255,0.06)]">
              {[
                { icon: Shield, text: '18个月质保' },
                { icon: RefreshCw, text: '30天退换' },
                { icon: Zap, text: '当日发货' },
                { icon: Lock, text: '数据加密' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 text-[rgba(255,255,255,0.5)]">
                  <item.icon className="w-6 h-6" strokeWidth={1.5} />
                  <span className="text-[11px] whitespace-nowrap">{item.text}</span>
                </div>
              ))}
            </div>

            {/* ⑦ 产品简介折叠（Accordion） */}
            <div className="border-t border-[rgba(255,255,255,0.06)]">
              <HeroAccordion title="产品简介" defaultOpen>
                <ul className="text-[rgba(255,255,255,0.75)] text-sm space-y-2 list-disc pl-4">
                  <li>航空级钛合金材质，重量仅 4.8g，无感佩戴</li>
                  <li>医疗级传感器阵列，7×24小时连续监测血氧及心率</li>
                  <li>最长 7 天超长续航，支持 50 米深度防水</li>
                </ul>
              </HeroAccordion>
              <HeroAccordion title="配送说明">
                <p className="text-[rgba(255,255,255,0.75)] text-sm">所有订单由顺丰速运免费配送，预计工作日内发货将在 1-3 天送达。如有延迟将另行通知。</p>
              </HeroAccordion>
              <HeroAccordion title="退换政策">
                <p className="text-[rgba(255,255,255,0.75)] text-sm">自您签收商品起 30 日内，如商品及包装完好（不影响二次销售），我们提供无理由退换货服务。</p>
              </HeroAccordion>
              <HeroAccordion title="产品证书">
                <p className="text-[rgba(255,255,255,0.75)] text-sm">本产品已符合FCC、CE、RoSH等强制标准，并符合 ISO 13485 医疗器械质量管理体系标准。</p>
              </HeroAccordion>
            </div>
            
          </div>
        </div>
      </div>`;

const startTag = "      {/* Configurator Section */}";
const endTag = "      {/* SECTION 2: PRODUCT STORY (REWRITTEN) */}";

const sIdx = content.indexOf(startTag);
const eIdx = content.indexOf(endTag);

if (sIdx === -1 || eIdx === -1) {
    console.log("Cannot find tags");
    process.exit(1);
}

const lightboxJSX = `

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex justify-center items-center p-8 cursor-zoom-out"
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedColor.img}
              className="max-w-full max-h-full object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
`;

let after = content.substring(eIdx);
// Find the last </div> before export default StorePage;
const endingRegex = /    <\/div>\s*?\);\s*?};\s*?export default StorePage;/;
if (endingRegex.test(after)) {
    after = after.replace(endingRegex, lightboxJSX + "\n    </div>\n  );\n};\n\nexport default StorePage;");
} else {
    // try fall back
    after += lightboxJSX;
}

const accordionComponent = `
const HeroAccordion: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({title, children, defaultOpen = false}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[rgba(255,255,255,0.06)]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-white hover:text-[#C8FF00] transition-colors"
      >
        <span className="text-[14px] font-medium">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

`;

if (!content.includes('const HeroAccordion')) {
    content = content.replace("const StorePage = () => {", accordionComponent + "const StorePage = () => {");
}

let finalContent = content.substring(0, content.indexOf(startTag)) + newHero + "\n" + after;

fs.writeFileSync('src/pages/StorePage.tsx', finalContent);
console.log('Replaced successfully');
