import React, { useMemo } from "react";
import { useLogisticaData } from "../hooks/useLogisticaData";

export default function Demonstracoes() {
  const { transports, isLoading } = useLogisticaData();

  const demos = useMemo(
    () =>
      transports.filter((t) => String(t.status || "").includes("(D)")),
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
            <h1 className="text-3xl font-bold text-slate-50">
              Demonstrações
            </h1>
            <p className="text-sm text-slate-400">
              Todos os status com (D): RECEBIDO, PROGRAMADO, EM ROTA, CONCLUIDO
              (D)
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-400/40">
            {demos.length} registros
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Previsão</th>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-left">Chassi</th>
                  <th className="px-3 py-2 text-left">Está</th>
                  <th className="px-3 py-2 text-left">Vai</th>
                  <th className="px-3 py-2 text-left">Geo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demos.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-3 py-1.5 font-medium text-slate-800">
                      {t.status}
                    </td>
                    <td className="px-3 py-1.5 text-slate-700">{t.prev}</td>
                    <td className="px-3 py-1.5 text-slate-700">
                      {t.cliente_nota}
                    </td>
                    <td className="px-3 py-1.5 font-semibold text-slate-900">
                      {t.chassi}
                    </td>
                    <td className="px-3 py-1.5 text-slate-700">{t.esta}</td>
                    <td className="px-3 py-1.5 text-slate-700">{t.vai}</td>
                    <td className="px-3 py-1.5 text-sky-600 underline">
                      {t.vai_para || t.esta_em}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {demos.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-500">
              Nenhuma demonstração lançada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
