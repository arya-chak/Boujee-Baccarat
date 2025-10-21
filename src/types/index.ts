// Card types
export enum Suit {
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
  SPADES = 'SPADES'
}

export enum Rank {
  ACE = 'ACE',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING'
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // Baccarat value (0-9)
}

// Betting types
export enum BetType {
  PLAYER = 'PLAYER',
  BANKER = 'BANKER',
  TIE = 'TIE',
  PLAYER_PAIR = 'PLAYER_PAIR',
  BANKER_PAIR = 'BANKER_PAIR'
}

export interface Bet {
  type: BetType;
  amount: number;
}

// Hand types
export interface Hand {
  cards: Card[];
  value: number; // 0-9
  isNatural: boolean;
  isPair: boolean;
}

// Game result types
export enum GameOutcome {
  PLAYER_WIN = 'PLAYER_WIN',
  BANKER_WIN = 'BANKER_WIN',
  TIE = 'TIE'
}

export interface GameResult {
  outcome: GameOutcome;
  playerHand: Hand;
  bankerHand: Hand;
  payouts: Record<BetType, number>; // Total payout per bet type
}

// Game state types
export enum GamePhase {
  BETTING = 'BETTING',
  DEALING = 'DEALING',
  DRAWING_THIRD_CARD = 'DRAWING_THIRD_CARD',
  RESULT = 'RESULT',
  SETTLING = 'SETTLING'
}

export interface GameState {
  phase: GamePhase;
  playerHand: Hand | null;
  bankerHand: Hand | null;
  currentBets: Bet[];
  result: GameResult | null;
  shoe: Card[];
  dealerPosition: number; // Current position in shoe
  cutCardPosition: number; // When to shuffle
}

// History types
export interface GameHistory {
  id: string;
  timestamp: number;
  result: GameResult;
  bets: Bet[];
  netProfit: number;
}

// Player state types
export interface PlayerState {
  balance: number;
  currentBets: Bet[];
  history: GameHistory[];
  statistics: PlayerStatistics;
}

export interface PlayerStatistics {
  totalGamesPlayed: number;
  playerWins: number;
  bankerWins: number;
  ties: number;
  biggestWin: number;
  biggestLoss: number;
  totalWagered: number;
  netProfit: number;
}

// Constants
export interface BetLimits {
  min: number;
  max: number;
}

export interface PayoutRates {
  [BetType.PLAYER]: number;
  [BetType.BANKER]: number;
  [BetType.TIE]: number;
  [BetType.PLAYER_PAIR]: number;
  [BetType.BANKER_PAIR]: number;
}

// Theme types (for Phase 2)
export enum Theme {
  VEGAS_CLASSIC = 'VEGAS_CLASSIC',
  ANCIENT_EGYPT = 'ANCIENT_EGYPT',
  MACAU_LUXURY = 'MACAU_LUXURY',
  NEON_CYBERPUNK = 'NEON_CYBERPUNK'
}
