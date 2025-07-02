import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Sidebar from "../components/Sidebar";
import Head from "next/head";
import Image from "next/image";

export default function Feed() {
  const [collapsed, setCollapsed] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      // Fetch all public journal entries with user info
      const { data, error } = await supabase
        .from("journal")
        .select("id, content, created_at, mood, public, user_id, profiles:profiles(id, full_name, avatar_url)")
        .eq("public", true)
        .order("created_at", { ascending: false });
      setEntries(data || []);
      setLoading(false);
    }
    fetchFeed();
  }, []);

  return (
    <>
      <Head>
        <title>Feed | Reflectly</title>
        <meta name="description" content="See public reflections from the community" />
      </Head>
      <div className="flex min-h-screen bg-gradient-to-br from-[#E1D8E9] via-[#B6A6CA] to-[#D4BEBE]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 p-10 bg-transparent min-h-screen transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-64'}`}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#A09ABC] mb-8 font-serif">🌍 Public Feed</h2>
            {loading ? (
              <div className="text-center text-[#A09ABC]">Loading feed...</div>
            ) : entries.length === 0 ? (
              <div className="bg-white/40 rounded-xl p-8 text-center text-[#B6A6CA] shadow backdrop-blur-md border border-white/30">No public entries yet. Be the first to share your reflection!</div>
            ) : (
              <div className="flex flex-col gap-6">
                {entries.map(entry => (
                  <div key={entry.id} className="bg-white/30 rounded-2xl shadow-xl backdrop-blur-md p-6 flex flex-col gap-2 border border-white/40">
                    <div className="flex items-center gap-3 mb-2">
                      <Image src={entry.profiles?.avatar_url || "/default-avatar.png"} alt="Avatar" width={40} height={40} className="rounded-full border-2 border-[#E1D8E9] bg-white" />
                      <div>
                        <div className="font-semibold text-[#A09ABC]">{entry.profiles?.full_name || "Anonymous"}</div>
                        <div className="text-xs text-[#B6A6CA]">{new Date(entry.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-2xl mb-2">{entry.mood || "📝"}</div>
                    <div className="text-[#6C63A6] whitespace-pre-wrap text-lg">{entry.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 