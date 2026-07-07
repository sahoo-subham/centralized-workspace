import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "../services/calendarService";

const PRIORITY_COLORS = {
  high: "#f87171",   
  medium: "#fbbf24", 
  low: "#818cf8",   
};
const PROJECT_COLOR = "#c084fc";

function colorForEvent(raw) {
  if (raw.type === "project") return PROJECT_COLOR;
  return PRIORITY_COLORS[raw.priority] || "#94a3b8"; 
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
    textColor: "#0A0D16",
    classNames: isDone ? ["opacity-40"] : [],
    extendedProps: raw,
  };
}

export default function CalendarPage() {
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
    <div className="min-h-full bg-[#0A0D16] p-4 md:p-6 text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-white">Calendar</h1>
          <p className="text-sm text-slate-500">
            Task deadlines and project timelines in one view.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-white/[0.07] bg-white/5 p-1 self-start">
          {[
            { key: "all", label: "All" },
            { key: "task", label: "Tasks" },
            { key: "project", label: "Projects" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTypeFilter(opt.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                typeFilter === opt.key
                  ? "bg-purple-500/18 text-indigo-100 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]"
                  : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-xs text-slate-400">
        <LegendDot color={PRIORITY_COLORS.high} label="High priority task" />
        <LegendDot color={PRIORITY_COLORS.medium} label="Medium priority task" />
        <LegendDot color={PRIORITY_COLORS.low} label="Low priority task" />
        <LegendDot color={PROJECT_COLOR} label="Project timeline" />
        <span className="text-slate-600">Faded = completed</span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="calendar-dark rounded-2xl border border-white/8 bg-[#111524]/97 p-3 md:p-5 backdrop-blur-2xl">
        {loading ? (
          <div className="h-96 flex items-center justify-center text-slate-500 text-sm">
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
      
      <style>{`
        .calendar-dark {
          --fc-border-color: rgba(255,255,255,0.07);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255,255,255,0.04);
          --fc-list-event-hover-bg-color: rgba(255,255,255,0.06);
          --fc-today-bg-color: rgba(124,58,237,0.10);
          --fc-event-border-color: transparent;
        }
        .calendar-dark, .calendar-dark a { color: #cbd5e1; }
        .calendar-dark .fc-col-header-cell-cushion,
        .calendar-dark .fc-daygrid-day-number,
        .calendar-dark .fc-list-day-cushion,
        .calendar-dark .fc-toolbar-title { color: #f1f5f9; }
        .calendar-dark .fc-button {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          color: #cbd5e1;
          box-shadow: none;
          text-transform: capitalize;
        }
        .calendar-dark .fc-button:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .calendar-dark .fc-button-active,
        .calendar-dark .fc-button-primary:not(:disabled).fc-button-active {
          background: rgba(168,85,247,0.18) !important;
          border-color: rgba(99,102,241,0.3) !important;
          color: #e0e7ff !important;
        }
        .calendar-dark .fc-daygrid-day.fc-day-today,
        .calendar-dark .fc-timegrid-col.fc-day-today {
          background: rgba(124,58,237,0.08);
        }
        .calendar-dark .fc-list-event:hover td { background: rgba(255,255,255,0.05); }
        .calendar-dark .fc-list-empty { background: transparent; color: #64748b; }
        .calendar-dark .fc-scrollgrid { border-color: rgba(255,255,255,0.07); }
        .calendar-dark .fc-event { font-size: 0.75rem; font-weight: 600; padding: 1px 4px; }
      `}</style>
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111524] border border-white/8 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] max-w-sm w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
            {isTask ? "Task" : "Project"}
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h2 className="text-lg font-semibold text-white mb-3">{event.title}</h2>

        <dl className="space-y-1.5 text-sm text-slate-400 mb-4">
          <Row label="Status" value={event.status} />
          {isTask && <Row label="Priority" value={event.priority} />}
          {isTask && event.project && <Row label="Project" value={event.project} />}
          {!isTask && event.team && <Row label="Team" value={event.team} />}
          <Row label={isTask ? "Due" : "Dates"} value={`${event.start} → ${event.end}`} />
        </dl>

        <a
          href={event.url}
          className="inline-block w-full text-center bg-purple-500/18 border border-indigo-500/30 text-indigo-100 text-sm font-medium rounded-xl py-2 hover:bg-purple-500/28 transition-colors duration-150"
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
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-200">{value}</dd>
    </div>
  );
}