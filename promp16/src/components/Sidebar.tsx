import { NavLink } from 'react-router-dom';
import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  PhoneCall,
  PlusCircle,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/issues', label: '问题列表', icon: ClipboardList },
  { to: '/issues/new', label: '提交问题', icon: PlusCircle },
  { to: '/duty', label: '值班安排', icon: CalendarDays },
  { to: '/contacts', label: '联系人管理', icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">运营反馈系统</span>
          <span className="text-[11px] text-slate-400">Ops Feedback</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-slate-200 p-3">
        <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-slate-600">
            <PhoneCall className="h-3 w-3" />
            <span className="font-medium">紧急问题</span>
          </div>
          <p className="mt-1">提交紧急问题后将自动电话通知值班人</p>
        </div>
      </div>
    </aside>
  );
}
