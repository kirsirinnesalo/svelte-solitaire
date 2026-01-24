import { describe, it, expect } from 'vitest';
import { isGameLost, isGameWon, canMoveToTableau, canMoveToFoundation, type KlondikeState } from './klondikeRules';
import type { Card } from '../../types/game';

describe('Klondike Rules - isGameLost', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts', faceUp = true): Card => ({
    rank,
    suit,
    faceUp,
    id: `${rank}-${suit}`
  });

  const emptyState: KlondikeState = {
    tableau: [[], [], [], [], [], [], []],
    foundations: [[], [], [], []],
    stock: [],
    waste: []
  };

  it('should not be lost when stock has cards', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [createCard('K', 'hearts', false)],
      waste: []
    };
    
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when waste has cards and recycling is available', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K')] // Unplayable King
    };
    
    // maxRecycles=2 means 1 recycle allowed (2-1=1)
    // recycleCount=0 means no recycles used yet
    // So: 0 < 2-1 = 0 < 1 = TRUE -> can still recycle -> not lost
    expect(isGameLost(state, 0, 2)).toBe(false);
  });

  it('should not be lost when waste has playable card (King can go to empty tableau)', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K')],
      tableau: [[], [], [], [], [], [], []] // All empty, K can go anywhere
    };
    
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when waste has playable card (Ace can start foundation)', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('A')]
    };
    
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when tableau has face-down cards AND moves available', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K', 'hearts')], // K can go to empty pile
      tableau: [
        [createCard('Q', 'hearts', false)], // Has face-down card, but Q can't be moved yet
        [], [], [], [], [], [] // Empty piles - K can go here!
      ]
    };
    
    // K can move to empty pile, so game is not lost
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should be lost even when tableau has face-down cards if no moves available', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('J', 'hearts')], // Red J
      tableau: [
        [createCard('Q', 'spades', false), createCard('10', 'hearts')], // Face-down Q, but 10 can't move (all red below)
        [createCard('9', 'hearts')], // Red 9
        [createCard('8', 'diamonds')], // Red 8
        [createCard('7', 'hearts')], // Red 7
        [createCard('6', 'diamonds')], // Red 6
        [createCard('5', 'hearts')], // Red 5
        [createCard('4', 'diamonds')]  // Red 4
      ],
      foundations: [
        [createCard('A', 'spades')], [createCard('A', 'clubs')],
        [createCard('A', 'diamonds')], [createCard('A', 'hearts')]
      ]
    };
    
    // Even though pile 0 has face-down card, no cards can move (all same color)
    // Face-down card won't be revealed because 10H can't move anywhere
    expect(isGameLost(state, 0, 1)).toBe(true);
  });

  it('should be lost when no moves available and no recycles left', () => {
    // Create a TRUE deadlock: same color cards, no sequences possible
    // All red on top, no black cards can go on red, no red can go on red
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('J', 'hearts')], // Red J
      tableau: [
        [createCard('Q', 'hearts')], // Red Q, J can't go (same color)
        [createCard('Q', 'diamonds')], // Red Q, J can't go (same color)
        [createCard('10', 'hearts')], // Red 10, J can't go (same color, would need black J on 10)
        [createCard('10', 'diamonds')], // Red 10, J can't go (same color)
        [createCard('9', 'hearts')], // Red 9, J can't go (same color)
        [createCard('9', 'diamonds')], // Red 9, J can't go (same color)
        [createCard('8', 'hearts')]  // Red 8, J can't go (same color)
      ],
      foundations: [
        [createCard('A', 'spades')], // J hearts can't go (wrong suit)
        [createCard('A', 'clubs')],  // J hearts can't go (wrong suit)
        [createCard('A', 'diamonds')], // J hearts can't go (wrong suit, needs 2)
        [createCard('A', 'hearts')] // J hearts can't go (needs 2)
      ]
    };
    
    // J hearts can't go on any tableau (all same color)
    // No tableau cards can move to each other (all red, need black)
    // J hearts can't go on foundation (needs 2 first)
    // No empty piles (all 7 have cards)
    // No face-down cards
    // No recycles left
    expect(isGameLost(state, 0, 1)).toBe(true);
  });

  it('should not be lost when tableau cards can move to foundation', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [],
      tableau: [
        [createCard('A', 'hearts')], // Can move to foundation
        [], [], [], [], [], []
      ],
      foundations: [[], [], [], []]
    };
    
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when tableau cards can move between piles', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [],
      tableau: [
        [createCard('K', 'spades')], // Black K
        [createCard('Q', 'hearts')], // Red Q can go on black K
        [], [], [], [], []
      ]
    };
    
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should be lost when completely stuck with no recycles', () => {
    // All cards same color prevents tableau moves
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('J', 'spades')], // J of spades (black)
      tableau: [
        [createCard('K', 'spades')], // Black K, no moves
        [createCard('K', 'clubs')],  // Black K, no moves
        [createCard('Q', 'spades')], // Black Q, can't go on other black cards
        [createCard('Q', 'clubs')],  // Black Q, can't go on other black cards
        [createCard('10', 'spades')], // Black 10, J can't go here (same color)
        [createCard('10', 'clubs')],  // Black 10, J can't go here (same color)
        [createCard('A', 'hearts')]   // Red A, can move to foundation!
      ],
      foundations: [
        [], // Empty - A hearts can go here!
        [createCard('A', 'spades')], // J spades can't go here (needs 2)
        [], []
      ]
    };
    
    // Wait, this has moves! Fix it:
    const deadlockState: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('J', 'spades')], // J of spades (black)
      tableau: [
        [createCard('K', 'spades')], // Black K
        [createCard('K', 'clubs')],  // Black K
        [createCard('Q', 'spades')], // Black Q
        [createCard('Q', 'clubs')],  // Black Q
        [createCard('10', 'spades')], // Black 10, J can't go (same color)
        [createCard('10', 'clubs')],  // Black 10, J can't go (same color)
        [createCard('9', 'spades')]   // Black 9, 10 can't move to other 10s (same suit)
      ],
      foundations: [
        [createCard('A', 'hearts')], // J spades can't go (wrong suit)
        [createCard('A', 'diamonds')], // J spades can't go (wrong suit)
        [createCard('A', 'clubs')], // J spades can't go (needs 2)
        [createCard('A', 'spades')] // J spades can't go (needs 2)
      ]
    };
    
    // J spades can't go anywhere (all tableau cards same color)
    // No tableau-to-tableau moves (all black cards can't stack on each other)
    // No face-down cards
    expect(isGameLost(deadlockState, 0, 1)).toBe(true);
  });

  it('should not be lost with unlimited recycles and waste has cards', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [createCard('Q')]
    };
    
    expect(isGameLost(state, 999, 'unlimited')).toBe(false);
  });

  it('should be lost with unlimited recycles when no cards in waste/stock and no moves', () => {
    const state: KlondikeState = {
      ...emptyState,
      stock: [],
      waste: [], // NO cards in waste
      tableau: [
        [createCard('Q', 'hearts')],
        [createCard('Q', 'diamonds')],
        [createCard('10', 'hearts')],
        [createCard('10', 'diamonds')],
        [createCard('9', 'hearts')],
        [createCard('9', 'diamonds')],
        [createCard('8', 'hearts')]
      ],
      foundations: [
        [createCard('A', 'spades')],
        [createCard('A', 'clubs')],
        [createCard('A', 'diamonds')],
        [createCard('A', 'hearts')]
      ]
    };
    
    // Even with unlimited recycles, if waste is empty and no moves available, game is lost
    expect(isGameLost(state, 0, 'unlimited')).toBe(true);
  });
});

