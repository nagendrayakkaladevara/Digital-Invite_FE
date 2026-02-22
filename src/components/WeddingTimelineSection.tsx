import { MapPin, CalendarPlus } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

/** Build Google Calendar "Add Event" URL. dates format: YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ */
function buildCalendarUrl(
  title: string,
  startUTC: string,
  endUTC: string,
  location: string
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startUTC}/${endUTC}`,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Convert IST (UTC+5:30) to Google Calendar format YYYYMMDDTHHMMSSZ */
function istToUTC(dateStr: string, hour: number, minute: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  let totalMins = hour * 60 + minute - 330; // subtract 5:30 for UTC
  let day = d;
  if (totalMins < 0) {
    totalMins += 24 * 60;
    day -= 1;
  }
  const h = Math.floor(totalMins / 60);
  const min = totalMins % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${y}${pad(m)}${pad(day)}T${pad(h)}${pad(min)}00Z`;
}

const MAMIDIKUDURU_MAP = "https://www.google.com/maps/search/Mamidikuduru+Andhra+Pradesh";
const JSK_GARDENS_MAP = "https://share.google/rAaFsheiBXXCqXhlY";

const weddingEvents = [
  {
    title: "పెళ్లికొడుకు చేయటం",
    date: "March 5th · Morning",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-05", 8, 0),
    calendarEnd: istToUTC("2026-03-05", 11, 0),
  },
  {
    title: "గోరింటాకు పెట్టటం",
    date: "March 6th · Morning",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-06", 8, 0),
    calendarEnd: istToUTC("2026-03-06", 10, 0),
  },
  {
    title: "గాజులు వేయటం",
    date: "March 6th · Evening",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-06", 18, 0),
    calendarEnd: istToUTC("2026-03-06", 21, 0),
  },
  {
    title: "కాళ్ళ గోర్లు తీయటం",
    date: "March 7th · Morning",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-07", 8, 0),
    calendarEnd: istToUTC("2026-03-07", 9, 0),
  },
  {
    title: "కంకణం కట్టటం",
    date: "March 7th · Morning",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-07", 9, 0),
    calendarEnd: istToUTC("2026-03-07", 10, 30),
  },
  {
    title: "పెళ్లికొడుకు ఇంటి దగ్గర విందు",
    date: "March 7th · 11:30 AM onwards",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-07", 11, 30),
    calendarEnd: istToUTC("2026-03-07", 14, 0),
  },
  {
    title: "పెళ్లి",
    date: "March 7th · 2:35 AM (early hours of March 8th) Saturday night.",
    location: "Eluru J S K Gardens",
    mapUrl: JSK_GARDENS_MAP,
    calendarStart: istToUTC("2026-03-08", 2, 30),
    calendarEnd: istToUTC("2026-03-08", 6, 0),
  },
  {
    title: "శ్రీ సత్యనారాయణ స్వామి వ్రతం",
    date: "March 8th · Morning",
    location: "Mamidikuduru",
    mapUrl: MAMIDIKUDURU_MAP,
    calendarStart: istToUTC("2026-03-08", 8, 0),
    calendarEnd: istToUTC("2026-03-08", 11, 0),
  }
];

const weddingEventsWithContent = weddingEvents.map((evt) => {
  const calendarUrl = buildCalendarUrl(
    evt.title,
    evt.calendarStart,
    evt.calendarEnd,
    evt.location
  );

  return {
    title: evt.title,
    content: (
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {evt.date}
        </p>
        <p className="mb-4 text-sm font-medium text-amber-700 dark:text-amber-600">
          📍 {evt.location}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={evt.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-100 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            <span>View on Map</span>
          </a>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-sm font-medium text-rose-900 transition hover:bg-rose-100 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden />
            <span>Add to Calendar</span>
          </a>
        </div>
      </div>
    ),
  };
});

export default function WeddingTimelineSection() {
  return (
    <section
      id="timeline"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,oklch(0.97_0.01_264)_0%,oklch(0.99_0_0)_50%,oklch(0.99_0.01_30)_100%)]"
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
          data={weddingEventsWithContent}
          title="Events Timeline"
          subtitle="పెళ్లికొడుకు చేయటం to శ్రీ సత్యనారాయణ స్వామి వ్రతం — every moment that makes this celebration special."
          gradientColors={["#f59e0b", "#fb7185", "transparent"]}
        />
      </div>
    </section>
  );
}
