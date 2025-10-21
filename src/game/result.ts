import { Hand, GameResult, GameOutcome, Bet, BetType } from '@/types';
import { PAYOUT_RATES } from '@/constants/game';

/**
 * Determine the outcome of a baccarat game
 */
export function determineOutcome(playerHand: Hand, bankerHand: Hand): GameOutcome {
  if (playerHand.value > bankerHand.value) {
    return GameOutcome.PLAYER_WIN;
  } else if (bankerHand.value > playerHand.value) {
    return GameOutcome.BANKER_WIN;
  } else {
    return GameOutcome.TIE;
  }
}

/**
 * Calculate payout for a single bet based on game outcome
 * Returns the total payout (original bet + winnings), or 0 if lost
 */
export function calculateBetPayout(
  bet: Bet,
  outcome: GameOutcome,
  playerHand: Hand,
  bankerHand: Hand
): number {
  switch (bet.type) {
    case BetType.PLAYER:
      if (outcome === GameOutcome.PLAYER_WIN) {
        return bet.amount + (bet.amount * PAYOUT_RATES[BetType.PLAYER]);
      }
      if (outcome === GameOutcome.TIE) {
        return bet.amount; // Push - return original bet
      }
      return 0;

    case BetType.BANKER:
      if (outcome === GameOutcome.BANKER_WIN) {
        return bet.amount + (bet.amount * PAYOUT_RATES[BetType.BANKER]);
      }
      if (outcome === GameOutcome.TIE) {
        return bet.amount; // Push - return original bet
      }
      return 0;

    case BetType.TIE:
      if (outcome === GameOutcome.TIE) {
        return bet.amount + (bet.amount * PAYOUT_RATES[BetType.TIE]);
      }
      return 0;

    case BetType.PLAYER_PAIR:
      if (playerHand.isPair) {
        return bet.amount + (bet.amount * PAYOUT_RATES[BetType.PLAYER_PAIR]);
      }
      return 0;

    case BetType.BANKER_PAIR:
      if (bankerHand.isPair) {
        return bet.amount + (bet.amount * PAYOUT_RATES[BetType.BANKER_PAIR]);
      }
      return 0;

    default:
      return 0;
  }
}

/**
 * Calculate all payouts for a set of bets
 */
export function calculatePayouts(
  bets: Bet[],
  outcome: GameOutcome,
  playerHand: Hand,
  bankerHand: Hand
): Record<BetType, number> {
  const payouts: Record<BetType, number> = {
    [BetType.PLAYER]: 0,
    [BetType.BANKER]: 0,
    [BetType.TIE]: 0,
    [BetType.PLAYER_PAIR]: 0,
    [BetType.BANKER_PAIR]: 0
  };

  for (const bet of bets) {
    const payout = calculateBetPayout(bet, outcome, playerHand, bankerHand);
    payouts[bet.type] += payout;
  }

  return payouts;
}

/**
 * Calculate total payout from all bets
 */
export function calculateTotalPayout(payouts: Record<BetType, number>): number {
  return Object.values(payouts).reduce((sum, payout) => sum + payout, 0);
}

/**
 * Calculate net profit (payout - total wagered)
 */
export function calculateNetProfit(bets: Bet[], totalPayout: number): number {
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0);
  return totalPayout - totalWagered;
}

/**
 * Create a complete game result
 */
export function createGameResult(
  playerHand: Hand,
  bankerHand: Hand,
  bets: Bet[]
): GameResult {
  const outcome = determineOutcome(playerHand, bankerHand);
  const payouts = calculatePayouts(bets, outcome, playerHand, bankerHand);

  return {
    outcome,
    playerHand,
    bankerHand,
    payouts
  };
}

/**
 * Get a human-readable description of the outcome
 */
export function getOutcomeDescription(outcome: GameOutcome): string {
  switch (outcome) {
    case GameOutcome.PLAYER_WIN:
      return 'Player Wins';
    case GameOutcome.BANKER_WIN:
      return 'Banker Wins';
    case GameOutcome.TIE:
      return 'Tie';
  }
}
