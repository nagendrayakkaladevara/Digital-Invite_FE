import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xl dark:border-neutral-700/80 dark:bg-neutral-900"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-popup-title"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400/40 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-8">
              <h2
                id="welcome-popup-title"
                className="text-xl font-semibold text-neutral-800 dark:text-neutral-100"
              >
                Hey, this is Nagendra! 👋
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-300">
                Due to my hectic schedule, I didn't get much time to build the
                application. 😅 This application will be launched on the 23rd! 🎉
              </p>
              <p className="mt-3 text-neutral-600 dark:text-neutral-300">
                Thank you! 🙏
              </p>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full"
              size="lg"
            >
              Got it! ✨
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
