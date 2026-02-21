# BUG-003: Clock start pile

Clock can be started from any pile, but it should only start from the center pile.

## Summary

The Clock game currently allows the first move to begin from any pile, which
breaks the rules and makes the game trivial to start incorrectly.

This bug needs to enforce that the first card reveal must come from the center
pile. Only after the center pile has started should the normal click flow apply.

## Acceptance Criteria

- [ ] The first click must be the center pile
- [ ] Clicking a non-center pile before the game starts does nothing
- [ ] After the center pile starts, normal clicking rules apply
- [ ] Tests written and passing (TDD)
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- None

**Related ADRs:**
- None

**External:**
- None

## Notes

Focus on rule enforcement and UI behavior; avoid changes to unrelated logic.