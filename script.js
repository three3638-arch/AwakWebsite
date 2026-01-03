// ============================================
// 滚动动画
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));
    
    // 初始化移动端菜单
    initMobileMenu();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化语言切换
    initLanguageSwitch();
});

// ============================================
// 移动端菜单
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // 点击导航链接后关闭菜单
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// ============================================
// 平滑滚动
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 语言切换
// ============================================
const translations = {
    zh: {
        lang: '中文',
        shopNow: '立即购买',
        tagline: '觉醒意志',
        promo: {
            text: '🎉 限时优惠：Awak Will Ring 现享$219特价 | 免费全球配送'
        },
        nav: {
            shop: '商店',
            technology: '技术',
            science: '科学',
            support: '支持'
        },
        hero: {
            title: '全球最佳<br>睡眠监测<br>智能戒指',
            subtitle: '专业级健康监测，全天候舒适佩戴',
            feature1: {
                title: '24/7 舒适佩戴',
                desc: '全天候舒适'
            },
            feature2: {
                title: '专业级监测',
                desc: '专业级监测'
            },
            feature3: {
                title: '真连续追踪',
                desc: '真连续追踪'
            },
            feature4: {
                title: 'AI驱动健康指标',
                desc: 'AI驱动健康指标'
            },
            buyNow: '立即购买',
            learnMore: '了解更多'
        },
        tech: {
            title: '先进技术',
            subtitle: '突破性技术，重新定义智能健康监测',
            adaptive: {
                title: '自适应设计',
                desc: '6#-13#美标戒指尺寸，智能适配不同手指粗细，确保全天候舒适佩戴体验。',
                feature1: '✓ 无感佩戴，24小时舒适',
                feature2: '✓ 自动调节，完美贴合',
                feature3: '✓ 防水设计，运动无忧'
            },
            sensor: {
                title: 'Advanced SST™ Ultra 2.0 传感器',
                desc: '专业级传感器技术，支持血氧、心率、睡眠等多项健康指标监测，准确率对标医疗标准AASM。',
                metric1: '心率准确率',
                metric2: '血氧准确率',
                metric3: '睡眠监测',
                value3: 'AASM标准'
            }
        },
        health: {
            title: '全方位健康监测',
            subtitle: '全方位健康管理，让数据成为你的健康伙伴',
            sleep: {
                title: '睡眠管理',
                desc: '深度睡眠分期分析、睡眠呼吸暂停风险评估，助你了解睡眠质量。'
            },
            exercise: {
                title: '运动监测',
                desc: '支持跑步、骑行等多种运动模式，实时心率反馈，科学指导训练强度。'
            },
            stress: {
                title: '压力管理',
                desc: 'HRV（心率变异性）分析+个性化放松建议，帮助管理日常压力。'
            },
            women: {
                title: '女性健康',
                desc: '生理周期追踪，贴心记录女性健康数据，提供个性化健康建议。'
            },
            disclaimer: '*非医疗诊断工具',
            // learnMore: '了解更多 →'
        },
        proof: {
            title: '专家信赖',
            subtitle: '专业认可，值得信赖',
            quote1: '"FDA认证的唯一戒指血氧仪，准确率达到了医疗级标准。"',
            author1: '— 耶鲁大学睡眠医学教授',
            quote2: '"Awak Will的连续监测能力为健康研究提供了前所未有的数据支持。"',
            author2: '— 斯坦福大学健康数据专家',
            cert1: {
                title: 'FDA认证',
                desc: '医疗级血氧监测'
            },
            cert2: {
                title: '20+ 研究论文',
                desc: '科学验证'
            },
            cert3: {
                title: '专利设计',
                desc: '创新技术'
            },
            cert4: {
                title: '4.8/5 用户评分',
                desc: '10,000+ 用户'
            }
        },
        shop: {
            title: '选择最适合你的智能戒指',
            subtitle: '选择最适合你的智能戒指',
            table: {
                feature: '功能',
                sensor: '传感器精度',
                standard: '标准版',
                ultra: 'Ultra 2.0升级版',
                adaptive: '自适应设计',
                spo2: '血氧监测',
                heart: '心率监测',
                sleep: '睡眠分析',
                warranty: '保修期',
                basic: '基础保修',
                extra: '额外3个月',
                price: '价格',
                from: '起',
                discount: '限时优惠'
            },
            buy2: '立即购买 Awak Will Ring',
            buyMax: '立即购买 Awak Will Ring Pro'
        },
        footer: {
            about: {
                title: '关于 Awak Will',
                us: '关于我们',
                story: '品牌故事',
                contact: '联系我们',
                careers: '加入我们'
            },
            support: {
                title: '支持服务',
                faq: '常见问题',
                tracking: '订单追踪',
                returns: '退换政策',
                warranty: '保修服务'
            },
            resources: {
                title: '资源中心',
                guide: '用户指南',
                developers: '开发者合作',
                api: 'API文档',
                community: '社区论坛'
            },
            legal: {
                title: '法律条款',
                privacy: '隐私政策',
                terms: '服务条款',
                cookies: 'Cookie政策',
                compliance: '合规声明'
            },
            app: {
                download: '在 App Store 下载',
                get: '在 Google Play 获取'
            }
        }
    },
    en: {
        lang: 'English',
        shopNow: 'Shop Now',
        tagline: 'Awaken Will',
        promo: {
            text: '🎉 Limited Time Offer: Awak Will Ring Pro Now $219 | Free Global Shipping'
        },
        nav: {
            shop: 'Shop',
            technology: 'Technology',
            science: 'Science',
            support: 'Support'
        },
        hero: {
            title: 'WORLD\'S BEST<br>SLEEP-MONITORING<br>SMART RING',
            subtitle: 'Professional-grade health monitoring with 24/7 comfort',
            feature1: {
                title: '24/7 Comfortable Wear',
                desc: '24/7 Comfortable'
            },
            feature2: {
                title: 'Professional-grade Monitoring',
                desc: 'Professional-grade Monitoring'
            },
            feature3: {
                title: 'True Continuous Tracking',
                desc: 'True Continuous Tracking'
            },
            feature4: {
                title: 'AI-Powered Health Metrics',
                desc: 'AI-Powered Health Metrics'
            },
            buyNow: 'Shop Now',
            learnMore: 'Learn More'
        },
        tech: {
            title: 'Advanced Technology',
            subtitle: 'Breakthrough technology redefining smart health monitoring',
            adaptive: {
                title: 'Adaptive Design',
                desc: 'US ring sizes 6#-13#, intelligently adapts to different finger sizes, ensuring 24/7 comfortable wearing experience.',
                feature1: '✓ Seamless wear, 24-hour comfort',
                feature2: '✓ Auto-adjustment, perfect fit',
                feature3: '✓ Waterproof design, worry-free exercise'
            },
            sensor: {
                title: 'Advanced SST™ Ultra 2.0 Sensor',
                desc: 'Professional-grade sensor technology supporting multiple health metrics including SpO2, heart rate, sleep monitoring, with accuracy matching medical standard AASM.',
                metric1: 'Heart Rate Accuracy',
                metric2: 'SpO2 Accuracy',
                metric3: 'Sleep Monitoring',
                value3: 'AASM Standard'
            }
        },
        health: {
            title: 'Comprehensive Health Monitoring',
            subtitle: 'Comprehensive health management, making data your health partner',
            sleep: {
                title: 'Sleep Management',
                desc: 'Deep sleep stage analysis, sleep apnea risk assessment, helping you understand sleep quality.'
            },
            exercise: {
                title: 'Exercise Monitoring',
                desc: 'Supports multiple exercise modes including running and cycling, real-time heart rate feedback, scientifically guiding training intensity.'
            },
            stress: {
                title: 'Stress Management',
                desc: 'HRV (Heart Rate Variability) analysis + personalized relaxation suggestions, helping manage daily stress.'
            },
            women: {
                title: 'Women\'s Health',
                desc: 'Menstrual cycle tracking, thoughtful recording of women\'s health data, providing personalized health advice.'
            },
            disclaimer: '*Not a medical diagnostic tool',
            learnMore: 'Learn More →'
        },
        proof: {
            title: 'Trusted by Experts',
            subtitle: 'Professional recognition, trustworthy',
            quote1: '"The only FDA-certified ring pulse oximeter with medical-grade accuracy."',
            author1: '— Yale University Sleep Medicine Professor',
            quote2: '"Awak Will\'s continuous monitoring capability provides unprecedented data support for health research."',
            author2: '— Stanford University Health Data Expert',
            cert1: {
                title: 'FDA Certified',
                desc: 'Medical-grade SpO2 monitoring'
            },
            cert2: {
                title: '20+ Research Papers',
                desc: 'Scientific validation'
            },
            cert3: {
                title: 'Patented Design',
                desc: 'Innovative technology'
            },
            cert4: {
                title: '4.8/5 User Rating',
                desc: '10,000+ Users'
            }
        },
        shop: {
            title: 'Choose Your Perfect Ring',
            subtitle: 'Choose your perfect smart ring',
            table: {
                feature: 'Feature',
                sensor: 'Sensor Accuracy',
                standard: 'Standard',
                ultra: 'Ultra 2.0 Upgrade',
                adaptive: 'Adaptive Design',
                spo2: 'SpO2 Monitoring',
                heart: 'Heart Rate Monitoring',
                sleep: 'Sleep Analysis',
                warranty: 'Warranty',
                basic: 'Basic Warranty',
                extra: 'Extra 3 Months',
                price: 'Price',
                from: 'from',
                discount: 'Limited Offer'
            },
            buy2: 'Buy Awak Will Ring',
            buyMax: 'Buy Awak Will Ring Pro'
        },
        footer: {
            about: {
                title: 'About Awak Will',
                us: 'About Us',
                story: 'Brand Story',
                contact: 'Contact Us',
                careers: 'Join Us'
            },
            support: {
                title: 'Support Services',
                faq: 'FAQ',
                tracking: 'Order Tracking',
                returns: 'Returns Policy',
                warranty: 'Warranty Service'
            },
            resources: {
                title: 'Resource Center',
                guide: 'User Guide',
                developers: 'Developer Partnership',
                api: 'API Documentation',
                community: 'Community Forum'
            },
            legal: {
                title: 'Legal Terms',
                privacy: 'Privacy Policy',
                terms: 'Terms of Service',
                cookies: 'Cookie Policy',
                compliance: 'Compliance Statement'
            },
            app: {
                download: 'Download on the',
                get: 'Get it on'
            }
        }
    }
};

