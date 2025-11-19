import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { LayoutDashboard, Calendar, FileText, CheckCircle2, Award, DollarSign, Tractor } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const navigation = [
    { name: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
    { name: 'Calendário', page: 'Calendario', icon: Calendar },
    { name: 'Solicitações', page: 'Solicitacoes', icon: FileText },
    { name: 'Concluídos', page: 'Concluidos', icon: CheckCircle2 },
    { name: 'Demonstrações', page: 'Demonstracoes', icon: Award },
    { name: 'Custos', page: 'Custos', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 flex">
      <aside className="w-52 bg-white border-r shadow-sm fixed left-0 top-0 h-full z-50">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-yellow-400 rounded-lg flex items-center justify-center">
              <Tractor className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Logística 2026</h1>
              <p className="text-xs text-gray-500">MacPonta Agro</p>
            </div>
          </div>
        </div>

        <nav className="p-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <main className="ml-52 flex-1">{children}</main>
    </div>
  );
}
