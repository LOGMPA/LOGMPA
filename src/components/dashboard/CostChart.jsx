import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function formatCurrency(value) {
  if (typeof value !== "number") return value;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function CostChart({ title, data }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="filial" tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="normal" name="Concluídos" />
            <Bar dataKey="demonstracao" name="Demonstrações" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}