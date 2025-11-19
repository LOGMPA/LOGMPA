import React, { useMemo, useState } from "react";
import { useFreteMaquinas } from "../data/useLogistica";
import TransportTable from "../components/transport/TransportTable";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

function isConcluido(status) {
  if (!status) return false;
  const s = String(status).toUpperCase();
  return s.startsWith("CONCLUIDO");
}

export default function Solicitacoes() {
  const { data: transports, loading, error } = useFreteMaquinas();
  const [statusFilter, setStatusFilter] = useState("ALL");

  const baseList = useMemo(
    () => (transports || []).filter((t) => !isConcluido(t.status)),
    [transports]
  );

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return baseList;
    return baseList.filter((t) => t.status === statusFilter);
  }, [baseList, statusFilter]);

  if (loading) {
    return <p className="text-sm text-slate-600">Carregando solicitações...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Erro ao carregar solicitações: {String(error.message || error)}
      </p>
    );
  }

  const uniqueStatus = Array.from(
    new Set(baseList.map((t) => t.status).filter(Boolean))
  );

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Solicitações</h2>
          <p className="text-xs text-slate-500">
            Tudo que ainda não está concluído na aba FRETE MÁQUINAS
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600">Filtrar status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white"
          >
            <option value="ALL">Todos</option>
            {uniqueStatus.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações em aberto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] text-slate-500 mb-2">
            Exibindo {filtered.length} de {baseList.length} solicitações.
          </p>
          <TransportTable transports={filtered} />
        </CardContent>
      </Card>
    </div>
  );
}