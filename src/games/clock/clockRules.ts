import type { Card, Rank } from '../../types/game';

export interface ClockState {
  piles: Card[][]; // 13 piles: indices 0-11 are clock positions, 12 is center (kings)
  revealedCardPileIndex: number | null; // Which pile has a revealed card on top (waiting to be dragged)
}

export interface ClockMoveResult {
  valid: boolean;
  newState?: ClockState;
  isWon?: boolean;
  isLost?: boolean;
}

// Map rank to pile index (Q=0/12 o'clock, A=1/1 o'clock, 2=2/2 o'clock, ..., J=11/11 o'clock, K=center)
export function getRankPileIndex(rank: Rank): number {
  const rankMap: Record<Rank, number> = {
    'Q': 0,  // 12 o'clock
    'A': 1,  // 1 o'clock
    '2': 2,  // 2 o'clock
    '3': 3,  // 3 o'clock
    '4': 4,  // 4 o'clock
    '5': 5,  // 5 o'clock
    '6': 6,  // 6 o'clock
    '7': 7,  // 7 o'clock
    '8': 8,  // 8 o'clock
    '9': 9,  // 9 o'clock
    '10': 10, // 10 o'clock
    'J': 11,  // 11 o'clock
    'K': 12   // Center
  };
  return rankMap[rank];
}

// Reveal the top card of a pile
export function revealCard(state: ClockState, pileIndex: number): ClockMoveResult {
  const pile = state.piles[pileIndex];
  
  // No cards left in pile
  if (pile.length === 0) {
    return { valid: false };
  }
  
  // Card already revealed
  if (pile[pile.length - 1].faceUp) {
    return { valid: false };
  }
  
  // Check if game has started (any card is face-up)
  const gameStarted = state.piles.some(p => p.some(c => c.faceUp));
  
  // If game hasn't started, only allow revealing from center pile (index 12)
  if (!gameStarted && pileIndex !== 12) {
    return { valid: false };
  }
  
  // Create new state with revealed card
  const newPiles = state.piles.map(p => [...p]);
  const topCard = newPiles[pileIndex][newPiles[pileIndex].length - 1];
  topCard.faceUp = true;
  
  return {
    valid: true,
    newState: {
      piles: newPiles,
      revealedCardPileIndex: pileIndex
    }
  };
}

// Move revealed card to its correct pile
export function moveRevealedCard(state: ClockState, toPileIndex: number): ClockMoveResult {
  if (state.revealedCardPileIndex === null) {
    return { valid: false };
  }
  
  const fromPile = state.piles[state.revealedCardPileIndex];
  if (fromPile.length === 0) {
    return { valid: false };
  }
  
  const card = fromPile[fromPile.length - 1];
  const correctPileIndex = getRankPileIndex(card.rank);
  
  // Check if dropped on correct pile
  if (toPileIndex !== correctPileIndex) {
    return { valid: false };
  }
  
  // Create new state
  const newPiles = state.piles.map(p => [...p]);
  
  // Remove card from source pile
  const movedCard = newPiles[state.revealedCardPileIndex].pop()!;
  
  // Add to bottom of target pile (insert at beginning)
  newPiles[toPileIndex].unshift(movedCard);
  
  // Reveal top card of target pile if it has any face-down cards
  if (newPiles[toPileIndex].length > 0) {
    const topCard = newPiles[toPileIndex][newPiles[toPileIndex].length - 1];
    if (!topCard.faceUp) {
      topCard.faceUp = true;
    }
  }
  
  // Check if 4th king just went to center pile (game-ending condition)
  const kingsInCenter = newPiles[12].filter(c => c.rank === 'K').length;
  
  if (movedCard.rank === 'K' && toPileIndex === 12 && kingsInCenter === 4) {
    // Game ends when 4th king is placed in center
    // Check if all cards are face up (win) or if there are still face-down cards (loss)
    const allFaceUp = newPiles.every(pile => pile.every(c => c.faceUp));
    const hasAnyCards = newPiles.some(pile => pile.length > 0);
    
    return {
      valid: true,
      newState: {
        piles: newPiles,
        revealedCardPileIndex: null
      },
      isWon: allFaceUp && hasAnyCards,
      isLost: !allFaceUp && hasAnyCards
    };
  }
  
  // Normal move - next reveal will be from the target pile
  return {
    valid: true,
    newState: {
      piles: newPiles,
      revealedCardPileIndex: toPileIndex
    }
  };
}

export function isGameWon(state: ClockState): boolean {
  // To win:
  // 1. All cards must be face-up (all revealed)
  // 2. Center pile (index 12) must have exactly 4 Kings
  // 3. All 12 non-center piles must have at least one card (valid game state)
  const centerKingCount = state.piles[12].filter(c => c.rank === 'K').length;
  const allFaceUp = state.piles.every(pile => pile.length === 0 || pile.every(c => c.faceUp));
  const allNonCenterHaveCards = state.piles.slice(0, 12).every(pile => pile.length > 0);
  return allFaceUp && centerKingCount === 4 && allNonCenterHaveCards;
}

export function isGameLost(state: ClockState): boolean {
  const centerPile = state.piles[12];
  const kingsInCenter = centerPile.filter(c => c.rank === 'K').length;
  
  if (kingsInCenter < 4) return false;
  
  // Game is lost if 4th king is in center and any pile has face-down cards
  return state.piles.some(pile => pile.some(c => !c.faceUp));
}
