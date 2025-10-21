import { Card, Suit, Rank } from '@/types';

/**
 * Get the baccarat value for a given rank
 * Ace = 1, 2-9 = face value, 10/J/Q/K = 0
 */
export function getRankValue(rank: Rank): number {
  switch (rank) {
    case Rank.ACE:
      return 1;
    case Rank.TWO:
      return 2;
    case Rank.THREE:
      return 3;
    case Rank.FOUR:
      return 4;
    case Rank.FIVE:
      return 5;
    case Rank.SIX:
      return 6;
    case Rank.SEVEN:
      return 7;
    case Rank.EIGHT:
      return 8;
    case Rank.NINE:
      return 9;
    case Rank.TEN:
    case Rank.JACK:
    case Rank.QUEEN:
    case Rank.KING:
      return 0;
  }
}

/**
 * Create a single card
 */
export function createCard(suit: Suit, rank: Rank): Card {
  return {
    suit,
    rank,
    value: getRankValue(rank)
  };
}

/**
 * Create a standard 52-card deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits = Object.values(Suit);
  const ranks = Object.values(Rank);

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(createCard(suit, rank));
    }
  }

  return deck;
}

/**
 * Get display string for a card
 */
export function getCardDisplay(card: Card): string {
  const suitSymbols = {
    [Suit.HEARTS]: '♥',
    [Suit.DIAMONDS]: '♦',
    [Suit.CLUBS]: '♣',
    [Suit.SPADES]: '♠'
  };

  const rankDisplay = card.rank === Rank.ACE ? 'A' :
                      card.rank === Rank.JACK ? 'J' :
                      card.rank === Rank.QUEEN ? 'Q' :
                      card.rank === Rank.KING ? 'K' :
                      card.rank;

  return `${rankDisplay}${suitSymbols[card.suit]}`;
}
