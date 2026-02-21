"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plane,
  Train,
  Bus,
  MapPin,
  Phone,
  ChevronDown,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Vizag",
  "Vijayawada",
] as const;

const EVENTS = [
  { id: "pellikoduku", label: "Pellikoduku Cheytam" },
  { id: "march7-lunch", label: "March 7th Lunch" },
  { id: "pelli", label: "Pelli March 8th 02:35 AM" },
  { id: "sathanamuthi", label: "Sathanamuthi Ratham" },
  { id: "yarnalu-lunch", label: "Yarnalu Lunch" },
] as const;

const VENUE_MAPS_URL = "https://maps.google.com"; // Replace with actual venue link
const TRAVEL_CONTACT = "+91 XXXXXXXXXX";

const transportDetails = {
  flight: {
    icon: Plane,
    title: "By Flight",
    subtitle: "Recommended if you're traveling from a distant city",
    steps: [
      "Book a flight to the nearest airport to the venue.",
      "After arrival, book a cab or use a ride-hailing service.",
      "Travel directly to the wedding venue location.",
    ],
    time: "~ 1 to 1.5 hours (depending on traffic)",
    note: "Pickup assistance from the airport can be arranged on request.",
  },
  train: {
    icon: Train,
    title: "By Train",
    subtitle: "Best balance between comfort and cost",
    steps: [
      "Book a train ticket to the nearest major railway station.",
      "Exit the station and take a cab or auto towards the venue.",
      "Follow the route shared in the map below.",
    ],
    time: "~ 45 minutes to 1 hour",
    note: "Pickup assistance from the railway station is available if needed.",
  },
  bus: {
    icon: Bus,
    title: "By Bus",
    subtitle: "Ideal for nearby cities and towns",
    steps: [
      "Take a bus to the nearest central bus stand.",
      "From the bus stand, hire a cab or auto.",
      "Proceed to the wedding venue using the provided map link.",
    ],
    time: "~ 40 to 60 minutes",
    note: "Local guidance will be available upon arrival.",
  },
} as const;

type TransportKey = keyof typeof transportDetails;

