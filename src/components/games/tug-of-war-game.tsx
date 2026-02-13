import { useState, useCallback, useRef, useEffect } from 'react'
import type { MathProblem } from '@/types'
import { generateProblems } from '@/lib/math-engine'
import { checkAnswer, getCorrectAnswerStr } from '@/components/grading/grade-item'
import { TugOfWarRope } from './tug-of-war-rope'
import { GameTimer } from './game-timer'
import { GameProblem } from './game-problem'
import { GameScoreboard } from './game-scoreboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Trophy, RotateCcw, Check, X } from 'lucide-react'
import type { GameConfig } from './game-setup'

const RESULT_DISPLAY_MS = 1500
const WIN_THRESHOLD = 500

type TurnState = 'team1-turn' | 'team2-turn' | 'showing-result' | 'game-over'

interface TeamState {
  score: number
  streak: number
  lastPower: number
}

interface TugOfWarGameProps {
  config: GameConfig
  onPlayAgain: () => void
}

export function TugOfWarGame({ config, onPlayAgain }: TugOfWarGameProps) {
  const [turnState, setTurnState] = useState<TurnState>('team1-turn')
  const [team1, setTeam1] = useState<TeamState>({ score: 0, streak: 0, lastPower: 0 })
  const [team2, setTeam2] = useState<TeamState>({ score: 0, streak: 0, lastPower: 0 })
  const [ropePosition, setRopePosition] = useState(0)
  const [round, setRound] = useState(1)
  const [problem, setProblem] = useState<MathProblem>(() => generateNewProblem())
  const [answer, setAnswer] = useState('')
  const [timerKey, setTimerKey] = useState(0)
  const [lastResult, setLastResult] = useState<{
    correct: boolean
    power: number
    team: 1 | 2
    correctAnswer: string
  } | null>(null)

  // Track the time remaining at submission
  const timeRemainingRef = useRef(config.answerTime)
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function generateNewProblem(): MathProblem {
    const problems = generateProblems({
      operationType: config.operationType,
      difficulty: config.difficulty,
      maxDigits: config.maxDigits,
      problemCount: 1,
    })
    return problems[0]!
  }

  const currentTeam: 1 | 2 = turnState === 'team1-turn' ? 1 : turnState === 'team2-turn' ? 2 : (lastResult?.team ?? 1)

  const processAnswer = useCallback((userAnswer: string, teamNum: 1 | 2) => {
    const correct = userAnswer.trim() ? checkAnswer(problem, userAnswer) : false
    const timeLeft = timeRemainingRef.current

    // Calculate base power
    const basePower = correct ? Math.round((timeLeft / config.answerTime) * 100) : 0

    // Get current team state and streak
    const teamState = teamNum === 1 ? team1 : team2
    const newStreak = correct ? teamState.streak + 1 : 0

    // Apply streak bonus
    let multiplier = 1
    if (newStreak >= 3) multiplier = 2
    else if (newStreak >= 2) multiplier = 1.5
    const power = Math.round(basePower * multiplier)

    // Update team state
    const newTeamState = { score: teamState.score + power, streak: newStreak, lastPower: power }
    if (teamNum === 1) {
      setTeam1(newTeamState)
    } else {
      setTeam2(newTeamState)
    }

    // Update rope position — team1 correct pushes right (positive), team2 correct pushes left (negative)
    // Actually per plan: team1 correct shifts negative, team2 correct shifts positive
    // Let's think: team1 is on the left (blue). If team1 wins, rope moves toward team2 (right/positive means team2's side)
    // Wait - "team1 correct shifts negative" means toward blue's win zone
    // Let's use: negative = team1 winning, positive = team2 winning
    const positionDelta = teamNum === 1 ? -power : power
    const newPosition = ropePosition + positionDelta
    setRopePosition(newPosition)

    // Show result
    setLastResult({
      correct,
      power,
      team: teamNum,
      correctAnswer: getCorrectAnswerStr(problem),
    })
    setTurnState('showing-result')

    // Check win conditions
    const isGameOver = Math.abs(newPosition) >= WIN_THRESHOLD || round >= config.rounds

    resultTimeoutRef.current = setTimeout(() => {
      if (isGameOver) {
        setTurnState('game-over')
      } else {
        // Next turn — alternate teams
        const nextTurn = teamNum === 1 ? 'team2-turn' : 'team1-turn'
        const nextRound = teamNum === 2 ? round + 1 : round // Increment round after team2's turn
        setRound(nextRound)
        setTurnState(nextTurn)
        setProblem(generateNewProblem())
        setAnswer('')
        setTimerKey((k) => k + 1)
        timeRemainingRef.current = config.answerTime
      }
    }, RESULT_DISPLAY_MS)
  }, [problem, team1, team2, ropePosition, round, config]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current)
    }
  }, [])

  // Timer tracking — update the ref with current time via interval
  useEffect(() => {
    if (turnState !== 'team1-turn' && turnState !== 'team2-turn') return
    timeRemainingRef.current = config.answerTime
    const start = Date.now()
    const interval = setInterval(() => {
      timeRemainingRef.current = Math.max(0, config.answerTime - (Date.now() - start) / 1000)
    }, 50)
    return () => clearInterval(interval)
  }, [turnState, timerKey])

  const handleSubmit = useCallback(() => {
    if (turnState !== 'team1-turn' && turnState !== 'team2-turn') return
    const teamNum = turnState === 'team1-turn' ? 1 : 2
    processAnswer(answer, teamNum)
  }, [turnState, answer, processAnswer])

  const handleTimeout = useCallback(() => {
    if (turnState !== 'team1-turn' && turnState !== 'team2-turn') return
    const teamNum = turnState === 'team1-turn' ? 1 : 2
    processAnswer('', teamNum)
  }, [turnState, processAnswer])

  // Determine winner
  const winner = ropePosition < 0 ? config.team1Name : ropePosition > 0 ? config.team2Name : null
  const isTie = ropePosition === 0 && team1.score === team2.score

  if (turnState === 'game-over') {
    return (
      <div className="space-y-6">
        <TugOfWarRope
          position={ropePosition}
          team1Name={config.team1Name}
          team2Name={config.team2Name}
        />

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="text-3xl font-bold">
              {isTie ? "It's a Tie!" : `${winner} Wins!`}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-blue-600 font-medium">{config.team1Name}</div>
                <div className="text-2xl font-bold text-blue-700">{team1.score}</div>
              </div>
              <div>
                <div className="text-sm text-red-600 font-medium">{config.team2Name}</div>
                <div className="text-2xl font-bold text-red-700">{team2.score}</div>
              </div>
            </div>
            <Button size="lg" onClick={onPlayAgain} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rope visualization */}
      <TugOfWarRope
        position={ropePosition}
        team1Name={config.team1Name}
        team2Name={config.team2Name}
      />

      {/* Scoreboard */}
      <GameScoreboard
        team1={{ name: config.team1Name, ...team1 }}
        team2={{ name: config.team2Name, ...team2 }}
        currentTeam={currentTeam}
        round={round}
        totalRounds={config.rounds}
      />

      {/* Active turn indicator */}
      <div className={cn(
        'text-center text-lg font-bold py-2 rounded-lg transition-colors',
        currentTeam === 1 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
      )}>
        {turnState === 'showing-result' ? (
          <div className="flex items-center justify-center gap-2">
            {lastResult?.correct ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700">Correct! +{lastResult.power} power</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-600" />
                <span className="text-red-700">
                  {lastResult?.correctAnswer ? `Answer: ${lastResult.correctAnswer}` : 'Time\'s up!'}
                </span>
              </>
            )}
          </div>
        ) : (
          `${currentTeam === 1 ? config.team1Name : config.team2Name}'s Turn`
        )}
      </div>

      {/* Problem + Timer area */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            {/* Timer */}
            {(turnState === 'team1-turn' || turnState === 'team2-turn') && (
              <GameTimer
                key={timerKey}
                duration={config.answerTime}
                running={true}
                onTimeout={handleTimeout}
              />
            )}

            {/* Problem */}
            <GameProblem
              problem={problem}
              answer={answer}
              onAnswerChange={setAnswer}
              onSubmit={handleSubmit}
              disabled={turnState === 'showing-result'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
