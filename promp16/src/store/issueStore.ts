import {
  ActivityLog,
  ArchiveCategory,
  Attachment,
  Comment,
  Issue,
  IssueCategory,
  Urgency,
  User,
} from '../types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  generateMockActivityLogs,
  generateMockComments,
  generateMockIssues,
} from '../utils/mock';
import { useContactStore } from './contactStore';

interface IssueState {
  issues: Issue[];
  activities: ActivityLog[];
  comments: Comment[];
  filterUrgency: Urgency | 'all';
  filterCategory: IssueCategory | 'all';
  filterStatus: 'all' | 'pending' | 'processing' | 'archived';
  filterKeyword: string;
  setFilterUrgency: (u: Urgency | 'all') => void;
  setFilterCategory: (c: IssueCategory | 'all') => void;
  setFilterStatus: (s: 'all' | 'pending' | 'processing' | 'archived') => void;
  setFilterKeyword: (k: string) => void;
  submitIssue: (params: {
    title: string;
    description: string;
    category: IssueCategory;
    urgency: Urgency;
    attachments: Attachment[];
    dutyGroupId?: string;
    onDutyUser?: User;
    extraContactIds: string[];
  }) => Issue;
  followIssue: (issueId: string, user: User) => void;
  archiveIssue: (issueId: string, category: ArchiveCategory, user: User) => void;
  addComment: (issueId: string, content: string, user: User) => void;
  addActivity: (
    issueId: string,
    action: ActivityLog['action'],
    content: string,
    user: User,
  ) => void;
  getIssueById: (id: string) => Issue | undefined;
  getActivities: (issueId: string) => ActivityLog[];
  getComments: (issueId: string) => Comment[];
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function initialIssues() {
  const users = useContactStore.getState().users;
  const issues = generateMockIssues(users);
  const activities = generateMockActivityLogs(issues, users);
  const comments = generateMockComments(issues, users);
  return { issues, activities, comments };
}

export const useIssueStore = create<IssueState>()(
  persist(
    (set, get) => ({
      ...initialIssues(),
      filterUrgency: 'all',
      filterCategory: 'all',
      filterStatus: 'all',
      filterKeyword: '',
      setFilterUrgency: (u) => set({ filterUrgency: u }),
      setFilterCategory: (c) => set({ filterCategory: c }),
      setFilterStatus: (s) => set({ filterStatus: s }),
      setFilterKeyword: (k) => set({ filterKeyword: k }),
      submitIssue: ({
        title,
        description,
        category,
        urgency,
        attachments,
        dutyGroupId,
        onDutyUser,
        extraContactIds,
      }) => {
        const { currentUserId, users } = useContactStore.getState();
        const submitter = users.find((u) => u.id === currentUserId) || users[0];
        const now = new Date().toISOString();
        const issue: Issue = {
          id: makeId('i'),
          title,
          description,
          category,
          urgency,
          status: 'pending',
          submitterId: submitter.id,
          submitterName: submitter.name,
          onDutyUserId: onDutyUser?.id,
          onDutyUserName: onDutyUser?.name,
          dutyGroupId,
          extraContactIds: extraContactIds || [],
          attachments,
          createdAt: now,
          updatedAt: now,
        };
        const activity: ActivityLog = {
          id: makeId('a'),
          issueId: issue.id,
          userId: submitter.id,
          userName: submitter.name,
          action: 'submit',
          content: '提交了该问题',
          createdAt: now,
        };
        set((state) => ({
          issues: [issue, ...state.issues],
          activities: [...state.activities, activity],
        }));
        return issue;
      },
      followIssue: (issueId, user) => {
        const now = new Date().toISOString();
        const log: ActivityLog = {
          id: makeId('a'),
          issueId,
          userId: user.id,
          userName: user.name,
          action: 'follow',
          content: `${user.name} 跟进了该问题`,
          createdAt: now,
        };
        set((state) => ({
          activities: [...state.activities, log],
          issues: state.issues.map((i) =>
            i.id === issueId
              ? { ...i, status: 'processing', onDutyUserId: user.id, onDutyUserName: user.name, updatedAt: now }
              : i,
          ),
        }));
      },
      archiveIssue: (issueId, category, user) => {
        const now = new Date().toISOString();
        const log: ActivityLog = {
          id: makeId('a'),
          issueId,
          userId: user.id,
          userName: user.name,
          action: 'archive',
          content: `${user.name} 归档了该问题（${category}）`,
          createdAt: now,
        };
        set((state) => ({
          activities: [...state.activities, log],
          issues: state.issues.map((i) =>
            i.id === issueId
              ? { ...i, status: 'archived', archiveCategory: category, updatedAt: now }
              : i,
          ),
        }));
      },
      addComment: (issueId, content, user) => {
        const now = new Date().toISOString();
        const comment: Comment = {
          id: makeId('c'),
          issueId,
          userId: user.id,
          userName: user.name,
          content,
          createdAt: now,
        };
        const log: ActivityLog = {
          id: makeId('a'),
          issueId,
          userId: user.id,
          userName: user.name,
          action: 'comment',
          content: `${user.name} 留言：${content}`,
          createdAt: now,
        };
        set((state) => ({
          comments: [...state.comments, comment],
          activities: [...state.activities, log],
        }));
      },
      addActivity: (issueId, action, content, user) => {
        const now = new Date().toISOString();
        const log: ActivityLog = {
          id: makeId('a'),
          issueId,
          userId: user.id,
          userName: user.name,
          action,
          content,
          createdAt: now,
        };
        set((state) => ({ activities: [...state.activities, log] }));
      },
      getIssueById: (id) => get().issues.find((i) => i.id === id),
      getActivities: (issueId) =>
        get()
          .activities.filter((a) => a.issueId === issueId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      getComments: (issueId) =>
        get()
          .comments.filter((c) => c.issueId === issueId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    }),
    {
      name: 'ops-feedback-issues',
      partialize: (state) => ({
        issues: state.issues.map((i) => ({
          ...i,
          attachments: i.attachments.filter((a) => a.url.startsWith('data:')),
        })),
        activities: state.activities,
        comments: state.comments,
        filterUrgency: state.filterUrgency,
        filterCategory: state.filterCategory,
        filterStatus: state.filterStatus,
        filterKeyword: state.filterKeyword,
      }),
    },
  ),
);
