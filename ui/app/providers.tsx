'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ITEMS } from './data';
import { GameState, Player, Vote } from './types';

const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const AVATARS = ['🦊', '🐼', '🐧', '🦄', '🐸', '🐯', '🦁', '🐨'];

function randId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function genCode(): string {
  let c = '';
  for (let i = 0; i < 4; i++) c += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  return c;
}

function makeRoom(code: string, hostName: string): GameState {
  const host: Player = {
    id: randId(),
    name: hostName.trim().slice(0, 16) || 'You',
    emoji: AVATARS[Math.floor(Math.random() * AVATARS.length)],
  };
  return {
    id: randId(),
    code,
    host,
    players: [host],
    currentDeck: ITEMS,
    items: ITEMS,
    phase: 'lobby',
    round: 1,
  };
}

type GameContextValue = {
  name: string;
  setName: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  room: GameState | null;
  myVotes: Vote;
  /** Build a fresh room hosted by the current name. */
  createRoom: () => void;
  /** Validate the code and join; returns false (with an error set) if invalid. */
  joinRoom: () => boolean;
  /** Clear votes before a voting round. */
  startVoting: () => void;
  /** Record a vote; returns true when the deck is complete. */
  castVote: (itemId: string, type: 'like' | 'pass' | 'kill') => boolean;
  /** Reset votes and bump the round counter. */
  newRound: () => void;
  /** Wipe all state (back to home). */
  reset: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [room, setRoom] = useState<GameState | null>(null);
  const [myVotes, setMyVotes] = useState<Vote>({});

  const createRoom = () => {
    setRoom(makeRoom(genCode(), name));
    setMyVotes({});
    setError('');
  };

  const joinRoom = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setError('Mã phòng gồm 4 ký tự.');
      return false;
    }
    // Demo 1 máy: không có server thật nên dựng phòng cục bộ theo mã đã nhập.
    setRoom(makeRoom(c, name));
    setMyVotes({});
    setError('');
    return true;
  };

  const startVoting = () => setMyVotes({});

  const castVote = (itemId: string, type: 'like' | 'pass' | 'kill') => {
    const next: Vote = { ...myVotes, [itemId]: type };
    setMyVotes(next);
    return !!room && Object.keys(next).length >= room.currentDeck.length;
  };

  const newRound = () => {
    setMyVotes({});
    setRoom((prev) => (prev ? { ...prev, round: prev.round + 1 } : prev));
  };

  const reset = () => {
    setName('');
    setCode('');
    setError('');
    setRoom(null);
    setMyVotes({});
  };

  return (
    <GameContext.Provider
      value={{
        name,
        setName,
        code,
        setCode,
        error,
        setError,
        room,
        myVotes,
        createRoom,
        joinRoom,
        startVoting,
        castVote,
        newRound,
        reset,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
