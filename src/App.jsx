import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Calendario from "./pages/Calendario";
import Solicitacoes from "./pages/Solicitacoes";
import Concluidos from "./pages/Concluidos";
import Demonstracoes from "./pages/Demonstracoes";
import Custos from "./pages/Custos";

function AppRoutes() {
  const location = useLocation();
  const path = location.pathname;

  const currentPageName = (() => {
    if (path.startsWith("/calendario")) return "Calendario";
    if (path.startsWith("/solicitacoes")) return "Solicitacoes";
    if (path.startsWith("/concluidos")) return "Concluidos";
    if (path.startsWith("/demos")) return "Demonstracoes";
    if (path.startsWith("/custos")) return "Custos";
    return "Dashboard";
  })();

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/solicitacoes" element={<Solicitacoes />} />
        <Route path="/concluidos" element={<Concluidos />} />
        <Route path="/demos" element={<Demonstracoes />} />
        <Route path="/custos" element={<Custos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return <AppRoutes />;
}