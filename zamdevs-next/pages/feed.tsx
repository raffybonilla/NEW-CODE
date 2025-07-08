import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Sidebar from "../components/Sidebar";
import Head from "next/head";

type JournalEntry = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  public?: boolean;
  title?: string;
};

type Comment = {
  id: string;
  entry_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: { full_name?: string };
};

export default function PublicFeed() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchPublicEntries() {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
      const { data } = await supabase
        .from("journal")
        .select("*")
        .eq("public", true)
        .order("created_at", { ascending: false });
      setEntries(data || []);
      setLoading(false);
      // Fetch comments for all entries
      if (data && data.length > 0) {
        fetchAllComments(data.map((e: JournalEntry) => e.id));
      }

      // Set up real-time subscription for public journal entries
      const channel = supabase
        .channel('public_feed_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'journal',
            filter: 'public=eq.true'
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setEntries(prev => [payload.new as JournalEntry, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setEntries(prev => prev.map(entry => 
                entry.id === payload.new.id ? payload.new as JournalEntry : entry
              ));
            } else if (payload.eventType === 'DELETE') {
              setEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      // Set up real-time subscription for comments
      const commentsChannel = supabase
        .channel('public_comments_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'comments',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const c = payload.new as Comment;
              setComments(prev => ({
                ...prev,
                [c.entry_id]: [...(prev[c.entry_id] || []), c],
              }));
            } else if (payload.eventType === 'UPDATE') {
              const c = payload.new as Comment;
              setComments(prev => ({
                ...prev,
                [c.entry_id]: (prev[c.entry_id] || []).map(com => com.id === c.id ? c : com),
              }));
            } else if (payload.eventType === 'DELETE') {
              const c = payload.old as Comment;
              setComments(prev => ({
                ...prev,
                [c.entry_id]: (prev[c.entry_id] || []).filter(com => com.id !== c.id),
              }));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(commentsChannel);
      };
    }
    fetchPublicEntries();
  }, []);

  async function fetchAllComments(entryIds: string[]) {
    if (!entryIds.length) return;
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(full_name)')
      .in('entry_id', entryIds)
      .order('created_at', { ascending: true });
    if (!error && data) {
      // Group comments by entry_id
      const grouped: Record<string, Comment[]> = {};
      data.forEach((c: any) => {
        if (!grouped[c.entry_id]) grouped[c.entry_id] = [];
        grouped[c.entry_id].push(c);
      });
      setComments(grouped);
    }
  }

  async function handleAddComment(entryId: string) {
    const content = commentInputs[entryId]?.trim();
    if (!content) return;
    setCommentLoading((prev) => ({ ...prev, [entryId]: true }));
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to comment.");
      setCommentLoading((prev) => ({ ...prev, [entryId]: false }));
      return;
    }
    const { data, error } = await supabase
      .from('comments')
      .insert([{ entry_id: entryId, user_id: session.user.id, content }])
      .select('*, user:profiles(full_name)');
    if (!error && data && data[0]) {
      setComments((prev) => ({
        ...prev,
        [entryId]: [...(prev[entryId] || []), data[0]],
      }));
      setCommentInputs((prev) => ({ ...prev, [entryId]: "" }));
    }
    setCommentLoading((prev) => ({ ...prev, [entryId]: false }));
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
        <title>Public Feed - Reflectly</title>
        <meta name="description" content="Public journal entries" />
      </Head>
      <div className="flex min-h-screen bg-gradient-to-br from-[#E1D8E9] via-[#D5CFE1] to-[#B6A6CA]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 p-10 bg-transparent min-h-screen transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-64'}`}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#A09ABC] mb-6">🌍 Public Feed</h2>
            <p className="text-[#6C63A6] mb-6 text-center bg-white/60 p-4 rounded-xl backdrop-blur-md border border-white/30">
              💡 <strong>Tip:</strong> When you create a journal entry and mark it as public, it will automatically appear here in the feed for others to see!
            </p>
            {entries.length === 0 ? (
              <div className="text-[#6C63A6] text-center bg-white/60 p-8 rounded-xl backdrop-blur-md border border-white/30">
                <div className="text-4xl mb-4">📝</div>
                <div className="text-lg font-medium mb-2">No public entries yet</div>
                <div className="text-sm">Be the first to share your thoughts with the community!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, idx) => (
                  <div key={entry.id} className="bg-white/70 rounded-xl p-6 shadow border border-white/30 backdrop-blur-md relative">
                    <div className="flex justify-between items-center mb-3">
                      <div style={{ fontWeight: 700, fontSize: 20, color: '#7c3aed' }}>
                        {entry.title && entry.title.trim() !== '' ? entry.title : `Entry #${entries.length - idx}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{new Date(entry.created_at).toLocaleString()}</span>
                        <span className="bg-[#A09ABC] text-white px-2 py-1 rounded-full text-xs">🌍 Public</span>
                        {userId === entry.user_id && (
                          <>
                            <button
                              // onClick={() => openEditEntryModal(entry)}
                              className="text-blue-500 hover:text-blue-700 transition-colors ml-2"
                              disabled
                            >
                              ✏️ Edit
                            </button>
                            <button
                              // onClick={() => deleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              disabled
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-[#6C63A6] whitespace-pre-wrap leading-relaxed mb-4">
                      {entry.content}
                    </div>
                    {/* Comments Section */}
                    <div className="mt-4 bg-white/80 rounded-lg p-4 border border-[#E1D8E9]">
                      <div className="font-semibold text-[#A09ABC] mb-2">Comments</div>
                      <div className="space-y-2 mb-2">
                        {(comments[entry.id] || []).length === 0 && (
                          <div className="text-[#B6A6CA] text-sm">No comments yet. Be the first to comment!</div>
                        )}
                        {(comments[entry.id] || []).map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A09ABC]/20 flex items-center justify-center text-[#A09ABC] font-bold">
                              {comment.user?.full_name?.[0] || "U"}
                            </div>
                            <div>
                              <div className="text-[#6C63A6] text-sm font-semibold">
                                {comment.user?.full_name || "User"}
                                <span className="ml-2 text-xs text-[#B6A6CA]">{new Date(comment.created_at).toLocaleString()}</span>
                              </div>
                              <div className="text-[#6C63A6] text-base">{comment.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          className="flex-1 rounded-full border border-[#A09ABC] px-4 py-2 text-[#6C63A6] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#A09ABC]/30"
                          placeholder="Add a comment..."
                          value={commentInputs[entry.id] || ""}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [entry.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddComment(entry.id);
                          }}
                          disabled={commentLoading[entry.id]}
                        />
                        <button
                          onClick={() => handleAddComment(entry.id)}
                          className="bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white px-4 py-2 rounded-full font-semibold shadow hover:from-[#B6A6CA] hover:to-[#A09ABC] transition disabled:opacity-50"
                          disabled={commentLoading[entry.id] || !(commentInputs[entry.id] && commentInputs[entry.id].trim())}
                        >
                          Post
                        </button>
                      </div>
                    </div>
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