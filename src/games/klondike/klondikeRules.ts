import type { Card } from '../../types/game';
import { canStackOnTableau, canStackOnFoundation, getRankValue } from '../../lib/cardUtils';

export interface KlondikeState {
  tableau: Card[][];
  foundations: Card[][];
  stock: Card[];
  waste: Card[];
}

export interface MoveResult {
  valid: boolean;
  newState?: KlondikeState;
  message?: string;
}

/**
 * Check if a card can be moved to a tableau pile
 */
export function canMoveToTableau(card: Card, targetPile: Card[]): boolean {
  if (targetPile.length === 0) {
    return getRankValue(card.rank) === 13; // Only Kings on empty piles
  }
  const topCard = targetPile[targetPile.length - 1];
  return canStackOnTableau(topCard, card);
}

/**
 * Check if a card can be moved to a foundation pile
 */
export function canMoveToFoundation(card: Card, targetPile: Card[]): boolean {
  if (targetPile.length === 0) {
    return card.rank === 'A'; // Only Aces start foundations (A is now value 14)
  }
  const topCard = targetPile[targetPile.length - 1];
  return canStackOnFoundation(topCard, card);
}

/**
 * Deep clone the game state
 */
function cloneState(state: KlondikeState): KlondikeState {
  return {
    tableau: state.tableau.map(pile => pile.map(card => ({ ...card }))),
    foundations: state.foundations.map(pile => pile.map(card => ({ ...card }))),
    stock: state.stock.map(card => ({ ...card })),
    waste: state.waste.map(card => ({ ...card }))
  };
}

/**
 * Move a card or cards from one location to another
 */
export function moveCard(
  state: KlondikeState,
  from: { type: 'tableau' | 'waste' | 'foundation', index: number, cardIndex?: number },
  to: { type: 'tableau' | 'foundation', index: number }
): MoveResult {
  // Clone state for immutability
  const newState = cloneState(state);
  
  // Get source card(s)
  let cards: Card[];
  
  if (from.type === 'waste') {
    if (newState.waste.length === 0) {
      return { valid: false, message: 'Waste is empty' };
    }
    cards = [newState.waste.pop()!];
  } else if (from.type === 'tableau') {
    const pile = newState.tableau[from.index];
    if (pile.length === 0) {
      return { valid: false, message: 'Tableau pile is empty' };
    }
    
    const cardIndex = from.cardIndex ?? pile.length - 1;
    if (cardIndex >= pile.length) {
      return { valid: false, message: 'Invalid card index' };
    }
    
    // Check that the card being dragged is face up
    if (!pile[cardIndex].faceUp) {
      return { valid: false, message: 'Cannot move face-down cards' };
    }
    
    // Take card and all cards above it
    cards = pile.splice(cardIndex);
    
    // Flip the new top card if the pile is not empty
    if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
      pile[pile.length - 1].faceUp = true;
    }
  } else if (from.type === 'foundation') {
    const pile = newState.foundations[from.index];
    if (pile.length === 0) {
      return { valid: false, message: 'Foundation pile is empty' };
    }
    cards = [pile.pop()!];
  } else {
    return { valid: false, message: 'Invalid source type' };
  }

  // Validate and apply move to destination
  if (to.type === 'tableau') {
    const targetPile = newState.tableau[to.index];
    
    // For tableau, check only the first card of the sequence
    if (!canMoveToTableau(cards[0], targetPile)) {
      return { valid: false, message: 'Invalid tableau move' };
    }
    
    targetPile.push(...cards);
  } else if (to.type === 'foundation') {
    // Can only move single cards to foundation
    if (cards.length > 1) {
      return { valid: false, message: 'Can only move one card to foundation at a time' };
    }
    
    const targetPile = newState.foundations[to.index];
    
    if (!canMoveToFoundation(cards[0], targetPile)) {
      return { valid: false, message: 'Invalid foundation move' };
    }
    
    targetPile.push(cards[0]);
  } else {
    return { valid: false, message: 'Invalid destination type' };
  }

  return { valid: true, newState };
}

/**
 * Check if the game is won (all foundations complete)
 */
export function isGameWon(state: KlondikeState): boolean {
  return state.foundations.every(pile => pile.length === 13);
}

/**
 * Check if the game is lost (no moves available)
 */
export function isGameLost(state: KlondikeState, recycleCount: number, drawCount: number): boolean {
  // Game can't be lost if stock still has cards or can recycle
  if (state.stock.length > 0) return false;
  if (drawCount === 3 || (drawCount === 1 && recycleCount < 2)) return false;
  
  // Check if waste card can move anywhere
  if (state.waste.length > 0) {
    const wasteCard = state.waste[state.waste.length - 1];
    
    // Check foundations
    for (const foundation of state.foundations) {
      if (canMoveToFoundation(wasteCard, foundation)) return false;
    }
    
    // Check tableau
    for (const tableau of state.tableau) {
      if (canMoveToTableau(wasteCard, tableau)) return false;
    }
  }
  
  // Check if any tableau card can move
  for (let i = 0; i < state.tableau.length; i++) {
    const pile = state.tableau[i];
    if (pile.length === 0) continue;
    
    // Find first face-up card
    let firstFaceUpIndex = pile.findIndex(card => card.faceUp);
    if (firstFaceUpIndex === -1) continue;
    
    for (let j = firstFaceUpIndex; j < pile.length; j++) {
      const card = pile[j];
      
      // Check foundations (only for single cards at top)
      if (j === pile.length - 1) {
        for (const foundation of state.foundations) {
          if (canMoveToFoundation(card, foundation)) return false;
        }
      }
      
      // Check other tableau piles
      for (let k = 0; k < state.tableau.length; k++) {
        if (k === i) continue;
        if (canMoveToTableau(card, state.tableau[k])) return false;
      }
    }
  }
  
  return true;
}
