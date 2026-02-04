# ADR-000: AI Agent Guidance and Project DNA

**Status**: Accepted  
**Date**: 2026-01-26  
**Deciders**: Project Team  
**Tags**: #meta #conventions #workflow

## Context

This project requires clear guidance for AI agents contributing to the codebase. Without explicit documentation of conventions, patterns, and architectural decisions, AI agents may introduce inconsistencies or violate established patterns.

This ADR serves as the **project DNA** - the foundational document that all agents should read first.

## Decision

We will maintain comprehensive AI agent guidance through:

1. **AGENTS.md**: High-level overview and quick reference
2. **ADR system**: Detailed architectural decisions
3. **Task system**: Structured backlog with priorities
4. **TDD mandate**: Test-driven development for all new code

### Core Conventions

#### Language
- **UI text**: Finnish (suomi)
- **Code**: English (variable names, functions, comments)
- **Documentation**: English
- **Example**: `let moves = $state(0); // Move counter`

#### File Naming
- **Components**: PascalCase.svelte (`CardComponent.svelte`)
- **Utilities**: camelCase.ts (`cardUtils.ts`)
- **Game rules**: camelCase + Rules.ts (`klondikeRules.ts`)
- **Tests**: match source + .test.ts (`klondikeRules.test.ts`)

#### Code Style
- **TypeScript**: Strict mode, explicit types for function parameters
- **Svelte 5**: Runes only (see ADR-002)
- **Immutability**: Always create new objects/arrays for reactivity
- **No abbreviations**: Write `gameState` not `gs`, `tableau` not `tab`

### Architecture Patterns

#### Separation of Concerns
```
{Game}.svelte        ← UI, user interactions, Svelte runes
{game}Rules.ts       ← Pure functions, game logic, no Svelte
{game}Rules.test.ts  ← Unit tests for rules
```

**Rationale**: Testability, clarity, reusability

#### State Management
- **Component state**: `$state()` rune
- **Module state**: `.svelte.ts` files with runes
- **No stores**: Migrated from `writable()` to runes (Svelte 5)
- **Props**: Callback functions, not event dispatchers (see ADR-003)

#### Type System
- All types in `src/types/game.ts`
- Game-specific state interfaces in `*Rules.ts`
- Inline type assertions for `$state`: `[] as Card[][]`
- No `any` types - use `unknown` if truly dynamic

### Test-Driven Development

**Mandatory workflow** for all new features:

```
1. RED:   Write failing test
2. GREEN: Implement minimum code to pass
3. REFACTOR: Clean up while tests pass
```

**Coverage targets**:
- Pure functions (`*Rules.ts`): 100%
- Components: 80%+
- Overall project: 90%+

See [ADR-001](ADR-001-test-driven-development.md) for full TDD workflow.

### Mandatory Quality Gates (Agent)

Before every commit, agent MUST:
- run `npm run test` (Vitest)
- run `npm run build`
- run `npm run lint` (if configured)

### Task Management

Tasks in `agents/tasks/backlog.md` with structure:

```markdown
## Ready

1. [FEAT-001](FEAT-001-card-animations.md) - Card movement animations
2. [TECH-002](TECH-002-undo-manager.md) - Unified undo manager
3. [BUG-001](BUG-001-cardback-persistence.md) - Fix cardBack persistence
```

**Priority = order in list**. Top item is next to implement.

**Discovering new work during implementation**:

1. Create task file immediately when discovered
2. Add to Backlog in `backlog.md`
3. Link in current task's "Related Tasks"
4. Note in current task's "Implementation Notes"
5. Assess if blocker (pause current) or can wait
6. Commit: `CURRENT-TASK-ID: Discover NEW-TASK-ID`

**Example**:
```bash
# During FEAT-001, discover a bug
cp agents/tasks/TEMPLATE.md agents/tasks/BUG-003-animation-flicker.md
# Edit BUG-003 with details
git add agents/tasks/BUG-003-animation-flicker.md agents/tasks/backlog.md
git commit -m "feat(FEAT-001): discover BUG-003 animation flicker issue"
```

**Task types**:
- **FEAT**: User-facing features (includes documentation updates)
- **TECH**: Technical improvements, refactoring
- **BUG**: Bug fixes (includes regression tests)

**Test traceability**: Annotate tests with task coverage and ADR constraints:

```typescript
/**
 * @covers FEAT-001
 * @description Tests for card animations feature
 * @constrainedBy ADR-001, ADR-004
 */
describe('Card animations', () => {
  // test code
});
```

**Task workflow**:
1. **Pick ONE**: Select single task from Ready (top = highest priority)
2. **Plan**: Read task details, update with implementation approach
3. **Status**: Move to In Progress in `index.md`
4. **Branch**: Create feature branch
5. **TDD**: Red (test) → Green (code) → Refactor (improve)
6. **Document**: Update task file with decisions/notes
7. **Validate**: Verify all DoD criteria before completing
8. **Complete**:
   - Agent marks task ready for integration
   - User merges to main and deletes branch
   - Task is moved to Completed and archived

