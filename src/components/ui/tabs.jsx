import React, { useState } from "react";

export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = useState(defaultValue);
  const ctx = { value, setValue };
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { ctx }) : child
      )}
    </div>
  );
}

export function TabsList({ children, ctx, className = "" }) {
  return (
    <div className={`inline-flex bg-slate-900/80 rounded-lg p-1 gap-1 ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { ctx }) : child
      )}
    </div>
  );
}

export function TabsTrigger({ value, children, ctx, className = "" }) {
  const active = ctx?.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-1.5 text-xs rounded-md font-medium transition
        ${
          active
            ? "bg-emerald-400 text-slate-900"
            : "text-slate-200 hover:bg-slate-800"
        } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, ctx, children, className = "" }) {
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}
