# Task Backlog

## Ready

_(Empty - User prioritizes tasks here from sections below)_

**Priority**: First task in this section = next task to work on. Physical order defines priority.

## In Progress

_(None - Agent works on ONE task at a time)_

## Blocked

_(None)_

## Features

1. [FEAT-001](FEAT-001-card-animations.md) - Add card movement animations
2. [FEAT-002](FEAT-002-settings-live-preview.md) - Add live preview to card back settings modal
3. [FEAT-003](FEAT-003-game-instructions.md) - Add instructions/help for each game
4. [FEAT-004](FEAT-004-statistics-display.md) - Display game statistics in game selector
5. [FEAT-005](FEAT-005-keyboard-navigation.md) - Implement keyboard navigation for cards
6. [FEAT-006](FEAT-006-screen-reader-support.md) - Add ARIA labels and screen reader support
7. [FEAT-007](FEAT-007-focus-styles.md) - Add visible focus styles for keyboard navigation
8. [FEAT-008](FEAT-008-dark-mode.md) - Implement dark mode theme
9. [FEAT-009](FEAT-009-auto-complete-klondike.md) - Add auto-complete when all cards are face-up in Klondike

## Technical

1. [TECH-001](TECH-001-vitest-setup.md) - Set up Vitest testing infrastructure
2. [TECH-002](TECH-002-stats-storage.md) - Implement game statistics with LocalStorage (ADR-006)
3. [TECH-003](TECH-003-derived-undo-state.md) - Use $derived for undo button state
4. [TECH-004](TECH-004-unify-state-naming.md) - Rename `state` → `gameState` in AcesUp and Clock
5. [TECH-005](TECH-005-test-klondike-rules.md) - Add comprehensive tests for klondikeRules.ts
6. [TECH-006](TECH-006-test-napoleon-rules.md) - Add tests for napoleonRules.ts
7. [TECH-007](TECH-007-test-acesup-rules.md) - Add tests for acesUpRules.ts
8. [TECH-008](TECH-008-test-clock-rules.md) - Add tests for clockRules.ts
9. [TECH-009](TECH-009-test-card-utils.md) - Add tests for cardUtils.ts
10. [TECH-010](TECH-010-undo-manager.md) - Create shared undo manager utility
11. [TECH-011](TECH-011-document-json-parse.md) - Add comments explaining JSON.parse usage
12. [TECH-012](TECH-012-document-effect-usage.md) - Add documentation for $effect usage in Klondike
13. [TECH-013](TECH-013-auto-start-games.md) - Fix initGame() auto-start for Klondike, Napoleon, Clock
14. [TECH-014](TECH-014-constants-file.md) - Create constants.ts for repeated values
15. [TECH-015](TECH-015-unify-drag-logic.md) - Unify drag & drop logic across games
16. [TECH-016](TECH-016-lazy-loading.md) - Implement lazy loading for game components
17. [TECH-017](TECH-017-bundle-analysis.md) - Analyze and optimize bundle size
18. [TECH-018](TECH-018-component-tests.md) - Add component tests with Testing Library
19. [TECH-019](TECH-019-e2e-tests.md) - Add E2E tests for game scenarios

## Bugs

1. [BUG-001](BUG-001-cardback-persistence.md) - Fix cardBack localStorage persistence using ADR-006

## Completed

_(Tasks moved here when done, then archived to completed/ directory)_

---

**Last Updated**: 2026-01-26
