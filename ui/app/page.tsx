'use client';

import { useRouter } from 'next/navigation';
import { useGame } from './providers';

export default function Home() {
  const router = useRouter();
  const { setName, setCode, setError } = useGame();

  const goCreate = () => {
    setName('');
    setError('');
    router.push('/create');
  };

  const goJoin = () => {
    setName('');
    setCode('');
    setError('');
    router.push('/join');
  };

  return (
    <div className="flex flex-col flex-1 min-h-[560px] animate-rise justify-center items-center text-center">
      <div className="flex gap-1.5 text-[46px] mb-1.5">
        <span className="inline-block animate-bob [filter:drop-shadow(0_8px_14px_rgba(200,40,40,0.25))]" style={{ animationDelay: '0s' }}>🍔</span>
        <span className="inline-block animate-bob [filter:drop-shadow(0_8px_14px_rgba(200,40,40,0.25))]" style={{ animationDelay: '.3s' }}>🎬</span>
        <span className="inline-block animate-bob [filter:drop-shadow(0_8px_14px_rgba(200,40,40,0.25))]" style={{ animationDelay: '.6s' }}>✈️</span>
      </div>
      <h1 className="font-fraunces font-black text-[54px] leading-[0.95] tracking-[-1.5px] mt-1.5 mb-0.5">
        Taste<span className="text-[#FF4D2E]">Match</span>
      </h1>
      <p className="font-fraunces font-semibold text-[21px] italic text-[#C0265B] m-0 mb-2">Don&apos;t think. Just swipe.</p>
      <p className="text-[15px] text-[#7a5a4c] max-w-[300px] mx-auto mt-0 mb-[26px] leading-[1.4]">
        Your group decides in 2 minutes. No arguments. Everyone gets a say.
      </p>
      <button
        onClick={goCreate}
        className="block w-full text-center text-white rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] border-none"
      >
        Create Room
      </button>
      <button
        onClick={goJoin}
        className="block w-full text-center rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-surface text-text shadow-[0_4px_14px_rgba(120,60,40,0.12)] mt-3 border-none"
      >
        Join Room
      </button>
      <p className="text-text-subtle text-xs tracking-wide mt-[18px]">Private votes · Equal weight · Everyone decides</p>
    </div>
  );
}
