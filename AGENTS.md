# AI Agent Development Guide

Welcome to the Svelte Solitaire development team! This document contains everything needed to understand the project architecture, practices, and workflow.

> **Quick Start**: Read this document first. In case of conflict, ADRs take precedence over this guide.

## 📋 Quick Reference

- **Tech Stack**: Svelte 5, TypeScript 5, Vite 7
- **Development**: TDD-first, feature branches, ONE task at a time, Conventional Commits
- **Language**: Finnish UI, English code/docs
- **Tasks**: [backlog.md](agents/tasks/backlog.md) | [Task Guide](agents/tasks/README.md)
- **Commits**: `feat(TASK-ID): short summary`

## ✈️ Pre-flight Checklist

Before starting ANY task:

1. [ ] Read task file completely (`agents/tasks/TASK-ID.md`)
2. [ ] Review related ADRs listed in task
3. [ ] On main: Move task to In Progress in `backlog.md`
4. [ ] On main: Commit `git commit -m "chore(TASK-ID): start task"`
5. [ ] Create feature branch: `git checkout -b feat/TASK-ID-description`
6. [ ] Create todo list (VS Code Copilot: use `manage_todo_list` tool)

**Then follow Task Workflow below.**

## 🚦 Critical Rules

- Follow TDD (test before code)
- Never modify completed tasks (create new task)
- Never violate ADRs (create superseding ADR)
- Never commit failing tests
- Annotate tests: `@covers FEAT-001` `@constrainedBy ADR-002`

## 🚨 Escalate If

- ADR would be violated
- Behavior is ambiguous
- Tests conflict with acceptance criteria
- Change breaks documented invariants

**How**: Document in task file, propose ADR update, ask specific questions.

## 🔄 Task Workflow (Agent Responsibilities)

Complete workflow for every task:

1. **Prepare**: Complete Pre-flight Checklist above
2. **Red**: Write failing tests (TDD red phase)
3. **Green**: Implement minimum code to pass tests
4. **Refactor**: Improve code quality while keeping tests green
   - Remove duplication (DRY principle)
   - Improve naming (clear, descriptive)
   - Simplify structure (reduce complexity)
   - Follow project patterns (ADRs, conventions)
   - **No technical debt**: Code must be production-ready
5. **Quality Gates (MANDATORY before commit)**:
   - Run unit tests: `npm run test` (Vitest)
   - Run lint: `npm run lint` (if configured)
   - Run build: `npm run build`
6. **Commit**: Commit frequently with `feat(TASK-ID): short summary` (Conventional Commits)
7. **Validate**: All tests pass, no TypeScript errors, no warnings
8. **Document**: Update docs if user-facing, create ADR if architectural
9. **Complete**:
   - **Agent** (on feature branch):
     - Archives task file to `completed/`
     - Commits: `git commit -m "chore(TASK-ID): complete task"`
     - Reports branch name and readiness
   - **User** (integration):
     - Merges to main with `--no-ff`
     - Deletes branch

**One task at a time**: Complete fully before starting next.

**Scope control**:
- Only implement what is required by the current task
- If improvement is desirable but not required:
  - Create a separate TECH/FEAT task
  - Do NOT implement it under current task

**If merge is delayed**:
- Agent must not continue new tasks on the same feature branch
- Wait for user merge before starting next task

**Note**: Task completion happens on feature branch. Main only gets "start" commits.

## 🎯 Project Structure

```
src/
├── components/          # Shared UI components
│   ├── CardComponent.svelte
│   ├── GameHeader.svelte
│   └── settings/       # Setting toggles ($bindable pattern)
├── games/              # Game implementations
│   ├── {game}/
│   │   ├── {Game}.svelte      # UI component
│   │   └── {game}Rules.ts     # Pure game logic
├── lib/                # Utilities and stores
│   ├── cardUtils.ts    # Card operations
│   ├── dragUtils.ts    # Drag & drop helpers
│   └── cardBackStore.svelte.ts  # Runes-based store
├── types/              # TypeScript definitions
│   └── game.ts         # Card, Suit, Rank, GameState types
└── styles/             # Shared CSS
    └── shared.css
```

**Example**: For a game called "Klondike":
- UI: `src/games/klondike/Klondike.svelte`
- Logic: `src/games/klondike/klondikeRules.ts`
- Tests: `src/games/klondike/klondikeRules.test.ts`

## 🔐 Agent vs User Responsibilities

### Agent MAY:
- create feature branches
- stage and commit changes
- run tests, lint, and build locally

