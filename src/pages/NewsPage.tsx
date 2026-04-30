import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Search, ChevronRight, ArrowRight, Download, Mail, Share2, X, Plus } from 'lucide-react';
import FooterSections from '../components/FooterSections';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';

// --- Types & Constants ---
type Category = 'ALL' | 'BRAND' | 'LAUNCH' | 'INSIGHTS' | 'PRESS' | 'STORIES';

interface Article {
  id: string;
  category: Category;
  tag: string;
  title: string;
  subtitle?: string;
  summary?: string;
  img: string;
  date: string;
  readingTime: string;
  author: string;
  authorAvatar?: string;
  tags?: string[];
  content?: React.ReactNode;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: '001',
    category: 'BRAND',
    tag: '品牌动态 BRAND',
    title: '一个正在加速扩张的健康感知时代',
    subtitle: '智能穿戴不再只是设备，而正在成为人与身体之间的连接系统。',
    summary: '智能穿戴不再只是设备，而正在成为人与身体之间的连接系统。随着需求增长与技术成熟，行业正从单点监测走向全周期健康管理的新阶段',
    img: 'https://i.ibb.co/DPCgLWM0/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring.jpg',
    date: '2026.12.01',
    readingTime: '6分钟',
    author: 'AWAK 编辑部',
    authorAvatar: 'https://i.pravatar.cc/150?u=awak1',
    tags: ['里程碑', '行业趋势', '健康系统', '感知未来'],
  },
  {
    id: '002',
    category: 'LAUNCH',
    tag: '新品发布 LAUNCH',
    title: 'AWAK Ring Gen 2 发布：更薄、更准、续航翻倍',
    summary: '第二代智能戒指传感器精度提升40%，厚度减少0.3mm，电池续航从7天延长至10天。',
    img: 'https://i.ibb.co/Myn1FPYF/Oura-Ring-der-Smart-Ring-fu-r-Fitness-Stress-Schlaf-und-Gesundheit.png',
    date: '2024.11.20',
    readingTime: '5分钟',
    author: 'AWAK 产品部'
  },
  {
    id: '003',
    category: 'INSIGHTS',
    tag: '行业洞察 INSIGHTS',
    title: '中国城市白领睡眠危机：8000万人正在慢性睡眠剥夺中',
    summary: '我们分析了过去一年100万用户的睡眠数据，发现了一个令人担忧的全国性趋势。',
    img: 'https://i.ibb.co/jvdwpsVj/jimeng-2026-04-03-1901-1-logo.png',
    date: '2024.11.15',
    readingTime: '8分钟',
    author: 'AWAKWILL Lab'
  },
  {
    id: '004',
    category: 'PRESS',
    tag: '媒体报道 PRESS',
    title: 'The Verge 评测：AWAK Ring 是目前最接近医疗级别的消费级健康戒指',
    summary: 'The Verge 编辑佩戴 AWAK Ring 长达30天后，写下了这份详细的使用报告。',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    date: '2024.11.10',
    readingTime: '4分钟',
    author: 'The Verge'
  },
  {
    id: '005',
    category: 'STORIES',
    tag: '用户故事 STORIES',
    title: '陈先生的心脏预警：AWAK Ring 提前14天发现了他的心律异常',
    summary: '41岁的陈先生没有任何症状，直到AWAK Ring 开始持续提示心率异常，他才去医院检查。',
    img: 'https://i.ibb.co/xt80TrsD/Heart-Attack-Myocardial-Infarction-Medline-Plus.jpg',
    date: '2024.11.05',
    readingTime: '7分钟',
    author: 'AWAK 编辑部'
  },
  {
    id: '006',
    category: 'INSIGHTS',
    tag: '行业洞察 INSIGHTS',
    title: '为什么 HRV 是比心率更重要的健康指标',
    summary: '心率变异率是评估自主神经系统健康状态的黄金指标，但90%的人从未听说过它。',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    date: '2024.10.30',
    readingTime: '6分钟',
    author: 'AWAKWILL Lab'
  },
  {
    id: 'b1',
    category: 'BRAND',
    tag: '品牌动态 BRAND',
    title: 'AWAK 2026 春季发布会回顾',
    subtitle: '探索科技与美学的共生',
    summary: '探索科技与美学的共生。本次发布会展示了全新的感知交互逻辑，以及我们在材质科技上的最新突破。',
    img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80',
    date: '2024.03.20',
    readingTime: '10分钟',
    author: 'AWAK 编辑部'
  },
  {
    id: 'b2',
    category: 'INSIGHTS',
    tag: '行业洞察 INSIGHTS',
    title: '关于呼吸的艺术',
    subtitle: '对话首席健康官',
    summary: '对话首席健康官。呼吸不仅是生理本能，更是调节自主神经系统的魔法按钮。',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
    date: '2024.03.15',
    readingTime: '8分钟',
    author: 'AWAKWILL Lab'
  },
  {
    id: 'b3',
    category: 'STORIES',
    tag: '用户故事 STORIES',
    title: '城市骑行计划',
    subtitle: '用轨迹连接社区',
    summary: '用轨迹连接社区。我们发起的春季骑行活动，旨在通过运动轨迹将散落在城市各处的用户连接起来福利。',
    img: 'https://i.ibb.co/wFCQp2wk/image.png',
    date: '2024.03.10',
    readingTime: '5分钟',
    author: 'AWAK 社区团队'
  },
  {
    id: 'b4',
    category: 'BRAND',
    tag: '品牌动态 BRAND',
    title: '无障碍设计的未来',
    subtitle: '让技术服务于每一个人',
    summary: '让技术服务于每一个人。科技不应成为鸿沟，而应成为连接感官与世界的桥梁。',
    img: 'https://i.ibb.co/8LKkcKPL/Open-positions-at-Oura.jpg',
    date: '2024.03.05',
    readingTime: '12分钟',
    author: 'AWAK 设计部'
  },
  {
    id: 'b5',
    category: 'LAUNCH',
    tag: '新品发布 LAUNCH',
    title: '材质实验室',
    subtitle: '寻找更亲肤的佩戴答案',
    summary: '寻找更亲肤的佩戴答案。我们深入研究了多种航天级材料，只为实现全天候佩戴的无感体验。',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    date: '2024.03.01',
    readingTime: '6分钟',
    author: 'AWAK 材质中心'
  },
  {
    id: 'b6',
    category: 'INSIGHTS',
    tag: '行业洞察 INSIGHTS',
    title: '全球睡眠研究峰会',
    subtitle: '解码深度睡眠的奥秘',
    summary: '解码深度睡眠的奥秘。最新的睡眠科学发现表明，温度与心率变异率在深度睡眠中起着决定性作用。',
    img: 'https://i.ibb.co/m5J3KvJN/Alzheimers.jpg',
    date: '2024.02.25',
    readingTime: '15分钟',
    author: 'AWAKWILL Lab'
  },
  {
    id: 'b7',
    category: 'BRAND',
    tag: '品牌动态 BRAND',
    title: '生态伙伴计划',
    subtitle: '共筑开放的数字生命蓝图',
    summary: '共筑开放的数字生命蓝图。我们宣布开放 API 接口，邀请更多健康服务提供商加入 AWAK 生态。',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    date: '2024.02.20',
    readingTime: '5分钟',
    author: 'AWAK 生态部'
  }
];

