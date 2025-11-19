import React from "react";
import { useCustos } from "../data/useCustos";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, Thead, Tbody, Tr, Th, Td } from "../components/ui/table";

function SimpleTable({ header, rows }) {
  if (!rows || !rows.length) return <p className="text-[11px] text-slate-500">Sem dados.</p>;
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <Table>
        <Thead>
          <Tr>
            {header.map((h, idx) => (
              <Th key={idx}>{h}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, i) => (
            <Tr key={i}>
              {row.map((cell, j) => (
                <Td key={j}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default function Custos() {
  const { data, loading, error } = useCustos();

  if (loading) {
    return <p className="text-sm text-slate-600">Carregando custos...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Erro ao carregar custos: {String(error.message || error)}
      </p>
    );
  }

  if (!data) {
    return <p className="text-sm text-slate-600">Nenhum dado de custos encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Custos</h2>
        <p className="text-xs text-slate-500">
          Blocos de custo lidos diretamente da aba CUSTOS da planilha LOGISTICA2026.xlsx
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Meta x Real - Frete Máquinas</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              header={data.metaFrete.header}
              rows={data.metaFrete.rows}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custo por tipo de transporte</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              header={data.custoTipo.header}
              rows={data.custoTipo.rows}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos Peças por loja</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable header={data.pecas.header} rows={data.pecas.rows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courier Peças por loja</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              header={data.courier.header}
              rows={data.courier.rows}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos Peças 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              header={data.pecas2026.header}
              rows={data.pecas2026.rows}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos Transportadoras Peças 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable
              header={data.transp2026.header}
              rows={data.transp2026.rows}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos Frota</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable header={data.frota.header} rows={data.frota.rows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos DAF 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable header={data.daf2026.header} rows={data.daf2026.rows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custos VW 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleTable header={data.vw2026.header} rows={data.vw2026.rows} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}