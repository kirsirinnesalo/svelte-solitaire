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

See [agents/tasks/README.md](../tasks/README.md) for complete task workflow.

**Key points**:
- Tasks in `agents/tasks/backlog.md`, priority = order in Ready section
- Task types: FEAT (features), TECH (technical), BUG (bugs)
- ONE task at a time - complete fully before starting next
- TDD: Test first for all tasks

## Agent vs User Responsibilities

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
- delete branches

### Git Workflow

See [AGENTS.md](../../AGENTS.md) for complete Git workflow details.

**Key points**:
- Feature branches: `feat/TASK-ID-description`
- Conventional Commits: `feat(TASK-ID): short summary`
- Agent commits on feature branch, user merges to main
- Merge with `--no-ff` to preserve history

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
