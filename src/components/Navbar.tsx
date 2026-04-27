import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, User, Search, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isHardwareOpen, setIsHardwareOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hardwareItems = [
    { name: 'AWAK RING 智能戒指', desc: '看懂身体变化', path: '/products/ring' },
    { name: 'AWAK WATCH 专业运动智能手表', desc: '掌控运动状态', path: '/products/watch' },
    { name: 'AWAKBRACELET 智能手环', desc: '守护家人健康', path: '/products/band' },
    { name: 'AWAK GLASSES 智能眼镜', desc: '听见看见世界', path: '/products/glasses' },
  ];

  const navLinks = [
    { name: '硬件产品', hasDropdown: true },
    { name: '服务生态', path: '/ecosystem' },
    { name: '品牌资讯', path: '/news' },
    { name: '联系我们', path: '/contact' }
  ];

  // if (['/store', '/checkout', '/auth'].includes(location.pathname)) {
  //   return null;
  // }

  const isStoreOrProduct = location.pathname.startsWith('/products/') || location.pathname === '/store';
  const isCheckout = location.pathname === '/checkout';
  const isAuth = location.pathname === '/auth';
  const isLightPage = isStoreOrProduct || isCheckout || isAuth;

  if (isAuth) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[9997] flex items-center px-6 md:px-[170px] h-[72px] bg-transparent">
        <Link to="/" className="flex items-center">
          <span className="font-extrabold text-2xl tracking-[1px] text-[#080808]">AWAK</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9997] flex items-center justify-between px-6 md:px-[170px] ${
        scrolled 
          ? isLightPage 
            ? 'h-[72px] bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] border-b border-black/5'
            : 'h-[72px] bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-[#1A1A1A]' 
          : 'h-[90px] bg-transparent'
      }`}
      style={{
        transform: isStoreOrProduct ? (scrolled ? 'translateY(-100%)' : 'translateY(0)') : 'translateY(0)',
        opacity: isStoreOrProduct ? (scrolled ? 0 : 1) : 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isStoreOrProduct && scrolled ? 'none' : 'auto'
      }}
    >
      {/* Logo */}
      <Link to="/" className="relative z-10 flex items-center">
        <span className={`font-extrabold text-2xl tracking-[1px] ${isLightPage && scrolled ? 'text-black' : 'text-white'}`}>AWAK</span>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4">
        {navLinks.map((item) => (
          <div 
            key={item.name}
            className="relative"
            onMouseEnter={() => item.hasDropdown && setIsHardwareOpen(true)}
            onMouseLeave={() => item.hasDropdown && setIsHardwareOpen(false)}
          >
            {item.hasDropdown ? (
              <button className={`flex items-center gap-1.5 text-[15px] font-medium transition-colors px-4 py-2 rounded-full ${
                isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
              }`}>
                {item.name}
                <ChevronDown className={`w-[14px] h-[14px] transition-transform duration-300 ${isHardwareOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link 
                to={item.path!} 
                className={`transition-all relative text-[15px] font-medium px-4 py-2 rounded-full flex items-center ${
                  location.pathname === item.path 
                    ? isLightPage && scrolled ? 'bg-black/5 text-black' : 'bg-white/10 text-white'
                    : isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            )}

            {/* Dropdown Menu */}
            {item.hasDropdown && (
              <AnimatePresence>
                {isHardwareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] pt-4"
                  >
                    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden p-3 grid gap-1">
                      {hardwareItems.map((hw) => (
                        <Link
                          key={hw.name}
                          to={hw.path}
                          className="flex flex-col p-4 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <span className="text-white text-sm font-bold block">{hw.name}</span>
                          <span className="text-white/40 text-[11px] block mt-1">{hw.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          className={`p-2 transition-colors ${isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
        <Link 
          to="/auth" 
          className={`p-2 transition-colors ${isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
          aria-label="User Account"
        >
          <User className="w-[18px] h-[18px]" />
        </Link>
        {!['/store', '/checkout'].includes(location.pathname) && (
          <Link 
            to="/store" 
            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all bg-[#DDF700] text-[#080808] hover:bg-[#E6FF00] ml-2"
          >
            <ShoppingCart className="w-[15px] h-[15px]" style={{ strokeWidth: 2.5 }} />
            购买中心
          </Link>
        )}
        
        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${isLightPage && scrolled ? 'text-black' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#080808] border-b border-white/5 p-6 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((item) => (
              <div key={item.name} className="space-y-4">
                <span className="text-white/40 text-xs uppercase tracking-widest">{item.name}</span>
                {item.hasDropdown ? (
                  <div className="grid gap-4 pl-4">
                    {hardwareItems.map(hw => (
                      <Link key={hw.name} to={hw.path} className="text-white text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                        {hw.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link to={item.path!} className="text-white text-lg font-bold block pl-4" onClick={() => setIsMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

