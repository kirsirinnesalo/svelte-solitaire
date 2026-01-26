# ADR-002: Svelte 5 Runes-Only Approach

**Status**: Accepted  
**Date**: 2026-01-26  
**Deciders**: Project Team  
**Tags**: #svelte #reactivity #architecture

## Context

Svelte 5 introduces "runes" - a new reactivity system that replaces legacy patterns like `$:` reactive declarations, `export let` props, and `onMount` lifecycle hooks. The project uses Svelte 5.48.0 and has already completed migration from legacy patterns.

The codebase currently has:
- 50+ `$state()` instances across 4 game components
- `$derived()` in 3 components for computed values
- `$effect()` in 5+ places for side effects
- `$props()` in all 12+ components
- `$bindable()` in 4 setting toggle components
- **Zero legacy patterns** (`$:`, `export let`, `onMount`)
- `svelte.config.js` with `compilerOptions.runes: true`

## Decision

We will use **Svelte 5 runes exclusively** throughout the codebase, prohibiting all legacy Svelte patterns.

### Mandatory Patterns

#### 1. State - Use `$state()`
```typescript
// ✅ Correct
let moves = $state(0);
let gameState: KlondikeState = $state({
  tableau: [] as Card[][],
  foundations: [[], [], [], []]
});

// ❌ Forbidden
let moves = 0; // Not reactive
```

#### 2. Computed Values - Use `$derived()`
```typescript
// ✅ Correct - pure computation
let canUndo = $derived(history.length > 0 && !isWon && !isLost);

// ❌ Forbidden
$: canUndo = history.length > 0 && !isWon && !isLost;
```

#### 3. Side Effects - Use `$effect()`
```typescript
// ✅ Correct - side effect (timer)
$effect(() => {
  if (!isPaused && gameStarted && !isWon && !isLost) {
    const interval = setInterval(() => elapsedTime++, 1000);
    return () => clearInterval(interval);
  }
});

// ✅ Correct - state synchronization (side effect)
$effect(() => {
  if (drawCount === 1) maxRecycles = 3;
  else maxRecycles = 'unlimited';
});

// ❌ Forbidden
onMount(() => { /* ... */ });
```

#### 4. Props - Use `$props()`
```typescript
// ✅ Correct - with TypeScript types
let { card, draggable = false }: { card: Card; draggable?: boolean } = $props();

// ✅ Correct - with interface
interface Props {
  isWon: boolean;
  moves: number;
}
let { isWon, moves }: Props = $props();

// ❌ Forbidden
export let card: Card;
export let draggable = false;
```

#### 5. Two-Way Binding - Use `$bindable()`
```typescript
// ✅ Correct - in child component
let { value = $bindable() }: { value: 1 | 3 } = $props();

// Parent usage:
<DrawCountToggle bind:value={drawCount} />

// ❌ Forbidden (no direct equivalent in legacy Svelte)
```

#### 6. Module-Level State - Use `.svelte.ts`
```typescript
// File: cardBackStore.svelte.ts
let cardBackValue = $state<CardBackType>('classic-blue');

export const cardBackType = {
  get value() { return cardBackValue; },
  set value(newValue: CardBackType) { cardBackValue = newValue; }
};

// ❌ Forbidden
import { writable } from 'svelte/store';
export const cardBackType = writable('classic-blue');
```

### Prohibited Patterns

| Legacy Pattern | Rune Replacement | Notes |
|---|---|---|
| `$: computed = ...` | `let computed = $derived(...)` | Pure computation |
| `export let prop` | `let { prop } = $props()` | Component props |
| `onMount(fn)` | `$effect(fn)` | Side effect on mount |
| `beforeUpdate(fn)` | `$effect.pre(fn)` | Runs before DOM update |
| `afterUpdate(fn)` | `$effect(fn)` | Runs after DOM update |
| `writable(value)` | `.svelte.ts` + `$state()` | Module-level state |

