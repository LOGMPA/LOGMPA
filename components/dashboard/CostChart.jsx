import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CostChart({ title, data }) {
  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar
              dataKey="normal"
              fill="#10b981"
              name="Custos Regulares"
              radius={[8, 8, 0, 0]}
              label={{ position: 'top', fill: '#065f46', fontSize: 11, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
            />
            <Bar
              dataKey="demonstracao"
              fill="#f59e0b"
              name="Demonstração"
              radius={[8, 8, 0, 0]}
              label={{ position: 'top', fill: '#065f46', fontSize: 11, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
