import React from 'react';
import { Card } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  "RECEBIDO": "bg-gray-400",
  "RECEBIDO (D)": "bg-gray-400",
  "PROGRAMADO": "bg-yellow-400",
  "PROGRAMADO (D)": "bg-yellow-400",
  "EM ROTA": "bg-blue-400",
  "EM ROTA (D)": "bg-blue-400",
  "CONCLUIDO": "bg-green-400",
  "CONCLUIDO (D)": "bg-green-400",
  "SUSPENSO": "bg-red-400"
};

export default function MonthView({ transports, currentDate }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTransportsForDay = (day) => {
    return transports.filter(t => {
      if (t.status !== 'CONCLUIDO' && t.status !== 'CONCLUIDO (D)') return false;
      const transportDate = new Date(t.prev);
      return format(transportDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
          {day}
        </div>
      ))}
      {days.map((day, idx) => {
        const dayTransports = getTransportsForDay(day);
        return (
          <Card 
            key={idx}
            className={`min-h-[120px] p-2 border ${
              isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {format(day, 'd')}
            </p>
            <div className="space-y-1 max-h-[80px] overflow-y-auto">
              {dayTransports.map((transport) => (
                <div 
                  key={transport.id}
                  className={`${statusColors[transport.status]} text-white text-xs p-1 rounded truncate`}
                  title={`${transport.chassi} - ${transport.cliente_nota}`}
                >
                  {transport.chassi?.slice(-6)}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
