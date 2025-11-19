import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CostChart({ title, data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#020617" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 10, fill: "#020617" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
              }}
              formatter={(v) =>
                `R$ ${Number(v || 0).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`
              }
            />
            <Legend />
            <Bar dataKey="normal" fill="#22c55e" name="Normal" />
            <Bar dataKey="demonstracao" fill="#facc15" name="Demonstração" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
