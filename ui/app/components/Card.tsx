'use client';

import { Item } from '../data';

type VoteType = 'like' | 'pass' | 'kill';

type CardProps = {
  item: Item;
  voteType: VoteType | null;
  onVote: (type: VoteType) => void;
};

const TRANSFORMS: Record<VoteType, string> = {
  like: 'scale(1.02) rotate(8deg) translateX(120%)',
  pass: 'scale(1.02) rotate(-8deg) translateX(-120%)',
  kill: 'scale(0.9) rotate(0deg)',
};

const STAMP_BASE =
  'absolute font-fraunces font-black text-[34px] px-4 py-1.5 border-[5px] rounded-[14px] tracking-[1px] pointer-events-none';

export default function Card({ item, voteType, onVote }: CardProps) {
  return (
    <div
      className="absolute inset-0 rounded-[28px] overflow-hidden shadow-[0_24px_50px_-16px_rgba(160,40,40,0.5)] flex flex-col justify-end touch-none select-none cursor-grab active:cursor-grabbing"
      style={{
        background: `linear-gradient(135deg, ${item.color}dd, ${item.color}99)`,
        transform: voteType ? TRANSFORMS[voteType] : 'scale(1) rotate(0deg)',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: voteType ? 0.6 : 1,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,0.35), transparent 60%)' }}
      />
      <div className="absolute top-[46%] left-0 right-0 -translate-y-1/2 text-center text-[120px] pointer-events-none [filter:drop-shadow(0_14px_22px_rgba(0,0,0,0.22))]">
        {item.emoji}
      </div>

      {voteType === 'like' && <div className={`${STAMP_BASE} top-7 left-[22px] text-like border-like -rotate-[16deg]`}>LIKE</div>}
      {voteType === 'pass' && <div className={`${STAMP_BASE} top-7 right-[22px] text-white border-white rotate-[16deg]`}>PASS</div>}
      {voteType === 'kill' && (
        <div className={`${STAMP_BASE} top-[42%] left-1/2 -translate-x-1/2 -rotate-6 text-white border-white bg-[rgba(20,0,0,0.25)]`}>KILL</div>
      )}

      <div
        className="relative px-6 pt-[22px] pb-[26px] text-white"
        style={{ background: 'linear-gradient(0deg, rgba(40,8,4,0.55), transparent)' }}
      >
        {item.tags.length > 0 && (
          <div className="flex gap-2 mb-2">
            {item.tags.map((tag) => (
              <span key={tag} className="bg-white/25 backdrop-blur-[4px] rounded-full px-3 py-1 text-[12.5px] font-bold">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-fraunces font-black text-[34px] m-0 mb-1.5 leading-none [text-shadow:0_3px_10px_rgba(0,0,0,0.3)]">{item.name}</h2>
        <p className="m-0 text-[15px] font-medium opacity-95">{item.description}</p>
      </div>

      {/* Tap zones: left = pass, center = kill, right = like */}
      <div className="absolute inset-0 flex">
        <button aria-label="Pass" className="flex-1 bg-transparent border-none cursor-pointer" onClick={() => onVote('pass')} />
        <button aria-label="Kill" className="w-1/5 bg-transparent border-none cursor-pointer" onClick={() => onVote('kill')} />
        <button aria-label="Like" className="flex-1 bg-transparent border-none cursor-pointer" onClick={() => onVote('like')} />
      </div>
    </div>
  );
}
