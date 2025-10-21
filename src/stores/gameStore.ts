import { create } from 'zustand';
import { GameState, GamePhase, Card } from '@/types';
import { initializeShoe, dealCard, needsReshuffle } from '@/game/shoe';
import { createHand, addCardToHand } from '@/game/hand';
import { playerShouldDraw, bankerShouldDraw } from '@/game/rules';
import { createGameResult } from '@/game/result';

interface GameStore extends GameState {
  // Actions
  startNewRound: () => void;
  dealInitialCards: () => void;
  drawThirdCards: () => void;
  settleRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  // Initialize the shoe
  const { shoe, cutCardPosition } = initializeShoe();

  return {
    // Initial state
    phase: GamePhase.BETTING,
    playerHand: null,
    bankerHand: null,
    currentBets: [],
    result: null,
    shoe,
    dealerPosition: 0,
    cutCardPosition,

    // Actions
    startNewRound: () => {
      const state = get();

      // Check if we need to reshuffle
      if (needsReshuffle(state.dealerPosition, state.cutCardPosition)) {
        const { shoe: newShoe, cutCardPosition: newCutCardPosition } = initializeShoe();
        set({
          phase: GamePhase.BETTING,
          playerHand: null,
          bankerHand: null,
          result: null,
          shoe: newShoe,
          dealerPosition: 0,
          cutCardPosition: newCutCardPosition
        });
      } else {
        set({
          phase: GamePhase.BETTING,
          playerHand: null,
          bankerHand: null,
          result: null
        });
      }
    },

    dealInitialCards: () => {
      const state = get();
      let position = state.dealerPosition;
      const cards: Card[] = [];

      // Deal 4 cards: Player, Banker, Player, Banker
      for (let i = 0; i < 4; i++) {
        const { card, newPosition } = dealCard(state.shoe, position);
        cards.push(card);
        position = newPosition;
      }

      const playerHand = createHand([cards[0], cards[2]]);
      const bankerHand = createHand([cards[1], cards[3]]);

      set({
        phase: GamePhase.DEALING,
        playerHand,
        bankerHand,
        dealerPosition: position
      });

      // Immediately draw third cards (part of dealing phase)
      get().drawThirdCards();
    },

    drawThirdCards: () => {
      const state = get();
      if (!state.playerHand || !state.bankerHand) return;

      let playerHand = state.playerHand;
      let bankerHand = state.bankerHand;
      let position = state.dealerPosition;

      set({ phase: GamePhase.DRAWING_THIRD_CARD });

      // Check if player should draw
      const playerDraws = playerShouldDraw(playerHand, bankerHand);
      if (playerDraws) {
        const { card, newPosition } = dealCard(state.shoe, position);
        playerHand = addCardToHand(playerHand, card);
        position = newPosition;
      }

      // Check if banker should draw
      const bankerDraws = bankerShouldDraw(bankerHand, playerHand);
      if (bankerDraws) {
        const { card, newPosition } = dealCard(state.shoe, position);
        bankerHand = addCardToHand(bankerHand, card);
        position = newPosition;
      }

      // Calculate result
      const result = createGameResult(playerHand, bankerHand, state.currentBets);

      set({
        playerHand,
        bankerHand,
        result,
        dealerPosition: position,
        phase: GamePhase.RESULT
      });

      // Stop here - wait for user to click "Continue"
    },

    settleRound: () => {
      // Immediately return to betting phase for next round
      get().startNewRound();
    },

    resetGame: () => {
      const { shoe, cutCardPosition } = initializeShoe();
      set({
        phase: GamePhase.BETTING,
        playerHand: null,
        bankerHand: null,
        currentBets: [],
        result: null,
        shoe,
        dealerPosition: 0,
        cutCardPosition
      });
    }
  };
});
