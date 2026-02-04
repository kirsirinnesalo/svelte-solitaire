# FEAT-009: Add auto-complete when all cards are face-up in Klondike

Automatically move all remaining cards to foundations when game is won (all cards face-up).

## Summary

When all cards in Klondike are face-up, the game outcome is determined and manual moves become tedious. Auto-complete should:
- Detect when all tableau and waste cards are face-up
- Automatically move cards to foundations in correct sequence
- Use smooth animations for each move
- Allow user to watch the completion

This is a standard quality-of-life feature in most solitaire implementations.

## Acceptance Criteria

- [ ] Detect when all cards are face-up (no face-down cards in tableau or stock)
- [ ] Automatically initiate card movement to foundations
- [ ] Move cards in valid sequence (respecting foundation rules)
- [ ] Use animated moves (~150-250ms per card)
- [ ] Delay between moves (~100-200ms) for visual feedback
- [ ] Allow user to cancel/interrupt auto-complete (optional)
- [ ] Trigger victory state when complete
- [ ] Works with both draw-1 and draw-3 modes
- [ ] No TypeScript errors
- [ ] Tests for auto-complete detection logic

## Implementation Notes

**Detection logic:**
```typescript
function canAutoComplete(state: KlondikeState): boolean {
  // Check no face-down cards in tableau
  const allTableauFaceUp = state.tableau.every(pile => 
    pile.every(card => card.faceUp)
  );
  
  // Check no face-down cards in stock
  const allStockFaceUp = state.stock.every(card => card.faceUp);
  
  return allTableauFaceUp && allStockFaceUp;
}
```

**Auto-move sequence:**
1. Find lowest moveable card to any foundation
2. Animate move to foundation
3. Wait for animation completion
4. Repeat until all cards moved

**Considerations:**
- Should auto-complete be automatic or require user confirmation?
- Should there be a preference to disable auto-complete?
- Should it work in other games (Napoleon, Clock)?

## References

**Related ADRs:**
- [ADR-001](../adrs/ADR-001-test-driven-development.md) - TDD for detection logic
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - Use Svelte 5 patterns

**Related Tasks:**
- [FEAT-001](FEAT-001-card-animations.md) - Card animations (prerequisite)

**External:**
- Most solitaire games have similar auto-complete features
- Example: Windows Solitaire, Solitaire.org

## Test Cases

```typescript
describe('Auto-complete detection', () => {
  it('detects when all cards are face-up', () => {
    const state = createAllFaceUpState();
    expect(canAutoComplete(state)).toBe(true);
  });
  
  it('returns false when any tableau card is face-down', () => {
    const state = createStateWithOneFaceDown();
    expect(canAutoComplete(state)).toBe(false);
  });
  
  it('returns false when stock has face-down cards', () => {
    const state = createStateWithStockFaceDown();
    expect(canAutoComplete(state)).toBe(false);
  });
});
```

## Notes

- Consider adding visual indicator when auto-complete is available
- Could add "Auto-complete" button instead of fully automatic
- Animation speed should be configurable (fast/normal/off)
- This feature enhances the existing double-click auto-move functionality
