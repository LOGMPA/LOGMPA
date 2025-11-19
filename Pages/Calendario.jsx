import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');

  const { data: transports = [], isLoading } = useQuery({
    queryKey: ['transports'],
    queryFn: () => base44.entities.Transport.list('-prev', 1000),
  });

  const handlePrevious = () => {
    setCurrentDate(prev => view === 'week' ? subMonths(prev, 0) : subMonths(prev, 1));
  };

  const handleNext = () => {
    setCurrentDate(prev => view === 'week' ? addMonths(prev, 0) : addMonths(prev, 1));
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
          <h1 className="text-xl font-bold text-white">Calendário</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handlePrevious} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold text-white min-w-[180px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="week">Visão Semanal</TabsTrigger>
            <TabsTrigger value="month">Visão Mensal</TabsTrigger>
          </TabsList>

          <TabsContent value="week">
            <WeekView transports={transports} currentDate={currentDate} />
          </TabsContent>

          <TabsContent value="month">
            <MonthView transports={transports} currentDate={currentDate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
