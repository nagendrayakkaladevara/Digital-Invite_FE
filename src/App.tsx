import { HeroHighlight, Highlight } from "./components/ui/hero-highlight"
import { motion } from "motion/react";
import ShinyText from './components/ShinyText';
import WeddingVideoSection from './components/WeddingVideoSection';
import WeddingTimelineSection from './components/WeddingTimelineSection';

function App() {
  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden">
      {/* Diagonal Cross Grid Top Background */}
      {/* <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      /> */}
      {/* Your Content/Components */}
      <header className="absolute top-0 left-0 right-0 z-20 pt-8 px-6">

      </header>
      <section className="relative min-h-dvh h-dvh w-full">
      <HeroHighlight containerClassName="min-h-dvh">
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
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          With Joy, We Invite You to the Wedding of {" "} <br />
          <Highlight className="text-black dark:text-white">
            Sai Nagendra & Sushma
          </Highlight>.
        </motion.h1>
        <div className="flex justify-center pt-6">
          <button
            type="button"
            className="group relative inline-flex items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 px-6 py-3 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-neutral-300 hover:bg-white hover:shadow-md hover:shadow-neutral-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-offset-2 active:scale-[0.98] dark:border-neutral-700/80 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:shadow-neutral-950/50 dark:focus-visible:ring-neutral-500/40"
            aria-label="Nagendra's AI"
          >
            <ShinyText
              text="✨ Click Here to Chat with Nagendra's AI"
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
          </button>
        </div>
      </HeroHighlight>
      </section>
      <WeddingVideoSection />
      <WeddingTimelineSection />
    </div>
  )
}

export default App
