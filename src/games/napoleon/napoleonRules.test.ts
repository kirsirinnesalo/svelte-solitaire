/**
 * @covers TECH-006
 * @description Comprehensive tests for Napoleon's Tomb game rules
 * @constrainedBy ADR-001
 */

import { describe, it, expect } from 'vitest';
import { 
  isGameLost, 
  isGameWon, 
  canMoveToCenter, 
  canMoveToCorner,
  canMoveToHelper,
  canMoveToSixPile,
  tryAutoPlace,
  countCycles,
  type NapoleonState 
} from './napoleonRules';
import type { Card } from '../../types/game';

describe('Napoleon Rules - isGameLost', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  const emptyState: NapoleonState = {
    center: [],
    corners: [[], [], [], []],
    helpers: [null, null, null, null],
    sixPile: [],
    stock: [],
    waste: []
  };

  it('should not be lost when stock has cards', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [createCard('6')],
      waste: []
    };
    
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when waste has cards and recycling is available (maxRecycles=2, recycleCount=0)', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K')] // Unplayable King
    };
    
    // maxRecycles=2 means 1 recycle allowed (2-1=1)
    // recycleCount=0 means no recycles used yet
    // So: 0 < 2-1 = 0 < 1 = TRUE -> can still recycle -> not lost
    expect(isGameLost(state, 0, 2)).toBe(false);
  });

  it('should NOT be lost when waste has unplayable card but helpers are empty (maxRecycles=1, recycleCount=0)', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K')], // Can't start center or corner with K
      helpers: [null, null, null, null] // But K CAN go to empty helper
    };
    
    // maxRecycles=1 means 0 recycles allowed (1-1=0)
    // recycleCount=0 means no recycles used
    // So: 0 < 1-1 = 0 < 0 = FALSE -> cannot recycle
    // K cannot start center (needs 6) or corner (needs 7)
    // BUT K can go to empty helper -> NOT LOST
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should be lost when waste has unplayable card, no recycles, and helpers are full (maxRecycles=1, recycleCount=0)', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K')], // Can't start center or corner with K
      helpers: [createCard('Q'), createCard('J'), createCard('10'), createCard('9')] // All helpers full
    };
    
    // K cannot start center or corner
    // K cannot go to helpers (all full)
    // K cannot go to sixPile (not a 6)
    // And helpers themselves cannot move (Q, J, 10, 9 can't start center/corner)
    expect(isGameLost(state, 0, 1)).toBe(true);
  });

  it('should not be lost when waste has playable card (6 can start center)', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [createCard('6')]
    };
    
    // 6 can start center
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when waste has playable card (7 can start corner)', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [createCard('7')]
    };
    
    // 7 can start corner
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when helper has playable card', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [],
      helpers: [createCard('6'), null, null, null]
    };
    
    // Helper has 6 which can start center
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should not be lost when sixPile has playable card', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [],
      sixPile: [createCard('6')],
      center: [] // 6 can start center
    };
    
    // 6 from sixPile can move to center -> not lost
    // Note: 6s from sixPile cannot move to helpers (game rule)
    expect(isGameLost(state, 0, 1)).toBe(false);
  });

  it('should be lost when sixPile has 6 but center already started and no other moves', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [],
      sixPile: [createCard('6')],
      center: [createCard('5')], // Center started, expecting 4 next (not 6)
      helpers: [createCard('K'), createCard('Q'), createCard('J'), createCard('10')] // All full, none can move
    };
    
    // 6 cannot continue center (needs 4 after 5)
    // 6 cannot start corner (needs 7)
    // 6 cannot go to helpers (all full)
    expect(isGameLost(state, 0, 1)).toBe(true);
  });

  it('should be lost when no cards anywhere', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [],
      helpers: [null, null, null, null],
      sixPile: []
    };
    
    expect(isGameLost(state, 0, 1)).toBe(true);
  });

  it('should be lost when helpers full but none can move', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [],
      helpers: [
        createCard('K'),
        createCard('Q'),
        createCard('J'),
        createCard('10')
      ],
      center: [], // Empty, needs 6 to start
      corners: [[], [], [], []] // Empty, need 7 to start
    };
    
    // K, Q, J, 10 cannot start center (needs 6) or corners (needs 7)
    expect(isGameLost(state, 0, 1)).toBe(true);
  });

  it('should not be lost with unlimited recycles and waste', () => {
    const state: NapoleonState = {
      ...emptyState,
      stock: [],
      waste: [createCard('K')]
    };
    
    // Unlimited recycles means always can recycle
    expect(isGameLost(state, 999, 'unlimited')).toBe(false);
  });
});

