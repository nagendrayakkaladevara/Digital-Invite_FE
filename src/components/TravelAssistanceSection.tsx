"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plane,
  Train,
  Bus,
  Car,
  Phone,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
  MapFitBounds,
} from "@/components/ui/map";

const CITIES = [
  "Hyderabad",
  "Vizag",
  "Vijayawada",
  "Rajamendry",
  "Bhimavaram",
] as const;

const EVENTS = [
  { id: "pellikoduku", label: "Pellikoduku Cheytam March 5th Morning" },
  { id: "march7-lunch", label: "March 7th Lunch" },
  { id: "pelli", label: "Pelli March 8th 02:35 AM" },
  { id: "sathanamuthi", label: "Sathanamuthi Ratham March 8th Morning" },
  { id: "yarnalu-lunch", label: "Yarnalu Lunch March 9th" },
] as const;

const TRAVEL_CONTACT = "+91 8099712349";

// Venue coordinates per event (different events may be at different venues)
// Pelli March 8th only is in Eluru (Akkireddigudem); all other events are in Mamidikuduru
const venueByEvent: Record<string, { lng: number; lat: number; name: string }> = {
  pellikoduku: { lng: 82.05, lat: 16.52, name: "Pellikoduku Venue (Mamidikuduru)" },
  "march7-lunch": { lng: 82.05, lat: 16.52, name: "March 7th Lunch Venue (Mamidikuduru)" },
  pelli: { lng: 81.08, lat: 16.78, name: "Wedding Venue (Akkireddigudem, Eluru)" },
  sathanamuthi: { lng: 82.05, lat: 16.52, name: "Sathanamuthi Ratham Venue (Mamidikuduru)" },
  "yarnalu-lunch": { lng: 82.05, lat: 16.52, name: "Yarnalu Lunch Venue (Mamidikuduru)" },
};

// Hyderabad → Mamidikuduru route: 4 key locations for the map (all events except Pelli)
const HYDERABAD_MAMIDIKUDURU_MAP_STOPS = [
  { name: "Rajiv Gandhi International Airport", lng: 78.4304, lat: 17.2403 },
  { name: "Rajahmundry Airport", lng: 81.8182, lat: 17.1104 },
  { name: "Amalapuram Bus Stand", lng: 82.051, lat: 16.537 },
  { name: "Mamidikuduru", lng: 82.05, lat: 16.52 },
] as const;

// Approach point per city + transport (where you arrive: airport, station, bus stand, or city center)
const approachByCityTransport: Record<
  string,
  Record<"flight" | "train" | "bus" | "car", { lng: number; lat: number; name: string }>
> = {
  Hyderabad: {
    flight: { lng: 78.43, lat: 17.24, name: "Rajiv Gandhi Airport" },
    train: { lng: 78.473, lat: 17.435, name: "Secunderabad Junction" },
    bus: { lng: 78.478, lat: 17.38, name: "MGBS Bus Stand" },
    car: { lng: 78.48, lat: 17.385, name: "Hyderabad City" },
  },
  Vizag: {
    flight: { lng: 83.224, lat: 17.721, name: "Vizag Airport" },
    train: { lng: 83.279, lat: 17.689, name: "Vizag Railway Station" },
    bus: { lng: 83.28, lat: 17.69, name: "Vizag Bus Stand" },
    car: { lng: 83.28, lat: 17.69, name: "Vizag City" },
  },
  Vijayawada: {
    flight: { lng: 80.79, lat: 16.53, name: "Vijayawada Airport" },
    train: { lng: 80.656, lat: 16.506, name: "Vijayawada Junction" },
    bus: { lng: 80.65, lat: 16.51, name: "Vijayawada Bus Stand" },
    car: { lng: 80.65, lat: 16.51, name: "Vijayawada City" },
  },
  Rajamendry: {
    flight: { lng: 81.818, lat: 17.11, name: "Rajahmundry Airport" },
    train: { lng: 81.778, lat: 17.005, name: "Rajahmundry Junction" },
    bus: { lng: 81.78, lat: 17.0, name: "Rajahmundry Bus Stand" },
    car: { lng: 81.78, lat: 17.0, name: "Rajahmundry City" },
  },
  Bhimavaram: {
    flight: { lng: 81.818, lat: 17.11, name: "Rajahmundry Airport (nearest)" },
    train: { lng: 81.533, lat: 16.543, name: "Bhimavaram Junction" },
    bus: { lng: 81.535, lat: 16.543, name: "Bhimavaram Bus Stand" },
    car: { lng: 81.535, lat: 16.543, name: "Bhimavaram City" },
  },
};

