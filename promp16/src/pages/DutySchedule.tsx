import { useMemo } from 'react';
import Layout from '@/components/Layout';
import { useContactStore } from '@/store/contactStore';
import { getDutyForDate, getOnDutyMap } from '@/utils/duty';
import { POSITION_LABEL, Position } from '@/types';
import { ChevronLeft, ChevronRight, UserCircle2 } from 'lucide-react';
import { useState } from 'react';

const POSITIONS: Position[] = ['android', 'ios', 'frontend', 'server', 'tester'];

export default function DutySchedule() {
  const { users } = useContactStore();
  const [anchor, setAnchor] = useState(() => new Date());

  const start = useMemo(() => {
    const d = new Date(anchor);
    d.setDate(d.getDate() - 1);
    return d;
  }, [anchor]);

  const days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [start]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDuty = useMemo(() => getOnDutyMap(users, new Date()), [users]);

  return (
    <Layout title="值班安排">
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-3">
          {POSITIONS.map((p) => (
            <div
              key={p}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="text-xs text-slate-500">{POSITION_LABEL[p]} 今日值班</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {todayDuty[p]?.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {todayDuty[p]?.name || '未安排'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {todayDuty[p]?.phone || '--'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">未来两周值班表</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const d = new Date(anchor);
                  d.setDate(d.getDate() - 7);
                  setAnchor(d);
                }}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAnchor(new Date())}
                className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              >
                今天
              </button>
              <button
                onClick={() => {
                  const d = new Date(anchor);
                  d.setDate(d.getDate() + 7);
                  setAnchor(d);
                }}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <th className="whitespace-nowrap px-3 py-2 font-medium">岗位</th>
                  {days.map((d) => {
                    const isToday = d.getTime() === today.getTime();
                    return (
                      <th
                        key={d.toISOString()}
                        className={`whitespace-nowrap px-3 py-2 text-center font-medium ${
                          isToday ? 'text-indigo-700' : ''
                        }`}
                      >
                        {d.getMonth() + 1}/{d.getDate()}
                        <div className="text-[10px] font-normal text-slate-400">
                          {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {POSITIONS.map((p) => (
                  <tr key={p} className="border-b border-slate-100">
                    <td className="whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-700">
                      {POSITION_LABEL[p]}
                    </td>
                    {days.map((d) => {
                      const u = getDutyForDate(users, p, d);
                      const isToday = d.getTime() === today.getTime();
                      return (
                        <td
                          key={d.toISOString()}
                          className={`whitespace-nowrap px-3 py-2 text-center ${
                            isToday ? 'bg-indigo-50/50' : ''
                          }`}
                        >
                          {u ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">
                                {u.name.slice(0, 1)}
                              </div>
                              <span className="text-[11px] text-slate-600">
                                {u.name}
                              </span>
                            </div>
                          ) : (
                            <UserCircle2 className="mx-auto h-4 w-4 text-slate-300" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-500">
          <div className="font-semibold text-slate-700">值班规则说明</div>
          <ul className="mt-1 space-y-1 list-disc pl-4">
            <li>按岗位（安卓/iOS/前端/服务端/测试）分组，每个岗位每天恰好 1 人值班</li>
            <li>按岗位人员列表顺序轮转，保证公平分配</li>
            <li>问题提交时自动将当前值班人设为默认值班人</li>
            <li>如需调整值班顺序，请在"联系人管理"中调整岗位人员</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
