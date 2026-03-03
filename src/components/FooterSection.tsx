import { useRef } from "react";
import { motion, useInView } from "motion/react";
import mrflatmateLogo from "../assets/mrflatmatelogo.png";

const KAHANIKA_LOGO =
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=366,fit=crop/dJobD61nxbskrvL1/kahanika-5-GK9AXY70jugTrERF.png";

// ─── Tech stack SVG logos ─────────────────────────────────────────────────────

function ReactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-label="React" className="w-full h-full">
      <circle cx="12" cy="12" r="2.3" fill="#61DAFB" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#61DAFB" strokeWidth="1.1" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#61DAFB" strokeWidth="1.1" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#61DAFB" strokeWidth="1.1" transform="rotate(120 12 12)" />
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-label="TypeScript" className="w-full h-full">
      <rect width="24" height="24" rx="3" fill="#3178C6" />
      <path
        d="M14 11.5v1c.17.1.38.16.6.2.23.03.46.05.68.05.22 0 .43-.02.63-.07.2-.04.38-.12.54-.22.16-.1.28-.24.37-.4.09-.17.14-.38.14-.62 0-.19-.03-.35-.08-.48a1.08 1.08 0 0 0-.26-.36 1.9 1.9 0 0 0-.42-.28 5.8 5.8 0 0 0-.57-.24 4.7 4.7 0 0 1-.4-.17.73.73 0 0 1-.24-.16.3.3 0 0 1-.08-.23c0-.08.02-.14.06-.2a.44.44 0 0 1 .15-.14.72.72 0 0 1 .23-.08 1.4 1.4 0 0 1 .3-.03c.18 0 .35.02.52.07.17.04.33.11.47.2V9.2a3 3 0 0 0-.5-.13 3.8 3.8 0 0 0-.62-.05c-.22 0-.43.02-.63.07a1.66 1.66 0 0 0-.54.22c-.16.1-.28.24-.37.42-.09.17-.14.38-.14.61 0 .32.09.58.27.78.18.2.47.37.87.5l.4.14c.12.05.22.1.3.15a.58.58 0 0 1 .2.18.42.42 0 0 1 .06.23.43.43 0 0 1-.05.2.5.5 0 0 1-.15.15.84.84 0 0 1-.25.1 1.44 1.44 0 0 1-.34.03c-.21 0-.42-.03-.6-.09a2 2 0 0 1-.5-.24ZM10.2 10.4H11.5V9.4H7v1h1.3V15h1.9v-4.6Z"
        fill="white"
      />
    </svg>
  );
}

function ViteIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-label="Vite" className="w-full h-full">
      <defs>
        <linearGradient id="ft-vg1" x1="6" y1="2" x2="26" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="ft-vg2" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFEA83" />
          <stop offset="0.083" stopColor="#FFDD35" />
          <stop offset="1" stopColor="#FFA800" />
        </linearGradient>
      </defs>
      <path
        d="M29.884 6.146l-13.142 23.5a.714.714 0 0 1-1.244.005L2.096 6.148a.714.714 0 0 1 .746-1.057l13.156 2.352a.714.714 0 0 0 .253 0L29.14 5.092a.714.714 0 0 1 .744 1.054z"
        fill="url(#ft-vg1)"
      />
      <path
        d="M22.264 2.007L12.54 3.912a.357.357 0 0 0-.288.33l-.598 10.104a.357.357 0 0 0 .437.369l2.707-.617a.357.357 0 0 1 .43.42l-.804 3.939a.357.357 0 0 0 .454.413l1.672-.508a.357.357 0 0 1 .454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222 7.925-15.815a.357.357 0 0 0-.386-.52l-2.786.537a.357.357 0 0 1-.41-.45l1.818-6.306a.357.357 0 0 0-.41-.447z"
        fill="url(#ft-vg2)"
      />
    </svg>
  );
}

function TailwindIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-label="Tailwind CSS" className="w-full h-full">
      <path
        d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.34 11 14.45 12 16 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C14.66 7 13.55 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.34 17 9.45 18 11 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C9.66 13 8.55 12 7 12z"
        fill="#06B6D4"
      />
    </svg>
  );
}

function MotionIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-label="Motion" className="w-full h-full">
      <rect width="28" height="28" rx="5" fill="#0055FF" />
      <path d="M7 21L14 7L21 21" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="9.5" y1="16" x2="18.5" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MapLibreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-label="MapLibre GL" className="w-full h-full">
      <defs>
        <linearGradient id="ft-mlg" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3FB1CE" />
          <stop offset="1" stopColor="#0075C2" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5.5a2.5 2.5 0 0 1 0 5z"
        fill="url(#ft-mlg)"
      />
    </svg>
  );
}

// ─── AI model logos ───────────────────────────────────────────────────────────

function GeminiIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-label="Google Gemini" className="w-full h-full">
      <defs>
        <linearGradient id="ft-gem" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.45" stopColor="#9AB4F9" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      <path
        d="M16 2C16 9.18 10.18 15 3 15C10.18 15 16 20.82 16 28C16 20.82 21.82 15 29 15C21.82 15 16 9.18 16 2Z"
        fill="url(#ft-gem)"
      />
    </svg>
  );
}

/** Sarvam official wordmark — fill driven by CSS `color` (currentColor) */
function SarvamWordmark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 202 32"
      fill="none"
      aria-label="Sarvam AI"
      className="h-4 w-auto"
    >
      <g fill="currentColor">
        <path d="m56.729 1.024-.112 4.665-.025.835-.412-.723c-1.006-1.784-2.395-3.168-4.132-4.137C50.348.7 48.426.21 46.335.21c-2.636 0-5.055.71-7.184 2.1-2.137 1.4-3.87 3.313-5.155 5.687-1.24 2.37-1.871 5.114-1.871 8.149 0 3.035.59 5.733 1.759 8.107 1.164 2.328 2.798 4.199 4.851 5.558 2.087 1.314 4.486 1.983 7.122 1.983 4.686 0 8.157-1.879 10.327-5.592l.408-.698.025.81.112 4.64h6.74V1.023h-6.74Zm-2.307 21.872c-1.626 1.788-3.763 2.69-6.353 2.69s-4.744-.902-6.41-2.686c-1.643-1.804-2.441-4.053-2.441-6.872s.823-5.138 2.44-6.872c1.663-1.784 3.82-2.69 6.41-2.69 2.591 0 4.728.906 6.354 2.69 1.617 1.738 2.436 4.05 2.436 6.872 0 2.823-.82 5.093-2.436 6.868ZM86.862 1.126l-.61 6.602A10.737 10.737 0 0 0 82.68 7.1c-2.424 0-4.32.903-5.638 2.67-1.305 1.708-1.962 4.174-1.962 7.33v13.848H68V1.035h6.785l.054 5.824.013 1.277.436-1.202c.74-2.02 1.838-3.6 3.28-4.685 1.43-1.119 3.114-1.692 5.01-1.692.624 0 1.256.062 1.875.174.578.104 1.048.237 1.414.395h-.005ZM119.693 1.047 107.956 30.95h-7.512L88.704 1.047h7.952l7.584 22.625.108.324.108-.324 7.766-22.625h7.471ZM143.905 1.02l-.133 4.669-.017.835-.412-.723c-1.01-1.784-2.398-3.168-4.132-4.137C137.51.7 135.59.21 133.499.21c-2.64 0-5.056.71-7.185 2.1-2.136 1.4-3.874 3.313-5.155 5.687-1.243 2.37-1.875 5.114-1.875 8.149 0 3.035.595 5.737 1.759 8.107 1.164 2.328 2.802 4.199 4.856 5.558 2.087 1.314 4.481 1.983 7.121 1.983 4.682 0 8.157-1.879 10.319-5.592l.412-.698.016.81.121 4.64h6.735l.013-29.925h-6.735l.004-.008Zm-2.333 21.872c-1.621 1.788-3.758 2.69-6.352 2.69-2.595 0-4.744-.902-6.411-2.686-1.642-1.804-2.436-4.053-2.436-6.872s.819-5.139 2.436-6.872c1.663-1.784 3.821-2.69 6.411-2.69 2.59 0 4.731.906 6.352 2.69 1.618 1.738 2.437 4.05 2.437 6.872 0 2.823-.819 5.093-2.437 6.868ZM201.773 12.858v18.09h-7.051V14.233c0-5.18-2.025-7.807-6.02-7.807-2.129 0-3.817.752-5.014 2.232-1.143 1.43-1.721 3.488-1.721 6.116V30.95h-6.997V14.176c0-5.143-2.004-7.75-5.958-7.75-2.133 0-3.821.753-5.014 2.233-1.185 1.426-1.779 3.484-1.779 6.116V30.95h-6.997V1.026h6.764l.054 4.382.012.973.424-.873a9.042 9.042 0 0 1 3.609-3.9c1.592-.931 3.455-1.401 5.55-1.401 4.49 0 7.588 1.979 9.213 5.883l.208.495.216-.487c.815-1.82 2.108-3.272 3.85-4.315C186.864.73 188.851.207 191.03.207c3.455 0 6.124 1.098 7.941 3.26 1.858 2.132 2.802 5.296 2.802 9.391ZM29.963 22.035c0 3.575-1.659 6.26-4.93 7.974C21.892 31.655 18.051 32 15.377 32c-5.18 0-9.117-.99-11.699-2.944C1.285 27.244.05 24.616.004 21.25v-.104L0 20.937h7.35l.009.2v.095c.158 3.538 3.076 5.488 8.227 5.488 2.112 0 7.018-.395 7.018-4.058 0-2.956-4.003-3.513-8.635-4.165C7.754 17.627.711 16.638.711 9.508.71 3.468 5.604 0 14.13 0c9.122 0 14.248 3.363 14.834 9.728l.008.113.021.228h-7.363l-.016-.19-.009-.092c-.2-2.179-2.19-4.507-7.184-4.507-4.257 0-6.598 1.339-6.598 3.77 0 2.707 3.87 3.181 8.357 3.734 3.064.374 6.535.803 9.184 2.054 3.093 1.463 4.598 3.82 4.598 7.197Z" />
      </g>
    </svg>
  );
}

