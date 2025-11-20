import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { loadCustosPecas } from "@/services/custosExcelService";

const VERDE = "#007233";
const VERDE_CLARO = "#76B947";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return `R$ ${num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function CustosPecas() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await loadCustosPecas();
        setData(res);
        setStatus("ok");
      } catch (err) {
        console.error("Erro ao carregar custos de peças:", err);
        setStatus("error");
      }
    }
    fetchData();
  }, []);

  if (status === "loading") {
    return (
      <div className="text-sm text-slate-500">
        Carregando dados de custos de peças...
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="text-sm text-red-600">
        Erro ao carregar dados de custos de peças.
      </div>
    );
  }

  const {
    grafico06MotoBoyPC = [],
    grafico07TranspPC = [],
    grafico08PorMotoBoy = [],
    grafico09PorTransportadora = [],
  } = data;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* GRAFICO 06 – CUSTO COURIER POR LOJA */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase">
            TRANSPORTE PEÇAS - CUSTO COURIER POR LOJA
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico06MotoBoyPC} barCategoryGap={30}>
              <XAxis
                dataKey="cidade"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="valor"
                name="Valor (R$)"
                fill={VERDE_CLARO}
                barSize={40}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={formatCurrency}
                  style={{ fontSize: 11, fontWeight: 600, fill: "#000" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GRAFICO 07 – CUSTO TRANSPORTADORA POR LOJA */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase">
            TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA POR LOJA
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico07TranspPC} barCategoryGap={30}>
              <XAxis
                dataKey="cidade"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="valor"
                name="Valor (R$)"
                fill={VERDE}
                barSize={40}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={formatCurrency}
                  style={{ fontSize: 11, fontWeight: 600, fill: "#000" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GRAFICO 08 – CUSTO COURIER (POR EMPRESA) */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase">
            TRANSPORTE PEÇAS - CUSTO COURIER
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico08PorMotoBoy} barCategoryGap={40}>
              <XAxis
                dataKey="empresa"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="valor"
                name="Valor (R$)"
                fill={VERDE_CLARO}
                barSize={36}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={formatCurrency}
                  style={{ fontSize: 11, fontWeight: 600, fill: "#000" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GRAFICO 09 – CUSTO TRANSPORTADORA (POR EMPRESA) */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase">
            TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico09PorTransportadora} barCategoryGap={40}>
              <XAxis
                dataKey="empresa"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                dataKey="valor"
                name="Valor (R$)"
                fill={VERDE}
                barSize={36}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={formatCurrency}
                  style={{ fontSize: 11, fontWeight: 600, fill: "#000" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
