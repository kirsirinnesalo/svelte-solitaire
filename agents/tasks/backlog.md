# Task Backlog

## Ready

**Priority**: First task in this section = next task to work on. Physical order defines priority.

- [ ] pitää lisätä ohjeistus backlogin commitille, kun tehtävä otetaan työn alle
- [TECH-006](TECH-006-test-napoleon-rules.md) - Add tests for napoleonRules.ts
- [FEAT-010](FEAT-010-show-card-underneath-drag.md) - Show card underneath when dragging from tableau
- [FEAT-001](FEAT-001-card-animations.md) - Add card movement animations

## In Progress

- [TECH-005](TECH-005-test-klondike-rules.md) - Add comprehensive tests for klondikeRules.ts

## Blocked

_(None)_

## Features

- [FEAT-002](FEAT-002-settings-live-preview.md) - Add live preview to card back settings modal
- [FEAT-003](FEAT-003-game-instructions.md) - Add instructions/help for each game
- [FEAT-004](FEAT-004-statistics-display.md) - Display game statistics in game selector
- [FEAT-005](FEAT-005-keyboard-navigation.md) - Implement keyboard navigation for cards
- [FEAT-006](FEAT-006-screen-reader-support.md) - Add ARIA labels and screen reader support
- [FEAT-007](FEAT-007-focus-styles.md) - Add visible focus styles for keyboard navigation
- [FEAT-008](FEAT-008-dark-mode.md) - Implement dark mode theme

## Technical

- [TECH-002](TECH-002-stats-storage.md) - Implement game statistics with LocalStorage (ADR-006)
- [TECH-003](TECH-003-derived-undo-state.md) - Use $derived for undo button state
- [TECH-004](TECH-004-unify-state-naming.md) - Rename `state` → `gameState` in AcesUp and Clock
- [TECH-007](TECH-007-test-acesup-rules.md) - Add tests for acesUpRules.ts
- [TECH-008](TECH-008-test-clock-rules.md) - Add tests for clockRules.ts
- [TECH-009](TECH-009-test-card-utils.md) - Add tests for cardUtils.ts
- [TECH-010](TECH-010-undo-manager.md) - Create shared undo manager utility
- [TECH-011](TECH-011-document-json-parse.md) - Add comments explaining JSON.parse usage
- [TECH-012](TECH-012-document-effect-usage.md) - Add documentation for $effect usage in Klondike
- [TECH-013](TECH-013-auto-start-games.md) - Fix initGame() auto-start for Klondike, Napoleon, Clock
- [TECH-014](TECH-014-constants-file.md) - Create constants.ts for repeated values
- [TECH-015](TECH-015-unify-drag-logic.md) - Unify drag & drop logic across games
- [TECH-016](TECH-016-lazy-loading.md) - Implement lazy loading for game components
- [TECH-017](TECH-017-bundle-analysis.md) - Analyze and optimize bundle size
- [TECH-018](TECH-018-component-tests.md) - Add component tests with Testing Library
- [TECH-019](TECH-019-e2e-tests.md) - Add E2E tests for game scenarios

## Bugs

- [BUG-001](BUG-001-cardback-persistence.md) - Fix cardBack localStorage persistence using ADR-006

## Completed

- [TECH-001](completed/TECH-001-vitest-setup.md) - Set up Vitest testing infrastructure
- [FEAT-009](completed/FEAT-009-auto-complete-klondike.md) - Add auto-complete when all cards are face-up in Klondike

_(Archive completed tasks to completed/ directory)_


