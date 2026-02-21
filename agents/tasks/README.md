# Task Management Guide

Complete guide for managing development tasks in this project.

---

## 🎯 Quick Reference

- **Priority**: Physical order in Ready section (first = next)
- **Workflow**: Ready → In Progress (ONE at a time) → archive to `completed/`
- **Task Types**: FEAT (features), TECH (technical), BUG (bugs)
- **Agent Rule**: Take FIRST task from Ready, work on ONE, complete fully
- **User Role**: Prioritize tasks by ordering Ready section

---

## ⚠️ Critical Agent Rules

### 1. Ready Section is USER-MANAGED ONLY

**Agents MUST NOT modify the Ready section.**

✅ **Allowed:**
- Take FIRST task from Ready to In Progress
- Work on that ONE task to completion

❌ **FORBIDDEN:**
- Add, remove, or reorder tasks in Ready
- Skip tasks or work on non-first task
- Start tasks from other sections without user instruction

**Why?** Ready = user-prioritized work queue.

### 2. ONE Task at a Time

**No parallel work. No multitasking.**

1. Take FIRST task from Ready (on main branch)
2. Move to In Progress in backlog.md, commit to main
3. Create feature branch
4. Work on this task ONLY until completion
5. Move to Completed, archive file to `completed/` (on feature branch)
6. Commit completion (on feature branch)
7. Report branch readiness for user merge
8. Repeat after merge

### 3. Priority = Physical Order

Priority is determined by **order in Ready section only**.

- First task in Ready = highest priority = next task
- Metadata like `priority: high` is informational only
- Agents MUST NOT reorder sections

### 4. Task Types Are Fixed

Only three types allowed:
- **FEAT** - User-facing features
- **TECH** - Technical improvements, refactoring, testing
- **BUG** - Bug fixes

**Agents MUST NOT:**
- ❌ Add new task types
- ❌ Change task type (FEAT → TECH)
- ❌ Merge or split tasks without permission

---

## 📋 Backlog Structure

Tasks tracked in [backlog.md](backlog.md) with these sections:

### Main Workflow
1. **Ready** - USER prioritized (agents take FIRST only)
2. **In Progress** - Currently active (max 1, on main branch)
3. **Blocked** - Waiting on dependencies

### Discovery Sections (Agent-Managed)
5. **Features** - New feature ideas
6. **Technical** - Technical debt, refactoring, testing, documentation
7. **Bugs** - Discovered bugs

**Flow**: User moves tasks from discovery sections → Ready. Agent takes from Ready → In Progress → archive to `completed/`.

---

## 📝 Task Files

Each task = one markdown file: `TASK-ID-description.md`

**Examples:**
- `FEAT-003-game-instructions.md`
- `TECH-010-undo-manager.md`
- `BUG-001-cardback-persistence.md`

**Naming:**
- Use next available number for type
- Kebab-case
- Short but descriptive (3-5 words)

---

## ✍️ Creating Tasks

### 1. Choose Task ID
Use next available number: `FEAT-009`, `TECH-020`, `BUG-002`

### 2. Create File
`TASK-ID-short-description.md` in `agents/tasks/`

### 3. Use Template

```markdown
# TASK-ID: Title

One-line summary of what this accomplishes.

## Summary

1-2 paragraphs describing:
- What needs to be done
- Why it's needed
- Relevant context

## Acceptance Criteria

- [ ] Specific testable criteria
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

## Notes

Implementation notes, decisions, discoveries.
```

### 4. Add to backlog.md

```markdown
- [TASK-ID](TASK-ID-filename.md) - One-line description
```

Add to appropriate section (Features/Technical/Bugs/etc.).

---

## 🔄 Task Lifecycle

### Before Starting
1. Read task file thoroughly
2. Plan implementation approach
3. Move task to **In Progress** in backlog.md (on main branch)
4. **Commit backlog immediately**: `git add agents/tasks/backlog.md && git commit -m "chore: start TASK-ID"`
5. Create feature branch: `git checkout -b feat/TASK-ID-description`

**Why commit to main?** Makes task status visible immediately. Only "start" commits go to main - all work happens on feature branch.

### During Work
- Follow TDD workflow (ADR-001)
- Commit often: `feat(TASK-ID): description`
- Update task notes with decisions
- Create NEW tasks for discovered work (add to discovery sections)

### After Completion (on feature branch)
1. Verify all acceptance criteria met
2. Add completion notes to task file
3. Move task file to `completed/` directory (**keep original filename**)
4. Remove the task from backlog.md
5. **Commit completion**: `git commit -m "chore(TASK-ID): complete task"`
6. Report branch readiness for merge
7. **User merges** to main with `--no-ff` (brings completion + code)
8. **User deletes** feature branch

**CRITICAL**: Task completion happens on feature branch, NOT main. Merge brings everything together atomically.

---

## 🔍 Discovering New Work

When finding new work during implementation:

1. **Create task file**: `TECH-XXX-description.md` or `FEAT-XXX` or `BUG-XXX`
2. **Add to backlog.md**: Appropriate discovery section
3. **Link in current task**: Add to References
4. **Commit**: `feat(CURRENT-ID): discover TECH-XXX`
5. **Continue current task** - don't context switch

Discovery sections for new tasks:
- **Features** - New feature ideas
- **Technical** - Technical debt, refactoring, testing, documentation
- **Bugs** - Discovered bugs

**User will prioritize these to Ready when appropriate.**

---

## ✅ Best Practices

### Do:
- ✅ Keep tasks focused and scoped (single module/feature/component)
- ✅ Take FIRST task from Ready only
- ✅ Work on ONE task at a time
- ✅ Follow TDD (ADR-001)
- ✅ Commit with task ID
- ✅ Complete all acceptance criteria
- ✅ Create new tasks for discovered work
- ✅ Keep task checklist inside task file

### Don't:
- ❌ Modify Ready section (user-managed)
- ❌ Work on multiple tasks simultaneously
- ❌ Skip tasks or start from Blocked/Completed
- ❌ Change task types or merge tasks
- ❌ Reorder backlog sections
- ❌ Modify completed tasks (create new instead)
- ❌ Add work not in acceptance criteria
- ❌ Skip tests (TDD mandatory)
- ❌ Treat metadata priority as actual priority

---

## 📚 Related Documentation

- [AGENTS.md](../../AGENTS.md) - Complete development guide
- [backlog.md](backlog.md) - Task backlog
- [ADR-001](../adrs/ADR-001-test-driven-development.md) - TDD workflow
- [ADR-000](../adrs/ADR-000-agent-guidance.md) - Project DNA
