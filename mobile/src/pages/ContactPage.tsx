import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    MessageSquare, 
    Mail, 
    Phone, 
    Users, 
    ChevronDown,
    ArrowDown,
    CheckCircle2,
    RotateCw,
    X,
    ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FooterSections from '../components/FooterSections';
import { useLocalePath } from '../hooks/useLocalePath';

// 4. Hero Section
const Hero = ({ onScrollToForm }: { onScrollToForm: () => void }) => (
    <section className="relative flex min-h-[480px] flex-col justify-end overflow-hidden bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#0A0A0A] pt-24 pb-12 md:min-h-screen">
        <div className="container-max relative z-10 grid min-h-[480px] w-full grid-cols-1 items-end pb-0 lg:grid-cols-2">
            <div className="max-w-[760px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="mt-4 mb-4 text-[32px] font-normal leading-[1.15] tracking-[-0.04em] text-white">
                        有任何问题<br />
                        我们随时在
                    </h1>
                    <p className="mb-3 max-w-[500px] text-[14px] font-normal leading-[1.6] text-white/70">
                        无论是购前咨询、售后服务还是合作提案，AWAK 团队平均在 4 小时内回复。
                    </p>
                    <span className="block text-[12px] font-normal text-white/55">
                        客服时间：周一至周日 9:00–21:00（北京时间）
                    </span>
                </motion.div>
            </div>
            
            {/* Decoration */}
            <div className="pointer-events-none absolute right-[-10%] top-1/2 hidden -translate-y-1/2 opacity-[0.04] lg:block">
                <Mail size={600} strokeWidth={1.5} className="text-white" />
            </div>
        </div>

        <motion.button 
            type="button"
            onClick={onScrollToForm}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/55 transition-colors hover:text-white/90"
            aria-label="滚动到表单"
        >
            <ArrowDown size={32} strokeWidth={1.5} />
        </motion.button>
    </section>
);

