import type { Card, Rank } from '../../types/game';

export interface AcesUpState {
  piles: Card[][];
  stock: Card[];
  discarded: Card[];
}

/**
 * Get rank value for Aces Up (A=14, highest card)
 */
function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    'A': 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  };
  return values[rank];
}

export interface MoveResult {
  valid: boolean;
  newState?: AcesUpState;
  message?: string;
}

/**
 * Deep clone the game state
 */
function cloneState(state: AcesUpState): AcesUpState {
  return {
    piles: state.piles.map(pile => pile.map(card => ({ ...card }))),
    stock: state.stock.map(card => ({ ...card })),
    discarded: state.discarded.map(card => ({ ...card }))
  };
}

/**
 * Check if a card can be removed (discarded)
 * A card can be removed if there's another card of the same suit with higher rank
 */
export function canRemoveCard(card: Card, piles: Card[][]): boolean {
  const cardValue = getRankValue(card.rank);
  
  for (const pile of piles) {
    if (pile.length === 0) continue;
    
    const topCard = pile[pile.length - 1];
    if (topCard.id === card.id) continue; // Skip the same card
    
    // Can remove if same suit and this card has higher rank
    if (topCard.suit === card.suit && getRankValue(topCard.rank) > cardValue) {
      return true;
    }
  }
  
  return false;
}

/**
 * Remove (discard) a card from a pile
 */
export function removeCard(state: AcesUpState, pileIndex: number): MoveResult {
  if (pileIndex < 0 || pileIndex >= state.piles.length) {
    return { valid: false, message: 'Invalid pile index' };
  }
  
  const pile = state.piles[pileIndex];
  if (pile.length === 0) {
    return { valid: false, message: 'Pile is empty' };
  }
  
  const card = pile[pile.length - 1];
  
  if (!canRemoveCard(card, state.piles)) {
    return { valid: false, message: 'Cannot remove this card' };
  }
  
  const newState = cloneState(state);
  const removedCard = newState.piles[pileIndex].pop()!;
  newState.discarded.push(removedCard);
  
  return { valid: true, newState };
}

/**
 * Move a card from one pile to an empty pile
 */
export function moveCard(state: AcesUpState, fromPile: number, toPile: number): MoveResult {
  if (fromPile < 0 || fromPile >= state.piles.length || toPile < 0 || toPile >= state.piles.length) {
    return { valid: false, message: 'Invalid pile index' };
  }
  
  if (fromPile === toPile) {
    return { valid: false, message: 'Cannot move to same pile' };
  }
  
  const sourcePile = state.piles[fromPile];
  const targetPile = state.piles[toPile];
  
  if (sourcePile.length === 0) {
    return { valid: false, message: 'Source pile is empty' };
  }
  
  if (targetPile.length !== 0) {
    return { valid: false, message: 'Target pile must be empty' };
  }
  
  const newState = cloneState(state);
  const card = newState.piles[fromPile].pop()!;
  newState.piles[toPile].push(card);
  
  return { valid: true, newState };
}

/**
 * Deal one card to each pile from stock
 */
export function dealCards(state: AcesUpState): MoveResult {
  if (state.stock.length < state.piles.length) {
    return { valid: false, message: 'Not enough cards in stock' };
  }
  
  const newState = cloneState(state);
  
  for (let i = 0; i < newState.piles.length; i++) {
    const card = newState.stock.pop()!;
    card.faceUp = true;
    newState.piles[i].push(card);
  }
  
  return { valid: true, newState };
}

/**
 * Check if the game is won (only 4 aces remaining)
 */
export function isGameWon(state: AcesUpState): boolean {
  // Game is won only if stock is empty AND only 4 aces remain
  if (state.stock.length > 0) {
    return false; // Still cards to deal
  }
  
  // Should have exactly 4 cards left, all aces
  let totalCards = 0;
  let aceCount = 0;
  
  for (const pile of state.piles) {
    totalCards += pile.length;
    if (pile.length > 0) {
      const topCard = pile[pile.length - 1];
      if (topCard.rank === 'A') {
        aceCount++;
      }
    }
  }
  
  return totalCards === 4 && aceCount === 4;
}

/**
 * Check if the game is lost (no valid moves available)
 */
export function isGameLost(state: AcesUpState): boolean {
  if (state.stock.length > 0) {
    return false; // Can still deal cards
  }
  
  // Check if any card can be removed
  for (let i = 0; i < state.piles.length; i++) {
    if (state.piles[i].length === 0) continue;
    const card = state.piles[i][state.piles[i].length - 1];
    if (canRemoveCard(card, state.piles)) {
      return false;
    }
  }
  
  // Check if any card can be moved to empty pile
  const hasEmptyPile = state.piles.some(pile => pile.length === 0);
  const hasNonEmptyPile = state.piles.some(pile => pile.length > 0);
  
  if (hasEmptyPile && hasNonEmptyPile) {
    return false; // Can move cards to empty piles
  }
  
  return true; // No valid moves
}
