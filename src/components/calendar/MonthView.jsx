import React from "react";

export default function MonthView({ eventsByDay }) {
  const days = Object.keys(eventsByDay)
    .map((d) => parseInt(d, 10))
    .sort((a, b) => a - b);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
      {days.map((day) => {
        const events = eventsByDay[String(day)] || [];
        return (
          <div
            key={day}
            className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-800">
                {String(day).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-slate-500">
                {events.length} evento(s)
              </span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {events.map((ev) => (
                <div key={ev.id} className="border-l-2 border-slate-400 pl-1">
                  <div className="font-mono text-[10px]">{ev.chassi}</div>
                  <div className="truncate">{ev.cliente}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}