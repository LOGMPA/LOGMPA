import React from "react";
import { useLogisticaData } from "../hooks/useLogisticaData";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS_PIE = ["#4ade80", "#86efac", "#bbf7d0", "#dcfce7"];

export default function Custos() {
  const { custos, isLoading } = useLogisticaData();

  if (isLoading || !custos) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  const {
    metaVsReal,
    custoPorTipo,
    terceiros,
    munck,
    courierPorLoja,
    transportadoraPorLoja,
    courier,
    transportadora,
    aproveitamento,
    custosVsKm,
    daf,
    vw,
  } = custos;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-slate-50">Painel de Custos</h1>
          <p className="text-sm text-slate-400">
            Dados consolidados da guia CUSTOS · Máquinas, Peças e Frota
          </p>
        </div>

        <Tabs defaultValue="maquinas" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="maquinas">Custos Máquinas</TabsTrigger>
            <TabsTrigger value="pecas">Custos Peças</TabsTrigger>
            <TabsTrigger value="frota">Custos Frota</TabsTrigger>
          </TabsList>

          <TabsContent value="maquinas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE MÁQUINAS - META VS REAL</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metaVsReal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#020617" }}
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
                    <Bar dataKey="Meta" fill="#86efac" name="Meta Frete 2026" />
                    <Bar dataKey="Real" fill="#fbbf24" name="Média (P+T)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE MÁQUINAS - CUSTO POR TIPO</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={custoPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#020617" }}
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#020617" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                              <p className="font-semibold text-slate-800">
                                {data.name}
                              </p>
                              <p className="text-green-600 text-xs">
                                Próprio: R${" "}
                                {data["Soma Proprio"].toLocaleString("pt-BR")}
                              </p>
                              <p className="text-amber-600 text-xs">
                                Terceiro: R${" "}
                                {data["Soma Terceiro"].toLocaleString("pt-BR")}
                              </p>
                              <p className="text-slate-600 text-xs">
                                Qtd Frete: {data.qtd}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Soma Proprio"
                      fill="#22c55e"
                      name="Soma Próprio"
                    />
                    <Bar
                      dataKey="Soma Terceiro"
                      fill="#facc15"
                      name="Soma Terceiro"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE MÁQUINAS - CUSTO COM TERCEIROS</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={terceiros} layout="horizontal">
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{
                        fontSize: 10,
                        fill: "#020617",
                        fontWeight: "bold",
                      }}
                      width={140}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                      }}
                      formatter={(value, key) => {
                        if (key === "Valor Total") {
                          return [
                            `R$ ${Number(value || 0).toLocaleString("pt-BR")}`,
                            "Valor",
                          ];
                        }
                        if (key === "Total KM") {
                          return [value, "KM"];
                        }
                        return [value, key];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Valor Total" fill="#22c55e" name="Valor" />
                    <Bar dataKey="Total KM" fill="#fbbf24" name="Total KM" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CUSTOS - UTILIZAÇÃO DE MUNCK</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={munck}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name} · R$ ${value.toLocaleString("pt-BR")}`
                      }
                      outerRadius={120}
                      dataKey="value"
                    >
                      {munck.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS_PIE[index % COLORS_PIE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pecas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    TRANSPORTE PEÇAS - CUSTO COURIER POR LOJA
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courierPorLoja}>
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 10,
                          fill: "#020617",
                          fontWeight: "bold",
                        }}
                      />
                      <YAxis tick={{ fontSize: 10, fill: "#020617" }} />
                      <Tooltip
                        formatter={(value) =>
                          `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
                        }
                      />
                      <Bar dataKey="valor" fill="#22c55e" name="R$" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA POR LOJA
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transportadoraPorLoja}>
                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 10,
                          fill: "#020617",
                          fontWeight: "bold",
                        }}
                      />
                      <YAxis tick={{ fontSize: 10, fill: "#020617" }} />
                      <Tooltip
                        formatter={(value) =>
                          `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
                        }
                      />
                      <Bar dataKey="valor" fill="#22c55e" name="R$" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE PEÇAS - CUSTO COURIER</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courier}>
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "#020617",
                        fontWeight: "bold",
                      }}
                      angle={-15}
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#020617" }} />
                    <Tooltip
                      formatter={(value) =>
                        `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
                      }
                    />
                    <Bar dataKey="valor" fill="#22c55e" name="R$" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transportadora}>
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "#020617",
                        fontWeight: "bold",
                      }}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "#020617" }} />
                    <Tooltip
                      formatter={(value) =>
                        `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
                      }
                    />
                    <Bar dataKey="valor" fill="#22c55e" name="R$" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frota" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>APROVEITAMENTO</CardTitle>
              </CardHeader>
              <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aproveitamento}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) =>
                        `${name} · ${percentage}%`
                      }
                      outerRadius={120}
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#facc15" />
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${Number(value || 0)}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  VALOR APROXIMADO DE CUSTOS COM TRANSPORTE VS KM RODADO
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={custosVsKm} layout="vertical">
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{
                        fontSize: 11,
                        fill: "#020617",
                        fontWeight: "bold",
                      }}
                      width={140}
                    />
                    <Tooltip
                      formatter={(value) =>
                        `R$ ${Number(value || 0).toLocaleString("pt-BR")}`
                      }
                    />
                    <Bar dataKey="VALOR" fill="#22c55e" name="VALOR" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CUSTOS DAF 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {daf.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-amber-100 border border-amber-200 rounded-lg text-center"
                      >
                        <p className="text-xs text-amber-800 font-medium mb-1">
                          {item.name}
                        </p>
                        <p className="text-xl font-bold text-amber-900">
                          R$ {item.valor.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CUSTOS VW 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {vw.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-emerald-100 border border-emerald-200 rounded-lg text-center"
                      >
                        <p className="text-xs text-emerald-800 font-medium mb-1">
                          {item.name}
                        </p>
                        <p className="text-xl font-bold text-emerald-900">
                          R$ {item.valor.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