**IMPORTANT**: Work on ONE task at a time. Complete it fully (including tests, documentation, merge) before starting another. Half-finished tasks create confusion and merge conflicts.

**Validation checklist** (before marking complete):
- [ ] All acceptance criteria met
- [ ] Tests written and passing (`npm run test`)
- [ ] TypeScript strict compliance (`npm run check`)
- [ ] No console warnings/errors
- [ ] Task file updated with completion info
- [ ] ADR created for architectural changes
- [ ] Code follows Svelte 5 patterns

**Definition of Done**:
- [ ] Tests written and passing (TDD)
- [ ] Follows Svelte 5 patterns
- [ ] TypeScript strict compliance
- [ ] No console warnings
- [ ] Committed with task ID

## Agent vs User Responsibilities (CRITICAL)

### Agent Responsibilities
Agent is responsible for:
- implementing task code and tests
- running TDD workflow (red → green → refactor)
- creating feature branches
- committing changes to feature branches
- keeping branch up to date locally
- reporting branch name and readiness for integration

### User Responsibilities
User is responsible for:
- pushing branches to remote
- merging feature branches to main
- resolving merge conflicts
- deleting branches
- release and deployment decisions

Agent MUST NOT:
- git push
- git pull
- git merge
- git rebase
- git reset
- delete branches on local or remote

### Git Workflow

**IMPORTANT**: Agent must never push to remote repositories.
All remote operations are user-controlled.

**Feature branches**: Each task is developed in its own feature branch:
```bash
# Create feature branch
git checkout -b feat/001-card-animations     # For FEAT-001
git checkout -b tech/002-undo-manager        # For TECH-002
git checkout -b bug/001-cardback-fix         # For BUG-001
git checkout -b doc/001-update-readme        # For DOC-001

# Work on feature, commit regularly with task ID
git commit -m "feat(FEAT-001): add animation framework"
git commit -m "feat(FEAT-001): implement card movement transitions"
```

## Integration and Merge (USER-ONLY)

When a task is complete:

1. Agent completes feature branch and final commit
2. Agent reports branch name and readiness in chat
3. User performs:
   - push to remote
   - merge to main with --no-ff
   - branch deletion

Example (USER only):

```bash
git checkout main
git merge --no-ff feat/001-card-animations
git branch -d feat/001-card-animations
```

**Merge strategy**: Always use `--no-ff` (no fast-forward) to create merge commit:
- Preserves feature development history
- Shows clear feature boundaries in git log
- Agent commit steps remain visible (not squashed)
- Easier to understand feature evolution
- Can revert entire feature if needed

**Commit message format** (Conventional Commits):

**Agent MUST use Conventional Commits format:**
```
<type>(<task-id>): <short summary>

format: feat(FEAT-001): short summary
```

**Types** (matches task types):
- feat: New feature (FEAT-XXX)
- fix: Bug fix (BUG-XXX)
- chore: Technical/maintenance (TECH-XXX, task management)

Examples:
feat(FEAT-XXX): add card animation framework
fix(BUG-XXX): fix localStorage persistence
chore(TECH-XXX): extract undo manager
chore(tasks): complete FEAT-XXX
```

**Commit guidelines**:
- Keep description short and clear (one line)
- Focus on WHAT changed, not why it meets criteria
- DO NOT repeat acceptance criteria or DoD
- DO NOT list test counts (e.g., "43 tests passing")
- DO NOT enumerate implementation details
- Let git diff show the details

**Branch naming convention**:
- `feat/XXX-description` for features
- `tech/XXX-description` for technical tasks
- `bug/XXX-description` for bug fixes
- `doc/XXX-description` for documentation

**Commit message examples**:
```
feat(FEAT-001): add card movement animations
chore(TECH-002): extract undo manager to shared utility
fix(BUG-001): fix cardBack localStorage persistence
```

**ADR creation**: Any architectural decision gets documented:
```bash
# Create new ADR
cp agents/adrs/template.md agents/adrs/ADR-006-my-decision.md
# Edit and commit
git commit -m "docs: add ADR-006 for database choice"
```

## Consequences

### Positive
- **Consistency**: Clear patterns prevent drift
- **Onboarding**: New agents understand codebase quickly
- **Quality**: TDD ensures robust, tested code
- **Traceability**: ADRs document "why" not just "what"
- **Maintainability**: Future agents can understand decisions

### Negative
- **Overhead**: Creating ADRs takes time
- **Rigidity**: Patterns may constrain creativity
- **Learning curve**: Agents must read documentation first

### Mitigation
- Keep ADRs concise and scannable
- AGENTS.md provides quick reference
- Allow pattern evolution through new ADRs

## References

- **Related ADRs**:
  - [ADR-001](ADR-001-test-driven-development.md): TDD workflow
  - [ADR-002](ADR-002-svelte-5-runes-only.md): Svelte 5 runes
- **External**:
  - [ADR GitHub organization](https://adr.github.io/)
  - [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)

## Notes

This is a living document. As the project evolves, update this ADR to reflect new conventions and patterns. When updating, note the change date and rationale.

**Last updated**: 2026-01-26
