# TECH-011: Add comments explaining JSON.parse usage

Add inline comments explaining why JSON.parse is used for state cloning instead of structuredClone.

## Summary

The codebase uses `JSON.parse(JSON.stringify(obj))` for cloning state in several places. This looks unusual compared to modern `structuredClone()`, but it's intentional due to Svelte 5 $state proxy compatibility (ADR-004).

Without comments, future developers might "fix" this to use structuredClone, breaking the code.

## Acceptance Criteria

- [x] Add comment in Klondike.svelte above JSON.parse usage
- [x] Add comment in Napoleon.svelte above JSON.parse usage
- [x] ~~Add comment in AcesUp.svelte above JSON.parse usage~~ — N/A: AcesUp has no undo and no JSON.parse usage
- [x] Comment references ADR-004
- [x] Comment explains $state proxy incompatibility with structuredClone
- [x] No functionality changes (documentation only)
- [x] No TypeScript errors

## References

**Related ADRs:**
- [ADR-004](../adrs/ADR-004-json-parse-for-state-cloning.md) - JSON.parse decision

## Notes

Example comment:
```typescript
// Use JSON.parse instead of structuredClone due to Svelte 5 $state proxy
// incompatibility. See ADR-004 for rationale.
history = [...history, JSON.parse(JSON.stringify(gameState))];
```
