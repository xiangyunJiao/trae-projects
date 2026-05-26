import { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import {
  POSITION_LABEL,
  Position,
  ROLE_LABEL,
  Role,
  User,
} from '@/types';
import { useContactStore } from '@/store/contactStore';
import { Plus, RefreshCcw, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'contacts' | 'duty_users' | 'groups';

export default function Contacts() {
  const {
    users,
    dutyGroups,
    addUser,
    updateUser,
    removeUser,
    addDutyGroup,
    updateDutyGroup,
    removeDutyGroup,
    reset,
  } = useContactStore();

  const [tab, setTab] = useState<Tab>('contacts');
  const [userForm, setUserForm] = useState<Partial<User> | null>(null);
  const [groupForm, setGroupForm] = useState<{ id?: string; name: string; memberIds: string[] } | null>(null);

  const contactUsers = useMemo(
    () => users.filter((u) => u.role === 'engineer' || u.role === 'admin'),
    [users],
  );

  function saveUser() {
    if (!userForm) return;
    if (!userForm.name) return;
    if (userForm.id) {
      updateUser(userForm.id, userForm);
    } else {
      addUser({
        name: userForm.name!,
        role: (userForm.role as Role) || 'engineer',
        position: userForm.position as Position | undefined,
        phone: userForm.phone,
      });
    }
    setUserForm(null);
  }

  function saveGroup() {
    if (!groupForm) return;
    if (groupForm.id) {
      updateDutyGroup(groupForm.id, { name: groupForm.name, memberIds: groupForm.memberIds });
    } else {
      addDutyGroup({
        name: groupForm.name,
        category: 'operation',
        memberIds: groupForm.memberIds,
      });
    }
    setGroupForm(null);
  }

  return (
    <Layout title="联系人管理">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TabButton active={tab === 'contacts'} onClick={() => setTab('contacts')}>
            联系人
          </TabButton>
          <TabButton active={tab === 'duty_users'} onClick={() => setTab('duty_users')}>
            值班人员
          </TabButton>
          <TabButton active={tab === 'groups'} onClick={() => setTab('groups')}>
            值班组
          </TabButton>
          <div className="flex-1" />
          <button
            onClick={() => {
              if (confirm('确定要重置所有数据为初始状态？')) reset();
            }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            <RefreshCcw className="h-3 w-3" />
            重置数据
          </button>
          {tab === 'contacts' && (
            <button
              onClick={() =>
                setUserForm({ name: '', role: 'engineer', position: 'frontend', phone: '' })
              }
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
            >
              <Plus className="h-3 w-3" />
              添加联系人
            </button>
          )}
          {tab === 'duty_users' && (
            <button
              onClick={() =>
                setUserForm({ name: '', role: 'engineer', position: 'frontend', phone: '' })
              }
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
            >
              <UserPlus className="h-3 w-3" />
              添加值班人
            </button>
          )}
          {tab === 'groups' && (
            <button
              onClick={() => setGroupForm({ name: '', memberIds: [] })}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700"
            >
              <Plus className="h-3 w-3" />
              添加值班组
            </button>
          )}
        </div>

        {tab === 'contacts' && (
          <Table
            columns={[
              { key: 'name', label: '姓名' },
              { key: 'role', label: '角色' },
              { key: 'position', label: '岗位' },
              { key: 'phone', label: '电话' },
            ]}
            rows={contactUsers}
            onEdit={(u) => setUserForm({ ...u })}
            onDelete={(u) => {
              if (confirm(`确定删除 ${u.name}？`)) removeUser(u.id);
            }}
            render={(u) => (
              <>
                <td className="px-4 py-2 text-sm text-slate-900">{u.name}</td>
                <td className="px-4 py-2 text-sm text-slate-600">{ROLE_LABEL[u.role]}</td>
                <td className="px-4 py-2 text-sm text-slate-600">
                  {u.position ? POSITION_LABEL[u.position] : '--'}
                </td>
                <td className="px-4 py-2 text-sm text-slate-600">{u.phone || '--'}</td>
              </>
            )}
          />
        )}

        {tab === 'duty_users' && (
          <DutyUsersByPosition
            users={users.filter((u) => u.role === 'engineer')}
            onAdd={(pos) =>
              setUserForm({ name: '', role: 'engineer', position: pos, phone: '' })
            }
            onEdit={(u) => setUserForm({ ...u })}
            onDelete={(u) => {
              if (confirm(`确定删除 ${u.name}？`)) removeUser(u.id);
            }}
          />
        )}

        {tab === 'groups' && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {dutyGroups.map((g) => {
              const members = users.filter((u) => g.memberIds.includes(u.id));
              return (
                <div key={g.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{g.name}</div>
                      <div className="text-xs text-slate-400">成员 {members.length} 人</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setGroupForm({ id: g.id, name: g.name, memberIds: g.memberIds })
                        }
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`确定删除值班组 ${g.name}？`)) removeDutyGroup(g.id);
                        }}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {members.map((m) => (
                      <span
                        key={m.id}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                      >
                        {m.name}
                      </span>
                    ))}
                    {members.length === 0 && (
                      <span className="text-[11px] text-slate-400">暂无成员</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={!!userForm}
        title={userForm?.id ? '编辑联系人' : '添加联系人'}
        onClose={() => setUserForm(null)}
        footer={
          <>
            <button
              onClick={() => setUserForm(null)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              onClick={saveUser}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
            >
              保存
            </button>
          </>
        }
      >
        {userForm && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600">姓名</label>
              <input
                value={userForm.name || ''}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-slate-600">角色</label>
                <select
                  value={userForm.role || 'engineer'}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value as Role })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  <option value="engineer">技术</option>
                  <option value="operator">运营</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-600">岗位</label>
                <select
                  value={userForm.position || 'frontend'}
                  onChange={(e) =>
                    setUserForm({ ...userForm, position: e.target.value as Position })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
                  disabled={userForm.role !== 'engineer'}
                >
                  <option value="frontend">前端</option>
                  <option value="android">安卓</option>
                  <option value="ios">iOS</option>
                  <option value="server">服务端</option>
                  <option value="tester">测试</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">电话</label>
              <input
                value={userForm.phone || ''}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!groupForm}
        title={groupForm?.id ? '编辑值班组' : '添加值班组'}
        onClose={() => setGroupForm(null)}
        footer={
          <>
            <button
              onClick={() => setGroupForm(null)}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              onClick={saveGroup}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
            >
              保存
            </button>
          </>
        }
      >
        {groupForm && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600">值班组名称</label>
              <input
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">
                选择成员（{groupForm.memberIds.length}人）
              </label>
              <div className="max-h-64 overflow-y-auto rounded-md border border-slate-200 p-2">
                {users.map((u) => {
                  const checked = groupForm.memberIds.includes(u.id);
                  return (
                    <label
                      key={u.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGroupForm({
                              ...groupForm,
                              memberIds: [...groupForm.memberIds, u.id],
                            });
                          } else {
                            setGroupForm({
                              ...groupForm,
                              memberIds: groupForm.memberIds.filter((x) => x !== u.id),
                            });
                          }
                        }}
                      />
                      <span>{u.name}</span>
                      {u.position && (
                        <span className="text-xs text-slate-400">
                          {POSITION_LABEL[u.position]}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md px-3 py-1.5 text-xs transition',
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-slate-600 hover:bg-slate-100',
      )}
    >
      {children}
    </button>
  );
}

function Table({
  columns,
  rows,
  onEdit,
  onDelete,
  render,
}: {
  columns: { key: string; label: string }[];
  rows: User[];
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
  render: (u: User) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        暂无数据
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 font-medium">
                {c.label}
              </th>
            ))}
            <th className="px-4 py-2 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-b border-slate-100 last:border-0">
              {render(u)}
              <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-1">
                  <button
                    onClick={() => onEdit(u)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => onDelete(u)}
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DutyUsersByPosition({
  users,
  onAdd,
  onEdit,
  onDelete,
}: {
  users: User[];
  onAdd: (pos: Position) => void;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}) {
  const positions: Position[] = ['android', 'ios', 'frontend', 'server', 'tester'];
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {positions.map((p) => {
        const list = users.filter((u) => u.position === p).sort((a, b) => a.name.localeCompare(b.name));
        return (
          <div key={p} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {POSITION_LABEL[p]}
                </div>
                <div className="text-xs text-slate-400">共 {list.length} 人</div>
              </div>
              <button
                onClick={() => onAdd(p)}
                className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-100"
              >
                <Plus className="h-3 w-3" />
                添加
              </button>
            </div>
            <ul className="mt-3 space-y-1">
              {list.map((u, i) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600">
                      {i + 1}
                    </span>
                    <span className="text-slate-900">{u.name}</span>
                    <span className="text-xs text-slate-400">{u.phone}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(u)}
                      className="rounded px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-200"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      className="rounded px-2 py-0.5 text-[11px] text-red-500 hover:bg-red-50"
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
              {list.length === 0 && (
                <li className="rounded px-2 py-1.5 text-xs text-slate-400">暂无人员</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
