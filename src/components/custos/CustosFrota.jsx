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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { loadCustosFrota } from "@/services/custosExcelService";

const VERDE = "#007233";
const VERDE_CLARO = "#76B947";
const AMARELO = "#FFC800";

const PIE_COLORS = [VERDE_CLARO, AMARELO];

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return `R$ ${num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function CustosFrota() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await loadCustosFrota();
        setData(res);
        setStatus("ok");
      } catch (err) {
        console.error("Erro ao carregar custos de frota:", err);
        setStatus("error");
      }
    }
    fetchData();
  }, []);

  if (status === "loading") {
    return (
      <div className="text-sm text-slate-500">
        Carregando dados de custos de frota...
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="text-sm text-red-600">
        Erro ao carregar dados de custos de frota.
      </div>
    );
  }

  const {
    grafico10GastosVW = [],
    grafico11GastosDAF = [],
    grafico12Aproveitamento = [],
    graficoValorKm = [],
  } = data;

  // Normaliza o aproveitamento para 0–100
  const aproveitamentoData = grafico12Aproveitamento.map((item) => {
    let p = Number(item.aproveitamento) || 0;
    if (p > 1) {
      // provavelmente 59, 41, etc
      return { ...item, percent: p };
    }
    // 0.59 -> 59%
    return { ...item, percent: p * 100 };
  });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* 1º – APROVEITAMENTO (PIZZA) */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-center">
            APROVEITAMENTO DIÁRIO DA FROTA - 8H/DIA
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value) => `${Number(value).toFixed(0)}%`}
                labelFormatter={() => ""}
              />
              <Pie
                data={aproveitamentoData}
                dataKey="percent"
                nameKey="frota"
                cx="50%"
                cy="50%"
                outerRadius={110}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${percent.toFixed(0)}%`
                }
              >
                {aproveitamentoData.map((entry, index) => (
                  <Cell
                    key={`cell-aprov-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2º – VALOR APROXIMADO DE CUSTOS COM TRANSPORTE VS KM RODADO */}
      <Card className="shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase">
            VALOR APROXIMADO DE CUSTOS COM TRANSPORTE VS KM RODADO
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graficoValorKm}
              layout="vertical"
              margin={{ left: 140, right: 40, top: 10, bottom: 10 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey="frota"
                type="category"
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
                barSize={26}
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="valor"
                  position="insideRight"
                  formatter={formatCurrency}
                  style={{ fontSize: 11, fontWeight: 600, fill: "#000" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3º – CUSTOS DAF 2026 */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-center">
            CUSTOS DAF 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico11GastosDAF} barCategoryGap={40}>
              <XAxis
                dataKey="item"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
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
                barSize={30}
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

      {/* 4º – CUSTOS VW 2026 */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-center">
            CUSTOS VW 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico10GastosVW} barCategoryGap={40}>
              <XAxis
                dataKey="item"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
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
                barSize={30}
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
