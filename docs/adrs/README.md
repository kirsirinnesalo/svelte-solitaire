# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records documenting significant architectural and design decisions in the project.

## What is an ADR?

An ADR documents:
- **WHAT** decision was made
- **WHY** it was made
- **WHAT** alternatives were considered
- **WHAT** consequences it has

ADRs provide historical context and reasoning, helping future contributors understand why the codebase works the way it does.

## When to Create an ADR

Create an ADR for decisions that:
- ✅ Affect the overall architecture
- ✅ Change how components communicate
- ✅ Introduce new patterns or conventions
- ✅ Affect multiple parts of the codebase
- ✅ Have significant trade-offs

Don't create an ADR for:
- ❌ Implementation details of a single feature
- ❌ Bug fixes (unless they reveal a design flaw)
- ❌ Routine refactoring
- ❌ Obvious or trivial choices

## Current ADRs

- **[ADR-001](ADR-001-test-driven-development.md)**: TDD workflow mandate
- **[ADR-002](ADR-002-svelte-5-runes-only.md)**: Svelte 5 runes-only approach
- **[ADR-003](ADR-003-callback-props-over-event-dispatchers.md)**: Callback props pattern
- **[ADR-004](ADR-004-json-parse-for-state-cloning.md)**: JSON.parse for state cloning
- **[ADR-005](ADR-005-game-over-overlay-refactor.md)**: Overlay component refactoring
- **[ADR-006](ADR-006-localstorage-for-game-statistics.md)**: LocalStorage for game statistics

## Creating a New ADR

1. Use next available number (ADR-007, etc.)
2. Copy [template.md](template.md)
3. Fill all sections with concrete details and code examples
4. Link related ADRs/tasks/resources
5. Update list above
6. Commit: `docs: add ADR-XXX for [decision]`

## ADR Lifecycle

### Status Values

- **Proposed**: Under discussion, not yet accepted
- **Accepted**: Decision made and being implemented
- **Deprecated**: No longer recommended but not yet replaced
- **Superseded**: Replaced by another ADR (link to replacement)

### Updating ADRs

- **Don't delete old ADRs** - they provide historical context
- **Don't modify old decisions** - create a new ADR that supersedes it
- **Do update Notes section** - for clarifications or minor corrections
- **Do update Status** - when circumstances change

## Writing Tips

- **Context**: Write for someone who wasn't there; explain constraints
- **Decision**: Be specific ("We will use X"); include code examples
- **Consequences**: Honest trade-offs (positives AND negatives)
- **Alternatives**: List options considered and why rejected

## Example Good ADR

See [ADR-002](ADR-002-svelte-5-runes-only.md) for a complete example showing:
- Clear problem statement
- Research-backed decision
- Concrete code examples
- Honest trade-offs
- Alternative analysis

---

**Remember**: ADRs are living documents. They should be updated as understanding evolves, but historical decisions should never be erased.
