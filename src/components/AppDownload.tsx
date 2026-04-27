import { motion } from 'motion/react';

export default function AppDownload() {
  return (
    <section className="relative overflow-hidden py-4 text-center text-black rounded-[40px] mx-6 md:mx-[170px] my-4">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-[#F5F5F7] -z-10"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h3 className="text-3xl font-black mb-8 text-black tracking-tight">立即体验全生态健康服务</h3>
        <div className="flex justify-center gap-6">
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all">App Store</button>
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all">Google Play</button>
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all">华为应用市场</button>
        </div>
      </motion.div>
    </section>
  );
}
