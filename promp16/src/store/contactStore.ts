import { create } from 'zustand';
import { DutyGroup, Position, User } from '../types';
import {
  generateMockDutyGroups,
  generateMockUsers,
} from '../utils/mock';

interface ContactState {
  users: User[];
  dutyGroups: DutyGroup[];
  currentUserId: string;
  setCurrentUser: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  removeUser: (id: string) => void;
  addDutyGroup: (group: Omit<DutyGroup, 'id'>) => void;
  updateDutyGroup: (id: string, patch: Partial<DutyGroup>) => void;
  removeDutyGroup: (id: string) => void;
  reset: () => void;
}

function buildInitial(): Pick<ContactState, 'users' | 'dutyGroups' | 'currentUserId'> {
  const users = generateMockUsers();
  const dutyGroups = generateMockDutyGroups(users);
  const admin = users.find((u) => u.role === 'admin');
  return { users, dutyGroups, currentUserId: admin?.id || '' };
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useContactStore = create<ContactState>((set) => ({
  ...buildInitial(),
  setCurrentUser: (id) => set({ currentUserId: id }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { ...user, id: makeId('u') }],
    })),
  updateUser: (id, patch) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  addDutyGroup: (group) =>
    set((state) => ({
      dutyGroups: [...state.dutyGroups, { ...group, id: makeId('g') }],
    })),
  updateDutyGroup: (id, patch) =>
    set((state) => ({
      dutyGroups: state.dutyGroups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    })),
  removeDutyGroup: (id) =>
    set((state) => ({
      dutyGroups: state.dutyGroups.filter((g) => g.id !== id),
    })),
  reset: () => set(buildInitial()),
}));

export function getCurrentUser(): User | undefined {
  const { users, currentUserId } = useContactStore.getState();
  return users.find((u) => u.id === currentUserId) || users.find((u) => u.role === 'admin');
}

export function getUsersByPosition(position: Position): User[] {
  const { users } = useContactStore.getState();
  return users
    .filter((u) => u.position === position)
    .sort((a, b) => a.name.localeCompare(b.name));
}