describe('Klondike Rules - isGameWon', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should be won when all foundations complete', () => {
    const completeFoundation = [
      createCard('A', 'hearts'),
      createCard('2', 'hearts'),
      createCard('3', 'hearts'),
      createCard('4', 'hearts'),
      createCard('5', 'hearts'),
      createCard('6', 'hearts'),
      createCard('7', 'hearts'),
      createCard('8', 'hearts'),
      createCard('9', 'hearts'),
      createCard('10', 'hearts'),
      createCard('J', 'hearts'),
      createCard('Q', 'hearts'),
      createCard('K', 'hearts')
    ];

    const state: KlondikeState = {
      tableau: [[], [], [], [], [], [], []],
      foundations: [
        [...completeFoundation],
        completeFoundation.map(c => ({...c, suit: 'diamonds'})),
        completeFoundation.map(c => ({...c, suit: 'clubs'})),
        completeFoundation.map(c => ({...c, suit: 'spades'}))
      ],
      stock: [],
      waste: []
    };

    expect(isGameWon(state)).toBe(true);
  });

  it('should not be won when foundations incomplete', () => {
    const state: KlondikeState = {
      tableau: [[], [], [], [], [], [], []],
      foundations: [
        [createCard('A', 'hearts')], // Only 1 card
        [],
        [],
        []
      ],
      stock: [],
      waste: []
    };

    expect(isGameWon(state)).toBe(false);
  });

  it('should not be won when cards still in tableau', () => {
    const completeFoundation = [
      createCard('A', 'hearts'),
      createCard('2', 'hearts'),
      createCard('3', 'hearts'),
      createCard('4', 'hearts'),
      createCard('5', 'hearts'),
      createCard('6', 'hearts'),
      createCard('7', 'hearts'),
      createCard('8', 'hearts'),
      createCard('9', 'hearts'),
      createCard('10', 'hearts'),
      createCard('J', 'hearts'),
      createCard('Q', 'hearts'),
      createCard('K', 'hearts')
    ];

    const state: KlondikeState = {
      tableau: [
        [createCard('K', 'spades')], // Still has a card
        [], [], [], [], [], []
      ],
      foundations: [
        [...completeFoundation],
        completeFoundation.map(c => ({...c, suit: 'diamonds'})),
        completeFoundation.map(c => ({...c, suit: 'clubs'})),
        [] // Spades foundation empty because K in tableau
      ],
      stock: [],
      waste: []
    };

    expect(isGameWon(state)).toBe(false);
  });
});
