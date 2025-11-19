import React from "react";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";
import { useFreteMaquinas } from "../data/useLogistica";
import StatusCard from "../components/dashboard/StatusCard";
import CostChart from "../components/dashboard/CostChart";
import { Card, CardContent } from "../components/ui/card";

function groupStatus(transports) {
  const is = (t, base) =>
    t.status === base || t.status === `${base} (D)` || t.status === `${base}(D)`;

  const recebido = transports.filter((t) => is(t, "RECEBIDO"));
  const programado = transports.filter((t) => is(t, "PROGRAMADO"));
  const emRota = transports.filter((t) => is(t, "EM ROTA"));
  const concluido = transports.filter((t) => t.status.startsWith("CONCLUIDO"));

  return { recebido, programado, emRota, concluido };
}

function buildCostData(transports) {
  const filiaisSet = new Set(
    transports
      .filter((t) => t.filial_custos)
      .map((t) => String(t.filial_custos).trim())
  );
  const filiais = Array.from(filiaisSet).sort();

  return filiais.map((filial) => {
    const list = transports.filter(
      (t) => String(t.filial_custos).trim() === filial
    );
    const normal = list
      .filter((t) => t.status === "CONCLUIDO")
      .reduce((sum, t) => sum + (t.r_prop || 0) + (t.r_terc || 0), 0);
    const demonstracao = list
      .filter((t) => t.status.includes("(D)"))
      .reduce((sum, t) => sum + (t.r_prop || 0) + (t.r_terc || 0), 0);

    return { filial, normal, demonstracao };
  });
}

export default function Dashboard() {
  const { data: transports, loading, error } = useFreteMaquinas();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-slate-600">Carregando dados da planilha...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600 font-semibold">
          Erro ao carregar planilha LOGISTICA2026.xlsx
        </p>
        <p className="text-xs text-slate-600">{String(error.message || error)}</p>
      </div>
    );
  }

  const { recebido, programado, emRota, concluido } = groupStatus(transports);
  const costData = buildCostData(transports);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-xs text-slate-500">
            Dados diretamente da aba FRETE MÁQUINAS da planilha LOGISTICA2026.xlsx
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatusCard
          title="Recebidos"
          icon={Package}
          colorClass="text-blue-500"
          items={recebido}
        />
        <StatusCard
          title="Programados"
          icon={Clock}
          colorClass="text-amber-500"
          items={programado}
        />
        <StatusCard
          title="Em rota"
          icon={Truck}
          colorClass="text-sky-600"
          items={emRota}
        />
        <StatusCard
          title="Concluídos"
          icon={CheckCircle2}
          colorClass="text-emerald-600"
          items={concluido}
        />
      </div>

      <CostChart
        title="Custos Regulares vs Demonstrações por Filial (Concluídos)"
        data={costData}
      />

      <Card>
        <CardContent>
          <p className="text-[11px] text-slate-500">
            Status considerados: RECEBIDO / PROGRAMADO / EM ROTA / CONCLUIDO,
            incluindo variações com (D) para demonstrações. Valores somam R$ PROP + R$ TERC.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}