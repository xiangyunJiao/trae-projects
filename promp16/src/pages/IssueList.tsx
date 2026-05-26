import { useMemo } from 'react';
import { useIssueStore } from '@/store/issueStore';
import IssueCard from '@/components/IssueCard';
import Layout from '@/components/Layout';
import { PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_LABEL, STATUS_LABEL, URGENCY_LABEL } from '@/types';

export default function IssueList() {
  const {
    issues,
    filterUrgency,
    filterCategory,
    filterStatus,
    filterKeyword,
    setFilterUrgency,
    setFilterCategory,
    setFilterStatus,
    setFilterKeyword,
  } = useIssueStore();

  const filtered = useMemo(() => {
    return issues
      .filter((i) => filterUrgency === 'all' || i.urgency === filterUrgency)
      .filter((i) => filterCategory === 'all' || i.category === filterCategory)
      .filter((i) => filterStatus === 'all' || i.status === filterStatus)
      .filter((i) => {
        if (!filterKeyword) return true;
        const kw = filterKeyword.toLowerCase();
        return (
          i.title.toLowerCase().includes(kw) ||
          i.description.toLowerCase().includes(kw)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [issues, filterUrgency, filterCategory, filterStatus, filterKeyword]);

  const counts = useMemo(() => {
    return {
      total: issues.length,
      pending: issues.filter((i) => i.status === 'pending').length,
      processing: issues.filter((i) => i.status === 'processing').length,
      urgent: issues.filter((i) => i.urgency === 'urgent' && i.status !== 'archived')
        .length,
    };
  }, [issues]);

  return (
    <Layout title="问题列表">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="问题总数" value={counts.total} accent="indigo" />
        <StatCard label="待处理" value={counts.pending} accent="slate" />
        <StatCard label="处理中" value={counts.processing} accent="amber" />
        <StatCard label="紧急未解决" value={counts.urgent} accent="red" />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              placeholder="搜索问题标题或描述..."
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
            />
          </div>
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <Select
            value={filterUrgency}
            onChange={setFilterUrgency}
            options={[
              { value: 'all', label: '紧急程度：全部' },
              { value: 'urgent', label: `紧急程度：${URGENCY_LABEL.urgent}` },
              { value: 'normal', label: `紧急程度：${URGENCY_LABEL.normal}` },
            ]}
          />
          <Select
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { value: 'all', label: '分类：全部' },
              { value: 'operation', label: `分类：${CATEGORY_LABEL.operation}` },
              { value: 'backend', label: `分类：${CATEGORY_LABEL.backend}` },
              { value: 'payment', label: `分类：${CATEGORY_LABEL.payment}` },
              { value: 'reward', label: `分类：${CATEGORY_LABEL.reward}` },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: '状态：全部' },
              { value: 'pending', label: `状态：${STATUS_LABEL.pending}` },
              { value: 'processing', label: `状态：${STATUS_LABEL.processing}` },
              { value: 'archived', label: `状态：${STATUS_LABEL.archived}` },
            ]}
          />
          <Link
            to="/issues/new"
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4" />
            提交问题
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            暂无匹配的问题
          </div>
        ) : (
          filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </Layout>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: 'indigo' | 'slate' | 'amber' | 'red';
}) {
  const map = {
    indigo: 'from-indigo-500 to-indigo-600',
    slate: 'from-slate-400 to-slate-500',
    amber: 'from-amber-400 to-amber-500',
    red: 'from-red-500 to-red-600',
  } as const;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`mt-1 bg-gradient-to-r ${map[accent]} bg-clip-text text-2xl font-semibold text-transparent`}
      >
        {value}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
