# TECH-015: Unify drag & drop logic across games

Extract common drag & drop patterns into shared utilities.

## Summary

handleDragStart and handleDrop logic is similar across all games with minor variations. This duplication makes maintenance harder and increases bug risk.

Extracting common patterns into `dragUtils.ts` will reduce duplication while keeping game-specific logic in components.

## Acceptance Criteria

- [ ] Enhance `src/lib/dragUtils.ts` with common patterns
- [ ] Extract dragstart data serialization
- [ ] Extract dragover/drop event handling
- [ ] Refactor Klondike to use shared utilities
- [ ] Refactor Napoleon to use shared utilities
- [ ] Refactor AcesUp to use shared utilities
- [ ] Refactor Clock to use shared utilities
- [ ] All drag & drop functionality works identically
- [ ] Net code reduction
- [ ] No TypeScript errors

## References

**Related Tasks:**
- Current `dragUtils.ts` has handleDragOver already

**Related ADRs:**
- [ADR-000](../adrs/ADR-000-agent-guidance.md) - DRY principle

## Notes

Keep game-specific move validation in components.
Only extract truly common patterns.
