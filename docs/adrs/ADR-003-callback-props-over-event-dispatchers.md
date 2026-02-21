# ADR-003: Callback Props Over Event Dispatchers

**Status**: Accepted  
**Date**: 2026-01-26  
**Deciders**: Project Team  
**Tags**: #svelte #component-communication #architecture

## Context

Svelte components need to communicate events to parent components. Svelte provides two main patterns:

### Pattern 1: Event Dispatchers (Legacy/Svelte 4 Style)
```typescript
// Child component
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher<{ selectGame: GameType }>();

function handleClick() {
  dispatch('selectGame', gameId);
}

// Parent component
<GameSelector on:selectGame={(e) => handleGameSelect(e.detail)} />
```

### Pattern 2: Callback Props (Modern/Svelte 5 Style)
```typescript
// Child component
let { onselectgame }: { onselectgame: (gameId: GameType) => void } = $props();

function handleClick() {
  onselectgame(gameId);
}

// Parent component
<GameSelector onselectgame={handleGameSelect} />
```

The codebase currently uses **callback props exclusively** across all components:
- GameSelector: `onselectgame` callback
- GameHeader: `onBack`, `onNewGame`, `onUndo`, `onTogglePause` callbacks
- GameOverOverlay: No events (display-only)
- PauseOverlay: `onResume` callback
- Setting toggles: Use `$bindable()` for two-way binding

## Decision

We will use **callback props** for all parent-child communication, avoiding `createEventDispatcher` entirely.

### Component Communication Pattern

```typescript
// ✅ Correct - callback prop
interface Props {
  onAction: (data: ActionData) => void;
  onComplete?: () => void;  // Optional callback
}

let { onAction, onComplete }: Props = $props();

function handleEvent() {
  onAction(someData);
  onComplete?.();  // Call if provided
}

// ❌ Forbidden - event dispatcher
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
```

### Naming Conventions

**Prop names**: Lowercase with `on` prefix
- `onselectgame` not `onSelectGame` or `on:selectGame`
- `onback` not `onBack` or `on:back`
- Reason: Matches HTML event attributes (`onclick`, `onchange`)

**Type definitions**: Explicit function signature
```typescript
let { 
  onselectgame 
}: { 
  onselectgame: (gameId: GameType) => void 
} = $props();
```

### Multi-Action Components

For components with multiple actions, use multiple callbacks:

```typescript
// ✅ Correct - separate callbacks
interface GameHeaderProps {
  onBack: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  onTogglePause: () => void;
  // ... other props
}

// ❌ Avoid - single generic callback
interface Props {
  onEvent: (type: string, data?: any) => void;  // Too generic
}
```

### Optional vs Required

Mark callbacks optional only when truly optional:

```typescript
interface Props {
  onClick: () => void;           // Required - component needs this
  onComplete?: () => void;       // Optional - component works without
}

let { onClick, onComplete }: Props = $props();

function handleClick() {
  onClick();           // Safe - TypeScript ensures it exists
  onComplete?.();      // Safe - optional chaining
}
```

## Consequences

### Positive

1. **Simpler Mental Model**: Props are just functions, no special event syntax
2. **Better TypeScript**: Direct type checking, no `CustomEvent<T>` wrapping
3. **Less Boilerplate**: No `dispatch` setup, no `.detail` extraction
4. **Easier Testing**: Just call the function directly
5. **Clearer Intent**: Function signature shows exactly what data is passed
6. **Svelte 5 Alignment**: Matches modern Svelte 5 patterns

### Negative

1. **No Event Bubbling**: Events don't automatically bubble to grandparents
2. **No Event Modifiers**: Can't use `on:click|preventDefault|stopPropagation`
3. **Naming Confusion**: `onselectgame` vs `onSelectGame` not obvious
4. **Breaking from Tradition**: Different from HTML custom events

### Mitigation

- **Bubbling**: Pass callbacks down through props if needed (rare case)
- **Modifiers**: Handle explicitly in callback if needed
- **Naming**: Document convention clearly (lowercase with `on` prefix)
- **Tradition**: Svelte 5 is moving in this direction anyway

## Examples from Codebase

### GameSelector Component

```typescript
// src/components/GameSelector.svelte
interface Props {
  onselectgame: (gameId: GameType) => void;
}

let { onselectgame }: Props = $props();

const games: Array<{ id: GameType; name: string; description: string }> = [
  { id: 'klondike', name: 'Klondike', description: '...' },
  // ...
];
```

