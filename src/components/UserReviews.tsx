import { Star } from 'lucide-react';

export default function UserReviews() {
  const reviews = [
    { name: "张明", desc: "Awak Ring 用户", text: "Awak Ring 监测非常精准，睡眠深度比我之前用的手表准确很多。", rating: 5 },
    { name: "李华", desc: "Awak Watch 用户", text: "续航真的强，三天没充电还有电，数据分析也很到位。", rating: 5 },
    { name: "王伟", desc: "全生态用户", text: "配合Awak Health Premium，我的健康管理系统非常完善。", rating: 4 },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-[170px]">
      <h2 className="text-4xl font-black text-center mb-16">用户真实评价</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div key={i} className="bg-[#F5F5F3] p-8 rounded-2xl">
            <div className="flex gap-1 mb-4">
              {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-[#C8FF00] text-[#C8FF00]" />)}
            </div>
            <p className="text-black/70 mb-6">{r.text}</p>
            <div className="font-bold">{r.name}</div>
            <div className="text-black/50 text-sm">{r.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
