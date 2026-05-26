import { useEffect, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface Props {
  open: boolean;
  issueTitle: string;
  user: User;
  onClose: () => void;
}

export default function CallModal({ open, issueTitle, user, onClose }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSeconds(0);
    setConnected(false);
    const t1 = setTimeout(() => setConnected(true), 1500);
    return () => clearTimeout(t1);
  }, [open, user.id, issueTitle]);

  useEffect(() => {
    if (!open || !connected) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [open, connected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-2xl">
        <div className="text-center">
          <div className="text-xs text-slate-400">
            {connected ? '通话中' : '正在呼叫...'}
          </div>
          <div className="mt-3 flex flex-col items-center">
            <div
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold',
                connected ? 'bg-emerald-500' : 'animate-pulse bg-indigo-500',
              )}
            >
              <Phone className="h-8 w-8" />
            </div>
            <div className="mt-3 text-lg font-semibold">{user.name}</div>
            <div className="mt-1 text-sm text-slate-300">{user.phone || '--'}</div>
          </div>
          <div className="mt-5 rounded-md bg-slate-700/60 p-3 text-xs text-slate-200">
            <div className="text-slate-400">紧急问题</div>
            <div className="mt-1 line-clamp-2">{issueTitle}</div>
          </div>
          {connected && (
            <div className="mt-3 text-xs text-emerald-400">
              已通知值班人，通话时长 {seconds}s
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2 text-sm font-medium hover:bg-red-600"
          >
            <PhoneOff className="h-4 w-4" />
            挂断
          </button>
        </div>
      </div>
    </div>
  );
}
