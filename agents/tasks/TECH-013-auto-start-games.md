# TECH-013: Fix initGame() auto-start for Klondike, Napoleon, Clock

Make games start automatically on mount instead of showing blank state.

## Summary

Currently Klondike, Napoleon, and Clock don't start automatically - they show blank state until user clicks "New Game". AcesUp already auto-starts correctly.

Games should initialize automatically on mount for better UX.

## Acceptance Criteria

- [ ] Klondike: Add $effect to call initGame() on mount
- [ ] Napoleon: Add $effect to call initGame() on mount  
- [ ] Clock: Add $effect to call initGame() on mount
- [ ] Games start immediately when loaded
- [ ] No double-initialization
- [ ] All games work identically
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - $effect patterns

## Notes

AcesUp pattern (line 152):
```typescript
$effect(() => {
  initGame();
});
```

Or simpler: call initGame() directly in component setup.
