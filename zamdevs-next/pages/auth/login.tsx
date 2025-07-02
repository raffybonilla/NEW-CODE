import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import Head from "next/head";
import { TransitionContext } from "../_app";
import Link from "next/link";
import { motion } from "framer-motion";

const palette = {
  nostalgia1: "#A09ABC",
  nostalgia2: "#B6A6CA",
  nostalgia3: "#D5CFE1",
  nostalgia4: "#E1D8E9",
  nostalgia5: "#D4BEBE",
  dark: "#6C63A6"
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  const { showContent } = useContext(TransitionContext);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  useEffect(() => {
    setTimeout(() => setShowText(true), 100);
    // Check for confirmation in URL (Supabase may use hash or query)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('confirmed') === 'true' || window.location.hash.includes('access_token')) {
        setConfirmationMsg("Email confirmed! Please log in.");
        // Optionally, clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // After successful login, ensure profile exists
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (user) {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();
        if (!profile && !profileError) {
          // Insert new profile with id and email
          await supabase.from("profiles").insert([
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.first_name && user.user_metadata?.last_name
                ? user.user_metadata.first_name + " " + user.user_metadata.last_name
                : "",
            },
          ]);
        }
      }
      router.push("/dashboard");
    }
  }

  function handleSignup() {
    router.push("/auth/signup");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <Head>
        <title>Login | Reflectly</title>
      </Head>
      {/* Animated Background */}
      <div
        className="fixed inset-0 -z-10 animate-gradient-bg"
        style={{
          background: `linear-gradient(120deg, ${palette.dark}, ${palette.nostalgia1}, ${palette.nostalgia2}, ${palette.nostalgia3}, ${palette.nostalgia4}, ${palette.nostalgia5})`,
          backgroundSize: "300% 300%"
        }}
      />
      {/* Animated Blob Behind Card */}
      <motion.div className="absolute right-1/4 top-1/4 w-[14rem] h-[14rem] rounded-full bg-[#A09ABC]/40 blur-3xl z-0" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      {/* Glassmorphism Card */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center w-full max-w-md min-h-[300px] h-auto bg-white/25 border border-white/40 rounded-3xl shadow-2xl backdrop-blur-2xl mx-1 my-4 overflow-hidden" style={{ boxShadow: "0 8px 32px 0 #A09ABC33, 0 0 0 1.5px #fff3" }}>
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center px-3 py-3 md:px-5 md:py-5 min-w-[160px] max-w-[320px]">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col items-center mb-1">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="4" width="8" height="20" rx="4" fill="#A09ABC"/>
                <rect x="16" y="24" width="4" height="6" rx="2" fill="#D4BEBE"/>
                <rect x="16" y="2" width="4" height="6" rx="2" fill="#E1D8E9"/>
              </svg>
            </motion.div>
            <h1 className="text-lg md:text-xl font-bold text-[#6C63A6] mt-0.5 mb-0.5 text-center tracking-wide">Login</h1>
            <div className="w-8 md:w-10 h-0.5 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] opacity-60 mb-0.5" />
          </motion.div>
          <form className="flex flex-col gap-1 md:gap-2" onSubmit={handleLogin}>
            <label htmlFor="email" className="text-[#6C63A6] font-semibold text-xs md:text-sm">Email</label>
            <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="p-1 md:p-2 rounded-lg border border-[#D5CFE1] bg-white/80 text-[#6C63A6] text-xs md:text-sm placeholder-[#A09ABC] focus:outline-none focus:ring-2 focus:ring-[#A09ABC] transition-all duration-200 hover:shadow-lg w-full" />
            <label htmlFor="password" className="text-[#6C63A6] font-semibold text-xs md:text-sm mt-1">Password</label>
            <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="p-1 md:p-2 rounded-lg border border-[#D5CFE1] bg-white/80 text-[#6C63A6] text-xs md:text-sm placeholder-[#A09ABC] focus:outline-none focus:ring-2 focus:ring-[#A09ABC] transition-all duration-200 hover:shadow-lg w-full" />
            <button type="submit" className="mt-2 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-bold text-base md:text-lg shadow hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 hover:shadow-xl w-full">Login</button>
          </form>
          <div className="text-center text-[#6C63A6] mt-1 text-xs md:text-sm">
            Don't have an account? <Link href="/auth/signup" className="underline text-[#A09ABC] font-semibold">Sign Up</Link>
          </div>
          {error && <div className="text-red-500 text-center mt-1 text-xs md:text-sm">{error}</div>}
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 min-w-[80px] max-w-[120px] relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="mb-1 md:mb-2">
            <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="80" rx="40" ry="20" fill="#D5CFE1" />
              <ellipse cx="80" cy="70" rx="20" ry="10" fill="#B6A6CA" />
              <ellipse cx="45" cy="70" rx="15" ry="8" fill="#E1D8E9" />
              <rect x="50" y="50" width="20" height="24" rx="6" fill="#A09ABC" />
              <rect x="56" y="62" width="8" height="8" rx="2" fill="#fff" />
              <path d="M60 50v-8a8 8 0 1 1 16 0v8" stroke="#6C63A6" strokeWidth="2" fill="none" />
            </svg>
          </motion.div>
          {/* Sparkles */}
          <motion.div className="absolute left-2 top-2 text-[#A09ABC] text-xs md:text-lg opacity-70" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>✦</motion.div>
          <motion.div className="absolute right-2 bottom-2 text-[#B6A6CA] text-xs md:text-lg opacity-60" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>✧</motion.div>
        </div>
      </div>
      <style>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg {
          animation: gradientBG 16s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}