# TECH-018: Add component tests with Testing Library

Add component-level tests for UI components using @testing-library/svelte.

## Summary

After TECH-001 sets up Vitest and TECH-005-009 test pure functions, this task adds component tests for UI components.

Focus on:
- GameSelector (game selection)
- CardComponent (card rendering)
- GameHeader (header interactions)
- Settings components

## Acceptance Criteria

- [ ] Test GameSelector.svelte - game selection works
- [ ] Test CardComponent.svelte - renders all suits/ranks
- [ ] Test GameHeader.svelte - button callbacks work
- [ ] Test setting toggle components
- [ ] Tests use @testing-library/svelte
- [ ] Tests follow user-centric approach (no implementation details)
- [ ] All tests pass
- [ ] Coverage on components >80%
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [TECH-001](TECH-001-vitest-setup.md) - Vitest setup required

**Related ADRs:**
- [ADR-001](../adrs/ADR-001-test-driven-development.md) - TDD workflow

**External:**
- [Testing Library Svelte](https://testing-library.com/docs/svelte-testing-library/intro/)
