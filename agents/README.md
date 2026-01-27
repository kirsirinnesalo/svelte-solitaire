# Agent Quick Reference

**30-second scan before starting work.** For details, see [AGENTS.md](../AGENTS.md).

## 🎯 Core Principles

1. **TDD always** - Test first (Red → Green → Refactor)
2. **ONE task at a time** - Complete before starting next
3. **Svelte 5 runes only** - No `$:`, no `export let`
4. **Feature branches** - Task per branch, merge with `--no-ff`
5. **Conventional Commits** - `feat(FEAT-001): description`

## 📚 Documentation

| Document | Contents |
|----------|----------|
| **[../AGENTS.md](../AGENTS.md)** | Complete guide: TDD, patterns, workflows |
| **[tasks/README.md](tasks/README.md)** | Task management: lifecycle, template, rules |
| **[tasks/backlog.md](tasks/backlog.md)** | Current work: Ready, In Progress, Discovery |
| **[adrs/ADR-000](adrs/ADR-000-agent-guidance.md)** | Project DNA: conventions, style, architecture |
| **[../README.md](../README.md)** | App state: features, tech, getting started |

## 📝 Task Types

- **FEAT** - User-facing features
- **TECH** - Technical work (tests, refactoring, docs)
- **BUG** - Bug fixes

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

## 🧠 Svelte 5 Cheat Sheet

```typescript
// State
let count = $state(0);
let gameState = $state({ cards: [] });

// Computed
let doubled = $derived(count * 2);

// Side effects (not for pure computation!)
$effect(() => {
  console.log('count:', count);
});

// Props
let { card, draggable = false } = $props();

// Bindable (two-way)
let { value = $bindable() } = $props();

// NEVER use these (legacy):
// $: doubled = count * 2;  ❌
// export let card: Card;    ❌
```

## ⚡ Quick Commands

```bash
npm run dev     # Development server
npm run check   # TypeScript validation
npm run test    # Run tests
npm run build   # Production build
```

---

**First time?** Read [ADR-000](adrs/ADR-000-agent-guidance.md), then [AGENTS.md](../AGENTS.md).
