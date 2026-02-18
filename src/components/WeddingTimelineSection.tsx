"use client";

import { Timeline } from "@/components/ui/timeline";

const weddingEvents = [
  {
    title: "Engagement",
    date: "Our Beginning",
    content: (
      <div>
        <p className="mb-6 text-sm font-normal leading-relaxed text-neutral-600 md:text-base">
          Where it all began. A simple yes that set our hearts on this beautiful
          journey together.
        </p>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <img
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80"
            alt="Engagement"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80"
            alt="Engagement rings"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1529634137920-cf8d42939020?w=500&q=80"
            alt="Couple"
            width={500}
            height={500}
            className="col-span-2 h-28 w-full rounded-xl object-cover object-center shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-40 lg:h-48"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Mehndi",
    date: "Colors & Joy",
    content: (
      <div>
        <p className="mb-6 text-sm font-normal leading-relaxed text-neutral-600 md:text-base">
          An evening of intricate henna, vibrant colors, and joyful dances. The
          first of many celebrations with our loved ones.
        </p>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <img
            src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=500&q=80"
            alt="Mehndi ceremony"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&q=80"
            alt="Traditional henna"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80"
            alt="Festive décor"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&q=80"
            alt="Celebration"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Sangeet",
    date: "Music & Dance",
    content: (
      <div>
        <p className="mb-6 text-sm font-normal leading-relaxed text-neutral-600 md:text-base">
          A night of rhythm and revelry. Family and friends came together to
          celebrate with performances, laughter, and endless joy.
        </p>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80"
            alt="Sangeet performance"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1470229722913-7c5e01d8767b?w=500&q=80"
            alt="Dance celebration"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80"
            alt="Party lights"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80"
            alt="Wedding party"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Wedding Ceremony",
    date: "The Big Day",
    content: (
      <div>
        <p className="mb-6 text-sm font-normal leading-relaxed text-neutral-600 md:text-base">
          The moment we said our vows. Surrounded by tradition, love, and the
          blessings of our families as we became one.
        </p>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80"
            alt="Wedding ceremony"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&q=80"
            alt="Wedding rings"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=80"
            alt="Bridal portrait"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80"
            alt="Ceremony décor"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Reception",
    date: "Celebration",
    content: (
      <div>
        <p className="mb-6 text-sm font-normal leading-relaxed text-neutral-600 md:text-base">
          A night to remember. Good food, great company, and countless smiles as
          we celebrated the beginning of our forever.
        </p>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80"
            alt="Reception venue"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80"
            alt="Wedding cake"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80"
            alt="First dance"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80"
            alt="Newlyweds"
            width={500}
            height={500}
            className="h-24 w-full rounded-xl object-cover shadow-[0_0_20px_rgba(120,80,60,0.08),0_1px_2px_rgba(0,0,0,0.04)] md:h-36 lg:h-44"
          />
        </div>
      </div>
    ),
  },
];

export default function WeddingTimelineSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,oklch(0.97_0.01_264)_0%,oklch(0.99_0_0)_50%,oklch(0.98_0.02_30)_100%)]"
      aria-label="Wedding timeline"
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.3_0.1_30) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="relative w-full">
        <Timeline
          data={weddingEvents}
          title="Events Timeline"
          subtitle="From the engagement to the reception—every moment that led us here."
          gradientColors={["#f59e0b", "#fb7185", "transparent"]}
        />
      </div>
    </section>
  );
}
