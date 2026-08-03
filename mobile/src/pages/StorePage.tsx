import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, animate, useInView } from 'motion/react';
import {
  Shield,
  RefreshCw,
  Lock,
  ZoomIn,
  Check,
  ShoppingCart,
  X,
  Star,
  ChevronDown,
  Box,
  Battery,
  BatteryCharging,
  Zap,
  ShieldCheck,
  FileText,
  Circle,
  Activity,
  Eye,
  Watch as WatchIcon,
  Package,
  Waves,
  Thermometer,
  Move,
  HeartPulse,
  Brain,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu,
  Satellite,
  Mic,
  ScanLine,
  Languages,
  Volume2,
} from 'lucide-react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FooterSections from '../components/FooterSections';
import { useLocalePath } from '../hooks/useLocalePath';
import { stripLocalePrefix } from '../lib/locale';
import { NAV_HARDWARE_ITEMS, NAV_SECONDARY_PAGES } from '../lib/siteNav';

const RING_LIFESTYLE_CARDS: { tag: string; title: string; desc: string; image: string }[] = [
  {
    tag: '恢复',
    title: '恢复评分',
    desc: '听懂身体的告白，让能量焕然新生。',
    image: 'https://i.ibb.co/Xx2Xx2Zv/Pinterest.jpg',
  },
  {
    tag: '睡眠',
    title: '睡眠分析',
    desc: '拆解长夜的梦境，把好眠还给每一个清晨。',
    image: 'https://i.ibb.co/6Rw4t5m5/Pinterest-2.jpg',
  },
  {
    tag: '血氧',
    title: '血氧监测',
    desc: '隐形的卫士，在静默呼吸间坚定守护。',
    image: 'https://i.ibb.co/YTczBdNK/Pinterest-3.jpg',
  },
  {
    tag: '体温',
    title: '体温基线',
    desc: '的起伏，是跨越昼夜的深情守护。',
    image: 'https://i.ibb.co/1t1t2R2J/Pinterest-4.jpg',
  },
  {
    tag: '压力',
    title: '压力监测',
    desc: '读懂紧绷的神经，在喧嚣中为你找回宁静。',
    image: 'https://i.ibb.co/qFnRQ832/Pinterest.png',
  },
  {
    tag: '运动',
    title: '运动识别',
    desc: '你的每一分投入，数据都感同身受。',
    image: 'https://i.ibb.co/99PDHQDS/jimeng-2026-04-24-4023.png',
  },
];

/** 购买中心四品类统一采用智能戒指版式（文案与图片按品类区分） */
const UNIFIED_STORE_IDS = ['ring', 'bracelet', 'glasses', 'watch'] as const;
type UnifiedStoreId = (typeof UNIFIED_STORE_IDS)[number];

function isUnifiedStoreLayout(id: string): id is UnifiedStoreId {
  return (UNIFIED_STORE_IDS as readonly string[]).includes(id);
}

type LifestyleCard = { title: string; desc: string; image: string };

const BRACELET_LIFESTYLE_CARDS: LifestyleCard[] = [
  { title: '重启 · 活力状态', desc: '读懂身体，每天焕新。', image: 'https://i.ibb.co/jk0RWMhz/51-Pinterest.jpg' },
  { title: '守护 · 稳健心跳', desc: '岁月平稳，长情陪伴。', image: 'https://i.ibb.co/jv8tXQWF/Pinterest.jpg' },
  { title: '入梦 · 安稳长夜', desc: '拆解好梦，清晨神清。', image: 'https://i.ibb.co/prBY18hj/Pinterest-2.jpg' },
  { title: '知冷 · 细微体温', desc: '细嗅冷暖，贴心关怀。', image: 'https://i.ibb.co/3mfPq5vc/Pinterest-3.jpg' },
  { title: '宽心 · 舒压解忧', desc: '抚平心绪，日子从容。', image: 'https://i.ibb.co/PvPyRWZF/Pinterest.png' },
  { title: '记取 · 步履辛劳', desc: '你的忙碌，它都懂。', image: 'https://i.ibb.co/jPMY04XN/Pinterest.webp' },
];

const WATCH_LIFESTYLE_CARDS: LifestyleCard[] = [
  { title: '守护 · 有力跳动', desc: '心跳平稳，步履踏实。', image: 'https://i.ibb.co/811khWY/52-Pinterest-1.jpg' },
  { title: '平衡 · 运动强度', desc: '科学锻炼，动静适宜。', image: 'https://i.ibb.co/dJrPsLVG/52-Pinterest-2.jpg' },
  { title: '守候 · 呼吸纯净', desc: '氧气充盈，精神饱满。', image: 'https://i.ibb.co/5gpRK6nk/52-Pinterest.png' },
  { title: '记取 · 活力瞬间', desc: '身随心动，自如记录。', image: 'https://i.ibb.co/0LRvDN8/Relojes-Select-1.jpg' },
  { title: '找回 · 身体平衡', desc: '舒缓心绪，蓄满能量。', image: 'https://i.ibb.co/4nYTvVS1/Relojes-Select-2.jpg' },
  { title: '勋章 · 每一滴汗', desc: '点滴努力，皆是生命力。', image: 'https://i.ibb.co/tTVvkN26/Relojes-Select-3.jpg' },
];

