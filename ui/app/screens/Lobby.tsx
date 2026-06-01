'use client';

import { GameState } from '../types';

type LobbyProps = {
  room?: GameState;
  isHost?: boolean;
  onStart?: () => void;
  onBack?: () => void;
};

export default function Lobby({ room, isHost = false, onStart = () => {}, onBack = () => {} }: LobbyProps) {
  if (!room) {
    return (
      <div className="scr justify-center items-center text-center">
        <p>No active room. Return home to start.</p>
        <button
          className="w-full text-white rounded-[18px] font-outfit font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] border-none"
          onClick={onBack}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="scr">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted m-0">Room Code</p>
      </div>
      <button
        className="flex gap-2 justify-center bg-none border-none cursor-pointer mx-0 my-[6px_4px] relative font-fraunces font-black text-[46px] text-brand-dark"
        onClick={() => navigator.clipboard?.writeText(room.code)}
      >
        <span>{room.code}</span>
        <div className="copy-tag">tap to copy</div>
      </button>
      <div className="flex-1" />
      <div className="flex flex-col gap-[10px] mt-[30px]">
        {room.players.map((p) => (
          <div key={p.id} className="flex items-center gap-3 bg-surface p-[12px_14px] rounded-[16px] shadow-[0_4px_12px_rgba(120,60,40,0.08)] animate-[rise_0.4s_both]">
            <div
              className="w-[38px] h-[38px] rounded-xl text-white font-extrabold flex items-center justify-center text-[17px]"
              style={{ background: '#FF6A3D' }}
            >
              {p.emoji}
            </div>
            <div className="font-semibold text-base">{p.name}</div>
            {p.id === room.host.id && <span className="text-[11px] text-text-subtle">Host</span>}
          </div>
        ))}
      </div>
      {isHost && (
        <button
          className="w-full text-white rounded-[18px] font-outfit font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] mt-6 border-none"
          onClick={onStart}
        >
          Start Voting
        </button>
      )}
      <button
        className="w-full rounded-[18px] font-outfit font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-surface text-text shadow-[0_4px_14px_rgba(120,60,40,0.12)] mt-3 border-none"
        onClick={onBack}
      >
        Cancel
      </button>
    </div>
  );
}
