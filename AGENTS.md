# AI Agent Development Guide

Everything needed to contribute to this project. In case of conflict, ADRs take precedence over this guide.

---

## 📋 Quick Reference

- **Tech Stack**: Svelte 5, TypeScript 5, Vite 7
- **Development**: TDD-first, feature branches, ONE task at a time, Conventional Commits
- **Language**: Finnish UI, English code/docs
- **Tasks**: [backlog.md](agents/tasks/backlog.md) | [Task Guide](agents/tasks/README.md)
- **Commits**: `feat(TASK-ID): short summary`

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

## ✈️ Pre-flight Checklist

Before starting ANY task:

1. [ ] Read task file completely (`agents/tasks/TASK-ID.md`)
2. [ ] Review related ADRs listed in task
3. [ ] On main: Move task to In Progress in `backlog.md`
4. [ ] On main: Commit `git commit -m "chore(TASK-ID): start task"`
5. [ ] Create feature branch: `git checkout -b feat/TASK-ID-description`
6. [ ] Create todo list (VS Code Copilot: use `manage_todo_list` tool)

## 🔄 Task Workflow

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

**Scope control**: Only implement what is required by the current task. If improvement is desirable but not required, create a separate TECH/FEAT task.

**If merge is delayed**: Wait for user merge before starting next task. Do not continue on the same feature branch.

**Note**: Task completion happens on feature branch. Main only gets "start" commits.

### ✅ Definition of Done

Every task is complete when:
- [ ] Tests written and passing (TDD red-green-refactor)
- [ ] Code follows Svelte 5 runes patterns
- [ ] TypeScript strict mode compliance
- [ ] Finnish UI text, English code
- [ ] No console warnings/errors
- [ ] Committed with task ID
- [ ] ADR created if architectural change
- [ ] README.md updated if user-visible

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

---

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

##  Game Implementation Pattern

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
```svelte
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

## 🧪 Testing

### Test Hierarchy Priority
1. **Pure functions** (`*Rules.ts`) - Test first, 100% coverage
2. **Component logic** - Test user interactions
3. **Integration** - Test game flow end-to-end
4. **Visual** - Manual verification only

### Test Annotations

```typescript
/**
 * @covers FEAT-001
 * @constrainedBy ADR-001, ADR-002
 */
describe('Card animations', () => {
  it('animates card movement', () => {
    // test code
  });
});
```

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
4. Commit with `fix(BUG-XXX): short summary`

## 🛠️ Development Commands

```bash
npm run dev               # Development server (port 5173)
npm run check             # TypeScript validation
npm run build             # Production build
npm run test              # Run tests
npm run test -- --watch   # Watch mode
npm run test -- --coverage  # Coverage report
```

## 🏗️ Architecture Decisions

All architectural decisions are documented in `docs/adrs/`. Key decisions:

- **[ADR-001](docs/adrs/ADR-001-test-driven-development.md)**: TDD workflow mandate
- **[ADR-002](docs/adrs/ADR-002-svelte-5-runes-only.md)**: Svelte 5 runes-only approach
- **[ADR-003](docs/adrs/ADR-003-callback-props-over-event-dispatchers.md)**: Callback props pattern
- **[ADR-004](docs/adrs/ADR-004-json-parse-for-state-cloning.md)**: JSON.parse for state cloning
- **[ADR-005](docs/adrs/ADR-005-game-over-overlay-refactor.md)**: Overlay component refactoring
- **[ADR-006](docs/adrs/ADR-006-localstorage-for-game-statistics.md)**: LocalStorage for game statistics

---

**Project values**: Simplicity, testability, modern Svelte 5 patterns. When in doubt, check ADRs and existing implementations.
