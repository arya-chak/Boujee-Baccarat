import { Hand } from '@/types';
import { getThirdCardValue } from './hand';

/**
 * Determine if the Player should draw a third card
 * Player draws on 0-5, stands on 6-7
 * No draw if either hand is a natural (8-9)
 */
export function playerShouldDraw(playerHand: Hand, bankerHand: Hand): boolean {
  // If either hand is natural, no third card
  if (playerHand.isNatural || bankerHand.isNatural) {
    return false;
  }

  // Player draws on 0-5, stands on 6-7
  return playerHand.value <= 5;
}

/**
 * Determine if the Banker should draw a third card
 * Complex rules based on Banker's total and Player's third card value
 */
export function bankerShouldDraw(bankerHand: Hand, playerHand: Hand): boolean {
  // If either hand is natural, no third card
  if (playerHand.isNatural || bankerHand.isNatural) {
    return false;
  }

  const bankerValue = bankerHand.value;
  const playerThirdCard = getThirdCardValue(playerHand);

  // If player didn't draw (stands on 6-7), banker follows simple rule
  if (playerThirdCard === null) {
    return bankerValue <= 5;
  }

  // If player drew a third card, banker follows complex rules
  switch (bankerValue) {
    case 0:
    case 1:
    case 2:
      // Always draw on 0, 1, 2
      return true;

    case 3:
      // Draw unless player's third card is 8
      return playerThirdCard !== 8;

    case 4:
      // Draw if player's third card is 2-7
      return playerThirdCard >= 2 && playerThirdCard <= 7;

    case 5:
      // Draw if player's third card is 4-7
      return playerThirdCard >= 4 && playerThirdCard <= 7;

    case 6:
      // Draw if player's third card is 6-7
      return playerThirdCard >= 6 && playerThirdCard <= 7;

    case 7:
    case 8:
    case 9:
      // Never draw on 7, 8, 9
      return false;

    default:
      return false;
  }
}

/**
 * Get a description of the drawing rule applied
 * Useful for debugging and UI display
 */
export function getDrawingRuleDescription(
  playerHand: Hand,
  bankerHand: Hand,
  playerDrew: boolean,
  bankerDrew: boolean
): string {
  if (playerHand.isNatural || bankerHand.isNatural) {
    return 'Natural - no third card';
  }

  const descriptions: string[] = [];

  if (playerDrew) {
    descriptions.push(`Player drew on ${playerHand.cards.slice(0, 2).reduce((sum, c) => sum + c.value, 0) % 10}`);
  } else {
    descriptions.push(`Player stands on ${playerHand.value}`);
  }

  if (bankerDrew) {
    const playerThirdCard = getThirdCardValue(playerHand);
    if (playerThirdCard !== null) {
      descriptions.push(`Banker drew (Player's 3rd card: ${playerThirdCard})`);
    } else {
      descriptions.push(`Banker drew on ${bankerHand.cards.slice(0, 2).reduce((sum, c) => sum + c.value, 0) % 10}`);
    }
  } else {
    descriptions.push(`Banker stands on ${bankerHand.value}`);
  }

  return descriptions.join(', ');
}