describe('Napoleon Rules - isGameWon', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should be won when all corners complete and center has 24 cards ending in A', () => {
    // Create 4 complete corners (7->K, 7 cards each = 28 cards total)
    const completeCorner = [
      createCard('7'), createCard('8'), createCard('9'), 
      createCard('10'), createCard('J'), createCard('Q'), createCard('K')
    ];
    
    // Create center with 4 cycles of 6->A (24 cards total)
    const center = [
      // Cycle 1
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      // Cycle 2
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      // Cycle 3
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      // Cycle 4
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A')
    ];
    
    const state: NapoleonState = {
      center,
      corners: [
        [...completeCorner],
        [...completeCorner],
        [...completeCorner],
        [...completeCorner]
      ],
      helpers: [null, null, null, null],
      sixPile: [],
      stock: [],
      waste: []
    };
    
    console.log('Testing win state:', {
      centerLength: state.center.length,
      centerLast: state.center[state.center.length - 1].rank,
      cornersComplete: state.corners.every(c => c.length === 7 && c[6].rank === 'K')
    });
    
    expect(isGameWon(state)).toBe(true);
  });

  it('should not be won when center has wrong number of cards', () => {
    const completeCorner = [
      createCard('7'), createCard('8'), createCard('9'), 
      createCard('10'), createCard('J'), createCard('Q'), createCard('K')
    ];
    
    const state: NapoleonState = {
      center: [createCard('6'), createCard('5')], // Only 2 cards, needs 24
      corners: [
        [...completeCorner],
        [...completeCorner],
        [...completeCorner],
        [...completeCorner]
      ],
      helpers: [null, null, null, null],
      sixPile: [],
      stock: [],
      waste: []
    };
    
    expect(isGameWon(state)).toBe(false);
  });

  it('should not be won when center does not end with A', () => {
    const completeCorner = [
      createCard('7'), createCard('8'), createCard('9'), 
      createCard('10'), createCard('J'), createCard('Q'), createCard('K')
    ];
    
    const center = Array(24).fill(null).map(() => createCard('6'));
    center[23] = createCard('K'); // Wrong ending
    
    const state: NapoleonState = {
      center,
      corners: [
        [...completeCorner],
        [...completeCorner],
        [...completeCorner],
        [...completeCorner]
      ],
      helpers: [null, null, null, null],
      sixPile: [],
      stock: [],
      waste: []
    };
    
    expect(isGameWon(state)).toBe(false);
  });

  it('should not be won when corners incomplete', () => {
    const center = Array(24).fill(null).map((_, i) => {
      const ranks: Card['rank'][] = ['6', '5', '4', '3', '2', 'A'];
      return createCard(ranks[i % 6]);
    });
    center[23] = createCard('A');

    const state: NapoleonState = {
      center,
      corners: [
        [createCard('7')], // Incomplete
        [],
        [],
        []
      ],
      helpers: [null, null, null, null],
      sixPile: [],
      stock: [],
      waste: []
    };
    
    expect(isGameWon(state)).toBe(false);
  });

  it('should not be won when cards still in stock', () => {
    const completeCorner = [
      createCard('7'), createCard('8'), createCard('9'), 
      createCard('10'), createCard('J'), createCard('Q'), createCard('K')
    ];
    
    const center = Array(24).fill(null).map((_, i) => {
      const ranks: Card['rank'][] = ['6', '5', '4', '3', '2', 'A'];
      return createCard(ranks[i % 6]);
    });
    center[23] = createCard('A');
    
    const state: NapoleonState = {
      center,
      corners: [
        [...completeCorner],
        [...completeCorner],
        [...completeCorner],
        [...completeCorner]
      ],
      helpers: [null, null, null, null],
      sixPile: [],
      stock: [createCard('K')], // Still has cards
      waste: []
    };
    
    expect(isGameWon(state)).toBe(false);
  });
});