// ─── Ornamental dividers ──────────────────────────────────────────────────────

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

function Hairline() {
  return (
    <div
      className="h-px w-full"
      style={{
        background: "linear-gradient(to right, transparent, rgba(196,134,42,0.2) 30%, rgba(196,134,42,0.2) 70%, transparent)",
      }}
      aria-hidden
    />
  );
}

// ─── Logo pill wrapper ────────────────────────────────────────────────────────

function LogoPill({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.14, y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      title={label}
      className="w-7 h-7 sm:w-8 sm:h-8 opacity-50 hover:opacity-90 transition-opacity duration-200 cursor-default"
      aria-label={label}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[9px] tracking-[0.3em] uppercase"
      style={{ fontFamily: "'Josefin Sans', sans-serif", color: "#C4862A", opacity: 0.45 }}
    >
      {children}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const techLogos: { label: string; icon: React.ReactNode }[] = [
    { label: "React",        icon: <ReactIcon /> },
    { label: "TypeScript",   icon: <TypeScriptIcon /> },
    { label: "Vite",         icon: <ViteIcon /> },
    { label: "Tailwind CSS", icon: <TailwindIcon /> },
    { label: "Motion",       icon: <MotionIcon /> },
    { label: "MapLibre GL",  icon: <MapLibreIcon /> },
  ];

  const aiLogos: { label: string; icon: React.ReactNode }[] = [
    { label: "Google Gemini", icon: <GeminiIcon /> },
  ];

  return (
    <footer
      ref={ref}
      className="relative w-full overflow-hidden px-4 sm:px-6 pt-10 pb-10 sm:pb-14"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 1px 1px, rgba(196,134,42,0.05) 1px, transparent 0)",
          "linear-gradient(180deg, #FFFAF4 0%, #FEF4E6 55%, #FEF0DC 100%)",
        ].join(", "),
        backgroundSize: "28px 28px, auto",
      }}
      aria-label="Site footer"
    >
      {/* Top fade from previous section */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent z-10"
        aria-hidden
      />

      {/* Top amber rule */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(196,134,42,0.5), transparent)" }}
        aria-hidden
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-7">

        {/* ── Opening ornament ── */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <DiamondDivider />
          <p
            className="text-[10px] tracking-[0.28em] uppercase mt-1"
            style={{ fontFamily: "'Josefin Sans', sans-serif", color: "#C4862A", opacity: 0.55 }}
          >
            Built with love for our special day
          </p>
        </motion.div>

        <Hairline />

        {/* ── Credits — Kahanika first, then @flatmate ── */}
        <motion.div
          className="flex flex-col items-center gap-4 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Subhalekha by @Mrflatmate — first */}
          <div className="flex flex-col items-center gap-2">
            <SectionLabel>Subhalekha designed by</SectionLabel>
            <div className="flex items-center gap-2.5">
              <motion.img
                src={mrflatmateLogo}
                alt="Mrflatmate"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="h-14 w-14 rounded-full object-cover"
                style={{ boxShadow: "0 0 0 1.5px rgba(196,134,42,0.35)" }}
              />
              <div className="flex flex-col">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "1.45rem",
                    color: "#7B2D00",
                    letterSpacing: "0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  @Mrflatmate
                </span>
                <span
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    color: "#C4862A",
                    opacity: 0.65,
                  }}
                >
                  Kasi Pavan Yakkaladevara
                </span>
              </div>
            </div>
          </div>

          {/* Thin separator between credits */}
          <div
            className="h-px w-16"
            style={{ background: "linear-gradient(to right, transparent, rgba(196,134,42,0.25), transparent)" }}
            aria-hidden
          />

          {/* Kahanika Studios — second */}
          <div className="flex flex-col items-center gap-2">
            <SectionLabel>Photos by</SectionLabel>
            <div className="flex items-center gap-2.5">
              <motion.img
                src={KAHANIKA_LOGO}
                alt="Kahanika Studios"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="h-14 w-14 rounded-full object-cover"
                style={{ boxShadow: "0 0 0 1.5px rgba(196,134,42,0.35)" }}
              />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "1.45rem",
                  color: "#7B2D00",
                  letterSpacing: "0.02em",
                }}
              >
                Kahanika Studios
              </span>
            </div>
          </div>
        </motion.div>

        <Hairline />

        {/* ── AI Powered by ── */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SectionLabel>AI Powered by</SectionLabel>
          <div className="flex items-center gap-6">
            {/* Gemini square icon */}
            {aiLogos.map((a) => (
              <LogoPill key={a.label} label={a.label}>
                {a.icon}
              </LogoPill>
            ))}
            {/* Sarvam wordmark */}
            <motion.div
              whileHover={{ scale: 1.06, y: -1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              title="Sarvam AI"
              className="opacity-45 hover:opacity-80 transition-opacity duration-200 cursor-default"
              style={{ color: "#7B2D00" }}
            >
              <SarvamWordmark />
            </motion.div>
          </div>
        </motion.div>

        <Hairline />

        {/* ── Tech Stack ── */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SectionLabel>Tech Stack</SectionLabel>
          <div className="flex items-center justify-center gap-4 sm:gap-5 flex-wrap">
            {techLogos.map((t) => (
              <LogoPill key={t.label} label={t.label}>
                {t.icon}
              </LogoPill>
            ))}
          </div>
        </motion.div>

        {/* ── Copyright ── */}
        <motion.p
          className="text-center pt-1 pb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.25em",
            color: "rgba(196,134,42,0.35)",
            textTransform: "uppercase",
          }}
        >
          ✦ &nbsp; © 2026 Sai Nagendra &amp; Sushma &nbsp; ✦
        </motion.p>
      </div>
    </footer>
  );
}
