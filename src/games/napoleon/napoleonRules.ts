import type { Card, Rank } from '../../types/game';
import { getRankValue } from '../../lib/cardUtils';

/**
 * Napoleon-specific rank values where Ace = 1 (for center pile logic)
 */
function getNapoleonRankValue(rank: Rank): number {
  switch (rank) {
    case 'A': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case '10': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
  }
}

export interface NapoleonState {
  center: Card[];           // Napoleon's tomb - builds down from 6 to A (repeating)
  corners: Card[][];        // 4 corners with 7s - build up to K (7 cards each)
  helpers: (Card | null)[];  // 4 helper piles (cross pattern) - max 1 card each
  sixPile: Card[];          // Storage for 6s - can hold multiple 6s
  stock: Card[];            // Draw pile (face down)
  waste: Card[];            // Face-up cards drawn from stock
}

export interface MoveResult {
  valid: boolean;
  newState?: NapoleonState;
  message?: string;
}

/**
 * Deep clone the game state
 */
function cloneState(state: NapoleonState): NapoleonState {
  return {
    center: state.center.map(card => ({ ...card })),
    corners: state.corners.map(pile => pile.map(card => ({ ...card }))),
    helpers: state.helpers.map(card => card ? { ...card } : null),
    sixPile: state.sixPile.map(card => ({ ...card })),
    stock: state.stock.map(card => ({ ...card })),
    waste: state.waste.map(card => ({ ...card }))
  };
}

/**
 * Check if a card can be placed on the center pile (Napoleon's tomb)
 * Builds down: 6 -> 5 -> 4 -> 3 -> 2 -> 1(A) -> 6 (repeat 4 times)
 * In this game, Ace = 1, so sequence is simply descending from 6 to 1, then restart at 6
 */
export function canMoveToCenter(card: Card, centerPile: Card[]): boolean {
  if (centerPile.length === 0) {
    return card.rank === '6'; // Only 6 can start
  }
  
  const topCard = centerPile[centerPile.length - 1];
  const topValue = getNapoleonRankValue(topCard.rank);
  const cardValue = getNapoleonRankValue(card.rank);
  
  // If top is Ace (1), next must be 6 (start new cycle)
  if (topValue === 1) {
    return cardValue === 6;
  }
  
  // Otherwise, must be exactly one rank lower
  return cardValue === topValue - 1;
}

/**
 * Check if a card can be placed on a corner pile
 * Builds up: 7 -> 8 -> 9 -> 10 -> J -> Q -> K (ignoring suit)
 */
export function canMoveToCorner(card: Card, cornerPile: Card[]): boolean {
  if (cornerPile.length === 0) {
    return card.rank === '7'; // Only 7 can start a corner
  }
  
  const topCard = cornerPile[cornerPile.length - 1];
  const topValue = getRankValue(topCard.rank);
  const cardValue = getRankValue(card.rank);
  
  // King is the highest, can't place anything on it
  if (topCard.rank === 'K') {
    return false;
  }
  
  // Must be one rank higher (ignoring suit)
  return cardValue === topValue + 1;
}

/**
 * Check if a card can be placed on a helper pile
 */
export function canMoveToHelper(helperCard: Card | null): boolean {
  return helperCard === null; // Helper can only hold one card
}

/**
 * Check if a card can be placed in six pile
 */
export function canMoveToSixPile(card: Card): boolean {
  return card.rank === '6';
}

/**
 * Try to place current card automatically
 * Returns which pile it was placed on, or null if couldn't place
 */
export function tryAutoPlace(state: NapoleonState, card: Card): { success: boolean, newState?: NapoleonState, target?: string } {
  const newState = cloneState(state);
  
  // Try center first
  if (canMoveToCenter(card, newState.center)) {
    newState.center.push(card);
    return { success: true, newState, target: 'center' };
  }
  
  // Try any corner
  for (let i = 0; i < 4; i++) {
    if (canMoveToCorner(card, newState.corners[i])) {
      newState.corners[i].push(card);
      return { success: true, newState, target: `corner${i}` };
    }
  }
  
  // Try any helper pile
  for (let i = 0; i < 4; i++) {
    if (canMoveToHelper(newState.helpers[i])) {
      newState.helpers[i] = card;
      return { success: true, newState, target: `helper${i}` };
    }
  }
  
  // If it's a 6, put it in six pile
  if (canMoveToSixPile(card)) {
    newState.sixPile.push(card);
    return { success: true, newState, target: 'sixPile' };
  }
  
  return { success: false };
}

/**
 * Check if the game is won
 * All corners complete (7 cards each: 7->K)
 * Center complete with all remaining cards in correct sequence
 */
export function isGameWon(state: NapoleonState): boolean {
  // All 4 corners should be complete (7 cards each ending in K)
  const cornersComplete = state.corners.every(pile => 
    pile.length === 7 && pile[pile.length - 1].rank === 'K'
  );
  
  // All other cards should be in center (52 - 28 = 24 cards)
  // And it should end with an Ace
  const centerComplete = state.center.length >= 24 && 
                         state.center[state.center.length - 1].rank === 'A';
  
  // No cards left elsewhere
  const noCardsLeft = state.stock.length === 0 &&
                      state.waste.length === 0 &&
                      state.helpers.every(h => h === null) &&
                      state.sixPile.length === 0;
  
  return cornersComplete && centerComplete && noCardsLeft;
}

/**
 * Count how many sixes have been placed in the center (indicates current cycle number)
 */
export function countCycles(centerPile: Card[]): number {
  let cycles = 0;
  for (let i = 0; i < centerPile.length; i++) {
    if (centerPile[i].rank === '6') {
      cycles++;
    }
  }
  return cycles;
}

/**
 * Check if the game is lost (no moves available)
 */
export function isGameLost(state: NapoleonState): boolean {
  // Game can't be lost if stock still has cards
  if (state.stock.length > 0) return false;
  
  // Check if waste card can move
  if (state.waste.length > 0) {
    const wasteCard = state.waste[state.waste.length - 1];
    
    // Check if can move to center
    if (canMoveToCenter(wasteCard, state.center)) return false;
    
    // Check if can move to any corner
    for (const corner of state.corners) {
      if (canMoveToCorner(wasteCard, corner)) return false;
    }
    
    // Check if can move to any helper (if empty)
    for (let i = 0; i < state.helpers.length; i++) {
      if (canMoveToHelper(state.helpers[i])) return false;
    }
    
    // Check if it's a 6 and can go to sixPile
    if (canMoveToSixPile(wasteCard)) return false;
  }
  
  // Check if any helper card can move
  for (const helperCard of state.helpers) {
    if (helperCard === null) continue;
    
    // Check if can move to center
    if (helperCard && canMoveToCenter(helperCard, state.center)) return false;
    
    // Check if can move to any corner
    for (const corner of state.corners) {
      if (canMoveToCorner(helperCard, corner)) return false;
    }
  }
  
  // Check if any six can move from sixPile
  if (state.sixPile.length > 0) {
    const sixCard = state.sixPile[state.sixPile.length - 1];
    
    // Check if can move to center
    if (canMoveToCenter(sixCard, state.center)) return false;
    
    // Check if can move to any helper
    for (let i = 0; i < state.helpers.length; i++) {
      if (canMoveToHelper(state.helpers[i])) return false;
    }
  }
  
  return true;
}
