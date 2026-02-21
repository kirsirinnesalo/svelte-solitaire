# TECH-003: Use $derived for undo button state

Replace manual undo button state calculation with $derived() rune in all games.

## Summary

Currently all games manually calculate `canUndo` or `undoDisabled` by updating state on every relevant change. This is verbose and error-prone. Svelte 5's `$derived()` rune is designed for exactly this use case - deriving reactive values from other state.

**Current pattern** (in all 4 games):
```typescript
let history = $state([]);
let canUndo = $state(false);

function saveState() {
  history = [...history, state];
  canUndo = history.length > 0; // Manual update
}
```

**Better pattern with $derived**:
```typescript
let history = $state([]);
let canUndo = $derived(history.length > 0 && !isWon && !isLost);
```

## Acceptance Criteria

- [ ] Klondike: Replace manual canUndo updates with $derived
- [ ] Napoleon: Replace manual canUndo updates with $derived
- [ ] AcesUp: Replace manual canUndo updates with $derived
- [ ] All games: Derived state includes isWon/isLost checks
- [ ] Remove all manual `canUndo =` assignments
- [ ] Tests verify undo button states correctly
- [ ] No regressions in undo functionality
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related ADRs:**
- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - Svelte 5 runes patterns

**External:**
- [Svelte 5 $derived](https://svelte.dev/docs/svelte/$derived)

## Notes

Clock game doesn't have undo, so not included.

This is a pure refactoring task - no functionality changes, just cleaner code.
