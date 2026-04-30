import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, animate, useInView } from 'motion/react';
import { Shield, RefreshCw, Lock, ZoomIn, Check, Search, User, ShoppingCart, X, Plus, Minus, Star, ChevronDown, Box, Battery, Zap, ShieldCheck, FileText, Circle, Activity, Eye, Watch as WatchIcon } from 'lucide-react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import FooterSections from '../components/FooterSections';
import { useLocalePath } from '../hooks/useLocalePath';

const categories = [
  { 
    id: 'ring', 
    name: '智能戒指', 
    icon: Circle, 
    path: '/store/ring',
    img: 'https://i.ibb.co/JWDBKFgn/image.png',
    variants: [
      { 
        name: '轻量基础款', 
        img: 'https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png',
        colors: [
          { id: 'titanium', name: '钛金银', hex: '#E8E8E4', img: 'https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png', price: 349 },
          { id: 'obsidian', name: '墨影黑', hex: '#1A1A1A', img: 'https://i.ibb.co/zTQKV09Y/jimeng-2026-04-20-2515.png', price: 349 },
          { id: 'gold', name: '璀璨金', hex: '#E5C282', img: 'https://i.ibb.co/8Djdy2VY/jimeng-2026-04-20-2444.png', price: 349 }
        ]
      },
      { 
        name: '乐于运动款', 
        img: 'https://i.ibb.co/RTWNCcfq/175b79bdbb6542288e13cb040345e1b9.png',
        colors: [
          { id: 'ice-blue', name: '冰地蓝', hex: '#A5CAD2', img: 'https://i.ibb.co/RTWNCcfq/175b79bdbb6542288e13cb040345e1b9.png', price: 349 },
          { id: 'ultra-black', name: '极黑境', hex: '#0A0A0A', img: 'https://i.ibb.co/QvpYH5t5/image.png', price: 349 },
          { id: 'white', name: '无垠白', hex: '#F5F5F5', img: 'https://i.ibb.co/4n0WTsxF/image.png', price: 349 },
          { id: 'pink', name: '嫩霞粉', hex: '#E7B1B6', img: 'https://i.ibb.co/G43Fy2S7/image.png', price: 349 }
        ]
      },
      { 
        name: '健康时尚款', 
        img: 'https://i.ibb.co/N28C7vWs/2.png',
        colors: [
          { id: 'rose-gold', name: '玫瑰金', hex: '#CAA193', img: 'https://i.ibb.co/N28C7vWs/2.png', price: 349 },
          { id: 'liquid-silver', name: '流光银', hex: '#D1D1D1', img: 'https://i.ibb.co/sd1WxmPR/1.png', price: 349 },
          { id: 'afterglow-gold', name: '余晖金', hex: '#C9A96E', img: 'https://i.ibb.co/pBPwm45s/5.png', price: 349 }
        ]
      },
      { name: '唯一定制款', img: 'https://i.ibb.co/3mM22753/6.png' }
    ]
  },
  { 
    id: 'bracelet', 
    name: '智能手环', 
    icon: Activity,
    path: '/store/bracelet',
    img: 'https://i.ibb.co/tP4mcmbJ/image.png',
    variants: [
      { 
        name: '尼龙编织款', 
        img: 'https://i.ibb.co/CpcxK2Tn/image.png',
        colors: [
          { id: 'black-stone', name: '黑岩织', hex: '#1A1A1A', img: 'https://i.ibb.co/tP4mcmbJ/image.png', price: 349 },
          { id: 'white-silk', name: '白素绕', hex: '#F5F5F5', img: 'https://i.ibb.co/KcH37hPf/image.png', price: 349 },
          { id: 'glow-pink', name: '绯光粉', hex: '#E7B1B6', img: 'https://i.ibb.co/20GJBwQg/image.png', price: 349 },
          { id: 'vibrant-green', name: '活力绿', hex: '#84C8A1', img: 'https://i.ibb.co/zVVzjQrT/image.png', price: 349 }
        ]
      },
      { 
        name: '氟橡胶款', 
        img: 'https://i.ibb.co/R4dhDPqm/image.png',
        colors: [
          { id: 'titanium-gray', name: '钛影灰', hex: '#8E8E93', img: 'https://i.ibb.co/R4dhDPqm/image.png', price: 349 },
          { id: 'deep-black', name: '深潜黑', hex: '#1C1C1E', img: 'https://i.ibb.co/XxLppHSM/image.png', price: 349 },
          { id: 'quiet-blue', name: '静谧蓝', hex: '#003366', img: 'https://i.ibb.co/5XZ5pBNj/image.png', price: 349 },
          { id: 'force-cyan', name: '原力青', hex: '#00CCCC', img: 'https://i.ibb.co/YBfXxfr3/image.png', price: 349 }
        ]
      },
      { 
        name: '小牛皮款', 
        img: 'https://i.ibb.co/B2hd20Gs/b74a3d2c6aed46188e21855acb0e0dbc.png',
        colors: [
          { id: 'brown-chestnut', name: '棕栗皮', hex: '#8B4513', img: 'https://i.ibb.co/sd1WxmPR/1.png', price: 349 },
          { id: 'old-money', name: '老钱硬花纹', hex: '#D2B48C', img: 'https://i.ibb.co/Zzh63Kwy/5c980fca41cb4593ad9e4fed6b0dd0a7.png', price: 349 },
          { id: 'nostalgic', name: '怀旧周纹', hex: '#A0522D', img: 'https://i.ibb.co/R4jDFqqN/6dc51ff0ace54bc0a7d1bf3edf6d49a1.png', price: 349 }
        ]
      },
      { name: '金属定制款', img: 'https://i.ibb.co/SDKfLXfZ/e8ff86b611a34c178ee5dac824aee44c.png' }
    ]
  },
  { 
    id: 'glasses', 
    name: '智能眼镜', 
    icon: Eye,
    path: '/store/glasses',
    img: 'https://i.ibb.co/gbpwCydx/a618c6efdd3c4e599a9b760453c224ac.png',
    variants: [
      { name: '曜石黑款', img: 'https://i.ibb.co/rGW9YTxB/add77e1262284ac6b7b326b595287950.png' },
      { name: '玳瑁款', img: 'https://i.ibb.co/gZxQKngB/20260415-091854.png' },
      { name: '透明款', img: 'https://i.ibb.co/BHZGC9cC/0280a44aee6c48cb88c79cdd896e57a4.png' }
    ]
  },
  { 
    id: 'watch', 
    name: '智能手表', 
    icon: WatchIcon,
    path: '/store/watch',
    img: 'https://i.ibb.co/jZT4DZJj/b74a3d2c6aed46188e21855acb0e0dbc.png',
    variants: [
      { name: '都市时尚款', img: 'https://i.ibb.co/N6LCbCbD/3e6aebe9de19401a9c2325b84b7176e9.png' },
      { name: '专业竞技运动款', img: 'https://i.ibb.co/kvz4DKh/066bac84729a49459b19356986519b7f.png' },
      { name: '户外冒险款', img: 'https://i.ibb.co/fdtdT6DQ/e00cf1c181104ebbb772bf22b69b17cf.png' },
      { name: '巅峰私域定制款', img: 'https://i.ibb.co/HTtnDg61/71bf0861d49d4221b7bf98f8a3922a1e.png' }
    ]
  }
];