### $derived vs $effect Decision Tree

```
Is it a pure computation?
├─ Yes → Use $derived
└─ No → Does it have side effects?
   ├─ Yes → Use $effect
   └─ No → Consider if you need reactivity at all
```

Examples:
- **$derived**: `canUndo`, `isGameWon`, `cardCount`, `emptyPiles`
- **$effect**: Timers, localStorage sync, DOM manipulation, logging

## Consequences

### Positive

1. **Type Safety**: `$props()` with TypeScript types is more explicit than `export let`
2. **Performance**: Fine-grained reactivity enables better compiler optimizations
3. **Consistency**: Single way to declare state, computed values, side effects
4. **Future-Proof**: Runes are Svelte 5's recommended approach
5. **Clearer Intent**: `$derived` vs `$effect` makes pure vs impure obvious
6. **Better Debugging**: Svelte DevTools shows rune dependencies clearly

### Negative

1. **Migration Effort**: Legacy Svelte examples online need translation
2. **Learning Curve**: New contributors must learn runes first
3. **Ecosystem Lag**: Some libraries may not fully support runes yet

### Mitigation

- This codebase is already fully migrated (zero legacy patterns)
- AGENTS.md documents all runes patterns with examples
- ADRs reference runes usage for specific scenarios
- Copilot instructions enforce runes-only approach

## Implementation

### Already Complete ✅

The codebase has successfully migrated:
- All components use `$props()` (12+ components)
- All state uses `$state()` (50+ instances)
- Computed values use `$derived()` where appropriate
- Side effects use `$effect()` (timers, state sync)
- Setting toggles use `$bindable()` (4 components)
- Module store uses `.svelte.ts` pattern

### Remaining Work

- Expand `$derived()` usage for more computed values (e.g., `canDrawCard`, `stackHeight`)
- Add comments explaining why `$effect()` is chosen over `$derived()` where non-obvious
- Document localStorage sync pattern when implemented

## Examples from Codebase

### State Management (Klondike.svelte)
```typescript
let gameState: KlondikeState = $state({
  tableau: [] as Card[][],
  foundations: [[], [], [], []],
  stock: [] as Card[],
  waste: [] as Card[]
});
let moves = $state(0);
let isWon = $state(false);
let history: { gameState: KlondikeState; moves: number }[] = $state([]);
```

### Computed Value (Klondike.svelte)
```typescript
let undoDisabled = $derived(
  history.length === 0 || isWon || isLost || !gameStarted
);
```

### Side Effect (Klondike.svelte)
```typescript
// State synchronization - changes one state based on another
$effect(() => {
  if (drawCount === 1) maxRecycles = 3;
  else if (drawCount === 3) maxRecycles = 'unlimited';
});
```

### Props + Bindable (DrawCountToggle.svelte)
```typescript
let { 
  value = $bindable(), 
  label = "Nosta" 
}: { 
  value: 1 | 3; 
  label?: string 
} = $props();
```

## Validation

To ensure compliance:

```bash
# Search for forbidden patterns (should return 0 results)
grep -r "export let" src/
grep -r "onMount" src/
grep -r "\$:" src/ --include="*.svelte"
grep -r "writable\|readable" src/

# Verify runes config
grep "runes" svelte.config.js
# Should show: runes: true
```

## References

- **Svelte 5 Runes Documentation**: https://svelte.dev/docs/svelte/what-are-runes
- **Migration Guide**: https://svelte.dev/docs/svelte/v5-migration-guide
- **Related ADRs**:
  - [ADR-004](ADR-004-json-parse-for-state-cloning.md): State cloning with runes
  - [ADR-003](ADR-003-callback-props-over-event-dispatchers.md): Props pattern

## Notes

This decision was made after completing full migration to Svelte 5. The codebase demonstrates that runes work well for card game implementations with complex state management.

**Key insight**: Separating `$derived` (pure) from `$effect` (impure) improves code clarity and makes testing easier.