const GLASSES_LIFESTYLE_CARDS: LifestyleCard[] = [
  { title: '实时语音转文字', desc: '对话内容实时转为文字显示，帮助听障用户清晰理解交流内容', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=80' },
  { title: '手语识别转语音', desc: '手语动作可被识别并转换为语音或文字，实现双向沟通', image: 'https://images.unsplash.com/photo-1577563908411-5077b6cd7024?w=800&auto=format&fit=crop&q=80' },
  { title: '环境声音提醒', desc: '识别门铃、警报、婴儿哭声等关键声音，通过震动与提示提醒用户', image: 'https://images.unsplash.com/photo-1512428559083-abd606332ec1?w=800&auto=format&fit=crop&q=80' },
  { title: '文字识别朗读', desc: '菜单、药品、路牌等文字内容可被自动识别并语音播报', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80' },
  { title: '实时语言翻译', desc: '支持多语言对话实时翻译，帮助跨国沟通与日常交流', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
  { title: '第一视角记录', desc: '支持拍照与录像，记录日常与重要场景', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80' },
];

const EDITORIAL_BY_CATEGORY: Record<
  UnifiedStoreId,
  { h2Line1: string; h2Line2: string; body: string; chips: string[] }
> = {
  ring: {
    h2Line1: '年轻时尚',
    h2Line2: '指尖健康触手可及',
    body: '从心率到睡眠，从压力到血氧，Awak Health 智能戒指持续追踪 50+ 项生理指标，让你成为最了解自己身体的人。',
    chips: ['心率监测', '血氧饱和度', '睡眠分期', '压力指数', '+46项'],
  },
  bracelet: {
    h2Line1: '银发守护',
    h2Line2: '早点，让一切都来得及',
    body: '从睡眠到压力，从恢复到训练负荷，持续理解你的身体节奏。',
    chips: ['恢复评分', '睡眠分期', '心率', '压力', '训练负荷', '+多维指标'],
  },
  watch: {
    h2Line1: '特殊关爱',
    h2Line2: '听视障人群伴身智能',
    body: '从日常健康到专业训练，持续理解你的身体变化。',
    chips: ['运动模式', '卫星定位', '血氧心率', '训练负荷', '睡眠恢复', '+专业指标'],
  },
  glasses: {
    h2Line1: '特殊关爱',
    h2Line2: '听视障人群伴身智能',
    body: '信息不再阻断你，而是主动为你传达世界。',
    chips: ['语音转写', '手语识别', '环境听辨', 'OCR朗读', '实时翻译', '+辅助能力'],
  },
};

const SENSOR_SECTION_COPY: Record<UnifiedStoreId, { kicker: string; title: string }> = {
  ring: { kicker: '六核传感，精准从不将就', title: '医疗级传感，构筑身体数字映射' },
  bracelet: { kicker: '多维感知', title: '持续采集，构建你的身体模型' },
  watch: { kicker: '旗舰传感', title: '精准来自系统级协同感知' },
  glasses: { kicker: '多重感知', title: '让设备成为你的第二感官' },
};

type SensorStripDef = {
  tag: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;
  title: string;
  line1: string;
  line2: string;
};

const RING_SENSOR_STRIP: SensorStripDef[] = [
  { tag: 'PPG', icon: Waves, title: '光学心率传感器', line1: '绿光+红外双波长', line2: '心率 / 血氧 / HRV' },
  { tag: 'NTC', icon: Thermometer, title: '精密温度传感器', line1: '精度 ±0.1°C', line2: '皮肤温度 / 基础体温' },
  { tag: 'IMU', icon: Move, title: '六轴加速度计', line1: '±0.01g 精度 · ±16g 量程', line2: '运动识别 / 步态分析' },
  { tag: 'ECG', icon: HeartPulse, title: '心电图传感器', line1: '单导联 ECG', line2: '心律异常早期检测' },
  { tag: 'EDA', icon: Brain, title: '皮电传感器', line1: '皮肤电导率检测', line2: '压力 / 情绪量化' },
  { tag: 'BIO', icon: Layers, title: '生物电阻抗', line1: '体成分分析', line2: '体脂 / 肌肉 / 水分' },
];

const BRACELET_SENSOR_STRIP: SensorStripDef[] = [
  { tag: 'PPG', icon: Waves, title: '光学心率传感器', line1: '多波长连续心率监测', line2: '心率 / HRV / 压力 / 恢复' },
  { tag: 'NTC', icon: Thermometer, title: '皮肤温度传感器', line1: '高灵敏温度感知', line2: '恢复趋势 / 生理波动' },
  { tag: 'IMU', icon: Move, title: '加速度计', line1: '高精度运动识别', line2: '活动强度 / 行为分析' },
  { tag: 'AI', icon: Layers, title: '融合算法系统', line1: '多指标融合计算', line2: '恢复评分 / 状态预测' },
];

const WATCH_SENSOR_STRIP: SensorStripDef[] = [
  { tag: 'PPG', icon: Waves, title: '光学心率传感器', line1: '多波长光学监测', line2: '心率 / HRV / 血氧 / 压力' },
  { tag: 'GNSS', icon: Satellite, title: '卫星定位系统', line1: '多系统定位融合', line2: '轨迹 / 距离 / 配速分析' },
  { tag: 'IMU', icon: Move, title: '六轴加速度计', line1: '高精度运动感知', line2: '运动识别 / 步态分析' },
  { tag: 'GYRO', icon: Activity, title: '三轴陀螺仪', line1: '高精度姿态感知', line2: '姿态识别 / 稳定性分析' },
];

const GLASSES_SENSOR_STRIP: SensorStripDef[] = [
  { tag: 'MIC', icon: Mic, title: '语音识别系统', line1: '高精度语音捕捉', line2: '语音转文字 / 实时字幕' },
  { tag: 'VIS', icon: ScanLine, title: '视觉识别系统', line1: '图像与文字识别', line2: 'OCR / 场景与物体识别' },
  { tag: 'AUD', icon: Volume2, title: '环境声音识别', line1: '关键声音检测分类', line2: '警报 / 安全感知提示' },
  { tag: 'LANG', icon: Languages, title: '多语言转换', line1: '多语种实时转换', line2: '跨语言交流辅助' },
];

const SENSOR_STRIP_BY_CATEGORY: Record<UnifiedStoreId, SensorStripDef[]> = {
  ring: RING_SENSOR_STRIP,
  bracelet: BRACELET_SENSOR_STRIP,
  watch: WATCH_SENSOR_STRIP,
  glasses: GLASSES_SENSOR_STRIP,
};

type InboxCellDef = {
  title: string;
  body: React.ReactNode;
  leading: React.ReactNode;
};

const IN_THE_BOX_BY_CATEGORY: Record<UnifiedStoreId, { heroImage: string; cells: InboxCellDef[] }> = {
  ring: {
    heroImage: 'https://i.ibb.co/WvZDYkvK/image.png',
    cells: [
      {
        title: 'AWAK Ring × 1',
        body: (
          <>
            本体，含所选颜色
            <br />
            尺寸
          </>
        ),
        leading: <Package className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '触点充电仓 × 1',
        body: '支持无线充电，兼容Qi',
        leading: <BatteryCharging className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '质保卡 × 1',
        body: '18个月官方质保',
        leading: <ShieldCheck className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '使用指南 × 1',
        body: (
          <>
            中英双语，含App
            <br />
            下载码
          </>
        ),
        leading: <FileText className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
    ],
  },
  bracelet: {
    heroImage: 'https://i.ibb.co/xS01Jf1z/image.png',
    cells: [
      {
        title: 'AWAK BRACELET × 1',
        body: '主机｜轻量化健康监测手环',
        leading: <Package className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '磁吸充电模块 × 1',
        body: '专用充电方式｜支持全天候佩戴设计',
        leading: <BatteryCharging className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '质保卡 × 1',
        body: '官方质保服务（12–18个月，视地区）',
        leading: <ShieldCheck className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '快速上手指南 × 1',
        body: '中英双语说明｜含 App 下载与绑定指引',
        leading: <FileText className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
    ],
  },
  watch: {
    heroImage: 'https://i.ibb.co/jZT4DZJj/b74a3d2c6aed46188e21855acb0e0dbc.png',
    cells: [
      {
        title: 'AWAK WATCH × 1',
        body: '主机｜依所选版本配置',
        leading: <Package className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '磁吸充电底座 × 1',
        body: '快充兼容｜安全稳固放置',
        leading: <BatteryCharging className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '质保卡 × 1',
        body: '官方质保服务（依地区政策）',
        leading: <ShieldCheck className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '快速上手指南 × 1',
        body: '中英双语说明｜含 App 下载与绑定指引',
        leading: <FileText className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
    ],
  },
  glasses: {
    heroImage: 'https://i.ibb.co/gbpwCydx/a618c6efdd3c4e599a9b760453c224ac.png',
    cells: [
      {
        title: 'AWAK GLASSES × 1',
        body: '主机｜依所选镜框款式',
        leading: <Package className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '智能充电盒 × 1',
        body: '收纳与补电一体设计',
        leading: <BatteryCharging className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '质保卡 × 1',
        body: '官方质保服务（依地区政策）',
        leading: <ShieldCheck className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
      {
        title: '快速上手指南 × 1',
        body: '中英双语说明｜含 App 下载与绑定指引',
        leading: <FileText className="mb-3 text-[#111]" size={24} strokeWidth={1.5} aria-hidden />,
      },
    ],
  },
};

const HERO_ACCORDION_BULLETS: Record<UnifiedStoreId, string[]> = {
  ring: ['无感佩戴 重量仅 5g', '医疗级传感器阵列，全天候监测血氧及心率', '最长7天超长续航，支持深度防水'],
  bracelet: ['腕带式连续佩戴，轻盈亲肤', '多源生理数据整合，恢复与睡眠一目了然', '磁吸充电，典型使用约 4–5 天续航'],
  watch: ['多星定位与专业运动模式', '全天候健康监测与训练负荷分析', '5ATM / 10ATM 防水（依版本）'],
  glasses: ['语音转写与环境听辨辅助', 'OCR 与实时翻译，沟通更顺畅', '充电盒收纳补电，全天佩戴设计'],
};

type ComparisonBarRow = { metric: string; before: string; after: string; w: string; delay: string };

/** 购买中心「90天对比」条带：与智能戒指区块同一视觉，文案按品类 */
const COMPARISON_BAR_ROWS: Record<UnifiedStoreId, ComparisonBarRow[]> = {
  ring: [
    { metric: '深度睡眠占比', before: '18.4%', after: '22.7%', w: '75%', delay: '0s' },
    { metric: '静息心率', before: '72 bpm', after: '65 bpm', w: '60%', delay: '0.1s' },
    { metric: '压力指数', before: '14.2天', after: '9.6天', w: '55%', delay: '0.2s' },
    { metric: 'VO₂Max 有氧能力', before: '38.2', after: '45.1', w: '88%', delay: '0.3s' },
  ],
  bracelet: [
    { metric: '平均恢复评分', before: '52', after: '71', w: '72%', delay: '0s' },
    { metric: '静息心率', before: '68 bpm', after: '62 bpm', w: '62%', delay: '0.1s' },
    { metric: 'HRV稳定性', before: '基准', after: '+20%', w: '58%', delay: '0.2s' },
    { metric: '睡眠质量评分', before: '62', after: '73', w: '78%', delay: '0.3s' },
    { metric: '日常压力波动', before: '基准', after: '-25%', w: '55%', delay: '0.4s' },
  ],
  watch: [
    { metric: '最大摄氧量 (VO₂ Max)', before: '38.5', after: '45.2', w: '80%', delay: '0s' },
    { metric: '静息心率', before: '72 bpm', after: '66 bpm', w: '63%', delay: '0.1s' },
    { metric: '训练负荷稳定性', before: '基准', after: '+20%', w: '58%', delay: '0.2s' },
    { metric: '睡眠恢复评分', before: '65', after: '77', w: '74%', delay: '0.3s' },
  ],
  glasses: [
    { metric: '沟通理解效率', before: '基准', after: '+50%', w: '76%', delay: '0s' },
    { metric: '信息获取速度', before: '基准', after: '+40%', w: '68%', delay: '0.1s' },
    { metric: '跨语言沟通能力', before: '基准', after: '+60%', w: '85%', delay: '0.2s' },
  ],
};

function lifestyleCardsForCategory(id: UnifiedStoreId): LifestyleCard[] {
  switch (id) {
    case 'ring':
      return RING_LIFESTYLE_CARDS.map(({ title, desc, image }) => ({ title, desc, image }));
    case 'bracelet':
      return BRACELET_LIFESTYLE_CARDS;
    case 'watch':
      return WATCH_LIFESTYLE_CARDS;
    case 'glasses':
      return GLASSES_LIFESTYLE_CARDS;
    default:
      return [];
  }
}

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
          { id: 'titanium', name: '钛金银', hex: '#E8E8E4', img: 'https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png', price: 1588, originalPrice: 1688 },
          { id: 'obsidian', name: '墨影黑', hex: '#1A1A1A', img: 'https://i.ibb.co/zTQKV09Y/jimeng-2026-04-20-2515.png', price: 1588, originalPrice: 1688 },
          { id: 'gold', name: '璀璨金', hex: '#E5C282', img: 'https://i.ibb.co/8Djdy2VY/jimeng-2026-04-20-2444.png', price: 1588, originalPrice: 1688 }
        ]
      },
      { 
        name: '乐于运动款', 
        img: 'https://i.ibb.co/RTWNCcfq/175b79bdbb6542288e13cb040345e1b9.png',
        colors: [
          { id: 'ice-blue', name: '冰地蓝', hex: '#A5CAD2', img: 'https://i.ibb.co/RTWNCcfq/175b79bdbb6542288e13cb040345e1b9.png', price: 1588, originalPrice: 1688 },
          { id: 'ultra-black', name: '极黑境', hex: '#0A0A0A', img: 'https://i.ibb.co/QvpYH5t5/image.png', price: 1588, originalPrice: 1688 },
          { id: 'white', name: '无垠白', hex: '#F5F5F5', img: 'https://i.ibb.co/4n0WTsxF/image.png', price: 1588, originalPrice: 1688 },
          { id: 'pink', name: '嫩霞粉', hex: '#E7B1B6', img: 'https://i.ibb.co/G43Fy2S7/image.png', price: 1588, originalPrice: 1688 }
        ]
      },
      { 
        name: '健康时尚款',
        showPrice: false,
        img: 'https://i.ibb.co/N28C7vWs/2.png',
        colors: [
          { id: 'rose-gold', name: '玫瑰金', hex: '#CAA193', img: 'https://i.ibb.co/N28C7vWs/2.png', price: 349 },
          { id: 'liquid-silver', name: '流光银', hex: '#D1D1D1', img: 'https://i.ibb.co/sd1WxmPR/1.png', price: 349 },
          { id: 'afterglow-gold', name: '余晖金', hex: '#C9A96E', img: 'https://i.ibb.co/pBPwm45s/5.png', price: 349 }
        ]
      },
      { name: '唯一定制款', showPrice: false, img: 'https://i.ibb.co/3mM22753/6.png' }
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

const visibleCategories = categories.filter((c) => c.id !== 'watch' && c.id !== 'glasses');

const colors = [
  { id: 'obsidian', name: '墨影黑', enName: 'Obsidian', price: 349, img: 'https://i.ibb.co/JWDBKFgn/image.png' },
  { id: 'titanium', name: '钛金银', enName: 'Titanium', price: 299, img: 'https://i.ibb.co/gbpwCydx/a618c6efdd3c4e599a9b760453c224ac.png' },
  { id: 'liquid-gold', name: '流光金', enName: 'Liquid Gold', price: 449, img: 'https://i.ibb.co/3mM22753/6.png' },
  { id: 'rose-gold', name: '玫瑰金', enName: 'Rose Gold', price: 549, img: 'https://i.ibb.co/sd1WxmPR/1.png' }
];

const allFaqs: Record<string, { q: string, a: string }[]> = {
  ring: [
    {
      q: '如何找到适合我的戒圈尺寸？',
      a:
        '我们提供免费的硅胶尺寸测量套装，下单前可申请试戴。通常建议用惯用手的无名指测量，早晚各测一次取较大值。若两个尺码之间，建议选择较大的尺码。',
    },
    {
      q: '电池寿命多久？多久充一次电？',
      a:
        '在正常使用条件下，AWAK Ring 可持续使用 4–7 天。开启全天候睡眠+运动追踪时约 4 天，仅心率监测时可达 7 天。充电仓可额外提供 2 次满电，单次充电约 70 分钟充满。',
    },
    {
      q: '如何连接到我的手机？',
      a: '下载 Awak Health App，打开蓝牙，将戒指从充电仓中取出，APP 会自动识别并完成绑定，全程不超过 2 分钟。',
    },
    {
      q: '支持哪些手机系统？',
      a: '支持 iOS 14 及以上版本，以及 Android 10 及以上版本。推荐使用较新的系统版本以获得最佳体验。',
    },
    {
      q: '可以游泳或洗澡时佩戴吗？',
      a:
        '可以。AWAK Ring 拥有 IP68 防水等级，支持在 50 米水深内使用，可游泳、淋浴佩戴，不建议在热水浴缸或桑拿环境长时间佩戴。',
    },
    {
      q: '可以以旧换新吗？',
      a: '支持以旧换新，适用于 Awak Health 全系产品。以旧换新可享受额外 ¥80–¥150 的折扣优惠，具体金额根据旧设备成色评估确定。',
    },
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
    useful: 26, avatarBg: '#c8f000'
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

/** 购买中心 · 智能戒指（/store/ring）FAQ — 设计稿「你可能想知道的」 */
const RingStoreFaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="faq-row cursor-pointer border-b border-black/[0.08] last:border-b-0"
      role="button"
      tabIndex={0}
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen((o) => !o);
        }
      }}
    >
      <div className="faq-header flex items-start justify-between gap-4 py-4 text-left">
        <span className="faq-q text-[15px] font-medium leading-snug text-[#0A0A0A]">{q}</span>
        <svg
          className={`faq-icon h-5 w-5 shrink-0 text-[#0A0A0A] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="faq-body overflow-hidden"
          >
            <p className="faq-answer pb-4 text-[14px] font-normal leading-[1.65] text-[#0A0A0A]/75">{a}</p>
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
  const { t } = useTranslation('common');
  const { category } = useParams();
  const location = useLocation();
  const basePath = stripLocalePrefix(location.pathname);

  const [ringMobileMenuOpen, setRingMobileMenuOpen] = useState(false);
  const lifestyleScrollRef = useRef<HTMLDivElement>(null);
  const sensorScrollRef = useRef<HTMLDivElement>(null);

  const scrollRingLifestyle = (dir: 'left' | 'right') => {
    const el = lifestyleScrollRef.current;
    if (!el) return;
    const delta = Math.min(340, el.clientWidth * 0.85);
    el.scrollBy({ left: dir === 'left' ? -delta : delta, behavior: 'smooth' });
  };

  const scrollRingSensors = (dir: 'left' | 'right') => {
    const el = sensorScrollRef.current;
    if (!el) return;
    const delta = Math.min(240, el.clientWidth * 0.72);
    el.scrollBy({ left: dir === 'left' ? -delta : delta, behavior: 'smooth' });
  };

  const [activeCategory, setActiveCategory] = useState(() => {
    if (category) {
      const found = visibleCategories.find(c => c.id === category);
      if (found) return found;
    }
    return visibleCategories[0];
  });

  useEffect(() => {
    if (category === 'watch' || category === 'glasses') {
      navigate(withPath('/store/ring'), { replace: true });
      return;
    }
    if (category) {
      const found = visibleCategories.find(c => c.id === category);
      if (found) {
        setActiveCategory(found);
      }
    }
  }, [category, navigate, withPath]);

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
    setRingMobileMenuOpen(false);
  }, [location.pathname]);

  /** 购买中心 · 智能戒指（/store/ring）移动端：专用顶栏，避免与全站 Navbar 叠两层 */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      const root = document.documentElement;
      if (isUnifiedStoreLayout(activeCategory.id) && mq.matches) {
        root.setAttribute('data-store-ring-mobile', '1');
      } else {
        root.removeAttribute('data-store-ring-mobile');
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      document.documentElement.removeAttribute('data-store-ring-mobile');
    };
  }, [activeCategory.id]);

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

  const activeVariant = (activeCategory as any).variants?.[activeThumb];
  const showPrice = activeCategory.id !== 'bracelet' && activeVariant?.showPrice !== false;
  const originalPrice = (selectedColor as { originalPrice?: number }).originalPrice ?? total * 1.4;

  const uCat = activeCategory.id as UnifiedStoreId;
  const useUnified = isUnifiedStoreLayout(activeCategory.id);
  const editorialContent = useUnified ? EDITORIAL_BY_CATEGORY[uCat] : null;
  const lifestyleCarouselCards = useUnified ? lifestyleCardsForCategory(uCat) : [];
  const sensorStripCards = useUnified ? SENSOR_STRIP_BY_CATEGORY[uCat] : [];
  const inboxPackaging = useUnified ? IN_THE_BOX_BY_CATEGORY[uCat] : null;
  const sensorSectionTitles = useUnified ? SENSOR_SECTION_COPY[uCat] : null;
  const comparisonBarRows = useUnified ? COMPARISON_BAR_ROWS[uCat] : [];

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-base font-sans text-fg-primary antialiased selection:bg-accent selection:text-ink pb-[100px] md:pb-[88px] ${
        useUnified ? 'max-md:pt-[calc(var(--nav-height)+3rem)]' : ''
      }`}
    >
      {/* FIXED SIDE NAVIGATION (DESKTOP) */}
      <div className="fixed left-10 top-1/2 z-[100] hidden w-[140px] -translate-y-1/2 flex-col items-center gap-6 rounded-[24px] bg-base/80 py-8 backdrop-blur-xl md:flex">
        <div className="flex flex-col items-center gap-2 w-full px-4">
          {visibleCategories.map(cat => {
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
      
      {/* TOP NAVIGATION FOR MOBILE — 购买中心四品类统一顶栏 */}
      {useUnified ? (
        <header className="top-nav md:hidden fixed top-0 left-0 right-0 z-[10000] border-b border-[#1A1A1A] bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px]">
          <div className="flex h-[var(--nav-height)] items-center justify-between px-6">
            <Link
              to={withPath('/')}
              className="text-2xl font-normal tracking-[1px] text-fg-primary"
              onClick={() => setRingMobileMenuOpen(false)}
            >
              Awak Health
            </Link>
            <button
              type="button"
              aria-label={ringMobileMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={ringMobileMenuOpen}
              className="cursor-pointer border-none bg-transparent p-2 text-white/80"
              onClick={() => setRingMobileMenuOpen((o) => !o)}
            >
              {ringMobileMenuOpen ? (
                <X className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
              ) : (
                <Menu className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
              )}
            </button>
          </div>
          <div className="cat-scroll hide-scrollbar flex items-center gap-2 overflow-x-auto px-6 pb-3">
            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                to={withPath(cat.path)}
                className={`cat-btn shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-normal transition-colors ${
                  activeCategory.id === cat.id ? 'active bg-white text-ink' : 'bg-white/12 text-white/70 hover:bg-white/18 hover:text-white'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <AnimatePresence>
            {ringMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/10 bg-[#080808]"
              >
                <div className="flex max-h-[min(70vh,520px)] flex-col gap-6 overflow-y-auto p-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setRingMobileMenuOpen(false)}
                      className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="关闭菜单"
                    >
                      <X className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <span className="text-xs uppercase tracking-widest text-white/40">{t('nav.hardware')}</span>
                    <div className="grid gap-3 pl-4">
                      {NAV_HARDWARE_ITEMS.map((hw) => (
                        <Link
                          key={hw.id}
                          to={withPath(hw.path)}
                          className="flex flex-col gap-1 rounded-lg py-1 text-left transition-colors hover:bg-white/5"
                          onClick={() => setRingMobileMenuOpen(false)}
                        >
                          <span className="text-sm font-normal text-fg-primary">{t(`navHw.${hw.id}.title`)}</span>
                          <span className="text-[11px] font-normal leading-snug text-white/40">
                            {t(`navHw.${hw.id}.desc`)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-white/10" role="separator" />
                  <div className="grid gap-2">
                    {NAV_SECONDARY_PAGES.map((page) => (
                      <Link
                        key={page.key}
                        to={withPath(page.path)}
                        className={`rounded-lg py-2 pl-4 text-sm font-normal transition-colors ${
                          basePath === page.path ? 'text-white' : 'text-white/90 hover:text-white'
                        }`}
                        onClick={() => setRingMobileMenuOpen(false)}
                      >
                        {t(`nav.${page.key}`)}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      ) : null}

      {/* STICKY AD-TO-CART BAR */}
      <div className={`fixed top-0 left-0 right-0 h-[var(--nav-height)] bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.06)] z-[9998] flex items-center justify-between px-6 md:px-[170px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-4">
          <span className="text-sm font-normal text-white lg:text-base">{activeCategory.name}</span>
        </div>
        
        <div className="flex items-center gap-6">
          {showPrice && <span className="text-lg font-normal text-white">¥{total.toFixed(2)}</span>}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center justify-center rounded-full bg-white/10 px-8 py-2.5 text-sm font-normal text-white hover:bg-white/20"
          >
            加入购物车
          </button>
        </div>
      </div>

      {/* Configurator Section - PRODUCT HERO REWRITTEN */}
      <div className="relative flex flex-col bg-base md:flex-row">
        
        <div
          ref={heroRef}
          className={`relative flex min-h-screen flex-1 flex-col md:flex-row ${useUnified ? 'max-md:gap-y-0' : ''}`}
        >
          
          {/* LEFT: Product Images (55%) */}
        <div
          className={`relative z-10 flex w-full flex-col items-center justify-center md:w-[55%] ${
            useUnified ? 'max-md:px-3 md:px-8' : 'px-8'
          } ${
            useUnified
              ? 'max-md:pt-8 max-md:pb-[18px] md:py-[var(--block-gap)]'
              : 'py-[var(--block-gap)]'
          }`}
        >
          {useUnified ? (
            <>
              <div className="relative mx-auto w-full max-w-[min(92vw,300px)] md:max-w-[245px]">
                <div
                  className="group relative flex aspect-square w-full cursor-zoom-in items-center justify-center"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeCategory.id + selectedColor.id + activeThumb}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      src={
                        (activeCategory as any).variants?.[activeThumb]?.colors
                          ? selectedColor.img ||
                            (activeCategory as any).variants?.[activeThumb]?.img ||
                            activeCategory.img
                          : (activeCategory as any).variants?.[activeThumb]?.img || activeCategory.img
                      }
                      alt={activeCategory.name}
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  <div className="pointer-events-none absolute top-4 right-4 rounded-full border-none bg-white/10 p-2 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-5 w-5 text-white/70" strokeWidth={1.75} aria-hidden />
                  </div>
                </div>
              </div>

              {/* 移动端：缩略图叠在大图左侧，左缘与页面内容区对齐（max-md:px-3 = 12px）；桌面：大图下方横排 */}
              <div
                role="tablist"
                aria-label="产品图切换"
                className="z-20 flex max-md:absolute max-md:left-0 max-md:top-1/2 max-md:translate-x-6 max-md:-translate-y-1/2 max-md:flex-col max-md:gap-3 max-md:items-center md:static md:mt-[12px] md:translate-x-0 md:translate-y-0 md:flex-row md:justify-center md:gap-4"
              >
                {((activeCategory as any).variants || []).map((v: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={activeThumb === idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveThumb(idx);
                    }}
                    className={`overflow-hidden rounded-lg shadow-md ring-1 transition-all max-md:bg-black/35 max-md:backdrop-blur-md max-md:ring-white/25 md:bg-transparent md:shadow-none md:ring-0 ${
                      activeThumb === idx
                        ? 'opacity-100 ring-white/50 md:ring-transparent'
                        : 'opacity-60 hover:opacity-100 md:opacity-50'
                    } h-11 w-11 max-md:h-[48.4px] max-md:w-[48.4px] md:h-14 md:w-14`}
                  >
                    <img
                      src={v.img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className={`h-full w-full bg-white/5 object-contain transition-transform ${
                        activeCategory.id === 'ring' && v?.name?.includes('唯一定制款')
                          ? 'scale-[1.25]'
                          : activeCategory.id === 'bracelet' && v?.name?.includes('金属定制款')
                            ? 'scale-[0.72]'
                            : 'scale-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex w-full max-w-[500px] flex-col items-center justify-center">
              <div
                className="group relative flex aspect-square w-full max-w-[500px] cursor-zoom-in items-center justify-center"
                onClick={() => setIsLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeCategory.id + selectedColor.id + activeThumb}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    src={
                      (activeCategory as any).variants?.[activeThumb]?.colors
                        ? selectedColor.img ||
                          (activeCategory as any).variants?.[activeThumb]?.img ||
                          activeCategory.img
                        : (activeCategory as any).variants?.[activeThumb]?.img || activeCategory.img
                    }
                    alt={activeCategory.name}
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                <div className="pointer-events-none absolute top-4 right-4 rounded-full border-none bg-white/10 p-2 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-5 w-5 text-white/70" strokeWidth={1.75} aria-hidden />
                </div>
              </div>

              <div className="mt-8 flex gap-4" role="tablist" aria-label="产品图切换">
                {((activeCategory as any).variants || []).map((v: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={activeThumb === idx}
                    onClick={() => setActiveThumb(idx)}
                    className={`h-[80px] w-[80px] overflow-hidden rounded-lg border transition-all ${
                      activeThumb === idx ? 'border-white' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={v.img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className={`h-full w-full bg-white/5 object-contain transition-transform ${
                        activeCategory.id === 'ring' && v?.name?.includes('唯一定制款')
                          ? 'scale-[1.25]'
                          : activeCategory.id === 'bracelet' && v?.name?.includes('金属定制款')
                            ? 'scale-[0.72]'
                            : 'scale-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Purchasing Info (45%) */}
        <div className="relative w-full border-none bg-base text-fg-primary md:w-[45%]">
          <div
            className={`md:sticky md:top-[var(--nav-height)] md:h-[calc(100vh-var(--nav-height))] overflow-y-auto px-8 md:px-12 lg:px-16 hide-scrollbar ${
              useUnified
                ? 'max-md:pt-0 max-md:pb-[clamp(32px,8vw,80px)] md:py-[var(--block-gap)]'
                : 'py-[var(--block-gap)]'
            }`}
          >
            
            {/* ① 产品标识行 */}
            <div className={`flex flex-col gap-2 ${useUnified ? 'mb-4' : 'mb-6'}`}>
              {!useUnified && (
                <span className="text-[length:var(--text-label)] uppercase tracking-[0.2em] text-[#6E6E73]">Awak Health</span>
              )}
              <h1
                className={`font-normal text-[#FFFFFF] ${
                  useUnified
                    ? 'text-[24px] leading-[1.15]'
                    : 'text-[length:var(--text-h1)] leading-[var(--leading-title)]'
                }`}
              >
                {(activeCategory as any).variants?.[activeThumb]?.name ||
                  (useUnified ? activeCategory.name : `${activeCategory.name} Awak Health`)}
              </h1>
              {!useUnified && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-white/80 text-white/80" />
                    ))}
                  </div>
                  <span className="font-mono text-[length:var(--text-small)] text-[#86868B]">4.9 (2,847条评价)</span>
                </div>
              )}
            </div>

            {/* ② 价格区 */}
            {showPrice && (
              <div
                className={`flex flex-col ${
                  useUnified
                    ? 'mb-4 py-0'
                    : 'my-4 border-b border-t border-[rgba(255,255,255,0.08)] py-4'
                }`}
              >
                <div className="mb-1 flex items-baseline">
                  <span className="text-[length:var(--text-hero)] font-normal tabular-nums leading-none text-[#FFFFFF]">¥{total.toFixed(2)}</span>
                  <span className="text-[length:var(--text-h3)] text-[#6E6E73] line-through ml-3 tabular-nums leading-none">¥{originalPrice.toFixed(2)}</span>
                  <span className="ml-3 -translate-y-1 rounded-[var(--r-sm)] bg-white/10 px-2 py-[2px] text-[11px] font-normal text-white">限时优惠</span>
                </div>
                <span className="text-[12px] text-[#86868B] tracking-tight">或每月仅需 ¥{(total / 3).toFixed(2)}，分3期免息</span>
              </div>
            )}

            {/* ③ 颜色选择器 */}
            {activeCategory.id === 'ring' && (activeCategory as any).variants?.[activeThumb]?.colors ? (
              <div className="mb-5 mt-0">
                <div className="mb-3 flex items-center gap-2">
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
            {activeCategory.id === 'ring' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] text-white/40">戒圈尺寸</span>
                  <button onClick={() => setIsSizeGuideOpen(true)} className="text-[13px] text-white/60 hover:underline">尺寸指南</button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {[7, 8, 9, 10, 11, 12, 13].map(size => {
                    const outOfStock = false;
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={outOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`relative h-10 rounded-full flex items-center justify-center text-[12px] font-mono transition-colors ${
                          outOfStock ? 'border border-white/10 text-white/25 cursor-not-allowed overflow-hidden' :
                          isSelected ? 'border-2 border-white bg-white/10 text-white font-normal' :
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
            )}

            {/* ⑤ CTA 操作区 */}
            <div className="mb-6 mt-[var(--block-gap)] flex flex-col gap-[var(--card-gap)]">
              <button
                type="button"
                onClick={() => navigate(withPath('/checkout'))}
                className="w-full rounded-full bg-accent px-8 py-4 text-center text-base font-normal text-ink transition-all hover:brightness-110 active:scale-[0.98]"
              >
                立即购买
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full rounded-full border-none bg-white/10 px-8 py-4 text-center text-base font-normal text-white shadow-none transition-all hover:bg-white/20"
              >
                加入购物车
              </button>
              <div className="flex items-center justify-center gap-2">
                <Box className="h-4 w-4 text-fg-tertiary" strokeWidth={1.75} aria-hidden />
                <span className="text-[length:var(--text-small)] text-[#86868B]">免费配送 • 7天无理由退货</span>
              </div>
            </div>

            {/* ⑥ 信任背书小图标栏 */}
            <div className="grid grid-cols-4 gap-2 mb-10 pt-8 border-t border-[rgba(255,255,255,0.08)]">
              {[
                { icon: Shield, text: '官方质保' },
                { icon: RefreshCw, text: '以旧换新' },
                { icon: Zap, text: '7天价保' },
                { icon: Lock, text: '数据加密' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 text-[#6E6E73]">
                  <item.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  <span className="text-[11px] whitespace-nowrap">{item.text}</span>
                </div>
              ))}
            </div>

            {/* ⑦ 产品简介折叠（Accordion） */}
            <div className="border-t border-[rgba(255,255,255,0.08)]">
              <HeroAccordion title="产品简介" defaultOpen>
                <ul className="text-[#86868B] text-sm space-y-2 list-disc pl-4">
                  {(useUnified ? HERO_ACCORDION_BULLETS[uCat] : []).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </HeroAccordion>
              <HeroAccordion title="配送说明">
                <p className="text-[#86868B] text-sm">所有订单由顺丰速运免费配送，预计工作日内发货将在 1-3 天送达。如有延迟将另行通知。</p>
              </HeroAccordion>
              <HeroAccordion title="退换政策">
                <p className="text-[#86868B] text-sm">自您签收商品起 7 日内，如商品及包装完好（不影响二次销售），我们提供无理由退货服务。</p>
              </HeroAccordion>
              <HeroAccordion title="产品证书">
                <p className="text-[#86868B] text-sm">本产品已符合FCC、CE、RoSH等强制标准，并符合 ISO 13485 医疗器械质量管理体系标准。</p>
              </HeroAccordion>
            </div>
            
          </div>
        </div>
      </div>
      </div>
      {/* SECTION 4: IN THE BOX — 购买中心（手表/眼镜不展示） */}
      {inboxPackaging && activeCategory.id !== 'watch' && activeCategory.id !== 'glasses' && (
        <section className="section-light bg-white px-5 pb-0 pt-16 text-[#111] md:px-6 lg:px-[170px]">
          <div className="sr mx-auto mb-8 flex max-w-[1200px] flex-col gap-3">
            <div className="flex justify-center">
              <img
                src={inboxPackaging.heroImage}
                alt=""
                className="h-auto w-full max-w-[min(100%,520px)] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="sr-delay-1">
              <p className="m-0 mb-2.5 text-[11px] font-normal uppercase tracking-[0.1em] text-[#8A8A8A]">
                包装内容 IN THE BOX
              </p>
              <h2 className="editorial-text m-0 text-[26px] font-normal leading-[1.1] tracking-[-0.04em] text-[#111]">
                每一件，都经过精心设计
              </h2>
            </div>
          </div>

          <div className="inbox-grid sr mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-8 pb-16">
            {inboxPackaging.cells.map((cell) => (
              <div
                key={cell.title}
                className="inbox-cell flex flex-col rounded-[10px] bg-[#F5F5F7] p-4 md:p-5"
              >
                {cell.leading}
                <p className="m-0 mb-1 text-[14px] font-normal tracking-[-0.02em] text-[#111]">{cell.title}</p>
                <p className="m-0 text-[12px] leading-[1.55] text-[#8A8A8A]">{cell.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: 生活方式横向卡片（与智能戒指同版式，文案/图按品类） */}
      {editorialContent && (
        <>
          <section className="sr bg-white px-5 pb-12 pt-[var(--nav-height)] text-[#0A0A0A] md:px-[170px]">
            <div className="mx-auto max-w-[1400px]">
              <h2 className="mb-4 text-[26px] font-normal leading-[1.1] tracking-[-0.04em] text-[#0A0A0A]">
                {editorialContent.h2Line1}
                <br />
                {editorialContent.h2Line2}
              </h2>
              <p className="m-0 max-w-2xl text-sm leading-[1.7] text-[#666]">{editorialContent.body}</p>
              <div className="mt-6 flex flex-nowrap gap-2 overflow-x-auto hide-scrollbar pb-0.5">
                {editorialContent.chips.map((label) => (
                  <span
                    key={label}
                    className="shrink-0 rounded-full bg-[#F5F5F5] px-3.5 py-1.5 text-xs font-normal tracking-[-0.01em] text-[#111]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="relative mt-10" key={activeCategory.id}>
                <div
                  ref={lifestyleScrollRef}
                  className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {lifestyleCarouselCards.map((card) => (
                    <article
                      key={card.title}
                      className="flex w-[min(85vw,300px)] shrink-0 snap-start flex-col"
                    >
                      <div className="aspect-[100/99] w-full overflow-hidden rounded-[12px] bg-[#F5F5F5]">
                        <img
                          src={card.image}
                          alt=""
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h3 className="mt-3 text-base font-normal leading-snug text-[#0A0A0A]">{card.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#666]">{card.desc}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    aria-label="上一张"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-white text-[#0A0A0A] transition-colors hover:bg-black/[0.03]"
                    onClick={() => scrollRingLifestyle('left')}
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="下一张"
                    className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-white text-[#0A0A0A] transition-colors hover:bg-black/[0.03]"
                    onClick={() => scrollRingLifestyle('right')}
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* SECTION 5: SENSORS — 购买中心 · 智能戒指：06 六核传感器（设计稿） */}
      {sensorSectionTitles && (
        <section className="sr bg-white pt-16 pb-12 text-[#0A0A0A]">
          <div className="px-5 md:px-6 lg:px-[170px]" style={{ marginBottom: 32 }}>
            <p className="m-0 mb-3 text-[11px] font-normal uppercase tracking-[0.1em] text-[#8A8A8A]">
              {sensorSectionTitles.kicker}
            </p>
            <h2 className="m-0 text-[26px] font-normal leading-[1.15] tracking-[-0.04em] text-[#0A0A0A]">
              {sensorSectionTitles.title}
            </h2>
          </div>

          <div className="relative">
            <div
              ref={sensorScrollRef}
              className="sensor-scroll flex gap-4 overflow-x-auto hide-scrollbar px-5 pb-4 md:px-6 lg:px-[170px]"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sensorStripCards.map((def, i) => {
                const Icon = def.icon;
                const isRingLastNoSr = activeCategory.id === 'ring' && i === sensorStripCards.length - 1;
                const animClass =
                  isRingLastNoSr
                    ? ''
                    : `sr${i >= 1 && i <= 4 ? ` sr-delay-${i}` : ''}`;
                return (
                  <div
                    key={`${def.tag}-${def.title}`}
                    className={`sensor-card w-[min(208px,62.4vw)] shrink-0 rounded-[10px] bg-[#F5F5F7] p-5 ${animClass}`.trim()}
                  >
                    <span className="sensor-tag mb-3 inline-block text-[10px] font-normal uppercase tracking-wider text-[#111]">
                      {def.tag}
                    </span>
                    <div className="mb-3 flex h-4 items-center">
                      <Icon className="text-[#111]" size={16} strokeWidth={2} aria-hidden />
                    </div>
                    <p className="m-0 mb-1.5 text-[14px] font-normal tracking-[-0.02em] text-[#111]">{def.title}</p>
                    <p className="m-0 text-[11px] leading-[1.6] text-[#8A8A8A]">
                      {def.line1}
                      <br />
                      {def.line2}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 px-5 pb-2 md:px-6 lg:px-[170px]">
              <button
                type="button"
                aria-label="向左滑动传感器卡片"
                className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-white text-[#0A0A0A] transition-colors hover:bg-black/[0.03]"
                onClick={() => scrollRingSensors('left')}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="向右滑动传感器卡片"
                className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-white text-[#0A0A0A] transition-colors hover:bg-black/[0.03]"
                onClick={() => scrollRingSensors('right')}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <MetricsAccordion className="px-5 md:px-6 lg:px-[170px] pt-6" />
        </section>
      )}

      {/* SECTION 6: TECH SPECS — 购买中心 · 智能戒指：07 SPEC TABLE（设计稿） */}
      {activeCategory.id === 'ring' ? (
        <section className="sr bg-white px-5 pb-12 pt-16 text-[#0A0A0A] md:px-[170px]">
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-3 text-[11px] font-normal uppercase tracking-[0.1em] text-[#8A8A8A]">技术参数</p>
            <h2 className="mb-9 text-[26px] font-normal leading-[1.2] tracking-[-0.04em] text-[#0A0A0A]">
              每一个参数，
              <br />
              都服务于真实使用场景
            </h2>
            <table className="spec-table w-full border-collapse">
              <tbody>
                <tr className="border-b border-black/[0.08]">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A] md:w-[36%] md:min-w-[120px]">
                    重量
                  </td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">约 5.0 克</td>
                </tr>
                <tr className="border-b border-black/[0.08]">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A]">材质</td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">
                    外层表面材质钛合金
                    <br />
                    主体材质环氧树脂
                  </td>
                </tr>
                <tr className="border-b border-black/[0.08]">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A]">续航时间</td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">
                    连接蓝牙 4–7 天左右，具体根据使用频率而定
                  </td>
                </tr>
                <tr className="border-b border-black/[0.08]">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A]">充电方式</td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">
                    铝合金标配充电仓（USB 额定 5V）
                  </td>
                </tr>
                <tr className="border-b border-black/[0.08]">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A]">防水等级</td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">IP68，可游泳佩戴</td>
                </tr>
                <tr className="border-b border-black/[0.08]">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A]">蓝牙</td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">Bluetooth 5.2 低功耗</td>
                </tr>
                <tr className="last:border-b-0">
                  <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A]">兼容</td>
                  <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">iOS 14+ / Android 10+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="sr bg-white px-5 pb-12 pt-16 text-[#0A0A0A] md:px-[170px]">
          <div className="mx-auto max-w-[1200px]">
            <p className="mb-3 text-[11px] font-normal uppercase tracking-[0.1em] text-[#8A8A8A]">技术参数</p>
            <h2 className="mb-9 text-[26px] font-normal leading-[1.2] tracking-[-0.04em] text-[#0A0A0A]">
              每一个参数，
              <br />
              都服务于真实使用场景
            </h2>
            <TechSpecsTable categoryId={activeCategory.id} variant="minimal" />
          </div>
        </section>
      )}

      {/* SECTION 7: DATA COMPARISON — 购买中心 · 智能戒指：08 90-DAY（设计稿），全品类统一版式 */}
      {comparisonBarRows.length > 0 && (
        <section
          id="compSection"
          className="section-dark border-t border-white/5 bg-[#080808] px-5 pt-16 pb-14 text-white md:px-[170px]"
        >
          <div className="mx-auto max-w-[1200px]">
            <p className="m-0 mb-3 text-[11px] font-normal uppercase tracking-[0.1em] text-white/30">使用效果</p>
            <h2 className="m-0 mb-2.5 text-[26px] font-normal leading-[1.15] tracking-[-0.04em] text-white">
              90天后，
              <br />
              你的身体会变得更显着不同
            </h2>
            <p className="m-0 mb-10 text-[11px] leading-[1.5] tracking-[0.01em] text-white/25">
              数据来源：Awak Health 用户长期运动与健康追踪数据（模拟结构化整理）
            </p>

            <div
              className="mb-3 grid gap-3 text-[11px] text-white/25"
              style={{ gridTemplateColumns: '1fr auto auto' }}
            >
              <span className="tracking-[0.02em]">改善指标</span>
              <span className="text-right tracking-[0.02em]">使用前</span>
              <span className="min-w-[72px] text-right tracking-[0.02em]">使用90天后</span>
            </div>

            {comparisonBarRows.map((row) => (
              <div
                key={row.metric}
                className="comparison-row grid items-center gap-3 border-b border-white/[0.06] py-3.5 last:border-b-0"
                style={{ gridTemplateColumns: '1fr auto auto' }}
              >
                <div>
                  <span className="comp-metric text-[14px] font-medium tracking-[-0.02em] text-white">{row.metric}</span>
                  <div
                    className="mt-1.5 h-[3px] w-[120px] overflow-hidden rounded-[2px]"
                    style={{ background: 'rgba(255,255,255,.08)' }}
                  >
                    <div
                      className="bar-fill h-full rounded-[2px] bg-accent"
                      style={
                        {
                          ['--w' as string]: row.w,
                          animationDelay: row.delay,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
                <span className="comp-before text-right text-[11px] tabular-nums text-white/45">{row.before}</span>
                <span className="comp-after min-w-[72px] text-right text-[11px] font-normal tabular-nums text-white">
                  {row.after}
                </span>
              </div>
            ))}

            <button
              type="button"
              className="btn-buy mt-10 w-full max-w-[280px] rounded-full bg-accent px-6 py-3.5 text-center text-[14px] font-normal text-ink transition-colors hover:brightness-105 active:scale-[0.98]"
              onClick={() => navigate(withPath('/checkout'))}
            >
              开始改变 · 立即购买
            </button>
          </div>
        </section>
      )}

      {/* SECTION 10: FAQ — 与智能戒指同一版式，文案按品类 */}
      <section className="sr bg-[#FAFAFA] px-5 pb-12 pt-16 text-[#0A0A0A]">
        <div className="mx-auto max-w-[1000px]">
          <p className="mb-3 text-[11px] font-normal uppercase tracking-[0.1em] text-[#8A8A8A]">常见问题 FAQ</p>
          <h2 className="mb-8 text-[26px] font-normal tracking-[-0.04em] text-[#0A0A0A]">你可能想知道的</h2>
          <div id="faqContainer">
            {(allFaqs[uCat] || allFaqs.ring).map((faq, i) => (
              <RingStoreFaqItem key={i} q={faq.q} a={faq.a} />
            ))}
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
            className="fixed top-0 right-0 w-full md:w-[400px] h-screen bg-dark-01 z-[70] flex flex-col text-brand-white border-none"
          >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-thin text-brand-white">购物车</h2>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1 text-brand-white transition-opacity hover:opacity-70"
                  aria-label="关闭"
                >
                  <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
              
              <div className="p-6 bg-accent/10 border-b border-white/10 flex items-center justify-center">
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
                      {showPrice && <span className="font-mono font-normal text-accent">¥{total.toFixed(2)}</span>}
                    </div>
                    <span className="text-sm text-neutral-gray mt-1">{activeCategory.id === 'ring' ? selectedColor.enName : ''}</span>
                    <span className="text-sm text-neutral-gray">{sizingOption === 'kit' ? '免费指围套装' : `尺寸 ${selectedSize}`}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex flex-col gap-4">
                {showPrice && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">小计</span>
                    <span className="font-mono text-xl font-normal">¥{total.toFixed(2)}</span>
                  </div>
                )}
                <button 
                  onClick={() => navigate(withPath('/checkout'))}
                  className="w-full rounded-full bg-accent py-4 text-sm font-normal uppercase tracking-widest text-ink transition-colors hover:brightness-105"
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
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[20000] flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] w-full max-w-[640px] rounded-[20px] p-8 md:p-12 relative text-white"
            >
              <button 
                type="button"
                onClick={() => setIsSizeGuideOpen(false)} 
                className="absolute right-6 top-6 z-10 text-white/50 transition-colors hover:text-white"
                aria-label="关闭"
              >
                <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </button>
              
              <h3 className="mb-4 text-3xl font-normal text-[#FFFFFF]">尺寸指南</h3>
              <p className="text-[#86868B] mb-8 leading-relaxed">
                推荐使用纸条测量无名指根部最宽处，测量后对照下表。如果你的手指尺寸在两个码数之间，推荐选择较大一码。
              </p>
              
              <div className="w-full overflow-x-auto pb-4">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-[#6E6E73] text-left text-sm uppercase">
                      <th className="py-3 font-medium">尺寸（US）</th>
                      <th className="py-3 font-medium">内径（mm）</th>
                      <th className="py-3 font-medium">对应指围（mm）</th>
                      <th className="py-3 font-medium">适合手指类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'US 7', d: '17.3', c: '54.4', t: '标准细' },
                      { size: 'US 8', d: '18.2', c: '57.1', t: '标准' },
                      { size: 'US 9', d: '19.0', c: '59.7', t: '标准偏粗' },
                      { size: 'US 10', d: '19.8', c: '62.2', t: '粗手指' },
                      { size: 'US 11', d: '20.6', c: '64.6', t: '较粗手指' },
                      { size: 'US 12', d: '21.4', c: '67.2', t: '更粗手指' },
                      { size: 'US 13', d: '22.2', c: '69.7', t: '宽手指' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                        <td className="py-4 font-normal text-accent">{row.size}</td>
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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="absolute right-8 top-8 z-10 text-white/50 transition-colors hover:text-white"
              aria-label="关闭"
            >
              <X className="h-8 w-8" strokeWidth={1.75} aria-hidden />
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
            className="mb-4 block text-sm font-normal uppercase tracking-widest text-white/40"
          >
            {label}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-5xl font-normal leading-tight tracking-tighter text-white md:text-7xl"
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
  <div className={`relative rounded-[24px] overflow-hidden flex flex-col justify-end p-8 group hover:-translate-y-1.5 transition-transform duration-300 ${image ? 'min-h-[300px]' : 'bg-white border-none h-full'}`}>
    {image && (
      <>
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </>
    )}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <h3 className={`${image ? 'text-white' : 'text-black'} pr-2 text-[24px] font-normal tracking-tight`}>{title}</h3>
        {tag && (
          <span className={`${image ? 'bg-white/20 text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'} shrink-0 rounded-[var(--r-full)] px-3 py-1 text-[13px] font-normal tracking-wider backdrop-blur-sm`}>
            {tag}
          </span>
        )}
      </div>
      <p className={`${image ? 'text-white/90' : 'text-[#86868B]'} text-[15px] leading-[var(--leading-body)]`}>{desc}</p>
    </div>
  </div>
);

const MetricsAccordion: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const categories = [
    { title: "心血管健康", items: ["静息心率 (RHR)", "心率变异率 (HRV)", "最大摄氧量 (VO₂ Max估算)", "恢复心率", "血氧饱和度 (SpO₂)", "心肺异常提醒"] },
    { title: "睡眠深度分析", items: ["睡眠总时长", "睡眠评分 (0-100)", "REM 快速眼动期比例", "深度睡眠比例", "入睡时间 / 醒来次数", "夜间呼吸率", "夜间皮肤温度基线偏差"] },
    { title: "活动与代谢", items: ["每日卡路里消耗 (基础+活动)", "步数与距离", "活动强度检测", "久坐提醒", "代谢当量 (METs)", "运动状态自动识别"] },
    { title: "身体与精神体征", items: ["全天压力指数", "恢复水平评分", "女性生理期预测", "基础体温趋势", "异常体征报警"] },
  ];
  return (
    <div className={className}>
      <div className="flex justify-center">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-black/10 bg-transparent px-8 py-4 text-base font-normal text-[#000000] transition-all hover:bg-black/[0.03] hover:scale-[1.02]"
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
            <div className="mt-6 rounded-[20px] bg-[#F5F5F7] p-6 md:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, i) => (
                <div key={i} className="rounded-[24px] bg-white p-8 border-none">
                  <h4 className="mb-6 text-[15px] font-normal tracking-wide text-[#000000]">{cat.title}</h4>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- IN THE BOX ---
const BoxItem = ({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) => (
  <div className="bg-[#FFFFFF] border-none rounded-[24px] p-8 flex flex-col items-start text-left hover:scale-[1.02] transition-all">
    <div className="w-8 h-8 text-[#1D1D1F] mb-6">{icon}</div>
    <span className="mb-2 text-[24px] font-normal tracking-tight text-[#000000]">{name}</span>
    <span className="text-[#6E6E73] text-[length:var(--text-small)] leading-[var(--leading-body)]">{desc}</span>
  </div>
);

const TechSpecsTable = ({
  categoryId,
  variant = 'legacy',
}: {
  categoryId: string;
  variant?: 'legacy' | 'minimal';
}) => {
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

  const getSpecs = () => {
    switch (categoryId) {
      case 'bracelet':
        return braceletSpecs;
      case 'watch':
        return watchSpecs;
      case 'glasses':
        return glassesSpecs;
      default:
        return [];
    }
  };

  const specs = getSpecs();

  if (variant === 'minimal') {
    if (!specs.length) return null;
    return (
      <table className="spec-table w-full border-collapse">
        <tbody>
          {specs.map((item, i) => (
            <tr key={i} className={i === specs.length - 1 ? 'last:border-b-0' : 'border-b border-black/[0.08]'}>
              <td className="spec-label align-top py-4 pr-6 text-[14px] font-medium text-[#0A0A0A] md:w-[36%] md:min-w-[120px]">
                {item.k}
              </td>
              <td className="spec-val align-top py-4 text-[14px] leading-[1.6] text-[#0A0A0A]/85">
                {item.v}
                {item.hint ? <div className="mt-1 text-[13px] text-[#0A0A0A]/55">{item.hint}</div> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="w-full flex flex-col border-none text-sm md:text-base">
      <div className="flex bg-black p-4 text-white md:p-6">
        <div className="w-[30%] min-w-[100px]">规格项目</div>
        <div className="w-[70%]">参数值</div>
      </div>
      {specs.map((item, i) => (
        <div key={i} className={`flex p-4 md:p-6 items-center ${i % 2 === 0 ? 'bg-black/5' : 'bg-transparent'}`}>
          <div className="w-[30%] min-w-[100px] font-normal text-black">{item.k}</div>
          <div className="w-[70%] text-black/80">{item.v}{item.hint && <div className="text-black/40 text-[12px] mt-1">{item.hint}</div>}</div>
        </div>
      ))}
    </div>
  );
};

const CertCard = ({ name, inst, desc }: { name: string, inst: string, desc: string }) => (
  <div className="flex flex-col text-center items-center">
    <span className="w-12 h-12 bg-black/5 text-[#080808] rounded-full flex items-center justify-center font-normal text-xl mb-4">✓</span>
    <h4 className="mb-1 text-lg font-normal">{name}</h4>
    <span className="text-xs font-mono text-[#080808]/50 mb-3 block">{inst}</span>
    <p className="text-sm text-[#080808]/60 leading-relaxed max-w-[240px]">{desc}</p>
  </div>
);
