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
  MapPin,
  Navigation,
  Clock,
  Info,
  CheckCircle2,
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
  { id: "pellikoduku", label: "Pellikoduku Cheytam", date: "Mar 5 · Morning", emoji: "🎊" },
  { id: "march7-lunch", label: "Lunch at Home", date: "Mar 7 · 11:30 AM", emoji: "🍽️" },
  { id: "pelli", label: "Pelli (Wedding)", date: "Mar 8 · 02:35 AM", emoji: "💍" },
  { id: "sathanamuthi", label: "Satyanaraya Vratam", date: "Mar 8 · Morning", emoji: "🪔" },
  { id: "yarnalu-lunch", label: "Yarnalu Lunch", date: "Mar 9 · Afternoon", emoji: "🎉" },
] as const;

const TRAVEL_CONTACTS = [
  { name: "Prabhu", relation: "Nagendra's Father", phone: "+91 8099712349" },
  { name: "Prasad", relation: "Nagendra's Babaya", phone: "+91 9014315333" },
  { name: "Suresh", relation: "Nagendra's Babaya", phone: "+91 7013297510" },
  { name: "Kasi Pavan", relation: "Brother", phone: "+91 9492533304" },
];

// Venue coordinates per event
const venueByEvent: Record<string, { lng: number; lat: number; name: string }> = {
  pellikoduku: { lng: 82.05, lat: 16.52, name: "Pellikoduku Venue (Mamidikuduru)" },
  "march7-lunch": { lng: 82.05, lat: 16.52, name: "March 7th Lunch Venue (Mamidikuduru)" },
  pelli: { lng: 81.08, lat: 16.78, name: "Wedding Venue (Akkireddigudem, Eluru)" },
  sathanamuthi: { lng: 82.05, lat: 16.52, name: "Sathanamuthi Ratham Venue (Mamidikuduru)" },
  "yarnalu-lunch": { lng: 82.05, lat: 16.52, name: "Yarnalu Lunch Venue (Mamidikuduru)" },
};

