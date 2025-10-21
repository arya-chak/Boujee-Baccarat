import { BetType, PayoutRates, BetLimits } from '@/types';

// Bet limits
export const BET_LIMITS: BetLimits = {
  min: 10,
  max: 1000
};

// Payout rates
export const PAYOUT_RATES: PayoutRates = {
  [BetType.PLAYER]: 1.0,        // 1:1
  [BetType.BANKER]: 0.95,        // 0.95:1 (5% commission)
  [BetType.TIE]: 8.0,            // 8:1
  [BetType.PLAYER_PAIR]: 11.0,  // 11:1
  [BetType.BANKER_PAIR]: 11.0   // 11:1
};

// Shoe configuration
export const DECKS_IN_SHOE = 8;
export const CARDS_BEFORE_CUT = 14; // Typical casino practice

// Play money system
export const STARTING_BALANCE = 1000;
export const BALANCE_RESET_HOURS = 24;

// Animation timings (milliseconds)
export const ANIMATION_TIMINGS = {
  CARD_DEAL: 300,
  CARD_FLIP: 200,
  CHIP_MOVE: 400,
  RESULT_DISPLAY: 1000,
  CELEBRATION: 2000
};

// Game configuration
export const MAX_HISTORY_ITEMS = 50;
export const NATURAL_VALUE = 8; // 8 or 9 is a natural
