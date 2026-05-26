import { Position, PositionMap, User } from '../types';

export const DAY_START = new Date('2026-01-01T00:00:00').getTime();

export function dayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getOnDutyByPosition(
  users: User[],
  position: Position,
  date: Date = new Date(),
): User | undefined {
  const list = users
    .filter((u) => u.position === position)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (list.length === 0) return undefined;
  return list[dayOfYear(date) % list.length];
}

export function getOnDutyMap(
  users: User[],
  date: Date = new Date(),
): PositionMap<User | undefined> {
  const positions: Position[] = ['android', 'ios', 'frontend', 'server', 'tester'];
  const map: PositionMap<User | undefined> = {} as PositionMap<User | undefined>;
  positions.forEach((p) => {
    map[p] = getOnDutyByPosition(users, p, date);
  });
  return map;
}

export function getDutyOrder(users: User[], position: Position): User[] {
  return users
    .filter((u) => u.position === position)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDutyForDate(
  users: User[],
  position: Position,
  date: Date,
): User | undefined {
  const list = getDutyOrder(users, position);
  if (list.length === 0) return undefined;
  const doy = dayOfYear(date);
  return list[doy % list.length];
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} 小时前`;
  const day = Math.floor(hour / 24);
  if (day < 30) return `${day} 天前`;
  return formatDate(d);
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
