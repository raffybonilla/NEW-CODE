import '../styles/globals.css';
import type { AppProps } from "next/app";
import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";

// Context to let pages know when to animate content in
export const TransitionContext = createContext({ showContent: true });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const handleStart = () => {
      setShowOverlay(true);
      setShowContent(false);
    };
    const handleComplete = () => {
      setTimeout(() => {
        setShowOverlay(false);
        setTimeout(() => setShowContent(true), 350);
      }, 400);
    };
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <TransitionContext.Provider value={{ showContent }}>
      {/* Global transition overlay */}
      <div className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0'}`} style={{background: "linear-gradient(120deg, #A09ABC, #B6A6CA, #E1D8E9, #D4BEBE)", backgroundSize: "200% 200%"}} />
      <Component {...pageProps} />
    </TransitionContext.Provider>
  );
}
