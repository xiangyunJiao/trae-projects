import {
  ActivityLog,
  Comment,
  DutyGroup,
  Issue,
  IssueCategory,
  Position,
  User,
} from '../types';
import { uid } from './duty';

const ANDROID_NAMES = [
  '张伟', '王芳', '李娜', '刘洋', '陈杰',
];
const IOS_NAMES = [
  '杨磊', '赵敏', '黄强', '周涛', '吴静',
];
const FRONTEND_NAMES = [
  '徐鹏', '孙丽', '马超', '朱琳', '胡斌',
  '郭辉', '何芳', '高翔', '林娜', '罗勇',
];
const SERVER_NAMES = [
  '郑浩', '梁雪', '谢峰', '宋佳', '唐瑞',
  '韩磊', '冯敏', '邓超', '曹操', '彭飞',
  '曾涛', '肖楠', '田甜', '董伟', '潘龙',
  '袁浩',
];
const TESTER_NAMES = [
  '范静', '方圆', '石磊', '姚明', '谭杰',
  '廖辉',
];
const OPERATOR_NAMES = [
  '运营-小红', '运营-小明', '运营-小刚',
];
const ADMIN_NAMES = ['超级管理员'];

function buildUsers(
  names: string[],
  position: Position,
  role: 'engineer' | 'operator' | 'admin',
): User[] {
  return names.map((n) => ({
    id: uid('u'),
    name: n,
    role,
    position: role === 'engineer' ? position : undefined,
    phone: `138${Math.floor(10000000 + Math.random() * 89999999)}`,
  }));
}

export function generateMockUsers(): User[] {
  return [
    ...buildUsers(ANDROID_NAMES, 'android', 'engineer'),
    ...buildUsers(IOS_NAMES, 'ios', 'engineer'),
    ...buildUsers(FRONTEND_NAMES, 'frontend', 'engineer'),
    ...buildUsers(SERVER_NAMES, 'server', 'engineer'),
    ...buildUsers(TESTER_NAMES, 'tester', 'engineer'),
    ...OPERATOR_NAMES.map((n) => ({
      id: uid('u'),
      name: n,
      role: 'operator' as const,
      phone: `139${Math.floor(10000000 + Math.random() * 89999999)}`,
    })),
    ...ADMIN_NAMES.map((n) => ({
      id: uid('u'),
      name: n,
      role: 'admin' as const,
      phone: '13800000000',
    })),
  ];
}

export function generateMockDutyGroups(users: User[]): DutyGroup[] {
  const serverUsers = users.filter((u) => u.position === 'server').map((u) => u.id);
  const testerUsers = users.filter((u) => u.position === 'tester').map((u) => u.id);
  const frontendUsers = users.filter((u) => u.position === 'frontend').map((u) => u.id);
  return [
    {
      id: uid('g'),
      name: '运营活动值班组',
      category: 'operation',
      memberIds: [...testerUsers, ...frontendUsers.slice(0, 3)],
    },
    {
      id: uid('g'),
      name: '后台值班组',
      category: 'backend',
      memberIds: serverUsers.slice(0, 8),
    },
    {
      id: uid('g'),
      name: '支付相关值班组',
      category: 'payment',
      memberIds: serverUsers.slice(8, 14),
    },
    {
      id: uid('g'),
      name: '奖励下发值班组',
      category: 'reward',
      memberIds: serverUsers.slice(12, 16),
    },
  ];
}

const SAMPLE_ISSUES: Array<{
  title: string;
  description: string;
  category: IssueCategory;
  urgency: 'normal' | 'urgent';
}> = [
  {
    title: '首页 banner 活动图不显示',
    description: '用户反馈首页 banner 区域空白，刷新后仍不显示，影响活动推广。',
    category: 'operation',
    urgency: 'urgent',
  },
  {
    title: '支付订单回调超时',
    description: '部分 iOS 用户支付后订单状态未更新，疑似回调超时。',
    category: 'payment',
    urgency: 'urgent',
  },
  {
    title: '奖励金币下发延迟',
    description: '活动任务完成后，金币奖励延迟 10 分钟以上到账。',
    category: 'reward',
    urgency: 'normal',
  },
  {
    title: '后台订单导出失败',
    description: '运营后台导出订单 CSV 文件时提示错误，无法下载。',
    category: 'backend',
    urgency: 'normal',
  },
  {
    title: '新手引导页面崩溃',
    description: '安卓端打开新手引导时偶发崩溃，需要定位日志。',
    category: 'operation',
    urgency: 'urgent',
  },
  {
    title: '用户积分显示异常',
    description: '部分用户积分显示为负数，需核查数据。',
    category: 'backend',
    urgency: 'normal',
  },
];

export function generateMockIssues(users: User[]): Issue[] {
  const operators = users.filter((u) => u.role === 'operator');
  const engineers = users.filter((u) => u.role === 'engineer');
  const now = Date.now();
  return SAMPLE_ISSUES.map((sample, i) => {
    const submitter = operators[i % operators.length];
    const onDuty = engineers[i % engineers.length];
    return {
      id: uid('i'),
      title: sample.title,
      description: sample.description,
      category: sample.category,
      urgency: sample.urgency,
      status: i % 3 === 0 ? 'processing' : i % 5 === 0 ? 'archived' : 'pending',
      submitterId: submitter.id,
      submitterName: submitter.name,
      onDutyUserId: onDuty.id,
      onDutyUserName: onDuty.name,
      extraContactIds: [],
      attachments: [],
      createdAt: new Date(now - i * 3600000).toISOString(),
      updatedAt: new Date(now - i * 3600000).toISOString(),
    };
  });
}

export function generateMockActivityLogs(issues: Issue[], users: User[]): ActivityLog[] {
  return issues.flatMap((issue) => {
    const logs: ActivityLog[] = [
      {
        id: uid('a'),
        issueId: issue.id,
        userId: issue.submitterId,
        userName: issue.submitterName,
        action: 'submit',
        content: '提交了该问题',
        createdAt: issue.createdAt,
      },
    ];
    if (issue.status === 'processing' && issue.onDutyUserId) {
      const dutyUser = users.find((u) => u.id === issue.onDutyUserId);
      if (dutyUser) {
        logs.push({
          id: uid('a'),
          issueId: issue.id,
          userId: dutyUser.id,
          userName: dutyUser.name,
          action: 'follow',
          content: `${dutyUser.name} 跟进了该问题`,
          createdAt: new Date(new Date(issue.createdAt).getTime() + 600000).toISOString(),
        });
      }
    }
    return logs;
  });
}

export function generateMockComments(issues: Issue[], users: User[]): Comment[] {
  return issues.flatMap((issue, idx) => {
    if (idx % 2 !== 0) return [];
    const engineer = users.find((u) => u.id === issue.onDutyUserId);
    if (!engineer) return [];
    return [
      {
        id: uid('c'),
        issueId: issue.id,
        userId: engineer.id,
        userName: engineer.name,
        content: '已收到，正在定位问题原因。',
        createdAt: new Date(new Date(issue.createdAt).getTime() + 1200000).toISOString(),
      },
    ];
  });
}
