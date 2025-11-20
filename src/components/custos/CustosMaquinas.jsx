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

// ================== PALETA PRINCIPAL ==================
const VERDE_ESCURO = "#2A5E20";
const VERDE_MEDIO = "#387C2B";
const AMARELO = "#FCDC01";
const CREME = "#FFF5AB";

// ================== PALETA DA PIZZA ==================
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

// ================== HELPERS NUMÉRICOS ==================
const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;

  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }

  if (typeof value === "string") {
    const cleaned = value
      .replace(/[^\d,-]/g, "") // tira R$, espaço, etc
      .replace(/\./g, "") // remove separador de milhar
      .replace(",", "."); // vírgula -> decimal
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

// ================== HELPERS DE LABEL ==================

// rótulo simples numérico em cima (Qtd Frete)
const TopPlainLabel = (props) => {
  const { x, y, value } = props;
  if (value === null || value === undefined || value === "") return null;
  return (
    <text
      x={x}
      y={y - 4}
      textAnchor="middle"
      fontSize={11}
      fontWeight={700}
      fill={VERDE_ESCURO}
    >
      {value}
    </text>
  );
};

// rótulo KM na ponta da barra horizontal
const KmRightLabel = (props) => {
  const { x, y, value } = props;
  const num = toNumber(value);
  if (!num) return null;
  return (
    <text
      x={x + 8}
      y={y + 6}
      textAnchor="start"
      fontSize={11}
      fontWeight={700}
      fill={AMARELO}
    >
      {`${num} km`}
    </text>
  );
};

// (ainda deixei esse helper, caso você queira reaproveitar depois)
const InsideCurrencyLabel = (props) => {
  const { x, y, width, height, value, fill = "#FFFFFF", bgColor } = props;
  const num = toNumber(value);
  if (!num || !width) return null;

  const label = formatCurrency(num);
  const paddingX = 6;
  const boxHeight = 18;
  const charWidth = 6;
  const boxWidth = label.length * charWidth + paddingX * 2;

  const centerX = x + width / 2;
  let boxY;

  if (height > boxHeight + 6) {
    boxY = y + 4;
  } else {
    boxY = y - boxHeight - 4;
  }

  const boxX = centerX - boxWidth / 2;
  const textY = boxY + boxHeight / 2 + 4;

  return (
    <g>
      <rect
        x={boxX}
        y={boxY}
        width={boxWidth}
        height={boxHeight}
        rx={4}
        ry={4}
        fill={bgColor || "rgba(0,0,0,0.2)"}
      />
      <text
        x={centerX}
        y={textY}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={fill}
      >
        {label}
      </text>
    </g>
  );
};

// ======== LABELS ESPECÍFICOS DO GRÁFICO 1/2 ========

// Meta (verde): caixinha acima, alinhada à ESQUERDA da coluna
const MetaLabelBoxG1 = (props) => {
  const { x, y, width, value } = props;
  const num = toNumber(value);
  if (!num || !width) return null;

  const label = formatCurrency(num);
  const paddingX = 8;
  const boxHeight = 18;
  const charWidth = 6;
  const boxWidth = label.length * charWidth + paddingX * 2;

  const barLeft = x;
  const centerX = barLeft + boxWidth / 2 + 4; // 4px de folga da borda esquerda
  const boxX = centerX - boxWidth / 2;
  const boxY = y - boxHeight - 4;

  return (
    <g>
      <rect
        x={boxX}
        y={boxY}
        width={boxWidth}
        height={boxHeight}
        rx={4}
        ry={4}
        fill={VERDE_ESCURO}
      />
      <text
        x={centerX}
        y={boxY + boxHeight / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={CREME}
      >
        {label}
      </text>
    </g>
  );
};

// Média (amarelo): caixinha dentro / topo, alinhada à DIREITA da coluna
const MediaLabelBoxG1 = (props) => {
  const { x, y, width, height, value } = props;
  const num = toNumber(value);
  if (!num || !width) return null;

  const label = formatCurrency(num);
  const paddingX = 6;
  const boxHeight = 18;
  const charWidth = 6;
  const boxWidth = label.length * charWidth + paddingX * 2;

  const barLeft = x;
  const barRight = x + width;

  // tenta alinhar à direita da barra; se a barra for muito estreita, centraliza
  const enoughWidth = width > boxWidth + 8;
  const centerX = enoughWidth
    ? barRight - boxWidth / 2 - 4
    : barLeft + width / 2;

  const boxX = centerX - boxWidth / 2;

  let boxY;
  if (height > boxHeight + 8) {
    boxY = y + 4; // dentro da barra
  } else {
    boxY = y - boxHeight - 4; // acima
  }

  const textY = boxY + boxHeight / 2 + 4;

  return (
    <g>
      <rect
        x={boxX}
        y={boxY}
        width={boxWidth}
        height={boxHeight}
        rx={4}
        ry={4}
        fill={AMARELO}
      />
      <text
        x={centerX}
        y={textY}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={VERDE_ESCURO}
      >
        {label}
      </text>
    </g>
  );
};

// ================== COMPONENTE PRINCIPAL ==================
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

  // --------- PREPARAÇÃO DOS DADOS ---------
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

  const dadosGrafico03 = useMemo(
    () =>
      filterEmptyRows(grafico03Terceiros, ["valor", "km"]).map((item) => ({
        ...item,
        valorNum: toNumber(item.valor),
        kmNum: toNumber(item.km),
      })),
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

  // ================== RENDER GRÁFICOS ==================
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ========== GRÁFICO 1 - META VS REAL ========== */}
      <Card className="shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase"
            style={{ color: VERDE_ESCURO }}
          >
            TRANSPORTE MÁQUINAS - META VS REAL
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico01}
              barCategoryGap="40%"
              barGap={-18}
              margin={{ top: 40, right: 40, left: 40, bottom: 35 }}
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
                scale="sqrt" // aproxima as alturas
                domain={[0, (dataMax) => dataMax * 1.2]}
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
              {/* Meta - caixinha verde mais à esquerda */}
              <Bar
                dataKey="metaNum"
                name="Meta Frete 2026"
                fill={VERDE_ESCURO}
                barSize={44}
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList content={<MetaLabelBoxG1 />} />
              </Bar>
              {/* Média - caixinha amarela mais à direita */}
              <Bar
                dataKey="mediaNum"
                name="Média (P+T)"
                fill={AMARELO}
                barSize={30}
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList content={<MediaLabelBoxG1 />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ========== GRÁFICO 2 - CUSTO POR TIPO (mesma lógica de rótulo) ========== */}
      <Card className="shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase"
            style={{ color: VERDE_ESCURO }}
          >
            TRANSPORTE MÁQUINAS - CUSTO POR TIPO
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico02}
              barCategoryGap="40%"
              barGap={0}
              margin={{ top: 40, right: 40, left: 40, bottom: 35 }}
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
              <YAxis hide domain={[0, (dataMax) => dataMax * 1.2]} />
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
              {/* Próprio (verde) com label à esquerda da pilha */}
              <Bar
                dataKey="proprioNum"
                name="Soma Próprio"
                fill={VERDE_MEDIO}
                barSize={44}
                stackId="tipo"
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList content={<MetaLabelBoxG1 />} />
              </Bar>
              {/* Terceiro (amarelo) com label à direita da pilha */}
              <Bar
                dataKey="terceiroNum"
                name="Soma Terceiro"
                fill={AMARELO}
                barSize={44}
                stackId="tipo"
                radius={[4, 4, 0, 0]}
                minPointSize={6}
              >
                <LabelList content={<MediaLabelBoxG1 />} />
              </Bar>
              {/* Qtd Frete solta no topo */}
              <Bar
                dataKey="qtdFreteNum"
                name="Qtd Frete"
                fill="transparent"
                isAnimationActive={false}
              >
                <LabelList content={<TopPlainLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ========== GRÁFICO 3 - CUSTO COM TERCEIROS ========== */}
      <Card className="shadow-sm lg:col-span-1">
        <CardHeader>
          <CardTitle
            className="text-base font-bold uppercase"
            style={{ color: VERDE_ESCURO }}
          >
            TRANSPORTE MÁQUINAS - CUSTO COM TERCEIROS
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[440px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico03}
              layout="vertical"
              barCategoryGap={18}
              margin={{ left: 260, right: 40, top: 30, bottom: 30 }}
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
                minPointSize={10}
              >
                {/* valor dentro */}
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
                {/* km na ponta */}
                <LabelList dataKey="kmNum" content={<KmRightLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ========== GRÁFICO 4 - UTILIZAÇÃO DE MUNCK (INTACTO) ========== */}
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