// 5. Entry Cards Section
const EntryCards = () => {
    const cards = [
        { 
            icon: MessageSquare, 
            title: '在线客服', 
            desc: '直接与客服专员对话，解答购前疑问和使用问题', 
            action: '立即开始对话 →',
            badge: '实时响应' 
        },
        { 
            icon: Mail, 
            title: '发送邮件', 
            desc: '详细描述你的问题，我们会在4小时内回复', 
            action: 'support@awakring.com',
            badge: '≤4小时回复' 
        },
        { 
            icon: Phone, 
            title: '电话咨询', 
            desc: '工作日致电，与专属顾问直接沟通', 
            action: '400-XXX-XXXX',
            badge: '工作日9:00-18:00' 
        },
        { 
            icon: Users, 
            title: '商务合作', 
            desc: '媒体采访、品牌合作、渠道代理等商务需求', 
            action: 'bd@awakring.com',
            badge: '≤24小时回复' 
        },
    ];

    return (
        <section className="bg-[#0D0D0D] py-[72px]">
            <div className="container-max grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="group flex min-h-[180px] cursor-pointer flex-col rounded-[12px] bg-[#161616] px-5 pb-6 pt-7 transition-colors hover:bg-[#1c1c1c]"
                    >
                        <card.icon className="h-6 w-6 text-white/45 transition-colors group-hover:text-white/80" strokeWidth={1.5} />
                        <h3 className="mt-[18px] text-[18px] font-normal text-white">{card.title}</h3>
                        <p className="mb-4 mt-2 line-clamp-2 text-[14px] font-normal leading-[1.6] text-white/55">{card.desc}</p>
                        <div className="mt-auto">
                            <span className="text-white font-normal text-[12px] block group-hover:underline">{card.action}</span>
                            <div className="response-badge">{card.badge}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

// 6. Form Section
const ContactContent = () => {
    const { withPath } = useLocalePath();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: '',
        orderId: '',
        message: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const formRef = useRef<HTMLDivElement>(null);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name || formData.name.length < 2 || /^\d+$/.test(formData.name)) {
            newErrors.name = '请输入有效的姓名';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '请输入正确的邮箱格式';
        }
        if (!formData.topic) {
            newErrors.topic = '请选择问题类型';
        }
        if (formData.topic === '售后服务' && !formData.orderId) {
            newErrors.orderId = '售后服务需提供订单号';
        }
        if (!formData.message || formData.message.length < 10) {
            newErrors.message = '描述需至少10个字符';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            const firstError = Object.keys(errors)[0];
            const el = document.getElementsByName(firstError)[0];
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setStatus('loading');
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setStatus('success');
    };

    return (
        <div className="flex flex-col gap-[72px] lg:flex-row lg:gap-[72px]">
            {/* Left: Form Area with AnimatePresence */}
            <div className="flex-1 max-w-[680px]">
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-[12px] bg-[#1A1A1A] px-5 pb-6 pt-7 text-center md:px-12 md:pb-12 md:pt-12"
                        >
                            <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(34,201,122,0.15)] text-[#22C97A]">
                                <CheckCircle2 size={32} strokeWidth={1.5} />
                            </div>
                            <h2 className="heading-m mb-4 text-white">消息已发送</h2>
                            <p className="body-m mb-2 text-white/70">我们已收到你的消息，将在 4 小时内通过邮件回复你（工作日）。</p>
                            <p className="body-m mb-8 font-mono text-white/70">工单编号：#AW{Math.floor(Math.random()*10000000)}</p>
                            <div className="mb-8 rounded-[12px] bg-[#0F0F0F] px-5 py-4">
                                <p className="caption text-[#9B9B96]">你可以凭工单编号在「我的账户 → 工单记录」中查看处理进度</p>
                            </div>
                            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                                <Link to={withPath('/')} className="btn-secondary">返回首页</Link>
                                <button className="btn-primary">查看我的工单</button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-[12px] bg-[#1A1A1A] px-5 pb-6 pt-7 md:px-12 md:pb-12 md:pt-12"
                        >
                            <h2 className="mb-6 text-[24px] font-normal tracking-[-0.03em] text-white">告诉我们你的问题</h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="form-label">姓名 <span className="required">*</span></label>
                                        <input 
                                            name="name"
                                            className={`form-input ${errors.name ? 'error' : formData.name ? 'success' : ''}`}
                                            placeholder="你的姓名"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                        {errors.name && <span className="form-error-msg">{errors.name}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="form-label">邮箱 <span className="required">*</span></label>
                                        <input 
                                            name="email"
                                            type="email"
                                            className={`form-input ${errors.email ? 'error' : formData.email ? 'success' : ''}`}
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                        {errors.email && <span className="form-error-msg">{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="form-label">手机号（可选）</label>
                                        <input 
                                            type="tel"
                                            className="form-input"
                                            placeholder="138 0000 0000"
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="form-label">问题类型 <span className="required">*</span></label>
                                        <select 
                                            name="topic"
                                            className={`form-input appearance-none pr-10 ${errors.topic ? 'error' : formData.topic ? 'success' : ''}`}
                                            value={formData.topic}
                                            onChange={e => setFormData({...formData, topic: e.target.value})}
                                        >
                                            <option value="">请选择问题类型</option>
                                            <option>购买咨询</option>
                                            <option>售后服务</option>
                                            <option>App使用</option>
                                            <option>账号问题</option>
                                            <option>发票申请</option>
                                            <option>媒体合作</option>
                                            <option>企业采购</option>
                                            <option>其他问题</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-[#9B9B96]" strokeWidth={1.5} />
                                        {errors.topic && <span className="form-error-msg">{errors.topic}</span>}
                                    </div>
                                </div>

                                {formData.topic === '售后服务' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2"
                                    >
                                        <label className="form-label">订单号 <span className="required">*</span></label>
                                        <input 
                                            name="orderId"
                                            className={`form-input ${errors.orderId ? 'error' : ''}`}
                                            placeholder="例：AW20241201XXXX"
                                            value={formData.orderId}
                                            onChange={e => setFormData({...formData, orderId: e.target.value})}
                                        />
                                        {errors.orderId && <span className="form-error-msg">{errors.orderId}</span>}
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="form-label">问题描述 <span className="required">*</span></label>
                                    <textarea 
                                        name="message"
                                        className={`form-input h-[160px] py-4 resize-none ${errors.message ? 'error' : ''}`}
                                        placeholder="请详细描述你的问题，越详细我们回复越精准..."
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                    {errors.message && <span className="form-error-msg">{errors.message}</span>}
                                </div>

                                <button 
                                    disabled={status === 'loading'}
                                    className="btn-primary mt-[22px]"
                                >
                                    {status === 'loading' ? (
                                        <div className="flex items-center gap-2">
                                            <RotateCw className="h-5 w-5 animate-spin" strokeWidth={1.5} />
                                            <span>发送中...</span>
                                        </div>
                                    ) : (
                                        '发送消息'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Side Info */}
            <div className="lg:w-[40%] space-y-[72px]">
                <div className="space-y-8">
                    <h4 className="text-[18px] font-normal text-white">联系前，也许能帮到你</h4>
                    <div className="space-y-3">
                        {[
                            '如何确定我的戒指尺寸？',
                            '关于 Android 版本的连接问题',
                            '物流进度实时查询指南'
                        ].map((q, i) => (
                            <div key={i} className="group flex cursor-pointer items-center justify-between rounded-[12px] bg-[#161616] px-5 py-4 transition-colors hover:bg-[#1c1c1c]">
                                <span className="text-[#9B9B96] transition-colors group-hover:text-white">{q}</span>
                                <ExternalLink size={16} className="text-white/40" strokeWidth={1.5} />
                            </div>
                        ))}
                    </div>
                    <Link to={withPath('/')} className="group flex items-center gap-2 text-[14px] font-normal text-white">
                        <span>查看完整 FAQ</span>
                        <ChevronDown className="h-4 w-4 -rotate-90 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                    </Link>
                </div>

                <div className="space-y-8 pt-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="caption mb-2 block text-[#9B9B96]">平均回复时间</span>
                            <span className="text-white font-normal text-2xl">3.5 小时</span>
                        </div>
                        <div>
                            <span className="caption mb-2 block text-[#9B9B96]">已处理工单</span>
                            <span className="text-white font-normal text-2xl">47,832+</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-[#2E2E2E] overflow-hidden">
                                    <img src={`https://picsum.photos/seed/avatar${i}/100`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/80 font-normal">12人专属服务团队</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ContactPage() {
    const formSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleScrollToForm = () => {
        formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="contact-ds-scope bg-[#0D0D0D] font-sans selection:bg-accent selection:text-ink antialiased">
            <Hero onScrollToForm={handleScrollToForm} />
            <EntryCards />
            
            <section ref={formSectionRef} className="bg-[#0F0F0F] py-[72px]">
                <div className="container-max">
                    <ContactContent />
                </div>
            </section>
            
            <FooterSections />
        </main>
    );
}
