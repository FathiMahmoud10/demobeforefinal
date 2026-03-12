import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface MobileDataCardProps {
  key?: React.Key;
  title?: string;
  subtitle?: string;
  status?: {
    label: string;
    type: 'success' | 'warning' | 'danger' | 'info';
  };
  fields: {
    label: string;
    value: React.ReactNode;
    isBold?: boolean;
    isBadge?: boolean;
    badgeType?: 'success' | 'warning' | 'danger' | 'info';
  }[];
  actions?: React.ReactNode;
}

export default function MobileDataCard({ 
  title, 
  subtitle, 
  status, 
  fields, 
  actions 
}: MobileDataCardProps) {
  const { direction } = useLanguage();

  const getStatusClasses = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-sm space-y-4 mb-4">
      <div className="flex justify-between items-start border-b border-[var(--border)] pb-3">
        <div className="space-y-1">
          {title && <h3 className="font-bold text-[var(--text-main)]">{title}</h3>}
          {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
        </div>
        {status && (
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-bold border",
            getStatusClasses(status.type)
          )}>
            {status.label}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-muted)]">{field.label}</span>
            <div className={cn(
              field.isBold ? "font-bold text-[var(--text-main)]" : "text-[var(--text-main)]",
              field.isBadge && "px-2 py-0.5 rounded-full text-xs font-bold border " + getStatusClasses(field.badgeType || 'info')
            )}>
              {field.value}
            </div>
          </div>
        ))}
      </div>

      {actions && (
        <div className="pt-3 border-t border-[var(--border)] flex justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
