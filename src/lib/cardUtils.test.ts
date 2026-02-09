/**
 * @covers TECH-009
 * @description Comprehensive tests for cardUtils module
 * @constrainedBy ADR-001
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createDeck,
  shuffleDeck,
  isRed,
  isBlack,
  getRankValue,
  canStackOnTableau,
  canStackOnFoundation
} from './cardUtils';
import type { Card, Rank, Suit } from '../types/game';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function makeCard(rank: Rank, suit: Suit): Card {
  return {
    suit,
    rank,
    faceUp: true,
    id: `${suit}-${rank}`
  };
}

describe('cardUtils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createDeck', () => {
    it('creates a standard 52-card deck with unique ids', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);

      const ids = deck.map(card => card.id);
      expect(new Set(ids).size).toBe(52);
    });

    it('creates all suit and rank combinations with faceUp false', () => {
      const deck = createDeck();

      for (const suit of suits) {
        for (const rank of ranks) {
          const match = deck.find(card => card.suit === suit && card.rank === rank);
          expect(match).toBeDefined();
          expect(match?.faceUp).toBe(false);
          expect(match?.id).toBe(`${suit}-${rank}`);
        }
      }
    });

    it('creates new card objects on each call', () => {
      const deckA = createDeck();
      const deckB = createDeck();

      expect(deckA).not.toBe(deckB);
      expect(deckA[0]).not.toBe(deckB[0]);
      expect(deckA[0]).toEqual(deckB[0]);
    });
  });

  describe('shuffleDeck', () => {
    it('returns a new array without mutating the original', () => {
      const deck = createDeck();
      const original = [...deck];
      const shuffled = shuffleDeck(deck);

      expect(shuffled).not.toBe(deck);
      expect(deck).toEqual(original);
      expect(shuffled).toHaveLength(deck.length);
    });

    it('contains all original cards after shuffle', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);

      const deckIds = deck.map(card => card.id).sort();
      const shuffledIds = shuffled.map(card => card.id).sort();
      expect(shuffledIds).toEqual(deckIds);
    });

    it('uses Fisher-Yates swapping order with deterministic randomness', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);

      const deck = [
        makeCard('A', 'hearts'),
        makeCard('2', 'hearts'),
        makeCard('3', 'hearts')
      ];

      const shuffled = shuffleDeck(deck);

      expect(shuffled.map(card => card.rank)).toEqual(['2', '3', 'A']);
    });
  });

  describe('isRed', () => {
    it('returns true for red suits and false otherwise', () => {
      expect(isRed('hearts')).toBe(true);
      expect(isRed('diamonds')).toBe(true);
      expect(isRed('clubs')).toBe(false);
      expect(isRed('spades')).toBe(false);
    });
  });

  describe('isBlack', () => {
    it('returns true for black suits and false otherwise', () => {
      expect(isBlack('clubs')).toBe(true);
      expect(isBlack('spades')).toBe(true);
      expect(isBlack('hearts')).toBe(false);
      expect(isBlack('diamonds')).toBe(false);
    });
  });

  describe('getRankValue', () => {
    it('maps all ranks to their numeric values', () => {
      const expected: Record<Rank, number> = {
        'A': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'J': 11,
        'Q': 12,
        'K': 13
      };

      for (const rank of ranks) {
        expect(getRankValue(rank)).toBe(expected[rank]);
      }
    });
  });

  describe('canStackOnTableau', () => {
    it('allows only Kings on empty tableau', () => {
      expect(canStackOnTableau(null, makeCard('K', 'hearts'))).toBe(true);
      expect(canStackOnTableau(null, makeCard('Q', 'hearts'))).toBe(false);
    });

    it('allows opposite color with descending rank', () => {
      const top = makeCard('7', 'hearts');
      const bottom = makeCard('6', 'clubs');
      expect(canStackOnTableau(top, bottom)).toBe(true);
    });

    it('disallows same color even if descending', () => {
      const top = makeCard('7', 'hearts');
      const bottom = makeCard('6', 'diamonds');
      expect(canStackOnTableau(top, bottom)).toBe(false);
    });

    it('disallows opposite color with non-descending rank', () => {
      const top = makeCard('7', 'hearts');
      const bottom = makeCard('5', 'clubs');
      expect(canStackOnTableau(top, bottom)).toBe(false);
    });

    it('allows Ace below 2 with opposite color', () => {
      const top = makeCard('2', 'hearts');
      const bottom = makeCard('A', 'clubs');
      expect(canStackOnTableau(top, bottom)).toBe(true);
    });

    it('disallows any card below an Ace', () => {
      const top = makeCard('A', 'hearts');
      const bottom = makeCard('K', 'clubs');
      expect(canStackOnTableau(top, bottom)).toBe(false);
    });
  });

  describe('canStackOnFoundation', () => {
    it('allows only Aces on empty foundation', () => {
      expect(canStackOnFoundation(null, makeCard('A', 'spades'))).toBe(true);
      expect(canStackOnFoundation(null, makeCard('2', 'spades'))).toBe(false);
    });

    it('allows same suit with ascending rank', () => {
      const top = makeCard('Q', 'hearts');
      const card = makeCard('K', 'hearts');
      expect(canStackOnFoundation(top, card)).toBe(true);
    });

    it('disallows same suit with non-ascending rank', () => {
      const top = makeCard('Q', 'hearts');
      const card = makeCard('A', 'hearts');
      expect(canStackOnFoundation(top, card)).toBe(false);
    });

    it('disallows different suit even if ascending', () => {
      const top = makeCard('Q', 'hearts');
      const card = makeCard('K', 'clubs');
      expect(canStackOnFoundation(top, card)).toBe(false);
    });

    it('disallows descending rank', () => {
      const top = makeCard('3', 'spades');
      const card = makeCard('2', 'spades');
      expect(canStackOnFoundation(top, card)).toBe(false);
    });
  });
});
