# TECH-019: Add E2E tests for game scenarios

Add end-to-end tests for complete game flows using Playwright.

## Summary

E2E tests verify complete user workflows work correctly. Focus on critical paths like winning a game, using undo, changing settings.

## Acceptance Criteria

- [ ] Install Playwright
- [ ] Configure Playwright for Vite
- [ ] Add E2E test: Win Klondike game
- [ ] Add E2E test: Use undo successfully
- [ ] Add E2E test: Change card back setting
- [ ] Add E2E test: Switch between games
- [ ] Tests run in CI-friendly mode (headless)
- [ ] All E2E tests pass
- [ ] Documentation for running E2E tests
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-001](../adrs/ADR-001-test-driven-development.md) - TDD workflow

**External:**
- [Playwright](https://playwright.dev/)
- [Playwright Svelte](https://playwright.dev/docs/test-components)

## Notes

E2E tests are slow - keep focused on critical paths only.
Unit/component tests should cover most scenarios.
