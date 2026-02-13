import { useState } from 'react'
import type { OperationType } from '@/types'
import { OperationPicker } from '@/components/worksheet/operation-picker'
import { DifficultySlider } from '@/components/worksheet/difficulty-slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Swords } from 'lucide-react'

export interface GameConfig {
  operationType: OperationType
  difficulty: number
  maxDigits: number
  rounds: number
  answerTime: number
  team1Name: string
  team2Name: string
}

interface GameSetupProps {
  onStart: (config: GameConfig) => void
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [operationType, setOperationType] = useState<OperationType>('addition')
  const [difficulty, setDifficulty] = useState(2)
  const [maxDigits, setMaxDigits] = useState(2)
  const [rounds, setRounds] = useState(7)
  const [answerTime, setAnswerTime] = useState(30)
  const [team1Name, setTeam1Name] = useState('Team Blue')
  const [team2Name, setTeam2Name] = useState('Team Red')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Swords className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Tug of War</h1>
        <p className="text-muted-foreground">
          Two teams battle it out with math! Answer fast for more power.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <OperationPicker value={operationType} onChange={setOperationType} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DifficultySlider
            value={difficulty}
            onChange={setDifficulty}
            isFractions={operationType === 'fractions'}
          />

          {operationType !== 'fractions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Max Digits</Label>
                <span className="text-sm font-medium text-primary">{maxDigits}</span>
              </div>
              <Slider
                value={[maxDigits]}
                onValueChange={([v]) => setMaxDigits(v!)}
                min={1}
                max={5}
                step={1}
              />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Rounds</Label>
              <span className="text-sm font-medium text-primary">Best of {rounds}</span>
            </div>
            <div className="flex gap-2">
              {[5, 7, 10].map((r) => (
                <Button
                  key={r}
                  variant={rounds === r ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRounds(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Answer Time</Label>
              <span className="text-sm font-medium text-primary">{answerTime}s per turn</span>
            </div>
            <div className="flex gap-2">
              {[10, 15, 20, 30, 60].map((t) => (
                <Button
                  key={t}
                  variant={answerTime === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAnswerTime(t)}
                >
                  {t}s
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-blue-600">Team 1</Label>
              <Input
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder="Team Blue"
                className="border-blue-300 focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-red-600">Team 2</Label>
              <Input
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder="Team Red"
                className="border-red-300 focus-visible:ring-red-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full text-lg h-14"
        onClick={() => onStart({
          operationType,
          difficulty,
          maxDigits,
          rounds,
          answerTime,
          team1Name: team1Name.trim() || 'Team Blue',
          team2Name: team2Name.trim() || 'Team Red',
        })}
      >
        <Swords className="h-5 w-5 mr-2" />
        Start Game!
      </Button>
    </div>
  )
}
