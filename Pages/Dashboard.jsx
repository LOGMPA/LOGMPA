import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";
import StatusCard from "../components/dashboard/StatusCard";
import CostChart from "../components/dashboard/CostChart";

export default function Dashboard() {
  const { data: transports = [], isLoading } = useQuery({
    queryKey: ['transports'],
    queryFn: () => base44.entities.Transport.list('-created_date', 500),
  });

  const getStatusCounts = () => {
    const recebido = transports.filter(t => t.status === 'RECEBIDO' || t.status === 'RECEBIDO (D)');
    const programado = transports.filter(t => t.status === 'PROGRAMADO' || t.status === 'PROGRAMADO (D)');
    const emRota = transports.filter(t => t.status === 'EM ROTA' || t.status === 'EM ROTA (D)');
    const concluido = transports.filter(t => t.status === 'CONCLUIDO' || t.status === 'CONCLUIDO (D)');

    return { recebido, programado, emRota, concluido };
  };

  const getCostData = () => {
    const filiais = ['PONTA GROSSA', 'CASTRO', 'ARAPOTI', 'TIBAGI', 'IRATI', 'PRUDENTOPOLIS', 'GUARAPUAVA', 'QUEDAS DO IGUACU'];

    return filiais.map(filial => {
      const normal = transports.filter(t => 
        t.filial_custos === filial && 
        (t.status === 'CONCLUIDO') &&
        !t.status.includes('(D)')
      ).reduce((sum, t) => sum + (t.r_prop || t.r_terc || 0), 0);

      const demonstracao = transports.filter(t => 
        t.filial_custos === filial && 
        t.status.includes('(D)')
      ).reduce((sum, t) => sum + (t.r_prop || t.r_terc || 0), 0);

      return {
        name: filial.substring(0, 12),
        normal: Math.round(normal),
        demonstracao: Math.round(demonstracao)
      };
    });
  };

  const { recebido, programado, emRota, concluido } = getStatusCounts();
  const costData = getCostData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-xl p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-white">Painel Logística 2026</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
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
          title="Custos Regulares vs Demonstrações (Concluídos por Filial)"
          data={costData}
        />
      </div>
    </div>
  );
}
