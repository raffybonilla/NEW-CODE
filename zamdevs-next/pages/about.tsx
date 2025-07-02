import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { TransitionContext } from "./_app";

export default function About() {
  const [show, setShow] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const router = useRouter();
  const { showContent } = useContext(TransitionContext);

  useEffect(() => {
    setTimeout(() => setHideOverlay(true), 400);
    setTimeout(() => setShow(true), 50);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center animate-gradient-bg overflow-hidden px-4">
      <Head>
        <title>About | Reflectly</title>
      </Head>
      {/* Cinematic overlay transition */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-transform duration-700 ${hideOverlay ? "-translate-y-full" : "translate-y-0"}`} style={{background: "linear-gradient(120deg, #A09ABC, #B6A6CA, #E1D8E9, #D4BEBE)", backgroundSize: "200% 200%"}} />
      {/* Illustration Side */}
      <div className={`flex-1 flex items-center justify-center mb-8 md:mb-0 animate-float transition-all duration-700 ${show && showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Image src="/journaling.svg" alt="Journaling Illustration" width={340} height={340} className="w-[260px] h-[260px] md:w-[340px] md:h-[340px] object-contain" />
      </div>
      {/* Text Side */}
      <div className={`flex-1 flex flex-col items-center md:items-start justify-center z-10 transition-all duration-700 ${show && showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#A09ABC] mb-4">About Reflectly</h1>
        <p className="text-lg md:text-xl text-[#6C63A6] max-w-xl text-center md:text-left mb-8">
          Reflectly is a minimalist journaling application designed to foster consistent self-reflection and emotional awareness. The app enables users to write daily entries, tag moods, and revisit past reflections in a serene, clutter-free environment. With privacy at its core, Reflectly offers a personal space for users to process thoughts, track patterns, and develop emotional resilience.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-semibold text-lg shadow-lg hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#A09ABC]/30"
        >
          Proceed to Login
        </button>
      </div>
      {/* Decorative overlays */}
      <div className="absolute w-[500px] h-[500px] bg-[#A09ABC]/20 rounded-full top-[-120px] left-[-120px] z-0 blur-2xl" />
      <div className="absolute w-[300px] h-[300px] bg-[#D4BEBE]/30 rounded-full bottom-[-80px] right-[-80px] z-0 blur-2xl" />
    </div>
  );
}
