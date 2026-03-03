import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Camera, ExternalLink, Share2 } from "lucide-react";

const GOOGLE_DRIVE_URL = "https://drive.google.com/drive/folders/1209j3l_1NNzbpvccFaRYl7w_wRRtUoB7";

// ─── Shared ornamental divider ────────────────────────────────────────────────
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

// ─── Three stacked polaroid-style frames ─────────────────────────────────────
function PolaroidStack({ inView }: { inView: boolean }) {
  const frames = [
    { rotate: -9, x: -52, y: 6, delay: 0.05, opacity: 0.7 },
    { rotate: 0, x: 0, y: 0, delay: 0.14, opacity: 1 },
    { rotate: 10, x: 52, y: 8, delay: 0.22, opacity: 0.7 },
  ];

  return (
    <div
      className="relative mx-auto"
      style={{ width: 200, height: 136 }}
      aria-hidden
    >
      {/* Soft amber glow beneath the stack */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-28 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,134,42,0.14) 0%, transparent 72%)",
        }}
      />

      {frames.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, rotate: f.rotate - 4 }}
          animate={
            inView
              ? { opacity: f.opacity, y: f.y, rotate: f.rotate }
              : { opacity: 0, y: 20, rotate: f.rotate - 4 }
          }
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: f.delay,
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            x: f.x - 36,
            y: -48,
            width: 72,
            height: 88,
            background:
              "linear-gradient(150deg, #FFFCF7 0%, #FEF5E7 100%)",
            boxShadow:
              "0 0 0 1px rgba(196,134,42,0.22), 0 6px 20px rgba(123,45,0,0.09)",
            borderRadius: 6,
            padding: "6px 6px 18px 6px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* image placeholder area */}
          <div
            style={{
              flex: 1,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(196,134,42,0.08) 0%, rgba(123,45,0,0.06) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Camera
              style={{
                width: 16,
                height: 16,
                color: "rgba(196,134,42,0.4)",
              }}
            />
          </div>
          {/* polaroid caption strip */}
          <div
            style={{
              height: 8,
              marginTop: 4,
              borderRadius: 2,
              background: "rgba(196,134,42,0.1)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PhotoUploadSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#share-photos`;
    const shareData = {
      title: "Sai Nagendra Weds Sushma — Share Your Photos",
      text: "Upload your wedding photos to our shared Google Drive album.",
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

  return (
    <section
      id="share-photos"
      ref={ref}
      className="relative w-full overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 1px 1px, rgba(196,134,42,0.055) 1px, transparent 0)",
          "linear-gradient(180deg, #FFFAF4 0%, #FEF4E6 55%, #FEF8F1 100%)",
        ].join(", "),
        backgroundSize: "28px 28px, auto",
      }}
      aria-label="Share your wedding photos"
    >
      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10"
        aria-hidden
      />

      {/* Radial amber glow — top center */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[460px] h-56"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(196,134,42,0.11) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Top border rule */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(196,134,42,0.45), transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center text-center gap-0">
        {/* ── Section heading ── */}
        <motion.div
          className="relative flex flex-col items-center gap-2 w-full"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Share button — right side */}
          <button
            type="button"
            onClick={handleShare}
            className="absolute right-0 top-0 p-2 rounded-full text-amber-600/70 hover:text-amber-600 hover:bg-amber-100/60 transition-colors"
            aria-label="Share photo upload link"
          >
            <Share2 className="h-5 w-5" aria-hidden />
          </button>
          <DiamondDivider />
          <h2
            className="text-3xl sm:text-4xl leading-tight my-1"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#7B2D00",
              letterSpacing: "0.02em",
            }}
          >
            Share Your Memories
          </h2>
          <p
            className="text-xs sm:text-sm tracking-[0.22em] font-light"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              color: "#C4862A",
              opacity: 0.85,
            }}
          >
            మీ జ్ఞాపకాలు పంచుకోండి
          </p>
          <DiamondDivider />
        </motion.div>

        {/* ── Polaroid stack illustration ── */}
        <motion.div
          className="mt-10 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
          <PolaroidStack inView={inView} />
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.22 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              boxShadow:
                "0 8px 32px rgba(120,53,15,0.06), 0 2px 8px rgba(0,0,0,0.03)",
              border: "1px solid rgba(196,134,42,0.22)",
            }}
          >
            {/* Inner top highlight */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(196,134,42,0.45), transparent)",
              }}
              aria-hidden
            />

            <div className="p-7 sm:p-9 flex flex-col items-center gap-6">
              {/* Body text */}
              <div className="space-y-2">
                <p
                  className="text-sm sm:text-[15px] leading-relaxed"
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    color: "#6B4226",
                    opacity: 0.85,
                  }}
                >
                  Did you capture a beautiful moment from our celebration? We'd
                  love to treasure every photograph shared by our dear family and
                  friends.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    color: "#6B4226",
                    opacity: 0.6,
                  }}
                >
                  Click below to upload your photos directly to our shared album
                  on Google Drive.
                </p>
              </div>

              {/* CTA Button */}
              <motion.a
                href={GOOGLE_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
                className="relative inline-flex items-center justify-center gap-2.5 w-full rounded-xl px-6 py-4 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #9B3D10 0%, #C4862A 60%, #D9973A 100%)",
                  boxShadow: hovered
                    ? "0 6px 28px rgba(180,83,9,0.42), 0 2px 8px rgba(123,45,0,0.18)"
                    : "0 2px 16px rgba(180,83,9,0.28), 0 1px 4px rgba(123,45,0,0.12)",
                  transition: "box-shadow 0.25s ease",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "#fff",
                  textDecoration: "none",
                }}
                aria-label="Upload your photos to Google Drive"
              >
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={hovered ? { backgroundPositionX: ["200%", "-100%"] } : {}}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
                <Camera className="h-[18px] w-[18px] shrink-0" aria-hidden />
                <span className="tracking-widest uppercase text-xs sm:text-sm">
                  Upload Your Photos
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              </motion.a>

              {/* Subtle footnote */}
              <p
                className="text-[10px] tracking-[0.22em] uppercase"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: "#C4862A",
                  opacity: 0.55,
                }}
              >
                Opens Google Drive · All formats welcome
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer ornament */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-8 text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            color: "#C4862A",
            opacity: 0.3,
          }}
          aria-hidden
        >
          ✦ &nbsp; Every click, a keepsake &nbsp; ✦
        </motion.p>
      </div>
    </section>
  );
}