function getMapData(
  eventId: string | null,
  city: string | null,
  transport: "flight" | "train" | "bus" | "car" | null
): { route: [number, number][]; stops: { name: string; lng: number; lat: number }[]; center: [number, number] } | null {
  if (!eventId || !city || !transport) return null;

  const venue = venueByEvent[eventId];
  // Hyderabad + flight: use nearest airport to venue
  // Pelli (Eluru) → Vijayawada; others (Mamidikuduru) → Rajahmundry
  const approach =
    city === "Hyderabad" && transport === "flight"
      ? eventId === "pelli"
        ? { lng: 80.79, lat: 16.53, name: "Vijayawada Airport" }
        : { lng: 81.8182, lat: 17.1104, name: "Rajahmundry Airport" }
      : approachByCityTransport[city]?.[transport];
  if (!venue || !approach) return null;

  const route: [number, number][] = [
    [approach.lng, approach.lat],
    [venue.lng, venue.lat],
  ];
  const stops = [
    { name: approach.name, lng: approach.lng, lat: approach.lat },
    { name: venue.name, lng: venue.lng, lat: venue.lat },
  ];
  const center: [number, number] = [
    (approach.lng + venue.lng) / 2,
    (approach.lat + venue.lat) / 2,
  ];
  return { route, stops, center };
}

