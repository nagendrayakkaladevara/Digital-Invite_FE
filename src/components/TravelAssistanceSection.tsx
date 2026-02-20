"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Plane,
  Train,
  Bus,
  MapPin,
  Phone,
  ChevronDown,
} from "lucide-react";

const CITIES = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Vizag",
  "Vijayawada",
] as const;

type TransportType = "flight" | "train" | "bus";

const TRANSPORT_OPTIONS: Record<
  TransportType,
  {
    icon: React.ElementType;
    label: string;
    tagline: string;
    steps: string[];
    timeEstimate: string;
    note: string;
  }
> = {
  flight: {
    icon: Plane,
    label: "By Flight",
    tagline: "Recommended if you're traveling from a distant city",
    steps: [
      "Book a flight to the nearest airport to the venue.",
      "After arrival, book a cab or use a ride-hailing service.",
      "Travel directly to the wedding venue location.",
    ],
    timeEstimate: "~ 1 to 1.5 hours (depending on traffic)",
    note: "Pickup assistance from the airport can be arranged on request.",
  },
  train: {
    icon: Train,
    label: "By Train",
    tagline: "Best balance between comfort and cost",
    steps: [
      "Book a train ticket to the nearest major railway station.",
      "Exit the station and take a cab or auto towards the venue.",
      "Follow the route shared in the map below.",
    ],
    timeEstimate: "~ 45 minutes to 1 hour",
    note: "Pickup assistance from the railway station is available if needed.",
  },
  bus: {
    icon: Bus,
    label: "By Bus",
    tagline: "Ideal for nearby cities and towns",
    steps: [
      "Take a bus to the nearest central bus stand.",
      "From the bus stand, hire a cab or auto.",
      "Proceed to the wedding venue using the provided map link.",
    ],
    timeEstimate: "~ 40 to 60 minutes",
    note: "Local guidance will be available upon arrival.",
  },
};

// ⬇️ Update these with your actual details
const VENUE_GOOGLE_MAPS_URL = "https://maps.google.com";
const TRAVEL_CONTACT = "+91 XXXXXXXXXX";

function TransportCard({
  type,
  isExpanded,
  onToggle,
  index,
}: {
  type: TransportType;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const option = TRANSPORT_OPTIONS[type];
  const Icon = option.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full text-left group rounded-2xl border transition-all duration-300",
          "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm",
          "border-neutral-200/80 dark:border-neutral-700/80",
          "hover:border-amber-300/60 dark:hover:border-amber-600/40",
          "hover:shadow-[0_8px_30px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2",
          isExpanded && "border-amber-400/70 dark:border-amber-500/50 shadow-lg"
        )}
      >
        <div className="flex items-center gap-4 px-5 py-4 md:px-6 md:py-5">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
              isExpanded
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 group-hover:bg-amber-500/10 group-hover:text-amber-600"
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-josefin text-lg font-semibold text-neutral-800 dark:text-neutral-100">
              {option.label}
            </h4>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {option.tagline}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300",
              isExpanded && "rotate-180 text-amber-600 dark:text-amber-400"
            )}
          />
        </div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="border-t border-neutral-200/80 dark:border-neutral-700/80 px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
                <ol className="space-y-3">
                  {option.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm md:text-base">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-300">
                        {i + 1}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Estimated travel time from{" "}
                  {type === "flight"
                    ? "airport"
                    : type === "train"
                      ? "station"
                      : "bus stand"}
                  :
                </p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {option.timeEstimate}
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="italic">{option.note}</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export default function TravelAssistanceSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedTransport, setExpandedTransport] =
    useState<TransportType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCitySelect = (city: string) => {
    setSelectedCity((prev) => (prev === city ? null : city));
  };

  const handleTransportToggle = (type: TransportType) => {
    setExpandedTransport((prev) => (prev === type ? null : type));
  };

  return (
    <section
      id="travel"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-20 md:py-28"
      aria-label="Travel assistance"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.99 0.01 75) 0%, oklch(0.98 0.02 50) 35%, oklch(0.97 0.015 30) 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, oklch(0.3 0.05 30) 1px, transparent 1px),
                            linear-gradient(to bottom, oklch(0.3 0.05 30) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
            🧭 Travel Assistance
          </span>
          <h2 className="font-josefin text-2xl font-bold tracking-tight text-neutral-800 dark:text-white md:text-3xl lg:text-4xl">
            Your Journey, Made Simple
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
            We're truly delighted to have you join us on our special day. To make
            your journey smooth and stress-free, we've put together simple
            travel guidance based on the city you are coming from.
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
            Just select your city below, and we'll show you the best available
            travel options along with clear next steps.
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12"
        >
          <p className="text-center font-medium text-neutral-700 dark:text-neutral-200">
            From which city are you coming?
          </p>
          <p className="mt-2 text-center text-sm italic text-neutral-500 dark:text-neutral-400">
            Choose your city to see the most convenient ways to reach the wedding
            venue.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CITIES.map((city) => (
              <motion.button
                key={city}
                type="button"
                onClick={() => handleCitySelect(city)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2",
                  selectedCity === city
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                    : "bg-white/90 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-amber-300/60 hover:text-amber-700 dark:hover:text-amber-400"
                )}
              >
                {city}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Transport options - shown when city selected */}
        <AnimatePresence mode="wait">
          {selectedCity && (
            <motion.div
              key={selectedCity}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12 space-y-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400"
              >
                ✈️ 🚆 🚌 Available transport options from {selectedCity}
              </motion.p>
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-500">
                Tap on any option below to see step-by-step instructions.
              </p>
              <div className="space-y-4">
                {(["flight", "train", "bus"] as const).map((type, i) => (
                  <TransportCard
                    key={type}
                    type={type}
                    isExpanded={expandedTransport === type}
                    onToggle={() => handleTransportToggle(type)}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Venue location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-6 md:p-8"
        >
          <h3 className="font-josefin flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-white">
            <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Venue Location
          </h3>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            You can easily navigate to the venue using Google Maps:
          </p>
          <a
            href={VENUE_GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:bg-amber-600 hover:shadow-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            Open Venue in Google Maps
          </a>
          <p className="mt-4 text-xs italic text-neutral-500 dark:text-neutral-500">
            We recommend checking live traffic conditions before starting your
            final leg of travel.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 text-center"
        >
          <h3 className="font-josefin text-lg font-semibold text-neutral-800 dark:text-white">
            ☎️ Need Help During Travel?
          </h3>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            If you feel unsure at any point during your journey, don't worry —
            help is just a call away.
          </p>
          <p className="mt-4 font-medium text-neutral-800 dark:text-white">
            Travel Assistance Contact:
          </p>
          <a
            href={`tel:${TRAVEL_CONTACT.replace(/\s/g, "")}`}
            className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-lg"
          >
            <Phone className="h-5 w-5" />
            {TRAVEL_CONTACT}
          </a>
          <p className="mt-4 text-xs italic text-neutral-500 dark:text-neutral-500">
            We'll be happy to guide you or arrange assistance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
