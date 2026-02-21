/**
 * @covers TECH-008
 * @description Comprehensive tests for Clock Solitaire game rules
 * @constrainedBy ADR-001
 */
import { describe, it, expect } from 'vitest';
import {
  getRankPileIndex,
  revealCard,
  moveRevealedCard,
  isGameWon,
  isGameLost,
  type ClockState
} from './clockRules';
import type { Card } from '../../types/game';

// Helper function to create test cards
function createCard(
  rank: Card['rank'],
  suit: Card['suit'] = 'hearts',
  faceUp = false,
  id?: string
): Card {
  return {
    rank,
    suit,
    faceUp,
    id: id || `${rank}-${suit}`
  };
}

// Helper function to create initial empty state
function emptyState(): ClockState {
  return {
    piles: [
      [], [], [], [], [], [], [], [], [], [], [], [], []
    ],
    revealedCardPileIndex: null
  };
}

// Helper function to create 13-pile state
function createStateWithPiles(pileCards: Card[][]): ClockState {
  const state: ClockState = {
    piles: pileCards,
    revealedCardPileIndex: null
  };
  // Ensure 13 piles exist
  while (state.piles.length < 13) {
    state.piles.push([]);
  }
  return state;
}

describe('Clock Solitaire Rules', () => {

  describe('getRankPileIndex', () => {
    it('should map Q to index 0 (12 o\'clock)', () => {
      expect(getRankPileIndex('Q')).toBe(0);
    });

    it('should map A to index 1 (1 o\'clock)', () => {
      expect(getRankPileIndex('A')).toBe(1);
    });

    it('should map 2 to index 2 (2 o\'clock)', () => {
      expect(getRankPileIndex('2')).toBe(2);
    });

    it('should map 3 to index 3', () => {
      expect(getRankPileIndex('3')).toBe(3);
    });

    it('should map 4 to index 4', () => {
      expect(getRankPileIndex('4')).toBe(4);
    });

    it('should map 5 to index 5', () => {
      expect(getRankPileIndex('5')).toBe(5);
    });

    it('should map 6 to index 6', () => {
      expect(getRankPileIndex('6')).toBe(6);
    });

    it('should map 7 to index 7', () => {
      expect(getRankPileIndex('7')).toBe(7);
    });

    it('should map 8 to index 8', () => {
      expect(getRankPileIndex('8')).toBe(8);
    });

    it('should map 9 to index 9', () => {
      expect(getRankPileIndex('9')).toBe(9);
    });

    it('should map 10 to index 10', () => {
      expect(getRankPileIndex('10')).toBe(10);
    });

    it('should map J to index 11 (11 o\'clock)', () => {
      expect(getRankPileIndex('J')).toBe(11);
    });

    it('should map K to index 12 (center)', () => {
      expect(getRankPileIndex('K')).toBe(12);
    });
  });

  describe('revealCard', () => {
    it('should reveal a face-down card at top of pile', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [], [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);

      const result = revealCard(state, 0);

      expect(result.valid).toBe(true);
      expect(result.newState).toBeDefined();
      expect(result.newState!.piles[0][0].faceUp).toBe(true);
      expect(result.newState!.revealedCardPileIndex).toBe(0);
    });

    it('should return invalid when pile is empty', () => {
      const state = emptyState();

      const result = revealCard(state, 0);

      expect(result.valid).toBe(false);
    });

    it('should return invalid when top card already face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [], [], [], [], [], [], [], [], [], [], [], []
      ]);

      const result = revealCard(state, 0);

      expect(result.valid).toBe(false);
    });

    it('should reveal from correct pile when multiple piles have cards', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'diamonds', false)],
        [createCard('2', 'clubs', false)],
        [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);

      const result = revealCard(state, 2);

      expect(result.valid).toBe(true);
      expect(result.newState!.piles[2][0].faceUp).toBe(true);
      expect(result.newState!.revealedCardPileIndex).toBe(2);
      // Other piles should remain unchanged
      expect(result.newState!.piles[0][0].faceUp).toBe(false);
      expect(result.newState!.piles[1][0].faceUp).toBe(false);
    });

    it('should only reveal top card of pile with multiple cards', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false), createCard('A', 'hearts', false)],
        [], [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);

      const result = revealCard(state, 0);

      expect(result.valid).toBe(true);
      // Top card (last in array) should be revealed
      expect(result.newState!.piles[0][1].faceUp).toBe(true);
      // Bottom card should remain face-down
      expect(result.newState!.piles[0][0].faceUp).toBe(false);
    });

    it('should preserve original state when invalid', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [], [], [], [], [], [], [], [], [], [], [], []
      ]);
      const stateCopy = JSON.stringify(state);

      revealCard(state, 0);

      expect(JSON.stringify(state)).toBe(stateCopy);
    });
  });

  describe('moveRevealedCard', () => {
    it('should move revealed card to correct pile', () => {
      const state = createStateWithPiles([
        [], // 0: Q position
        [createCard('A', 'hearts', false)], // 1: A position
        [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);
      // Simulate revealing A from pile 1
      const revealedState = revealCard(state, 1);
      const stateWithRevealed = revealedState.newState!;

      const result = moveRevealedCard(stateWithRevealed, 1);

      expect(result.valid).toBe(true);
      expect(result.newState!.piles[1]).toContainEqual(createCard('A', 'hearts', true));
    });

    it('should return invalid when no card is revealed', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [], [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card
      ]);

      const result = moveRevealedCard(state, 1);

      expect(result.valid).toBe(false);
    });

    it('should return invalid when dropping on wrong pile', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [], [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);
      const revealedState = revealCard(state, 0);
      const stateWithRevealed = revealedState.newState!;

      // A (rank) should go to pile 1, not pile 0
      const result = moveRevealedCard(stateWithRevealed, 0);

      expect(result.valid).toBe(false);
    });

    it('should place card at bottom of target pile and reveal new top', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [createCard('Q', 'diamonds', false), createCard('K', 'diamonds', false)],
        [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);
      const revealedState = revealCard(state, 0);
      const stateWithRevealed = revealedState.newState!;

      const result = moveRevealedCard(stateWithRevealed, 1);

      expect(result.valid).toBe(true);
      // A should be at bottom (index 0)
      expect(result.newState!.piles[1][0].rank).toBe('A');
      // K should be revealed (top card, index 2)
      expect(result.newState!.piles[1][2].faceUp).toBe(true);
    });

    it('should set revealedCardPileIndex to target pile for continuing sequence', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [createCard('Q', 'diamonds', false)],
        [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);
      const revealedState = revealCard(state, 0);
      const stateWithRevealed = revealedState.newState!;

      const result = moveRevealedCard(stateWithRevealed, 1);

      expect(result.valid).toBe(true);
      expect(result.newState!.revealedCardPileIndex).toBe(1);
    });

    it('should handle moving King to center pile', () => {
      const state = createStateWithPiles([
        [createCard('K', 'hearts', false)],
        [], [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'diamonds', true)] // Center has face-up card (game started)
      ]);
      const revealedState = revealCard(state, 0);
      const stateWithRevealed = revealedState.newState!;

      const result = moveRevealedCard(stateWithRevealed, 12);

      expect(result.valid).toBe(true);
      expect(result.newState!.piles[12][0].rank).toBe('K');
      expect(result.newState!.revealedCardPileIndex).toBe(12);
    });

    it('should return isWon true when 4th King placed in center with all face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('K', 'hearts', false)],  // 4th King here, face-down
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]  // 3 Kings in center
      ]);
      // Reveal the 4th King from pile 5
      const revealedState = revealCard(state, 5);
      const stateWithRevealed = revealedState.newState!;

      // Move 4th King to center pile 12 - this makes it the 4th King in center
      const result = moveRevealedCard(stateWithRevealed, 12);

      expect(result.valid).toBe(true);
      expect(result.isWon).toBe(true);
    });

    it('should return isLost true when 4th King placed in center with face-down cards', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],  // Face-down card that wasn't revealed
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('K', 'hearts', false)],  // 4th King, face-down (will be revealed)
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]  // 3 Kings in center
      ]);
      // Reveal the 4th King from pile 5
      const revealedState = revealCard(state, 5);
      const stateWithRevealed = revealedState.newState!;

      // Move 4th King to center - but Q pile (0) still has face-down card, so it's a loss
      const result = moveRevealedCard(stateWithRevealed, 12);

      expect(result.valid).toBe(true);
      expect(result.isLost).toBe(true);
    });

    it('should return valid true and isWon/isLost undefined for normal moves', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [createCard('Q', 'diamonds', false)],
        [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);
      const revealedState = revealCard(state, 0);
      const stateWithRevealed = revealedState.newState!;

      const result = moveRevealedCard(stateWithRevealed, 1);

      expect(result.valid).toBe(true);
      expect(result.isWon).toBeUndefined();
      expect(result.isLost).toBeUndefined();
    });

    it('should preserve original state when move is invalid', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [], [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true)] // Center has face-up card (game started)
      ]);
      const revealedState = revealCard(state, 0);
      const stateWithRevealed = revealedState.newState!;
      const stateCopy = JSON.stringify(stateWithRevealed);

      moveRevealedCard(stateWithRevealed, 0); // Wrong pile

      expect(JSON.stringify(stateWithRevealed)).toBe(stateCopy);
    });
  });

  describe('isGameWon', () => {
    it('should return true when all cards are face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]
      ]);

      expect(isGameWon(state)).toBe(true);
    });

    it('should return false when any pile has face-down card', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]
      ]);

      expect(isGameWon(state)).toBe(false);
    });

    it('should return false with empty piles', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [],
        [createCard('2', 'clubs', true)],
        [], [], [], [], [], [], [], [], [],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]
      ]);

      expect(isGameWon(state)).toBe(false);
    });

    it('should return false when center pile incomplete', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true)] // Only 2 kings
      ]);

      expect(isGameWon(state)).toBe(false);
    });
  });

  describe('isGameLost', () => {
    it('should return false when less than 4 kings in center', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'diamonds', false)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true)]
      ]);

      expect(isGameLost(state)).toBe(false);
    });

    it('should return false when 4 kings in center and all cards face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', true)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]
      ]);

      expect(isGameLost(state)).toBe(false);
    });

    it('should return true when 4 kings in center and any card is face-down', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]
      ]);

      expect(isGameLost(state)).toBe(true);
    });

    it('should return true when 4 kings in center with multiple face-down cards', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false), createCard('3', 'hearts', false)],
        [createCard('A', 'diamonds', false)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        [createCard('8', 'hearts', true)],
        [createCard('9', 'diamonds', true)],
        [createCard('10', 'clubs', true)],
        [createCard('J', 'spades', true)],
        [createCard('K', 'hearts', true), createCard('K', 'diamonds', true), createCard('K', 'clubs', true), createCard('K', 'spades', true)]
      ]);

      expect(isGameLost(state)).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle a simple card reveal and move sequence', () => {
      const state = createStateWithPiles([
        [createCard('A', 'hearts', false)],
        [createCard('Q', 'diamonds', false)],
        [], [], [], [], [], [], [], [], [], [],
        [createCard('K', 'spades', false)] // center pile
      ]);

      // Must start from center pile (index 12)
      const revealResult = revealCard(state, 12);
      expect(revealResult.valid).toBe(true);
      const afterReveal = revealResult.newState!;

      // Move K to pile 12 (center)
      const moveResult = moveRevealedCard(afterReveal, 12);
      expect(moveResult.valid).toBe(true);
      expect(moveResult.newState!.piles[12][0].rank).toBe('K');
    });

    it('should handle moving Kings to center', () => {
      const state = createStateWithPiles([
        [createCard('K', 'hearts', false)],
        [createCard('K', 'diamonds', false)],
        [createCard('K', 'clubs', false)],
        [createCard('K', 'spades', false)],
        [createCard('Q', 'hearts', true)],
        [createCard('A', 'diamonds', true)],
        [createCard('2', 'clubs', true)],
        [createCard('3', 'spades', true)],
        [createCard('4', 'hearts', true)],
        [createCard('5', 'diamonds', true)],
        [createCard('6', 'clubs', true)],
        [createCard('7', 'spades', true)],
        []
      ]);

      // Reveal first King
      let revealResult = revealCard(state, 0);
      let currentState = revealResult.newState!;

      // Move to center
      let moveResult = moveRevealedCard(currentState, 12);
      expect(moveResult.valid).toBe(true);
      currentState = moveResult.newState!;

      // Continue with other Kings
      revealResult = revealCard(currentState, 1);
      currentState = revealResult.newState!;
      moveResult = moveRevealedCard(currentState, 12);
      expect(moveResult.valid).toBe(true);
      currentState = moveResult.newState!;

      revealResult = revealCard(currentState, 2);
      currentState = revealResult.newState!;
      moveResult = moveRevealedCard(currentState, 12);
      expect(moveResult.valid).toBe(true);
      currentState = moveResult.newState!;

      revealResult = revealCard(currentState, 3);
      currentState = revealResult.newState!;
      moveResult = moveRevealedCard(currentState, 12);
      expect(moveResult.valid).toBe(true);
      expect(moveResult.isWon).toBe(true);
    });
  });

  /**
   * @covers BUG-003
   * @description Tests that the game can only be started from center pile
   * @constrainedBy ADR-001
   */
  describe('Center pile start rule', () => {
    it('should allow revealing from center pile (index 12) when no cards are face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'hearts', false)],
        [createCard('2', 'hearts', false)],
        [createCard('3', 'hearts', false)],
        [createCard('4', 'hearts', false)],
        [createCard('5', 'hearts', false)],
        [createCard('6', 'hearts', false)],
        [createCard('7', 'hearts', false)],
        [createCard('8', 'hearts', false)],
        [createCard('9', 'hearts', false)],
        [createCard('10', 'hearts', false)],
        [createCard('J', 'hearts', false)],
        [createCard('K', 'hearts', false)] // center pile
      ]);

      const result = revealCard(state, 12);

      expect(result.valid).toBe(true);
      expect(result.newState).toBeDefined();
      expect(result.newState!.piles[12][0].faceUp).toBe(true);
    });

    it('should NOT allow revealing from non-center pile when no cards are face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'hearts', false)],
        [createCard('2', 'hearts', false)],
        [createCard('3', 'hearts', false)],
        [createCard('4', 'hearts', false)],
        [createCard('5', 'hearts', false)],
        [createCard('6', 'hearts', false)],
        [createCard('7', 'hearts', false)],
        [createCard('8', 'hearts', false)],
        [createCard('9', 'hearts', false)],
        [createCard('10', 'hearts', false)],
        [createCard('J', 'hearts', false)],
        [createCard('K', 'hearts', false)] // center pile
      ]);

      // Try to reveal from pile 0 (Q position) - should fail
      const result = revealCard(state, 0);

      expect(result.valid).toBe(false);
      expect(result.newState).toBeUndefined();
    });

    it('should allow revealing from any pile after game has started', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'hearts', false)],
        [createCard('2', 'hearts', false)],
        [createCard('3', 'hearts', false)],
        [createCard('4', 'hearts', false)],
        [createCard('5', 'hearts', false)],
        [createCard('6', 'hearts', false)],
        [createCard('7', 'hearts', false)],
        [createCard('8', 'hearts', false)],
        [createCard('9', 'hearts', false)],
        [createCard('10', 'hearts', false)],
        [createCard('J', 'hearts', false)],
        [createCard('K', 'hearts', true)] // center pile has face-up card (game started)
      ]);

      // Should allow revealing from non-center pile after game started
      const result = revealCard(state, 0);

      expect(result.valid).toBe(true);
      expect(result.newState).toBeDefined();
    });

    it('should block revealing from pile 5 when no cards are face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'hearts', false)],
        [createCard('2', 'hearts', false)],
        [createCard('3', 'hearts', false)],
        [createCard('4', 'hearts', false)],
        [createCard('5', 'hearts', false)],
        [createCard('6', 'hearts', false)],
        [createCard('7', 'hearts', false)],
        [createCard('8', 'hearts', false)],
        [createCard('9', 'hearts', false)],
        [createCard('10', 'hearts', false)],
        [createCard('J', 'hearts', false)],
        [createCard('K', 'hearts', false)]
      ]);

      const result = revealCard(state, 5);

      expect(result.valid).toBe(false);
    });

    it('should block revealing from pile 11 when no cards are face-up', () => {
      const state = createStateWithPiles([
        [createCard('Q', 'hearts', false)],
        [createCard('A', 'hearts', false)],
        [createCard('2', 'hearts', false)],
        [createCard('3', 'hearts', false)],
        [createCard('4', 'hearts', false)],
        [createCard('5', 'hearts', false)],
        [createCard('6', 'hearts', false)],
        [createCard('7', 'hearts', false)],
        [createCard('8', 'hearts', false)],
        [createCard('9', 'hearts', false)],
        [createCard('10', 'hearts', false)],
        [createCard('J', 'hearts', false)],
        [createCard('K', 'hearts', false)]
      ]);

      const result = revealCard(state, 11);

      expect(result.valid).toBe(false);
    });
  });
});
