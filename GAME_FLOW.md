# Baccarat Game Flow Explanation

## What Happens When You Click "DEAL"

### Step 1: Initial Deal (dealInitialCards)
```
1. Take 4 cards from the shoe:
   - Card 1 → Player
   - Card 2 → Banker
   - Card 3 → Player
   - Card 4 → Banker

2. Calculate each hand's value:
   - Player: (Card1 + Card3) % 10
   - Banker: (Card2 + Card4) % 10

3. Check for Naturals (8 or 9 with 2 cards):
   - If either has Natural → Game Over, determine winner
```

### Step 2: Drawing Third Cards (drawThirdCards)
```
1. Check Player First:
   - If Player has 0-5 → Draw third card
   - If Player has 6-7 → Stand

2. Check Banker (depends on Player):
   - If Player stood (6-7):
     * Banker draws on 0-5, stands on 6-7

   - If Player drew a third card:
     * Complex rules based on Banker total and Player's 3rd card value
     * Example: Banker has 4, Player drew 5 → Banker draws
     * Example: Banker has 6, Player drew 2 → Banker stands
```

### Step 3: Determine Winner (createGameResult)
```
1. Compare final values:
   - If Player value > Banker value → Player Wins
   - If Banker value > Player value → Banker Wins
   - If equal → Tie

2. Calculate Payouts:
   - Player Win: Return bet + (bet × 1.0)
   - Banker Win: Return bet + (bet × 0.95)  ← 5% commission
   - Tie: Return bet + (bet × 8.0)
   - Player/Banker bets push (return bet) on Tie
   - Tie bet loses on Player/Banker win
```

### Step 4: Settle Round (processPayout)
```
1. Update balance:
   - Subtract total wagered
   - Add total payout
   - Result = new balance

2. Update statistics:
   - Increment games played
   - Track wins/losses
   - Update biggest win/loss
   - Calculate win rate

3. Save to history:
   - Store last 50 hands
   - Include cards, bets, outcome, profit

4. Return to BETTING phase
```

## Real Casino Example

### Scenario: You bet $100 on Player

**Hand Dealt:**
- Player: 7♥ + 2♠ = 9 ⭐ NATURAL 9
- Banker: 5♦ + 3♣ = 8 ⭐ NATURAL 8

**Result:** Player Wins (9 > 8)

**Payout Calculation:**
- Original bet: $100
- Win amount: $100 × 1.0 = $100
- Total payout: $200
- Net profit: $100

**If you bet $100 on Banker instead:**
- Original bet: $100
- Win amount: $100 × 0.95 = $95 (5% commission!)
- Total payout: $195
- Net profit: $95

This commission is why casinos love baccarat - Banker wins slightly more often (~50.68%), but they take 5% commission, giving the house a ~1.06% edge.

## Why These Rules Exist

The third card drawing rules seem random, but they're designed to:

1. **Balance the game**: Without them, one side would win far more often
2. **Create the right house edge**: ~1.06% for Banker, ~1.24% for Player
3. **Make it exciting**: The complex rules create suspense!

The rules were developed over centuries in European casinos to create the perfect balance between Player and Banker winning chances.

## Fun Facts

- **Banker wins ~50.68%** of the time (excluding ties)
- **Player wins ~49.32%** of the time (excluding ties)
- **Ties happen ~9.5%** of the time
- This is why Banker has commission - it would be too good otherwise!
- The 8:1 payout for Tie has a **14.4% house edge** - not recommended for serious players!

## Try This Next

1. Play 20 hands and track your results
2. Try always betting Banker - you should win slightly more often
3. Try always betting Player - you'll win slightly less often
4. Try betting Tie - you'll probably lose money (but if you hit, wow!)
5. Watch for Naturals - they end the game immediately
