import { cn } from '@/lib/utils';
import { CATEGORY_LABEL, Issue, STATUS_LABEL } from '@/types';
import { relativeTime } from '@/utils/duty';
import { AlertTriangle, Clock, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  issue: Issue;
}

export default function IssueCard({ issue }: Props) {
  const navigate = useNavigate();

  const urgencyColor =
    issue.urgency === 'urgent'
      ? 'bg-red-500'
      : 'bg-slate-300';

  const statusClass =
    issue.status === 'archived'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : issue.status === 'processing'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      onClick={() => navigate(`/issues/${issue.id}`)}
      className={cn(
        'relative flex cursor-pointer flex-col rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <div className={cn('absolute left-0 top-0 h-full w-1 rounded-l-lg', urgencyColor)} />
      <div className="ml-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {issue.urgency === 'urgent' && (
              <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                <AlertTriangle className="h-3 w-3" />
                紧急
              </span>
            )}
            <h3 className="line-clamp-1 text-[15px] font-medium text-slate-900">
              {issue.title}
            </h3>
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-slate-500">{issue.description}</p>
        </div>
        <span
          className={cn(
            'shrink-0 whitespace-nowrap rounded border px-2 py-0.5 text-[11px] font-medium',
            statusClass,
          )}
        >
          {STATUS_LABEL[issue.status]}
        </span>
      </div>
      <div className="ml-2 mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700">
          {CATEGORY_LABEL[issue.category]}
        </span>
        {issue.onDutyUserName && (
          <span className="inline-flex items-center gap-1">
            <UserCircle2 className="h-3 w-3" />
            值班：{issue.onDutyUserName}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {relativeTime(issue.updatedAt)}
        </span>
      </div>
    </div>
  );
}