describe('Napoleon Rules - canMoveToCenter', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should allow 6 on empty center pile', () => {
    expect(canMoveToCenter(createCard('6'), [])).toBe(true);
  });

  it('should reject non-6 on empty center pile', () => {
    expect(canMoveToCenter(createCard('5'), [])).toBe(false);
    expect(canMoveToCenter(createCard('7'), [])).toBe(false);
    expect(canMoveToCenter(createCard('A'), [])).toBe(false);
    expect(canMoveToCenter(createCard('K'), [])).toBe(false);
  });

  it('should build down from 6 to A', () => {
    const pile: Card[] = [createCard('6')];
    expect(canMoveToCenter(createCard('5'), pile)).toBe(true);
    
    pile.push(createCard('5'));
    expect(canMoveToCenter(createCard('4'), pile)).toBe(true);
    
    pile.push(createCard('4'));
    expect(canMoveToCenter(createCard('3'), pile)).toBe(true);
    
    pile.push(createCard('3'));
    expect(canMoveToCenter(createCard('2'), pile)).toBe(true);
    
    pile.push(createCard('2'));
    expect(canMoveToCenter(createCard('A'), pile)).toBe(true);
  });

  it('should restart at 6 after Ace', () => {
    const pile = [
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A')
    ];
    expect(canMoveToCenter(createCard('6'), pile)).toBe(true);
  });

  it('should reject out-of-sequence cards', () => {
    const pile = [createCard('6')];
    expect(canMoveToCenter(createCard('6'), pile)).toBe(false);
    expect(canMoveToCenter(createCard('4'), pile)).toBe(false);
    expect(canMoveToCenter(createCard('7'), pile)).toBe(false);
    expect(canMoveToCenter(createCard('A'), pile)).toBe(false);
  });

  it('should reject cards after K sequence', () => {
    const pile = [createCard('6'), createCard('5'), createCard('4')];
    expect(canMoveToCenter(createCard('2'), pile)).toBe(false); // Expects 3
    expect(canMoveToCenter(createCard('5'), pile)).toBe(false);
  });
});

describe('Napoleon Rules - canMoveToCorner', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should allow 7 on empty corner pile', () => {
    expect(canMoveToCorner(createCard('7'), [])).toBe(true);
  });

  it('should reject non-7 on empty corner pile', () => {
    expect(canMoveToCorner(createCard('6'), [])).toBe(false);
    expect(canMoveToCorner(createCard('8'), [])).toBe(false);
    expect(canMoveToCorner(createCard('A'), [])).toBe(false);
    expect(canMoveToCorner(createCard('K'), [])).toBe(false);
  });

  it('should build up from 7 to K', () => {
    const pile: Card[] = [createCard('7')];
    expect(canMoveToCorner(createCard('8'), pile)).toBe(true);
    
    pile.push(createCard('8'));
    expect(canMoveToCorner(createCard('9'), pile)).toBe(true);
    
    pile.push(createCard('9'));
    expect(canMoveToCorner(createCard('10'), pile)).toBe(true);
    
    pile.push(createCard('10'));
    expect(canMoveToCorner(createCard('J'), pile)).toBe(true);
    
    pile.push(createCard('J'));
    expect(canMoveToCorner(createCard('Q'), pile)).toBe(true);
    
    pile.push(createCard('Q'));
    expect(canMoveToCorner(createCard('K'), pile)).toBe(true);
  });

  it('should reject cards on King', () => {
    const pile = [
      createCard('7'), createCard('8'), createCard('9'), 
      createCard('10'), createCard('J'), createCard('Q'), createCard('K')
    ];
    expect(canMoveToCorner(createCard('A'), pile)).toBe(false);
    expect(canMoveToCorner(createCard('K'), pile)).toBe(false);
  });

  it('should reject out-of-sequence cards', () => {
    const pile = [createCard('7')];
    expect(canMoveToCorner(createCard('7'), pile)).toBe(false);
    expect(canMoveToCorner(createCard('9'), pile)).toBe(false);
    expect(canMoveToCorner(createCard('10'), pile)).toBe(false);
  });

  it('should reject cards after Q', () => {
    const pile = [createCard('7'), createCard('8')];
    expect(canMoveToCorner(createCard('10'), pile)).toBe(false); // Expects 9
    expect(canMoveToCorner(createCard('7'), pile)).toBe(false);
  });
});

describe('Napoleon Rules - canMoveToHelper', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should allow card on empty helper', () => {
    expect(canMoveToHelper(null)).toBe(true);
  });

  it('should reject card on occupied helper', () => {
    expect(canMoveToHelper(createCard('5'))).toBe(false);
    expect(canMoveToHelper(createCard('K'))).toBe(false);
    expect(canMoveToHelper(createCard('A'))).toBe(false);
  });
});

describe('Napoleon Rules - canMoveToSixPile', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should allow 6', () => {
    expect(canMoveToSixPile(createCard('6'))).toBe(true);
  });

  it('should reject non-6 cards', () => {
    expect(canMoveToSixPile(createCard('5'))).toBe(false);
    expect(canMoveToSixPile(createCard('7'))).toBe(false);
    expect(canMoveToSixPile(createCard('A'))).toBe(false);
    expect(canMoveToSixPile(createCard('K'))).toBe(false);
  });
});

