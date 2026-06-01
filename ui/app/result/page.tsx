'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../providers';

export default function ResultPage() {
  const router = useRouter();
  const { room, myVotes, newRound, reset } = useGame();

  useEffect(() => {
    if (!room) router.replace('/');
  }, [room, router]);

  if (!room) return null;

  const votes = { [room.host.id]: myVotes };

  const itemScores = room.currentDeck.map((item) => {
    let likes = 0;
    let kills = 0;
    Object.values(votes).forEach((playerVotes) => {
      if (playerVotes[item.id] === 'like') likes++;
      if (playerVotes[item.id] === 'kill') kills++;
    });
    return { item, likes, kills };
  });

  const ranked = [...itemScores].sort((a, b) => b.likes - a.likes);
  const killed = itemScores.filter((s) => s.kills > s.likes);
  const topScore = ranked[0];
  const winner = topScore && topScore.likes > 0 ? topScore : null;

  const onNewRound = () => {
    newRound();
    router.push('/vote');
  };

  const onHome = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="flex flex-col flex-1 min-h-[560px] animate-rise justify-start">
      <div className="text-center mb-[18px]">
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Results</p>
        <h2 className="font-fraunces font-black text-[30px] mt-1.5 leading-tight">
          {winner ? 'The Winner Is...' : 'No clear winner'}
        </h2>
      </div>

      {winner ? (
        <div
          className="relative rounded-[26px] px-6 pt-[30px] pb-[26px] text-center text-white overflow-hidden shadow-[0_22px_44px_-16px_rgba(160,40,40,0.55)]"
          style={{ background: `linear-gradient(135deg, ${winner.item.color}dd, ${winner.item.color}99)` }}
        >
          <div className="text-[88px] [filter:drop-shadow(0_12px_18px_rgba(0,0,0,0.25))]">{winner.item.emoji}</div>
          <h3 className="font-fraunces font-black text-[32px] my-1.5 [text-shadow:0_3px_10px_rgba(0,0,0,0.3)]">{winner.item.name}</h3>
          <p className="font-semibold text-sm opacity-95">♥ {winner.likes} votes</p>
        </div>
      ) : (
        <p className="text-center text-text-muted">Nobody liked anything — try another round!</p>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {ranked.map((score, index) => (
          <div key={score.item.id} className="flex items-center gap-3 bg-surface rounded-[14px] px-[14px] py-[11px] shadow-[0_3px_10px_rgba(120,60,40,0.07)]">
            <div className="font-fraunces font-black text-[#d8b6a6] w-[22px]">#{index + 1}</div>
            <div className="text-2xl">{score.item.emoji}</div>
            <div className="font-semibold flex-1">{score.item.name}</div>
            <div className="font-bold text-sm text-brand-dark">♥ {score.likes}</div>
          </div>
        ))}
      </div>

      {killed.length > 0 && (
        <div className="mt-[18px]">
          <p className="font-bold text-[13.5px] text-text-muted m-0 mb-2">Rejected:</p>
          <div className="flex flex-wrap gap-2">
            {killed.map((score) => (
              <div key={score.item.id} className="bg-brand-bg text-text-subtle rounded-full px-3 py-[7px] text-[13.5px] font-semibold line-through">
                {score.item.emoji} {score.item.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="w-full text-white rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] mt-6 border-none"
        onClick={onNewRound}
      >
        New Round
      </button>
      <button
        className="w-full rounded-[18px] font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-surface text-text shadow-[0_4px_14px_rgba(120,60,40,0.12)] mt-3 border-none"
        onClick={onHome}
      >
        Go Home
      </button>
    </div>
  );
}
