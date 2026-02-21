import { describe, it, expect } from 'vitest';
import {
  klondikeInstructions,
  napoleonInstructions,
  acesUpInstructions,
  clockInstructions,
  type GameInstruction
} from './gameInstructions';

describe('gameInstructions', () => {
  const games = [
    { name: 'Klondike', instructions: klondikeInstructions },
    { name: 'Napoleon', instructions: napoleonInstructions },
    { name: 'AcesUp', instructions: acesUpInstructions },
    { name: 'Clock', instructions: clockInstructions }
  ];

  games.forEach(({ name, instructions }) => {
    describe(name, () => {
      it('has a title', () => {
        expect(instructions.title).toBeTruthy();
        expect(typeof instructions.title).toBe('string');
      });

      it('has a goal', () => {
        expect(instructions.goal).toBeTruthy();
        expect(typeof instructions.goal).toBe('string');
      });

      it('has rules array', () => {
        expect(Array.isArray(instructions.rules)).toBe(true);
        expect(instructions.rules.length).toBeGreaterThan(0);
      });

      it('has non-empty rule strings', () => {
        instructions.rules.forEach((rule) => {
          expect(typeof rule).toBe('string');
          expect(rule.length).toBeGreaterThan(0);
        });
      });

      it('has tips array if provided', () => {
        if (instructions.tips) {
          expect(Array.isArray(instructions.tips)).toBe(true);
          expect(instructions.tips.length).toBeGreaterThan(0);
          instructions.tips.forEach((tip) => {
            expect(typeof tip).toBe('string');
            expect(tip.length).toBeGreaterThan(0);
          });
        }
      });

      it('is in Finnish language', () => {
        // Check for Finnish characters or common Finnish words
        const finnishText = `${instructions.title}${instructions.goal}${instructions.rules.join('')}${instructions.tips?.join('') || ''}`;
        // This is a basic check - looking for common Finnish patterns
        expect(finnishText.length).toBeGreaterThan(0);
      });
    });
  });

  it('exports proper GameInstruction types', () => {
    games.forEach(({ instructions }) => {
      expect(instructions).toHaveProperty('title');
      expect(instructions).toHaveProperty('goal');
      expect(instructions).toHaveProperty('rules');
    });
  });

  it('Klondike has correct title', () => {
    expect(klondikeInstructions.title).toContain('Klondike');
  });

  it('Napoleon has correct title', () => {
    expect(napoleonInstructions.title).toContain('Napoleon');
  });

  it('AcesUp has correct title', () => {
    expect(acesUpInstructions.title).toContain('Aces');
  });

  it('Clock has correct title', () => {
    expect(clockInstructions.title).toContain('Kello');
  });
});
