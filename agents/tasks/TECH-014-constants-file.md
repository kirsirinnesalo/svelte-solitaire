# TECH-014: Create constants.ts for repeated values

Centralize magic numbers and repeated values into constants file.

## Summary

The codebase has repeated values scattered throughout:
- Card dimensions (70px × 100px)
- Colors (#2d6e2d, #4CAF50, #d32f2f)
- Animation durations
- Z-index layers

Centralizing these improves maintainability and consistency.

## Acceptance Criteria

- [ ] Create `src/lib/constants.ts`
- [ ] Export CARD_WIDTH, CARD_HEIGHT constants
- [ ] Export color palette constants
- [ ] Export animation duration constants
- [ ] Replace magic numbers throughout codebase
- [ ] TypeScript strict mode compliance
- [ ] No visual regressions
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-000](../adrs/ADR-000-agent-guidance.md) - DRY principle

## Notes

Example structure:
```typescript
export const CARD = {
  WIDTH: 70,
  HEIGHT: 100,
  BORDER_RADIUS: 8
} as const;

export const COLORS = {
  TABLE_GREEN: '#2d6e2d',
  PRIMARY: '#4CAF50',
  RED_SUIT: '#d32f2f',
  BLACK_SUIT: '#000'
} as const;
```