let currentLanguage = localStorage.getItem('language') || 'zh';

function translatePage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[lang];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                translation = null;
                break;
            }
        }
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // 更新语言按钮文本
    const langText = document.querySelector('.language-text');
    if (langText) {
        langText.textContent = translations[lang].lang;
    }
    
    // 更新HTML lang属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

function initLanguageSwitch() {
    const languageToggle = document.getElementById('languageToggle');
    
    if (languageToggle) {
        // 初始化语言
        translatePage(currentLanguage);
        
        // 点击切换语言
        languageToggle.addEventListener('click', () => {
            const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
            translatePage(newLang);
        });
    }
}

// ============================================
// Header滚动效果
// ============================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 14, 39, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 14, 39, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// 功能卡片悬停效果增强
// ============================================
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// 产品对比表格交互
// ============================================
const comparisonRows = document.querySelectorAll('.comparison-table tbody tr');
comparisonRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
});

// ============================================
// CTA按钮点击效果
// ============================================
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // 创建涟漪效果
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ============================================
// 视差滚动效果（可选）
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// 数字动画（用于统计数据）
// ============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 观察统计数字元素
const statElements = document.querySelectorAll('.comparison-item .value');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const value = entry.target.textContent;
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                entry.target.classList.add('animated');
                animateValue(entry.target, 0, numValue, 2000);
            }
        }
    });
}, { threshold: 0.5 });

statElements.forEach(el => statsObserver.observe(el));

// ============================================
// 表单验证（如果有表单）
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// 性能优化：图片懒加载（如果后续添加图片）
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// 控制台欢迎信息
// ============================================
console.log('%c Awak Will - 觉醒意志 ', 'background: #00D4FF; color: #0A0E27; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c 全球首款自适应智能戒指 ', 'color: #00D4FF; font-size: 14px;');