const colors = [
  { id: 'obsidian', name: '墨影黑', enName: 'Obsidian', price: 349, img: 'https://i.ibb.co/JWDBKFgn/image.png' },
  { id: 'titanium', name: '钛金银', enName: 'Titanium', price: 299, img: 'https://i.ibb.co/gbpwCydx/a618c6efdd3c4e599a9b760453c224ac.png' },
  { id: 'liquid-gold', name: '流光金', enName: 'Liquid Gold', price: 449, img: 'https://i.ibb.co/3mM22753/6.png' },
  { id: 'rose-gold', name: '玫瑰金', enName: 'Rose Gold', price: 549, img: 'https://i.ibb.co/sd1WxmPR/1.png' }
];

const allFaqs: Record<string, { q: string, a: string }[]> = {
  ring: [
    { q: '如何找到适合我的戒圈尺寸？', a: '提供专用量指纸条（随货附赠），或使用App内的尺寸测量功能，通过手机摄像头辅助测量。' },
    { q: '电池寿命多久？多久充一次电？', a: '标准使用模式下续航约7天。磁吸充电底座充满约需90分钟，建议每周充电一次，养成固定习惯。' },
    { q: '如何连接到我的手机？', a: '下载 AwakHealth App（iOS/Android），打开蓝牙后按照App引导完成配对，全程约3分钟。' },
    { q: '支持哪些手机系统？', a: 'iOS 14 及以上版本 / Android 8.0 及以上版本。部分旧款机型功能受限，建议在下单前确认兼容性。' },
    { q: '可以游泳或洗澡时佩戴吗？', a: '可以。AWAK Ring 达到 IP68 防水等级，可在水深30米以内安全使用，支持游泳、淋浴等日常涉水场景。' },
    { q: '可以以旧换新吗？', a: '支持。参与「AWAK Trade-in」计划，旧款设备抵扣最高¥200，具体折扣以活动页面为准。' }
  ],
  bracelet: [
    { q: '什么是恢复评分？', a: '基于睡眠、HRV与心率计算的每日身体恢复状态' },
    { q: '是否需要每天充电？', a: '一般可连续使用 4–5 天' },
    { q: '是否可以24小时佩戴？', a: '支持全天候连续佩戴' },
    { q: '是否防水？', a: '支持日常防汗与运动使用（具体等级视版本）' },
    { q: '是否适合运动使用？', a: '支持日常训练与运动负荷分析' },
    { q: '是否必须连接手机？', a: '建议连接 App 获取完整分析能力' }
  ],
  glasses: [
    { q: '是否适合听障用户？', a: '是，核心支持实时语音转文字与手语辅助沟通' },
    { q: '是否适合视障用户？', a: '是，支持文字朗读与环境声音提示' },
    { q: '是否需要手机？', a: '建议连接App以获得完整功能体验' },
    { q: '是否支持翻译功能？', a: '支持多语言实时翻译' },
    { q: '是否可以日常佩戴？', a: '支持全天佩戴设计' },
    { q: '是否能识别环境危险声音？', a: '可识别部分关键环境声音并提示用户' }
  ],
  watch: [
    { q: '如何选择适合我的型号？', a: '根据运动类型（跑步 / 户外 / 铁三 / 健身）选择对应版本' },
    { q: '续航多久？', a: '依模式不同，5 天至 20 天不等' },
    { q: '是否支持游泳或潜水？', a: '支持（最高 10ATM 级别）' },
    { q: '是否需要手机？', a: '建议连接 App 获取完整分析能力' },
    { q: '是否支持专业训练？', a: '支持结构化训练与运动数据分析' },
    { q: '是否适合日常佩戴？', a: '支持全天候健康监测与日常使用' }
  ]
};

const reviews = [
  { 
    name: '陈**', location: '上海', rating: 5, date: '2024年11月',
    title: '真的救了我',
    text: '入睡困难困扰了我三年，戴上Ring之后才发现我的深度睡眠只有12%，完全不达标。按照App的建议调整了睡眠习惯，三个月后深睡占比提到了26%，每天早上清醒多了。不夸张，是我买过最值的东西。',
    productInfo: '已购：AWAK Ring · 星耀黑 · US 8',
    useful: 26, avatarBg: '#C8FF00'
  },
  { 
    name: '林**', location: '杭州', rating: 5, date: '2024年10月',
    title: '设计太好看了',
    text: '设计太好看了，比我预期的还要细腻。最惊喜的是它真的不存在感，戴久了忘记它在手上，但数据一直在跑。健身房的教练看到我的训练数据都说比很多专业运动员的复盘还细。',
    productInfo: '已购：AWAK Ring · 星耀黑 · US 6',
    useful: 14, avatarBg: '#22C97A'
  },
  { 
    name: '赵**', location: '北京', rating: 4, date: '2024年9月',
    title: '各方面都很满意',
    text: '各方面都很满意，扣一星是希望续航能再长一点。7天其实也够，但如果能到10天就完美了。硬件做工完全超出¥349的定位，充电底座也很有质感，放桌上也是装饰。',
    productInfo: '已购：AWAK Ring · 钛金银 · US 10',
    useful: 8, avatarBg: '#FFA800'
  }
];

