import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  "RECEBIDO (D)": "bg-gray-400 text-white",
  "PROGRAMADO (D)": "bg-yellow-400 text-white",
  "EM ROTA (D)": "bg-blue-400 text-white",
  "CONCLUIDO (D)": "bg-green-400 text-white"
};

export default function Demonstracoes() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: allTransports = [], isLoading } = useQuery({
    queryKey: ['transports'],
    queryFn: () => base44.entities.Transport.list('-prev', 1000),
  });

  const demonstrations = allTransports.filter(t => t.status?.includes('(D)'));

  const recebidoD = demonstrations.filter(t => t.status === 'RECEBIDO (D)').length;
  const programadoD = demonstrations.filter(t => t.status === 'PROGRAMADO (D)').length;
  const concluidoD = demonstrations.filter(t => t.status === 'CONCLUIDO (D)').length;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDemonstrationsForDay = (day) => {
    return demonstrations.filter(t => {
      const transportDate = new Date(t.prev);
      return format(transportDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

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
        <div className="mb-6 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Demonstrações</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold text-white min-w-[180px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Total de Demonstrações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <p className="text-sm text-purple-600 font-medium mb-1">Recebido (D)</p>
                <p className="text-3xl font-bold text-purple-700">{recebidoD}</p>
              </div>
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Programado (D)</p>
                <p className="text-3xl font-bold text-blue-700">{programadoD}</p>
              </div>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-green-600 font-medium mb-1">Concluído (D)</p>
                <p className="text-3xl font-bold text-green-700">{concluidoD}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-7 gap-2">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            const dayDemos = getDemonstrationsForDay(day);
            return (
              <Card key={idx} className="min-h-[140px] p-3 border">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  {format(day, 'd')}
                </p>
                <div className="space-y-2 max-h-[100px] overflow-y-auto">
                  {dayDemos.map((demo) => (
                    <div 
                      key={demo.id}
                      className={`${statusColors[demo.status]} p-2 rounded text-xs`}
                    >
                      <p className="font-semibold truncate">{demo.chassi?.slice(-8)}</p>
                      <p className="truncate opacity-90">{demo.cliente_nota}</p>
                      <Badge variant="outline" className="mt-1 bg-white/20 border-white/30 text-white text-xs">
                        {demo.status.replace(' (D)', '')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