```svelte
<button onclick={() => onselectgame(game.id)}>
  {game.name}
</button>
```

### GameHeader Component

```typescript
// src/components/GameHeader.svelte
interface GameHeaderProps {
  title: string;
  moves: number;
  elapsedTime: number;
  onBack: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  undoDisabled: boolean;
  onTogglePause: () => void;
  isPaused: boolean;
  settings?: Snippet;
}

let {
  title,
  moves,
  elapsedTime,
  onBack,
  onNewGame,
  onUndo,
  undoDisabled,
  onTogglePause,
  isPaused,
  settings
}: GameHeaderProps = $props();
```

### Parent Usage (App.svelte)

```typescript
function handleGameSelect(gameId: GameType) {
  selectedGame = gameId;
}

function handleBack() {
  selectedGame = null;
}
```

```svelte
<GameSelector onselectgame={handleGameSelect} />

{#if selectedGame === 'klondike'}
  <Klondike onback={handleBack} />
{/if}
```

### Setting Toggle Pattern

For two-way data binding, use `$bindable()` instead of callbacks:

```typescript
// DrawCountToggle.svelte
let { 
  value = $bindable() 
}: { 
  value: 1 | 3 
} = $props();

// Parent usage
<DrawCountToggle bind:value={drawCount} />
```

This is appropriate when:
- Child needs to both read and write parent state
- Value is a primitive or simple data structure
- No side effects needed on change

Use callbacks when:
- Complex logic required on change
- Event represents an action, not data sync
- Parent needs to validate before accepting change

## Alternatives Considered

### 1. Keep Event Dispatchers

Continue using `createEventDispatcher` as in Svelte 4.

**Rejected**: 
- More verbose
- Less type-safe
- Not aligned with Svelte 5 direction
- Codebase already migrated

### 2. Mixed Approach

Use callbacks for simple cases, dispatchers for complex events.

**Rejected**:
- Inconsistency confuses contributors
- When is it "complex enough" for dispatcher?
- No clear benefit to mixing patterns

### 3. PascalCase Naming

Use `onSelectGame` instead of `onselectgame`.

**Rejected**:
- Inconsistent with HTML attribute naming
- Most Svelte 5 examples use lowercase
- Harder to type (shift key + camelCase)

### 4. Single Event Handler

Pass single generic event handler: `onEvent(type, data)`.

**Rejected**:
- Loses type safety
- Unclear what events component emits
- Parent needs string constants or magic strings

## Implementation

### Current State ✅

All components already use callback props:
- GameSelector: `onselectgame`
- GameHeader: `onBack`, `onNewGame`, `onUndo`, `onTogglePause`
- PauseOverlay: `onResume`
- Settings: Use `$bindable()` where appropriate

No `createEventDispatcher` imports found in codebase.

### Guidelines for New Components

When creating a new component that needs to notify parent:

1. **Define callback in props interface**:
   ```typescript
   interface Props {
     onAction: (data: DataType) => void;
   }
   ```

2. **Use lowercase naming**: `onsave` not `onSave`

3. **Be specific**: `onPlayerWin` not `onEvent`

4. **Make optional thoughtfully**: Only if component works without it

5. **Document data shape**: Use TypeScript types for clarity

## Testing

Callback props are easy to test:

```typescript
// Mock the callback
let calledWith: GameType | null = null;
const mockCallback = (gameId: GameType) => {
  calledWith = gameId;
};

// Render component
render(GameSelector, { props: { onselectgame: mockCallback } });

// Trigger action
await fireEvent.click(screen.getByText('Klondike'));

// Assert callback was called
expect(calledWith).toBe('klondike');
```

Compare to event dispatcher testing (more complex):

```typescript
// Need to listen for custom event
let event: CustomEvent | null = null;
const { component } = render(GameSelector);
component.$on('selectGame', (e) => { event = e; });

// ...trigger...

expect(event?.detail).toBe('klondike');
```

## References

- **Svelte 5 Migration Guide**: https://svelte.dev/docs/svelte/v5-migration-guide
- **Related ADRs**:
  - [ADR-002](ADR-002-svelte-5-runes-only.md): Svelte 5 runes patterns

## Notes

This pattern simplifies component communication significantly. The lowercase naming convention matches HTML and is increasingly common in Svelte 5 codebases.

**Key insight**: In Svelte 5, props are the primary way to pass data *and* behavior between components. Events are secondary and mostly for DOM events.
