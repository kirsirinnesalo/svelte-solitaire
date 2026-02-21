# TECH-009: Add tests for cardUtils.ts

Write comprehensive unit tests for cardUtils.ts utility functions.

## Summary

cardUtils.ts contains shared card manipulation functions used across all games. These pure utility functions are ideal candidates for thorough unit testing.

## Acceptance Criteria

- [ ] Test file: `src/lib/cardUtils.test.ts`
- [ ] Tests for createDeck()
- [ ] Tests for shuffleDeck()
- [ ] Tests for canStackOnTableau()
- [ ] Tests for canStackOnFoundation()
- [ ] Tests for getRankValue()
- [ ] Test edge cases and invalid inputs
- [ ] 100% coverage (pure utility functions)
- [ ] All tests pass
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [TECH-001](TECH-001-vitest-setup.md) - Vitest setup required

**Related ADRs:**
- [ADR-001](../../docs/adrs/ADR-001-test-driven-development.md) - TDD workflow
