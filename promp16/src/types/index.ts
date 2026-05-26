export type Urgency = 'normal' | 'urgent';
export type IssueCategory = 'operation' | 'backend' | 'payment' | 'reward';
export type IssueStatus = 'pending' | 'processing' | 'archived';
export type ArchiveCategory =
  | 'history'
  | 'known'
  | 'frontend'
  | 'backend_bug'
  | 'operation'
  | 'non_bug';
export type Position = 'android' | 'ios' | 'frontend' | 'server' | 'tester';
export type Role = 'operator' | 'engineer' | 'admin';

export type PositionMap<T> = {
  [K in Position]?: T;
};

export interface User {
  id: string;
  name: string;
  role: Role;
  position?: Position;
  phone?: string;
  avatar?: string;
}

export interface DutyGroup {
  id: string;
  name: string;
  category: IssueCategory;
  memberIds: string[];
}

export interface DutyAssignment {
  id: string;
  userId: string;
  position: Position;
  dayIndex: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
}

export type ActivityAction =
  | 'submit'
  | 'follow'
  | 'comment'
  | 'archive'
  | 'assign'
  | 'urgent_call'
  | 'note';

export interface ActivityLog {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  urgency: Urgency;
  status: IssueStatus;
  archiveCategory?: ArchiveCategory;
  submitterId: string;
  submitterName: string;
  onDutyUserId?: string;
  onDutyUserName?: string;
  dutyGroupId?: string;
  extraContactIds: string[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  normal: '普通',
  urgent: '紧急',
};

export const CATEGORY_LABEL: Record<IssueCategory, string> = {
  operation: '运营活动',
  backend: '后台',
  payment: '支付相关',
  reward: '奖励下发',
};

export const STATUS_LABEL: Record<IssueStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  archived: '已归档',
};

export const ARCHIVE_LABEL: Record<ArchiveCategory, string> = {
  history: '历史问题',
  known: '已知问题',
  frontend: '前端问题',
  backend_bug: '服务端问题',
  operation: '操作问题',
  non_bug: '非bug',
};

export const POSITION_LABEL: Record<Position, string> = {
  android: '安卓',
  ios: 'iOS',
  frontend: '前端',
  server: '服务端',
  tester: '测试',
};

export const ROLE_LABEL: Record<Role, string> = {
  operator: '运营',
  engineer: '技术',
  admin: '管理员',
};

export const CATEGORY_TO_POSITION: Record<IssueCategory, Position> = {
  operation: 'tester',
  backend: 'server',
  payment: 'server',
  reward: 'server',
};
