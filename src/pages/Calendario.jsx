import React, { useMemo } from "react";
import { useLogisticaData } from "../hooks/useLogisticaData";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

function parseDate(d) {
  if (!d) return null;
  const parts = String(d).split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

export default function Calendario() {
  const { transports, isLoading } = useLogisticaData();

  const ativos = useMemo(
    () =>
      transports.filter(
        (t) =>
          t.status &&
          !String(t.status).startsWith("SUSPENSO") &&
          t.prev &&
          t.chassi
      ),
    [transports]
  );

  const weekGrouped = useMemo(() => {
    const grouped = {};
    ativos.forEach((t) => {
      const d = parseDate(t.prev);
      if (!d) return;
      const key = t.prev;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    });
    return grouped;
  }, [ativos]);

  const concluidos = useMemo(
    () =>
      transports.filter(
        (t) =>
          t.chassi &&
          (t.status === "CONCLUIDO" || t.status === "CONCLUIDO (D)") &&
          t.prev
      ),
    [transports]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-[1500px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 mb-1">
            Calendário de Fretes
          </h1>
          <p className="text-sm text-slate-400">
            Visão semanal (todos os status exceto SUSPENSO) e mensal de
            fretes concluídos.
          </p>
        </div>

        <Tabs defaultValue="semana" className="space-y-4">
          <TabsList>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="mes">Mês (Concluídos)</TabsTrigger>
          </TabsList>

          <TabsContent value="semana">
            <WeekView grouped={weekGrouped} />
          </TabsContent>

          <TabsContent value="mes">
            <MonthView transports={concluidos} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
