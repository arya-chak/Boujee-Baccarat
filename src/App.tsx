import { Button } from "@/components/ui/button"
import { useGameStore } from "@/stores/gameStore"
import { usePlayerStore } from "@/stores/playerStore"
import { getCardDisplay } from "@/game/cards"
import { getOutcomeDescription } from "@/game/result"
import { BetType } from "@/types"
import { useEffect } from "react"

function App() {
  // Expose stores to window for debugging
  useEffect(() => {
    (window as any).gameStore = useGameStore;
    (window as any).playerStore = usePlayerStore;
    console.log('🎰 Baccarat Debug Mode Enabled!');
    console.log('Try: gameStore.getState() or playerStore.getState()');
  }, []);
  const {
    phase,
    playerHand,
    bankerHand,
    result,
    dealInitialCards
  } = useGameStore()

  const {
    balance,
    currentBets,
    placeBet,
    clearAllBets,
    processPayout,
    addToHistory,
    statistics
  } = usePlayerStore()

  const handleDeal = () => {
    if (currentBets.length === 0) {
      alert('Place a bet first!')
      return
    }
    dealInitialCards()
  }

  const handlePlaceBet = (type: BetType) => {
    placeBet(type, 10)
  }

  // Auto-process payout when result is available
  if (result && phase === 'RESULT') {
    setTimeout(() => {
      processPayout(result)
      addToHistory(result)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-yellow-400">
            Boujee Baccarat
          </h1>
          <p className="text-green-200">
            Phase 1: Core Game Engine - Week 1 Complete!
          </p>
        </div>

        {/* Balance & Stats */}
        <div className="bg-black/30 rounded-lg p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-green-300">Balance</p>
              <p className="text-2xl font-bold text-yellow-400">${balance}</p>
            </div>
            <div>
              <p className="text-sm text-green-300">Games Played</p>
              <p className="text-2xl font-bold">{statistics.totalGamesPlayed}</p>
            </div>
            <div>
              <p className="text-sm text-green-300">Win Rate</p>
              <p className="text-2xl font-bold">
                {statistics.totalGamesPlayed > 0
                  ? `${((statistics.playerWins / statistics.totalGamesPlayed) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-300">Net Profit</p>
              <p className={`text-2xl font-bold ${statistics.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${statistics.netProfit}
              </p>
            </div>
          </div>
        </div>

        {/* Game Table */}
        <div className="bg-green-700/50 rounded-lg p-8 border-4 border-yellow-600/50">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Player Hand */}
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Player</h3>
              {playerHand && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {playerHand.cards.map((card, i) => (
                      <div key={i} className="bg-white text-black px-4 py-6 rounded text-xl font-bold">
                        {getCardDisplay(card)}
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-white">
                    Value: {playerHand.value}
                  </p>
                  {playerHand.isNatural && (
                    <p className="text-yellow-400 font-bold">NATURAL!</p>
                  )}
                </div>
              )}
            </div>

            {/* Banker Hand */}
            <div className="bg-black/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Banker</h3>
              {bankerHand && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {bankerHand.cards.map((card, i) => (
                      <div key={i} className="bg-white text-black px-4 py-6 rounded text-xl font-bold">
                        {getCardDisplay(card)}
                      </div>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-white">
                    Value: {bankerHand.value}
                  </p>
                  {bankerHand.isNatural && (
                    <p className="text-yellow-400 font-bold">NATURAL!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-yellow-500 text-black rounded-lg p-6 text-center mb-8">
              <p className="text-3xl font-bold">
                {getOutcomeDescription(result.outcome)}
              </p>
            </div>
          )}

          {/* Betting Controls */}
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handlePlaceBet(BetType.PLAYER)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Bet Player ($10)
              </Button>
              <Button
                onClick={() => handlePlaceBet(BetType.BANKER)}
                className="bg-red-600 hover:bg-red-700"
              >
                Bet Banker ($10)
              </Button>
              <Button
                onClick={() => handlePlaceBet(BetType.TIE)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Bet Tie ($10)
              </Button>
            </div>

            {/* Current Bets */}
            {currentBets.length > 0 && (
              <div className="text-center text-white">
                <p className="text-sm">Current Bets:</p>
                <div className="flex gap-2 justify-center">
                  {currentBets.map((bet, i) => (
                    <span key={i} className="text-yellow-400">
                      {bet.type}: ${bet.amount}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleDeal}
                disabled={currentBets.length === 0 || phase !== 'BETTING'}
                className="bg-green-600 hover:bg-green-700 text-xl px-8 py-6"
              >
                DEAL
              </Button>
              <Button
                onClick={clearAllBets}
                variant="outline"
                className="bg-white/10 hover:bg-white/20"
              >
                Clear Bets
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-black/30 rounded-lg p-4 text-xs text-green-300 font-mono">
          <p>Phase: {phase}</p>
          <p>Current Bets: {currentBets.length}</p>
          <p>Game Engine Status: ✅ All systems operational</p>
        </div>
      </div>
    </div>
  )
}

export default App
