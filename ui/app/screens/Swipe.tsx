'use client';

import { GameState, Vote } from '../types';
import Card from '../components/Card';

type SwipeProps = {
  room?: GameState;
  uid?: string;
  votes?: Vote;
  onVote?: (itemId: string, type: 'like' | 'pass' | 'kill') => void;
};

export default function Swipe({ room, votes = {}, onVote = () => {} }: SwipeProps) {
  if (!room) {
    return (
      <div className="scr justify-center items-center text-center">
        <p>No active voting session. Start a room first.</p>
      </div>
    );
  }

  const deck = room.currentDeck;
  const currentIndex = Object.keys(votes).length;
  const currentItem = deck[currentIndex];
  const progress = (currentIndex / deck.length) * 100;

  if (!currentItem) {
    return (
      <div className="scr justify-center items-center text-center">
        <p>All done! Waiting for results...</p>
      </div>
    );
  }

  return (
    <div className="scr justify-start">
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

      <div className="stack relative flex-1 min-h-[380px]">
        <Card
          key={currentItem.id}
          item={currentItem}
          onLike={() => onVote(currentItem.id, 'like')}
          onPass={() => onVote(currentItem.id, 'pass')}
          onKill={() => onVote(currentItem.id, 'kill')}
        />
      </div>

      <div className="flex justify-center items-center gap-4 mt-[18px]">
        <button
          className="border-none rounded-full bg-surface cursor-pointer flex items-center justify-center transition-transform active:scale-[0.88] w-[60px] h-[60px] text-2xl text-brand-dark shadow-[0_8px_18px_-6px_rgba(120,60,40,0.35)] disabled:opacity-40 disabled:cursor-default"
          onClick={() => onVote(currentItem.id, 'pass')}
        >
          ✕
        </button>
        <button
          className="border-none rounded-full bg-surface cursor-pointer flex items-center justify-center transition-transform active:scale-[0.88] w-[60px] h-[60px] text-[26px] text-like shadow-[0_8px_18px_-6px_rgba(120,60,40,0.35)] disabled:opacity-40 disabled:cursor-default"
          onClick={() => onVote(currentItem.id, 'like')}
        >
          ♥
        </button>
        <button
          className="border-none rounded-full bg-surface cursor-pointer flex items-center justify-center transition-transform active:scale-[0.88] w-[52px] h-[52px] text-[22px] text-text shadow-[0_8px_18px_-6px_rgba(120,60,40,0.35)] disabled:opacity-40 disabled:cursor-default"
          onClick={() => onVote(currentItem.id, 'kill')}
        >
          💀
        </button>
      </div>

      <p className="text-center text-xs text-text-subtle mt-[14px]">Tap hearts or use buttons to vote</p>
    </div>
  );
}
