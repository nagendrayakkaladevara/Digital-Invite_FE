import { useRef } from "react";
import { motion, useInView } from "motion/react";

// Eagerly import all photos from the assets/photos folder
const photoModules = import.meta.glob<{ default: string }>(
  "../assets/photos/*.jpeg",
  { eager: true }
);

// Known dimensions per filename (obtained at build-config time to prevent layout shift)
const dimMap: Record<string, { w: number; h: number }> = {
  "WhatsApp Image 2026-03-02 at 3.16.27 PM (1).jpeg": { w: 853, h: 1280 },
  "WhatsApp Image 2026-03-02 at 3.16.27 PM.jpeg": { w: 1280, h: 853 },
  "WhatsApp Image 2026-03-02 at 3.16.29 PM (1).jpeg": { w: 1280, h: 853 },
  "WhatsApp Image 2026-03-02 at 3.16.29 PM.jpeg": { w: 853, h: 1280 },
  "WhatsApp Image 2026-03-02 at 3.16.30 PM (1).jpeg": { w: 853, h: 1280 },
  "WhatsApp Image 2026-03-02 at 3.16.30 PM.jpeg": { w: 708, h: 1062 },
  "WhatsApp Image 2026-03-02 at 3.23.42 PM (1).jpeg": { w: 853, h: 1280 },
  "WhatsApp Image 2026-03-02 at 3.23.42 PM.jpeg": { w: 1280, h: 853 },
  "WhatsApp Image 2026-03-02 at 3.45.16 PM.jpeg": { w: 1040, h: 694 },
  "WhatsApp Image 2026-03-02 at 3.47.29 PM.jpeg": { w: 853, h: 1280 },
};

const photos = Object.entries(photoModules).map(([path, mod]) => {
  const filename = path.split("/").pop() ?? "";
  const { w, h } = dimMap[filename] ?? { w: 4, h: 3 };
  return { src: mod.default, w, h };
});

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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: "easeOut" as const },
  },
};

export default function PhotosSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="photos"
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-neutral-50"
      aria-label="Wedding photos"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10" aria-hidden />
      {/* Heading */}
      <motion.div
        className="text-center mb-10 sm:mb-12 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
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
          Our Moments
        </h2>
        <DiamondDivider />
      </motion.div>

      {/* Pinterest masonry grid */}
      <motion.div
        className="max-w-4xl mx-auto columns-2 sm:columns-3 gap-2 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="break-inside-avoid mb-2 sm:mb-3 overflow-hidden rounded-xl group"
          >
            <img
              src={photo.src}
              alt={`Wedding memory ${i + 1}`}
              width={photo.w}
              height={photo.h}
              className="w-full object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
