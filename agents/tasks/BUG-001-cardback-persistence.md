# BUG-001: Fix cardBack localStorage persistence

Fix cardBackStore to properly persist selected card back across page reloads using LocalStorage.

## Summary

Currently `cardBackStore.svelte.ts` uses a module-level `$state` rune which doesn't persist across page reloads. The selected card back resets to default every time the page is refreshed, providing poor user experience.

Per ADR-006 (LocalStorage for game statistics), we should use LocalStorage for persisting user preferences. The card back selection is a user preference that should be remembered.

**Current behavior**: Card back selection lost on page reload
**Expected behavior**: Card back selection persists across sessions

## Acceptance Criteria

- [ ] Card back selection saved to LocalStorage on change
- [ ] Card back loaded from LocalStorage on app initialization
- [ ] Falls back to default if no saved preference exists
- [ ] No errors if LocalStorage is unavailable (privacy mode)
- [ ] Storage key follows naming convention: `solitaire-collection-cardback`
- [ ] Code uses try-catch for localStorage access
- [ ] Tests written for storage logic
- [ ] Manual testing: Select card back, refresh page, selection persists
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related ADRs:**
- [ADR-006](../adrs/ADR-006-localstorage-for-game-statistics.md) - LocalStorage for preferences
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - $state runes patterns

**External:**
- [LocalStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Notes

Current implementation in `src/lib/cardBackStore.svelte.ts`:
```typescript
export let cardBack = $state('red');
```

Should be changed to load/save from LocalStorage. Consider pattern:
```typescript
export let cardBack = $state(loadCardBack());

function loadCardBack(): string {
  try {
    return localStorage.getItem('solitaire-collection-cardback') || 'red';
  } catch {
    return 'red';
  }
}

export function saveCardBack(value: string) {
  cardBack = value;
  try {
    localStorage.setItem('solitaire-collection-cardback', value);
  } catch {
    // Graceful degradation
  }
}
```
