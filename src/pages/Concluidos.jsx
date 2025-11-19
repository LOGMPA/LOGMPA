import React, { useMemo } from "react";
import { useLogisticaData } from "../hooks/useLogisticaData";
import TransportTable from "../components/tables/TransportTable";

export default function Concluidos() {
  const { transports, isLoading } = useLogisticaData();

  const concluidos = useMemo(
    () =>
      transports.filter(
        (t) => t.status === "CONCLUIDO" || t.status === "CONCLUIDO (D)"
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
      <div className="max-w-[1500px] mx-auto space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Concluídos</h1>
            <p className="text-sm text-slate-400">
              Apenas CONCLUIDO e CONCLUIDO (D)
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/40">
            {concluidos.length} registros
          </span>
        </div>

        <TransportTable transports={concluidos} />
      </div>
    </div>
  );
}
