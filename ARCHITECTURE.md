# 🏗️ Boujee Baccarat Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         React App (App.tsx)                      │
│                                                                   │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │   useGameStore      │         │   usePlayerStore    │       │
│  │   (Game State)      │◄────────┤   (Player State)    │       │
│  └─────────────────────┘         └─────────────────────┘       │
│           │                                  │                   │
│           │                                  │                   │
│           ▼                                  ▼                   │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │   Game Logic        │         │   LocalStorage      │       │
│  │   (Pure Functions)  │         │   (Persistence)     │       │
│  └─────────────────────┘         └─────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Places Bet
```
User clicks "Bet Player"
    ↓
App.tsx: handlePlaceBet(BetType.PLAYER)
    ↓
playerStore.placeBet(BetType.PLAYER, 10)
    ↓
Validates balance and bet limits
    ↓
Updates currentBets array
    ↓
UI re-renders with new bet displayed
```

### 2. User Clicks DEAL
```
User clicks "DEAL"
    ↓
App.tsx: handleDeal()
    ↓
gameStore.dealInitialCards()
    ↓
┌──────────────────────────────────────────┐
│ Deal 4 cards from shoe:                  │
│ [Player] [Banker] [Player] [Banker]      │
│                                           │
│ Create Player hand: cards[0] + cards[2]  │
│ Create Banker hand: cards[1] + cards[3]  │
│                                           │
│ Calculate values:                         │
│   player.value = (7 + 2) % 10 = 9        │
│   banker.value = (5 + 3) % 10 = 8        │
│                                           │
│ Check for Naturals (8 or 9)              │
└──────────────────────────────────────────┘
    ↓
gameStore.drawThirdCards()
    ↓
┌──────────────────────────────────────────┐
│ Apply third card rules:                  │
│                                           │
│ IF playerHand.value <= 5:                │
│   Deal third card to Player              │
│                                           │
│ IF bankerShouldDraw(banker, player):     │
│   Deal third card to Banker              │
│   (Complex rules based on values)        │
└──────────────────────────────────────────┘
    ↓
gameStore.createGameResult()
    ↓
┌──────────────────────────────────────────┐
│ Determine Winner:                         │
│   Compare player.value vs banker.value    │
│                                           │
│ Calculate Payouts:                        │
│   For each bet:                           │
│     If bet.type matches outcome:          │
│       payout = bet + (bet × rate)         │
│     Else:                                 │
│       payout = 0                          │
└──────────────────────────────────────────┘
    ↓
playerStore.processPayout(result)
    ↓
┌──────────────────────────────────────────┐
│ Update Player State:                      │
│   balance -= totalWagered                 │
│   balance += totalPayout                  │
│   statistics.gamesPlayed++                │
│   statistics.netProfit += profit          │
│   history.unshift(gameHistory)            │
│   Save to localStorage                    │
└──────────────────────────────────────────┘
    ↓
UI re-renders with:
  - New balance
  - Updated statistics
  - Result banner
  - Back to BETTING phase
```

## File Structure & Responsibilities

### Types (`src/types/index.ts`)
**Purpose:** Type safety and contracts
```typescript
Card          // suit, rank, value
Hand          // cards[], value, isNatural, isPair
Bet           // type, amount
GameState     // phase, hands, bets, result, shoe
PlayerState   // balance, history, statistics
```

### Constants (`src/constants/game.ts`)
**Purpose:** Game configuration
```typescript
BET_LIMITS          = { min: 10, max: 1000 }
PAYOUT_RATES        = { PLAYER: 1.0, BANKER: 0.95, TIE: 8.0 }
DECKS_IN_SHOE       = 8
STARTING_BALANCE    = 1000
```

### Game Logic (Pure Functions)

#### `src/game/cards.ts`
```typescript
getRankValue(rank)    // ACE=1, 2-9=value, 10/J/Q/K=0
createCard()          // suit + rank → Card
createDeck()          // → 52 cards
getCardDisplay()      // Card → "7♥"
```

#### `src/game/shoe.ts`
```typescript
createShoe()          // → 416 cards (8 decks)
shuffleShoe()         // Fisher-Yates shuffle
dealCard()            // shoe[position] → card
needsReshuffle()      // Check cut card position
```

#### `src/game/hand.ts`
```typescript
calculateHandValue()  // cards → sum % 10
isNatural()          // 8 or 9 with 2 cards
isPair()             // First two cards same rank
createHand()         // cards → Hand object
```

#### `src/game/rules.ts`
```typescript
playerShouldDraw()   // Player: 0-5 draw, 6-7 stand
bankerShouldDraw()   // Complex Banker rules
```

#### `src/game/result.ts`
```typescript
determineOutcome()      // Compare hand values
calculateBetPayout()    // bet + outcome → payout
calculatePayouts()      // All bets → payouts map
createGameResult()      // hands + bets → GameResult
```

### State Management (Zustand)

#### `src/stores/gameStore.ts`
**Manages:** Game progression
```typescript
State:
  - phase: BETTING | DEALING | DRAWING_THIRD_CARD | RESULT | SETTLING
  - playerHand, bankerHand
  - shoe, dealerPosition
  - currentBets
  - result

Actions:
  - startNewRound()      // Reset to BETTING
  - dealInitialCards()   // Deal 4 cards
  - drawThirdCards()     // Apply rules
  - settleRound()        // Update balance
```

