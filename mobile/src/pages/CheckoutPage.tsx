import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, ArrowRight, Copy, Check, Download, 
  Box, CreditCard, ChevronLeft, ShieldCheck, 
  MessageSquare, LayoutGrid, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalePath } from '../hooks/useLocalePath';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  // 1: Information, 2: Payment, 3: Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State - Step 1
  const [newsletter, setNewsletter] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressTag, setAddressTag] = useState('家');
  const [phone, setPhone] = useState('');

  // Form State - Step 2
  const [paymentMethod, setPaymentMethod] = useState('wechat'); // wechat, alipay, card, install, cod
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState<null | 'success' | 'fail'>(null);

  // Price Calculation
  const subtotal = 2118.60;
  const discount = couponStatus === 'success' ? 50 : 0;
  const total = subtotal - discount;

  // Format phone number
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3 && val.length <= 7) val = val.slice(0, 3) + ' ' + val.slice(3);
    else if (val.length > 7) val = val.slice(0, 3) + ' ' + val.slice(3, 7) + ' ' + val.slice(7, 11);
    setPhone(val);
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'AWAK50') {
      setCouponStatus('success');
    } else if (coupon.length > 0) {
      setCouponStatus('fail');
    }
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       setStep(3);
       window.scrollTo(0,0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-base text-fg-primary font-sans antialiased selection:bg-white/20 selection:text-inherit pt-[var(--nav-height-expanded)]">
      <style>{`
        .checkout-steps {
          display: flex; align-items: center; justify-content: center;
          padding: clamp(20px, 4vw, 30px) 24px;
          border-bottom: var(--divider-width) solid var(--divider-on-dark);
          background: rgb(15 15 15 / 0.92);
          backdrop-filter: var(--nav-blur);
        }
        .checkout-step { display: flex; align-items: center; gap: 10px; }
        .step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 400; transition: all 300ms;
        }
        .step-num.inactive { background: rgb(255 255 255 / 0.08); color: rgb(255 255 255 / 0.45); }
        .step-num.active   { background: var(--color-accent); color: var(--color-ink); }
        .step-num.done     { background: rgb(255 255 255 / 0.92); color: var(--color-brand-black); }
        .step-name { font-size: 14px; font-weight: 400; letter-spacing: -0.01em; }
        .step-name.inactive { color: rgb(255 255 255 / 0.45); }
        .step-name.active   { color: rgb(255 255 255 / 0.92); }
        .step-name.done     { color: rgb(255 255 255 / 0.92); }
        .step-connector {
          width: 60px; height: 1px; background: rgb(255 255 255 / 0.1); margin: 0 16px; transition: background 300ms;
        }
        .step-connector.done { background: rgb(255 255 255 / 0.35); }
        @media (max-width: 768px) {
          .step-name { display: none; }
          .step-connector { width: 30px; margin: 0 8px; }
        }

        .co-input {
          width: 100%; height: 52px;
          background: rgb(255 255 255 / 0.04);
          border: 1px solid #2E2E2E;
          border-radius: var(--radius-card-md);
          padding: 0 16px; color: #FFFFFF; font-size: 15px; font-family: var(--font-body);
          transition: border-color 200ms, box-shadow 200ms;
        }
        .co-input:focus {
          outline: none;
          border-color: rgb(255 255 255 / 0.28);
          box-shadow: none;
          background: rgb(255 255 255 / 0.06);
        }
        .co-input::placeholder { color: #9B9B96; }

        .co-checkbox-wrap { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
        .co-checkbox {
          width: 20px; height: 20px; border: 1.5px solid rgb(255 255 255 / 0.2); border-radius: 6px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
          background: rgb(255 255 255 / 0.04);
        }
        .co-checkbox.checked { background: var(--color-accent); border-color: var(--color-accent); }
        .co-checkbox.checked::after {
          content: ''; width: 5px; height: 9px; border: 2px solid #080808;
          border-top: none; border-left: none; transform: rotate(45deg) translate(-1px, -1px);
        }

        .co-radio-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .co-radio {
          width: 20px; height: 20px; border: 1.5px solid rgb(255 255 255 / 0.2); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: rgb(255 255 255 / 0.04);
        }
        .co-radio.checked { border-color: var(--color-accent); background: var(--color-accent); }
        .co-radio.checked::after {
          content: ''; width: 8px; height: 8px; border-radius: 50%; background: #080808;
        }

        .payment-method {
          border: none;
          background: rgb(255 255 255 / 0.04);
          border-radius: var(--radius-card-lg);
          padding: 20px; margin-bottom: 12px; cursor: pointer; transition: background 200ms;
          display: flex; align-items: center; justify-content: space-between;
        }
        .payment-method:hover { background: rgb(255 255 255 / 0.06); }
        .payment-method.active {
          background: rgb(255 255 255 / 0.08);
          border-color: rgb(255 255 255 / 0.14);
          box-shadow: none;
        }

        .coupon-row {
          display: flex; margin: 20px 0;
          border-top: var(--divider-width) solid var(--divider-on-dark);
          padding-top: 20px;
        }
        .coupon-input {
          flex: 1; height: 48px;
          background: rgb(255 255 255 / 0.04);
          border: 1px solid #2E2E2E;
          border-radius: var(--radius-card-md) 0 0 var(--radius-card-md);
          padding: 0 16px; color: #FFFFFF; font-size: 14px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .coupon-input:focus { outline: none; border-color: rgb(255 255 255 / 0.28); }
        .coupon-apply-btn {
          height: 48px; padding: 0 24px;
          background: rgb(255 255 255 / 0.08);
          border: 1px solid #2E2E2E;
          border-left: none;
          border-radius: 0 var(--radius-card-md) var(--radius-card-md) 0;
          color: #FFFFFF; font-size: 14px; font-weight: 400;
          cursor: pointer; transition: background 200ms;
        }
        .coupon-apply-btn:hover { background: rgb(255 255 255 / 0.12); }

        .payment-loading {
          position: fixed; inset: 0;
          background: rgb(8 8 8 / 0.85);
          backdrop-filter: blur(12px);
          display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999;
        }
        .payment-loading-close {
          position: absolute; top: 24px; right: 24px; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 9999px;
          border: 1px solid rgb(255 255 255 / 0.15);
          background: rgb(255 255 255 / 0.06);
          color: rgb(255 255 255 / 0.85);
          cursor: pointer;
          transition: background 200ms, color 200ms;
        }
        .payment-loading-close:hover {
          background: rgb(255 255 255 / 0.12);
          color: #fff;
        }
        .payment-loading .spinner {
          width: 52px; height: 52px; border: 4px solid color-mix(in srgb, var(--color-accent) 22%, transparent); border-top-color: var(--color-accent);
          border-radius: 50%; animation: co-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes co-spin { to { transform: rotate(360deg); } }
        .payment-loading-text { margin-top: 24px; color: rgb(255 255 255 / 0.92); font-size: 16px; font-weight: 400; }
      `}</style>

      {/* Payment Loading Modal */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="payment-loading">
            <button
              type="button"
              className="payment-loading-close"
              onClick={() => setLoading(false)}
              aria-label="关闭"
            >
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </button>
            <div className="spinner"></div>
            <div className="payment-loading-text">正在安全处理您的支付...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render layout based on step */}
      {step === 1 || step === 2 ? (
        <>
          {/* Progress Indicator */}
          <div className="checkout-steps">
            <div className="checkout-step">
              <div className={`step-num ${step === 1 ? 'active' : 'done'}`}>{step > 1 ? <Check className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> : '1'}</div>
              <span className={`step-name ${step === 1 ? 'active' : 'done'}`}>填写信息</span>
            </div>
            <div className={`step-connector ${step > 1 ? 'done' : ''}`}></div>
            <div className="checkout-step">
              <div className={`step-num ${step === 2 ? 'active' : 'inactive'}`}>2</div>
              <span className={`step-name ${step === 2 ? 'active' : 'inactive'}`}>选择支付</span>
            </div>
            <div className={`step-connector`}></div>
            <div className="checkout-step">
              <div className="step-num inactive">3</div>
              <span className="step-name inactive">完成支付</span>
            </div>
          </div>

          <div className="container flex max-w-[1100px] flex-col gap-12 py-[var(--block-gap)] md:flex-row lg:gap-12">
            {/* Left Column - Forms */}
            <div className="w-full md:w-[55%] flex flex-col">
              <AnimatePresence mode="wait">
                {/* STEP 1: Information */}
                {step === 1 && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-10"
                  >
                    
                    {/* Contact Info */}
                    <section>
                      <div className="flex justify-between items-end mb-6">
                        <h2 className="text-[20px] font-normal text-fg-primary">联系方式</h2>
                        <span className="text-[13px] text-fg-tertiary">已有账号？ <Link to={`${withPath('/auth')}#login`} className="text-fg-primary font-normal">登录</Link></span>
                      </div>
                      <div className="flex flex-col gap-4">
                        <input type="email" placeholder="邮箱地址（接收订单收据）" className="co-input" />
                        <div className="co-checkbox-wrap mt-2" onClick={() => setNewsletter(!newsletter)}>
                          <div className={`co-checkbox ${newsletter ? 'checked' : ''}`} />
                          <span className="text-[13px] text-fg-tertiary">订阅 Awak Health 最新动态和优惠信息</span>
                        </div>
                      </div>
                    </section>

                    {/* Shipping Address */}
                    <section>
                      <h2 className="text-[20px] font-normal text-fg-primary mb-6">收货地址</h2>
                      
                      {/* Address Book Card */}
                      {!useNewAddress && (
                        <div className="bg-surface-2 p-6 rounded-[16px] border-none mb-4 relative cursor-pointer group transition-all hover:scale-[1.02]">
                          <div className="absolute top-6 right-6">
                            <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-fg-primary">
                               <div className="h-[10px] w-[10px] rounded-full bg-fg-primary" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-normal text-fg-primary text-[17px]">孙旺</span>
                            <span className="text-[14px] text-fg-tertiary font-normal">138 0000 0000</span>
                            <span className="ml-2 text-[10px] bg-white/5 px-2.5 py-1 rounded-md text-fg-primary font-normal uppercase tracking-wider">家</span>
                          </div>
                          <p className="text-[14px] text-fg-secondary leading-relaxed max-w-[85%] font-normal">
                            广东省 深圳市 南山区<br />
                            科技南十二路 软件产业基地 4 栋 801
                          </p>
                        </div>
                      )}

                      {!useNewAddress ? (
                        <button 
                          onClick={() => setUseNewAddress(true)}
                          className="text-[14px] font-normal text-fg-primary bg-surface-2 px-6 py-3 rounded-full hover:scale-105 transition-all flex items-center gap-2 mt-2 border-none"
                        >
                          + 使用新地址
                        </button>
                      ) : (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-col gap-4 overflow-hidden rounded-card-lg border-none bg-surface-2 p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="收货人姓名" className="co-input" />
                            <input type="tel" placeholder="11位手机号" value={phone} onChange={handlePhoneChange} maxLength={13} className="co-input" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <select className="co-input appearance-none">
                              <option value="" disabled selected className="bg-base text-fg-primary">请选择省</option>
                              <option value="gd" className="bg-base text-fg-primary">广东省</option>
                              <option value="bj" className="bg-base text-fg-primary">北京市</option>
                            </select>
                            <select className="co-input appearance-none">
                              <option value="" disabled selected className="bg-base text-fg-primary">请选择市</option>
                              <option value="sz" className="bg-base text-fg-primary">深圳市</option>
                            </select>
                            <select className="co-input appearance-none">
                              <option value="" disabled selected className="bg-base text-fg-primary">请选择区</option>
                              <option value="ns" className="bg-base text-fg-primary">南山区</option>
                            </select>
                          </div>
                          <input type="text" placeholder="详细地址（街道/楼号/门牌号）" className="co-input" />
                          <input type="text" placeholder="邮政编码（可选）" className="co-input" />
                          
                          <div className="flex gap-8 mt-2 items-center">
                             <div className="text-[13px] text-fg-tertiary font-normal uppercase tracking-wider">地址标签</div>
                             <div className="flex gap-6">
                               {['家', '公司', '其他'].map(tag => (
                                 <div key={tag} className="co-radio-wrap" onClick={() => setAddressTag(tag)}>
                                   <div className={`co-radio ${addressTag === tag ? 'checked' : ''}`} />
                                   <span className="text-[14px] text-fg-primary font-normal">{tag}</span>
                                 </div>
                               ))}
                             </div>
                          </div>

                          <button onClick={() => setUseNewAddress(false)} className="text-fg-tertiary text-[13px] font-normal self-start mt-4 hover:text-fg-primary transition-colors">取消使用新地址</button>
                        </motion.div>
                      )}
                    </section>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-accent text-[16px] font-normal text-ink transition-all hover:brightness-105 active:scale-[0.98]"
                      >
                        继续支付方式 <ArrowRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </button>
                      <Link to={withPath('/store')} className="text-fg-tertiary hover:text-fg-primary text-[13px] font-normal flex items-center gap-1 self-center transition-colors py-2">
                        <ChevronLeft className="w-4 h-4" /> 返回购物车
                      </Link>
                      <p className="text-fg-tertiary text-[12px] text-center mt-2 flex items-center justify-center gap-2 font-normal opacity-60">
                        <Lock className="w-3.5 h-3.5" /> 256-bit SSL 加密传输
                      </p>
                    </div>
                  </motion.div>
                )}


                {/* STEP 2: Payment */}
                {step === 2 && (
                  <motion.div 
                    key="step2" 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-10"
                  >
                    
                    <section>
                      <h2 className="text-[20px] font-normal text-fg-primary mb-6 uppercase tracking-wider flex items-center justify-between">
                        <span>支付方式</span>
                        <span className="rounded-full border-none bg-white/10 px-3 py-1 text-[12px] font-normal text-fg-tertiary">安全支付保障</span>
                      </h2>
                      
                      <div className="flex flex-col gap-3">
                        
                        {/* WeChat Pay */}
                        <div className={`payment-method ${paymentMethod === 'wechat' ? 'active' : ''}`} onClick={() => setPaymentMethod('wechat')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'wechat' ? 'checked' : ''}`} />
                             <MessageSquare className="w-6 h-6 text-[#07C160]" />
                             <div className="flex flex-col">
                               <span className="font-normal text-fg-primary text-[15px]">微信支付</span>
                               <span className="text-[12px] text-fg-tertiary">亿万用户的选择</span>
                             </div>
                           </div>
                           {paymentMethod === 'wechat' ? (
                             <span className="bg-accent text-ink text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wide font-normal">推荐</span>
                           ) : (
                             <div className="h-[18px] w-[18px] rounded-full border border-white/20" />
                           )}
                        </div>
                        {paymentMethod === 'wechat' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="mb-4 flex flex-col items-center justify-center gap-6 rounded-card-lg border-none bg-surface-2 p-8 text-center">
                                <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl border-none bg-surface-1 p-6">
                                   <div className="absolute inset-0 bg-[#07C160]/5 border-2 border-[#07C160]/20 border-dashed m-3 rounded-xl"></div>
                                   <div className="flex flex-col items-center gap-3 relative z-10">
                                      <MessageSquare className="w-10 h-10 text-[#07C160] opacity-20" />
                                      <span className="text-[#07C160] font-normal text-sm tracking-tight">扫码支付</span>
                                   </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-[14px] text-fg-primary font-normal">请使用微信扫一扫</p>
                                  <p className="text-[12px] text-fg-tertiary">支付完成后将自动跳转结果页</p>
                                </div>
                             </div>
                          </motion.div>
                        )}

                        {/* Alipay */}
                        <div className={`payment-method ${paymentMethod === 'alipay' ? 'active' : ''}`} onClick={() => setPaymentMethod('alipay')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'alipay' ? 'checked' : ''}`} />
                             <div className="w-6 h-6 bg-[#1677FF] rounded flex items-center justify-center text-white text-[14px] font-normal italic">支</div>
                             <div className="flex flex-col">
                               <span className="font-normal text-fg-primary text-[15px]">支付宝</span>
                               <span className="text-[12px] text-fg-tertiary">支持花呗、信用卡支付</span>
                             </div>
                           </div>
                           <div className="h-[18px] w-[18px] rounded-full border border-white/20" />
                        </div>
                        {paymentMethod === 'alipay' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="bg-surface-2 p-6 rounded-[16px] mb-4 text-fg-tertiary text-[14px] text-center border-none font-normal">
                                点击确认支付后，将为您打开支付宝完成付款。
                             </div>
                          </motion.div>
                        )}

                        {/* Credit Card */}
                        <div className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'card' ? 'checked' : ''}`} />
                             <CreditCard className="w-6 h-6 text-fg-secondary" />
                             <div className="flex flex-col">
                               <span className="font-normal text-fg-primary text-[15px]">银行卡 / 信用卡</span>
                               <span className="text-[12px] text-fg-tertiary">支持全球主流银行卡直接支付</span>
                             </div>
                           </div>
                           <div className="flex gap-1.5 grayscale opacity-60">
                             <div className="w-8 h-5 border border-white/10 rounded-sm bg-white/5"></div>
                             <div className="w-8 h-5 border border-white/10 rounded-sm bg-white/5"></div>
                           </div>
                        </div>
                        {paymentMethod === 'card' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="mb-4 flex flex-col gap-4 rounded-card-lg border-none bg-surface-2 p-6">
                               <input type="text" placeholder="卡号 (0000 0000 0000 0000)" className="co-input font-mono tracking-widest text-[15px]" />
                               <div className="grid grid-cols-2 gap-4">
                                 <input type="text" placeholder="有效期 MM/YY" className="co-input" />
                                 <input type="text" placeholder="安全码 CVV" className="co-input" />
                               </div>
                               <input type="text" placeholder="持卡人姓名" className="co-input" />
                             </div>
                          </motion.div>
                        )}

                        {/* Installment */}
                        <div className={`payment-method ${paymentMethod === 'installment' ? 'active' : ''}`} onClick={() => setPaymentMethod('installment')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'installment' ? 'checked' : ''}`} />
                             <LayoutGrid className="w-6 h-6 text-[#FF9500]" />
                             <div className="flex flex-col">
                               <span className="font-normal text-fg-primary text-[15px]">分期付款</span>
                               <span className="text-[12px] text-fg-tertiary">资金压力小，支持免息分期</span>
                             </div>
                           </div>
                           <span className="bg-accent text-ink text-[9px] px-2 py-0.5 rounded-full font-normal uppercase tracking-widest">免息</span>
                        </div>
                        {paymentMethod === 'installment' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="bg-surface-2 p-5 rounded-[16px] mb-4 flex gap-4 border-none">
                                {[3, 6, 12].map(m => (
                                  <div key={m} className={`flex-1 border-none rounded-xl p-4 text-center cursor-pointer transition-all ${m === 12 ? 'bg-white/10' : 'bg-white/4'}`}>
                                    <div className="text-fg-primary font-normal text-[16px] mb-1">{m}期</div>
                                    <div className="text-fg-tertiary text-[11px] font-normal">¥ {(total / m).toFixed(2)}/期</div>
                                  </div>
                                ))}
                             </div>
                          </motion.div>
                        )}
                        
                      </div>
                    </section>

                    <div className="pt-2 flex flex-col gap-6">
                      <button 
                        type="button"
                        onClick={handleConfirmPayment}
                        className="flex h-[60px] w-full items-center justify-center gap-3 rounded-full bg-accent text-[18px] font-normal tracking-tight text-ink transition-all hover:brightness-105 active:scale-[0.98]"
                      >
                        确认支付 ¥{total.toFixed(2)} <ArrowRight className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                      </button>
                      
                      <div className="flex items-center justify-center gap-8 py-2 opacity-50">
                         <div className="flex items-center gap-2 text-[11px] font-normal text-fg-primary tracking-widest uppercase"><Lock className="w-3.5 h-3.5" /> SSL安全加密</div>
                         <div className="flex items-center gap-2 text-[11px] font-normal text-fg-primary tracking-widest uppercase"><ShieldCheck className="w-3.5 h-3.5" /> 官方安全认证</div>
                      </div>

                      <button onClick={() => setStep(1)} className="text-fg-tertiary hover:text-fg-primary text-[13px] font-normal flex items-center gap-1 self-center transition-colors">
                        <ChevronLeft className="w-4 h-4" /> 返回修改收货信息
                      </button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full md:w-[45%]">
              <div className="sticky top-[120px] rounded-card-lg border-none bg-surface-2 p-8 md:p-10">
                <h3 className="text-[12px] text-fg-tertiary font-normal tracking-[2px] uppercase mb-8 pb-4 border-b border-white/10">订单摘要</h3>
                
                {/* Product List */}
                <div className="flex flex-col gap-8 mb-8 border-b border-white/10 pb-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-6 relative">
                      <div className="w-[84px] h-[84px] rounded-2xl bg-white/5 flex items-center justify-center p-3 relative">
                        <img src="https://i.ibb.co/JWDBKFgn/image.png" alt="Awak Health Smart Ring" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        <div className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-none bg-accent text-[13px] font-normal text-ink">1</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-normal text-fg-primary text-[16px] tracking-tight">Awak Health Smart Ring</span>
                        <span className="text-[13px] text-fg-tertiary font-normal mt-1 bg-black/5 px-2 py-0.5 rounded-md self-start">Obsidian · Size 9</span>
                      </div>
                    </div>
                    <span className="font-mono font-normal text-fg-primary text-[16px] pt-2">¥ 2,118.60</span>
                  </div>
                </div>

                {/* Calculations */}
                <div className="flex flex-col gap-4 text-[14px]">
                  <div className="flex justify-between items-center text-fg-secondary font-normal">
                    <span>小计</span>
                    <span className="font-mono font-normal">¥ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-fg-primary font-normal">
                    <span>标准配送</span>
                    <span className="text-fg-tertiary font-normal uppercase tracking-wider text-[12px]">免费</span>
                  </div>
                  
                  {/* Coupon section */}
                  <div className="coupon-row flex-col">
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="优惠码" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="coupon-input" 
                      />
                      <button onClick={handleApplyCoupon} className="coupon-apply-btn">应用</button>
                    </div>
                    {couponStatus === 'success' && <div className="text-[12px] text-fg-primary font-normal mt-3 flex items-center gap-1.5"><Check className="w-4 h-4" /> 优惠码已成功应用</div>}
                    {couponStatus === 'fail' && <div className="text-[12px] text-[#FF3B30] font-normal mt-3">优惠码无效，请检查后重新输入</div>}
                  </div>

                  {couponStatus === 'success' && (
                    <div className="flex justify-between items-center text-fg-primary font-normal mt-1">
                      <span>已享折扣 (AWAK50)</span>
                      <span className="font-mono">-¥ 50.00</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-8 mt-8 border-t border-white/10 flex flex-col items-end gap-1">
                   <div className="flex justify-between items-center w-full">
                     <span className="font-normal text-fg-primary text-[18px] tracking-tight">付款总计</span>
                     <div className="flex items-baseline gap-1.5">
                       <span className="text-[13px] text-fg-tertiary font-normal">CNY</span>
                       <span className="font-normal text-[32px] text-fg-primary font-mono tracking-tight leading-none">¥{total.toFixed(2)}</span>
                     </div>
                   </div>
                   <p className="text-[12px] text-fg-tertiary mt-4 font-normal italic">尊享顺丰速运服务，订单即刻出发</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* STEP 3: Success Page */
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="relative z-10 flex min-h-screen flex-col items-center bg-base px-6 py-24"
        >
          {/* Success Icon Animation */}
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: [0, 1.1, 1] }} 
            transition={{ duration: 0.6, type: 'spring', damping: 15 }}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10"
          >
            <Check className="h-11 w-11 text-accent" strokeWidth={1.75} aria-hidden />
          </motion.div>

          {/* Headers */}
          <h1 className="text-[42px] md:text-[52px] font-normal text-fg-primary tracking-[-1px] mb-4 text-center">订单已确认！</h1>
          <div className="flex items-center gap-2 mb-6">
             <span className="text-[13px] text-fg-tertiary font-mono">订单号：AW202604210081</span>
             <button className="text-fg-tertiary hover:text-fg-primary transition-colors" title="复制单号" onClick={() => {}}><Copy className="w-3.5 h-3.5" /></button>
          </div>
          <p className="text-[15px] text-fg-secondary text-center max-w-[480px] leading-relaxed mb-12 font-normal">
            我们已向你的邮箱发送了订单确认邮件，发货后你会收到包含物流追踪单号的通知。
          </p>

          <div className="mb-8 w-full max-w-[560px] rounded-card-lg border-none bg-surface-2 p-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 relative px-2">
              <div className="flex flex-col">
                 <span className="text-[14px] font-normal text-fg-primary mb-1">预计 3–5 个工作日到达</span>
                 <span className="text-[13px] text-fg-tertiary">收货人：孙* (138****0000)</span>
                 <span className="text-[13px] text-fg-tertiary mt-1 italic">广东省 深圳市 南山区 科技南十二路...</span>
              </div>
            </div>
            
            <div className="py-6 border-b border-white/10 px-2">
              <div className="flex items-center gap-4">
                <div className="w-[64px] h-[64px] rounded-xl bg-white/5 flex items-center justify-center p-2 shrink-0 border-none">
                  <img src="https://i.ibb.co/JWDBKFgn/image.png" alt="Product" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-normal text-fg-primary text-[15px]">Awak Health Smart Ring</span>
                  <span className="text-[13px] text-fg-tertiary font-normal uppercase tracking-tight">Obsidian · Size 9</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-fg-primary font-mono font-normal text-[14px]">¥ 2,118.60</span>
                   <span className="text-fg-tertiary text-[12px]">x 1</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center px-2">
               <span className="text-[14px] text-fg-tertiary font-normal">支付方式：微信支付</span>
               <span className="text-[18px] font-normal text-fg-primary font-mono">¥ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="w-full max-w-[560px] grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
             <div className="group flex cursor-pointer flex-col justify-between rounded-card-lg border-none bg-surface-2 p-6 transition-all hover:scale-[1.02]" onClick={() => navigate(withPath('/auth'))}>
               <div>
                  <h4 className="font-normal text-[15px] text-fg-primary mb-2 flex items-center gap-2"><Download className="w-4 h-4 text-fg-primary" /> 准备好迎接你的设备</h4>
                  <p className="text-[12px] text-fg-tertiary leading-relaxed mb-4 font-normal">下载 Awak Health App，注册账号并探索生态系统，为激活做准备。</p>
               </div>
               <span className="inline-flex max-w-max items-center gap-1 rounded-full bg-accent px-4 py-2 text-[12px] font-normal text-ink transition-transform group-hover:translate-x-1">立即下载 <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /></span>
             </div>

             <div className="flex flex-col gap-4">
               <div className="group flex cursor-pointer items-center justify-between rounded-card-md border-none bg-surface-2 p-4 transition-all hover:scale-[1.02]" onClick={() => navigate(withPath('/auth'))}>
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5 text-fg-tertiary" strokeWidth={1.75} aria-hidden />
                    <span className="text-[14px] font-normal text-fg-primary">追踪物流状态</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-fg-tertiary transition-colors group-hover:translate-x-1 group-hover:text-fg-primary" strokeWidth={1.75} aria-hidden />
               </div>
               <div className="group flex cursor-pointer items-center justify-between rounded-card-md border-none bg-surface-2 p-4 transition-all hover:scale-[1.02]" onClick={() => navigate(withPath('/store'))}>
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-5 w-5 text-fg-tertiary" strokeWidth={1.75} aria-hidden />
                    <span className="text-[14px] font-normal text-fg-primary">继续选购商品</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-fg-tertiary transition-colors group-hover:translate-x-1 group-hover:text-fg-primary" strokeWidth={1.75} aria-hidden />
               </div>
             </div>
          </div>

          {/* Feedback Reminder */}
          <div className="max-w-[560px] w-full bg-surface-2 border-none rounded-[16px] p-5 flex items-center gap-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
               <MessageSquare className="h-5 w-5 text-fg-primary" strokeWidth={1.75} aria-hidden />
             </div>
             <div>
                <h4 className="text-[14px] font-normal text-fg-primary mb-1">收到商品后，来谈谈真实感受</h4>
                <p className="text-[12px] text-fg-tertiary font-normal leading-relaxed">收货后14天内，我们会向你的邮箱发送评价邀请。参与评价可获积分奖励。</p>
             </div>
          </div>
        </motion.div>

      )}

    </div>
  );
}
