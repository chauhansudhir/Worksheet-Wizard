import { useState } from 'react'
import { GameSetup, type GameConfig } from '@/components/games/game-setup'
import { TugOfWarGame } from '@/components/games/tug-of-war-game'

type GamePhase = 'setup' | 'playing'

export default function GamesPage() {
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<GameConfig | null>(null)

  const handleStart = (gameConfig: GameConfig) => {
    setConfig(gameConfig)
    setPhase('playing')
  }

  const handlePlayAgain = () => {
    setPhase('setup')
    setConfig(null)
  }

  if (phase === 'playing' && config) {
    return (
      <div className="max-w-3xl mx-auto">
        <TugOfWarGame config={config} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  return <GameSetup onStart={handleStart} />
}
