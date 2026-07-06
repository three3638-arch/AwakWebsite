import { GoogleGenAI } from "@google/genai";

// Initialization according to gemini-api skill for React (Vite)
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export const getHealthInsight = async (weather: string) => {
  if (!process.env.GEMINI_API_KEY) {
    return "请在设置中配置 GEMINI_API_KEY 以获取智能健康建议。";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个专业的健康顾问。目前天气是：${weather}。请根据天气情况，为 Awak Health 智能戒指的用户提供一条简短（20字以内）且具有科技感的健康建议。`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "感知生命律动，守护你的每一天。";
  }
};
