# TECH-005: Add comprehensive tests for klondikeRules.ts

Write comprehensive unit tests for all functions in klondikeRules.ts following TDD principles.

## Summary

klondikeRules.ts contains the core game logic for Klondike solitaire. Per ADR-001 (TDD mandate), all pure functions must have comprehensive tests.

Test coverage should include:
- moveCard() - all valid/invalid move scenarios
- canPlaceOnTableau() - rank/suit rules
- canPlaceOnFoundation() - foundation building rules
- isGameWon() - win condition detection
- isGameLost() - loss condition detection (if implemented)

## Acceptance Criteria

- [ ] Test file created: `src/games/klondike/klondikeRules.test.ts`
- [ ] Tests for all exported functions
- [ ] Test edge cases (empty stacks, full foundations, etc.)
- [ ] Test invalid moves are rejected
- [ ] Test valid moves succeed
- [ ] 90%+ code coverage for klondikeRules.ts
- [ ] All tests pass
- [ ] Tests use descriptive names
- [ ] Test annotations: `@covers TECH-005`
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [TECH-001](TECH-001-vitest-setup.md) - Required first
- [TECH-006](TECH-006-test-napoleon-rules.md) - Similar pattern

**Related ADRs:**
- [ADR-001](../adrs/ADR-001-test-driven-development.md) - TDD workflow

## Notes

Follow the test hierarchy from ADR-001:
1. Pure functions first (100% coverage target)
2. Test typical scenarios
3. Test edge cases
4. Test error conditions
