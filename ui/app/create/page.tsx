'use client';

import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import { useGame } from '../providers';

export default function CreatePage() {
  const router = useRouter();
  const { name, setName, error, setError, createRoom } = useGame();

  const onMake = () => {
    createRoom();
    router.push('/lobby');
  };

  return (
    <div className="flex flex-col flex-1 min-h-[560px] animate-rise">
      <TopBar title="Create Room" onBack={() => router.push('/')} />
      <label className="font-semibold text-xs uppercase tracking-wide text-text-muted mb-2">Your Name</label>
      <input
        className="w-full border-2 border-border rounded-[16px] px-4 py-[15px] text-[17px] font-semibold bg-surface outline-none focus:border-brand transition-[border] text-text placeholder:text-[#c0a392] placeholder:font-medium"
        value={name}
        maxLength={16}
        placeholder="E.g., Sarah"
        onChange={(e) => setName(e.target.value)}
        onFocus={() => setError('')}
      />
      {error && <div className="text-kill font-semibold text-sm mt-[14px]">{error}</div>}
      <div className="flex-1" />
      <button
        className="w-full text-white rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] border-none"
        onClick={onMake}
      >
        Create
      </button>
    </div>
  );
}