describe('Napoleon Rules - tryAutoPlace', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  const emptyState: NapoleonState = {
    center: [],
    corners: [[], [], [], []],
    helpers: [null, null, null, null],
    sixPile: [],
    stock: [],
    waste: []
  };

  it('should place 6 on empty center', () => {
    const card = createCard('6');
    const result = tryAutoPlace(emptyState, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toBe('center');
    expect(result.newState?.center).toHaveLength(1);
    expect(result.newState?.center[0]).toEqual(card);
  });

  it('should place 7 on corner', () => {
    const card = createCard('7');
    const result = tryAutoPlace(emptyState, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toMatch(/^corner\d$/);
    expect(result.newState?.corners.some(pile => pile.length === 1)).toBe(true);
  });

  it('should place 6 in sixPile when center is not empty', () => {
    const state: NapoleonState = {
      ...emptyState,
      center: [createCard('6'), createCard('5')]
    };
    const card = createCard('6');
    const result = tryAutoPlace(state, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toBe('sixPile');
    expect(result.newState?.sixPile).toHaveLength(1);
  });

  it('should place card on helper when no other option', () => {
    const card = createCard('5'); // Can't go on center (needs 6), can't go on corner (needs 7)
    const result = tryAutoPlace(emptyState, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toMatch(/^helper\d$/);
    expect(result.newState?.helpers.filter(h => h !== null)).toHaveLength(1);
  });

  it('should fail when no placement possible', () => {
    const state: NapoleonState = {
      ...emptyState,
      helpers: [createCard('2'), createCard('3'), createCard('4'), createCard('K')],
      center: [createCard('6'), createCard('5'), createCard('4')]
    };
    const card = createCard('5'); // Can't place: helpers full, center wants 3
    const result = tryAutoPlace(state, card);
    
    expect(result.success).toBe(false);
    expect(result.newState).toBeUndefined();
  });

  it('should prioritize center over corners', () => {
    const state: NapoleonState = {
      ...emptyState,
      center: [createCard('6')]
    };
    const card = createCard('5'); // Can go on center
    const result = tryAutoPlace(state, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toBe('center');
  });

  it('should prioritize corners over sixPile', () => {
    const state: NapoleonState = {
      ...emptyState,
      corners: [[createCard('7')], [], [], []]
    };
    const card = createCard('8'); // Can go on corner
    const result = tryAutoPlace(state, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toBe('corner0');
  });

  it('should place continuing center sequence', () => {
    const state: NapoleonState = {
      ...emptyState,
      center: [createCard('6'), createCard('5'), createCard('4'), createCard('3'), createCard('2')]
    };
    const card = createCard('A'); // Completes cycle
    const result = tryAutoPlace(state, card);
    
    expect(result.success).toBe(true);
    expect(result.target).toBe('center');
    expect(result.newState?.center).toHaveLength(6);
  });

  it('should not mutate original state', () => {
    const state: NapoleonState = {
      ...emptyState,
      center: [createCard('6')]
    };
    const originalCenter = state.center.length;
    
    tryAutoPlace(state, createCard('5'));
    
    expect(state.center.length).toBe(originalCenter); // Original unchanged
  });
});

describe('Napoleon Rules - countCycles', () => {
  const createCard = (rank: Card['rank'], suit: Card['suit'] = 'hearts'): Card => ({
    rank,
    suit,
    faceUp: true,
    id: `${rank}-${suit}`
  });

  it('should count 0 cycles for empty center', () => {
    expect(countCycles([])).toBe(0);
  });

  it('should count 1 after first 6 (incomplete cycle)', () => {
    const pile = [createCard('6'), createCard('5'), createCard('4')];
    expect(countCycles(pile)).toBe(1); // One 6 found
  });

  it('should count 1 cycle after first 6', () => {
    const pile = [createCard('6')];
    expect(countCycles(pile)).toBe(1);
  });

  it('should count 2 cycles after second 6', () => {
    const pile = [
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      createCard('6')
    ];
    expect(countCycles(pile)).toBe(2);
  });

  it('should count 3 cycles after third 6', () => {
    const pile = [
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      createCard('6')
    ];
    expect(countCycles(pile)).toBe(3);
  });

  it('should count 4 cycles for complete center', () => {
    const pile = [
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A'),
      createCard('6'), createCard('5'), createCard('4'), 
      createCard('3'), createCard('2'), createCard('A')
    ];
    expect(countCycles(pile)).toBe(4);
  });

  it('should count cycles correctly with mixed sequences', () => {
    const pile = [
      createCard('6'), // Cycle 1
      createCard('5'), createCard('4'), createCard('3'), 
      createCard('2'), createCard('A'),
      createCard('6'), // Cycle 2
      createCard('5'), createCard('4')
    ];
    expect(countCycles(pile)).toBe(2);
  });
});
