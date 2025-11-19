import React, { useMemo } from "react";
import { useFreteMaquinas } from "../data/useLogistica";
import TransportTable from "../components/transport/TransportTable";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Demonstracoes() {
  const { data: transports, loading, error } = useFreteMaquinas();

  const list = useMemo(
    () => (transports || []).filter((t) => String(t.status || "").includes("(D)")),
    [transports]
  );

  if (loading) {
    return <p className="text-sm text-slate-600">Carregando demonstrações...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Erro ao carregar demonstrações: {String(error.message || error)}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Demonstrações</h2>
        <p className="text-xs text-slate-500">
          Transportes marcados como demonstração (status com sufixo (D))
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Demonstrações</CardTitle>
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