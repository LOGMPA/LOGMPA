import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  "RECEBIDO": "bg-gray-200 text-gray-800 border-gray-300",
  "RECEBIDO (D)": "bg-gray-200 text-gray-800 border-gray-300",
  "PROGRAMADO": "bg-yellow-200 text-yellow-900 border-yellow-300",
  "PROGRAMADO (D)": "bg-yellow-200 text-yellow-900 border-yellow-300",
  "EM ROTA": "bg-blue-200 text-blue-900 border-blue-300",
  "EM ROTA (D)": "bg-blue-200 text-blue-900 border-blue-300",
  "CONCLUIDO": "bg-green-200 text-green-900 border-green-300",
  "CONCLUIDO (D)": "bg-green-200 text-green-900 border-green-300",
  "SUSPENSO": "bg-red-200 text-red-900 border-red-300"
};

export default function WeekView({ transports, currentDate }) {
  const weekStart = startOfWeek(currentDate, { locale: ptBR, weekStartsOn: 1 });
  const days = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));

  const getTransportsForDay = (day) => {
    return transports.filter(t => {
      if (t.status === 'SUSPENSO') return false;
      const transportDate = new Date(t.prev);
      return format(transportDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {days.map((day, idx) => {
        const dayTransports = getTransportsForDay(day);
        return (
          <Card key={idx} className="p-4 border shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {format(day, 'EEEE', { locale: ptBR })}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {format(day, 'd MMM', { locale: ptBR })}
              </p>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {dayTransports.map((transport) => (
                <div 
                  key={transport.id}
                  className="p-2 bg-gray-50 rounded-lg border text-xs"
                >
                  <p className="font-bold text-gray-900 mb-1">{transport.chassi}</p>
                  <p className="text-gray-600 mb-1 truncate">{transport.cliente_nota}</p>
                  <Badge className={`${statusColors[transport.status]} text-xs`}>
                    {transport.status}
                  </Badge>
                </div>
              ))}
              {dayTransports.length === 0 && (
                <p className="text-xs text-gray-400 italic">Sem transportes</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
