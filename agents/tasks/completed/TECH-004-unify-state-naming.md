# TECH-004: Rename state → gameState in AcesUp and Clock

Unify state variable naming across all games for consistency.

## Summary

Most games use `gameState` as the main state variable name (Klondike, Napoleon), but AcesUp and Clock use just `state`. This inconsistency makes code harder to read and understand.

Standardizing on `gameState` avoids confusion with Svelte 5's `$state` rune and makes the codebase more consistent.

## Acceptance Criteria

- [ ] AcesUp.svelte: Rename `state` → `gameState`
- [ ] Clock.svelte: Rename `state` → `gameState`
- [ ] Update all references in both files
- [ ] Tests still pass after renaming
- [ ] Games function identically (pure refactoring)
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related ADRs:**
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - Runes-only approach

## Notes

Simple find-and-replace refactoring. No logic changes.

## Closure (2026-02-21)

**Status: Closed as obsolete — already implemented.**

Git history shows that both `AcesUp.svelte` and `Clock.svelte` have used `gameState` since the Svelte 5 migration commit `6a42d44` ("Toteuta Svelte 5 -migraatio"). The task was created based on an incorrect assumption about the current state of the codebase. No code changes were needed or made.
