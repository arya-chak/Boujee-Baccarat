import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerState, Bet, BetType, GameHistory, GameResult } from '@/types';
import { STARTING_BALANCE, BET_LIMITS, MAX_HISTORY_ITEMS, BALANCE_RESET_HOURS } from '@/constants/game';
import { calculateTotalPayout, calculateNetProfit } from '@/game/result';

interface PlayerStore extends PlayerState {
  // Betting actions
  placeBet: (type: BetType, amount: number) => boolean;
  clearBet: (type: BetType) => void;
  clearAllBets: () => void;
  repeatLastBets: () => void;

  // Game actions
  processPayout: (result: GameResult) => void;
  addToHistory: (result: GameResult) => void;

  // Balance actions
  checkBalanceReset: () => void;
  resetBalance: () => void;

  // State
  lastBets: Bet[];
  lastResetTime: number;
}

const initialStatistics = {
  totalGamesPlayed: 0,
  playerWins: 0,
  bankerWins: 0,
  ties: 0,
  biggestWin: 0,
  biggestLoss: 0,
  totalWagered: 0,
  netProfit: 0
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      balance: STARTING_BALANCE,
      currentBets: [],
      history: [],
      statistics: initialStatistics,
      lastBets: [],
      lastResetTime: Date.now(),

      // Betting actions
      placeBet: (type: BetType, amount: number) => {
        const state = get();

        // Validate bet amount
        if (amount < BET_LIMITS.min || amount > BET_LIMITS.max) {
          console.warn('Bet amount outside limits');
          return false;
        }

        // Calculate total bet amount including new bet
        const currentBetTotal = state.currentBets.reduce((sum, bet) => sum + bet.amount, 0);
        if (currentBetTotal + amount > state.balance) {
          console.warn('Insufficient balance');
          return false;
        }

        // Check if bet type already exists
        const existingBetIndex = state.currentBets.findIndex(bet => bet.type === type);
        let newBets: Bet[];

        if (existingBetIndex >= 0) {
          // Add to existing bet
          newBets = [...state.currentBets];
          newBets[existingBetIndex] = {
            ...newBets[existingBetIndex],
            amount: newBets[existingBetIndex].amount + amount
          };
        } else {
          // Create new bet
          newBets = [...state.currentBets, { type, amount }];
        }

        set({ currentBets: newBets });
        return true;
      },

      clearBet: (type: BetType) => {
        set(state => ({
          currentBets: state.currentBets.filter(bet => bet.type !== type)
        }));
      },

      clearAllBets: () => {
        set({ currentBets: [] });
      },

      repeatLastBets: () => {
        const state = get();
        if (state.lastBets.length === 0) return;

        const totalAmount = state.lastBets.reduce((sum, bet) => sum + bet.amount, 0);
        if (totalAmount > state.balance) {
          console.warn('Insufficient balance for repeat bets');
          return;
        }

        set({ currentBets: [...state.lastBets] });
      },

      // Game actions
      processPayout: (result: GameResult) => {
        const state = get();
        const totalPayout = calculateTotalPayout(result.payouts);
        const netProfit = calculateNetProfit(state.currentBets, totalPayout);
        const totalWagered = state.currentBets.reduce((sum, bet) => sum + bet.amount, 0);

        // Update balance
        const newBalance = state.balance - totalWagered + totalPayout;

        // Update statistics
        const newStatistics = {
          ...state.statistics,
          totalGamesPlayed: state.statistics.totalGamesPlayed + 1,
          playerWins: state.statistics.playerWins + (result.outcome === 'PLAYER_WIN' ? 1 : 0),
          bankerWins: state.statistics.bankerWins + (result.outcome === 'BANKER_WIN' ? 1 : 0),
          ties: state.statistics.ties + (result.outcome === 'TIE' ? 1 : 0),
          biggestWin: Math.max(state.statistics.biggestWin, netProfit),
          biggestLoss: Math.min(state.statistics.biggestLoss, netProfit),
          totalWagered: state.statistics.totalWagered + totalWagered,
          netProfit: state.statistics.netProfit + netProfit
        };

        // Save last bets for repeat functionality
        const lastBets = [...state.currentBets];

        set({
          balance: newBalance,
          statistics: newStatistics,
          lastBets
        });
      },

      addToHistory: (result: GameResult) => {
        const state = get();
        const totalPayout = calculateTotalPayout(result.payouts);
        const netProfit = calculateNetProfit(state.currentBets, totalPayout);

        const historyEntry: GameHistory = {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          result,
          bets: state.currentBets,
          netProfit
        };

        const newHistory = [historyEntry, ...state.history].slice(0, MAX_HISTORY_ITEMS);
        set({ history: newHistory });
      },

      // Balance actions
      checkBalanceReset: () => {
        const state = get();
        const hoursSinceReset = (Date.now() - state.lastResetTime) / (1000 * 60 * 60);

        if (hoursSinceReset >= BALANCE_RESET_HOURS) {
          get().resetBalance();
        }
      },

      resetBalance: () => {
        set({
          balance: STARTING_BALANCE,
          lastResetTime: Date.now()
        });
      }
    }),
    {
      name: 'baccarat-player-store',
      partialize: (state) => ({
        balance: state.balance,
        history: state.history,
        statistics: state.statistics,
        lastResetTime: state.lastResetTime,
        lastBets: state.lastBets
      })
    }
  )
);
