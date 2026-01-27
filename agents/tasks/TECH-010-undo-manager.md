# TECH-010: Create shared undo manager utility

Extract duplicated undo logic into reusable utility to reduce code duplication.

## Summary

Undo logic is duplicated across 4 games (Klondike, Napoleon, AcesUp, Clock) with ~40 lines per game. This violates DRY principle and makes maintenance harder.

Creating a shared `undoManager` utility will save ~160 lines of code and centralize undo behavior.

## Acceptance Criteria

- [ ] Create `src/lib/undoManager.svelte.ts`
- [ ] Implement `createUndoManager<T>()` factory function
- [ ] Returns object with: canUndo ($derived), save(), undo(), clear()
- [ ] Uses JSON.parse for cloning (per ADR-004)
- [ ] Refactor Klondike to use undo manager
- [ ] Refactor Napoleon to use undo manager
- [ ] Refactor AcesUp to use undo manager
- [ ] Tests for undoManager utility
- [ ] All games' undo functionality works identically
- [ ] Net reduction of ~150+ lines
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-004](../adrs/ADR-004-json-parse-for-state-cloning.md) - JSON.parse for cloning

## Notes

Example API:
```typescript
const undo = createUndoManager<GameState>();
undo.save(gameState);
if (undo.canUndo) {
  gameState = undo.undo()!;
}
```
