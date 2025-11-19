import React from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS_PIE = ['#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];

export default function Custos() {
  const { data: transports = [], isLoading } = useQuery({
    queryKey: ['transports'],
    queryFn: () => base44.entities.Transport.list('-created_date', 1000),
  });

  const metaVsReal = [
    { name: 'CARRETA', Meta: 0, Real: 600, Demo: 0 },
    { name: 'COLHEITADEIRA', Meta: 2200, Real: 647, Demo: 0 },
    { name: 'PLANTADEIRA', Meta: 1850, Real: 1122, Demo: 0 },
    { name: 'PLATAFORMA', Meta: 800, Real: 217, Demo: 0 },
    { name: 'PULVERIZADOR', Meta: 2000, Real: 5856, Demo: 0 },
    { name: 'TRATOR', Meta: 1500, Real: 1063, Demo: 1518 }
  ];

  const custoPorTipo = [
    { name: 'TRATOR', 'Soma Proprio': 39546, 'Soma Terceiro': 19089, qtd: 55 },
    { name: 'PULVERIZADOR', 'Soma Proprio': 2112, 'Soma Terceiro': 9600, qtd: 3 },
    { name: 'COLHEITADEIRA', 'Soma Proprio': 9700, 'Soma Terceiro': 6950, qtd: 15 },
    { name: 'PLATAFORMA', 'Soma Proprio': 2600, 'Soma Terceiro': 3350, qtd: 12 },
    { name: 'PLANTADEIRA', 'Soma Proprio': 1122, 'Soma Terceiro': 2000, qtd: 2 },
    { name: 'CARRETA', 'Soma Proprio': 600, 'Soma Terceiro': 0, qtd: 2 }
  ];

  const custoPorTipoReordenado = [
    custoPorTipo[0],
    custoPorTipo[1],
    custoPorTipo[2],
    custoPorTipo[3],
    custoPorTipo[4],
    custoPorTipo[5]
  ];

  const terceiros = [
    { name: 'MAZETTO', 'Valor Total': 12051, 'Total KM': 1914 },
    { name: 'COLOMBO', 'Valor Total': 9600, 'Total KM': 733 },
    { name: 'AGROMAQ', 'Valor Total': 7200, 'Total KM': 1374 },
    { name: 'ZORTEA', 'Valor Total': 5400, 'Total KM': 956 },
    { name: 'DEMETRIO', 'Valor Total': 2830, 'Total KM': 748 },
    { name: 'NELSON', 'Valor Total': 2270, 'Total KM': 315 },
    { name: 'JAPONES', 'Valor Total': 1328, 'Total KM': 166 },
    { name: 'STOSKI', 'Valor Total': 910, 'Total KM': 70 }
  ];

  const munck = [
    { name: 'ARAPOTI', value: 2745 },
    { name: 'IRATI', value: 1262 },
    { name: 'PG', value: 440 },
    { name: 'GRPVA', value: 270 }
  ];

  const courierPorLoja = [
    { name: 'PG', valor: 9346 },
    { name: 'CASTRO', valor: 4770 },
    { name: 'GRPVA', valor: 1800 },
    { name: 'TIBAGI', valor: 1760 },
    { name: 'PRUDE', valor: 1095 },
    { name: 'ARAPOTI', valor: 990 },
    { name: 'IRATI', valor: 360 }
  ];

  const transportadoraPorLoja = [
    { name: 'PG', valor: 7232 },
    { name: 'ARAPOTI', valor: 1100 },
    { name: 'GRPVA', valor: 1100 },
    { name: 'CASTRO', valor: 850 },
    { name: 'TIBAGI', valor: 830 },
    { name: 'IRATI', valor: 602 },
    { name: 'PRUDE', valor: 550 }
  ];

  const courier = [
    { name: 'DELTA MOTOS', valor: 11420 },
    { name: 'JOSEAMILTON1', valor: 2390 },
    { name: 'MARCOS D.', valor: 1970 },
    { name: 'UNIBOY', valor: 1860 },
    { name: 'PRINCESA', valor: 901 },
    { name: 'JORGE LUIZ 2', valor: 880 },
    { name: 'ANDREIA R.', valor: 550 },
    { name: 'JOHN ELVIS', valor: 150 }
  ];

  const transportadora = [
    { name: 'CARGADEDICADA', valor: 6190 },
    { name: 'ESC', valor: 5580 },
    { name: 'PRINCESA', valor: 442 },
    { name: 'TX LOG', valor: 52 }
  ];

  const aproveitamento = [
    { name: 'PROPRIO VW', value: 19, percentage: 53 },
    { name: 'PROPRIO DAF', value: 18, percentage: 77 }
  ];

  const custosVsKm = [
    { name: 'PROPRIO DAF', VALOR: 13966, KMs: 2961 },
    { name: 'PROPRIO VW', VALOR: 15228, KMs: 2538 }
  ];

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
        <div className="mb-6 bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 rounded-xl p-4 shadow-lg">
          <h1 className="text-xl font-bold text-white">Custos</h1>
        </div>

        <Tabs defaultValue="maquinas" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="maquinas">Custos Máquinas</TabsTrigger>
            <TabsTrigger value="pecas">Custos Peças</TabsTrigger>
            <TabsTrigger value="frota">Custos Frota</TabsTrigger>
          </TabsList>

          <TabsContent value="maquinas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE MÁQUINAS - META VS REAL</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={metaVsReal}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                    <Tooltip />
                    <Bar
                      dataKey="Meta"
                      fill="#86efac"
                      name="Meta Frete 2026"
                      label={{ position: 'top', fill: '#065f46', fontSize: 11, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
                    />
                    <Bar
                      dataKey="Real"
                      fill="#fbbf24"
                      name="Média (P+T)"
                      label={{ position: 'top', fill: '#065f46', fontSize: 11, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE MÁQUINAS - CUSTO POR TIPO</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={custoPorTipoReordenado}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                    <Tooltip />
                    <Bar
                      dataKey="Soma Proprio"
                      fill="#4ade80"
                      name="Soma Proprio"
                      label={{ position: 'top', fill: '#065f46', fontSize: 10, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
                    />
                    <Bar
                      dataKey="Soma Terceiro"
                      fill="#fbbf24"
                      name="Soma Terceiro"
                      label={{ position: 'top', fill: '#065f46', fontSize: 10, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE MÁQUINAS - CUSTO COM TERCEIROS</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={terceiros}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} angle={-15} height={80} />
                    <YAxis tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                    <Tooltip />
                    <Bar
                      dataKey="Valor Total"
                      fill="#86efac"
                      name="Valor Total"
                      label={{ position: 'top', fill: '#065f46', fontSize: 10, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
                    />
                    <Bar
                      dataKey="Total KM"
                      fill="#fde047"
                      name="Total KM"
                      label={{ position: 'top', fill: '#92400e', fontSize: 10, fontWeight: 'bold' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CUSTOS - UTILIZAÇÃO DE MUNCK</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={munck}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}\nR$ ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      style={{ fontWeight: 'bold', fill: '#065f46' }}
                    >
                      {munck.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pecas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>TRANSPORTE PEÇAS - CUSTO COURIER POR LOJA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={courierPorLoja}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                      <Tooltip formatter={(value) => `R$ ${value}`} />
                      <Bar
                        dataKey="valor"
                        fill="#86efac"
                        label={{ position: 'top', formatter: (v) => `R$ ${v}`, fill: '#065f46', fontSize: 10, fontWeight: 'bold' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA POR LOJA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={transportadoraPorLoja}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                      <Tooltip formatter={(value) => `R$ ${value}`} />
                      <Bar
                        dataKey="valor"
                        fill="#86efac"
                        label={{ position: 'top', formatter: (v) => `R$ ${v}`, fill: '#065f46', fontSize: 10, fontWeight: 'bold' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE PEÇAS - CUSTO COURIER</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={courier}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} angle={-15} height={80} />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Bar
                      dataKey="valor"
                      fill="#86efac"
                      label={{ position: 'top', formatter: (v) => `R$ ${v}`, fill: '#065f46', fontSize: 10, fontWeight: 'bold' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TRANSPORTE PEÇAS - CUSTO TRANSPORTADORA</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={transportadora}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Bar
                      dataKey="valor"
                      fill="#86efac"
                      label={{ position: 'top', formatter: (v) => `R$ ${v}`, fill: '#065f46', fontSize: 10, fontWeight: 'bold' }}
                    />
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
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={aproveitamento}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}\n${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      style={{ fontWeight: 'bold', fill: '#065f46' }}
                    >
                      <Cell fill="#86efac" />
                      <Cell fill="#fde047" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VALOR APROXIMADO DE CUSTOS COM TRANSPORTE VS KM RODADO</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={custosVsKm} layout="vertical">
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#000', fontWeight: 'bold' }} width={120} />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Bar
                      dataKey="VALOR"
                      fill="#86efac"
                      name="VALOR"
                      label={{ position: 'inside', fill: '#065f46', fontSize: 11, fontWeight: 'bold', formatter: (v) => `R$ ${v}` }}
                    />
                    <Bar
                      dataKey="KMs"
                      fill="#fde047"
                      name="KMs"
                      label={{ position: 'right', fill: '#92400e', fontSize: 11, fontWeight: 'bold' }}
                    />
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
                    <div className="p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg text-center">
                      <p className="text-sm text-yellow-700 font-medium mb-2">DAF Implemento</p>
                      <p className="text-2xl font-bold text-yellow-800">R$ 4.175</p>
                    </div>
                    <div className="p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg text-center">
                      <p className="text-sm text-yellow-700 font-medium mb-2">DAF Multa</p>
                      <p className="text-2xl font-bold text-yellow-800">R$ 251</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CUSTOS VW 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-100 border-2 border-green-300 rounded-lg text-center">
                      <p className="text-xs text-green-700 font-medium mb-1">VW Implemento</p>
                      <p className="text-xl font-bold text-green-800">R$ 800</p>
                    </div>
                    <div className="p-3 bg-green-100 border-2 border-green-300 rounded-lg text-center">
                      <p className="text-xs text-green-700 font-medium mb-1">VW Licença DER AET</p>
                      <p className="text-xl font-bold text-green-800">R$ 133</p>
                    </div>
                    <div className="p-3 bg-green-100 border-2 border-green-300 rounded-lg text-center">
                      <p className="text-xs text-green-700 font-medium mb-1">VW Licença DNIT AET</p>
                      <p className="text-xl font-bold text-green-800">R$ 88</p>
                    </div>
                    <div className="p-3 bg-green-100 border-2 border-green-300 rounded-lg text-center">
                      <p className="text-xs text-green-700 font-medium mb-1">VW Manutenção</p>
                      <p className="text-xl font-bold text-green-800">R$ 4.853</p>
                    </div>
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
