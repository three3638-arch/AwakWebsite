import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';
import { BarChart3, Zap, Users, EyeOff, Eye, MessageSquare, Smartphone, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  
  // Hash can be '#login', '#register', '#forgot'
  const currentHash = location.hash || '#login';
  const mode = ['#login', '#register', '#forgot'].includes(currentHash) ? currentHash : '#login';

  // Common Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Register Specific States
  const [agreed, setAgreed] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  
  // Password Strength
  const [strength, setStrength] = useState(0);
  const [strengthClass, setStrengthClass] = useState('');
  const [strengthLabel, setStrengthLabel] = useState('');

  // Login Specific
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password Specific
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotRedirectCount, setForgotRedirectCount] = useState(3);
  
  // Process States
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fadeout, setFadeout] = useState(false);

  // Sync mode changes
  const setMode = (newMode: string) => {
    // Reset states
    setPassword(''); setConfirmPassword(''); setIdentifier(''); setCode('');
    setSuccess(false); setLoading(false); setForgotStep(1); setCountdown(0);
    navigate(`${withPath('/auth')}${newMode}`, { replace: true });
  };

  // Countdown timer for SMS
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const startCountdown = () => {
    if (countdown === 0) setCountdown(60);
  };

  // Check password strength
  useEffect(() => {
    if (!password) { 
      setStrength(0); setStrengthClass(''); setStrengthLabel(''); 
      return; 
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    
    const s = Math.min(4, Math.max(1, score));
    setStrength(s);
    if (s === 1) { setStrengthClass('weak'); setStrengthLabel('弱'); }
    else if (s === 2) { setStrengthClass('medium'); setStrengthLabel('中'); }
    else if (s === 3) { setStrengthClass('good'); setStrengthLabel('较强'); }
    else if (s === 4) { setStrengthClass('strong'); setStrengthLabel('强'); }
  }, [password]);

  // Forgot Password Redirect
  useEffect(() => {
    if (forgotStep === 3) {
      const timer = setInterval(() => {
        setForgotRedirectCount(c => {
          if (c <= 1) {
            clearInterval(timer);
            setMode('#login');
            return 3;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [forgotStep]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setFadeout(true);
        setTimeout(() => {
          const params = new URLSearchParams(location.search);
          if (params.get('plan') === 'plus_trial') navigate(withPath('/checkout?plan=plus'));
          else navigate(withPath('/'));
        }, 300);
      }, 500);
    }, 800);
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setPrivacyError(false);
    if (!agreed) {
      setPrivacyError(true);
      return;
    }
    if (password !== confirmPassword) {
      alert("两次密码不一致");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setRegisterModalOpen(true);
      }, 500);
    }, 800);
  };

  // Handle Forgot Next Step
  const handleForgotNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 2 && password !== confirmPassword) {
      alert("两次密码不一致");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotStep(s => s + 1);
    }, 800);
  };

  const renderPasswordStrength = () => (
    <div className="mt-2">
      <div className="password-strength">
        <div className={`strength-bar ${strength >= 1 ? strengthClass : ''}`} />
        <div className={`strength-bar ${strength >= 2 ? strengthClass : ''}`} />
        <div className={`strength-bar ${strength >= 3 ? strengthClass : ''}`} />
        <div className={`strength-bar ${strength >= 4 ? strengthClass : ''}`} />
      </div>
      {strength > 0 && <div className={`strength-text ${strengthClass}`}>密码强度: {strengthLabel}</div>}
    </div>
  );

  return (
    <>
      <style>{`
        /* Tab 切换器 - 登录/注册 */
        .auth-tabs {
          display: flex;
          border-bottom: 1px solid #D0D0CC;
          margin-bottom: 32px;
        }
        .auth-tab {
          padding: 12px 0;
          margin-right: 32px;
          font-size: 16px;
          font-weight: 500;
          color: #9B9B96;
          cursor: pointer;
          position: relative;
          transition: color 200ms;
        }
        .auth-tab.active {
          color: #080808;
          font-weight: 700;
        }
        .auth-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: #080808;
        }

        /* 验证码发送按钮 */
        .send-code-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          color: #080808;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-left: 1px solid #D0D0CC;
        }
        .send-code-btn.counting {
          color: #9B9B96;
          cursor: not-allowed;
        }

        /* 密码强度可视化 - 4格进度条 */
        .password-strength {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }
        .strength-bar {
          height: 3px;
          flex: 1;
          background: #D0D0CC;
          border-radius: 2px;
          transition: background 300ms;
        }
        .strength-bar.weak   { background: #FF4D4D; }
        .strength-bar.medium { background: #FF7A35; }
        .strength-bar.good   { background: #C8FF00; }
        .strength-bar.strong { background: #22C97A; }

        /* 强度文字提示 */
        .strength-text { font-size: 12px; margin-top: 6px; }
        .strength-text.weak   { color: #FF4D4D; }
        .strength-text.medium { color: #FF7A35; }
        .strength-text.good   { color: #C8FF00; }
        .strength-text.strong { color: #22C97A; }

        /* 自定义 Checkbox */
        .checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }
        .checkbox-box {
          width: 18px; height: 18px;
          border: 1.5px solid #CCCCCC;
          border-radius: 4px;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 200ms;
          display: flex; align-items: center; justify-content: center;
        }
        .checkbox-box.checked {
          background: #080808;
          border-color: #080808;
        }
        .checkbox-box.checked::after {
          content: '';
          width: 5px; height: 8px;
          border: 2px solid #FFFFFF;
          border-top: none; border-left: none;
          transform: rotate(45deg) translate(-1px,-1px);
        }
        .checkbox-box.error {
          border-color: #FF4D4D;
        }

        /* 三步进度条 */
        .steps-indicator {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }
        .step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #CCCCCC;
          transition: all 300ms;
        }
        .step-dot.active { background: #080808; width: 24px; border-radius: 4px; }
        .step-dot.done { background: #22C97A; }
        .step-line {
          flex: 1; height: 1px;
          background: #D0D0CC;
          margin: 0 8px;
        }
        .step-line.done { background: #22C97A; }
      `}</style>
      
      <div className={`h-screen w-full flex overflow-hidden transition-opacity duration-300 ${fadeout ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Left Column - Form Area (45%) */}
        <div className="w-full md:w-[45%] h-full bg-[#F5F5F3] overflow-y-auto overflow-x-hidden relative flex flex-col items-center pt-[90px]">
          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[400px] px-6 mt-20 md:mt-[18vh] pb-12 flex flex-col justify-start"
          >
            
            {mode !== '#forgot' ? (
              <>
                {/* Tabs */}
                <div className="auth-tabs">
                  <div 
                    onClick={() => setMode('#login')}
                    className={`auth-tab ${mode === '#login' ? 'active' : ''}`}
                  >
                    登录
                  </div>
                  <div 
                    onClick={() => setMode('#register')}
                    className={`auth-tab ${mode === '#register' ? 'active' : ''}`}
                  >
                    注册
                  </div>
                </div>

                {/* Login Mode Content */}
                {mode === '#login' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Third party quick logins */}
                    <div className="space-y-4 mb-8">
                      <button className="w-full h-[52px] bg-[#07C160] hover:bg-[#06A852] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-[16px]">
                        <MessageSquare className="w-5 h-5" /> 微信扫码登录
                      </button>
                      <button className="w-full h-[52px] bg-[#E5E5E3] hover:bg-[#DCDCDA] text-[#080808] rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-[16px]">
                        <Smartphone className="w-5 h-5" /> 手机号快捷登录
                      </button>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-[#D0D0CC]"></div>
                      <span className="text-[12px] text-[#9B9B96] whitespace-nowrap">── 或使用账号密码 ──</span>
                      <div className="flex-1 h-px bg-[#D0D0CC]"></div>
                    </div>

                    {/* Manual Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <input 
                          type="text" 
                          placeholder="邮箱或手机号" 
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full h-[52px] px-4 bg-white rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="请输入密码" 
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-[52px] pl-4 pr-12 bg-white rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B96] hover:text-[#080808]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div 
                          className="checkbox-wrap !gap-2"
                          onClick={() => setRememberMe(!rememberMe)}
                        >
                          <div className={`checkbox-box !w-4 !h-4 !mt-0 transition-colors ${rememberMe ? 'checked' : ''}`} />
                          <span className="text-[13px] text-[#444444]">记住我（30天内自动登录）</span>
                        </div>
                        <button type="button" onClick={() => setMode('#forgot')} className="text-[13px] text-[#080808] hover:underline">
                          忘记密码？
                        </button>
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading || success}
                        className={`w-full h-[52px] rounded-lg font-bold text-white transition-colors duration-300 mt-6 flex items-center justify-center gap-2 text-[16px] ${
                          success ? 'bg-[#22C97A]' : 'bg-[#080808] hover:bg-[#1A1A1A] disabled:opacity-70'
                        }`}
                      >
                        {success ? (
                          <><Check className="w-5 h-5" /> 登录成功</>
                        ) : loading ? '登录中...' : '登录'}
                      </button>
                      
                      <div className="text-center pt-4">
                        <button type="button" onClick={() => setMode('#register')} className="text-[14px] text-[#444444]">
                          没有账号？ <span className="text-[#080808] font-bold">立即注册</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Register Mode Content */}
                {mode === '#register' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <input 
                          type="tel" 
                          placeholder="你的手机号" 
                          required
                          pattern="[0-9]{11}"
                          title="请输入11位手机号"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full h-[52px] px-4 bg-white rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="请输入验证码" 
                          required
                          pattern="[0-9]{6}"
                          title="请输入6位验证码"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full h-[52px] px-4 bg-white rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={startCountdown}
                          disabled={countdown > 0}
                          className={`send-code-btn ${countdown > 0 ? 'counting' : ''}`}
                        >
                          {countdown > 0 ? `重新发送 (${countdown}s)` : '获取验证码'}
                        </button>
                      </div>

                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="设置密码" 
                          required
                          minLength={8}
                          maxLength={20}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-[52px] pl-4 pr-12 bg-white border border-[#D0D0CC] rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:border-[#080808] focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-[26px] -translate-y-1/2 text-[#9B9B96] hover:text-[#080808]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {renderPasswordStrength()}
                      </div>

                      <div className="relative mt-2">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="再次输入密码" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-[52px] pl-4 pr-12 bg-white border border-[#D0D0CC] rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:border-[#080808] focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B96] hover:text-[#080808]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="pt-4">
                        <div 
                          className="checkbox-wrap"
                          onClick={() => { setAgreed(!agreed); setPrivacyError(false); }}
                        >
                          <div className={`checkbox-box ${agreed ? 'checked' : ''} ${privacyError ? 'error' : ''}`} />
                          <div className="text-[13px] text-[#444444] leading-[1.6]">
                            我已阅读并同意 Awak Health 的 
                            <Link to={withPath('/legal/terms')} className="text-[#080808] hover:underline mx-1" onClick={e=>e.stopPropagation()}>用户服务协议</Link>
                            和
                            <Link to={withPath('/legal/privacy')} className="text-[#080808] hover:underline mx-1" onClick={e=>e.stopPropagation()}>隐私政策</Link>
                          </div>
                        </div>
                        {privacyError && <div className="text-[#FF4D4D] text-[12px] mt-1 pl-7">请阅读并同意用户协议</div>}
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading || success}
                        className={`w-full h-[52px] rounded-lg font-bold text-white transition-colors duration-300 mt-2 flex items-center justify-center gap-2 text-[16px] ${
                          // Ensure we don't show success green until api call clears
                          success ? 'bg-[#22C97A]' : 'bg-[#080808] hover:bg-[#1A1A1A] disabled:opacity-70'
                        }`}
                      >
                        {success ? (
                          <><Check className="w-5 h-5" /> 注册成功</>
                        ) : loading ? '注册中...' : '注册'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
               /* Forgot Password Mode */
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                 <button onClick={() => setMode('#login')} className="text-[#9B9B96] hover:text-[#080808] mb-8 text-[14px] flex items-center gap-1 font-medium transition-colors">
                    &larr; 返回登录
                 </button>
                 
                 <h2 className="text-[28px] font-bold text-[#080808] mb-2">重置密码</h2>
                 <p className="text-[#444444] text-[14px] mb-8">我们将帮您快速找回账号控制权。</p>
                 
                 {/* 3 Step Indicator */}
                 <div className="steps-indicator">
                    <div className={`step-dot ${forgotStep >= 1 ? forgotStep > 1 ? 'done' : 'active' : ''}`} />
                    <div className={`step-line ${forgotStep > 1 ? 'done' : ''}`} />
                    <div className={`step-dot ${forgotStep >= 2 ? forgotStep > 2 ? 'done' : 'active' : ''}`} />
                    <div className={`step-line ${forgotStep > 2 ? 'done' : ''}`} />
                    <div className={`step-dot ${forgotStep >= 3 ? 'done' : ''}`} />
                 </div>

                 {forgotStep === 1 && (
                   <form autoFocus onSubmit={handleForgotNext} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                     <h3 className="text-[18px] font-bold text-[#080808] mb-4">第一步：验证身份</h3>
                     <input 
                        type="text" 
                        placeholder="注册手机号或邮箱" 
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full h-[52px] px-4 bg-white border border-[#D0D0CC] rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:border-[#080808] focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                      />
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="请输入验证码" 
                          required
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full h-[52px] px-4 bg-white border border-[#D0D0CC] rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:border-[#080808] focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={startCountdown}
                          disabled={countdown > 0}
                          className={`send-code-btn ${countdown > 0 ? 'counting' : ''}`}
                        >
                          {countdown > 0 ? `重新发送 (${countdown}s)` : '获取验证码'}
                        </button>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-[52px] bg-[#080808] hover:bg-[#1A1A1A] text-white rounded-lg font-bold transition-colors mt-4 disabled:opacity-70 text-[16px]"
                      >
                        {loading ? '验证中...' : '下一步'}
                      </button>
                   </form>
                 )}

                 {forgotStep === 2 && (
                   <form onSubmit={handleForgotNext} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                     <h3 className="text-[18px] font-bold text-[#080808] mb-4">第二步：设置新密码</h3>
                     <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="新密码" 
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-[52px] pl-4 pr-12 bg-white border border-[#D0D0CC] rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:border-[#080808] focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-[26px] -translate-y-1/2 text-[#9B9B96] hover:text-[#080808]"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {renderPasswordStrength()}
                      </div>
                      <div className="relative mt-2">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="确认新密码" 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-[52px] pl-4 pr-12 bg-white border border-[#D0D0CC] rounded-lg text-[#080808] placeholder:text-[#9B9B96] focus:outline-none focus:border-[#080808] focus:ring-4 focus:ring-black/5 transition-all text-[15px]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B9B96] hover:text-[#080808]"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-[52px] bg-[#080808] hover:bg-[#1A1A1A] text-white rounded-lg font-bold transition-colors mt-6 disabled:opacity-70 text-[16px]"
                      >
                        {loading ? '提交中...' : '确认修改'}
                      </button>
                   </form>
                 )}

                 {forgotStep === 3 && (
                   <div className="text-center animate-in fade-in zoom-in-95 duration-300 py-12 flex flex-col items-center">
                     <div className="w-16 h-16 bg-[#22C97A] rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-[#22C97A]/20">
                       <Check className="w-8 h-8" />
                     </div>
                     <h3 className="text-[22px] font-bold text-[#080808] mb-2">密码已重置</h3>
                     <p className="text-[#9B9B96] mb-8">正在为您跳转回登录界面 ({forgotRedirectCount}s)</p>
                     
                     <button 
                       onClick={() => setMode('#login')}
                       className="w-full h-[52px] bg-[#080808] hover:bg-[#1A1A1A] text-white rounded-lg font-bold transition-colors text-[16px]"
                     >
                       立即登录
                     </button>
                   </div>
                 )}
               </div>
            )}

            {/* Footer Copyright */}
            <div className="mt-auto pt-24 text-center text-[#9B9B96] text-[12px] font-medium tracking-wide">
              &copy; {new Date().getFullYear()} Awak Health. All rights reserved.
            </div>
          </motion.div>
        </div>

        {/* Right Column - Brand Area (55% hidden on mobile) */}
        <div className="hidden md:flex w-[55%] h-full bg-[#080808] relative items-center justify-center overflow-hidden">
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden text-clip whitespace-nowrap">
            <span className="text-[300px] font-black text-white opacity-[0.02] leading-none tracking-tighter select-none">Awak Health</span>
          </div>
          
          {/* Content Container */}
          <div className="relative z-10 w-full max-w-[520px] px-8">
             <h2 className="text-[54px] font-bold text-white leading-[1.1] mb-12 tracking-[-1.5px] font-sans">
               加入100万+<br />健康感知者
             </h2>

             <div className="space-y-8 mb-16">
               <div className="flex gap-5 items-start">
                 <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                   <BarChart3 className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-[16px] font-bold text-white mb-2 tracking-wide">完整健康数据历史</h3>
                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] leading-[1.6]">365天数据无限回看，追踪你的长期健康趋势，构建个体生理模型。</p>
                 </div>
               </div>

               <div className="flex gap-5 items-start">
                 <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                   <Zap className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-[16px] font-bold text-white mb-2 tracking-wide">AI个性化解读</h3>
                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] leading-[1.6]">不只是冷冰冰的数字，而是你能理解的健康洞察与切实可行的改善意见。</p>
                 </div>
               </div>

               <div className="flex gap-5 items-start">
                 <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                   <Users className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="text-[16px] font-bold text-white mb-2 tracking-wide">家庭健康管理</h3>
                    <p className="text-[14px] text-[rgba(255,255,255,0.6)] leading-[1.6]">一个账号，守护全家健康。不论距离多远，随时了解家人的安全与状态。</p>
                 </div>
               </div>
             </div>

             {/* Social Proof */}
             <div className="flex items-center gap-4 pt-8 border-t border-[rgba(255,255,255,0.1)]">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#080808] bg-gradient-to-br from-gray-400 to-gray-600" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#080808] bg-gradient-to-br from-gray-500 to-gray-700" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#080808] bg-gradient-to-br from-gray-600 to-gray-800" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#080808] bg-[#1A1A1A] flex items-center justify-center text-[10px] text-white font-medium">+</div>
                </div>
                <span className="text-[14px] text-[rgba(255,255,255,0.6)] font-medium tracking-wide">
                  已有 1,024,847 人在使用
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Register Success Welcome Modal */}
      <AnimatePresence>
        {registerModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#1A1A1A] rounded-[20px] p-8 md:p-12 w-full max-w-[480px] flex flex-col items-center text-center relative border border-[#2E2E2E]"
            >
              <div className="w-10 h-10 mb-8 border border-white/20 rounded-lg flex items-center justify-center">
                 <span className="text-white font-extrabold text-sm tracking-widest">Awak Health</span>
              </div>
              
              <h3 className="text-white text-[32px] font-bold mb-4 tracking-[-1px]">欢迎加入 Awak Health</h3>
              <p className="text-[#9B9B96] leading-[1.6] mb-8">
                你的账号已创建成功。接下来，戴上 AWAK Ring 并打开 Awak Health App，开始你的健康旅程。
              </p>

              {/* Coupon Gift */}
              <div className="w-full bg-[rgba(200,255,0,0.05)] border border-[#C8FF00]/30 rounded-xl p-4 mb-10 flex items-center justify-between group hover:bg-[rgba(200,255,0,0.1)] transition-colors cursor-pointer">
                <div className="flex flex-col items-start">
                  <span className="text-[#C8FF00] font-bold text-[14px] mb-1">新注册用户专属福利</span>
                  <span className="text-white/80 text-[13px]">首单优惠券 ¥50 已发放到你的账户</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#C8FF00] group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="w-full space-y-4">
                <button 
                  onClick={() => {
                    setRegisterModalOpen(false);
                    navigate(withPath('/account')); // Navigate to personal center or completion page
                  }}
                  className="w-full h-[52px] bg-[#C8FF00] text-[#080808] font-bold text-[16px] rounded-lg hover:bg-white transition-colors"
                >
                  开始探索
                </button>
                <button 
                  onClick={() => {
                    setRegisterModalOpen(false);
                    navigate(withPath('/'));
                  }}
                  className="text-[#9B9B96] hover:text-white transition-colors text-sm font-medium"
                >
                  稍后再说
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
