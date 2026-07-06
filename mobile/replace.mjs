import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/pages/StorePage.tsx', 'utf-8');

const targetStart = "      {/* SECTION 7: DATA COMPARISON (BEFORE vs AFTER) */}";
const targetEnd = "      {/* MODULE 01: 核心价值 */}";

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find delimiters");
  process.exit(1);
}

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);

const newReplacement = `      {/* SECTION 7: DATA COMPARISON (BEFORE vs AFTER) */}
      <section className="bg-[#080808] py-32 px-6 md:px-20 text-white border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20 text-center md:text-left">
            <span className="text-[#C8FF00] font-bold text-sm tracking-widest uppercase mb-4 block">真实改变 REAL CHANGE</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">90天后，你的身体会说话</h2>
            <p className="text-white/40 text-sm">数据来源：2024年 AWAK Ring 用户9周使用报告（N=3,842）</p>
          </div>
          <ComparisonTable />
        </div>
      </section>

      {/* SECTION 8: ACCESSORIES */}
      <section className="bg-[#0F0F0F] py-32 px-6 md:px-20 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <span className="text-[#C8FF00] font-bold text-sm tracking-widest uppercase mb-4 block">完整你的生态 COMPLETE YOUR ECOSYSTEM</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">配合使用，体验更完整</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            <AccessoryCard
              name="Awak Health Premium 会员"
              desc="AI 深度解读 / 365天数据历史 / 家庭版支持"
              price="¥39/月"
              action="立即订阅"
            />
            <AccessoryCard
              name="AWAK Ring 备用充电底座"
              desc="第二个家 / 办公室备用 / 便携旅行充电"
              price="¥89"
              action="加入购物车"
            />
            <AccessoryCard
              name="AWAK Ring 升级服务包"
              desc="意外损坏保障 / 快速换新 / 一年两次免费检测"
              price="¥199/年"
              action="了解详情"
            />
          </div>
        </div>
      </section>

      {/* SECTION 9: PRESS & AWARDS */}
      <section className="bg-[#F5F5F3] py-32 px-6 md:px-20 text-[#080808]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          <span className="text-[#080808] font-bold text-sm tracking-widest uppercase mb-4 block text-center">他们也在说 AS SEEN IN</span>
          <h2 className="text-4xl font-bold mb-16 text-center">「精准，是一种承诺」</h2>
          
          <div className="flex flex-wrap justify-center gap-12 mb-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['36氪', '虎嗅', '少数派', 'The Verge', 'Wired', 'TechCrunch'].map((press, i) => (
              <span key={i} className="text-2xl font-black uppercase tracking-tighter hover:text-black transition-colors">{press}</span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-black/10 pt-16">
            <CertCard name="CE 医疗器械认证" inst="欧盟 European Commission" desc="欧盟市场准入，符合MDR医疗器械规范" />
            <CertCard name="FDA 注册" inst="美国 FDA" desc="健康监测类可穿戴设备注册号" />
            <CertCard name="ISO 13485 认证" inst="国际标准化组织" desc="医疗器械质量管理体系认证" />
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ */}
      <section className="bg-[#080808] py-32 px-6 md:px-20 text-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16">
            <span className="text-[#C8FF00] font-bold text-sm tracking-widest uppercase mb-4 block">常见问题 FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold">你可能想知道的</h2>
          </div>
          <div>
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* SECTION 11: REVIEWS (REWRITTEN) */}
      <section className="bg-[#080808] py-32 px-6 md:px-20 text-white border-t border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-6">
                <span className="text-[96px] font-black leading-none text-white tracking-tighter">4.9</span>
                <div className="flex flex-col gap-2 pb-3">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-[#C8FF00] text-[#C8FF00]" />)}
                  </div>
                  <span className="text-white/50 text-sm">基于 2,847 条评价</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-[400px]">
              {[
                { star: 5, pct: '92%' },
                { star: 4, pct: '6%' },
                { star: 3, pct: '1%' },
                { star: 2, pct: '0%' },
                { star: 1, pct: '1%' }
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-mono text-white/50">
                  <span>{bar.star}星</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C8FF00]" style={{ width: bar.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-8 border-b border-white/10 overflow-x-auto hide-scrollbar">
             {['全部', '5星', '4星', '有图片', '已验证购买'].map((tab, i) => (
               <button key={i} className={\`pb-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 \${i === 0 ? 'text-white border-[#C8FF00]' : 'text-white/50 border-transparent hover:text-white'}\`}>
                 {tab}
               </button>
             ))}
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map((review, i) => (
              <div key={i} className="break-inside-avoid bg-[#1A1A1A] p-[28px] rounded-[16px] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#080808]" style={{ backgroundColor: review.avatarBg }}>
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm flex items-center gap-2">
                        {review.name}
                        <span className="bg-[#22C97A]/20 text-[#22C97A] text-[10px] px-2 py-0.5 rounded-sm ml-2">已验证购买</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className={\`w-[14px] h-[14px] \${j < review.rating ? 'fill-[#C8FF00] text-[#C8FF00]' : 'fill-white/10 text-transparent'}\`} />)}
                </div>

                <div>
                  <h4 className="text-white font-bold text-[16px] mb-2">{review.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-4">{review.text}</p>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-white/[0.35] text-[12px]">{review.productInfo}</span>
                  <span className="text-white/[0.35] text-[12px]">{review.date}</span>
                </div>

                <div className="flex items-center justify-start mt-2 border-t border-white/5 pt-4">
                  <button className="text-left text-white/40 text-[12px] hover:text-[#C8FF00] transition-colors">
                    👍 {review.useful}人觉得有用
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-full transition-colors shadow-none">全览剩余 2,844 条评价</button>
          </div>
        </div>
      </section>

      {/* SECTION 12: YOU MAY ALSO LIKE */}
      <section className="bg-[#080808] py-32 px-6 md:px-20 text-white border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 text-center md:text-left">
            <span className="text-[#C8FF00] font-bold text-sm tracking-widest uppercase mb-4 block">同系列产品 COMPLETE THE COLLECTION</span>
            <h2 className="text-4xl md:text-5xl font-bold">与 AWAK Ring 完美搭配</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] rounded-[16px] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-white/5">
              <div className="aspect-[4/3] bg-[#1A1A1A] flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="relative z-10 text-white/30 tracking-widest text-sm font-bold uppercase">AWAK Watch</span>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2 text-white">AWAK Watch</h3>
                <p className="text-[#C8FF00] font-mono mb-4 text-sm">全场景运动追踪</p>
                <p className="text-white/50 text-sm mb-8 h-10">GPS + 大屏 + 100+运动模式，户外首选</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg font-mono text-white">¥1,299</span>
                  <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-[#C8FF00] transition-colors">查看详情</button>
                </div>
              </div>
            </div>

            <div className="bg-[#111] rounded-[16px] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-white/5">
              <div className="aspect-[4/3] bg-[#1A1A1A] flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="relative z-10 text-white/30 tracking-widest text-sm font-bold uppercase">AWAK Band</span>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2 text-white">AWAK Band</h3>
                <p className="text-[#C8FF00] font-mono mb-4 text-sm">日常轻薄首选</p>
                <p className="text-white/50 text-sm mb-8 h-10">超薄8.9mm + 10天续航 + 心率血氧</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg font-mono text-white">¥199</span>
                  <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-[#C8FF00] transition-colors">查看详情</button>
                </div>
              </div>
            </div>

            <div className="bg-[#111] rounded-[16px] overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-white/5">
              <div className="aspect-[4/3] bg-[#1A1A1A] flex items-center justify-center p-8 relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <span className="relative z-10 text-white/30 tracking-widest text-sm font-bold uppercase">Premium AI</span>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2 text-white">Awak Health Premium</h3>
                <p className="text-[#C8FF00] font-mono mb-4 text-sm">解锁AI深度分析</p>
                <p className="text-white/50 text-sm mb-8 h-10">Ring数据配合AI解读，效果提升3×</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg font-mono text-white">¥39<span className="text-xs text-white/50">/月</span></span>
                  <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-[#C8FF00] transition-colors">立即升级</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
\n`;

writeFileSync('src/pages/StorePage.tsx', before + newReplacement + after);
console.log('Fixed successfully');
