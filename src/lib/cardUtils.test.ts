/**
 * @covers TECH-001
 * @description Example tests for cardUtils module demonstrating Vitest setup
 * @constrainedBy ADR-001
 */
import { describe, it, expect } from 'vitest';
import {
  createDeck,
  shuffleDeck,
  isRed,
  isBlack,
  getRankValue,
  canStackOnTableau,
  canStackOnFoundation,
} from './cardUtils';
import type { Card } from '../types/game';

describe('cardUtils', () => {
  describe('createDeck', () => {
    it('creates a standard 52-card deck', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });

    it('creates cards with all suits', () => {
      const deck = createDeck();
      const suits = [...new Set(deck.map((card) => card.suit))];
      expect(suits).toHaveLength(4);
      expect(suits).toContain('hearts');
      expect(suits).toContain('diamonds');
      expect(suits).toContain('clubs');
      expect(suits).toContain('spades');
    });

    it('creates cards with all ranks', () => {
      const deck = createDeck();
      const ranks = [...new Set(deck.map((card) => card.rank))];
      expect(ranks).toHaveLength(13);
      expect(ranks).toContain('A');
      expect(ranks).toContain('K');
    });

    it('creates cards face down by default', () => {
      const deck = createDeck();
      expect(deck.every((card) => !card.faceUp)).toBe(true);
    });

    it('creates cards with unique IDs', () => {
      const deck = createDeck();
      const ids = deck.map((card) => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(52);
    });
  });

  describe('shuffleDeck', () => {
    it('returns a deck with same length', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(deck.length);
    });

    it('returns a new array (does not mutate original)', () => {
      const deck = createDeck();
      const original = [...deck];
      const shuffled = shuffleDeck(deck);
      expect(deck).toEqual(original);
      expect(shuffled).not.toBe(deck);
    });

    it('contains all original cards', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      const deckIds = deck.map((card) => card.id).sort();
      const shuffledIds = shuffled.map((card) => card.id).sort();
      expect(shuffledIds).toEqual(deckIds);
    });
  });

  describe('isRed', () => {
    it('returns true for hearts', () => {
      expect(isRed('hearts')).toBe(true);
    });

    it('returns true for diamonds', () => {
      expect(isRed('diamonds')).toBe(true);
    });

    it('returns false for clubs', () => {
      expect(isRed('clubs')).toBe(false);
    });

    it('returns false for spades', () => {
      expect(isRed('spades')).toBe(false);
    });
  });

  describe('isBlack', () => {
    it('returns true for clubs', () => {
      expect(isBlack('clubs')).toBe(true);
    });

    it('returns true for spades', () => {
      expect(isBlack('spades')).toBe(true);
    });

    it('returns false for hearts', () => {
      expect(isBlack('hearts')).toBe(false);
    });

    it('returns false for diamonds', () => {
      expect(isBlack('diamonds')).toBe(false);
    });
  });

  describe('getRankValue', () => {
    it('returns 1 for Ace', () => {
      expect(getRankValue('A')).toBe(1);
    });

    it('returns 11 for Jack', () => {
      expect(getRankValue('J')).toBe(11);
    });

    it('returns 12 for Queen', () => {
      expect(getRankValue('Q')).toBe(12);
    });

    it('returns 13 for King', () => {
      expect(getRankValue('K')).toBe(13);
    });

    it('returns numeric value for number cards', () => {
      expect(getRankValue('2')).toBe(2);
      expect(getRankValue('5')).toBe(5);
      expect(getRankValue('10')).toBe(10);
    });
  });

  describe('canStackOnTableau', () => {
    it('allows King on empty tableau', () => {
      const king: Card = { suit: 'hearts', rank: 'K', faceUp: true, id: 'hearts-K' };
      expect(canStackOnTableau(null, king)).toBe(true);
    });

    it('disallows non-King on empty tableau', () => {
      const queen: Card = { suit: 'hearts', rank: 'Q', faceUp: true, id: 'hearts-Q' };
      expect(canStackOnTableau(null, queen)).toBe(false);
    });

    it('allows opposite color with descending rank', () => {
      const redSeven: Card = { suit: 'hearts', rank: '7', faceUp: true, id: 'hearts-7' };
      const blackSix: Card = { suit: 'clubs', rank: '6', faceUp: true, id: 'clubs-6' };
      expect(canStackOnTableau(redSeven, blackSix)).toBe(true);
    });

    it('disallows same color', () => {
      const redSeven: Card = { suit: 'hearts', rank: '7', faceUp: true, id: 'hearts-7' };
      const redSix: Card = { suit: 'diamonds', rank: '6', faceUp: true, id: 'diamonds-6' };
      expect(canStackOnTableau(redSeven, redSix)).toBe(false);
    });

    it('disallows wrong rank order', () => {
      const redSeven: Card = { suit: 'hearts', rank: '7', faceUp: true, id: 'hearts-7' };
      const blackFive: Card = { suit: 'clubs', rank: '5', faceUp: true, id: 'clubs-5' };
      expect(canStackOnTableau(redSeven, blackFive)).toBe(false);
    });
  });

  describe('canStackOnFoundation', () => {
    it('allows Ace on empty foundation', () => {
      const ace: Card = { suit: 'hearts', rank: 'A', faceUp: true, id: 'hearts-A' };
      expect(canStackOnFoundation(null, ace)).toBe(true);
    });

    it('disallows non-Ace on empty foundation', () => {
      const two: Card = { suit: 'hearts', rank: '2', faceUp: true, id: 'hearts-2' };
      expect(canStackOnFoundation(null, two)).toBe(false);
    });

    it('allows same suit with ascending rank', () => {
      const heartsTwo: Card = { suit: 'hearts', rank: '2', faceUp: true, id: 'hearts-2' };
      const heartsThree: Card = { suit: 'hearts', rank: '3', faceUp: true, id: 'hearts-3' };
      expect(canStackOnFoundation(heartsTwo, heartsThree)).toBe(true);
    });

    it('disallows different suit', () => {
      const heartsTwo: Card = { suit: 'hearts', rank: '2', faceUp: true, id: 'hearts-2' };
      const clubsThree: Card = { suit: 'clubs', rank: '3', faceUp: true, id: 'clubs-3' };
      expect(canStackOnFoundation(heartsTwo, clubsThree)).toBe(false);
    });

    it('disallows wrong rank order', () => {
      const heartsTwo: Card = { suit: 'hearts', rank: '2', faceUp: true, id: 'hearts-2' };
      const heartsFour: Card = { suit: 'hearts', rank: '4', faceUp: true, id: 'hearts-4' };
      expect(canStackOnFoundation(heartsTwo, heartsFour)).toBe(false);
    });
  });
});
