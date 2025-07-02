import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const moods = ["😀", "🙂", "😐", "😕", "😢"];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  type MoodChartData = { date: string; moods: number };
  const [moodData, setMoodData] = useState<MoodChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMoodData();
  }, []);

  async function fetchMoodData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    const { data } = await supabase
      .from("moods")
      .select("emoji, created_at")
      .eq("user_id", session.user.id);

    const grouped = data?.reduce((acc, mood) => {
      const date = new Date(mood.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(grouped || {}).map(([date, count]) => ({ date, moods: count }));
    setMoodData(chartData);
    setLoading(false);
  }

  async function submitMood() {
    if (!selectedMood) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    await supabase.from("moods").insert([{ user_id: session.user.id, emoji: selectedMood }]);
    setSelectedMood("");
    fetchMoodData();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#E1D8E9] via-[#D5CFE1] to-[#B6A6CA] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A09ABC]"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mood Tracker - Reflectly</title>
        <meta name="description" content="Track your daily moods" />
      </Head>
      <div className="flex min-h-screen bg-gradient-to-br from-[#E1D8E9] via-[#D5CFE1] to-[#B6A6CA]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 p-10 bg-transparent min-h-screen transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-64'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#A09ABC] mb-6">�� Mood Tracker</h2>
            <div className="mb-8 bg-white/60 p-6 rounded-xl shadow backdrop-blur-md border border-white/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#6C63A6] mb-3">How are you feeling today?</h3>
                  <div className="flex gap-3 text-2xl">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 hover:scale-110 ${
                          selectedMood === mood 
                            ? 'bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white shadow-lg' 
                            : 'bg-white/80 text-[#6C63A6] hover:bg-white'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={submitMood}
                  disabled={!selectedMood}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-bold shadow hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Mood
                </button>
              </div>
            </div>
            <div className="bg-white/70 rounded-xl p-6 shadow border border-white/30 backdrop-blur-md">
              <h3 className="text-xl font-semibold text-[#6C63A6] mb-4">Mood Trends</h3>
              {moodData.length === 0 ? (
                <div className="text-center text-[#6C63A6] py-8">
                  No mood data yet. Start tracking your moods above! 📊
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moodData}>
                    <XAxis dataKey="date" stroke="#A09ABC" />
                    <YAxis stroke="#A09ABC" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(160, 154, 188, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="moods" fill="#A09ABC" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
