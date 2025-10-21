import { shuffle } from 'lodash';
import { Card } from '@/types';
import { createDeck } from './cards';
import { DECKS_IN_SHOE, CARDS_BEFORE_CUT } from '@/constants/game';

/**
 * Create a new shoe with the specified number of decks
 */
export function createShoe(numDecks: number = DECKS_IN_SHOE): Card[] {
  const shoe: Card[] = [];

  for (let i = 0; i < numDecks; i++) {
    shoe.push(...createDeck());
  }

  return shoe;
}

/**
 * Shuffle a shoe using Fisher-Yates algorithm (via lodash)
 */
export function shuffleShoe(shoe: Card[]): Card[] {
  return shuffle([...shoe]);
}

/**
 * Calculate the cut card position
 * Typically placed 14 cards from the end (1 deck)
 */
export function getCutCardPosition(shoeSize: number): number {
  return shoeSize - CARDS_BEFORE_CUT;
}

/**
 * Check if the shoe needs to be reshuffled
 */
export function needsReshuffle(currentPosition: number, cutCardPosition: number): boolean {
  return currentPosition >= cutCardPosition;
}

/**
 * Initialize a new shuffled shoe
 */
export function initializeShoe(): { shoe: Card[]; cutCardPosition: number } {
  const shoe = createShoe();
  const shuffledShoe = shuffleShoe(shoe);
  const cutCardPosition = getCutCardPosition(shuffledShoe.length);

  return {
    shoe: shuffledShoe,
    cutCardPosition
  };
}

/**
 * Deal a card from the shoe
 */
export function dealCard(shoe: Card[], position: number): { card: Card; newPosition: number } {
  if (position >= shoe.length) {
    throw new Error('No more cards in shoe');
  }

  return {
    card: shoe[position],
    newPosition: position + 1
  };
}

/**
 * Deal multiple cards from the shoe
 */
export function dealCards(
  shoe: Card[],
  position: number,
  count: number
): { cards: Card[]; newPosition: number } {
  const cards: Card[] = [];
  let currentPosition = position;

  for (let i = 0; i < count; i++) {
    const result = dealCard(shoe, currentPosition);
    cards.push(result.card);
    currentPosition = result.newPosition;
  }

  return {
    cards,
    newPosition: currentPosition
  };
}
