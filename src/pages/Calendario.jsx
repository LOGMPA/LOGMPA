import React, { useMemo, useState } from "react";
import { useFreteMaquinas } from "../data/useLogistica";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

function toEvents(transports) {
  return transports
    .filter((t) => t.status && !t.status.startsWith("SUSPENSO"))
    .map((t) => {
      const date =
        t.prev instanceof Date
          ? t.prev
          : t.prev
          ? new Date(t.prev)
          : null;

      const geo =
        typeof t.esta_em === "string" && t.esta_em.startsWith("http")
          ? t.esta_em
          : typeof t.vai_para === "string" && t.vai_para.startsWith("http")
          ? t.vai_para
          : null;

      return {
        id: t.id,
        status: t.status,
        date,
        chassi: t.chassi,
        cliente: t.cliente,
        esta: t.esta,
        vai: t.vai,
        geo,
      };
    })
    .filter((ev) => ev.date);
}

export default function Calendario() {
  const { data: transports, loading, error } = useFreteMaquinas();
  const [view, setView] = useState("week");

  const events = useMemo(() => toEvents(transports || []), [transports]);

  const eventsByDay = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const day = ev.date.getDate();
      const key = String(day);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  if (loading) {
    return <p className="text-sm text-slate-600">Carregando agenda...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Erro ao carregar dados para o calendário: {String(error.message || error)}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Calendário</h2>
          <p className="text-xs text-slate-500">
            Baseado na coluna PREV da aba FRETE MÁQUINAS (exceto status SUSPENSO)
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white overflow-hidden text-xs">
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 ${
              view === "week" ? "bg-slate-900 text-white" : "text-slate-700"
            }`}
          >
            Semana / Lista
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 ${
              view === "month" ? "bg-slate-900 text-white" : "text-slate-700"
            }`}
          >
            Mês / Dias
          </button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Agenda de transportes</CardTitle>
        </CardHeader>
        <CardContent>
          {view === "week" ? (
            <WeekView events={events} />
          ) : (
            <MonthView eventsByDay={eventsByDay} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}