import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function FooterSections() {
  const footerGroups = [
    {
      title: '产品',
      links: [
        { name: 'AWAK Ring', path: '/smart-ring' },
        { name: 'AWAK Watch', path: '/smart-watch' },
        { name: 'AWAK Band', path: '/smart-bracelet' },
      ]
    },
    {
      title: '公司',
      links: [
        { name: '关于我们', path: '/' },
        { name: '品牌资讯', path: '/news' },
        { name: '联系我们', path: '/contact' },
      ]
    },
    {
      title: '支持',
      links: [
        { name: '帮助中心', path: '/' },
        { name: '用户手册', path: '/' },
        { name: '保修政策', path: '/' },
      ]
    },
    {
      title: '下载',
      links: [
        { name: 'iOS 下载', path: '/' },
        { name: 'Android 下载', path: '/' },
        { name: 'AwakHealth Web', path: '/' },
      ]
    }
  ];

  return (
    <footer className="bg-[#030303] border-t border-white/5 pt-24 pb-24">
      <div className="w-full mx-auto px-6 md:px-[170px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-12 mb-32">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-white text-3xl font-black tracking-tight">AWAK WILL</h2>
              <p className="text-white/40 text-sm font-medium tracking-widest uppercase">感知生命律动</p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#C8FF00] hover:text-[#080808] transition-all cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#C8FF00] hover:text-[#080808] transition-all cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#C8FF00] hover:text-[#080808] transition-all cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {footerGroups.map((group) => (
              <div key={group.title} className="space-y-8">
                <h4 className="text-white text-sm font-bold tracking-wider">{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-white/40 hover:text-[#C8FF00] transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} AWAK WILL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link to="/" className="text-white/20 hover:text-white transition-colors text-xs font-mono uppercase">Privacy Policy</Link>
            <Link to="/" className="text-white/20 hover:text-white transition-colors text-xs font-mono uppercase">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

