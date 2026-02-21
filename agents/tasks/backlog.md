# Task Backlog

## Ready

**Priority**: First task in this section = next task to work on. Physical order defines priority.

- [TECH-011](TECH-011-document-json-parse.md) - Add comments explaining JSON.parse usage
- [TECH-012](TECH-012-document-effect-usage.md) - Add documentation for $effect usage in Klondike

## In Progress

- [TECH-004](TECH-004-unify-state-naming.md) - Rename `state` → `gameState` in AcesUp and Clock

## Blocked

_(None)_

## Features

- [FEAT-001](FEAT-001-card-animations.md) - Card flip animation with CSS 3D transforms
- [FEAT-011](FEAT-011-card-movement-animations.md) - Card movement animations with overlay technique
- [FEAT-002](FEAT-002-settings-live-preview.md) - Add live preview to card back settings modal
- [FEAT-003](FEAT-003-game-instructions.md) - Add instructions/help for each game
- [FEAT-004](FEAT-004-statistics-display.md) - Display game statistics in game selector
- [FEAT-005](FEAT-005-keyboard-navigation.md) - Implement keyboard navigation for cards
- [FEAT-006](FEAT-006-screen-reader-support.md) - Add ARIA labels and screen reader support
- [FEAT-007](FEAT-007-focus-styles.md) - Add visible focus styles for keyboard navigation
- [FEAT-008](FEAT-008-dark-mode.md) - Implement dark mode theme
- [FEAT-010](FEAT-010-show-card-underneath-drag.md) - Show card underneath when dragging from tableau

## Technical

- [TECH-002](TECH-002-stats-storage.md) - Implement game statistics with LocalStorage (ADR-006)
- [TECH-003](TECH-003-derived-undo-state.md) - Use $derived for undo button state
- [TECH-010](TECH-010-undo-manager.md) - Create shared undo manager utility
- [TECH-013](TECH-013-auto-start-games.md) - Fix initGame() auto-start for Klondike, Napoleon, Clock
- [TECH-014](TECH-014-constants-file.md) - Create constants.ts for repeated values
- [TECH-015](TECH-015-unify-drag-logic.md) - Unify drag & drop logic across games
- [TECH-016](TECH-016-lazy-loading.md) - Implement lazy loading for game components
- [TECH-017](TECH-017-bundle-analysis.md) - Analyze and optimize bundle size
- [TECH-018](TECH-018-component-tests.md) - Add component tests with Testing Library
- [TECH-019](TECH-019-e2e-tests.md) - Add E2E tests for game scenarios
- [TECH-020](TECH-020-card-bounds-collision.md) - Improve drag collision detection using card bounds
- [TECH-021](TECH-021-remove-napoleon-draw-counter.md) - Show recycle counters only when limit > 1
- [TECH-022](TECH-022-counter-settings.md) - Add reusable counter settings (label: Laskurit)
- [TECH-023](TECH-023-settings-layout.md) - Stack settings labels above controls
- [TECH-024](TECH-024-icon-only-actions.md) - Icon-only action buttons with hover labels
- [TECH-025](TECH-025-action-button-styling.md) - Primary green + neutral secondary actions
- [TECH-026](TECH-026-card-back-selector-style.md) - Align card back selector styling with homepage

## Bugs

- [BUG-001](BUG-001-cardback-persistence.md) - Fix cardBack localStorage persistence using ADR-006


