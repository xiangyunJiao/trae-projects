import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import {
  CATEGORY_LABEL,
  CATEGORY_TO_POSITION,
  IssueCategory,
  POSITION_LABEL,
  URGENCY_LABEL,
  Urgency,
  User,
} from '@/types';
import { useContactStore } from '@/store/contactStore';
import { getOnDutyByPosition } from '@/utils/duty';
import { AlertTriangle, Paperclip, PhoneCall, Send, X } from 'lucide-react';
import { useIssueStore } from '@/store/issueStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AttachmentDraft {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
}

export default function IssueNew() {
  const navigate = useNavigate();
  const { users, dutyGroups, currentUserId } = useContactStore();
  const submitIssue = useIssueStore((s) => s.submitIssue);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('operation');
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [dutyGroupId, setDutyGroupId] = useState<string>('');
  const [onDutyUserId, setOnDutyUserId] = useState<string>('');
  const [extraContactIds, setExtraContactIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [error, setError] = useState('');

  const defaultDutyGroup = useMemo(
    () => dutyGroups.find((g) => g.category === category),
    [dutyGroups, category],
  );

  useEffect(() => {
    setDutyGroupId(defaultDutyGroup?.id || '');
  }, [defaultDutyGroup]);

  const engineers = useMemo(
    () => users.filter((u) => u.role === 'engineer'),
    [users],
  );

  const suggestedOnDuty = useMemo(() => {
    if (onDutyUserId) return users.find((u) => u.id === onDutyUserId);
    const pos = CATEGORY_TO_POSITION[category];
    return getOnDutyByPosition(users, pos);
  }, [onDutyUserId, category, users]);

  const dutyGroupMembers = useMemo(() => {
    const g = dutyGroups.find((x) => x.id === dutyGroupId);
    return g ? users.filter((u) => g.memberIds.includes(u.id)) : [];
  }, [dutyGroupId, dutyGroups, users]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const list: AttachmentDraft[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 50 * 1024 * 1024) return;
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      list.push({
        id: `f_${Date.now()}_${Math.random()}`,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url,
      });
    });
    setAttachments((prev) => [...prev, ...list]);
    e.target.value = '';
  }

  function toggleExtra(id: string) {
    setExtraContactIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleSubmit() {
    setError('');
    if (!title.trim()) {
      setError('请填写问题标题');
      return;
    }
    if (!description.trim()) {
      setError('请填写问题描述');
      return;
    }
    const submitter = users.find((u) => u.id === currentUserId) || users[0];
    const onDutyUser = suggestedOnDuty;
    const issue = submitIssue({
      title: title.trim(),
      description: description.trim(),
      category,
      urgency,
      attachments: attachments.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        url: a.url,
      })),
      dutyGroupId: dutyGroupId || undefined,
      onDutyUser,
      extraContactIds,
    });
    void submitter;
    if (urgency === 'urgent' && onDutyUser) {
      navigate(`/issues/${issue.id}?call=1`);
    } else {
      navigate(`/issues/${issue.id}`);
    }
  }

  return (
    <Layout title="提交问题">
      <div className="mx-auto max-w-4xl space-y-4">
        <Section title="基本信息">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">问题标题</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请简要描述问题"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  问题紧急程度
                </label>
                <div className="flex gap-2">
                  {(['normal', 'urgent'] as Urgency[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={cn(
                        'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition',
                        urgency === u
                          ? u === 'urgent'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                      )}
                    >
                      {u === 'urgent' && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                      {URGENCY_LABEL[u]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">问题所属</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
                >
                  {(Object.keys(CATEGORY_LABEL) as IssueCategory[]).map((k) => (
                    <option key={k} value={k}>
                      {CATEGORY_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">问题描述</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细描述问题的复现步骤、影响范围等..."
                className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
          </div>
        </Section>

        <Section title="截图或视频">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-200 bg-slate-50 py-6 text-sm text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/40">
            <Paperclip className="h-5 w-5" />
            <span>点击上传图片或视频（支持多文件，单文件最大 50MB）</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={onFileChange}
            />
          </label>
          {attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {attachments.map((a) => (
                <div
                  key={a.id}
                  className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100"
                >
                  {a.type === 'image' ? (
                    <img src={a.url} alt={a.name} className="h-full w-full object-cover" />
                  ) : (
                    <video
                      src={a.url}
                      controls
                      className="h-full w-full bg-black object-contain"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setAttachments((p) => p.filter((x) => x.id !== a.id))}
                    className="absolute right-1 top-1 rounded bg-black/60 p-0.5 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="值班指派">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">值班组</label>
              <select
                value={dutyGroupId}
                onChange={(e) => setDutyGroupId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              >
                <option value="">-- 选择值班组（可留空） --</option>
                {dutyGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {dutyGroupMembers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {dutyGroupMembers.map((m) => (
                    <span
                      key={m.id}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                    >
                      {m.name}
                      {m.position ? ` · ${POSITION_LABEL[m.position]}` : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                值班人（默认当前值班）
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={onDutyUserId}
                  onChange={(e) => setOnDutyUserId(e.target.value)}
                  className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
                >
                  <option value="">
                    {suggestedOnDuty
                      ? `默认：${suggestedOnDuty.name}（${suggestedOnDuty.position ? POSITION_LABEL[suggestedOnDuty.position] : ''}）`
                      : '-- 选择值班人 --'}
                  </option>
                  {engineers.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                      {e.position ? ` · ${POSITION_LABEL[e.position]}` : ''}
                    </option>
                  ))}
                </select>
                {suggestedOnDuty && (
                  <span className="rounded bg-indigo-50 px-2 py-1 text-[11px] text-indigo-700">
                    当前值班
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                额外联系人 / 联系组
              </label>
              <div className="flex flex-wrap gap-2">
                {users
                  .filter((u) => u.role !== 'operator' || true)
                  .map((u) => {
                    const active = extraContactIds.includes(u.id);
                    return (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => toggleExtra(u.id)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs transition',
                          active
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                        )}
                      >
                        + {u.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </Section>

        {urgency === 'urgent' && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <PhoneCall className="h-4 w-4" />
            <span>紧急问题：提交后系统将自动电话通知值班人</span>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/issues')}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
            提交问题
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
