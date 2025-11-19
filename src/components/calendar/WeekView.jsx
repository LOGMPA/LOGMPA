import React from "react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [day, month, year] = String(dateStr).split("/");
  if (!day || !month || !year) return dateStr;
  return `${day}/${month}`;
}

export default function WeekView({ grouped }) {
  const days = Object.keys(grouped).sort(
    (a, b) => new Date(a.split("/").reverse().join("-")) - new Date(b.split("/").reverse().join("-"))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {days.map((date) => (
        <div
          key={date}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex flex-col"
        >
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              {formatDate(date)}
            </h3>
            <span className="text-[11px] text-slate-500">
              {grouped[date].length} fretes
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-64">
            {grouped[date].map((t) => (
              <div
                key={t.id}
                className="border border-slate-100 rounded-lg px-2 py-1.5 bg-slate-50/60"
              >
                <p className="text-[11px] font-semibold text-slate-900">
                  {t.chassi}
                </p>
                <p className="text-[11px] text-slate-700 truncate">
                  {t.cliente_nota}
                </p>
                <p className="text-[10px] text-slate-500">
                  {t.esta} → {t.vai}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {days.length === 0 && (
        <div className="col-span-full text-xs text-slate-500 text-center py-6">
          Nenhuma previsão na semana.
        </div>
      )}
    </div>
  );
}
