import Head from "next/head";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const palette = {
  nostalgia1: "#A09ABC",
  nostalgia2: "#B6A6CA",
  nostalgia3: "#D5CFE1",
  nostalgia4: "#E1D8E9",
  nostalgia5: "#D4BEBE",
  dark: "#6C63A6"
};

const slides = ["welcome", "about", "features", "auth"];

export default function Home() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const prevSlide = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <Head>
        <title>Welcome | Reflectly</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      </Head>
      {/* Animated Background */}
      <div
        className="fixed inset-0 -z-10 animate-gradient-bg"
        style={{
          background: `linear-gradient(120deg, ${palette.dark}, ${palette.nostalgia1}, ${palette.nostalgia2}, ${palette.nostalgia3}, ${palette.nostalgia4}, ${palette.nostalgia5})`,
          backgroundSize: "300% 300%"
        }}
      />
      {/* Animated Doodles & Graphics */}
      {/* Floating Notebook */}
      <motion.div
        className="absolute left-8 bottom-16 z-0"
        initial={{ y: 0, rotate: -8 }}
        animate={{ y: [0, -20, 0], rotate: [-8, 8, -8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="50" height="50" rx="8" fill="#B6A6CA" stroke="#A09ABC" strokeWidth="3"/>
          <rect x="18" y="18" width="34" height="34" rx="4" fill="#fff" stroke="#A09ABC" strokeWidth="2"/>
          <line x1="22" y1="26" x2="48" y2="26" stroke="#A09ABC" strokeWidth="2"/>
          <line x1="22" y1="34" x2="48" y2="34" stroke="#A09ABC" strokeWidth="2"/>
          <line x1="22" y1="42" x2="48" y2="42" stroke="#A09ABC" strokeWidth="2"/>
        </svg>
      </motion.div>
      {/* Animated Pen */}
      <motion.div
        className="absolute right-12 top-24 z-0"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [0, 18, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="8" width="10" height="30" rx="4" fill="#A09ABC"/>
          <rect x="22" y="38" width="6" height="8" rx="2" fill="#D4BEBE"/>
          <rect x="22" y="4" width="6" height="8" rx="2" fill="#E1D8E9"/>
        </svg>
      </motion.div>
      {/* Twinkling Stars */}
      <motion.div
        className="absolute left-1/3 top-1/4 text-[#fff] text-2xl opacity-80 z-0"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >✦</motion.div>
      <motion.div
        className="absolute right-1/4 bottom-1/3 text-[#fff] text-xl opacity-60 z-0"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >✧</motion.div>
      <motion.div
        className="absolute left-1/4 bottom-1/4 text-[#fff] text-lg opacity-40 z-0"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >✦</motion.div>
      <motion.div
        className="absolute left-1/2 top-1/6 text-[#fff] text-lg opacity-60 z-0"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >✦</motion.div>
      {/* Floating Cloud (extra) */}
      <motion.div
        className="absolute left-1/2 bottom-10 w-32 h-16 bg-white rounded-full opacity-30 z-0"
        initial={{ x: 0 }}
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Smiley Face */}
      <motion.div
        className="absolute right-1/3 top-1/2 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#D5CFE1" stroke="#A09ABC" strokeWidth="2"/>
          <circle cx="17" cy="21" r="2" fill="#A09ABC"/>
          <circle cx="31" cy="21" r="2" fill="#A09ABC"/>
          <path d="M18 30c2 2 8 2 12 0" stroke="#A09ABC" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.div>
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
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {current === 0 && (
            <motion.section
              key="welcome"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-screen w-full relative"
            >
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 0.6, x: 0 }} transition={{ duration: 1 }} className="absolute left-8 top-10 w-32 h-16 bg-white rounded-full opacity-60" />
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 0.4, x: 0 }} transition={{ duration: 1.2 }} className="absolute right-8 top-20 w-40 h-20 bg-white rounded-full opacity-40" />
              <motion.div
                className="z-10 p-10 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center"
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#A09ABC] mb-4 drop-shadow" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Welcome to Reflectly
                </h1>
                <p className="mb-8 text-lg text-[#A09ABC] text-center" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Click the button below to begin your journey
                </p>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={nextSlide}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-semibold text-xl shadow-lg hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#A09ABC]/30"
                >
                  Click Me
                </motion.button>
              </motion.div>
            </motion.section>
          )}
          {current === 1 && (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-screen w-full relative"
            >
              <motion.div
                className="z-10 p-10 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center max-w-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#A09ABC] mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  About Reflectly
                </h2>
                <p className="mb-8 text-lg text-[#A09ABC] text-center" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Reflectly is a minimalist journaling application designed to foster consistent self-reflection and emotional awareness. The app enables users to write daily entries, tag moods, and revisit past reflections in a serene, clutter-free environment. With privacy at its core, Reflectly offers a personal space for users to process thoughts, track patterns, and develop emotional resilience.
                </p>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={nextSlide}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-semibold text-xl shadow-lg hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#A09ABC]/30"
                >
                  Proceed
                </motion.button>
              </motion.div>
            </motion.section>
          )}
          {current === 2 && (
            <motion.section
              key="features"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-screen w-full relative"
            >
              <motion.div
                className="z-10 p-10 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center max-w-5xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#A09ABC] mb-8" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Features
                </h2>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center my-8">
                  {[
                    "Create, edit, and delete daily journal entries with ease",
                    "Mood tagging via intuitive emoji or slider system",
                    "Interactive calendar for mood and entry history tracking",
                    "Minimalist user interface with light and dark mode options",
                    "Enhanced privacy with biometric login and optional app lock",
                    "Smart reminders to encourage consistent journaling habits",
                    "Voice-to-text functionality for hands-free entry creation",
                    "Support for attaching photos, audio, and other media to entries",
                    "Full offline functionality to access and edit entries without internet",
                    "Time capsule feature to schedule future resurfacing of selected entries",
                    "Cross-platform syncing for seamless access on mobile, web, and desktop",
                    "Mood analytics and trend visualization to monitor emotional patterns over time",
                  ].map((feature, idx) => (
                    <motion.div
                      key={feature}
                      className="bg-white/60 rounded-2xl p-6 shadow-xl backdrop-blur-md border border-white/30 flex items-center justify-center text-center text-[#6C63A6] font-medium min-h-[120px] cursor-pointer transition-all"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      whileHover={{ y: -12, scale: 1.04, boxShadow: "0 8px 32px 0 #A09ABC33" }}
                      transition={{ duration: 0.5, delay: 0.05 * idx, type: "spring" }}
                    >
                      {feature}
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={nextSlide}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-semibold text-xl shadow-lg hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#A09ABC]/30"
                >
                  Proceed
                </motion.button>
                {current > 0 && (
                  <button onClick={prevSlide} className="absolute left-4 top-4 text-[#A09ABC] underline">Back</button>
                )}
              </motion.div>
            </motion.section>
          )}
          {current === 3 && (
            <motion.section
              key="auth"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-screen w-full relative"
            >
              <motion.div
                className="z-10 p-10 bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#A09ABC] mb-4" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Get Started
                </h2>
                <div className="flex gap-6 mt-4">
                  <a href="/auth/signup" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-bold text-lg shadow hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300">Sign Up</a>
                  <a href="/auth/login" className="px-8 py-3 rounded-full bg-white/80 text-[#A09ABC] font-bold text-lg shadow border border-[#A09ABC] hover:bg-[#E1D8E9] transition-all duration-300">Log In</a>
                </div>
                {current > 0 && (
                  <button onClick={prevSlide} className="absolute left-4 top-4 text-[#A09ABC] underline">Back</button>
                )}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
