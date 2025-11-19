import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatusCard({ title, count, icon: Icon, color, items, onItemClick }) {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-700",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <Card className={`${colorClasses[color]} border-2 shadow-sm hover:shadow-md transition-all p-4 mb-3`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium opacity-80 mb-1">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className="p-2 bg-white/50 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <div className="flex-1 bg-white rounded-xl border shadow-sm p-3 overflow-y-auto max-h-[400px]">
        <div className="space-y-2">
          {items?.slice(0, 10).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onItemClick?.(item)}
              className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.chassi}</p>
                  <p className="text-xs text-gray-600">{item.cliente_nota}</p>
                </div>
                {item.geo_url && (
                  <a 
                    href={item.geo_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
