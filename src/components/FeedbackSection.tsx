"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Send, Share2, Sparkles } from "lucide-react";
import { postFeedback } from "@/lib/marriageApi";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ── Ornamental heart divider matching the site's warm amber palette ──────────
function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8" aria-hidden>
      <div className="h-px w-14 bg-gradient-to-r from-transparent to-amber-300/50" />
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        className="text-amber-400/70"
      >
        <path
          d="M9 14.5S1 9.5 1 4.5A4 4 0 0 1 9 2.927 4 4 0 0 1 17 4.5C17 9.5 9 14.5 9 14.5Z"
          fill="currentColor"
        />
      </svg>
      <div className="h-px w-14 bg-gradient-to-l from-transparent to-amber-300/50" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function FeedbackSection() {
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#feedback`;
    const shareData = {
      title: "Sai Nagendra Weds Sushma",
      text: "Leave your feedback for the wedding",
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        navigator.clipboard.writeText(url);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const hasContent = description.trim() || number.trim();
    if (!hasContent) {
      setStatus("error");
      setErrorMessage("Please add a message or phone number.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const result = await postFeedback({
      description: description.trim() || undefined,
      number: number.trim() || undefined,
    });

    if (result.ok) {
      setStatus("success");
      setDescription("");
      setNumber("");
    } else {
      setStatus("error");
      const msg =
        result.status === 429
          ? "Too many requests. Please wait a few minutes and try again."
          : (result.error ?? "Couldn't send. Please try again.");
      setErrorMessage(msg);
    }
  };

  return (
    <section
      id="feedback"
      className="relative w-full overflow-hidden py-20 sm:py-28"
      aria-label="Leave your feedback"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10" aria-hidden />
      {/* ── Warm cream/ivory base — matching TravelAssistanceSection ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, oklch(0.985 0.012 75) 0%, oklch(0.975 0.018 45) 50%, oklch(0.98 0.014 30) 100%)",
        }}
        aria-hidden
      />

      {/* ── Dot pattern — matching TravelAssistanceSection ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #92400e 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      {/* ── Radial amber glow — top center ── */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(251,191,36,0.13) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Top border rule ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(217,119,6,0.45), transparent)",
        }}
        aria-hidden
      />
      {/* ── Bottom border rule ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(251,113,133,0.35), transparent)",
        }}
        aria-hidden
      />

      <div className="relative max-w-xl mx-auto px-6 sm:px-8">

        {/* ══ Section header ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative text-center"
        >
          {/* Share button — right side */}
          <button
            type="button"
            onClick={handleShare}
            className="absolute right-0 top-0 p-2 rounded-full text-amber-600/70 hover:text-amber-600 hover:bg-amber-100/60 transition-colors"
            aria-label="Share invitation"
          >
            <Share2 className="h-5 w-5" aria-hidden />
          </button>
          {/* Playwrite script title */}
          <h2 className="font-playwrite text-3xl sm:text-4xl text-amber-800/90 leading-tight">
            Leave Your Feedback
          </h2>

          {/* Ornamental heart divider */}
          <HeartDivider />
        </motion.div>

        {/* ══ Card ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-10 relative"
        >
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden",
              "bg-white/85 backdrop-blur-sm",
              "shadow-[0_8px_32px_rgba(120,53,15,0.06),0_2px_8px_rgba(0,0,0,0.03)]",
              "ring-1 ring-amber-200/50"
            )}
          >
            {/* Inner top highlight */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(251,191,36,0.5), transparent)",
              }}
              aria-hidden
            />

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">

                {/* ── Success state ── */}
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="py-10 text-center"
                  >
                    {/* Pulsing ring + rose heart */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1.5], opacity: [0.45, 0, 0] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        className="absolute w-16 h-16 rounded-full border border-rose-300/60"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                          delay: 0.1,
                        }}
                        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200/60"
                      >
                        <Heart
                          className="h-6 w-6 text-rose-500 fill-rose-400/70"
                          aria-hidden
                        />
                      </motion.div>
                    </div>

                    <p className="font-playwrite text-xl text-amber-800/90 mb-2">
                      Thank you
                    </p>
                    <p className="font-josefin text-sm text-neutral-500 mb-7">
                      Your feedback has reached us and will be treasured always.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="inline-flex items-center gap-1.5 font-josefin text-xs tracking-wide text-amber-700 hover:text-amber-800 transition-colors underline underline-offset-4 decoration-amber-300/60"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      Leave another message
                    </button>
                  </motion.div>

                ) : (

                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Textarea */}
                    <div>
                      <label
                        htmlFor="feedback-description"
                        className="block font-josefin text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2"
                      >
                        Your feedback
                      </label>
                      <textarea
                        id="feedback-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share your feedback…"
                        rows={4}
                        maxLength={2000}
                        disabled={status === "loading"}
                        className={cn(
                          "w-full rounded-xl border bg-white/70 px-4 py-3.5",
                          "font-josefin text-sm text-neutral-700 placeholder:text-neutral-400/70",
                          "border-amber-200/60 focus:border-amber-400/70",
                          "focus:ring-2 focus:ring-amber-300/25 focus:outline-none",
                          "transition-all duration-200 leading-relaxed resize-none",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        aria-invalid={status === "error"}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="feedback-number"
                        className="block font-josefin text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2"
                      >
                        Phone number — optional
                      </label>
                      <input
                        id="feedback-number"
                        type="tel"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        maxLength={50}
                        disabled={status === "loading"}
                        className={cn(
                          "w-full rounded-xl border bg-white/70 px-4 py-3",
                          "font-josefin text-sm text-neutral-700 placeholder:text-neutral-400/70",
                          "border-amber-200/60 focus:border-amber-400/70",
                          "focus:ring-2 focus:ring-amber-300/25 focus:outline-none",
                          "transition-all duration-200",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        aria-invalid={status === "error"}
                      />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {status === "error" && errorMessage && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="font-josefin text-xs text-rose-500"
                          role="alert"
                        >
                          {errorMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={status !== "loading" ? { scale: 1.012 } : {}}
                      whileTap={status !== "loading" ? { scale: 0.988 } : {}}
                      className={cn(
                        "w-full flex items-center justify-center gap-2.5",
                        "rounded-xl px-6 py-3.5",
                        "font-josefin text-sm font-medium tracking-wide text-white",
                        "bg-gradient-to-r from-amber-600 to-amber-500",
                        "shadow-[0_2px_16px_rgba(180,83,9,0.3)]",
                        "hover:from-amber-500 hover:to-amber-400",
                        "hover:shadow-[0_4px_20px_rgba(180,83,9,0.38)]",
                        "active:scale-[0.98] transition-all duration-200",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                        "disabled:hover:from-amber-600 disabled:hover:to-amber-500"
                      )}
                    >
                      {status === "loading" ? (
                        <>
                          <span
                            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                            aria-hidden
                          />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden />
                          Send Feedback
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Soft footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-8 font-josefin text-[10px] tracking-[0.3em] uppercase text-amber-700/30"
          aria-hidden
        >
          ✦ &nbsp; With Love &nbsp; ✦
        </motion.p>
      </div>
    </section>
  );
}
