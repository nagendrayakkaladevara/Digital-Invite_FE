"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  title?: string;
  subtitle?: string;
  /** CSS color values for the scroll-progress line gradient (from bottom to top) */
  gradientColors?: [string, string, string];
}

export const Timeline = ({
  data,
  title = "Changelog from my journey",
  subtitle = "I've been working on Aceternity for the past 2 years. Here's a timeline of my journey.",
  gradientColors = ["#f59e0b", "#fb7185", "transparent"],
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#C4862A]/45" />
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M4 0L8 4L4 8L0 4Z" fill="#C4862A" opacity="0.75" />
          </svg>
          <div className="h-px w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#C4862A]/45" />
        </div>
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
          {title}
        </h2>
        <div className="flex items-center gap-3 mt-3 mb-4">
          <div className="h-px w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#C4862A]/45" />
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M4 0L8 4L4 8L0 4Z" fill="#C4862A" opacity="0.75" />
          </svg>
          <div className="h-px w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#C4862A]/45" />
        </div>
        <p className="text-neutral-500 text-sm md:text-base max-w-sm">
          {subtitle}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: `linear-gradient(to top, ${gradientColors[0]} 0%, ${gradientColors[1]} 10%, ${gradientColors[2]} 100%)`,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
