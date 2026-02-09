/**
 * @covers TECH-007
 * @description Comprehensive tests for Aces Up game rules
 * @constrainedBy ADR-001
 */
import { describe, it, expect } from 'vitest';
import {
  canRemoveCard,
  removeCard,
  moveCard,
  dealCards,
  isGameWon,
  isGameLost,
  type AcesUpState
} from './acesUpRules';
import type { Card } from '../../types/game';

describe('Aces Up Rules', () => {
  // Helper function to create test cards
  const createCard = (
    rank: Card['rank'],
    suit: Card['suit'] = 'hearts',
    faceUp = true,
    id?: string
  ): Card => ({
    rank,
    suit,
    faceUp,
    id: id || `${rank}-${suit}`
  });

  // Helper function to create initial empty state
  const emptyState = (): AcesUpState => ({
    piles: [[], [], [], []],
    stock: [],
    discarded: []
  });

  // Helper function to create a full deck for testing
  const createFullDeck = (): Card[] => {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Card['rank'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cards: Card[] = [];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push(createCard(rank, suit, false));
      }
    }
    
    return cards.reverse(); // Reverse so A is on top when popping
  };

  describe('canRemoveCard', () => {
    it('should return false when no higher card in same suit exists', () => {
      const piles: Card[][] = [[createCard('K', 'hearts')]];
      const card = createCard('K', 'hearts');
      
      expect(canRemoveCard(card, piles)).toBe(false);
    });

    it('should return true when higher card of same suit exists', () => {
      const piles: Card[][] = [
        [createCard('K', 'hearts')],
        [createCard('Q', 'hearts')]
      ];
      const card = createCard('Q', 'hearts');
      
      expect(canRemoveCard(card, piles)).toBe(true);
    });

    it('should return false when higher card exists but different suit', () => {
      const piles: Card[][] = [
        [createCard('K', 'spades')],
        [createCard('Q', 'hearts')]
      ];
      const card = createCard('Q', 'hearts');
      
      expect(canRemoveCard(card, piles)).toBe(false);
    });

    it('should return false when lower card of same suit exists', () => {
      const piles: Card[][] = [[createCard('5', 'hearts')]];
      const card = createCard('Q', 'hearts');
      
      expect(canRemoveCard(card, piles)).toBe(false);
    });

    it('should handle Ace as highest rank (value 14)', () => {
      const piles: Card[][] = [[createCard('A', 'hearts')]];
      const card = createCard('K', 'hearts');
      
      expect(canRemoveCard(card, piles)).toBe(true);
    });

    it('should ignore empty piles', () => {
      const piles: Card[][] = [[], [createCard('K', 'hearts')]];
      const card = createCard('Q', 'hearts');
      
      expect(canRemoveCard(card, piles)).toBe(true);
    });

    it('should skip the same card when checking', () => {
      const card = createCard('Q', 'hearts', true, 'card-1');
      const piles: Card[][] = [
        [{ ...card, id: 'card-1' }],
        [createCard('K', 'hearts')]
      ];
      
      expect(canRemoveCard(card, piles)).toBe(true);
    });
  });

  describe('removeCard', () => {
    it('should successfully remove a card that can be removed', () => {
      const state: AcesUpState = {
        piles: [[], [createCard('K', 'hearts')], [createCard('Q', 'hearts')]],
        stock: [],
        discarded: []
      };
      
      const result = removeCard(state, 2);
      
      expect(result.valid).toBe(true);
      expect(result.newState).toBeDefined();
      expect(result.newState!.piles[2]).toHaveLength(0);
      expect(result.newState!.discarded).toHaveLength(1);
      expect(result.newState!.discarded[0].rank).toBe('Q');
    });

    it('should return invalid when trying to remove from empty pile', () => {
      const state = emptyState();
      
      const result = removeCard(state, 0);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should return invalid for out of bounds pile', () => {
      const state = emptyState();
      
      const result = removeCard(state, 5);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid');
    });

    it('should return invalid when removing card that cannot be removed', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')]],
        stock: [],
        discarded: []
      };
      
      const result = removeCard(state, 0);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Cannot remove');
    });

    it('should preserve original state when move is invalid', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')]],
        stock: [],
        discarded: []
      };
      const stateCopy = JSON.stringify(state);
      
      removeCard(state, 0);
      
      expect(JSON.stringify(state)).toBe(stateCopy);
    });

    it('should show error message when pile index is negative', () => {
      const state = emptyState();
      
      const result = removeCard(state, -1);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('moveCard', () => {
    it('should move card from one pile to empty pile', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [], [], []],
        stock: [],
        discarded: []
      };
      
      const result = moveCard(state, 0, 1);
      
      expect(result.valid).toBe(true);
      expect(result.newState!.piles[0]).toHaveLength(0);
      expect(result.newState!.piles[1]).toHaveLength(1);
      expect(result.newState!.piles[1][0].rank).toBe('K');
    });

    it('should return invalid when moving to non-empty pile', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [createCard('Q', 'hearts')], [], []],
        stock: [],
        discarded: []
      };
      
      const result = moveCard(state, 0, 1);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should return invalid when moving from empty pile', () => {
      const state: AcesUpState = {
        piles: [[], [createCard('K', 'hearts')], [], []],
        stock: [],
        discarded: []
      };
      
      const result = moveCard(state, 0, 1);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Source pile is empty');
    });

    it('should return invalid when source and target are same', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [], [], []],
        stock: [],
        discarded: []
      };
      
      const result = moveCard(state, 0, 0);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('same pile');
    });

    it('should return invalid for out of bounds indices', () => {
      const state = emptyState();
      
      let result = moveCard(state, -1, 0);
      expect(result.valid).toBe(false);
      
      result = moveCard(state, 0, 5);
      expect(result.valid).toBe(false);
    });

    it('should preserve original state when move is invalid', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [createCard('Q', 'hearts')], [], []],
        stock: [],
        discarded: []
      };
      const stateCopy = JSON.stringify(state);
      
      moveCard(state, 0, 1);
      
      expect(JSON.stringify(state)).toBe(stateCopy);
    });

    it('should handle moving from any pile to any other empty pile', () => {
      const state: AcesUpState = {
        piles: [[], [], [createCard('5', 'spades')], []],
        stock: [],
        discarded: []
      };
      
      const result = moveCard(state, 2, 0);
      
      expect(result.valid).toBe(true);
      expect(result.newState!.piles[0]).toHaveLength(1);
      expect(result.newState!.piles[2]).toHaveLength(0);
    });
  });

  describe('dealCards', () => {
    it('should deal one card to each pile', () => {
      const stock = createFullDeck();
      const state: AcesUpState = {
        piles: [[], [], [], []],
        stock,
        discarded: []
      };
      
      const result = dealCards(state);
      
      expect(result.valid).toBe(true);
      expect(result.newState!.piles[0]).toHaveLength(1);
      expect(result.newState!.piles[1]).toHaveLength(1);
      expect(result.newState!.piles[2]).toHaveLength(1);
      expect(result.newState!.piles[3]).toHaveLength(1);
      expect(result.newState!.stock).toHaveLength(stock.length - 4);
    });

    it('should set dealt cards to faceUp', () => {
      const stock = [
        createCard('K', 'hearts', false),
        createCard('Q', 'hearts', false),
        createCard('J', 'diamonds', false),
        createCard('10', 'clubs', false)
      ];
      const state: AcesUpState = {
        piles: [[], [], [], []],
        stock,
        discarded: []
      };
      
      const result = dealCards(state);
      
      expect(result.valid).toBe(true);
      // Cards should be face up in result
      expect(result.newState!.piles[0][0].faceUp).toBe(true);
      expect(result.newState!.piles[1][0].faceUp).toBe(true);
      expect(result.newState!.piles[2][0].faceUp).toBe(true);
      expect(result.newState!.piles[3][0].faceUp).toBe(true);
    });

    it('should return invalid when not enough cards in stock', () => {
      const state: AcesUpState = {
        piles: [[], [], [], []],
        stock: [createCard('K', 'hearts')], // Only 1 card
        discarded: []
      };
      
      const result = dealCards(state);
      
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Not enough cards');
    });

    it('should deal to 4 piles even if some already have cards', () => {
      const stock = createFullDeck();
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [], [createCard('Q', 'spades')], []],
        stock,
        discarded: []
      };
      
      const result = dealCards(state);
      
      expect(result.valid).toBe(true);
      expect(result.newState!.piles[0]).toHaveLength(2);
      expect(result.newState!.piles[1]).toHaveLength(1);
      expect(result.newState!.piles[2]).toHaveLength(2);
      expect(result.newState!.piles[3]).toHaveLength(1);
    });

    it('should preserve original state when invalid', () => {
      const state: AcesUpState = {
        piles: [[], [], [], []],
        stock: [createCard('K', 'hearts')],
        discarded: []
      };
      const stateCopy = JSON.stringify(state);
      
      dealCards(state);
      
      expect(JSON.stringify(state)).toBe(stateCopy);
    });
  });

  describe('isGameWon', () => {
    it('should return true when only 4 aces remain and stock is empty', () => {
      const state: AcesUpState = {
        piles: [[createCard('A', 'hearts')], [createCard('A', 'diamonds')], [createCard('A', 'clubs')], [createCard('A', 'spades')]],
        stock: [],
        discarded: []
      };
      
      expect(isGameWon(state)).toBe(true);
    });

    it('should return false when stock still has cards', () => {
      const state: AcesUpState = {
        piles: [[createCard('A', 'hearts')], [createCard('A', 'diamonds')], [createCard('A', 'clubs')], [createCard('A', 'spades')]],
        stock: [createCard('K', 'hearts')],
        discarded: []
      };
      
      expect(isGameWon(state)).toBe(false);
    });

    it('should return false when non-ace cards remain', () => {
      const state: AcesUpState = {
        piles: [[createCard('A', 'hearts')], [createCard('A', 'diamonds')], [createCard('K', 'clubs')], [createCard('A', 'spades')]],
        stock: [],
        discarded: []
      };
      
      expect(isGameWon(state)).toBe(false);
    });

    it('should return false when fewer than 4 cards remain', () => {
      const state: AcesUpState = {
        piles: [[createCard('A', 'hearts')], [createCard('A', 'diamonds')], [], []],
        stock: [],
        discarded: []
      };
      
      expect(isGameWon(state)).toBe(false);
    });

    it('should return false when more than 4 cards remain', () => {
      const state: AcesUpState = {
        piles: [[createCard('A', 'hearts'), createCard('K', 'hearts')], [createCard('A', 'diamonds')], [createCard('A', 'clubs')], [createCard('A', 'spades')]],
        stock: [],
        discarded: []
      };
      
      expect(isGameWon(state)).toBe(false);
    });

    it('should return false with some empty piles and cards in others', () => {
      const state: AcesUpState = {
        piles: [[createCard('A', 'hearts'), createCard('A', 'diamonds')], [], [createCard('A', 'clubs')], [createCard('A', 'spades')]],
        stock: [],
        discarded: []
      };
      
      expect(isGameWon(state)).toBe(false);
    });
  });

  describe('isGameLost', () => {
    it('should return false when stock has cards', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [], [], []],
        stock: [createCard('Q', 'hearts')],
        discarded: []
      };
      
      expect(isGameLost(state)).toBe(false);
    });

    it('should return false when a removable card exists', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [createCard('Q', 'hearts')], [], []],
        stock: [],
        discarded: []
      };
      
      expect(isGameLost(state)).toBe(false);
    });

    it('should return false with empty pile and cards available to move', () => {
      const state: AcesUpState = {
        piles: [[], [createCard('K', 'hearts')], [createCard('Q', 'hearts')], []],
        stock: [],
        discarded: []
      };
      
      expect(isGameLost(state)).toBe(false);
    });

    it('should return true when no cards can be removed and no empty piles for moves', () => {
      const state: AcesUpState = {
        piles: [
          [createCard('K', 'hearts')],
          [createCard('K', 'diamonds')],
          [createCard('K', 'clubs')],
          [createCard('K', 'spades')]
        ],
        stock: [],
        discarded: []
      };
      
      expect(isGameLost(state)).toBe(true);
    });

    it('should return true when all piles have Kings (highest) with different suits', () => {
      const state: AcesUpState = {
        piles: [
          [createCard('2', 'hearts'), createCard('K', 'hearts')],
          [createCard('3', 'diamonds'), createCard('K', 'diamonds')],
          [createCard('4', 'clubs'), createCard('K', 'clubs')],
          [createCard('5', 'spades'), createCard('K', 'spades')]
        ],
        stock: [],
        discarded: []
      };
      
      // No removable cards (all Kings) and no empty piles
      expect(isGameLost(state)).toBe(true);
    });

    it('should return false when all piles full but some cards removable', () => {
      const state: AcesUpState = {
        piles: [
          [createCard('K', 'hearts')],
          [createCard('Q', 'hearts')],
          [createCard('2', 'diamonds')],
          [createCard('3', 'spades')]
        ],
        stock: [],
        discarded: []
      };
      
      // Q of hearts can be removed (K of hearts is higher, same suit)
      expect(isGameLost(state)).toBe(false);
    });

    it('should return true with one pile full and one empty, but no moves from full pile to empty', () => {
      const state: AcesUpState = {
        piles: [
          [createCard('K', 'hearts')], // Can move to empty
          [],
          [],
          []
        ],
        stock: [],
        discarded: []
      };
      
      // K can move to empty pile, so not lost
      expect(isGameLost(state)).toBe(false);
    });

    it('should return true when only one pile filled with K and no empty piles', () => {
      const state: AcesUpState = {
        piles: [
          [createCard('K', 'hearts')],
          [createCard('K', 'diamonds')],
          [createCard('K', 'clubs')],
          [createCard('K', 'spades')]
        ],
        stock: [],
        discarded: []
      };
      
      expect(isGameLost(state)).toBe(true);
    });

    it('should consider a non-removable card situation with no moves as lost', () => {
      const state: AcesUpState = {
        piles: [
          [createCard('A', 'hearts')], // Ace cannot be removed (highest)
          [createCard('A', 'diamonds')],
          [createCard('A', 'clubs')],
          [createCard('A', 'spades')]
        ],
        stock: [],
        discarded: []
      };
      
      expect(isGameLost(state)).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle a complete game flow', () => {
      // Start with 4 cards (one per pile)
      let state: AcesUpState = {
        piles: [
          [createCard('K', 'hearts')],
          [createCard('Q', 'diamonds')],
          [createCard('J', 'clubs')],
          [createCard('A', 'spades')]
        ],
        stock: [],
        discarded: []
      };

      // Remove Q of diamonds (K of hearts is higher, both hearts/diamonds don't help)
      // Remove J of clubs (K of hearts is higher... wait, different suits)
      // Actually, Q can't be removed unless higher diamond exists
      // Let's modify for a valid scenario

      state = {
        piles: [
          [createCard('K', 'hearts')],
          [createCard('Q', 'hearts')],
          [createCard('5', 'diamonds')],
          [createCard('6', 'diamonds')]
        ],
        stock: [],
        discarded: []
      };

      // Q of hearts can be removed (K > Q, same suit)
      const removeResult = removeCard(state, 1);
      expect(removeResult.valid).toBe(true);
      
      state = removeResult.newState!;
      
      // Now can move 5 of diamonds to empty pile
      const moveResult = moveCard(state, 2, 1);
      expect(moveResult.valid).toBe(true);
    });

    it('should prevent moves that violate game rules', () => {
      const state: AcesUpState = {
        piles: [[createCard('K', 'hearts')], [createCard('Q', 'hearts')], [], []],
        stock: [],
        discarded: []
      };

      // Cannot move to non-empty pile
      expect(moveCard(state, 0, 1).valid).toBe(false);
      
      // Cannot move from empty pile
      expect(moveCard(state, 2, 3).valid).toBe(false);
      
      // Cannot remove K (nothing higher in same suit)
      expect(removeCard(state, 0).valid).toBe(false);
    });
  });
});

