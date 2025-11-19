import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CheckCircle2,
  Award,
  DollarSign,
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const navigation = [
    { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
    { name: "Calendário", page: "Calendario", icon: Calendar },
    { name: "Solicitações", page: "Solicitacoes", icon: FileText },
    { name: "Concluídos", page: "Concluidos", icon: CheckCircle2 },
    { name: "Demonstrações", page: "Demonstracoes", icon: Award },
    { name: "Custos", page: "Custos", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col fixed inset-y-0 left-0 shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-lg font-bold tracking-tight">
            Painel Logística 2026
          </h1>
          <p className="text-xs text-slate-400">
            Controle de fretes, custos e demonstrações
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const href = createPageUrl(item.page);
              const active = currentPageName === item.page;

              return (
                <Link
                  key={item.page}
                  to={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <main className="ml-60 flex-1 p-6">
        {children}
      </main>
    </div>
  );
}