import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { format } from 'date-fns';

const statusColors = {
  "RECEBIDO": "bg-gray-200 text-gray-900",
  "RECEBIDO (D)": "bg-gray-200 text-gray-900",
  "PROGRAMADO": "bg-yellow-200 text-yellow-900",
  "PROGRAMADO (D)": "bg-yellow-200 text-yellow-900",
  "EM ROTA": "bg-blue-200 text-blue-900",
  "EM ROTA (D)": "bg-blue-200 text-blue-900",
  "CONCLUIDO": "bg-green-200 text-green-900",
  "CONCLUIDO (D)": "bg-green-200 text-green-900",
  "SUSPENSO": "bg-red-200 text-red-900"
};

export default function TransportTable({ transports }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Previsão</TableHead>
              <TableHead className="font-semibold">Solicitante</TableHead>
              <TableHead className="font-semibold">Cliente/Nota</TableHead>
              <TableHead className="font-semibold">Chassi</TableHead>
              <TableHead className="font-semibold">Está</TableHead>
              <TableHead className="font-semibold">Vai</TableHead>
              <TableHead className="font-semibold">Frete</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Geo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transports.map((transport) => (
              <TableRow key={transport.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {transport.prev ? format(new Date(transport.prev), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>{transport.solicitante}</TableCell>
                <TableCell className="max-w-[200px] truncate">{transport.cliente_nota}</TableCell>
                <TableCell className="font-mono text-xs font-bold">{transport.chassi}</TableCell>
                <TableCell>{transport.esta}</TableCell>
                <TableCell>{transport.vai}</TableCell>
                <TableCell className="text-xs">{transport.frete}</TableCell>
                <TableCell>
                  <Badge className={statusColors[transport.status]}>
                    {transport.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transport.geo_url && (
                    <a 
                      href={transport.geo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <MapPin className="w-4 h-4" />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
