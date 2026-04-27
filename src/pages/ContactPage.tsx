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

// 4. Hero Section
const Hero = ({ onScrollToForm }: { onScrollToForm: () => void }) => (
    <section className="min-height-[60vh] flex items-center bg-[#080808] noise-texture relative overflow-hidden pt-24">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 items-center w-full min-h-[500px]">
            <div className="max-w-[760px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="display-l text-white mt-4 mb-8">
                        有任何问题<br />
                        我们随时在
                    </h1>
                    <p className="body-l text-white/75 max-w-[500px] mb-6">
                        无论是购前咨询、售后服务还是合作提案，AWAK 团队平均在 4 小时内回复。
                    </p>
                    <span className="caption text-[#9B9B96] block">
                        客服时间：周一至周日 9:00–21:00（北京时间）
                    </span>
                </motion.div>
            </div>
            
            {/* Decoration */}
            <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.04] pointer-events-none">
                <Mail size={600} strokeWidth={1} className="text-white" />
            </div>
        </div>

        <motion.button 
            onClick={onScrollToForm}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#9B9B96] hover:text-[#C8FF00] transition-colors"
        >
            <ArrowDown size={32} />
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
        <section className="bg-[#080808] py-24">
            <div className="container-max grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="bg-[#1A1A1A] p-8 rounded-[16px] min-h-[200px] flex flex-col group cursor-pointer hover:-translate-y-[6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] transition-all duration-300"
                    >
                        <card.icon className="w-6 h-6 text-[#666666] group-hover:text-[#C8FF00] transition-colors" />
                        <h3 className="text-white font-bold text-lg mt-6">{card.title}</h3>
                        <p className="body-m text-[#9B9B96] mt-2 mb-6 line-clamp-2">{card.desc}</p>
                        <div className="mt-auto">
                            <span className="text-white font-bold text-sm block group-hover:underline">{card.action}</span>
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
        <div className="flex flex-col lg:flex-row gap-12">
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
                            className="bg-[#1A1A1A] p-12 rounded-[20px] text-center border border-[#2E2E2E]"
                        >
                            <div className="w-14 h-14 bg-[rgba(34,201,122,0.15)] text-[#22C97A] rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="heading-m text-white mb-4">消息已发送</h2>
                            <p className="body-m text-white/70 mb-2">我们已收到你的消息，将在 4 小时内通过邮件回复你（工作日）。</p>
                            <p className="body-m text-white/70 mb-8 font-mono">工单编号：#AW{Math.floor(Math.random()*10000000)}</p>
                            <div className="bg-[#0F0F0F] p-4 rounded-lg mb-8">
                                <p className="caption text-[#9B9B96]">你可以凭工单编号在「我的账户 → 工单记录」中查看处理进度</p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Link to="/" className="btn-secondary">返回首页</Link>
                                <button className="btn-primary">查看我的工单</button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-[#1A1A1A] rounded-[20px] p-8 md:p-12 border border-[#2E2E2E]"
                        >
                            <h2 className="text-white text-[28px] font-bold mb-10">告诉我们你的问题</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <ChevronDown className="absolute right-4 top-[42px] w-4 h-4 text-[#9B9B96] pointer-events-none" />
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
                                    className="btn-primary mt-4"
                                >
                                    {status === 'loading' ? (
                                        <div className="flex items-center gap-2">
                                            <RotateCw className="w-5 h-5 animate-spin" />
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
            <div className="lg:w-[40%] space-y-12">
                <div className="space-y-6">
                    <h4 className="text-white font-bold text-xl">联系前，也许能帮到你</h4>
                    <div className="space-y-4">
                        {[
                            '如何确定我的戒指尺寸？',
                            '关于 Android 版本的连接问题',
                            '物流进度实时查询指南'
                        ].map((q, i) => (
                            <div key={i} className="bg-[#1A1A1A] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-[#222222] transition-all">
                                <span className="text-[#9B9B96] group-hover:text-white transition-colors">{q}</span>
                                <ExternalLink size={16} className="text-[#666666]" />
                            </div>
                        ))}
                    </div>
                    <Link to="/" className="text-white font-bold flex items-center gap-2 group">
                        <span>查看完整 FAQ</span>
                        <ChevronDown className="-rotate-90 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="pt-12 border-t border-[#1A1A1A] space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <span className="caption text-[#9B9B96] block mb-2">平均回复时间</span>
                            <span className="text-white font-bold text-2xl">3.5 小时</span>
                        </div>
                        <div>
                            <span className="caption text-[#9B9B96] block mb-2">已处理工单</span>
                            <span className="text-white font-bold text-2xl">47,832+</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] bg-[#2E2E2E] overflow-hidden">
                                    <img src={`https://picsum.photos/seed/avatar${i}/100`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-white/80 font-medium">12人专属服务团队</span>
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
        <main className="bg-[#080808] selection:bg-[#C8FF00] selection:text-black font-sans">
            <Hero onScrollToForm={handleScrollToForm} />
            <EntryCards />
            
            <section ref={formSectionRef} className="bg-[#0F0F0F] py-24">
                <div className="container-max">
                    <ContactContent />
                </div>
            </section>
            
            <FooterSections />
        </main>
    );
}
