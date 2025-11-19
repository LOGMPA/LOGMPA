import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "../ui/table";

export default function TransportTable({ transports }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="max-h-[600px] overflow-y-auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Previsão</Th>
              <Th>Chassi</Th>
              <Th>Cliente / Nota</Th>
              <Th>Solicitante</Th>
              <Th>Está</Th>
              <Th>Vai</Th>
              <Th>Frete</Th>
              <Th>Filial</Th>
              <Th>Tipo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transports.map((t) => (
              <Tr key={t.id}>
                <Td className="font-semibold">{t.status}</Td>
                <Td>
                  {t.prev instanceof Date
                    ? t.prev.toLocaleDateString("pt-BR")
                    : t.prev || ""}
                </Td>
                <Td className="font-mono">{t.chassi}</Td>
                <Td>{t.cliente}</Td>
                <Td>{t.solicitante}</Td>
                <Td>{t.esta}</Td>
                <Td>{t.vai}</Td>
                <Td>{t.frete}</Td>
                <Td>{t.filial_custos}</Td>
                <Td>{t.tipo}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}