function VenueMap({
  eventId,
  city,
  transport,
}: {
  eventId: string | null;
  city: string | null;
  transport: "flight" | "train" | "bus" | "car";
}) {
  // Hyderabad + Mamidikuduru events (all except Pelli): show 4-marker map
  const isHyderabadMamidikuduru =
    eventId !== "pelli" &&
    city === "Hyderabad" &&
    (transport === "flight" || transport === "bus");

  if (isHyderabadMamidikuduru) {
    const route: [number, number][] = HYDERABAD_MAMIDIKUDURU_MAP_STOPS.map((s) => [
      s.lng,
      s.lat,
    ]);
    const initialCenter: [number, number] = [
      (Math.min(...route.map((r) => r[0])) + Math.max(...route.map((r) => r[0]))) / 2,
      (Math.min(...route.map((r) => r[1])) + Math.max(...route.map((r) => r[1]))) / 2,
    ];

    return (
      <div className="rounded-xl overflow-hidden border border-neutral-200/80 mt-4">
        <div className="h-[320px] md:h-[360px] w-full">
          <Map center={initialCenter} zoom={8}>
            <MapFitBounds coordinates={route} padding={56} maxZoom={12} />
            <MapRoute
              coordinates={route}
              color="#3b82f6"
              width={4}
              opacity={0.8}
            />
            {HYDERABAD_MAMIDIKUDURU_MAP_STOPS.map((stop, index) => (
              <MapMarker
                key={stop.name}
                longitude={stop.lng}
                latitude={stop.lat}
              >
                <MarkerContent>
                  <div className="size-4.5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
                    {index + 1}
                  </div>
                </MarkerContent>
                <MarkerTooltip>{stop.name}</MarkerTooltip>
              </MapMarker>
            ))}
          </Map>
        </div>
      </div>
    );
  }

  const mapData = getMapData(eventId, city, transport);
  if (!mapData) return null;

  const { route, stops, center } = mapData;

  return (
    <div className="rounded-xl overflow-hidden border border-neutral-200/80 mt-4">
      <div className="h-[320px] md:h-[360px] w-full">
        <Map center={center} zoom={10}>
          <MapFitBounds coordinates={route} padding={56} maxZoom={14} />
          <MapRoute
            coordinates={route}
            color="#3b82f6"
            width={4}
            opacity={0.8}
          />
          {stops.map((stop, index) => (
            <MapMarker
              key={stop.name}
              longitude={stop.lng}
              latitude={stop.lat}
            >
              <MarkerContent>
                <div className="size-4.5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
                  {index + 1}
                </div>
              </MarkerContent>
              <MarkerTooltip>{stop.name}</MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
}

// Custom instructions for Hyderabad → Eluru (Pelli March 8th only — Akkireddigudem)
const hyderabadEluruOverrides: Record<
  "flight" | "train" | "bus" | "car",
  { steps: string[]; time: string; note: string }
> = {
  flight: {
    steps: [
      "Book a flight from Rajiv Gandhi International Airport (Hyderabad) to Vijayawada (Gannavaram) Airport — nearest to Eluru.",
      "From Vijayawada Airport: take a cab to the venue in Akkireddigudem (~50 km, Eluru–Jangareddygudem Rd, beside BPCL Petrol Bunk).",
      "Proceed using the map below.",
    ],
    time: "~ 1 to 1.5 hours from Vijayawada (depending on traffic)",
    note: "",
  },
  train: {
    steps: [
      "Book a train from Secunderabad Junction (or Hyderabad Deccan) to Eluru Railway Station.",
      "Exit the station and take a cab or auto to Akkireddigudem (Eluru–Jangareddygudem Rd, beside BPCL Petrol Bunk).",
      "Follow the route shared in the map below.",
    ],
    time: "~ 45 minutes to 1 hour from Eluru station",
    note: "Pickup assistance from Eluru railway station is available if needed.",
  },
  bus: {
    steps: [
      "Take a bus from MGBS (Mahatma Gandhi Bus Station) Hyderabad to Eluru bus stand.",
      "From Eluru bus stand, hire a cab or auto to Akkireddigudem (beside BPCL Petrol Bunk).",
      "Proceed to the venue using the provided map.",
    ],
    time: "~ 40 to 60 minutes from Eluru bus stand",
    note: "Local guidance will be available upon arrival.",
  },
  car: {
    steps: [
      "Drive from Hyderabad to Eluru via NH65, then to Akkireddigudem (Eluru–Jangareddygudem Rd, beside BPCL Petrol Bunk, 534450).",
      "Use GPS or the map below to navigate to the venue.",
      "Park in the designated area near the venue.",
    ],
    time: "~ 6 to 7 hours drive from Hyderabad",
    note: "We recommend checking live traffic before you leave.",
  },
};

// Custom instructions for Hyderabad → Mamidikuduru (all events except Pelli)
const hyderabadMamidikuduruOverrides: Record<
  "flight" | "train" | "bus" | "car",
  { steps: string[]; time: string; note: string }
> = {
  flight: {
    steps: [
      "Book a flight from Rajiv Gandhi International Airport (Hyderabad) to Rajahmundry Airport.",
      "From Rajahmundry Airport: take a cab directly to Mamidikuduru.",
      "Alternative: Take a bus from Rajahmundry to Amalapuram or Razole, then hire an auto to Mamidikuduru (or take a connecting bus).",
    ],
    time: "~ 1.5 to 2 hours from Rajahmundry (depending on traffic)",
    note: "",
  },
  train: {
    steps: [
      "Book a train from Secunderabad to Rajahmundry or Kakinada Junction.",
      "From Rajahmundry: take a cab or bus to Mamidikuduru (or via Amalapuram/Razole).",
      "Follow the route shared in the map below.",
    ],
    time: "~ 2 to 2.5 hours from Rajahmundry",
    note: "Pickup assistance can be arranged on request.",
  },
  bus: {
    steps: [
      "Take a bus (RTC or private travels) from Hyderabad to Amalapuram via Mamidikuduru, and request a stop at Mamidikuduru.",
      "If you choose the Razole bus, you can get an auto or RTC bus which travels via Mamidikuduru.",
    ],
    time: "~ 8 to 10 hours from Hyderabad",
    note: "Local guidance will be available upon arrival at Mamidikuduru.",
  },
  car: {
    steps: [
      "Drive from Hyderabad to Mamidikuduru via Rajahmundry/Amalapuram route.",
      "Use GPS or the map below to navigate to the venue in Mamidikuduru.",
      "Park in the designated area near the venue.",
    ],
    time: "~ 7 to 8 hours drive from Hyderabad",
    note: "We recommend checking live traffic before you leave.",
  },
};

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
    note: "",
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
    note: "",
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
  car: {
    icon: Car,
    title: "By Car",
    subtitle: "Convenient for those driving to the venue",
    steps: [
      "Use GPS or the map below to navigate to the wedding venue.",
      "Park in the designated area near the venue.",
      "Follow signage for guest parking upon arrival.",
    ],
    time: "Varies by your starting point",
    note: "We recommend checking live traffic before you leave.",
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
    EVENTS.find((e) => e.id === selectedEvent)?.label ?? "";

  const handleClear = () => {
    setSelectedEvent(null);
    setSelectedCity(null);
    setExpandedTransport(null);
  };

  return (
    <section
      id="travel"
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

      <div className="relative max-w-4xl mx-auto pt-16 md:pt-24 pb-32 md:pb-36 px-4 md:px-8">
        {/* Header */}
        <motion.header
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <h2 className="text-2xl md:text-4xl font-bold font-josefin text-neutral-800">
              🧭 Travel Assistance
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200/80">
              Work in progress
            </span>
          </div>
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
              {selectedEventLabel && (
                <span className="text-amber-700/90">{selectedEventLabel}</span>
              )}
              {selectedEventLabel && selectedCity && (
                <span className="mx-2 text-neutral-400" aria-hidden>•</span>
              )}
              {selectedCity && (
                <span className="text-neutral-700">{selectedCity}</span>
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
                        selectedEvent === event.id
                          ? "bg-amber-600/15 border-amber-600/60 text-amber-900 shadow-[0_2px_12px_rgba(180,83,9,0.12)]"
                          : "bg-white/80 border-neutral-200/80 text-neutral-600 hover:border-amber-400/40 hover:text-neutral-800"
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
                ✈️🚆🚌🚗 Available Transport Options
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
                                {(() => {
                                  const isHyderabad = selectedCity === "Hyderabad";
                                  const isPelli = selectedEvent === "pelli";
                                  const override = isHyderabad && isPelli
                                    ? hyderabadEluruOverrides[key]
                                    : isHyderabad && !isPelli
                                      ? hyderabadMamidikuduruOverrides[key]
                                      : undefined;
                                  const steps = override?.steps ?? detail.steps;
                                  const time = override?.time ?? detail.time;
                                  const note = override?.note ?? detail.note;
                                  return (
                                    <>
                                      <p className="text-neutral-600 text-sm mb-4 mt-3">
                                        {detail.subtitle}
                                      </p>
                                      <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 mb-4">
                                        {steps.map((step: string, j: number) => (
                                          <li key={j} className="pl-1">
                                            {step}
                                          </li>
                                        ))}
                                      </ol>
                                      <p className="text-sm text-neutral-600 mb-2">
                                        <strong>Estimated travel time:</strong>{" "}
                                        {time}
                                      </p>
                                      {note && (
                                        <p className="text-sm text-amber-800/90 italic mb-4">
                                          📍 {note}
                                        </p>
                                      )}
                                    </>
                                  );
                                })()}
                                {getMapData(selectedEvent, selectedCity, key) && (
                                  <VenueMap eventId={selectedEvent} city={selectedCity} transport={key} />
                                )}
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
