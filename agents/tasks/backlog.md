# Task Management

This document tracks all development tasks for the Svelte Solitaire project. Tasks are organized by status and priority.

## 📋 How This Works

- **Task Types**: FEAT (features), TECH (technical), BUG (bugs), DOC (documentation)
- **Priority**: Order in Ready section = priority (top = highest)
- **Status**: Tasks move through sections as they progress
- **Details**: Each task has a separate markdown file with full details

## 🔴 Ready

Tasks ready for implementation, ordered by priority (top = highest):

1. [TECH-001](TECH-001-vitest-setup.md) - Set up Vitest testing infrastructure
2. [BUG-001](BUG-001-cardback-persistence.md) - Fix cardBack localStorage persistence
3. [TECH-002](TECH-002-test-klondike-rules.md) - Add comprehensive tests for klondikeRules.ts
4. [TECH-003](TECH-003-derived-undo-state.md) - Use $derived for undo button state
5. [TECH-004](TECH-004-unify-state-naming.md) - Rename `state` → `gameState` in AcesUp and Clock
6. [TECH-005](TECH-005-undo-manager.md) - Create shared undo manager utility
7. [TECH-006](TECH-006-document-json-parse.md) - Add comments explaining JSON.parse usage
8. [TECH-007](TECH-007-test-napoleon-rules.md) - Add tests for napoleonRules.ts
9. [TECH-008](TECH-008-test-acesup-rules.md) - Add tests for acesUpRules.ts
10. [TECH-009](TECH-009-test-clock-rules.md) - Add tests for clockRules.ts
11. [TECH-010](TECH-010-test-card-utils.md) - Add tests for cardUtils.ts
12. [FEAT-001](FEAT-001-card-animations.md) - Add card movement animations
13. [FEAT-002](FEAT-002-keyboard-navigation.md) - Implement keyboard navigation
14. [FEAT-003](FEAT-003-screen-reader-support.md) - Add ARIA labels and screen reader support
15. [FEAT-004](FEAT-004-dark-mode.md) - Implement dark mode theme

## 🔄 In Progress

Currently being worked on:

_(None)_

## 🚫 Blocked

Waiting on dependencies or decisions:

_(None)_

## ✅ Recently Completed

Last 5 completed tasks:

1. ~~TECH-000~~ - GameOverOverlay and PauseOverlay refactoring (-428 lines) ✅ 2026-01-26
2. ~~FEAT-000~~ - Replace GameResultModal with transparent overlay ✅ 2026-01-26

## 📦 Backlog

Ideas and future tasks (not yet prioritized):

### Features
- Settings modal with card back preview
- Multiple undo levels (currently 1 level)
- Game statistics tracking (wins, losses, best time)
- Hint system (suggest valid moves)
- Auto-complete when game is winnable
- Sound effects and music
- Responsive mobile layout
- Touch gesture support

### Technical
- Lazy loading for games (code splitting)
- Bundle size optimization
- Performance profiling
- Error boundary components
- Logger utility
- Constants file (colors, sizes, timings)
- Drag & drop abstraction

### Testing
- Component tests for all UI components
- Integration tests for complete game flows
- E2E tests with Playwright
- Visual regression testing
- Performance benchmarks

### Documentation
- JSDoc for all exported functions
- Component documentation
- Architecture diagrams
- Contribution guide
- User guide / help system

## 📝 Task Lifecycle

```
Backlog → Ready → Plan → In Progress → (Blocked) → Completed
```

**Rule: ONE task at a time**. Complete current task (including merge to main) before starting next. This ensures:
- Clear focus and better quality
- No merge conflicts between tasks
- Easier to track progress
- Simpler to revert if needed

### Moving Tasks

**To start a task**:
1. Read task details thoroughly
2. **Plan implementation**: Update task file with:
   - Technical approach
   - Files to modify/create
   - Testing strategy
   - Step-by-step plan
3. Move from Ready to In Progress in this file
4. Create feature branch
5. Commit: `git commit -m "Start TECH-001: Plan implementation"`

**When blocked**:
1. Move to Blocked section
2. Note blocker in task details
3. Move another task to In Progress

**When complete**:
1. **Validate** task completion:
   ```bash
   npm run check    # TypeScript errors?
   npm run test     # All tests pass?
   npm run build    # Build succeeds?
   ```
2. Verify all acceptance criteria met
3. Check ADR created if architectural decision
4. Update task file with completion notes
5. Move to Recently Completed with completion date
6. Commit: `git commit -m "TECH-001: Complete Vitest setup"`
7. Merge feature branch to main (--no-ff)

**To add new task**:
1. Create task file: `FEAT-XXX-description.md`
2. Add to Backlog section
3. Prioritize to Ready when groomed

**Discovering new tasks during work**:
1. Create task file immediately:
   ```bash
   cp TEMPLATE.md BUG-003-discovered-issue.md
   ```
2. Fill in description and context
3. Add to Backlog section below
4. Link in current task's "Related Tasks"
5. Commit: `CURRENT-ID: Discover BUG-003`
6. Assess priority:
   - **Blocker**: Move to Ready, pause current
   - **Important**: Prioritize after current
   - **Can wait**: Leave in Backlog

## 🎯 Current Sprint Focus

**Focus**: Testing infrastructure and test coverage

**Goals**:
- [ ] Vitest setup complete
- [ ] All *Rules.ts files have tests
- [ ] 90%+ coverage on game logic

**Timeline**: Next 2 weeks

## 📊 Statistics

- **Total Tasks**: 15 ready, 0 in progress, 2 completed
- **By Type**: 4 FEAT, 10 TECH, 1 BUG, 0 DOC
- **Completion Rate**: 2 tasks completed, ~15 remaining
- **Test Coverage**: 0% → Target 90%

---

**Last Updated**: 2026-01-26
