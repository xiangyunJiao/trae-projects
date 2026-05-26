import { getCurrentUser } from '@/store/contactStore';
import { POSITION_LABEL, ROLE_LABEL } from '@/types';
import { ChevronDown } from 'lucide-react';

export default function Header({ title }: { title: string }) {
  const current = getCurrentUser();
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        {current && (
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
              {current.name.slice(0, 1)}
            </div>
            <span className="text-xs text-slate-700">{current.name}</span>
            <span className="text-[11px] text-slate-400">
              {ROLE_LABEL[current.role]}
              {current.position ? ` · ${POSITION_LABEL[current.position]}` : ''}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>
        )}
      </div>
    </header>
  );
}
