import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, ArrowRight, Copy, Check, Download, 
  Box, CreditCard, ChevronLeft, ShieldCheck, 
  MessageSquare, LayoutGrid
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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#DDF700] selection:text-black pt-[90px]">
      <style>{`
        .checkout-nav {
          height: 64px;
          background: rgba(245,245,247,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 80px;
        }
        @media (max-width: 768px) {
          .checkout-nav { padding: 0 20px; }
        }
        .checkout-steps {
          display: flex; align-items: center; justify-content: center;
          padding: 30px 0; border-bottom: 1px solid rgba(0,0,0,0.06);
          background: #FFFFFF;
        }
        .checkout-step { display: flex; align-items: center; gap: 10px; }
        .step-num {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; transition: all 300ms;
        }
        .step-num.inactive { background: #E8E8ED; color: #86868B; }
        .step-num.active   { background: #DDF700; color: #080808; }
        .step-num.done     { background: #1D1D1F; color: #FFFFFF; }
        .step-name { font-size: 14px; font-weight: 600; }
        .step-name.inactive { color: #86868B; }
        .step-name.active   { color: #1D1D1F; }
        .step-name.done     { color: #1D1D1F; }
        .step-connector {
          width: 60px; height: 1px; background: #E8E8ED; margin: 0 16px; transition: background 300ms;
        }
        .step-connector.done { background: #1D1D1F; }
        @media (max-width: 768px) {
          .step-name { display: none; }
          .step-connector { width: 30px; margin: 0 8px; }
        }

        .co-input {
          width: 100%; height: 52px; background: #FFFFFF;
          border: none; border-radius: 12px;
          padding: 0 16px; color: #1D1D1F; font-size: 14px;
          transition: all 200ms;
          shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .co-input:focus { outline: none; box-shadow: 0 0 0 4px rgba(221,247,0,0.1); }
        .co-input::placeholder { color: #86868B; }

        .co-checkbox-wrap { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
        .co-checkbox {
          width: 20px; height: 20px; border: 1.5px solid #D1D1D6; border-radius: 6px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
          background: #FFFFFF;
        }
        .co-checkbox.checked { background: #DDF700; border-color: #DDF700; }
        .co-checkbox.checked::after {
          content: ''; width: 5px; height: 9px; border: 2px solid #080808;
          border-top: none; border-left: none; transform: rotate(45deg) translate(-1px, -1px);
        }

        .co-radio-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .co-radio {
          width: 20px; height: 20px; border: 1.5px solid #D1D1D6; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: #FFFFFF;
        }
        .co-radio.checked { border-color: #DDF700; background: #DDF700; }
        .co-radio.checked::after {
          content: ''; width: 8px; height: 8px; border-radius: 50%; background: #080808;
        }

        .payment-method {
          border: none; background: #FFFFFF; border-radius: 12px;
          padding: 20px; margin-bottom: 12px; cursor: pointer; transition: all 200ms;
          display: flex; align-items: center; justify-content: space-between;
          shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .payment-method:hover { transform: scale(1.02); shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .payment-method.active { background: #FFFFFF; border: none; shadow: 0 0 0 2px #000000; }

        .coupon-row {
          display: flex; margin: 20px 0; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 20px;
        }
        .coupon-input {
          flex: 1; height: 48px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px 0 0 12px; padding: 0 16px; color: #1D1D1F; font-size: 14px;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .coupon-input:focus { outline:none; border-color: #DDF700; }
        .coupon-apply-btn {
          height: 48px; padding: 0 24px; background: #F5F5F7; border: 1px solid rgba(0,0,0,0.1);
          border-left: none; border-radius: 0 12px 12px 0; color: #1D1D1F; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 200ms;
        }
        .coupon-apply-btn:hover { background: #E8E8ED; }

        .payment-loading {
          position: fixed; inset: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px);
          display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999;
        }
        .payment-loading .spinner {
          width: 52px; height: 52px; border: 4px solid rgba(221,247,0,0.2); border-top-color: #DDF700;
          border-radius: 50%; animation: co-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes co-spin { to { transform: rotate(360deg); } }
        .payment-loading-text { margin-top: 24px; color: #1D1D1F; font-size: 16px; font-weight: 500; }
      `}</style>

      {/* Payment Loading Modal */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="payment-loading">
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
              <div className={`step-num ${step === 1 ? 'active' : 'done'}`}>{step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}</div>
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

          <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-12 lg:gap-12">
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
                        <h2 className="text-[20px] font-bold text-[#1D1D1F]">联系方式</h2>
                        <span className="text-[13px] text-[#86868B]">已有账号？ <Link to={`${withPath('/auth')}#login`} className="text-[#1D1D1F] font-bold">登录</Link></span>
                      </div>
                      <div className="flex flex-col gap-4">
                        <input type="email" placeholder="邮箱地址（接收订单收据）" className="co-input" />
                        <div className="co-checkbox-wrap mt-2" onClick={() => setNewsletter(!newsletter)}>
                          <div className={`co-checkbox ${newsletter ? 'checked' : ''}`} />
                          <span className="text-[13px] text-[#86868B]">订阅 AWAK 最新动态和优惠信息</span>
                        </div>
                      </div>
                    </section>

                    {/* Shipping Address */}
                    <section>
                      <h2 className="text-[20px] font-bold text-[#1D1D1F] mb-6">收货地址</h2>
                      
                      {/* Address Book Card */}
                      {!useNewAddress && (
                        <div className="bg-[#FFFFFF] p-6 rounded-[16px] border-none mb-4 relative cursor-pointer group shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                          <div className="absolute top-6 right-6">
                            <div className="w-[20px] h-[20px] rounded-full border-2 border-black flex items-center justify-center">
                               <div className="w-[10px] h-[10px] rounded-full bg-black"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-bold text-[#1D1D1F] text-[17px]">孙旺</span>
                            <span className="text-[14px] text-[#86868B] font-medium">138 0000 0000</span>
                            <span className="ml-2 text-[10px] bg-[#F5F5F7] px-2.5 py-1 rounded-md text-[#1D1D1F] font-bold uppercase tracking-wider">家</span>
                          </div>
                          <p className="text-[14px] text-[#424245] leading-relaxed max-w-[85%] font-medium">
                            广东省 深圳市 南山区<br />
                            科技南十二路 软件产业基地 4 栋 801
                          </p>
                        </div>
                      )}

                      {!useNewAddress ? (
                        <button 
                          onClick={() => setUseNewAddress(true)}
                          className="text-[14px] font-bold text-[#1D1D1F] bg-[#FFFFFF] px-6 py-3 rounded-full shadow-sm hover:scale-105 transition-all flex items-center gap-2 mt-2 border-none"
                        >
                          + 使用新地址
                        </button>
                      ) : (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-col gap-4 overflow-hidden bg-white p-6 rounded-[16px] border-none shadow-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="收货人姓名" className="co-input" />
                            <input type="tel" placeholder="11位手机号" value={phone} onChange={handlePhoneChange} maxLength={13} className="co-input" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <select className="co-input appearance-none bg-white">
                              <option value="" disabled selected className="text-black">请选择省</option>
                              <option value="gd" className="text-black">广东省</option>
                              <option value="bj" className="text-black">北京市</option>
                            </select>
                            <select className="co-input appearance-none bg-white">
                              <option value="" disabled selected className="text-black">请选择市</option>
                              <option value="sz" className="text-black">深圳市</option>
                            </select>
                            <select className="co-input appearance-none bg-white">
                              <option value="" disabled selected className="text-black">请选择区</option>
                              <option value="ns" className="text-black">南山区</option>
                            </select>
                          </div>
                          <input type="text" placeholder="详细地址（街道/楼号/门牌号）" className="co-input" />
                          <input type="text" placeholder="邮政编码（可选）" className="co-input" />
                          
                          <div className="flex gap-8 mt-2 items-center">
                             <div className="text-[13px] text-[#86868B] font-bold uppercase tracking-wider">地址标签</div>
                             <div className="flex gap-6">
                               {['家', '公司', '其他'].map(tag => (
                                 <div key={tag} className="co-radio-wrap" onClick={() => setAddressTag(tag)}>
                                   <div className={`co-radio ${addressTag === tag ? 'checked' : ''}`} />
                                   <span className="text-[14px] text-[#1D1D1F] font-medium">{tag}</span>
                                 </div>
                               ))}
                             </div>
                          </div>

                          <button onClick={() => setUseNewAddress(false)} className="text-[#86868B] text-[13px] font-bold self-start mt-4 hover:text-[#1D1D1F] transition-colors">取消使用新地址</button>
                        </motion.div>
                      )}
                    </section>

                    <div className="pt-6 border-t border-black/5 flex flex-col gap-4">
                      <button 
                        onClick={() => setStep(2)}
                        className="w-full h-[56px] bg-[#DDF700] hover:brightness-105 active:scale-[0.98] text-[#080808] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        继续支付方式 <ArrowRight className="w-5 h-5" />
                      </button>
                      <Link to={withPath('/store')} className="text-[#86868B] hover:text-[#1D1D1F] text-[13px] font-bold flex items-center gap-1 self-center transition-colors py-2">
                        <ChevronLeft className="w-4 h-4" /> 返回购物车
                      </Link>
                      <p className="text-[#86868B] text-[12px] text-center mt-2 flex items-center justify-center gap-2 font-medium opacity-60">
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
                      <h2 className="text-[20px] font-bold text-[#1D1D1F] mb-6 uppercase tracking-wider flex items-center justify-between">
                        <span>支付方式</span>
                        <span className="font-bold text-[12px] text-[#86868B] px-3 py-1 bg-white rounded-full border border-black/5 shadow-sm">安全支付保障</span>
                      </h2>
                      
                      <div className="flex flex-col gap-3">
                        
                        {/* WeChat Pay */}
                        <div className={`payment-method ${paymentMethod === 'wechat' ? 'active' : ''}`} onClick={() => setPaymentMethod('wechat')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'wechat' ? 'checked' : ''}`} />
                             <MessageSquare className="w-6 h-6 text-[#07C160]" />
                             <div className="flex flex-col">
                               <span className="font-bold text-[#1D1D1F] text-[15px]">微信支付</span>
                               <span className="text-[12px] text-[#86868B]">亿万用户的选择</span>
                             </div>
                           </div>
                           {paymentMethod === 'wechat' ? (
                             <span className="bg-[#DDF700] text-[#080808] text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wide font-black">推荐</span>
                           ) : (
                             <div className="w-[18px] h-[18px] rounded-full border border-[#D1D1D6]" />
                           )}
                        </div>
                        {paymentMethod === 'wechat' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="bg-[#FFFFFF] p-8 rounded-[16px] mb-4 flex flex-col items-center justify-center text-center gap-6 border border-black/5 shadow-sm">
                                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center relative p-6 shadow-xl border border-black/5">
                                   <div className="absolute inset-0 bg-[#07C160]/5 border-2 border-[#07C160]/20 border-dashed m-3 rounded-xl"></div>
                                   <div className="flex flex-col items-center gap-3 relative z-10">
                                      <MessageSquare className="w-10 h-10 text-[#07C160] opacity-20" />
                                      <span className="text-[#07C160] font-bold text-sm tracking-tight">扫码支付</span>
                                   </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-[14px] text-[#1D1D1F] font-bold">请使用微信扫一扫</p>
                                  <p className="text-[12px] text-[#86868B]">支付完成后将自动跳转结果页</p>
                                </div>
                             </div>
                          </motion.div>
                        )}

                        {/* Alipay */}
                        <div className={`payment-method ${paymentMethod === 'alipay' ? 'active' : ''}`} onClick={() => setPaymentMethod('alipay')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'alipay' ? 'checked' : ''}`} />
                             <div className="w-6 h-6 bg-[#1677FF] rounded flex items-center justify-center text-white text-[14px] font-black italic">支</div>
                             <div className="flex flex-col">
                               <span className="font-bold text-[#1D1D1F] text-[15px]">支付宝</span>
                               <span className="text-[12px] text-[#86868B]">支持花呗、信用卡支付</span>
                             </div>
                           </div>
                           <div className="w-[18px] h-[18px] rounded-full border border-[#D1D1D6]" />
                        </div>
                        {paymentMethod === 'alipay' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="bg-[#FFFFFF] p-6 rounded-[16px] mb-4 text-[#86868B] text-[14px] text-center border border-black/5 shadow-sm font-medium">
                                点击确认支付后，将为您打开支付宝完成付款。
                             </div>
                          </motion.div>
                        )}

                        {/* Credit Card */}
                        <div className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                           <div className="flex items-center gap-4">
                             <div className={`co-radio ${paymentMethod === 'card' ? 'checked' : ''}`} />
                             <CreditCard className="w-6 h-6 text-[#424245]" />
                             <div className="flex flex-col">
                               <span className="font-bold text-[#1D1D1F] text-[15px]">银行卡 / 信用卡</span>
                               <span className="text-[12px] text-[#86868B]">支持全球主流银行卡直接支付</span>
                             </div>
                           </div>
                           <div className="flex gap-1.5 grayscale opacity-60">
                             <div className="w-8 h-5 border border-black/10 rounded-sm bg-[#F5F5F7]"></div>
                             <div className="w-8 h-5 border border-black/10 rounded-sm bg-[#F5F5F7]"></div>
                           </div>
                        </div>
                        {paymentMethod === 'card' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="bg-white p-6 rounded-[16px] border border-black/5 shadow-sm mb-4 flex flex-col gap-4">
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
                               <span className="font-bold text-[#1D1D1F] text-[15px]">分期付款</span>
                               <span className="text-[12px] text-[#86868B]">资金压力小，支持免息分期</span>
                             </div>
                           </div>
                           <span className="bg-[#DDF700] text-[#080808] text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">免息</span>
                        </div>
                        {paymentMethod === 'installment' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                             <div className="bg-[#FFFFFF] p-5 rounded-[16px] mb-4 flex gap-4 border border-black/5 shadow-sm">
                                {[3, 6, 12].map(m => (
                                  <div key={m} className={`flex-1 border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${m === 12 ? 'border-[#DDF700] bg-[#DDF700]/5' : 'border-[#F5F5F7]'}`}>
                                    <div className="text-[#1D1D1F] font-black text-[16px] mb-1">{m}期</div>
                                    <div className="text-[#86868B] text-[11px] font-bold">¥ {(total / m).toFixed(2)}/期</div>
                                  </div>
                                ))}
                             </div>
                          </motion.div>
                        )}
                        
                      </div>
                    </section>

                    <div className="pt-2 flex flex-col gap-6">
                      <button 
                        onClick={handleConfirmPayment}
                        className="w-full h-[60px] bg-[#DDF700] hover:brightness-105 active:scale-[0.98] text-[#080808] rounded-2xl font-black text-[18px] tracking-tight transition-all shadow-xl flex items-center justify-center gap-3"
                      >
                        确认支付 ¥{total.toFixed(2)} <ArrowRight className="w-6 h-6" />
                      </button>
                      
                      <div className="flex items-center justify-center gap-8 py-2 opacity-50">
                         <div className="flex items-center gap-2 text-[11px] font-bold text-[#1D1D1F] tracking-widest uppercase"><Lock className="w-3.5 h-3.5" /> SSL安全加密</div>
                         <div className="flex items-center gap-2 text-[11px] font-bold text-[#1D1D1F] tracking-widest uppercase"><ShieldCheck className="w-3.5 h-3.5" /> 官方安全认证</div>
                      </div>

                      <button onClick={() => setStep(1)} className="text-[#86868B] hover:text-[#1D1D1F] text-[13px] font-bold flex items-center gap-1 self-center transition-colors">
                        <ChevronLeft className="w-4 h-4" /> 返回修改收货信息
                      </button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full md:w-[45%]">
              <div className="bg-[#FFFFFF] rounded-[24px] p-8 md:p-10 sticky top-[120px] shadow-sm border-none">
                <h3 className="text-[12px] text-[#86868B] font-black tracking-[2px] uppercase mb-8 pb-4 border-b border-black/5">订单摘要</h3>
                
                {/* Product List */}
                <div className="flex flex-col gap-8 mb-8 border-b border-black/5 pb-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-6 relative">
                      <div className="w-[84px] h-[84px] rounded-2xl bg-[#F5F5F7] flex items-center justify-center p-3 relative shadow-inner">
                        <img src="https://i.ibb.co/JWDBKFgn/image.png" alt="AWAK Smart Ring" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#1D1D1F] text-white text-[13px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">1</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-[#1D1D1F] text-[16px] tracking-tight">AWAK Smart Ring</span>
                        <span className="text-[13px] text-[#86868B] font-bold mt-1 bg-black/5 px-2 py-0.5 rounded-md self-start">Obsidian · Size 9</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-[#1D1D1F] text-[16px] pt-2">¥ 2,118.60</span>
                  </div>
                </div>

                {/* Calculations */}
                <div className="flex flex-col gap-4 text-[14px]">
                  <div className="flex justify-between items-center text-[#424245] font-medium">
                    <span>小计</span>
                    <span className="font-mono font-bold">¥ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#1D1D1F] font-medium">
                    <span>标准配送</span>
                    <span className="text-[#86868B] font-black uppercase tracking-wider text-[12px]">免费</span>
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
                    {couponStatus === 'success' && <div className="text-[12px] text-[#1D1D1F] font-bold mt-3 flex items-center gap-1.5"><Check className="w-4 h-4" /> 优惠码已成功应用</div>}
                    {couponStatus === 'fail' && <div className="text-[12px] text-[#FF3B30] font-bold mt-3">优惠码无效，请检查后重新输入</div>}
                  </div>

                  {couponStatus === 'success' && (
                    <div className="flex justify-between items-center text-[#1D1D1F] font-black mt-1">
                      <span>已享折扣 (AWAK50)</span>
                      <span className="font-mono">-¥ 50.00</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-8 mt-8 border-t border-black/5 flex flex-col items-end gap-1">
                   <div className="flex justify-between items-center w-full">
                     <span className="font-black text-[#1D1D1F] text-[18px] tracking-tight">付款总计</span>
                     <div className="flex items-baseline gap-1.5">
                       <span className="text-[13px] text-[#86868B] font-black">CNY</span>
                       <span className="font-black text-[32px] text-[#1D1D1F] font-mono tracking-tight leading-none">¥{total.toFixed(2)}</span>
                     </div>
                   </div>
                   <p className="text-[12px] text-[#86868B] mt-4 font-medium italic">尊享顺丰速运服务，订单即刻出发</p>
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
          className="min-h-screen bg-[#F5F5F7] flex flex-col items-center py-24 px-6 relative z-10"
        >
          {/* Success Icon Animation */}
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: [0, 1.1, 1] }} 
            transition={{ duration: 0.6, type: 'spring', damping: 15 }}
            className="w-[80px] h-[80px] rounded-full bg-[#1D1D1F]/5 flex items-center justify-center mb-8"
          >
            <Check className="w-[44px] h-[44px] text-[#1D1D1F]" strokeWidth={3} />
          </motion.div>

          {/* Headers */}
          <h1 className="text-[42px] md:text-[52px] font-black text-[#1D1D1F] tracking-[-1px] mb-4 text-center">订单已确认！</h1>
          <div className="flex items-center gap-2 mb-6">
             <span className="text-[13px] text-[#86868B] font-mono">订单号：AW202604210081</span>
             <button className="text-[#86868B] hover:text-[#1D1D1F] transition-colors" title="复制单号" onClick={() => {}}><Copy className="w-3.5 h-3.5" /></button>
          </div>
          <p className="text-[15px] text-[#424245] text-center max-w-[480px] leading-relaxed mb-12 font-medium">
            我们已向你的邮箱发送了订单确认邮件，发货后你会收到包含物流追踪单号的通知。
          </p>

          <div className="w-full max-w-[560px] bg-white rounded-[16px] p-6 mb-8 border-none shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-black/5 relative px-2">
              <div className="flex flex-col">
                 <span className="text-[14px] font-bold text-[#1D1D1F] mb-1">预计 3–5 个工作日到达</span>
                 <span className="text-[13px] text-[#86868B]">收货人：孙* (138****0000)</span>
                 <span className="text-[13px] text-[#86868B] mt-1 italic">广东省 深圳市 南山区 科技南十二路...</span>
              </div>
            </div>
            
            <div className="py-6 border-b border-black/5 px-2">
              <div className="flex items-center gap-4">
                <div className="w-[64px] h-[64px] rounded-xl bg-[#F5F5F7] flex items-center justify-center p-2 shrink-0 border border-black/5">
                  <img src="https://i.ibb.co/JWDBKFgn/image.png" alt="Product" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-[#1D1D1F] text-[15px]">AWAK Smart Ring</span>
                  <span className="text-[13px] text-[#86868B] font-medium uppercase tracking-tight">Obsidian · Size 9</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[#1D1D1F] font-mono font-bold text-[14px]">¥ 2,118.60</span>
                   <span className="text-[#86868B] text-[12px]">x 1</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center px-2">
               <span className="text-[14px] text-[#86868B] font-medium">支付方式：微信支付</span>
               <span className="text-[18px] font-bold text-[#1D1D1F] font-mono">¥ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="w-full max-w-[560px] grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
             <div className="flex flex-col justify-between bg-white border-none rounded-[16px] p-6 hover:scale-[1.02] hover:shadow-md transition-all group cursor-pointer" onClick={() => navigate(withPath('/auth'))}>
               <div>
                  <h4 className="font-bold text-[15px] text-[#1D1D1F] mb-2 flex items-center gap-2"><Download className="w-4 h-4 text-[#1D1D1F]" /> 准备好迎接你的设备</h4>
                  <p className="text-[12px] text-[#86868B] leading-relaxed mb-4 font-medium">下载 AwakHealth App，注册账号并探索生态系统，为激活做准备。</p>
               </div>
               <span className="text-[12px] font-bold text-black group-hover:translate-x-1 transition-transform inline-flex max-w-max items-center gap-1 bg-[#DDF700] px-4 py-2 rounded-full">立即下载 <ArrowRight className="w-3.5 h-3.5" /></span>
             </div>

             <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between bg-white border-none rounded-[12px] p-4 hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(withPath('/auth'))}>
                  <div className="flex items-center gap-3">
                    <Box className="w-5 h-5 text-[#86868B]" />
                    <span className="text-[14px] font-bold text-[#1D1D1F]">追踪物流状态</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86868B] group-hover:text-black transition-colors group-hover:translate-x-1" />
               </div>
               <div className="flex items-center justify-between bg-white border-none rounded-[12px] p-4 hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(withPath('/store'))}>
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-[#86868B]" />
                    <span className="text-[14px] font-bold text-[#1D1D1F]">继续选购商品</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#86868B] group-hover:text-black transition-colors group-hover:translate-x-1" />
               </div>
             </div>
          </div>

          {/* Feedback Reminder */}
          <div className="max-w-[560px] w-full bg-[#FFFFFF] border-none rounded-[16px] p-5 flex items-center gap-4 shadow-sm">
             <div className="w-10 h-10 rounded-full bg-[#1D1D1F]/5 flex items-center justify-center shrink-0">
               <MessageSquare className="w-5 h-5 text-black" />
             </div>
             <div>
                <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-1">收到商品后，来谈谈真实感受</h4>
                <p className="text-[12px] text-[#86868B] font-medium leading-relaxed">收货后14天内，我们会向你的邮箱发送评价邀请。参与评价可获积分奖励。</p>
             </div>
          </div>
        </motion.div>

      )}

    </div>
  );
}
