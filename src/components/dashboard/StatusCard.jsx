import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function StatusCard({ title, icon: Icon, colorClass, items }) {
  const total = items.length;
  const firstItems = items.slice(0, 5);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {Icon && <Icon className={`w-4 h-4 ${colorClass}`} />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold mb-2">{total}</p>
        {firstItems.length > 0 && (
          <ul className="space-y-1 max-h-40 overflow-y-auto text-xs">
            {firstItems.map((t) => (
              <li key={t.id} className="flex justify-between gap-2">
                <span className="font-mono text-[11px]">{t.chassi}</span>
                <span className="truncate flex-1 text-right">{t.cliente}</span>
              </li>
            ))}
          </ul>
        )}
        {total > firstItems.length && (
          <p className="mt-2 text-[11px] text-slate-500">
            +{total - firstItems.length} registros
          </p>
        )}
      </CardContent>
    </Card>
  );
}