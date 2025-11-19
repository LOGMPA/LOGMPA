import React from "react";

function normalize(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

export default function MonthView({ transports }) {
  const counts = transports.reduce((acc, t) => {
    const key = normalize(t.prev);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const days = Object.keys(counts).sort();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">
        Calendário Mensal · Concluídos
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-3 text-center text-xs">
        {days.map((d) => {
          const [yyyy, mm, dd] = d.split("-");
          const label = `${dd}/${mm}`;
          const qty = counts[d];
          return (
            <div
              key={d}
              className="border border-emerald-100 bg-emerald-50/70 rounded-lg py-3 px-1 flex flex-col items-center justify-center"
            >
              <span className="text-[11px] text-emerald-700 font-medium">
                {label}
              </span>
              <span className="mt-1 text-lg font-bold text-emerald-900">
                {qty}
              </span>
              <span className="text-[10px] text-emerald-600">
                fretes
              </span>
            </div>
          );
        })}
      </div>
      {days.length === 0 && (
        <p className="text-xs text-slate-500 text-center mt-4">
          Nenhum frete concluído neste mês.
        </p>
      )}
    </div>
  );
}
