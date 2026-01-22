import type { Card, Suit, Rank } from '../types/game';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        faceUp: false,
        id: `${suit}-${rank}`
      });
    }
  }
  
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isRed(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function isBlack(suit: Suit): boolean {
  return suit === 'clubs' || suit === 'spades';
}

export function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  };
  return values[rank];
}

export function canStackOnTableau(topCard: Card | null, bottomCard: Card): boolean {
  if (!topCard) {
    return bottomCard.rank === 'K'; // Only kings on empty tableau
  }
  
  const topValue = getRankValue(topCard.rank);
  const bottomValue = getRankValue(bottomCard.rank);
  const differentColor = isRed(topCard.suit) !== isRed(bottomCard.suit);
  
  return topValue === bottomValue + 1 && differentColor;
}

export function canStackOnFoundation(topCard: Card | null, card: Card): boolean {
  if (!topCard) {
    return card.rank === 'A'; // Only aces on empty foundation
  }
  
  // Foundation must be same suit and next in sequence (A=1, 2, 3, ..., K=13)
  const topValue = getRankValue(topCard.rank);
  const cardValue = getRankValue(card.rank);
  
  return topCard.suit === card.suit && cardValue === topValue + 1;
}
