import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { HeroHighlight, Highlight } from "./components/ui/hero-highlight"
import { motion } from "motion/react";
import ShinyText from './components/ShinyText';
import WeddingVideoSection from './components/WeddingVideoSection';
import WeddingTimelineSection from './components/WeddingTimelineSection';
import TravelAssistanceSection from './components/TravelAssistanceSection';
import FeedbackSection from './components/FeedbackSection';
import SubhalekhaSection from './components/SubhalekhaSection';
import PhotosSection from './components/PhotosSection';
import AIChatPage from './components/AIChatPage';
import LanguageToggle from './components/LanguageToggle';
import logo from './assets/video/logo.svg';

const SECTION_IDS = ["hero", "video", "invitation", "timeline", "photos", "travel", "feedback"] as const;

// Feedback section shows after Mar 8th 2026, 8:00 AM IST
const FEEDBACK_AVAILABLE_FROM = new Date("2026-03-08T02:30:00Z"); // 8am IST = 02:30 UTC

function useFeedbackVisible() {
  const [visible, setVisible] = useState(() => Date.now() >= FEEDBACK_AVAILABLE_FROM.getTime());
  useEffect(() => {
    const remaining = FEEDBACK_AVAILABLE_FROM.getTime() - Date.now();
    if (remaining <= 0) return;
    const t = setTimeout(() => setVisible(true), remaining);
    return () => clearTimeout(t);
  }, []);
  return visible;
}

function useScrollToSection() {
  const { hash, search } = useLocation();

  useEffect(() => {
    const sectionId =
      hash?.slice(1) ||
      new URLSearchParams(search).get("section");
    if (!sectionId || !SECTION_IDS.includes(sectionId as (typeof SECTION_IDS)[number])) return;

    const el = document.getElementById(sectionId);
    if (el) {
      const timer = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash, search]);
}

function LandingPage() {
  useScrollToSection();
  const showFeedback = useFeedbackVisible();

  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden">
      <LanguageToggle />
      <section id="hero" className="relative min-h-dvh h-dvh w-full">
      <HeroHighlight containerClassName="min-h-dvh">
        <motion.img
          src={logo}
          alt=""
          aria-hidden
          className="h-20 md:h-24 lg:h-28 w-auto mx-auto mb-6 object-contain drop-shadow-md"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        />
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-4xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          With Joy, We Invite You to the Wedding of<br />
          <Highlight className="text-black dark:text-white">
            Sai Nagendra &amp; Sushma
          </Highlight>
        </motion.h1>
      </HeroHighlight>
      </section>
      <WeddingVideoSection />
      <SubhalekhaSection />
      <WeddingTimelineSection />
      <TravelAssistanceSection />
      {showFeedback && <FeedbackSection />}
      {/* AI button fixed at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
        <div className="bg-white pb-5 flex justify-center px-4 pointer-events-auto">
          <Link
            to="/chat"
            role="button"
            className="group relative inline-flex items-center justify-center rounded-full border-2 border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-600 shadow-lg transition-all duration-300 hover:border-neutral-400 hover:shadow-xl hover:shadow-neutral-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-offset-2 active:scale-[0.98]"
            aria-label="Ask Nagendra's AI"
          >
            <ShinyText
              text="✨ Ask Nagendra's AI"
              speed={2}
              delay={0}
              color="#000000"
              shineColor="#fafafa"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="font-medium"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<AIChatPage isStandalone onCloseNavigate="/" />} />
    </Routes>
  );
}

export default App