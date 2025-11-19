import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Calendario from "./pages/Calendario";
import Solicitacoes from "./pages/Solicitacoes";
import Concluidos from "./pages/Concluidos";
import Demonstracoes from "./pages/Demonstracoes";
import Custos from "./pages/Custos";
import { Truck, CalendarDays, ListChecks, CheckCircle2, Sparkles, Gauge } from "lucide-react";

const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: Gauge, component: Dashboard },
  { id: "calendario", label: "Calendário", icon: CalendarDays, component: Calendario },
  { id: "solicitacoes", label: "Solicitações", icon: ListChecks, component: Solicitacoes },
  { id: "concluidos", label: "Concluídos", icon: CheckCircle2, component: Concluidos },
  { id: "demonstracoes", label: "Demonstrações", icon: Sparkles, component: Demonstracoes },
  { id: "custos", label: "Custos", icon: Truck, component: Custos }
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const Current = PAGES.find((p) => p.id === page)?.component ?? Dashboard;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-4 py-5 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-300 text-slate-900">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              Painel Logística
            </h1>
            <p className="text-xs text-slate-400">MacPonta Agro · 2026</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {PAGES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                ${
                  page === id
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-emerald-200"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500">
          Dados: LOGISTICA2026.xlsx · guia FRETE MÁQUINAS &amp; CUSTOS
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Current />
      </main>
    </div>
  );
}
