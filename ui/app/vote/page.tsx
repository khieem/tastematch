'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../providers';
import Card from '../components/Card';

type VoteType = 'like' | 'pass' | 'kill';

export default function VotePage() {
  const router = useRouter();
  const { room, myVotes, castVote } = useGame();
  const [pending, setPending] = useState<VoteType | null>(null);

  useEffect(() => {
    if (!room) router.replace('/home');
  }, [room, router]);

  if (!room) return null;

  const deck = room.currentDeck;
  const currentIndex = Object.keys(myVotes).length;
  const currentItem = deck[currentIndex];
  const progress = (currentIndex / deck.length) * 100;

  const vote = (type: VoteType) => {
    if (pending || !currentItem) return; // ignore taps mid-animation
    setPending(type);
    setTimeout(() => {
      setPending(null);
      if (castVote(currentItem.id, type)) router.push('/result');
    }, 200);
  };

  if (!currentItem) {
    return (
      <div className="flex flex-col flex-1 min-h-[560px] animate-rise justify-center items-center text-center">
        <p>All done! Waiting for results...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-[560px] animate-rise justify-start">
      <div className="flex items-center gap-3 mb-2 font-bold text-sm text-text-muted">
        <span>{currentIndex + 1}</span>
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span>{deck.length}</span>
      </div>

      <div className="relative flex-1 min-h-[380px]">
        <Card key={currentItem.id} item={currentItem} voteType={pending} onVote={vote} />
      </div>

      <div className="flex justify-center items-center gap-4 mt-[18px]">
        <button
          className="border-none rounded-full bg-surface cursor-pointer flex items-center justify-center transition-transform active:scale-[0.88] w-[60px] h-[60px] text-2xl text-brand-dark shadow-[0_8px_18px_-6px_rgba(120,60,40,0.35)] disabled:opacity-40"
          disabled={!!pending}
          onClick={() => vote('pass')}
        >
          ✕
        </button>
        <button
          className="border-none rounded-full bg-surface cursor-pointer flex items-center justify-center transition-transform active:scale-[0.88] w-[60px] h-[60px] text-[26px] text-like shadow-[0_8px_18px_-6px_rgba(120,60,40,0.35)] disabled:opacity-40"
          disabled={!!pending}
          onClick={() => vote('like')}
        >
          ♥
        </button>
        <button
          className="border-none rounded-full bg-surface cursor-pointer flex items-center justify-center transition-transform active:scale-[0.88] w-[52px] h-[52px] text-[22px] text-text shadow-[0_8px_18px_-6px_rgba(120,60,40,0.35)] disabled:opacity-40"
          disabled={!!pending}
          onClick={() => vote('kill')}
        >
          💀
        </button>
      </div>

      <p className="text-center text-xs text-text-subtle mt-[14px]">Tap the card or use the buttons to vote</p>
    </div>
  );
}
