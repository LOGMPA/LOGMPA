import React from "react";

export default function WeekView({ events }) {
  const sorted = [...events].sort((a, b) => {
    const da = a.date?.getTime?.() || 0;
    const db = b.date?.getTime?.() || 0;
    return da - db;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {sorted.map((ev) => (
        <div
          key={ev.id}
          className="bg-white border border-slate-200 rounded-lg p-3 text-xs flex flex-col gap-1"
        >
          <div className="flex justify-between">
            <span className="font-semibold text-slate-800">
              {ev.date
                ? ev.date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                : "-"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {ev.status}
            </span>
          </div>
          <div className="font-mono text-[11px]">{ev.chassi}</div>
          <div className="text-slate-700 truncate">{ev.cliente}</div>
          <div className="text-slate-500">
            {ev.esta} → {ev.vai}
          </div>
          {ev.geo && (
            <a
              href={ev.geo}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 underline truncate"
            >
              Localização / mapa
            </a>
          )}
        </div>
      ))}
    </div>
  );
}