import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/60 bg-white/80 shadow-md backdrop-blur-md transition-colors hover:bg-amber-50 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2"
      aria-label={language === "te" ? "Switch to English" : "Switch to Telugu"}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-bold text-amber-800 select-none"
        >
          {language === "te" ? "తె" : "EN"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