const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.05] py-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left hover:opacity-70 transition-opacity">
        <span className="text-[18px] text-[#1D1D1F] font-bold">{q}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} className={isOpen ? "text-[#86868B]" : "text-[#86868B]"}>
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pt-4 text-[#86868B] text-[16px] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroAccordion: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({title, children, defaultOpen = false}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-white hover:text-white/60 transition-colors"
      >
        <span className="text-[14px] font-medium">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 opacity-50 text-white" />
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

export default function StorePage() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const { category } = useParams();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState(() => {
    if (category) {
      const found = categories.find(c => c.id === category);
      if (found) return found;
    }
    return categories[0];
  });

  useEffect(() => {
    if (category) {
      const found = categories.find(c => c.id === category);
      if (found) {
        setActiveCategory(found);
      }
    }
  }, [category]);

  useLayoutEffect(() => {
    // Force reset scroll position when entering/changing store routes.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rafId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [location.pathname]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [sizingOption, setSizingOption] = useState<'kit' | 'size'>('kit');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [carePlan, setCarePlan] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveThumb(0);
  }, [activeCategory]);

  useEffect(() => {
    const variantColors = (activeCategory as any).variants?.[activeThumb]?.colors;
    if (variantColors && variantColors.length > 0) {
      setSelectedColor(variantColors[0]);
    } else if (!variantColors && activeCategory.id !== 'ring') {
       // Fallback for other categories if they don't have variant colors yet
       setSelectedColor(colors[0]);
    }
  }, [activeThumb, activeCategory]);

  // Calculate total
  let total = selectedColor.price;
  if (carePlan === 2) total += 45;
  if (carePlan === 3) total += 60;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden pb-[100px] md:pb-[88px] relative">
      {/* FIXED SIDE NAVIGATION (DESKTOP) */}
      <div className="hidden md:flex fixed left-10 top-1/2 -translate-y-1/2 w-[140px] bg-[#000000]/80 backdrop-blur-xl flex-col items-center py-8 gap-6 z-[100] rounded-[24px]">
        <div className="flex flex-col items-center gap-2 w-full px-4">
          {categories.map(cat => {
            const isActive = activeCategory.id === cat.id;
            return (
              <Link
                key={cat.id}
                to={withPath(cat.path)}
                className={`w-full py-3 px-4 rounded-xl text-[14px] font-medium tracking-wide transition-all duration-300 text-center ${isActive ? 'text-white bg-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* TOP NAVIGATION FOR MOBILE ONLY (Horizontal scroll) */}
      <div className="md:hidden bg-[#000000]/80 backdrop-blur-md border-b border-white/5 sticky top-[72px] z-[40] px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all ${activeCategory.id === cat.id ? 'bg-[#FFFFFF] text-[#000000]' : 'text-white/60 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* STICKY AD-TO-CART BAR */}
      <div className={`fixed top-0 left-0 right-0 h-[72px] bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.06)] z-[9998] flex items-center justify-between px-6 md:px-[170px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm lg:text-base text-white">{activeCategory.name}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg text-white">¥{total.toFixed(2)}</span>
          <button onClick={() => setIsCartOpen(true)} className="px-8 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full transition-all flex items-center justify-center">
            加入购物车
          </button>
        </div>
      </div>

      {/* Configurator Section - PRODUCT HERO REWRITTEN */}
      <div className="flex flex-col md:flex-row relative bg-[#000000]">
        
        <div ref={heroRef} className="flex-1 flex flex-col md:flex-row relative min-h-screen">
          
          {/* LEFT: Product Images (55%) */}
        <div className="w-full md:w-[55%] flex flex-col relative z-10 px-8 py-[var(--block-gap)] items-center justify-center">
          <div className="w-full max-w-[500px] aspect-square relative flex items-center justify-center cursor-zoom-in group" onClick={() => setIsLightboxOpen(true)}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeCategory.id + selectedColor.id + activeThumb}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                src={((activeCategory as any).variants?.[activeThumb]?.colors) ? (selectedColor.img || (activeCategory as any).variants?.[activeThumb]?.img || activeCategory.img) : ((activeCategory as any).variants?.[activeThumb]?.img || activeCategory.img)} 
                alt={activeCategory.name} 
                className="w-full h-full object-contain filter drop-shadow-[0_10px_40px_rgba(200,255,0,0.1)]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* 360° Indicator */}
            <div className="absolute bottom-4 right-4 bg-white/10 text-white shadow-sm backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
              <RefreshCw className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs font-bold font-mono">360°</span>
            </div>
            
            {/* Hover hint */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white shadow-sm backdrop-blur-md p-2 rounded-full border border-white/10 pointer-events-none">
              <ZoomIn className="w-5 h-5 text-white/70" />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-8">
            {((activeCategory as any).variants || []).map((v: any, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveThumb(idx)}
                className={`w-[80px] h-[80px] rounded-lg overflow-hidden border ${activeThumb === idx ? 'border-white' : 'border-white/10 opacity-50 hover:opacity-100'} transition-all`}
              >
                <img src={v.img} className="w-full h-full object-contain bg-white/5" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Purchasing Info (45%) */}
        <div className="w-full md:w-[45%] bg-[#000000] border-none relative text-[#FFFFFF]">
          <div className="md:sticky md:top-[var(--nav-height,64px)] md:h-[calc(100vh-var(--nav-height,64px))] overflow-y-auto px-8 md:px-12 lg:px-16 py-[var(--block-gap)] hide-scrollbar">
            
            {/* ① 产品标识行 */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-[length:var(--text-label)] text-[#6E6E73] tracking-[0.2em] uppercase">AWAK</span>
              <h1 className="text-[length:var(--text-h1)] font-bold text-[#FFFFFF] leading-[var(--leading-title)]">
                {(activeCategory as any).variants?.[activeThumb]?.name || `${activeCategory.name} AWAK`}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-white/80 text-white/80" />)}
                </div>
                <span className="text-[length:var(--text-small)] text-[#86868B] font-mono">4.9 (2,847条评价)</span>
              </div>
            </div>

            {/* ② 价格区 */}
            <div className="my-4 py-4 border-t border-b border-[rgba(255,255,255,0.08)] flex flex-col">
              <div className="flex items-baseline mb-1">
                <span className="text-[length:var(--text-hero)] font-[800] text-[#FFFFFF] tabular-nums leading-none">¥{total.toFixed(2)}</span>
                <span className="text-[length:var(--text-h3)] text-[#6E6E73] line-through ml-3 tabular-nums leading-none">¥{(total * 1.4).toFixed(2)}</span>
                <span className="bg-white/10 text-white text-[11px] font-bold px-2 py-[2px] rounded-[var(--r-sm)] ml-3 transform -translate-y-1">限时优惠</span>
              </div>
              <span className="text-[12px] text-[#86868B] tracking-tight">或每月仅需 ¥{(total / 3).toFixed(2)}，分3期免息</span>
            </div>

            {/* ③ 颜色选择器 */}
            {activeCategory.id === 'ring' && (activeCategory as any).variants?.[activeThumb]?.colors ? (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[13px] text-white/40">颜色</span>
                  <span className="text-[13px] text-white">{selectedColor.name}</span>
                </div>
                <div className="flex gap-4">
                  {(activeCategory as any).variants[activeThumb].colors.map((c: any) => {
                    const isSelected = selectedColor.id === c.id;
                    return (
                      <button 
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        className={`relative w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all ${isSelected ? 'border-2 border-white' : 'border border-transparent'}`}
                        style={{ padding: isSelected ? '4px' : '0px' }}
                      >
                        {isSelected && <div className="absolute inset-0 rounded-full border-2 border-[#080808] z-10" />}
                        <div 
                          className="w-full h-full rounded-full relative z-0" 
                          style={{ backgroundColor: c.hex, border: `1px solid rgba(255,255,255,0.1)` }} 
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : activeCategory.id === 'bracelet' && !((activeCategory as any).variants?.[activeThumb]?.name?.includes('定制款')) ? (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[13px] text-white/40">颜色</span>
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
                    const isSelected = selectedColor.id === c.id;
                    return (
                      <button 
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        className={`relative w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all ${isSelected ? 'border-2 border-white' : 'border border-transparent'}`}
                        style={{ padding: isSelected ? '4px' : '0px' }}
                      >
                        {isSelected && <div className="absolute inset-0 rounded-full border-2 border-[#080808] z-10" />}
                        <div 
                          className="w-full h-full rounded-full relative z-0" 
                          style={{ backgroundColor: hexMap[c.id] || '#555', border: `1px solid rgba(255,255,255,0.1)` }} 
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* ④ 尺寸选择器 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-white/40">戒圈尺寸</span>
                <button onClick={() => setIsSizeGuideOpen(true)} className="text-[13px] text-white/60 hover:underline">尺寸指南</button>
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
                      className={`relative h-10 rounded-full flex items-center justify-center text-sm font-mono transition-colors ${
                        outOfStock ? 'border border-white/10 text-white/25 cursor-not-allowed overflow-hidden' :
                        isSelected ? 'border-2 border-white bg-white/10 text-white font-bold' : 
                        'border border-white/15 bg-transparent text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {outOfStock && <div className="absolute w-[120%] h-[1px] bg-white/20 rotate-45" />}
                      US {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ⑤ CTA 操作区 */}
            <div className="flex flex-col gap-[var(--card-gap)] mb-6 mt-[var(--block-gap)]">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Box className="w-4 h-4 text-[#86868B]" />
                <span className="text-[length:var(--text-small)] text-[#86868B]">免费配送 · 30天无忧退换</span>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="bg-white/10 hover:bg-white/20 text-[#FFFFFF] px-8 py-4 rounded-full text-base font-bold shadow-none border-none transition-all w-full text-center">
                加入购物车
              </button>
              <button 
                onClick={() => navigate(withPath('/checkout'))} 
                className="bg-[#DDF700] hover:brightness-110 active:scale-[0.98] text-[#000000] text-base font-bold px-8 py-4 rounded-full shadow-xl transition-all w-full text-center"
              >
                立即购买
              </button>
            </div>

            {/* ⑥ 信任背书小图标栏 */}
            <div className="grid grid-cols-4 gap-2 mb-10 pt-8 border-t border-[rgba(255,255,255,0.08)]">
              {[
                { icon: Shield, text: '18个月质保' },
                { icon: RefreshCw, text: '30天退换' },
                { icon: Zap, text: '当日发货' },
                { icon: Lock, text: '数据加密' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 text-[#6E6E73]">
                  <item.icon className="w-6 h-6" strokeWidth={1.5} />
                  <span className="text-[11px] whitespace-nowrap">{item.text}</span>
                </div>
              ))}
            </div>

            {/* ⑦ 产品简介折叠（Accordion） */}
            <div className="border-t border-[rgba(255,255,255,0.08)]">
              <HeroAccordion title="产品简介" defaultOpen>
                <ul className="text-[#86868B] text-sm space-y-2 list-disc pl-4">
                  <li>航空级钛合金材质，重量仅 4.8g，无感佩戴</li>
                  <li>医疗级传感器阵列，7×24小时连续监测血氧及心率</li>
                  <li>最长 7 天超长续航，支持 50 米深度防水</li>
                </ul>
              </HeroAccordion>
              <HeroAccordion title="配送说明">
                <p className="text-[#86868B] text-sm">所有订单由顺丰速运免费配送，预计工作日内发货将在 1-3 天送达。如有延迟将另行通知。</p>
              </HeroAccordion>
              <HeroAccordion title="退换政策">
                <p className="text-[#86868B] text-sm">自您签收商品起 30 日内，如商品及包装完好（不影响二次销售），我们提供无理由退换货服务。</p>
              </HeroAccordion>
              <HeroAccordion title="产品证书">
                <p className="text-[#86868B] text-sm">本产品已符合FCC、CE、RoSH等强制标准，并符合 ISO 13485 医疗器械质量管理体系标准。</p>
              </HeroAccordion>
            </div>
            
          </div>
        </div>
      </div>
      </div>
      {/* SECTION 4: IN THE BOX (REWRITTEN) */}
      <section className="bg-[#F5F5F7] py-[60px] px-6 md:px-[170px] text-[#1D1D1F] overflow-hidden">
        <div className="max-w-[1700px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* LEFT: Large Image */}
            <div className="w-full md:w-[60%] px-10 reveal">
               <div className="relative w-full h-full">
                 <img 
                   src={activeCategory.id === 'bracelet' ? 'https://i.ibb.co/xS01Jf1z/image.png' : 'https://i.ibb.co/WvZDYkvK/image.png'} 
                   className="w-full h-auto scale-110 object-cover" 
                   alt="Packaging Large" 
                 />
               </div>
            </div>

            {/* RIGHT: Text Content */}
            <div className="w-full md:w-[40%] reveal" style={{ transitionDelay: '200ms' }}>
              <div className="mb-10">
                <h2 className="text-[length:var(--text-hero)] font-bold mb-4 tracking-tighter leading-[var(--leading-title)] text-[#1D1D1F]">每一件，<br/>都经过精心设计</h2>
                <p className="text-[#86868B] text-[length:var(--text-small)] tracking-[0.4em] uppercase font-bold">包装内容 IN THE BOX</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {activeCategory.id === 'bracelet' ? (
                  <>
                    <BoxItem icon={<Box size={24}/>} name="AWAK BRACELET × 1" desc="主机｜轻量化健康监测手环" />
                    <BoxItem icon={<Zap size={24}/>} name="磁吸充电模块 × 1" desc="专用充电方式｜支持全天候佩戴设计" />
                    <BoxItem icon={<ShieldCheck size={24}/>} name="质保卡 × 1" desc="官方质保服务（12–18个月，视地区）" />
                    <BoxItem icon={<FileText size={24}/>} name="快速上手指南 × 1" desc="中英双语说明｜含 App 下载与绑定指引" />
                  </>
                ) : activeCategory.id === 'watch' ? (
                  <>
                    <BoxItem icon={<Box size={24}/>} name="AWAK WATCH × 1" desc="主机｜按所选型号与尺寸交付" />
                    <BoxItem icon={<Zap size={24}/>} name="磁吸充电线 × 1" desc="专用充电接口｜快速磁吸充电" />
                    <BoxItem icon={<ShieldCheck size={24}/>} name="质保卡 × 1" desc="官方质保服务（18个月）" />
                    <BoxItem icon={<FileText size={24}/>} name="快速上手指南 × 1" desc="中英双语说明｜含 App 下载与连接指引" />
                  </>
                ) : activeCategory.id === 'glasses' ? (
                  <>
                    <BoxItem icon={<Box size={24}/>} name="无障碍智能眼镜 × 1" desc="轻量化佩戴设备｜支持听障与视障辅助功能" />
                    <BoxItem icon={<Zap size={24}/>} name="智能充电盒 × 1" desc="便携收纳 + 快速充电一体设计" />
                    <BoxItem icon={<ShieldCheck size={24}/>} name="质保卡 × 1" desc="官方质保服务（12–18个月）" />
                    <BoxItem icon={<FileText size={24}/>} name="快速上手指南 × 1" desc="中英双语说明｜含功能使用与连接引导" />
                  </>
                ) : (
                  <>
                    <BoxItem icon={<Box size={24}/>} name="AWAK Ring × 1" desc="本体，含所选颜色尺寸" />
                    <BoxItem icon={<Zap size={24}/>} name="触点充电仓 × 1" desc="支持无线充电，兼容Qi" />
                    <BoxItem icon={<ShieldCheck size={24}/>} name="质保卡 × 1" desc="18个月官方质保" />
                    <BoxItem icon={<FileText size={24}/>} name="快速上手指南 × 1" desc="中英双语，含App下载码" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HEALTH METRICS (REWRITTEN) */}
      <section className="bg-[#F5F5F7] py-16 px-6 md:px-[170px] text-[#1D1D1F] border-t-0">
        <div className="max-w-[1400px] mx-auto">
          {activeCategory.id === 'bracelet' ? (
            <>
              <div className="mb-24">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-black">
                银发守护 |早点，让一切都来得及
                </h2>
                <p className="text-[#86868B] text-lg md:text-xl max-w-2xl leading-relaxed">
                  从睡眠到压力，从恢复到训练负荷，持续理解你的身体节奏
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricsCard 
                  title="重启 · 活力状态" 
                  desc="读懂身体，每天焕新。" 
                  image="https://i.ibb.co/jk0RWMhz/51-Pinterest.jpg"
                />
                <MetricsCard 
                  title="守护 · 稳健心跳" 
                  desc="岁月平稳，长情陪伴。" 
                  image="https://i.ibb.co/jv8tXQWF/Pinterest.jpg"
                />
                <MetricsCard 
                  title="入梦 · 安稳长夜" 
                  desc="拆解好梦，清晨神清。" 
                  image="https://i.ibb.co/prBY18hj/Pinterest-2.jpg"
                />
                <MetricsCard 
                  title="知冷 · 细微体温" 
                  desc="细嗅冷暖，贴心关怀。" 
                  image="https://i.ibb.co/3mfPq5vc/Pinterest-3.jpg"
                />
                <MetricsCard 
                  title="宽心 · 舒压解忧" 
                  desc="抚平心绪，日子从容。" 
                  image="https://i.ibb.co/PvPyRWZF/Pinterest.png"
                />
                <MetricsCard 
                  title="记取 · 步履辛劳" 
                  desc="你的忙碌，它都懂。" 
                  image="https://i.ibb.co/jPMY04XN/Pinterest.webp"
                />
              </div>
            </>
          ) : activeCategory.id === 'watch' ? (
            <>
              <div className="mb-24">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-black">
                特殊关爱 |听视障人群伴身智能
                </h2>
                <p className="text-[#86868B] text-lg md:text-xl max-w-2xl leading-relaxed">
                  从日常健康到专业训练，持续理解你的身体变化
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricsCard 
                  title="守护 · 有力跳动" 
                  desc="心跳平稳，步履踏实。" 
                  image="https://i.ibb.co/811khWY/52-Pinterest-1.jpg"
                />
                <MetricsCard 
                  title="平衡 · 运动强度" 
                  desc="科学锻炼，动静适宜。" 
                  image="https://i.ibb.co/dJrPsLVG/52-Pinterest-2.jpg"
                />
                <MetricsCard 
                  title="守候 · 呼吸纯净" 
                  desc="氧气充盈，精神饱满。" 
                  image="https://i.ibb.co/5gpRK6nk/52-Pinterest.png"
                />
                <MetricsCard 
                  title="记取 · 活力瞬间" 
                  desc="身随心动，自如记录。" 
                  image="https://i.ibb.co/0LRvDN8/Relojes-Select-1.jpg"
                />
                <MetricsCard 
                  title="找回 · 身体平衡" 
                  desc="舒缓心绪，蓄满能量。" 
                  image="https://i.ibb.co/4nYTvVS1/Relojes-Select-2.jpg"
                />
                <MetricsCard 
                  title="勋章 · 每一滴汗" 
                  desc="点滴努力，皆是生命力。" 
                  image="https://i.ibb.co/tTVvkN26/Relojes-Select-3.jpg"
                />
              </div>
            </>
          ) : activeCategory.id === 'glasses' ? (
            <>
              <div className="mb-24">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-black">
                特殊关爱|听视障人群伴身智能
                </h2>
                <p className="text-[#86868B] text-lg md:text-xl max-w-2xl leading-relaxed">
                  信息不再阻断你，而是主动为你传达世界
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricsCard 
                  title="实时语音转文字" 
                  desc="对话内容实时转为文字显示，帮助听障用户清晰理解交流内容" 
                  image="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=80"
                />
                <MetricsCard 
                  title="手语识别转语音" 
                  desc="手语动作可被识别并转换为语音或文字，实现双向沟通" 
                  image="https://images.unsplash.com/photo-1577563908411-5077b6cd7024?w=800&auto=format&fit=crop&q=80"
                />
                <MetricsCard 
                  title="环境声音提醒" 
                  desc="识别门铃、警报、婴儿哭声等关键声音，通过震动与提示提醒用户" 
                  image="https://images.unsplash.com/photo-1512428559083-abd606332ec1?w=800&auto=format&fit=crop&q=80"
                />
                <MetricsCard 
                  title="文字识别朗读" 
                  desc="菜单、药品、路牌等文字内容可被自动识别并语音播报" 
                  image="https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80"
                />
                <MetricsCard 
                  title="实时语言翻译" 
                  desc="支持多语言对话实时翻译，帮助跨国沟通与日常交流" 
                  image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
                />
                <MetricsCard 
                  title="第一视角记录" 
                  desc="支持拍照与录像，记录日常与重要场景" 
                  image="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-24">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-[#000000]">
                年轻时尚| 指尖健康触手可及
                </h2>
                <p className="text-[#86868B] text-lg md:text-xl max-w-2xl leading-relaxed">
                  从心率到睡眠，从压力到血氧，AWAK 智能戒指持续追踪 50+ 项生理指标，让你成为最了解自己身体的人。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricsCard 
                  title="恢复评分" 
                  desc="听懂身体的告白，让能量焕然新生。"
                  image="https://i.ibb.co/Xx2Xx2Zv/Pinterest.jpg"
                />
                <MetricsCard 
                  title="睡眠分析" 
                  desc="拆解长夜的梦境，把好眠还给每一个清晨。"
                  image="https://i.ibb.co/6Rw4t5m5/Pinterest-2.jpg"
                />
                <MetricsCard 
                  title="血氧监测" 
                  desc="隐形的卫士，在静默呼吸间坚定守护。"
                  image="https://i.ibb.co/YTczBdNK/Pinterest-3.jpg"
                />
                <MetricsCard 
                  title="体温基线" 
                  desc="的起伏，是跨越昼夜的深情守护。"
                  image="https://i.ibb.co/1t1t2R2J/Pinterest-4.jpg"
                />
                <MetricsCard 
                  title="压力监测" 
                  desc="读懂紧绷的神经，在喧嚣中为你找回宁静。"
                  image="https://i.ibb.co/qFnRQ832/Pinterest.png"
                />
                <MetricsCard 
                  title="运动识别" 
                  desc="你的每一分投入，数据都感同身受。"
                  image="https://i.ibb.co/99PDHQDS/jimeng-2026-04-24-4023.png"
                />
              </div>
            </>
          )}

          {activeCategory.id === 'ring' && <MetricsAccordion />}
        </div>
      </section>

      {/* SECTION 5: SENSORS (REWRITTEN) */}
      <section className="bg-[#FFFFFF] py-16 px-6 md:px-[170px] border-none text-[#1D1D1F] overflow-hidden">
        <div className="max-w-[1400px] mx-auto bg-[#FFFFFF] shadow-[0_4px_40px_rgba(0,0,0,0.06)] rounded-[24px] p-8 lg:p-12">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#000000]">
              {activeCategory.id === 'bracelet' ? '多维生理感知系统' : 
               activeCategory.id === 'watch' ? '多频多星卫星定位系统' : 
               activeCategory.id === 'glasses' ? '多重感知辅助系统' : 
               '六核传感，精准从不将就'}
            </h2>
            <p className="text-[#1D1D1F] max-w-2xl leading-relaxed">
              {activeCategory.id === 'bracelet' ? '持续采集，构建你的身体模型' : 
               activeCategory.id === 'watch' ? '精准来自系统级协同感知' : 
               activeCategory.id === 'glasses' ? '让设备成为你的“第二感官”' : 
               'AWAK Ring 搭载医疗级传感器组合，每个传感器各司其职，共同构筑你身体的数字孪生。'}
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {activeCategory.id === 'bracelet' ? (
              <>
                <SensorCard title="光学心率传感器" subtitle="PPG" specs="多波长连续心率监测系统" usage="心率 / HRV / 压力 / 恢复分析" freq="高频连续监测（全天候）" />
                <SensorCard title="皮肤温度传感器" subtitle="" specs="高灵敏温度感知系统" usage="恢复趋势 / 疲劳监测 / 生理波动" freq="周期性自动采集" />
                <SensorCard title="加速度计" subtitle="IMU" specs="高精度运动识别系统" usage="活动识别 / 运动强度 / 行为分析" freq="连续采样" />
                <SensorCard title="融合算法系统" subtitle="" specs="多指标融合计算模型" usage="恢复评分 / 训练建议 / 状态预测" freq="算法实时计算" />
              </>
            ) : activeCategory.id === 'watch' ? (
              <>
                <SensorCard title="光学心率传感器" subtitle="PPG" specs="多波长光学心率监测系统" usage="心率 / HRV / 血氧 / 压力分析" freq="高频连续采样" />
                <SensorCard title="卫星定位系统" subtitle="GNSS" specs="多系统定位融合（GPS / 多星系统）" usage="轨迹记录 / 距离 / 配速分析" freq="高精度实时定位" />
                <SensorCard title="六轴加速度计" subtitle="IMU" specs="高精度运动感知系统" usage="运动识别 / 步态分析 / 动作捕捉" freq="100Hz 连续采样" />
                <SensorCard title="三轴陀螺仪" subtitle="Gyro" specs="高精度姿态感知系统" usage="姿态识别 / 运动稳定性分析" freq="100Hz 连续采样" />
              </>
            ) : activeCategory.id === 'glasses' ? (
              <>
                <SensorCard title="语音识别系统" subtitle="" specs="高精度语音捕捉与转换系统" usage="语音转文字 / 对话记录 / 实时字幕" freq="连续捕捉" />
                <SensorCard title="视觉识别系统" subtitle="" specs="图像与文字识别能力" usage="OCR文字读取 / 场景识别 / 物体识别" freq="实时识别" />
                <SensorCard title="环境声音识别系统" subtitle="" specs="关键声音检测与分类" usage="警报识别 / 提醒提示 / 安全感知" freq="背景实时检测" />
                <SensorCard title="多语言转换系统" subtitle="" specs="多语种实时转换能力" usage="跨语言交流 / 翻译辅助" freq="毫秒级转换" />
              </>
            ) : (
              <>
                <SensorCard title="光学心率传感器" subtitle="PPG" specs="波长：530nm绿光 + 940nm红外 双波长" usage="心率 / 血氧 / HRV / 压力" freq="256Hz 连续采样" />
                <SensorCard title="皮肤温度传感器" subtitle="" specs="精度：±0.1°C / 量程：20–45°C" usage="体温基线 / 月经周期 / 发烧预警" freq="每10分钟采集" />
                <SensorCard title="六轴加速度计" subtitle="IMU" specs="精度：±0.01g / 量程：±16g" usage="运动识别 / 步态分析 / 跌倒检测" freq="100Hz 连续采样" />
                <SensorCard title="三轴陀螺仪" subtitle="Gyro" specs="精度：±0.01°/s / 量程：±2000°/s" usage="姿态识别 / 运动轨迹 / 转速计算" freq="100Hz 连续采样" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 6: TECH SPECS (REWRITTEN) */}
      <section className="bg-[#F5F5F3] py-24 px-6 md:px-20 text-black">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">每一个参数，都服务于真实使用场景</h2>
          </div>
          <TechSpecsTable categoryId={activeCategory.id} />
        </div>
      </section>

      {/* SECTION 7: DATA COMPARISON (BEFORE vs AFTER) */}
      <section className="bg-[#080808] py-24 px-6 md:px-20 text-white border-t border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">90天后，你的身体会变得更显着不同</h2>
            <p className="text-white/40 text-sm">数据来源：AWAK 用户长期运动与健康追踪数据（模拟结构化整理）</p>
          </div>
          <ComparisonTable categoryId={activeCategory.id} />
        </div>
      </section>



      {/* SECTION 10: FAQ */}
      <section className="bg-[#E8E8ED] py-24 px-6 md:px-20 text-[#000000]">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16">
            <span className="text-[#86868B] font-bold text-sm tracking-widest uppercase mb-4 block">常见问题 FAQ</span>
            <h2 className="text-[#000000] text-4xl md:text-5xl font-bold">你可能想知道的</h2>
          </div>
          <div>
            {(allFaqs[activeCategory.id] || allFaqs.ring).map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <FooterSections />

      {/* MODULE 01: 核心价值 */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
        )}
        {isCartOpen && (
          <motion.div 
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed top-0 right-0 w-full md:w-[400px] h-screen bg-dark-01 shadow-2xl z-[70] flex flex-col text-brand-white border-l border-white/10"
          >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-thin text-brand-white">购物车</h2>
                <button onClick={() => setIsCartOpen(false)} className="hover:opacity-50 transition-opacity">
                  <X className="w-6 h-6 text-brand-white" />
                </button>
              </div>
              
              <div className="p-6 bg-accent/10 border-b border-accent/20 flex items-center justify-center">
                <span className="text-sm font-medium text-accent">轻松享受 一年会员资格</span>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-brand-black border border-white/5 flex items-center justify-center p-2 rounded-xl">
                    <img src={(activeCategory as any).variants?.[activeThumb]?.img || activeCategory.img} alt="Product" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-brand-white">{activeCategory.name}</span>
                      <span className="font-mono font-bold text-accent">¥{total.toFixed(2)}</span>
                    </div>
                    <span className="text-sm text-neutral-gray mt-1">{activeCategory.id === 'ring' ? selectedColor.enName : ''}</span>
                    <span className="text-sm text-neutral-gray">{sizingOption === 'kit' ? '免费指围套装' : `尺寸 ${selectedSize}`}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">小计</span>
                  <span className="font-mono text-xl font-bold">¥{total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => navigate(withPath('/checkout'))}
                  className="w-full bg-black text-white font-bold py-4 text-sm tracking-widest uppercase hover:bg-black/80 transition-colors rounded-none"
                >
                  去结账
                </button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSizeGuideOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[80] flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] w-full max-w-[640px] rounded-[20px] p-8 md:p-12 relative text-white"
            >
              <button 
                onClick={() => setIsSizeGuideOpen(false)} 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-3xl font-bold mb-4 text-[#FFFFFF]">尺寸指南</h3>
              <p className="text-[#86868B] mb-8 leading-relaxed">
                推荐使用纸条测量无名指根部最宽处，测量后对照下表。如果你的手指尺寸在两个码数之间，推荐选择较大一码。
              </p>
              
              <div className="w-full overflow-x-auto pb-4">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-[#6E6E73] text-left text-sm uppercase">
                      <th className="py-3 font-medium">AWAK Ring 尺寸</th>
                      <th className="py-3 font-medium">内径 (mm)</th>
                      <th className="py-3 font-medium">对应指围 (mm)</th>
                      <th className="py-3 font-medium">适合手指宽度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'US 6', d: '16.5', c: '51.8', t: '细手指' },
                      { size: 'US 7', d: '17.3', c: '54.4', t: '标准细' },
                      { size: 'US 8', d: '18.2', c: '57.1', t: '标准' },
                      { size: 'US 9', d: '19.0', c: '59.7', t: '标准粗' },
                      { size: 'US 10', d: '19.8', c: '62.2', t: '粗手指' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                        <td className="py-4 font-bold text-[#DDF700]">{row.size}</td>
                        <td className="py-4 font-mono text-[#E8E8ED]">{row.d}mm</td>
                        <td className="py-4 font-mono text-[#E8E8ED]">{row.c}mm</td>
                        <td className="py-4 text-[#86868B]">{row.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              src={(activeCategory as any).variants?.[activeThumb]?.img || selectedColor.img}
              className="max-w-full max-h-full object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const AnimatedCounter: React.FC<{ target: number, suffix?: string, isDecimal?: boolean, className?: string }> = ({ target, suffix = '', isDecimal = false, className }) => {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, { 
        duration: 2, 
        ease: "easeOut",
        onUpdate: (latest) => setValue(latest)
      });
      return () => controls.stop();
    }
  }, [target, isInView]);

  return <span ref={ref} className={className}>{isDecimal ? value.toFixed(1) : Math.round(value)}<span className="text-[0.5em]">{suffix}</span></span>;
};

const StoryScreen: React.FC<{
  side: "left" | "right";
  label: string;
  title: React.ReactNode;
  content: string;
  graphic: React.ReactNode;
}> = ({ side, label, title, content, graphic }) => {
  return (
    <div className="h-[100vh] sticky top-0 flex flex-col md:flex-row bg-[#080808] overflow-hidden">
      {side === "left" && (
        <div className="w-full md:w-1/2 h-half md:h-full flex items-center justify-center p-12 bg-black border-r border-white/5">
          {graphic}
        </div>
      )}
      <div className="w-full md:w-1/2 h-half md:h-full flex items-center p-12 md:p-24 relative z-10 bg-[#080808]">
        <div className="max-w-xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/40 font-bold text-sm tracking-widest uppercase mb-4 block"
          >
            {label}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tighter"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-xl leading-relaxed font-light"
          >
            {content}
          </motion.p>
        </div>
      </div>
      {side === "right" && (
        <div className="w-full md:w-1/2 h-half md:h-full flex items-center justify-center p-12 bg-black border-l border-white/5">
          {graphic}
        </div>
      )}
    </div>
  );
};

// --- HEALTH METRICS ---
const MetricsCard = ({ title, desc, tag, image }: { title: string, desc: string, tag?: string, image?: string }) => (
  <div className={`relative rounded-[24px] overflow-hidden flex flex-col justify-end p-8 group hover:-translate-y-1.5 transition-transform duration-300 ${image ? 'min-h-[300px]' : 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full'}`}>
    {image && (
      <>
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </>
    )}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <h3 className={`${image ? 'text-white' : 'text-black'} text-[24px] tracking-tight font-bold pr-2`}>{title}</h3>
        {tag && (
          <span className={`${image ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'} backdrop-blur-sm px-3 py-1 text-[13px] font-bold rounded-[var(--r-full)] tracking-wider shrink-0`}>
            {tag}
          </span>
        )}
      </div>
      <p className={`${image ? 'text-white/90' : 'text-[#86868B]'} text-[15px] leading-[var(--leading-body)]`}>{desc}</p>
    </div>
  </div>
);

const MetricsAccordion = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const categories = [
    { title: "心血管健康", items: ["静息心率 (RHR)", "心率变异率 (HRV)", "最大摄氧量 (VO₂ Max估算)", "恢复心率", "血氧饱和度 (SpO₂)", "心肺异常提醒"] },
    { title: "睡眠深度分析", items: ["睡眠总时长", "睡眠评分 (0-100)", "REM 快速眼动期比例", "深度睡眠比例", "入睡时间 / 醒来次数", "夜间呼吸率", "夜间皮肤温度基线偏差"] },
    { title: "活动与代谢", items: ["每日卡路里消耗 (基础+活动)", "步数与距离", "活动强度检测", "久坐提醒", "代谢当量 (METs)", "运动状态自动识别"] },
    { title: "身体与精神体征", items: ["全天压力指数", "恢复水平评分", "女性生理期预测", "基础体温趋势", "异常体征报警"] },
  ];
  return (
    <div className="mt-12">
      <div className="flex justify-center">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-8 py-4 bg-[#F5F5F7] hover:bg-[#E8E8ED] hover:scale-[1.02] text-[#000000] rounded-full transition-all font-bold text-base shadow-sm border-none"
        >
          查看全部 50+ 项指标
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={20} className="text-[#000000]" />
          </motion.div>
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((cat, i) => (
                <div key={i} className="bg-[#FFFFFF] p-8 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <h4 className="text-[#000000] text-[15px] font-bold mb-6 tracking-wide">{cat.title}</h4>
                  <ul className="flex flex-col gap-4">
                    {cat.items.map((item, j) => (
                      <li key={j} className="text-[#000000] leading-[1.6] flex items-start gap-3">
                        <div className="w-1.5 h-1.5 mt-2 bg-[#86868B] rounded-full shrink-0" />
                        <span className="text-[14px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- IN THE BOX ---
const BoxItem = ({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) => (
  <div className="bg-[#FFFFFF] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-none rounded-[24px] p-8 flex flex-col items-start text-left hover:scale-[1.02] transition-all">
    <div className="w-8 h-8 text-[#1D1D1F] mb-6">{icon}</div>
    <span className="text-[#000000] text-[24px] font-bold mb-2 tracking-tight">{name}</span>
    <span className="text-[#6E6E73] text-[length:var(--text-small)] leading-[var(--leading-body)]">{desc}</span>
  </div>
);

// --- SENSORS ---
const SensorCard: React.FC<{
  title: string;
  subtitle: string;
  specs: string;
  usage: string;
  freq: string;
}> = ({ title, subtitle, specs, usage, freq }) => (
  <div className="bg-[#FFFFFF] border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[var(--r-md)] min-w-[280px] md:min-w-[400px] w-[80vw] md:w-auto shrink-0 flex flex-col overflow-hidden snap-center hover:scale-[1.01] transition-all">
    <div className="h-40 bg-[rgba(0,0,0,0.02)] flex items-center justify-center p-6 relative">
       <div className="absolute inset-0 flex items-center justify-center">
         <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-[rgba(0,0,0,0.1)] fill-none stroke-2">
           <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
           <rect x="30" y="30" width="40" height="40" />
           <line x1="50" y1="10" x2="50" y2="90" />
           <line x1="10" y1="50" x2="90" y2="50" />
         </svg>
       </div>
    </div>
    <div className="p-[var(--card-pad)] flex flex-col gap-[var(--card-gap)]">
      <div>
        <h3 className="text-[length:var(--text-h3)] font-bold text-[#000000] mb-1">{title}</h3>
        <p className="text-[length:var(--text-small)] font-mono text-[#86868B]">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-4 text-[length:var(--text-small)] text-[#1D1D1F]">
        <div>
          <span className="block text-[#86868B] text-[length:var(--text-label)] mb-1 uppercase tracking-wider">技术规格</span>
          <p>{specs}</p>
        </div>
        <div>
          <span className="block text-[#86868B] text-[length:var(--text-label)] mb-1 uppercase tracking-wider">主要用途</span>
          <p>{usage}</p>
        </div>
        <div>
          <span className="block text-[#86868B] text-[length:var(--text-label)] mb-1 uppercase tracking-wider">采样频率</span>
          <p className="text-[#000000] font-mono">{freq}</p>
        </div>
      </div>
    </div>
  </div>
);

const TechSpecsTable = ({ categoryId }: { categoryId: string }) => {
  const braceletSpecs = [
    { k: '佩戴方式', v: '腕带式连续佩戴设计（7×24小时）', hint: '' },
    { k: '重量', v: '约 25–35g（极轻量设计）', hint: '' },
    { k: '材质', v: '医用级亲肤硅胶 / 高强度聚合材料', hint: '' },
    { k: '防水等级', v: '生活防水 / 训练防汗设计', hint: '' },
    { k: '续航时间', v: '约 4–5 天（连续使用）', hint: '' },
    { k: '充电方式', v: '磁吸充电模块', hint: '' },
    { k: '连接方式', v: 'Bluetooth 低功耗连接', hint: '' },
    { k: '工作温度', v: '-10°C 至 45°C', hint: '' },
    { k: '系统支持', v: 'iOS / Android（专属 App）', hint: '' }
  ];

  const watchSpecs = [
    { k: '材质', v: '高强度复合纤维 / 金属强化表圈（依型号不同）', hint: '' },
    { k: '重量', v: '约 30–80g（不同版本）', hint: '' },
    { k: '防水等级', v: '5ATM / 10ATM（支持游泳与潜水）', hint: '' },
    { k: '续航时间', v: '智能模式 5–20 天 / GPS模式 10–60 小时', hint: '' },
    { k: '充电方式', v: '磁吸充电', hint: '' },
    { k: '连接方式', v: 'Bluetooth + 低功耗运动协议', hint: '' },
    { k: '工作温度', v: '-20°C 至 60°C', hint: '' },
    { k: '系统兼容', v: 'iOS / Android（配套 App 使用）', hint: '' }
  ];

  const glassesSpecs = [
    { k: '重量', v: '约 49g（轻量佩戴设计）', hint: '' },
    { k: '佩戴方式', v: '日常眼镜式结构', hint: '' },
    { k: '显示方式', v: '透光信息提示（非遮挡式）', hint: '' },
    { k: '电池容量', v: '约 210mAh', hint: '' },
    { k: '续航时间', v: '日常使用可支持全天', hint: '' },
    { k: '充电方式', v: '智能充电盒', hint: '' },
    { k: '交互方式', v: '语音 / 按键 / 点头交互', hint: '' },
    { k: '声音系统', v: '定向私密音频输出', hint: '' },
    { k: '系统支持', v: 'iOS / Android（配套应用）', hint: '' }
  ];

  const ringSpecsCount = [
    { k: '重量', v: '约 5.0克', hint: '' },
    { k: '材质', v: '外层表面材质钛合金主体材质环氧树脂', hint: '' },
    { k: '续航时间', v: '连接蓝牙 4~7 天左右，具体根据使用频率而定', hint: '' },
    { k: '充电方式', v: '铝合金标配充电仓（USB额定5V）', hint: '' },
  ];

  const getSpecs = () => {
    switch (categoryId) {
      case 'bracelet': return braceletSpecs;
      case 'watch': return watchSpecs;
      case 'glasses': return glassesSpecs;
      default: return ringSpecsCount;
    }
  };

  const specs = getSpecs();

  return (
    <div className="w-full flex flex-col border-none text-sm md:text-base">
      <div className="flex bg-black text-white font-bold p-4 md:p-6">
        <div className="w-[30%] min-w-[100px]">规格项目</div>
        <div className="w-[70%]">参数值</div>
      </div>
      {specs.map((item, i) => (
        <div key={i} className={`flex p-4 md:p-6 items-center ${i % 2 === 0 ? 'bg-black/5' : 'bg-transparent'}`}>
          <div className="w-[30%] min-w-[100px] font-bold text-black">{item.k}</div>
          <div className="w-[70%] text-black/80">{item.v}{item.hint && <div className="text-black/40 text-[12px] mt-1">{item.hint}</div>}</div>
        </div>
      ))}
    </div>
  );
};

const ComparisonTable = ({ categoryId }: { categoryId: string }) => {
  const braceletData = [
    { title: '平均恢复评分', before: '52', after: '71', change: '+19 ▲', positive: true },
    { title: '静息心率', before: '68 bpm', after: '62 bpm', change: '-6 bpm ▼', positive: true },
    { title: 'HRV稳定性', before: '基准', after: '+20%', change: '+20% ▲', positive: true },
    { title: '睡眠质量评分', before: '62', after: '73', change: '+11 ▲', positive: true },
    { title: '日常压力波动', before: '基准', after: '-25%', change: '-25% ▼', positive: true }
  ];

  const watchData = [
    { title: '最大摄氧量 (VO₂ Max)', before: '38.5', after: '45.2', change: '+6.7 ▲', positive: true },
    { title: '静息心率', before: '72 bpm', after: '66 bpm', change: '-6 bpm ▼', positive: true },
    { title: '训练负荷稳定性', before: '基准', after: '+20%', change: '+20% ▲', positive: true },
    { title: '睡眠恢复评分', before: '65', after: '77', change: '+12 ▲', positive: true }
  ];

  const glassesData = [
    { title: '沟通理解效率', before: '基准', after: '+50%', change: '+50% ▲', positive: true },
    { title: '信息获取速度', before: '基准', after: '+40%', change: '+40% ▲', positive: true },
    { title: '跨语言沟通能力', before: '基准', after: '+60%', change: '+60% ▲', positive: true }
  ];

  const ringData = [
    { title: '深度睡眠占比', before: '18.4%', after: '22.7%', change: '+23% ▲', positive: true },
    { title: '静息心率', before: '72 bpm', after: '65 bpm', change: '-7 bpm ▼', positive: true },
    { title: '压力指数', before: '14.2天', after: '9.6天', change: '-32% ▲', positive: true },
    { title: 'VO₂Max有氧能力', before: '38.2', after: '45.1', change: '+18% ▲', positive: true }
  ];

  const getData = () => {
    switch (categoryId) {
      case 'bracelet': return braceletData;
      case 'watch': return watchData;
      case 'glasses': return glassesData;
      default: return ringData;
    }
  };

  const data = getData();

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto pb-8">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-white/20 text-white/60">
              <th className="py-4 font-normal">改善指标</th>
              <th className="py-4 font-normal">使用前</th>
              <th className="py-4 font-normal text-white">使用90天后</th>
              <th className="py-4 font-normal text-right">提升幅度</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-white/10 group hover:bg-white/5 transition-colors">
                <td className="py-6 font-medium text-white">{row.title}</td>
                <td className="py-6 font-mono text-white/50">{row.before}</td>
                <td className="py-6 font-mono text-white font-bold">{row.after}</td>
                <td className="py-6 font-mono font-bold text-right text-white italic">{row.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CertCard = ({ name, inst, desc }: { name: string, inst: string, desc: string }) => (
  <div className="flex flex-col text-center items-center">
    <span className="w-12 h-12 bg-black/5 text-[#080808] rounded-full flex items-center justify-center font-bold text-xl mb-4">✓</span>
    <h4 className="font-bold text-lg mb-1">{name}</h4>
    <span className="text-xs font-mono text-[#080808]/50 mb-3 block">{inst}</span>
    <p className="text-sm text-[#080808]/60 leading-relaxed max-w-[240px]">{desc}</p>
  </div>
);