### Agent MUST NOT:
- git push
- git pull
- git merge
- git rebase
- git reset
- delete branches

### User DOES:
- push branches
- merge to main
- delete branches
- resolve merge conflicts

## 🏗️ Architecture Decisions

All architectural decisions are documented in `docs/adrs/`. Key decisions:

- **[ADR-001](docs/adrs/ADR-001-test-driven-development.md)**: TDD workflow mandate
- **[ADR-002](docs/adrs/ADR-002-svelte-5-runes-only.md)**: Svelte 5 runes-only approach
- **[ADR-003](docs/adrs/ADR-003-callback-props-over-event-dispatchers.md)**: Callback props pattern
- **[ADR-004](docs/adrs/ADR-004-json-parse-for-state-cloning.md)**: JSON.parse for state cloning
- **[ADR-005](docs/adrs/ADR-005-game-over-overlay-refactor.md)**: Overlay component refactoring
- **[ADR-006](docs/adrs/ADR-006-localstorage-for-game-statistics.md)**: LocalStorage for game statistics

## 🔴 Test-Driven Development Workflow

Always follow TDD workflow for new features and bug fixes.

### 1. Red Phase - Write Failing Test
```bash
# Create test file first
touch src/games/klondike/klondikeRules.test.ts

# Write test that describes expected behavior
npm run test -- --watch
```

### 2. Green Phase - Implement Minimum Code
```typescript
// Implement just enough to make test pass
export function moveCard(/* ... */) {
  // Minimal implementation
}
```

### 3. Refactor Phase - Improve Code
```typescript
// Clean up, optimize, remove duplication
// Tests must still pass
```

### Test Hierarchy Priority
1. **Pure functions** (`*Rules.ts`) - Test first, 100% coverage
2. **Component logic** - Test user interactions
3. **Integration** - Test game flow end-to-end
4. **Visual** - Manual verification only

### Test Annotations

Link tests to tasks using JSDoc annotations:

```typescript
/**
 * @covers FEAT-001
 * @description Tests card movement animations
 * @constrainedBy ADR-001, ADR-002
 */
describe('Card animations', () => {
  it('animates card movement', () => {
    // test code
  });
});
```

This enables:
- Traceability: Which tests cover which features
- Impact analysis: What to test when changing a task
- Coverage tracking: Which tasks have tests

## 📝 Task Management

**See [agents/tasks/README.md](agents/tasks/README.md) for complete guide.**

**Critical Rules:**
- **Priority**: Physical order in Ready section (first = next)
- **Ready**: USER-MANAGED ONLY - agents take first, never add/reorder
- **ONE task at a time** - complete before starting next
- **Types**: FEAT (features), TECH (technical/testing/docs), BUG (bugs)
- **Workflow**: Ready → In Progress → archive to `completed/` directory
- **TDD**: Test first for all tasks
- **Commits**: Short and focused - `feat(TASK-ID): what changed`
  - Don't repeat acceptance criteria (DoD is implicit)
  - Don't list test counts or implementation details

## 📐 Code Conventions

### Language
- **UI text**: Finnish (`let moves = $state(0); // Siirrot`)
- **Code**: English (variable names, functions, comments, docs)

### File Naming
- **Components**: PascalCase.svelte (`CardComponent.svelte`, `GameHeader.svelte`)
- **Utilities**: camelCase.ts (`cardUtils.ts`, `dragUtils.ts`)
- **Game rules**: camelCase + Rules.ts (`klondikeRules.ts`)
- **Tests**: match source + .test.ts (`klondikeRules.test.ts`)
- **Rune stores**: camelCase.svelte.ts (`cardBackStore.svelte.ts`)

### Code Style
- **No abbreviations**: `gameState` not `gs`, `tableau` not `tab`
- **Explicit types**: always type function parameters
- **No `any`**: use `unknown` if truly dynamic
- **Immutability**: always create new objects/arrays for reactivity

### Type System
- Shared types in `src/types/game.ts`
- Game-specific state interfaces in `*Rules.ts`
- Inline type assertions for `$state`: `[] as Card[][]`

### Test Coverage Targets
- Pure functions (`*Rules.ts`): 100%
- Components: 80%+

## 🎨 Svelte 5 Runes Patterns

### State Management
```typescript
// ✅ Correct - use $state for all mutable state
let moves = $state(0);
let gameState: KlondikeState = $state({
  tableau: [] as Card[][],
  foundations: [[], [], [], []]
});

// ❌ Wrong - no reactive declarations
let moves: number; // Not reactive!
$: moves = history.length; // Forbidden! Use $derived
```

