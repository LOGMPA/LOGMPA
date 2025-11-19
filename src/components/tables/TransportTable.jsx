import React from "react";

export default function TransportTable({ transports }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Previsão</th>
              <th className="px-3 py-2 text-left">Solicitante</th>
              <th className="px-3 py-2 text-left">Cliente/Nota</th>
              <th className="px-3 py-2 text-left">Chassi</th>
              <th className="px-3 py-2 text-left">Está</th>
              <th className="px-3 py-2 text-left">Vai</th>
              <th className="px-3 py-2 text-left">Frete</th>
              <th className="px-3 py-2 text-left">Geo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transports.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-3 py-1.5 font-medium text-slate-800">
                  {t.status}
                </td>
                <td className="px-3 py-1.5 text-slate-700">{t.prev}</td>
                <td className="px-3 py-1.5 text-slate-700">{t.solicitante}</td>
                <td className="px-3 py-1.5 text-slate-700">
                  {t.cliente_nota}
                </td>
                <td className="px-3 py-1.5 font-semibold text-slate-900">
                  {t.chassi}
                </td>
                <td className="px-3 py-1.5 text-slate-700">{t.esta}</td>
                <td className="px-3 py-1.5 text-slate-700">{t.vai}</td>
                <td className="px-3 py-1.5 text-slate-700">{t.frete}</td>
                <td className="px-3 py-1.5 text-sky-600 underline">
                  {t.vai_para || t.esta_em}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transports.length === 0 && (
        <div className="px-4 py-6 text-center text-xs text-slate-500">
          Nenhum registro encontrado.
        </div>
      )}
    </div>
  );
}
