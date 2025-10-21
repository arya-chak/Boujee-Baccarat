// Quick test script to understand baccarat game logic
// Run with: node test-game.js

// Simulate baccarat hand calculations

function calculateHandValue(cards) {
  const sum = cards.reduce((total, card) => total + card, 0);
  return sum % 10; // Baccarat rule: modulo 10
}

console.log("🎰 Baccarat Hand Calculation Examples\n");

// Example 1: Simple hand
const hand1 = [7, 2]; // 7 + 2 = 9
console.log(`Hand 1: ${hand1.join(" + ")} = ${calculateHandValue(hand1)}`);

// Example 2: Hand over 10
const hand2 = [9, 6]; // 9 + 6 = 15 -> 5
console.log(`Hand 2: ${hand2.join(" + ")} = ${calculateHandValue(hand2)} (15 mod 10 = 5)`);

// Example 3: Face cards are 0
const hand3 = [0, 0, 9]; // King + Queen + 9 = 9
console.log(`Hand 3: King + Queen + 9 = ${calculateHandValue(hand3)}`);

// Example 4: Natural 8
const hand4 = [5, 3]; // Natural 8
console.log(`Hand 4: ${hand4.join(" + ")} = ${calculateHandValue(hand4)} ⭐ NATURAL!`);

// Example 5: Natural 9
const hand5 = [6, 3]; // Natural 9
console.log(`Hand 5: ${hand5.join(" + ")} = ${calculateHandValue(hand5)} ⭐ NATURAL!`);

console.log("\n🎯 Drawing Rules Examples\n");

// Player rules
console.log("Player Rule: Draw on 0-5, Stand on 6-7\n");

// Banker rules (simplified)
console.log("Banker Rules (if Player drew):");
console.log("- Banker 0-2: Always draw");
console.log("- Banker 3: Draw unless Player's 3rd card is 8");
console.log("- Banker 4: Draw if Player's 3rd card is 2-7");
console.log("- Banker 5: Draw if Player's 3rd card is 4-7");
console.log("- Banker 6: Draw if Player's 3rd card is 6-7");
console.log("- Banker 7-9: Never draw");

console.log("\n💰 Payout Examples\n");

const playerBet = 100;
console.log(`$${playerBet} on Player wins → Win $${playerBet * 1.0} (1:1) → Total: $${playerBet + playerBet * 1.0}`);
console.log(`$${playerBet} on Banker wins → Win $${playerBet * 0.95} (0.95:1) → Total: $${playerBet + playerBet * 0.95}`);
console.log(`$${playerBet} on Tie wins → Win $${playerBet * 8.0} (8:1) → Total: $${playerBet + playerBet * 8.0}`);
console.log(`$${playerBet} on Tie but Player/Banker wins → Lose $${playerBet}`);

console.log("\n✅ Try these in the browser:");
console.log("1. Bet $10 on Player, click DEAL");
console.log("2. Watch the cards appear");
console.log("3. See the result and your balance update");
console.log("4. Check your statistics!\n");
