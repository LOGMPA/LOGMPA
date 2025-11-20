import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { loadCustosMaquinas } from "@/services/custosExcelService";

const VERDE = "#007233";
const AMARELO = "#FFC800";
const VERDE_CLARO = "#76B947";

const PIE_COLORS = [AMARELO, VERDE, VERDE_CLARO, "#4A7729", "#A1C935", "#265C1B"];
const PIE_LABEL_COLORS = ["#A66A00", "#00451C", "#476F1F", "#2E4F17", "#617A1D", "#15380F"];

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return `R$ ${num.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

function filterEmptyRows(data, numericKeys) {
  if (!Array.isArray(data)) return [];
  return data.filter((item) =>
    numericKeys.some((key) => {
      const v = item[key];
      if (v === 0) return true;
      return (
        v !== null && v !== undefined && v !== "" && !Number.isNaN(Number(v))
      );
    })
  );
}

export default function CustosMaquinas() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await loadCustosMaquinas();
        setData(res);
        setStatus("ok");
      } catch (err) {
        console.error("Erro ao carregar custos de máquinas:", err);
        setStatus("error");
      }
    }
    fetchData();
  }, []);

  const {
    grafico01MetaVsReal = [],
    grafico02SomaCustos = [],
    grafico03Terceiros = [],
    grafico05Munck = [],
  } = data || {};

  const dadosGrafico01 = useMemo(
    () => filterEmptyRows(grafico01MetaVsReal, ["meta", "mediaAtual"]),
    [grafico01MetaVsReal]
  );

  const dadosGrafico02 = useMemo(
    () =>
      filterEmptyRows(grafico02SomaCustos, [
        "somaProprio",
        "somaTerceiro",
        "qtdFrete",
      ]),
    [grafico02SomaCustos]
  );

  const dadosGrafico03 = useMemo(
    () => filterEmptyRows(grafico03Terceiros, ["valor", "km"]),
    [grafico03Terceiros]
  );

  const dadosGrafico05 = useMemo(
    () => filterEmptyRows(grafico05Munck, ["valor"]),
    [grafico05Munck]
  );

  const renderPieLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const item = dadosGrafico05[index];
    const color = PIE_LABEL_COLORS[index % PIE_LABEL_COLORS.length];

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
      >
        <tspan x={x} dy="-0.4em">
          {item?.cidade}
        </tspan>
        <tspan x={x} dy="1.2em">
          {`${formatCurrency(value)} - ${(percent * 100).toFixed(0)}%`}
        </tspan>
      </text>
    );
  };

  if (status === "loading") {
    return (
      <div className="text-sm text-slate-500">
        Carregando dados de custos de máquinas...
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="text-sm text-red-600">
        Erro ao carregar dados de custos de máquinas.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* 1º GRÁFICO – META VS REAL (meta larga, média menor na frente) */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-black">
            TRANSPORTE MÁQUINAS - META VS REAL
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico01}
              barCategoryGap={20}
              barGap={-25}
              margin={{ top: 25, right: 20, left: 10, bottom: 35 }}
            >
              <XAxis
                dataKey="item"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "#000",
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "#000",
                }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#000",
                  paddingBottom: 8,
                }}
              />
              {/* Meta: coluna de fundo, mais larga */}
              <Bar
                dataKey="meta"
                name="META FRETE 2026"
                fill={AMARELO}
                barSize={40}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="meta"
                  position="top"
                  formatter={formatCurrency}
                  offset={8}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#65290B",
                  }}
                />
              </Bar>
              {/* Média: coluna menor, na frente, como se preenchesse a meta */}
              <Bar
                dataKey="mediaAtual"
                name="MÉDIA (P+T)"
                fill={VERDE}
                barSize={26}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="mediaAtual"
                  position="insideTop"
                  formatter={formatCurrency}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#FFFFFF",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2º GRÁFICO – CUSTO POR TIPO (empilhado + qtd frete em cima) */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-black">
            TRANSPORTE MÁQUINAS - CUSTO POR TIPO
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico02}
              barCategoryGap={20}
              barGap={0}
              margin={{ top: 25, right: 20, left: 10, bottom: 35 }}
            >
              <XAxis
                dataKey="item"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "#000",
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "#000",
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "QTD FRETE") return value;
                  return formatCurrency(value);
                }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#000",
                  paddingBottom: 8,
                }}
              />
              <Bar
                dataKey="somaProprio"
                name="SOMA PRÓPRIO"
                fill={VERDE}
                barSize={40}
                stackId="tipo"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="somaProprio"
                  position="insideTop"
                  formatter={formatCurrency}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#FFFFFF",
                  }}
                />
              </Bar>
              <Bar
                dataKey="somaTerceiro"
                name="SOMA TERCEIRO"
                fill={AMARELO}
                barSize={40}
                stackId="tipo"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="somaTerceiro"
                  position="insideTop"
                  formatter={formatCurrency}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#000",
                  }}
                />
              </Bar>
              {/* qtd frete - número solto bem em cima da pilha */}
              <Bar
                dataKey="qtdFrete"
                name="QTD FRETE"
                fill="transparent"
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="qtdFrete"
                  position="top"
                  offset={10}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#000",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3º GRÁFICO – CUSTO COM TERCEIROS (barra + km dentro) */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-black">
            TRANSPORTE MÁQUINAS - CUSTO COM TERCEIROS
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico03}
              layout="vertical"
              barCategoryGap={12}
              margin={{ left: 260, right: 40, top: 25, bottom: 25 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "#000",
                }}
              />
              <YAxis
                dataKey="freteiro"
                type="category"
                tickLine={false}
                axisLine={false}
                width={240}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "#000",
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Total KM") return value;
                  return formatCurrency(value);
                }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              {/* sem legenda, igual seu print */}
              <Bar
                dataKey="valor"
                name="Valor Total (R$)"
                fill={VERDE_CLARO}
                barSize={26}
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="valor"
                  position="insideRight"
                  formatter={formatCurrency}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#FFFFFF",
                  }}
                />
              </Bar>
              <Bar
                dataKey="km"
                name="Total KM"
                fill="transparent"
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="km"
                  position="insideLeft"
                  offset={5}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#000",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4º GRÁFICO – UTILIZAÇÃO DE MUNCK (pizza com rótulo caprichado) */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base font-semibold uppercase text-center text-black">
            CUSTOS - UTILIZAÇÃO DE MUNCK
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Pie
                data={dadosGrafico05}
                dataKey="valor"
                nameKey="cidade"
                cx="50%"
                cy="55%"
                outerRadius={120}
                labelLine={false}
                label={renderPieLabel}
              >
                {dadosGrafico05.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
