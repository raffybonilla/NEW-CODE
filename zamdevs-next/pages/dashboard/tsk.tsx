import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";

type Task = {
  id: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at?: string;
};

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ description: newTask, completed: false, user_id: session.user.id }])
      .select();
    if (!error && data) {
      setTasks([data[0], ...tasks]);
      setNewTask("");
    }
  }

  async function toggleTask(id: string, completed: boolean) {
    await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter(task => task.id !== id));
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
        <title>Tasks - Reflectly</title>
        <meta name="description" content="Manage your tasks" />
      </Head>
      <div className="flex min-h-screen bg-gradient-to-br from-[#E1D8E9] via-[#D5CFE1] to-[#B6A6CA]">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 p-10 bg-transparent min-h-screen transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-64'}`}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#A09ABC] mb-6">📝 Task Manager</h2>

            {/* Add Task */}
            <div className="mb-8 bg-white/60 p-6 rounded-xl shadow backdrop-blur-md border border-white/30">
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/70 text-[#6C63A6] focus:outline-none focus:ring-2 focus:ring-[#A09ABC]"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-bold shadow hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300"
                >
                  ➕ Add
                </button>
              </div>
            </div>

            {/* Task List */}
            {tasks.length === 0 ? (
              <div className="text-[#6C63A6] text-center bg-white/60 p-8 rounded-xl backdrop-blur-md border border-white/30">
                No tasks yet. Add your first task above! 📝
              </div>
            ) : (
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between bg-white/70 p-6 rounded-xl shadow border border-white/30 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, task.completed)}
                        className="h-5 w-5 text-[#A09ABC] rounded focus:ring-2 focus:ring-[#A09ABC]"
                      />
                      <span className={`text-[#6C63A6] text-lg ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.description}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