const CATEGORY_TABS = [
  { name: '全部', id: 'ALL' },
  { name: '品牌动态', id: 'BRAND' },
  { name: '新品发布', id: 'LAUNCH' },
  { name: '行业洞察', id: 'INSIGHTS' },
  { name: '媒体报道', id: 'PRESS' },
  { name: '用户故事', id: 'STORIES' },
];

// --- Styles ---
const GlobalStyles = () => (
  <style>{`
    .article-card-img-wrap {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      aspect-ratio: 16 / 9;
      background: #080808;
    }
    .article-card-img-wrap img {
      width: 100%; height: 100%;
      object-fit: cover;
      filter: saturate(0.7);
      transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 600ms ease;
    }
    .article-card-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(8,8,8,0.3);
      transition: background 300ms;
    }
    .article-card:hover .article-card-img-wrap img {
      transform: scale(1.05);
      filter: saturate(1.0);
    }
    .article-card:hover .article-card-img-wrap::after {
      background: rgba(8,8,8,0.15);
    }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// --- Components ---

const ArticleCard = ({ article, type }: { article: Article, type: 'hero' | 'medium' | 'small', onClick?: (a: Article) => void }) => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  return (
    <motion.div 
      onClick={() => navigate(withPath(`/news/${article.id}`))}
      className={`article-card flex flex-col group cursor-pointer ${type === 'hero' ? 'md:col-span-6' : type === 'medium' ? 'md:col-span-3' : 'md:col-span-2'}`}
    >
      <div className="article-card-img-wrap mb-6">
        <img src={article.img} alt={article.title} referrerPolicy="no-referrer" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[#86868B] text-[10px] font-bold tracking-widest uppercase">{article.category}</span>
          <span className="text-[#A1A1A6] text-[12px]">{article.date}</span>
        </div>
        <h3 className={`text-[#1D1D1F] font-bold leading-tight group-hover:text-black transition-colors ${type === 'hero' ? 'text-3xl md:text-5xl' : 'text-xl'}`}>
          {article.title}
        </h3>
        {type === 'hero' && article.summary && (
          <p className="text-[#86868B] text-lg leading-relaxed line-clamp-2 max-w-[800px]">
            {article.summary}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#86868B] text-xs">作者: {article.author} · {article.readingTime} 阅读</span>
          <span className="text-black font-bold text-sm transform transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.div>
  );
};

const HeaderSection = () => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  return (
    <section className="relative h-[85vh] w-full bg-[#080808] overflow-hidden flex items-end">
      <div className="absolute inset-0">
        <img 
          src={MOCK_ARTICLES[0].img} 
          alt="Focus" 
          className="w-full h-full object-cover opacity-40 saturate-[0.7]" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
      </div>
      <div className="w-full px-6 md:px-[170px] pb-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-[1000px] flex flex-col gap-8">
          <h1 className="text-white text-5xl md:text-[80px] font-black leading-[1.05] tracking-tight">
            {MOCK_ARTICLES[0].title}
          </h1>
          <p className="text-white/60 text-xl md:text-2xl font-light leading-relaxed max-w-[800px]">
            {MOCK_ARTICLES[0].summary}
          </p>
          <button 
            onClick={() => navigate(withPath(`/news/${MOCK_ARTICLES[0].id}`))}
            className="group w-fit bg-white text-black px-10 py-5 rounded-full text-base font-bold flex items-center gap-3 hover:scale-105 transition-all"
          >
            阅读全文 <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const ContentFilterBar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <div className="sticky top-[72px] z-[90] bg-white/80 backdrop-blur-xl border-b border-black/5 h-[64px] flex items-center">
      <div className="w-full px-6 md:px-[170px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10 overflow-x-auto hide-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative h-[64px] flex flex-col justify-center transition-all ${activeTab === tab.id ? 'text-black font-bold' : 'text-[#86868B]'}`}
            >
              <span className="text-sm tracking-tight">{tab.name}</span>
              {activeTab === tab.id && <motion.div layoutId="tabUnder" className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <motion.div animate={{ width: isSearchOpen ? 240 : 0, opacity: isSearchOpen ? 1 : 0 }} className="overflow-hidden">
            <input 
              type="text" 
              placeholder="搜索内容..." 
              className="w-[240px] bg-black/10 text-black border border-black/20 focus:border-black rounded-full px-5 py-2 text-sm outline-none transition-all placeholder:text-black/40" 
            />
          </motion.div>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-3 text-black hover:bg-black/5 rounded-full">
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditorialPicks = () => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  return (
    <section className="bg-white py-32 border-t border-black/5">
      <div className="w-full px-6 md:px-[170px] mx-auto flex flex-col gap-16">
        <div className="border-b border-black/10 pb-8 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-black text-4xl font-extrabold tracking-tight">精选推荐</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
             <ArticleCard article={MOCK_ARTICLES[1]} type="medium" />
          </div>
          <div className="md:col-span-1" />
          <div className="md:col-span-6 flex flex-col gap-10">
            {[MOCK_ARTICLES[2], MOCK_ARTICLES[3]].map((a, i) => (
              <div key={a.id} onClick={() => navigate(withPath(`/news/${a.id}`))} className="grid grid-cols-5 gap-8 group cursor-pointer items-center">
                <div className="col-span-2 article-card-img-wrap !aspect-video"><img src={a.img} alt={a.title} /></div>
                <div className="col-span-3 flex flex-col justify-center gap-3">
                  <span className="text-[#86868B] text-[10px] font-bold uppercase tracking-widest">{a.category}</span>
                  <h4 className="text-black text-xl font-bold leading-snug group-hover:text-[#86868B] transition-colors">{a.title}</h4>
                  <span className="text-black transform transition-transform group-hover:translate-x-1 font-bold text-sm">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ResearchReports = () => {
  const reports = [
    { title: '2026 年行业健康感知趋势研报', date: '2026 Q4', isPrimary: true, link: '/reports/trends_2026.pdf' },
    { title: '全周期健康管理应用白皮书', date: '2026 12月', isPrimary: false, link: '/reports/health_management.pdf' },
    { title: '智能穿戴与人机连接系统研究报告', date: '2026 Q3', isPrimary: false, link: '/reports/hmi_study.pdf' },
  ];
  return (
    <section className="bg-white py-32 px-6 md:px-[170px] border-t border-black/5">
      <div className="flex flex-col gap-16">
        <div className="max-w-[800px] flex flex-col gap-4">
          <h2 className="text-black text-5xl font-black tracking-tight leading-tight">用数据说话,<br/>这是我们的深度发现</h2>
          <p className="text-[#86868B] text-xl">通过大规模匿名调查与数据分析,理解时代的健康脉搏。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {reports.map((r, i) => (
            <a 
              key={i} 
              href={r.link}
              download
              className={`${r.isPrimary ? 'md:col-span-6 bg-[#F5F5F7] text-black' : 'md:col-span-3 bg-[#F5F5F7] text-black'} rounded-[24px] p-10 flex flex-col justify-between hover:-translate-y-1 transition-all group cursor-pointer shadow-sm`}
            >
              <div className="flex flex-col gap-6">
                <span className={`${r.isPrimary ? 'text-black/40' : 'text-[#86868B]'} text-xs font-bold tracking-widest`}>{r.date}</span>
                <h3 className={`text-2xl font-black leading-tight ${r.isPrimary ? 'text-4xl pr-8' : ''}`}>{r.title}</h3>
              </div>
              <div className="mt-12 flex items-center justify-between pt-6 border-t border-black/5 text-xs font-medium uppercase tracking-widest">
                <span>PDF 下载</span>
                <Download className={`w-5 h-5 ${r.isPrimary ? 'text-black' : 'text-black'}`} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArticleDetail = ({ article, onBack }: { article: Article, onBack: () => void }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [article]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white min-h-screen pt-32 pb-40 px-6 md:px-[170px]">
      <div className="max-w-[900px] mx-auto">
        <button onClick={onBack} className="text-[#86868B] hover:text-black flex items-center gap-2 mb-12 font-bold"><ChevronRight className="rotate-180 w-4 h-4" /> 返回资讯中心</button>
        <div className="flex flex-col gap-8 mb-16">
          <span className="text-[#86868B] text-xs font-bold tracking-widest uppercase">{article.tag}</span>
          <h1 className="text-black text-4xl md:text-6xl font-black leading-tight tracking-tight">{article.title}</h1>
          <div className="flex items-center gap-4 py-8 border-y border-black/5">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center font-bold text-white">A</div>
            <div className="flex flex-col">
              <span className="font-bold text-black">{article.author}</span>
              <span className="text-[#A1A1A6] text-xs">{article.date} · {article.readingTime} 阅读量</span>
            </div>
            <div className="ml-auto flex gap-3">
              <button className="p-3 rounded-full bg-black/5 hover:bg-black hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
              <button className="p-3 rounded-full bg-black/5 hover:bg-black hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className="article-card-img-wrap mb-16 !aspect-[21/9]"><img src={article.img} alt="Hero" /></div>
        <div className="prose prose-lg max-w-none text-[#1D1D1F] leading-[1.8] space-y-8">
          <p className="text-2xl font-light text-[#86868B] leading-relaxed">AWAKWILL 实验室预见：智能穿戴的终局并非只是监测工具，而是人类感官的数字化延伸与全周期健康管理的控制中枢。</p>
          <div className="space-y-6 text-[#1D1D1F]">
            <p>
              跨入 2026 年，我们正处在一个健康感知技术全面爆发的奇点。过去，我们习惯于在感到不适时才去寻求医疗干预。而今天，随着传感技术的微量化与 AI 算力的下沉，我们第一次拥有了实时与身体对话的能力。智能穿戴不再只是手腕上的装饰，它正在演变成一套精密的人机连接系统。
            </p>
            <p>
              AWAKWILL 实验室的最新研究表明，行业正经历从“单点监测”向“全周期健康管理”的范式转移。这意味着，感知不再仅限于心率或睡眠的简单记录，而是通过对连续性生理指标的深度学习，构建出一个动态的、预测性的数字生命模型。通过这种模型，我们可以在疾病露头之前，就通过微小的生活习惯调整实现精准干预。
            </p>
            <p>
              我们正致力于将“透明科技”理念贯彻到底。未来的感知器应该是无感的，它静默地存在于你的指尖、手腕或眼眶中，却在那最关键的时刻给出最具价值的洞察。这一进程的加速，得益于我们在材质科技和低功耗算力上的突破。今天的 AWAK 生态，已经不再是孤立的设备，而是一个多端协同、数据互通的生命守护网络。
            </p>
            <h2 className="text-3xl font-black pt-8">从监测到干预：健康管理的闭环进化</h2>
            <p>
              在新的阶段，我们更关注数据的“行动价值”。如果感知不能转化为决策，那么数据就是多余的负担。因此，我们开发了新一代的 AI 动态干预引擎。它会根据你实时的 HRV（心率变异率）以及压力水平，在最恰当的时机引导你进行正念呼吸，或者调整当晚的运动负荷。
            </p>
            <p>
              随着全球老龄化的趋势以及人们对主动健康管理的空前重视，健康感知市场的扩张速度超乎想象。这不仅是商业的成功，更是科技平权的胜利。我们让曾经昂贵的医学级监测技术，走进了千家万户，服务于每一个关注生命质量的个体。
            </p>
            <p>
              展望 2027，AWAKWILL 将继续深耕开放 API 生态。我们深知，健康是一个复杂的系统工程，单打独斗无法解决所有问题。通过与全球顶尖医疗机构、保险服务商以及专业运动品牌的深度融合，我们将共同描绘出一份前所未有的数字生命蓝图。
            </p>
            <p>
              感谢每一个在这个加速时代中选择 AWAK 的伙伴。你们的每一份数据，都是人类向主动健康时代迈进的一小步。让我们一起，感知生命，接管未来。
            </p>
          </div>
        </div>
        <div className="mt-40 pt-24 border-t border-black/5 flex flex-col gap-12">
          <h3 className="text-black text-xs font-bold tracking-[.3em]">继续阅读 KEEP READING</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_ARTICLES.slice(1, 4).map(a => (
              <div key={a.id} onClick={() => {}} className="cursor-pointer group">
                <div className="article-card-img-wrap mb-4 !aspect-[3/2]"><img src={a.img} alt={a.title} /></div>
                <h4 className="font-bold line-clamp-2 group-hover:text-[#86868B] transition-colors">{a.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BrandChronicle = () => {
    const milestones = [
        { year: '2026', title: '加速扩张', desc: '健康感知时代正式开启,AWAK 进入高速增长轨道。', side: 'left' },
        { year: '2026', title: '技术融合', desc: '全周期健康管理系统上线,实现从监测到干预的跨越。', side: 'right' },
        { year: '2027', title: '生态爆发', desc: 'AWAK 生态伙伴突破 500家,共建数字生命新标杆。', side: 'left' },
        { year: '2027', title: '全球领先', desc: '成为全球领先的主动健康管理服务商。', side: 'right' },
    ];
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start end", "end start"] });
    const scaleY = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
    return (
        <section ref={scrollRef} className="bg-[#080808] py-40 px-6 md:px-[170px] relative overflow-hidden">
            <div className="flex flex-col items-center gap-8 mb-32 text-center max-w-[800px] mx-auto">
                <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight">从一个想法 到一个时代</h2>
            </div>
            <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2">
                    <motion.div style={{ scaleY, originY: 0 }} className="absolute inset-0 bg-white" />
                </div>
                <div className="flex flex-col gap-24 relative">
                    {milestones.map((m, i) => (
                        <div key={i} className={`flex items-center w-full ${m.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`w-1/2 ${m.side === 'left' ? 'pr-20 text-right' : 'pl-20 text-left'}`}>
                                <motion.div initial={{ opacity: 0, x: m.side === 'left' ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}>
                                    <span className="text-white font-mono text-3xl font-black mb-4 block italic">{m.year}</span>
                                    <h3 className="text-white text-2xl font-bold mb-4">{m.title}</h3>
                                    <p className="text-white/40 leading-relaxed">{m.desc}</p>
                                </motion.div>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} className="w-3 h-3 rounded-full border-2 border-white bg-black z-10" />
                            </div>
                            <div className="w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function NewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const [activeTab, setActiveTab] = useState<Category>('ALL');
  
  const selectedArticle = id ? MOCK_ARTICLES.find(a => a.id === id) : null;

  const filtered = MOCK_ARTICLES.filter(a => activeTab === 'ALL' || a.category === activeTab);

  if (selectedArticle) return (<><ArticleDetail article={selectedArticle} onBack={() => navigate(withPath('/news'))} /><FooterSections /></>);

  return (
    <div className="bg-white min-h-screen">
      <GlobalStyles />
      <HeaderSection />
      <EditorialPicks />
      <ContentFilterBar activeTab={activeTab} onTabChange={(c) => setActiveTab(c as Category)} />
      <section className="bg-white py-24 px-6 md:px-[170px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-6 gap-x-12 gap-y-20">
            {filtered.map((a, i) => {
              const col = i === 0 ? 'md:col-span-6' : (i === 1 || i === 2) ? 'md:col-span-3' : 'md:col-span-2';
              return (
                <div key={a.id} className={col}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: (i % 3) * 0.1 }}>
                    <ArticleCard article={a} type={i === 0 ? 'hero' : i < 3 ? 'medium' : 'small'} />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>
      <BrandChronicle />
      <ResearchReports />
      <FooterSections />
    </div>
  );
}
