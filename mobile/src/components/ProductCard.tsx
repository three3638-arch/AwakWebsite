import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';

interface ProductCardProps {
  title: string;
  material: string;
  dark: boolean;
  img1: string;
  img2: string;
  specs: string[];
  path: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, material, dark, img1, img2, specs, path }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { withPath } = useLocalePath();

  return (
    <motion.div
      className={`rounded-2xl p-8 flex flex-col items-center text-center transition-all cursor-pointer border-none ${
        dark ? 'bg-[#F5F5F7] text-[#000000]' : 'bg-[#FFFFFF] text-[#000000]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
    >
      <div className="w-full aspect-square rounded-2xl overflow-hidden mb-2 bg-[rgba(0,0,0,0.03)] flex items-center justify-center p-4">
        <motion.img
          src={isHovered ? img2 : img1}
          alt={title}
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 0.9 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="mb-4">
        <h3 className="text-3xl font-bold mb-1 tracking-tight text-[#000000]">{title}</h3>
        <p className="text-lg font-medium text-[#86868B]">{material}</p>
      </div>
      <div className="w-full flex-grow flex flex-col gap-3">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex items-center justify-center">
            <span className="text-lg font-medium leading-tight text-[#1D1D1F]">{spec}</span>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="w-full flex gap-3 mt-6 pt-6 border-t border-[rgba(0,0,0,0.05)]">
        <button className="flex-1 h-12 bg-transparent border border-[rgba(0,0,0,0.1)] text-[#1D1D1F] rounded-lg text-sm font-semibold hover:bg-[rgba(0,0,0,0.05)] transition-all" onClick={() => navigate(withPath(`/products/${path}`))}>
          了解详情
        </button>
        <button className="flex-1 h-12 bg-[#000000] text-[#FFFFFF] rounded-lg text-sm font-bold hover:bg-[#1D1D1F] transition-all" onClick={() => navigate(withPath(`/checkout?product=${path}`))}>
          立即购买
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
