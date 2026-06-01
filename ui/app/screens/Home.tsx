'use client';

type HomeProps = {
  onCreate: () => void;
  onJoin: () => void;
};

export default function Home({ onCreate, onJoin }: HomeProps) {
  return (
    <div className="scr justify-center items-center text-center">
      <div className="hero-emojis">
        <span style={{ animationDelay: '0s' }}>🍔</span>
        <span style={{ animationDelay: '.3s' }}>🎬</span>
        <span style={{ animationDelay: '.6s' }}>✈️</span>
      </div>
      <h1 className="wordmark">
        Taste<span>Match</span>
      </h1>
      <p className="tagline">Don't think. Just swipe.</p>
      <p className="subtag">Your group decides in 2 minutes. No arguments. Everyone gets a say.</p>
      <button
        onClick={onCreate}
        className="block w-full text-center text-white rounded-[18px] font-outfit font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-gradient-to-r from-brand to-brand-dark shadow-[0_12px_26px_-8px_rgba(255,46,99,0.6)] border-none"
      >
        Create Room
      </button>
      <button
        onClick={onJoin}
        className="block w-full text-center rounded-[18px] font-outfit font-bold cursor-pointer transition-transform active:scale-[0.97] py-4 text-[17px] bg-surface text-text shadow-[0_4px_14px_rgba(120,60,40,0.12)] mt-3 border-none"
      >
        Join Room
      </button>
      <p className="text-text-subtle text-xs tracking-wide mt-[18px]">Private votes · Equal weight · Everyone decides</p>
    </div>
  );
}
