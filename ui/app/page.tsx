'use client';

import { useState } from 'react';
import { ITEMS } from './data';
import { GameState, Player, Vote } from './types';
import Home from './screens/Home';
import CreateRoom from './screens/Create';
import JoinRoom from './screens/Join';
import Lobby from './screens/Lobby';
import Swipe from './screens/Swipe';
import Results from './screens/Results';

type Screen = 'home' | 'create' | 'join' | 'lobby' | 'vote' | 'result';

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

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [room, setRoom] = useState<GameState | null>(null);
  const [myVotes, setMyVotes] = useState<Vote>({});

  const goHome = () => {
    setScreen('home');
    setName('');
    setCode('');
    setError('');
    setRoom(null);
    setMyVotes({});
  };

  const handleMake = () => {
    setRoom(makeRoom(genCode(), name));
    setMyVotes({});
    setError('');
    setScreen('lobby');
  };

  const handleJoin = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      setError('Mã phòng gồm 4 ký tự.');
      return;
    }
    // Demo 1 máy: không có server thật nên dựng phòng cục bộ theo mã đã nhập.
    setRoom(makeRoom(c, name));
    setMyVotes({});
    setError('');
    setScreen('lobby');
  };

  const handleStart = () => {
    setMyVotes({});
    setScreen('vote');
  };

  const handleVote = (itemId: string, type: 'like' | 'pass' | 'kill') => {
    const next: Vote = { ...myVotes, [itemId]: type };
    setMyVotes(next);
    if (room && Object.keys(next).length >= room.currentDeck.length) {
      setScreen('result');
    }
  };

  const handleNewRound = () => {
    setMyVotes({});
    setRoom((prev) => (prev ? { ...prev, round: prev.round + 1 } : prev));
    setScreen('vote');
  };

  switch (screen) {
    case 'create':
      return (
        <CreateRoom
          name={name}
          setName={setName}
          error={error}
          setError={setError}
          onMake={handleMake}
          onBack={goHome}
        />
      );
    case 'join':
      return (
        <JoinRoom
          name={name}
          setName={setName}
          code={code}
          setCode={setCode}
          error={error}
          setError={setError}
          onJoin={handleJoin}
          onBack={goHome}
        />
      );
    case 'lobby':
      return <Lobby room={room ?? undefined} isHost onStart={handleStart} onBack={goHome} />;
    case 'vote':
      return <Swipe room={room ?? undefined} votes={myVotes} onVote={handleVote} />;
    case 'result':
      return (
        <Results
          room={room ?? undefined}
          votes={room ? { [room.host.id]: myVotes } : {}}
          myVotes={myVotes}
          isHost
          onNewRound={handleNewRound}
          onHome={goHome}
        />
      );
    default:
      return (
        <Home
          onCreate={() => {
            setName('');
            setError('');
            setScreen('create');
          }}
          onJoin={() => {
            setName('');
            setCode('');
            setError('');
            setScreen('join');
          }}
        />
      );
  }
}
