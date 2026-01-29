// เก็บข้อมูลฉายา เรียงจากคะแนนสูงไปต่ำเพื่อให้ง่ายต่อการคำนวณ
export const COLLECTION_TITLES = [
  { minScore: 1000, name: "เทพเจ้าแห่งบรรพกาล", color: "from-red-600 via-orange-500 to-yellow-400" },
  { minScore: 500,  name: "ตำนานแห่งพงไพร", color: "from-orange-400 to-red-600" },
  { minScore: 350,  name: "ผู้พิชิตดินแดน", color: "from-pink-500 to-rose-600" },
  { minScore: 200,  name: "นักล่ามือโปร", color: "from-purple-400 to-indigo-600" },
  { minScore: 100,  name: "นักสะสมอาวุโส", color: "from-indigo-400 to-blue-600" },
  { minScore: 30,   name: "นักสะสมฝึกหัด", color: "from-blue-400 to-cyan-600" },
  { minScore: 0,    name: "ผู้เริ่มต้น", color: "from-slate-400 to-slate-600" }
];