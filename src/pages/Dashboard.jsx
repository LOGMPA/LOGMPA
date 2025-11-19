import React from "react";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";
import StatusCard from "../components/dashboard/StatusCard";
import CostChart from "../components/dashboard/CostChart";
import { useLogisticaData } from "../hooks/useLogisticaData";

export default function Dashboard() {
  const { transports, isLoading } = useLogisticaData();

  const getStatusCounts = () => {
    const recebido = transports.filter(
      (t) => t.status === "RECEBIDO" || t.status === "RECEBIDO (D)"
    );
    const programado = transports.filter(
      (t) => t.status === "PROGRAMADO" || t.status === "PROGRAMADO (D)"
    );
    const emRota = transports.filter(
      (t) => t.status === "EM ROTA" || t.status === "EM ROTA (D)"
    );
    const concluido = transports.filter(
      (t) => t.status === "CONCLUIDO" || t.status === "CONCLUIDO (D)"
    );

    return { recebido, programado, emRota, concluido };
  };

  const getCostData = () => {
    const filiais = [
      "PONTA GROSSA",
      "CASTRO",
      "ARAPOTI",
      "TIBAGI",
      "IRATI",
      "PRUDENTOPOLIS",
      "GUARAPUAVA",
      "QUEDAS DO IGUACU",
    ];

    return filiais.map((filial) => {
      const normal = transports
        .filter(
          (t) =>
            t.filial_custos === filial &&
            t.status === "CONCLUIDO" &&
            !String(t.status).includes("(D)")
        )
        .reduce((sum, t) => sum + (t.r_prop || t.r_terc || 0), 0);

      const demonstracao = transports
        .filter(
          (t) => t.filial_custos === filial && String(t.status).includes("(D)")
        )
        .reduce((sum, t) => sum + (t.r_prop || t.r_terc || 0), 0);

      return {
        name: filial.substring(0, 12),
        normal: Math.round(normal),
        demonstracao: Math.round(demonstracao),
      };
    });
  };

  const { recebido, programado, emRota, concluido } = getStatusCounts();
  const costData = getCostData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-[1500px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-1">
            Visão Geral · Transporte de Máquinas
          </h1>
          <p className="text-sm text-slate-400">
            Status dos fretes e custos por filial · dados em tempo quase real
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatusCard
            title="Recebido"
            count={recebido.length}
            icon={Package}
            color="blue"
            items={recebido}
          />
          <StatusCard
            title="Programado"
            count={programado.length}
            icon={Clock}
            color="purple"
            items={programado}
          />
          <StatusCard
            title="Em Rota"
            count={emRota.length}
            icon={Truck}
            color="amber"
            items={emRota}
          />
          <StatusCard
            title="Concluído"
            count={concluido.length}
            icon={CheckCircle2}
            color="green"
            items={concluido}
          />
        </div>

        <CostChart
          title="Custos Normais vs Demonstrações (Concluídos por Filial)"
          data={costData}
        />
      </div>
    </div>
  );
}