#### `src/stores/playerStore.ts`
**Manages:** Player data (persisted)
```typescript
State:
  - balance
  - currentBets
  - history (last 50 hands)
  - statistics (wins, losses, profit)
  - lastBets (for repeat)

Actions:
  - placeBet()           // Add bet
  - clearBet()           // Remove bet
  - repeatLastBets()     // Rebet
  - processPayout()      // Update balance
  - addToHistory()       // Save hand
  - checkBalanceReset()  // 24h check
```

### UI (`src/App.tsx`)
**Manages:** User interface and events
```typescript
Components:
  - Balance/Stats Dashboard
  - Game Table (Player/Banker hands)
  - Betting Controls
  - Result Display
  - Debug Info

Event Handlers:
  - handlePlaceBet()     // Button clicks
  - handleDeal()         // Start game
  - Auto-payout trigger  // On result phase
```

## Key Design Decisions

### 1. Pure Functions for Game Logic
**Why?** Testable, predictable, easy to reason about
```typescript
// Pure function - same input always gives same output
calculateHandValue([7, 2]) // Always returns 9

// vs Impure - depends on external state
this.hand.calculateValue() // Depends on this.hand
```

### 2. Zustand Over Redux
**Why?** Less boilerplate, simpler API, still powerful
```typescript
// Zustand (what we use)
const balance = usePlayerStore(state => state.balance)

// vs Redux
const balance = useSelector(state => state.player.balance)
// + reducer + action creators + types
```

### 3. TypeScript Throughout
**Why?** Catch errors at compile time, better IDE support
```typescript
// TypeScript catches this:
placeBet('INVALID_TYPE', 10) // ❌ Error: not a BetType

// JavaScript would fail at runtime
```

### 4. LocalStorage Persistence
**Why?** No backend needed yet, data survives refresh
```typescript
// Zustand persist middleware
persist(
  (set, get) => ({ /* state */ }),
  { name: 'baccarat-player-store' }
)
```

### 5. Automatic Game Flow
**Why?** Smooth UX, no manual phase transitions
```typescript
dealInitialCards() {
  // ... deal cards ...
  setTimeout(() => {
    this.drawThirdCards() // Auto-advance
  }, 100)
}
```

## State Transitions

```
[BETTING]
    │ User clicks DEAL
    ↓
[DEALING]
    │ Deal 4 cards
    │ Auto after 100ms
    ↓
[DRAWING_THIRD_CARD]
    │ Apply rules
    │ Auto after 100ms
    ↓
[RESULT]
    │ Show winner
    │ Calculate payouts
    │ User sees result (500ms)
    ↓
[SETTLING]
    │ Update balance
    │ Save history
    │ Auto after 100ms
    ↓
[BETTING] (repeat)
```

## Data Persistence

### What's Saved to LocalStorage:
```typescript
{
  "baccarat-player-store": {
    "balance": 1050,
    "history": [...],  // Last 50 hands
    "statistics": {
      "totalGamesPlayed": 23,
      "playerWins": 11,
      "bankerWins": 10,
      "ties": 2,
      "netProfit": 50
    },
    "lastResetTime": 1234567890,
    "lastBets": [...]
  }
}
```

### What's NOT Saved:
- Current game state (hands, phase)
- Shoe and dealer position
- Current bets (cleared on page load)

**Why?** These reset naturally between sessions

## Performance Considerations

### 1. Efficient Re-renders
```typescript
// Only subscribe to what you need
const balance = usePlayerStore(state => state.balance)
// Component only re-renders when balance changes
```

### 2. Shoe Pre-shuffle
```typescript
// Shuffle once per shoe (416 cards)
// Not after every hand
const shuffledShoe = shuffle(createShoe())
```

### 3. Modulo for Hand Values
```typescript
// Efficient: O(1)
value = cards.reduce((sum, c) => sum + c.value, 0) % 10

// vs string manipulation or lookup tables
```

## Testing Strategy

### Unit Tests (Future)
```typescript
// Game logic (pure functions)
test('calculateHandValue', () => {
  expect(calculateHandValue([7, 2])).toBe(9)
  expect(calculateHandValue([9, 6])).toBe(5)
})

test('playerShouldDraw', () => {
  expect(playerShouldDraw(hand5, hand8)).toBe(true)
  expect(playerShouldDraw(hand6, hand8)).toBe(false)
})
```

### Integration Tests (Future)
```typescript
// Full game flow
test('complete hand', () => {
  placeBet(PLAYER, 100)
  dealInitialCards()
  // Assert hands created
  // Assert result calculated
  // Assert balance updated
})
```

### Manual Testing (Current)
- See TESTING_GUIDE.md
- Browser console debugging
- Visual inspection

## Extension Points for Week 2+

### 1. Animation System
```typescript
// Add delays between card deals
async dealInitialCards() {
  await animateCard(card1, 'player')
  await animateCard(card2, 'banker')
  // ...
}
```

### 2. Roadmap Display
```typescript
// Convert history to roadmap patterns
const beadPlate = generateBeadPlate(history)
const bigRoad = generateBigRoad(history)
```

### 3. Theme System
```typescript
// Swap color schemes
const theme = useThemeStore(state => state.current)
<Table theme={theme} />
```

### 4. Sound Effects
```typescript
// Play sounds on events
dealInitialCards() {
  playSound('card-deal')
  // ...
}
```

## Summary

**Strengths of Current Architecture:**
- ✅ Clean separation of concerns
- ✅ Type-safe throughout
- ✅ Pure functions for game logic
- ✅ Minimal re-renders
- ✅ Easy to test
- ✅ Easy to extend

**Ready for:**
- ✨ Enhanced UI components
- ✨ Animations
- ✨ Sound effects
- ✨ Roadmaps
- ✨ Themes
- ✨ Backend integration (Phase 3)

The foundation is solid! 🎰
