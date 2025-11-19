import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function StatusCard({ title, count, icon: Icon, color, items = [] }) {
  const colorMap = {
    blue: "from-sky-500 to-cyan-400",
    purple: "from-violet-500 to-fuchsia-400",
    amber: "from-amber-500 to-orange-400",
    green: "from-emerald-500 to-lime-400",
  };

  const gradient = colorMap[color] || colorMap.blue;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-slate-900 shadow`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </CardHeader>
      {items.length > 0 && (
        <CardContent className="max-h-40 overflow-y-auto text-xs">
          <table className="w-full text-left">
            <thead className="text-[11px] text-slate-500">
              <tr>
                <th className="pb-1 pr-2">Chassi</th>
                <th className="pb-1">Cliente</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {items.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="py-1 pr-2 font-semibold text-slate-900">
                    {t.chassi}
                  </td>
                  <td className="py-1 text-slate-700">{t.cliente_nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 10 && (
            <p className="mt-1 text-[11px] text-slate-500">
              +{items.length - 10} registros...
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
