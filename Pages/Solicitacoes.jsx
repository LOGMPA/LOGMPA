import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import TransportTable from "../components/transport/TransportTable";

export default function Solicitacoes() {
  const [filters, setFilters] = useState({});

  const { data: transports = [], isLoading } = useQuery({
    queryKey: ['transports'],
    queryFn: () => base44.entities.Transport.list('-prev', 1000),
  });

  const nonCompletedTransports = transports.filter(t => 
    t.status !== 'CONCLUIDO' && t.status !== 'CONCLUIDO (D)'
  );

  const filteredTransports = nonCompletedTransports.filter(transport => {
    if (filters.chassi && !transport.chassi?.toLowerCase().includes(filters.chassi.toLowerCase())) {
      return false;
    }
    if (filters.cliente_nota && !transport.cliente_nota?.toLowerCase().includes(filters.cliente_nota.toLowerCase())) {
      return false;
    }
    if (filters.solicitante && !transport.solicitante?.toLowerCase().includes(filters.solicitante.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && transport.status !== filters.status) {
      return false;
    }
    if (filters.data_inicio && transport.prev < filters.data_inicio) {
      return false;
    }
    if (filters.data_fim && transport.prev > filters.data_fim) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-6 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-white whitespace-nowrap">Solicitações</h1>
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Chassi"
                value={filters.chassi || ''}
                onChange={(e) => setFilters({ ...filters, chassi: e.target.value })}
                className="max-w-[120px] bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
              />
              <Input
                placeholder="Cliente"
                value={filters.cliente_nota || ''}
                onChange={(e) => setFilters({ ...filters, cliente_nota: e.target.value })}
                className="max-w-[120px] bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
              />
              <Input
                placeholder="Solicitante"
                value={filters.solicitante || ''}
                onChange={(e) => setFilters({ ...filters, solicitante: e.target.value })}
                className="max-w-[120px] bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
              />
              <Input
                type="date"
                value={filters.data_inicio || ''}
                onChange={(e) => setFilters({ ...filters, data_inicio: e.target.value })}
                className="max-w-[120px] bg-white/20 border-white/30 text-white text-sm"
              />
              <Input
                type="date"
                value={filters.data_fim || ''}
                onChange={(e) => setFilters({ ...filters, data_fim: e.target.value })}
                className="max-w-[120px] bg-white/20 border-white/30 text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Exibindo <span className="font-semibold">{filteredTransports.length}</span> de <span className="font-semibold">{nonCompletedTransports.length}</span> solicitações
          </p>
        </div>

        <TransportTable transports={filteredTransports} />
      </div>
    </div>
  );
}
