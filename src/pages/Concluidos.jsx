import React, { useMemo } from "react";
import { useFreteMaquinas } from "../data/useLogistica";
import TransportTable from "../components/transport/TransportTable";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

function isConcluido(status) {
  if (!status) return false;
  const s = String(status).toUpperCase();
  return s.startsWith("CONCLUIDO");
}

export default function Concluidos() {
  const { data: transports, loading, error } = useFreteMaquinas();

  const list = useMemo(
    () => (transports || []).filter((t) => isConcluido(t.status)),
    [transports]
  );

  if (loading) {
    return <p className="text-sm text-slate-600">Carregando concluídos...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Erro ao carregar concluídos: {String(error.message || error)}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Concluídos</h2>
        <p className="text-xs text-slate-500">
          Transportes com status CONCLUIDO ou CONCLUIDO (D)
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de transportes concluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] text-slate-500 mb-2">
            Total: {list.length} registros.
          </p>
          <TransportTable transports={list} />
        </CardContent>
      </Card>
    </div>
  );
}