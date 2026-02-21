# Task Backlog

## Ready

**Priority**: First task in this section = next task to work on. Physical order defines priority.

- [FEAT-013](FEAT-013-version-display.md) - Show app version in UI
- [TECH-026](TECH-026-card-back-selector-style.md) - Align card back selector styling with homepage
- [BUG-002](BUG-002-napoleon-callback-props.md) - Fix Napoleon to use callback props (ADR-003 violation)
- [TECH-027](TECH-027-timer-utility.md) - Extract shared timer utility (~80 lines duplication)
- [TECH-010](TECH-010-undo-manager.md) - Create shared undo manager utility
- [TECH-015](TECH-015-unify-drag-logic.md) - Unify drag & drop logic across games
- [TECH-014](TECH-014-constants-file.md) - Create constants.ts for repeated values


## In Progress

_(None)_

## Blocked

_(None)_

## Features

- [FEAT-001](FEAT-001-card-animations.md) - Card flip animation with CSS 3D transforms
- [FEAT-011](FEAT-011-card-movement-animations.md) - Card movement animations with overlay technique
- [FEAT-012](FEAT-012-mobile-responsive-layout.md) - Mobile responsive layout and touch-friendly play
- [FEAT-002](FEAT-002-settings-live-preview.md) - Add live preview to card back settings modal
- [FEAT-003](FEAT-003-game-instructions.md) - Add instructions/help for each game
- [FEAT-004](FEAT-004-statistics-display.md) - Display game statistics in game selector
- [FEAT-005](FEAT-005-keyboard-navigation.md) - Implement keyboard navigation for cards
- [FEAT-006](FEAT-006-screen-reader-support.md) - Add ARIA labels and screen reader support
- [FEAT-007](FEAT-007-focus-styles.md) - Add visible focus styles for keyboard navigation
- [FEAT-008](FEAT-008-dark-mode.md) - Implement dark mode theme
- [FEAT-010](FEAT-010-show-card-underneath-drag.md) - Show card underneath when dragging from tableau
- [FEAT-014](FEAT-014-tooltip-buttons.md) - Replace expanding buttons with icon tooltips

## Technical

- [TECH-002](TECH-002-stats-storage.md) - Implement game statistics with LocalStorage (ADR-006)
- [TECH-003](TECH-003-derived-undo-state.md) - Use $derived for undo button state
- [TECH-013](TECH-013-auto-start-games.md) - Fix initGame() auto-start for Klondike, Napoleon, Clock
- [TECH-016](TECH-016-lazy-loading.md) - Implement lazy loading for game components
- [TECH-017](TECH-017-bundle-analysis.md) - Analyze and optimize bundle size
- [TECH-018](TECH-018-component-tests.md) - Add component tests with Testing Library
- [TECH-019](TECH-019-e2e-tests.md) - Add E2E tests for game scenarios
- [TECH-020](TECH-020-card-bounds-collision.md) - Improve drag collision detection using card bounds

## Bugs

- [BUG-001](BUG-001-cardback-persistence.md) - Fix cardBack localStorage persistence using ADR-006


