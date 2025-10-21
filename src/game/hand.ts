import { Card, Hand } from '@/types';
import { NATURAL_VALUE } from '@/constants/game';

/**
 * Calculate the total value of a hand in baccarat
 * Sum all card values and take modulo 10
 */
export function calculateHandValue(cards: Card[]): number {
  const sum = cards.reduce((total, card) => total + card.value, 0);
  return sum % 10;
}

/**
 * Check if a hand is a natural (8 or 9 with first two cards)
 */
export function isNatural(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const value = calculateHandValue(cards);
  return value >= NATURAL_VALUE;
}

/**
 * Check if a hand is a pair (first two cards have the same rank)
 */
export function isPair(cards: Card[]): boolean {
  if (cards.length < 2) return false;
  return cards[0].rank === cards[1].rank;
}

/**
 * Create a Hand object from cards
 */
export function createHand(cards: Card[]): Hand {
  return {
    cards,
    value: calculateHandValue(cards),
    isNatural: isNatural(cards),
    isPair: isPair(cards)
  };
}

/**
 * Add a card to an existing hand and return a new hand
 */
export function addCardToHand(hand: Hand, card: Card): Hand {
  const newCards = [...hand.cards, card];
  return createHand(newCards);
}

/**
 * Get the third card value (for third card drawing rules)
 * Returns null if no third card
 */
export function getThirdCardValue(hand: Hand): number | null {
  if (hand.cards.length < 3) return null;
  return hand.cards[2].value;
}
