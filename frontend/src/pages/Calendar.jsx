import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "../services/calendarService";

const PRIORITY_COLORS = {
  high: "#dc2626", 
  medium: "#d97706", 
  low: "#2563eb", 
};
const PROJECT_COLOR = "#5b21b6";
const COMPLETED_OPACITY = 0.45;

function colorForEvent(raw) {
  if (raw.type === "project") return PROJECT_COLOR;
  return PRIORITY_COLORS[raw.priority] || "#64748b"; 
}

function toFullCalendarEvent(raw) {
  const isDone = raw.status === "completed";
  return {
    id: raw.id,
    title: raw.type === "task" ? raw.title : `📁 ${raw.title}`,
    start: raw.start,
    end: raw.end,
    allDay: true,
    backgroundColor: colorForEvent(raw),
    borderColor: colorForEvent(raw),
    textColor: "#ffffff",
    classNames: isDone ? ["opacity-50"] : [],
    extendedProps: raw,
  };
}

function CalendarPage() {
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null); 

  useEffect(() => {
    let cancelled = false;
    getCalendarEvents()
      .then((data) => {
        if (!cancelled) setRawEvents(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load calendar events.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const events = useMemo(() => {
    const filtered =
      typeFilter === "all"
        ? rawEvents
        : rawEvents.filter((e) => e.type === typeFilter);
    return filtered.map(toFullCalendarEvent);
  }, [rawEvents, typeFilter]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500">
            Task deadlines and project timelines in one view.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm self-start">
          {[
            { key: "all", label: "All" },
            { key: "task", label: "Tasks" },
            { key: "project", label: "Projects" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTypeFilter(opt.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                typeFilter === opt.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600">
        <LegendDot color={PRIORITY_COLORS.high} label="High priority task" />
        <LegendDot color={PRIORITY_COLORS.medium} label="Medium priority task" />
        <LegendDot color={PRIORITY_COLORS.low} label="Low priority task" />
        <LegendDot color={PROJECT_COLOR} label="Project timeline" />
        <span className="text-gray-400">Faded = completed</span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
        {loading ? (
          <div className="h-96 flex items-center justify-center text-gray-400 text-sm">
            Loading calendar…
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,listMonth",
            }}
            height="auto"
            events={events}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              setSelected(info.event.extendedProps);
            }}
            dayMaxEvents={3}
          />
        )}
      </div>

      {selected && (
        <EventDetailsModal event={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function EventDetailsModal({ event, onClose }) {
  const isTask = event.type === "task";
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {isTask ? "Task" : "Project"}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {event.title}
        </h2>

        <dl className="space-y-1.5 text-sm text-gray-600 mb-4">
          <Row label="Status" value={event.status} />
          {isTask && <Row label="Priority" value={event.priority} />}
          {isTask && event.project && <Row label="Project" value={event.project} />}
          {!isTask && event.team && <Row label="Team" value={event.team} />}
          <Row label={isTask ? "Due" : "Dates"} value={`${event.start} → ${event.end}`} />
        </dl>

        <a
          href={event.url}
          className="inline-block w-full text-center bg-indigo-600 text-white text-sm font-medium rounded-lg py-2 hover:bg-indigo-700 transition-colors"
        >
          Open {isTask ? "task" : "project"}
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-400">{label}</dt>
      <dd className="font-medium text-gray-800">{value}</dd>
    </div>
  );
}

export default CalendarPage;


// it is not looks good and corret the role based view or cross check it . When i click the calendar the dashboard nav is highlighted