export default function TravelAssistanceSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [expandedTransport, setExpandedTransport] =
    useState<TransportKey | null>(null);

  const showTransport = selectedCity !== null && selectedEvent !== null;
  const hasSelection = selectedEvent !== null || selectedCity !== null;
  const selectedEventLabel =
    EVENTS.find((e) => e.id === selectedEvent)?.label ?? selectedEvent;

  const handleClear = () => {
    setSelectedEvent(null);
    setSelectedCity(null);
    setExpandedTransport(null);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,oklch(0.99_0.01_30)_0%,oklch(0.98_0.015_40)_50%,oklch(0.97_0.02_25)_100%)]"
      aria-label="Travel assistance"
    >
      {/* Subtle map-inspired line texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            oklch(0.3_0.05_30) 2px,
            oklch(0.3_0.05_30) 3px
          )`,
        }}
      />

      <div className="relative max-w-4xl mx-auto py-16 md:py-24 px-4 md:px-8">
        {/* Header */}
        <motion.header
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-2xl md:text-4xl font-bold font-josefin text-neutral-800 mb-5">
            🧭 Travel Assistance
          </h2>
          <p className="text-neutral-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-josefin tracking-tight">
            So glad you're joining us.
          </p>
          <p className="text-neutral-500 text-sm md:text-base max-w-lg mx-auto mt-4 leading-relaxed">
            Tell us which event you're attending and where you're coming from —
            we'll show you the best way to reach the venue.
          </p>
        </motion.header>

        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <p className="text-sm text-neutral-600 font-medium sm:order-1" aria-label="Your selection">
              <span className="text-amber-700/90">{selectedEventLabel}</span>
              {selectedCity && (
                <>
                  <span className="mx-2 text-neutral-400" aria-hidden>•</span>
                  <span className="text-neutral-700">{selectedCity}</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-white/80 border border-neutral-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Clear & start over
            </button>
          </motion.div>
        )}

        {/* Steps: Event → City → Transport (one at a time with transition) */}
        <div className="min-h-[180px]">
          <AnimatePresence mode="wait">
            {!selectedEvent && (
              <motion.div
                key="event"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-10"
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-800/80 mb-3">
                  Which event will you attend?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {EVENTS.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event.id)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2",
                        "bg-white/80 border-neutral-200/80 text-neutral-600 hover:border-amber-400/40 hover:text-neutral-800"
                      )}
                    >
                      {event.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedEvent && !selectedCity && (
              <motion.div
                key="city"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-12"
              >
              <h3 className="text-base md:text-lg font-semibold font-josefin text-neutral-800 mb-2">
                From which city are you coming?
              </h3>
              <p className="text-neutral-500 text-sm mb-4">
                Choose your city to see the most convenient ways to reach the
                wedding venue.
              </p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() =>
                      setSelectedCity(selectedCity === city ? null : city)
                    }
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2",
                      selectedCity === city
                        ? "bg-amber-600/15 border-amber-600/60 text-amber-900 shadow-[0_2px_12px_rgba(180,83,9,0.12)]"
                        : "bg-white/80 border-neutral-200/80 text-neutral-600 hover:border-amber-400/40 hover:text-neutral-800"
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.div>
            )}

            {showTransport && (
              <motion.div
                key="transport"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
              <h3 className="text-base md:text-lg font-semibold font-josefin text-neutral-800 mb-4">
                ✈️🚆🚌 Available Transport Options
              </h3>
              <p className="text-neutral-500 text-sm mb-6">
                Based on your selected city, tap on any option below to see
                step-by-step instructions.
              </p>

              <div className="space-y-3">
                {(Object.keys(transportDetails) as TransportKey[]).map(
                  (key, i) => {
                    const detail = transportDetails[key];
                    const Icon = detail.icon;
                    const isExpanded = expandedTransport === key;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.05 * i,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className={cn(
                          "rounded-2xl border-2 overflow-hidden transition-colors duration-200",
                          "bg-white/90 backdrop-blur-sm",
                          isExpanded
                            ? "border-amber-500/40 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                            : "border-neutral-200/80 hover:border-amber-400/30"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTransport(
                              isExpanded ? null : key
                            )
                          }
                          className="w-full flex items-center gap-4 px-4 py-4 md:px-5 md:py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-inset"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-700">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <span className="flex-1 font-semibold text-neutral-800">
                            {detail.title}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-neutral-400 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                            aria-hidden
                          />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-5 md:px-5 md:pb-6 pt-0 border-t border-neutral-100">
                                <p className="text-neutral-600 text-sm mb-4 mt-3">
                                  {detail.subtitle}
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 mb-4">
                                  {detail.steps.map((step, j) => (
                                    <li key={j} className="pl-1">
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                                <p className="text-sm text-neutral-600 mb-2">
                                  <strong>Estimated travel time:</strong>{" "}
                                  {detail.time}
                                </p>
                                <p className="text-sm text-amber-800/90 italic">
                                  📍 {detail.note}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Venue Location */}
        <motion.div
          className="mt-14 md:mt-16 p-5 md:p-6 rounded-2xl bg-white/70 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h3 className="text-base md:text-lg font-semibold font-josefin text-neutral-800 mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-600" aria-hidden />
            Venue Location
          </h3>
          <p className="text-neutral-600 text-sm mb-4">
            You can easily navigate to the venue using Google Maps. We recommend
            checking live traffic conditions before starting your final leg of
            travel.
          </p>
          <a
            href={VENUE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-medium text-sm hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
            Open Venue in Google Maps
          </a>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="mt-8 p-5 md:p-6 rounded-2xl bg-amber-50/60 border border-amber-200/50"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h3 className="text-base md:text-lg font-semibold font-josefin text-neutral-800 mb-2 flex items-center gap-2">
            <Phone className="h-5 w-5 text-amber-600" aria-hidden />
            Need Help During Travel?
          </h3>
          <p className="text-neutral-600 text-sm mb-3">
            If you feel unsure at any point during your journey, don't worry —
            help is just a call away. We'll be happy to guide you or arrange
            assistance.
          </p>
          <a
            href={`tel:${TRAVEL_CONTACT.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-900 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {TRAVEL_CONTACT}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
