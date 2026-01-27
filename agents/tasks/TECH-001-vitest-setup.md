# TECH-001: Set up Vitest testing infrastructure

Set up Vitest as the testing framework with proper configuration for Svelte 5 components.

## Summary

The project currently has no testing infrastructure. Per ADR-001 (TDD workflow mandate), we need a robust testing setup before implementing new features or refactoring existing code.

Vitest is the modern, fast, Vite-native testing framework that integrates seamlessly with our Vite + Svelte 5 setup. This task establishes the foundation for all future testing work.

## Acceptance Criteria

- [ ] Vitest installed and configured
- [ ] `@testing-library/svelte` installed for component testing
- [ ] `vitest.config.ts` created with proper Svelte plugin setup
- [ ] Test scripts added to `package.json`:
  - `npm run test` - Run tests once
  - `npm run test:watch` - Watch mode
  - `npm run test:coverage` - Coverage report
- [ ] Example test file created and passing (e.g., `cardUtils.test.ts`)
- [ ] Coverage thresholds configured (target 90%)
- [ ] Documentation updated in AGENTS.md with test commands
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- [TECH-005](TECH-005-test-klondike-rules.md) - Tests for klondikeRules.ts
- [TECH-006](TECH-006-test-napoleon-rules.md) - Tests for napoleonRules.ts
- [TECH-007](TECH-007-test-acesup-rules.md) - Tests for acesUpRules.ts
- [TECH-008](TECH-008-test-clock-rules.md) - Tests for clockRules.ts
- [TECH-009](TECH-009-test-card-utils.md) - Tests for cardUtils.ts

**Related ADRs:**
- [ADR-001](../adrs/ADR-001-test-driven-development.md) - TDD workflow mandate

**External:**
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Svelte](https://testing-library.com/docs/svelte-testing-library/intro/)

## Notes

Configuration must support:
- Svelte 5 runes syntax
- TypeScript imports
- CSS imports (mock or transform)
- Path aliases from `tsconfig.json`
