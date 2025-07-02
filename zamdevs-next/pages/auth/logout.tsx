import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { FiLogOut } from 'react-icons/fi';
import { useContext } from 'react';
import { TransitionContext } from '../_app';

export default function Logout() {
  const router = useRouter();
  const { showContent } = useContext(TransitionContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/welcome');
  };

  const handleCancel = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div
      className={
        'relative min-h-screen w-full flex items-center justify-center animate-gradient-bg overflow-hidden transition-all duration-800'
      }
      style={{ cursor: 'default' }}
    >
      <Head>
        <title>Logout | Reflectly</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      </Head>
      {/* Animated Moon */}
      <div className="absolute top-12 right-32 md:right-48 z-10 animate-float-moon">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="45" cy="45" rx="40" ry="40" fill="#E1D8E9" />
          <path d="M45 5a40 40 0 1 0 0 80A32 32 0 1 1 45 5z" fill="#B6A6CA" />
        </svg>
      </div>
      {/* Animated Clouds */}
      <div className="absolute left-0 top-24 w-1/2 z-10 animate-cloud-left pointer-events-none">
        <svg width="320" height="80" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="60" rx="60" ry="20" fill="#D5CFE1" />
          <ellipse cx="140" cy="50" rx="50" ry="18" fill="#E1D8E9" />
          <ellipse cx="220" cy="65" rx="70" ry="22" fill="#B6A6CA" />
        </svg>
      </div>
      <div className="absolute right-0 top-40 w-1/3 z-10 animate-cloud-right pointer-events-none">
        <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="40" rx="50" ry="15" fill="#E1D8E9" />
          <ellipse cx="120" cy="30" rx="40" ry="12" fill="#D5CFE1" />
        </svg>
      </div>
      {/* Twinkling Stars */}
      <div className="absolute left-1/3 top-1/4 text-[#fff] text-2xl opacity-80 z-0 animate-twinkle">✦</div>
      <div className="absolute right-1/4 bottom-1/3 text-[#fff] text-xl opacity-60 z-0 animate-twinkle">✧</div>
      <div className="absolute left-1/4 bottom-1/4 text-[#fff] text-lg opacity-40 z-0 animate-twinkle" style={{ animationDelay: '1s' }}>✦</div>
      <div className="absolute left-1/2 top-1/6 text-[#fff] text-lg opacity-60 z-0 animate-twinkle" style={{ animationDelay: '2s' }}>✦</div>
      {/* Main content with glassmorphism - perfectly centered */}
      <div className={`relative z-20 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6 py-12 bg-white/20 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ minHeight: '340px' }}>
        <div className="flex flex-col items-center mb-6">
          <FiLogOut className="text-5xl text-[#A09ABC] mb-2" />
          <div className="font-serif text-xl font-bold text-[#6C63A6] mb-1 text-center">Oh no! You&#39re leaving...<br/>Are you sure?</div>
        </div>
        <div className="flex flex-col gap-3 w-full items-center">
          <button
            className="py-2 px-8 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-semibold text-lg shadow-lg hover:from-[#B6A6CA] hover:to-[#A09ABC] transition"
            onClick={handleCancel}
          >
            Naah, Just Kidding
          </button>
          <button
            className="py-2 px-8 rounded-full border-2 border-[#A09ABC] text-[#A09ABC] font-semibold text-lg bg-white/80 hover:bg-[#E1D8E9] shadow-lg transition"
            onClick={handleLogout}
          >
            Yes, Log Me Out
          </button>
        </div>
      </div>
    </div>
  );
}