### Computed Values
```typescript
// ✅ Correct - use $derived for computed values
let canUndo = $derived(history.length > 0 && !isWon && !isLost);

// ❌ Wrong - don't use $effect for pure computations
$effect(() => {
  canUndo = history.length > 0; // Use $derived instead!
});
```

### Props
```typescript
// ✅ Correct - destructure from $props()
let { card, draggable = false }: { card: Card; draggable?: boolean } = $props();

// ❌ Wrong - no export let
export let card: Card; // Forbidden!
```

### Side Effects
```typescript
// ✅ Correct - use $effect for side effects only
$effect(() => {
  const interval = setInterval(() => elapsedTime++, 1000);
  return () => clearInterval(interval);
});

// ✅ Correct - state synchronization
$effect(() => {
  if (drawCount === 1) maxRecycles = 3;
  else maxRecycles = 'unlimited';
});
```

### Bindable Props
```typescript
// ✅ Correct - use $bindable for two-way binding
let { checked = $bindable() }: { checked: boolean } = $props();
```

## 🎮 Game Implementation Pattern

### 1. Rules Module (`*Rules.ts`)
```typescript
// Pure functions, no Svelte dependencies
export interface GameState {
  tableau: Card[][];
  // ...
}

export function moveCard(
  state: GameState, 
  from: Location, 
  to: Location
): MoveResult {
  // Pure logic, fully testable
}

export function isGameWon(state: GameState): boolean {
  // Pure logic
}
```

### 2. UI Component (`*.svelte`)
```typescript
<script lang="ts">
  import { moveCard, isGameWon } from './gameRules';
  
  let gameState: GameState = $state({/* ... */});
  let isWon = $derived(isGameWon(gameState));
  
  function handleMove() {
    const result = moveCard(gameState, from, to);
    if (result.valid) gameState = result.newState!;
  }
</script>
```

### 3. State Cloning
```typescript
// ✅ Correct - JSON.parse for $state proxy compatibility
history = [...history, JSON.parse(JSON.stringify(gameState))];

// ❌ Wrong - structuredClone fails with $state proxy
history = [...history, structuredClone(gameState)]; // Error!
```

See [ADR-004](docs/adrs/ADR-004-json-parse-for-state-cloning.md) for rationale.

## 🔧 Common Workflows

### Adding a New Game
1. Read existing game implementations (Klondike is reference)
2. Create `src/games/{game}/{game}Rules.ts` with **tests first**
3. Create `src/games/{game}/{Game}.svelte` component
4. Add to `GameType` in `src/types/game.ts`
5. Add to `games` array in `GameSelector.svelte`
6. Add rendering case in `App.svelte`

### Refactoring
1. Ensure existing tests pass
2. Make changes incrementally
3. Run tests after each change
4. Document decision in ADR if architectural

### Bug Fix
1. Write failing test that reproduces bug
2. Fix bug to make test pass
3. Verify no regressions
4. Commit with BUG-XXX prefix

## 🛠️ Development Commands

```bash
# Check Node version (minimum Node 20 required)
node -v

# Development server (port 5173)
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Run tests (when implemented)
npm run test
npm run test -- --watch
npm run test -- --coverage
```

## ✅ Definition of Done

Every task is complete when:
- [ ] Tests written and passing (TDD red-green-refactor)
- [ ] Code follows Svelte 5 runes patterns
- [ ] TypeScript strict mode compliance
- [ ] Finnish UI text, English code
- [ ] No console warnings/errors
- [ ] Committed with task ID
- [ ] ADR created if architectural change
- [ ] README.md updated if user-visible

**Task completion**: Move to Completed in backlog.md, archive to `completed/` with original filename.

**See [agents/tasks/README.md](agents/tasks/README.md) for complete workflow.**

- [Svelte 5 Runes Docs](https://svelte.dev/docs/svelte/what-are-runes)
- [Project ADRs](docs/adrs/) | [ADR Index](docs/adrs/README.md)
- [Task Backlog](agents/tasks/backlog.md) | [Task Guide](agents/tasks/README.md)

## 🤝 Contributing

1. Check [agents/tasks/backlog.md](agents/tasks/backlog.md) for next task
2. Read related ADRs and task file before starting
3. Follow TDD workflow (red-green-refactor)
4. Update task status when complete
5. Create ADR for architectural decisions
6. Keep documentation updated

---

**Project values**: Simplicity, testability, modern Svelte 5 patterns. When in doubt, check ADRs and existing implementations.
