'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../providers';

export default function LobbyPage() {
  const router = useRouter();
  const { room, startVoting, reset } = useGame();

  useEffect(() => {
    if (!room) router.replace('/home');
  }, [room, router]);

  if (!room) return null;

  const onStart = () => {
    startVoting();
    router.push('/vote');
  };

  const onCancel = () => {
    reset();
    router.push('/home');
  };

  return (
    <div className="flex flex-col flex-1 min-h-[560px] animate-rise">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted m-0">Room Code</p>
      </div>
      <button
        className="relative flex gap-2 justify-center bg-transparent border-none cursor-pointer my-1.5 font-fraunces font-black text-[46px] text-brand-dark"
        onClick={() => navigator.clipboard?.writeText(room.code)}
      >
        <span>{room.code}</span>
        <span className="absolute -bottom-[22px] left-0 right-0 not-italic text-xs font-normal text-text-subtle">tap to copy</span>
      </button>
      <div className="flex-1" />
      <div className="flex flex-col gap-2.5 mt-[30px]">
        {room.players.map((p) => (
          <div key={p.id} className="flex items-center gap-3 bg-surface px-[14px] py-3 rounded-[16px] shadow-[0_4px_12px_rgba(120,60,40,0.08)] animate-rise">
            <div className="w-[38px] h-[38px] rounded-xl text-white font-extrabold flex items-center justify-center text-[17px] bg-[#FF6A3D]">
              {p.emoji}
            </div>
            <div className="font-semibold text-base">{p.name}</div>
            {p.id === room.host.id && <span className="text-[11px] text-text-subtle">Host</span>}
          </div>
        ))}
      </div>
      <button
        className="w-full text-white rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] mt-6 border-none"
        onClick={onStart}
      >
        Start Voting
      </button>
      <button
        className="w-full rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-surface text-text shadow-[0_4px_14px_rgba(120,60,40,0.12)] mt-3 border-none"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}
