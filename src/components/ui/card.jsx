import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-4 py-3 border-b border-slate-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return <h2 className={`text-sm font-semibold text-slate-800 ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}