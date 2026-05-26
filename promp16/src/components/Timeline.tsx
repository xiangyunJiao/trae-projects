import { ActivityLog, ARCHIVE_LABEL } from '@/types';
import { formatDate } from '@/utils/duty';
import {
  Archive,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  PlusCircle,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const actionMeta: Record<
  ActivityLog['action'],
  { label: string; icon: typeof PlusCircle; color: string }
> = {
  submit: { label: '提交', icon: PlusCircle, color: 'bg-indigo-500' },
  follow: { label: '跟进', icon: UserCheck, color: 'bg-amber-500' },
  comment: { label: '留言', icon: MessageSquare, color: 'bg-slate-500' },
  archive: { label: '归档', icon: Archive, color: 'bg-emerald-500' },
  assign: { label: '指派', icon: CheckCircle2, color: 'bg-sky-500' },
  urgent_call: { label: '电话通知', icon: PhoneCall, color: 'bg-red-500' },
  note: { label: '记录', icon: MessageSquare, color: 'bg-slate-500' },
};

function extractArchiveCategory(content: string): string | undefined {
  const match = content.match(/归档了该问题（([^）]+)）/);
  if (!match) return undefined;
  const key = match[1];
  return (ARCHIVE_LABEL as Record<string, string>)[key] || key;
}

export default function Timeline({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400">
        暂无处理记录
      </div>
    );
  }
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-5">
      {logs.map((log) => {
        const meta = actionMeta[log.action];
        const Icon = meta.icon;
        const archiveLabel =
          log.action === 'archive' ? extractArchiveCategory(log.content) : undefined;
        return (
          <li key={log.id} className="relative">
            <span
              className={cn(
                'absolute -left-[26px] flex h-5 w-5 items-center justify-center rounded-full text-white ring-4 ring-white',
                meta.color,
              )}
            >
              <Icon className="h-3 w-3" />
            </span>
            <div className="rounded-md bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">{log.userName}</span>
                  <span className="mx-1 text-slate-400">·</span>
                  {log.content}
                  {archiveLabel && (
                    <span className="ml-2 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      分类：{archiveLabel}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap text-[11px] text-slate-400">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
