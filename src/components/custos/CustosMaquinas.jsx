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

// PALETA PRINCIPAL
const VERDE_ESCURO = "#2A5E20";
const VERDE_MEDIO = "#387C2B";
const AMARELO = "#FCDC01";
const CREME = "#FFF5AB";

// PALETA DA PIZZA (a que você gostou)
const PIE_VERDE = "#007233";
const PIE_AMARELO = "#FFC800";
const PIE_VERDE_CLARO = "#76B947";

const PIE_COLORS = [
  PIE_AMARELO,
  PIE_VERDE,
  PIE_VERDE_CLARO,
  "#4A7729",
  "#A1C935",
  "#265C1B",
];

const PIE_LABEL_COLORS = [
  "#A66A00",
  "#00451C",
  "#476F1F",
  "#2E4F17",
  "#617A1D",
  "#15380F",
];

// normaliza qualquer coisa pra número
const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;

  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }

  if (typeof value === "string") {
    const cleaned = value
      .replace(/[^\d,-]/g, "") // tira R$, espaço etc
      .replace(/\./g, "") // remove separador de milhar
      .replace(",", "."); // vírgula vira decimal
    const num = Number(cleaned);
    return Number.isNaN(num) ? 0 : num;
  }

  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
};

const formatCurrency = (value) => {
  const num = toNumber(value);
  return `R$ ${num.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

function filterEmptyRows(data, numericKeys) {
  if (!Array.isArray(data)) return [];
  return data.filter((item) =>
    numericKeys.some((key) => {
      const v = toNumber(item[key]);
      return v !== 0 && !Number.isNaN(v);
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

  // G1
  const dadosGrafico01 = useMemo(
    () =>
      filterEmptyRows(grafico01MetaVsReal, ["meta", "mediaAtual"]).map(
        (item) => ({
          ...item,
          metaNum: toNumber(item.meta),
          mediaNum: toNumber(item.mediaAtual),
        })
      ),
    [grafico01MetaVsReal]
  );

  // G2
  const dadosGrafico02 = useMemo(
    () =>
      filterEmptyRows(grafico02SomaCustos, [
        "somaProprio",
        "somaTerceiro",
        "qtdFrete",
      ]).map((item) => ({
        ...item,
        proprioNum: toNumber(item.somaProprio),
        terceiroNum: toNumber(item.somaTerceiro),
        qtdFreteNum: toNumber(item.qtdFrete),
      })),
    [grafico02SomaCustos]
  );

  // G3
  const dadosGrafico03 = useMemo(() => {
    const base = filterEmptyRows(grafico03Terceiros, ["valor", "km"]);
    return base.map((item) => ({
      ...item,
      valorNum: toNumber(item.valor),
      kmNum: toNumber(item.km),
    }));
  }, [grafico03Terceiros]);

  // G4
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
      <div className="text-sm font-bold" style={{ color: VERDE_ESCURO }}>
        Carregando dados de custos de máquinas...
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="text-sm font-bold text-red-700">
        Erro ao carregar dados de custos de máquinas.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ================= GRÁFICO 1 - META VS REAL ================= */}
      <Card className="shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase"
            style={{ color: VERDE_ESCURO }}
          >
            TRANSPORTE MÁQUINAS - META VS REAL
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico01}
              barCategoryGap={35}
              barGap={-18}
              margin={{ top: 25, right: 30, left: 20, bottom: 35 }}
            >
              <XAxis
                dataKey="item"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: VERDE_ESCURO,
                }}
              />
              <YAxis
                hide
                domain={[
                  0,
                  (dataMax) => dataMax * 1.25, // respiro no topo
                ]}
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
                  color: VERDE_ESCURO,
                  paddingBottom: 8,
                }}
              />
              {/* META - barra de fundo */}
              <Bar
                dataKey="metaNum"
                name="Meta Frete 2026"
                fill={VERDE_ESCURO}
                barSize={42}
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList
                  dataKey="metaNum"
                  position="top"
                  formatter={(v) => (v ? formatCurrency(v) : "")}
                  offset={6}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#65290B",
                  }}
                />
              </Bar>
              {/* MÉDIA - barra menor na frente */}
              <Bar
                dataKey="mediaNum"
                name="Média (P+T)"
                fill={AMARELO}
                barSize={28}
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList
                  dataKey="mediaNum"
                  position="insideTop"
                  formatter={(v) => (v ? formatCurrency(v) : "")}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: VERDE_ESCURO,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ================= GRÁFICO 2 - CUSTO POR TIPO ================= */}
      <Card className="shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase"
            style={{ color: VERDE_ESCURO }}
          >
            TRANSPORTE MÁQUINAS - CUSTO POR TIPO
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico02}
              barCategoryGap={35}
              barGap={0}
              margin={{ top: 30, right: 30, left: 20, bottom: 35 }}
            >
              <XAxis
                dataKey="item"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: VERDE_ESCURO,
                }}
              />
              <YAxis
                hide
                domain={[
                  0,
                  (dataMax) => dataMax * 1.25,
                ]}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Qtd Frete") return value;
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
                  color: VERDE_ESCURO,
                  paddingBottom: 8,
                }}
              />
              <Bar
                dataKey="proprioNum"
                name="Soma Próprio"
                fill={VERDE_MEDIO}
                barSize={40}
                stackId="tipo"
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList
                  dataKey="proprioNum"
                  position="insideTop"
                  formatter={(v) => (v ? formatCurrency(v) : "")}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#FFFFFF",
                  }}
                />
              </Bar>
              <Bar
                dataKey="terceiroNum"
                name="Soma Terceiro"
                fill={AMARELO}
                barSize={40}
                stackId="tipo"
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList
                  dataKey="terceiroNum"
                  position="insideTop"
                  formatter={(v) => (v ? formatCurrency(v) : "")}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: VERDE_ESCURO,
                  }}
                />
              </Bar>
              {/* Qtd Frete em cima da pilha */}
              <Bar
                dataKey="qtdFreteNum"
                name="Qtd Frete"
                fill="transparent"
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="qtdFreteNum"
                  position="top"
                  offset={10}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: VERDE_ESCURO,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ================= GRÁFICO 3 - CUSTO COM TERCEIROS ================= */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase"
            style={{ color: VERDE_ESCURO }}
          >
            TRANSPORTE MÁQUINAS - CUSTO COM TERCEIROS
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[430px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico03}
              layout="vertical"
              barCategoryGap={14}
              margin={{ left: 260, right: 40, top: 25, bottom: 25 }}
            >
              <XAxis
                type="number"
                hide
                domain={[0, (dataMax) => dataMax * 1.15]}
              />
              <YAxis
                dataKey="freteiro"
                type="category"
                width={240}
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: VERDE_ESCURO,
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "KM") return `${toNumber(value)} km`;
                  return formatCurrency(value);
                }}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
              />
              {/* sem legenda, igual Excel */}
              <Bar
                dataKey="valorNum"
                name="Valor Total"
                fill={VERDE_MEDIO}
                barSize={26}
                radius={[0, 4, 4, 0]}
                minPointSize={8}
              >
                {/* valor dentro da barra */}
                <LabelList
                  dataKey="valorNum"
                  position="insideRight"
                  formatter={(v) => formatCurrency(v)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: "#FFFFFF",
                  }}
                />
                {/* KM na ponta / base da barra */}
                <LabelList
                  dataKey="kmNum"
                  name="KM"
                  position="right"
                  offset={10}
                  formatter={(v) => `${toNumber(v)} km`}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fill: AMARELO,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ================= GRÁFICO 4 - UTILIZAÇÃO DE MUNCK (INTACTO) ================= */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase text-center"
            style={{ color: VERDE_ESCURO }}
          >
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
