# Task Management

## How It Works

Tasks are tracked in [backlog.md](backlog.md) with simple status sections:
- **Ready** - Prioritized by order (top = next)
- **In Progress** - Currently being worked on
- **Blocked** - Waiting on something
- **Backlog** - Not yet ready to start

Completed tasks are moved to `completed/` directory to keep backlog clean.

## Task Files

Each task has its own markdown file: `TASK-ID-short-description.md`

**Task types:**
- `FEAT-001` - User-facing features
- `TECH-001` - Technical improvements, refactoring
- `BUG-001` - Bug fixes

## Creating a Task

1. Copy the template below
2. Create file: `TASK-ID-description.md`
3. Fill in: Title, Summary, Acceptance Criteria, References
4. Add to [backlog.md](backlog.md)

---

## Template

```markdown
# TASK-ID: Title

Brief one-line summary of what this task accomplishes.

## Summary

1-2 paragraphs describing:
- What needs to be done
- Why it's needed
- Context that helps understand the task

## Acceptance Criteria

Specific, testable criteria that define "done":

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] Tests written and passing (TDD)
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- [FEAT-XXX](FEAT-XXX-title.md) - Description

**Related ADRs:**
- [ADR-XXX](../adrs/ADR-XXX-title.md) - Decision name

**External:**
- [Documentation](https://example.com)
- [Issue/Discussion](https://github.com/...)

## Notes

Space for implementation notes, decisions, and discoveries during work.

---

**Completion**: When done, add completion metadata and move to Completed in backlog.md. Never modify completed tasks - create new task instead.
```

---

## Example

```markdown
# FEAT-012: Card flip animations

Add smooth flip animation when cards are turned face-up.

## Summary

Cards currently appear instantly when flipped. This breaks immersion and makes
the game feel less polished. Adding a CSS-based flip animation will make the
game feel more tactile and professional.

Target 200ms duration with ease-out timing.

## Acceptance Criteria

- [ ] Card flips smoothly when clicked/revealed
- [ ] Animation duration is 200ms
- [ ] No animation jank or flicker
- [ ] Works in all supported games
- [ ] Tests verify animation class is applied
- [ ] Performance: 60fps on mid-range devices

## References

**Related ADRs:**
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - Use Svelte transitions

**External:**
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
```

---

## Task Lifecycle

### Before Starting
1. Read task file
2. Plan implementation approach
3. Add notes to task file
4. Move to **In Progress** in backlog.md
5. Create feature branch

### During Work
- Follow TDD (test first)
- Commit often with task ID: `feat(FEAT-012): add flip animation`
- Update task notes with decisions/discoveries
- Create new tasks for discovered work

### Completion
1. Validate: `npm run check && npm run test && npm run build`
2. Add completion metadata to task file
3. Move task file to `completed/` directory
4. Remove from backlog.md (or move to archive section at bottom)
5. Update README.md if user-visible feature
6. Merge with `--no-ff`
7. Delete feature branch

### After Completion
**Never modify completed task files.** If changes needed:
- Bug: Create `BUG-XXX` that references original
- Enhancement: Create `FEAT-XXX-v2` that supersedes original
- Refactor: Create `TECH-XXX` that refactors original

This preserves history and keeps test annotations accurate.

---

## Best Practices

✅ **Do:**
- Keep tasks small and focused (< 1 day)
- Write clear, testable acceptance criteria
- Link related tasks and ADRs
- Update notes during implementation
- Create new tasks for scope creep

❌ **Don't:**
- Mix multiple features in one task
- Skip acceptance criteria
- Modify completed tasks
- Work on multiple tasks simultaneously
- Commit without task ID in message

---

For complete workflow, see [../../AGENTS.md](../../AGENTS.md)
