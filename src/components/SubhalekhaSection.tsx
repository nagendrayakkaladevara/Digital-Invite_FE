import { useRef, useState, useCallback } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { motion, useInView } from "motion/react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import shubalekaInvitation from '../assets/video/shubaleka.jpeg';
import shubalekavoice from '../assets/video/shubalekavoice.mp4';

function DiamondDivider() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#C4862A]/45" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
        <path d="M4 0L8 4L4 8L0 4Z" fill="#C4862A" opacity="0.75" />
      </svg>
      <div className="h-px w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#C4862A]/45" />
    </div>
  );
}

function CornerMark({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const posStyle: Record<"tl" | "tr" | "bl" | "br", CSSProperties> = {
    tl: { position: "absolute", top: "-3px", left: "-3px" },
    tr: { position: "absolute", top: "-3px", right: "-3px" },
    bl: { position: "absolute", bottom: "-3px", left: "-3px" },
    br: { position: "absolute", bottom: "-3px", right: "-3px" },
  };
  const paths: Record<"tl" | "tr" | "bl" | "br", string> = {
    tl: "M3 29L3 5Q3 3 5 3L29 3",
    tr: "M29 29L29 5Q29 3 27 3L3 3",
    bl: "M3 3L3 27Q3 29 5 29L29 29",
    br: "M29 3L29 27Q29 29 27 29L3 29",
  };
  const dots: Record<"tl" | "tr" | "bl" | "br", [number, number]> = {
    tl: [3, 3],
    tr: [29, 3],
    bl: [3, 29],
    br: [29, 29],
  };
  const [cx, cy] = dots[pos];
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={posStyle[pos]} aria-hidden>
      <path d={paths[pos]} stroke="#C4862A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2.5" fill="#C4862A" />
    </svg>
  );
}

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const dur = isNaN(a.duration) ? 0 : a.duration;
    setCurrentTime(a.currentTime);
    setDuration(dur);
    setProgress(dur > 0 ? (a.currentTime / dur) * 100 : 0);
  }, []);

  const handleSeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a || isNaN(a.duration)) return;
    const pct = parseFloat(e.target.value);
    a.currentTime = (pct / 100) * a.duration;
    setProgress(pct);
  }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-white/80 rounded-xl border border-[#C4862A]/20 shadow-sm backdrop-blur-sm">
      <audio
        ref={audioRef}
        src={src}
        muted={muted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }}
        onLoadedMetadata={() => {
          const a = audioRef.current;
          if (a && !isNaN(a.duration)) setDuration(a.duration);
        }}
        preload="metadata"
      />

      <button
        onClick={togglePlay}
        className="shrink-0 h-10 w-10 rounded-full bg-[#7B2D00] text-white flex items-center justify-center hover:bg-[#9B3D10] active:scale-95 transition-all shadow"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing
          ? <Pause className="h-[13px] w-[13px]" />
          : <Play className="h-[13px] w-[13px] ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="relative h-1.5 rounded-full overflow-hidden bg-[#C4862A]/10 cursor-pointer">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C4862A] to-[#D9973A] rounded-full pointer-events-none"
            style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            aria-label="Seek audio"
          />
        </div>
        <div
          className="flex justify-between text-[10px] tabular-nums"
          style={{ color: "#B09070", fontFamily: "monospace" }}
        >
          <span>{fmt(currentTime)}</span>
          {duration > 0 && <span>{fmt(duration)}</span>}
        </div>
      </div>

      <button
        onClick={() => setMuted((m) => !m)}
        className="shrink-0 transition-colors"
        style={{ color: muted ? "#C4862A" : "rgba(196,134,42,0.5)" }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function SubhalekhaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="invitation"
      ref={ref}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 1px 1px, rgba(196,134,42,0.055) 1px, transparent 0)",
          "linear-gradient(180deg, #FFFAF4 0%, #FEF4E6 55%, #FEF8F1 100%)",
        ].join(", "),
        backgroundSize: "28px 28px, auto",
      }}
      aria-label="Wedding invitation card"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10" aria-hidden />
      {/* Heading */}
      <motion.div
        className="relative z-10 text-center mb-10 sm:mb-12 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <DiamondDivider />
        <h2
          className="text-4xl sm:text-5xl leading-tight my-1"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#7B2D00",
            letterSpacing: "0.02em",
          }}
        >
          Subhalekha
        </h2>
        <p
          className="text-xs sm:text-sm tracking-[0.22em] font-light"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            color: "#C4862A",
            opacity: 0.85,
          }}
        >
          శుభలేఖ
        </p>
        <DiamondDivider />
      </motion.div>

      {/* Invitation image with ornamental frame */}
      <motion.div
        className="relative z-10 w-full max-w-[min(92vw,500px)]"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.12 }}
      >
        <div
          className="relative p-3 rounded-2xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(196,134,42,0.07) 0%, rgba(255,248,240,0.9) 100%)",
            boxShadow:
              "0 0 0 1px rgba(196,134,42,0.28), 0 16px 56px rgba(123,45,0,0.1), 0 4px 12px rgba(123,45,0,0.06)",
          }}
        >
          <CornerMark pos="tl" />
          <CornerMark pos="tr" />
          <CornerMark pos="bl" />
          <CornerMark pos="br" />
          <img
            src={shubalekaInvitation}
            alt="Wedding invitation – Sai Nagendra Weds Sushma, March 7th 2026"
            className="w-full rounded-xl object-contain"
          />
        </div>
      </motion.div>

      {/* Audio player */}
      <motion.div
        className="relative z-10 mt-8 w-full max-w-[min(92vw,500px)] flex flex-col gap-2"
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.28 }}
      >
        <p
          className="text-[10px] sm:text-xs tracking-[0.2em] uppercase"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            color: "#B09070",
          }}
        >
          Audio note of Subhalekha
        </p>
        <AudioPlayer src={shubalekavoice} />
      </motion.div>
    </section>
  );
}
