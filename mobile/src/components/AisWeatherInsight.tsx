import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Sun, CloudRain, Thermometer, Sparkles } from 'lucide-react';
import { getHealthInsight } from '../services/aiService';

const AisWeatherInsight = () => {
  const [insight, setInsight] = useState<string>("正在同步环境感知数据...");
  const [weatherData, setWeatherData] = useState({ temp: 18, condition: '多云' });

  useEffect(() => {
    // In a real app, this would fetch from a weather API
    // Given the user query "今天天气怎么样?", we provide a polished mock for the brand hub
    const fetchInsight = async () => {
      const weatherStr = `${weatherData.temp}°C ${weatherData.condition}`;
      const aiText = await getHealthInsight(weatherStr);
      setInsight(aiText);
    };

    fetchInsight();
  }, [weatherData]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1A] border-none rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
    >
      <div className="flex items-center gap-4 border-r border-white/5 pr-6">
        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
          <Cloud className="w-7 h-7 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="text-[#9B9B96] text-[12px] font-bold tracking-wider uppercase">环境感知</span>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl font-black">{weatherData.temp}°C</span>
            <span className="text-white/60 text-sm font-medium">{weatherData.condition}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-accent shrink-0" />
        <p className="text-white/90 text-[15px] font-medium leading-relaxed italic">
          “{insight}”
        </p>
      </div>

      <div className="hidden lg:flex flex-col items-end gap-1">
        <span className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase">AI 推送</span>
        <span className="text-white/30 text-[11px]">刚刚更新</span>
      </div>
    </motion.div>
  );
};

export default AisWeatherInsight;
