# AI Agent Development Guide

Welcome to the Svelte Solitaire development team! This document contains everything needed to understand the project architecture, practices, and workflow.

> **Quick Start**: Read [agents/adrs/ADR-000](agents/adrs/ADR-000-agent-guidance.md) first (project DNA), then this guide. For a quick scan, see [agents/README.md](agents/README.md).

## 📋 Quick Reference

- **Tech Stack**: Svelte 5, TypeScript 5, Vite 7
- **Development**: TDD-first, feature branches, ONE task at a time, Conventional Commits
- **Language**: Finnish UI, English code/docs
- **Tasks**: [backlog.md](agents/tasks/backlog.md) | [Task Guide](agents/tasks/README.md)
- **Commits**: `feat(TASK-ID): short summary`

## ✈️ Pre-flight Checklist

**CRITICAL**: Before starting ANY task:

1. [ ] Read task file completely (`agents/tasks/TASK-ID.md`)
2. [ ] Review related ADRs listed in task
3. [ ] Create feature branch (agent may do this): `git checkout -b feat/TASK-ID-description`
4. [ ] Add "Create feature branch" as first todo using `manage_todo_list` tool

**Then follow Task Workflow below.**

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
   - Agent marks task ready for integration
   - User merges to main with `--no-ff`
   - User deletes branch
   - Agent archives task to `completed/`

**One task at a time**: Never start a new task before completing the current one fully (steps 1-9).

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

## 🔐 Agent vs User Responsibilities (CRITICAL)

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

All architectural decisions are documented in `agents/adrs/`. Key decisions:

- **[ADR-000](agents/adrs/ADR-000-agent-guidance.md)**: Project DNA and conventions
- **[ADR-001](agents/adrs/ADR-001-test-driven-development.md)**: TDD workflow mandate
- **[ADR-002](agents/adrs/ADR-002-svelte-5-runes-only.md)**: Svelte 5 runes-only approach
- **[ADR-003](agents/adrs/ADR-003-callback-props-over-event-dispatchers.md)**: Callback props pattern
- **[ADR-004](agents/adrs/ADR-004-json-parse-for-state-cloning.md)**: JSON.parse for state cloning
- **[ADR-005](agents/adrs/ADR-005-game-over-overlay-refactor.md)**: Overlay component refactoring
- **[ADR-006](agents/adrs/ADR-006-localstorage-for-game-statistics.md)**: LocalStorage for game statistics

📖 **Read ADR-000 first** - it contains the project's DNA.

## 🔴 Test-Driven Development Workflow

**CRITICAL**: Always follow TDD workflow for new features and bug fixes.

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
- **Workflow**: Ready → In Progress → Completed → `completed/` directory
- **TDD**: Test first for all tasks
- **Commits**: Short and focused - `feat(TASK-ID): what changed`
  - Don't repeat acceptance criteria (DoD is implicit)
  - Don't list test counts or implementation details

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

See [ADR-004](agents/adrs/ADR-004-json-parse-for-state-cloning.md) for rationale.

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
- [Project ADRs](agents/adrs/) | [ADR Index](agents/adrs/README.md)
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
