import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import Timeline from '@/components/Timeline';
import CallModal from '@/components/CallModal';
import {
  ARCHIVE_LABEL,
  ArchiveCategory,
  CATEGORY_LABEL,
  STATUS_LABEL,
  URGENCY_LABEL,
} from '@/types';
import { useIssueStore } from '@/store/issueStore';
import { useContactStore } from '@/store/contactStore';
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  UserCheck,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { formatDate } from '@/utils/duty';
import { cn } from '@/lib/utils';

export default function IssueDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const issues = useIssueStore((s) => s.issues);
  const allActivities = useIssueStore((s) => s.activities);
  const followIssue = useIssueStore((s) => s.followIssue);
  const archiveIssue = useIssueStore((s) => s.archiveIssue);
  const addComment = useIssueStore((s) => s.addComment);
  const addActivity = useIssueStore((s) => s.addActivity);

  const { users, currentUserId } = useContactStore();
  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || users[0],
    [users, currentUserId],
  );

  const issue = useMemo(
    () => issues.find((i) => i.id === id),
    [issues, id],
  );
  const activities = useMemo(
    () =>
      allActivities
        .filter((a) => a.issueId === id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [allActivities, id],
  );

  const [comment, setComment] = useState('');
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveCat, setArchiveCat] = useState<ArchiveCategory>('history');
  const [callOpen, setCallOpen] = useState(false);
  const [callTriggered, setCallTriggered] = useState(false);

  const shouldCall =
    params.get('call') === '1' &&
    issue?.urgency === 'urgent' &&
    issue?.onDutyUserId &&
    !callTriggered;

  useEffect(() => {
    if (shouldCall && issue && currentUser) {
      setCallOpen(true);
      setCallTriggered(true);
      addActivity(
        issue.id,
        'urgent_call',
        `系统已电话通知值班人 ${issue.onDutyUserName}`,
        currentUser,
      );
    }
  }, [shouldCall, issue, currentUser, addActivity]);

  const dutyUser = useMemo(
    () => users.find((u) => u.id === issue?.onDutyUserId),
    [users, issue],
  );
  const extraContacts = useMemo(
    () => users.filter((u) => issue?.extraContactIds.includes(u.id)),
    [users, issue],
  );

  if (!issue) {
    return (
      <Layout title="问题详情">
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
          未找到该问题
          <div className="mt-3">
            <button
              onClick={() => navigate('/issues')}
              className="rounded bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
            >
              返回列表
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  function handleFollow() {
    if (!currentUser) return;
    followIssue(issue.id, currentUser);
  }

  function handleArchiveConfirm() {
    if (!currentUser) return;
    archiveIssue(issue.id, archiveCat, currentUser);
    setArchiveOpen(false);
  }

  function handleSubmitComment() {
    if (!comment.trim() || !currentUser) return;
    addComment(issue.id, comment.trim(), currentUser);
    setComment('');
  }

  return (
    <Layout title="问题详情">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {issue.urgency === 'urgent' && (
                    <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      {URGENCY_LABEL[issue.urgency]}
                    </span>
                  )}
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                    {CATEGORY_LABEL[issue.category]}
                  </span>
                  <StatusBadge status={issue.status} />
                  {issue.archiveCategory && (
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      归档分类：{ARCHIVE_LABEL[issue.archiveCategory]}
                    </span>
                  )}
                </div>
                <h1 className="mt-2 text-lg font-semibold text-slate-900">
                  {issue.title}
                </h1>
                <div className="mt-1 text-xs text-slate-400">
                  提交人：{issue.submitterName} · 创建于 {formatDate(issue.createdAt)}
                </div>
              </div>
            </div>
            <div className="mt-4 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              {issue.description}
            </div>

            {issue.attachments.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1 text-xs text-slate-500">
                  <Paperclip className="h-3 w-3" />
                  附件 ({issue.attachments.length})
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {issue.attachments.map((a) => (
                    <div
                      key={a.id}
                      className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100"
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extraContacts.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="text-slate-400">额外通知：</span>
                {extraContacts.map((c) => (
                  <span key={c.id} className="rounded bg-slate-100 px-2 py-0.5">
                    {c.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 text-sm font-semibold text-slate-900">处理记录</div>
            <Timeline logs={activities} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 text-sm font-semibold text-slate-900">留言</div>
            <div className="space-y-3">
              {activities
                .filter((a) => a.action === 'comment')
                .map((a) => (
                  <div key={a.id} className="rounded-md bg-slate-50 px-3 py-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{a.userName}</span>
                      <span className="text-slate-400">{formatDate(a.createdAt)}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {a.content.replace(/^.*留言：/, '')}
                    </div>
                  </div>
                ))}
              {activities.filter((a) => a.action === 'comment').length === 0 && (
                <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  暂无留言
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="输入留言内容..."
                className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
              <button
                onClick={handleSubmitComment}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <MessageSquare className="h-4 w-4" />
                留言
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 text-sm font-semibold text-slate-900">操作</div>
            <div className="space-y-2">
              {issue.status !== 'archived' && (
                <button
                  onClick={handleFollow}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
                >
                  <UserCheck className="h-4 w-4" />
                  跟进该问题
                </button>
              )}
              {issue.status !== 'archived' && (
                <button
                  onClick={() => setArchiveOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <Archive className="h-4 w-4" />
                  归档问题
                </button>
              )}
              {issue.urgency === 'urgent' && dutyUser && issue.status !== 'archived' && (
                <button
                  onClick={() => setCallOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                >
                  <AlertTriangle className="h-4 w-4" />
                  再次电话通知
                </button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 text-sm font-semibold text-slate-900">值班人</div>
            {dutyUser ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {dutyUser.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {dutyUser.name}
                  </div>
                  <div className="text-xs text-slate-400">{dutyUser.phone}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">未指派</div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 text-xs text-slate-500">
            <div className="mb-2 font-semibold text-slate-700">提示</div>
            <ul className="space-y-1 list-disc pl-4">
              <li>任何人都可以对问题留言</li>
              <li>点击"跟进"将记录你为处理人</li>
              <li>归档时请选择合适的分类</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        open={archiveOpen}
        title="选择归档分类"
        onClose={() => setArchiveOpen(false)}
        footer={
          <>
            <button
              onClick={() => setArchiveOpen(false)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              onClick={handleArchiveConfirm}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              确认归档
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ARCHIVE_LABEL) as ArchiveCategory[]).map((k) => (
            <button
              key={k}
              onClick={() => setArchiveCat(k)}
              className={cn(
                'rounded-md border px-3 py-2 text-sm text-left transition',
                archiveCat === k
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
              )}
            >
              {ARCHIVE_LABEL[k]}
            </button>
          ))}
        </div>
      </Modal>

      {dutyUser && (
        <CallModal
          open={callOpen}
          issueTitle={issue.title}
          user={dutyUser}
          onClose={() => setCallOpen(false)}
        />
      )}
    </Layout>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'processing' | 'archived' }) {
  const cls =
    status === 'archived'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'processing'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-700';
  return (
    <span className={cn('rounded px-2 py-0.5 text-xs font-medium', cls)}>
      {STATUS_LABEL[status]}
    </span>
  );
}