const HYDERABAD_MAMIDIKUDURU_MAP_STOPS = [
  { name: "Rajiv Gandhi International Airport", lng: 78.4304, lat: 17.2403 },
  { name: "Rajahmundry Airport", lng: 81.8182, lat: 17.1104 },
  { name: "Amalapuram Bus Stand", lng: 82.051, lat: 16.537 },
  { name: "Mamidikuduru", lng: 82.05, lat: 16.52 },
] as const;

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
      <div className="rounded-2xl overflow-hidden border border-amber-200/60 mt-5 shadow-sm">
        <div className="h-[320px] md:h-[380px] w-full">
          <Map center={initialCenter} zoom={8}>
            <MapFitBounds coordinates={route} padding={56} maxZoom={12} />
            <MapRoute
              coordinates={route}
              color="#d97706"
              width={3.5}
              opacity={0.85}
            />
            {HYDERABAD_MAMIDIKUDURU_MAP_STOPS.map((stop, index) => (
              <MapMarker
                key={stop.name}
                longitude={stop.lng}
                latitude={stop.lat}
              >
                <MarkerContent>
                  <div className="size-5 rounded-full bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
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
    <div className="rounded-2xl overflow-hidden border border-amber-200/60 mt-5 shadow-sm">
      <div className="h-[320px] md:h-[380px] w-full">
        <Map center={center} zoom={10}>
          <MapFitBounds coordinates={route} padding={56} maxZoom={14} />
          <MapRoute
            coordinates={route}
            color="#d97706"
            width={3.5}
            opacity={0.85}
          />
          {stops.map((stop, index) => (
            <MapMarker
              key={stop.name}
              longitude={stop.lng}
              latitude={stop.lat}
            >
              <MarkerContent>
                <div className="size-5 rounded-full bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
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
    note: "",
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
    color: "from-sky-50 to-blue-50",
    accentColor: "text-sky-600",
    borderColor: "border-sky-200/80",
    activeBorder: "border-sky-400/60",
    iconBg: "bg-sky-100",
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
    color: "from-emerald-50 to-teal-50",
    accentColor: "text-emerald-600",
    borderColor: "border-emerald-200/80",
    activeBorder: "border-emerald-400/60",
    iconBg: "bg-emerald-100",
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
    color: "from-violet-50 to-purple-50",
    accentColor: "text-violet-600",
    borderColor: "border-violet-200/80",
    activeBorder: "border-violet-400/60",
    iconBg: "bg-violet-100",
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
    color: "from-orange-50 to-amber-50",
    accentColor: "text-orange-600",
    borderColor: "border-orange-200/80",
    activeBorder: "border-orange-400/60",
    iconBg: "bg-orange-100",
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

const STEP_LABELS = ["Event", "City", "Route"] as const;

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-10 md:mb-12">
      {STEP_LABELS.map((label, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <div key={label} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  isCompleted && "bg-amber-500 text-white shadow-md shadow-amber-200/50",
                  isActive && "bg-amber-600 text-white shadow-lg shadow-amber-300/50 scale-110",
                  !isActive && !isCompleted && "bg-neutral-100 text-neutral-400 border border-neutral-200"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300",
                  isActive ? "text-amber-700" : isCompleted ? "text-amber-500" : "text-neutral-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "w-10 sm:w-16 h-[2px] rounded-full mx-1 mb-5 transition-colors duration-300",
                  i < currentStep ? "bg-amber-400" : "bg-neutral-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TravelAssistanceSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [expandedTransport, setExpandedTransport] =
    useState<TransportKey | null>(null);

  const showTransport = selectedCity !== null && selectedEvent !== null;
  const hasSelection = selectedEvent !== null || selectedCity !== null;
  const selectedEventLabel =
    EVENTS.find((e) => e.id === selectedEvent)?.label ?? "";
  const currentStep = !selectedEvent ? 0 : !selectedCity ? 1 : 2;

  const handleClear = () => {
    setSelectedEvent(null);
    setSelectedCity(null);
    setExpandedTransport(null);
  };

  return (
    <section
      id="travel"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,oklch(0.99_0.01_30)_0%,oklch(0.985_0.012_35)_40%,oklch(0.975_0.018_28)_100%)]"
      aria-label="Travel assistance"
    >
      {/* Decorative radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.95_0.04_55 / 0.3), transparent 70%)`,
        }}
      />

      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.3_0.08_30) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-3xl mx-auto pt-20 md:pt-28 pb-32 md:pb-36 px-4 md:px-8">
        {/* Header */}
        <motion.header
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-200/60 mb-5">
            <Navigation className="h-3.5 w-3.5 text-amber-600" aria-hidden />
            <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">
              Getting There
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.5rem] font-bold font-josefin text-neutral-800 leading-tight mb-4">
            Travel Assistance
          </h2>
          <p className="text-neutral-500 text-[15px] md:text-base max-w-md mx-auto leading-relaxed">
            Select your event and city — we'll map out the best route to get you there.
          </p>
        </motion.header>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <StepIndicator currentStep={currentStep} />
        </motion.div>

        {/* Selection summary + clear */}
        <AnimatePresence>
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-amber-200/40 shadow-sm">
                <p className="text-sm text-neutral-600 font-medium truncate" aria-label="Your selection">
                  {selectedEventLabel && (
                    <span className="text-amber-700">{selectedEventLabel}</span>
                  )}
                  {selectedEventLabel && selectedCity && (
                    <span className="mx-2 text-neutral-300" aria-hidden>/</span>
                  )}
                  {selectedCity && (
                    <span className="text-neutral-700">{selectedCity}</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden />
                  Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steps: Event → City → Transport */}
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Event Selection */}
            {!selectedEvent && (
              <motion.div
                key="event"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-lg md:text-xl font-semibold font-josefin text-neutral-800 mb-1.5 text-center">
                  Which event will you attend?
                </h3>
                <p className="text-neutral-400 text-sm mb-6 text-center">
                  Choose an event to get personalized directions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EVENTS.map((event, i) => (
                    <motion.button
                      key={event.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05 * i,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setSelectedEvent(event.id)}
                      className={cn(
                        "group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-200",
                        "bg-white/80 backdrop-blur-sm border border-neutral-200/70",
                        "hover:bg-white hover:border-amber-300/80 hover:shadow-lg hover:shadow-amber-100/30",
                        "active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2"
                      )}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-xl ring-1 ring-amber-100/80 group-hover:ring-amber-200 group-hover:from-amber-100 group-hover:to-orange-100 transition-all" aria-hidden>
                        {event.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-neutral-800 leading-snug truncate group-hover:text-amber-900 transition-colors">
                          {event.label}
                        </div>
                        <div className="text-[12px] text-neutral-400 mt-0.5 font-medium">
                          {event.date}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 -rotate-90 text-neutral-300 group-hover:text-amber-400 transition-colors shrink-0" aria-hidden />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: City Selection */}
            {selectedEvent && !selectedCity && (
              <motion.div
                key="city"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-lg md:text-xl font-semibold font-josefin text-neutral-800 mb-1.5 text-center">
                  Where are you traveling from?
                </h3>
                <p className="text-neutral-400 text-sm mb-6 text-center">
                  Pick your departure city for the best route.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto">
                  {CITIES.map((city, i) => (
                    <motion.button
                      key={city}
                      type="button"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.04 * i,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => setSelectedCity(city)}
                      className={cn(
                        "group flex flex-col items-center gap-2 px-4 py-4 rounded-2xl transition-all duration-200",
                        "bg-white/80 backdrop-blur-sm border border-neutral-200/70",
                        "hover:bg-white hover:border-amber-300/80 hover:shadow-lg hover:shadow-amber-100/30",
                        "active:scale-[0.97]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2"
                      )}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 group-hover:bg-amber-100 transition-colors">
                        <MapPin className="h-4 w-4 text-amber-500 group-hover:text-amber-600 transition-colors" strokeWidth={2.2} aria-hidden />
                      </div>
                      <span className="text-sm font-semibold text-neutral-700 group-hover:text-amber-800 transition-colors">
                        {city}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Transport Options */}
            {showTransport && (
              <motion.div
                key="transport"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-lg md:text-xl font-semibold font-josefin text-neutral-800 mb-1.5 text-center">
                  How would you like to travel?
                </h3>
                <p className="text-neutral-400 text-sm mb-7 text-center">
                  Tap an option to view step-by-step directions.
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: 0.06 * i,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={cn(
                            "rounded-2xl overflow-hidden transition-all duration-300",
                            "bg-white/90 backdrop-blur-sm",
                            isExpanded
                              ? cn("shadow-xl shadow-neutral-200/40 border-2", detail.activeBorder)
                              : cn("border", detail.borderColor, "hover:shadow-md hover:shadow-neutral-100/50")
                          )}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedTransport(isExpanded ? null : key)
                            }
                            className="w-full flex items-center gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-inset transition-colors"
                          >
                            <span className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                              detail.iconBg, detail.accentColor
                            )}>
                              <Icon className="h-5 w-5" aria-hidden />
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="block font-semibold text-neutral-800 text-[15px]">
                                {detail.title}
                              </span>
                              <span className="block text-[12px] text-neutral-400 mt-0.5">
                                {detail.subtitle}
                              </span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-5 w-5 text-neutral-300 transition-transform duration-300 shrink-0",
                                isExpanded && "rotate-180 text-neutral-500"
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
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className={cn("px-5 pb-6 pt-1 border-t border-neutral-100/80")}>
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
                                        {/* Steps */}
                                        <div className="space-y-3 mt-4">
                                          {steps.map((step: string, j: number) => (
                                            <div key={j} className="flex gap-3">
                                              <div className="flex flex-col items-center pt-0.5">
                                                <div className={cn(
                                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                                                  detail.iconBg, detail.accentColor
                                                )}>
                                                  {j + 1}
                                                </div>
                                                {j < steps.length - 1 && (
                                                  <div className="w-px flex-1 bg-neutral-100 mt-1" />
                                                )}
                                              </div>
                                              <p className="text-sm text-neutral-600 leading-relaxed pb-2">
                                                {step}
                                              </p>
                                            </div>
                                          ))}
                                        </div>

                                        {/* Time estimate */}
                                        <div className="flex items-center gap-2 mt-4 px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                                          <Clock className="h-4 w-4 text-neutral-400 shrink-0" aria-hidden />
                                          <p className="text-sm text-neutral-600">
                                            <span className="font-medium text-neutral-700">Est. travel time:</span>{" "}
                                            {time}
                                          </p>
                                        </div>

                                        {/* Note */}
                                        {note && (
                                          <div className="flex items-start gap-2 mt-3 px-3.5 py-2.5 rounded-xl bg-amber-50/60 border border-amber-100/60">
                                            <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" aria-hidden />
                                            <p className="text-sm text-amber-800/80 leading-relaxed">
                                              {note}
                                            </p>
                                          </div>
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
          className="mt-14 md:mt-16 relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glass card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-amber-50/40 to-orange-50/50 backdrop-blur-md" />
          <div className="absolute inset-0 border border-amber-200/30 rounded-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm ring-1 ring-amber-200/50">
                <Phone className="h-[18px] w-[18px] text-amber-700" aria-hidden />
              </div>
              <h3 className="text-lg md:text-xl font-semibold font-josefin text-neutral-800">
                Need Assistance?
              </h3>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 ml-[52px]">
              Help is just a call away.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TRAVEL_CONTACTS.map((contact, i) => (
                <motion.a
                  key={i}
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className={cn(
                    "group flex items-center gap-3.5 p-4 rounded-2xl transition-all duration-200",
                    "bg-white/70 border border-amber-100/60",
                    "hover:bg-white hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/30",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-bold shadow-sm group-hover:shadow-md group-hover:shadow-amber-200/50 transition-shadow">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-neutral-800 truncate group-hover:text-amber-900 transition-colors">
                      {contact.name}
                    </div>
                    <div className="text-[12px] text-neutral-400 truncate">
                      {contact.relation}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-amber-600/70 group-hover:text-amber-700 transition-colors">
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    <span className="text-[12px] font-medium hidden sm:inline">
                      Call
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
