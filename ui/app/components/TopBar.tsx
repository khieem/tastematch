'use client';

type TopBarProps = {
  title: string;
  onBack: () => void;
};

export default function TopBar({ title, onBack }: TopBarProps) {
  return (
    <div className="flex items-center justify-between font-bold text-lg mb-6">
      <span>{title}</span>
      <button
        className="border-none bg-surface w-[38px] h-[38px] rounded-xl text-xl cursor-pointer shadow-[0_3px_10px_rgba(120,60,40,0.12)] active:scale-[0.92] transition-transform"
        onClick={onBack}
      >
        ←
      </button>
    </div>
  );
}
