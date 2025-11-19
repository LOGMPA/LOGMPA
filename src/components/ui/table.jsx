import React from "react";

export function Table({ children, className = "" }) {
  return (
    <table className={`min-w-full text-xs text-left ${className}`}>
      {children}
    </table>
  );
}

export function Thead({ children }) {
  return <thead className="bg-slate-50 text-slate-600">{children}</thead>;
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
}

export function Tr({ children }) {
  return <tr>{children}</tr>;
}

export function Th({ children, className = "" }) {
  return (
    <th className={`px-2 py-2 font-semibold text-[11px] uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`px-2 py-1 align-top text-[11px] text-slate-800 ${className}`}>{children}</td>;
}