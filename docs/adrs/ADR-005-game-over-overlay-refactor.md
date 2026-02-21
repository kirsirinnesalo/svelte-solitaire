# ADR-005: Game-Over Overlay Component Refactoring

**Status**: Accepted  
**Date**: 2026-01-26  
**Deciders**: Project Team  
**Tags**: #refactoring #dry #components

## Context

Initially, each game component (Klondike, Napoleon, AcesUp, Clock) displayed game-over state using `alert()` boxes and `GameResultModal` component. This approach had several problems:

1. **Poor UX**: Alert boxes block UI, require clicking OK
2. **Inconsistent**: Each game implemented overlay markup differently
3. **Code Duplication**: ~107 lines of identical overlay code per game
4. **Maintenance Burden**: Changes required updating 4 files

The codebase evolved through these stages:
1. Alert boxes (`alert("Voitit!")`)
2. GameResultModal component (separate modal overlay)
3. Inline game-over overlay (transparent, shows stats)
4. **Refactored overlays** (extracted to shared components)

After refactoring: **-428 lines of duplicate code removed** (-282 net lines).

## Decision

We will use **shared overlay components** for game-over and pause states:

### GameOverOverlay.svelte

Display game end state with statistics, no action buttons.

```typescript
interface Props {
  isWon: boolean;
  isLost: boolean;
  moves: number;
  elapsedTime: number;
}
```

**Styling**:
- Semi-transparent background: `rgba(0,0,0,0.2)`
- Light blur: `blur(2px)`
- White text with shadow for contrast on varied backgrounds
- Emoji icons: 🎉 (win) / 😔 (loss)

**Rationale**: GameHeader already has back/new game buttons, no need to duplicate in overlay.

### PauseOverlay.svelte

Display pause state with resume button.

```typescript
interface Props {
  isPaused: boolean;
  onResume: () => void;
}
```

**Styling**:
- Opaque background: `rgba(0,0,0,0.8)`
- Heavy blur: `blur(10px)`
- Pause icon: ⏸
- Resume button: "▶ Jatka"

**Rationale**: Pause is temporary interrupt, needs strong visual indication and easy resume.

### Design Principles

1. **Different Visual Weight**: Game-over is informational (light), pause is blocking (heavy)
2. **No Redundant Controls**: Use existing header buttons, don't duplicate
3. **Text Contrast**: White text with dark shadow works on green table and white cards
4. **Consistent Iconography**: Emoji for game-over, unicode symbols for pause
5. **Props Over Events**: Callback props for actions (see ADR-003)

## Consequences

### Positive

1. **DRY**: Single source of truth for overlay markup/styling
2. **Consistency**: All games show identical overlay appearance
3. **Maintainability**: Fix bugs once, applies to all games
4. **Smaller Bundle**: -282 lines net reduction
5. **Better UX**: Transparent overlay lets users see final game state
6. **Testability**: Can test overlay component in isolation

### Negative

1. **Indirection**: Must navigate to component file to see overlay code
2. **Inflexibility**: Per-game customization requires props or slots
3. **Component Overhead**: Two additional component files

### Mitigation

- Keep components simple and focused
- Document props clearly with TypeScript interfaces
- Use props for customization rather than game-specific logic
- Overlay components remain small (<100 lines each)

## Implementation

### File Structure

```
src/components/
├── GameOverOverlay.svelte  # Win/loss display
├── PauseOverlay.svelte     # Pause screen
└── ...
```

### Usage in Games

```typescript
// Import shared components
import GameOverOverlay from '../components/GameOverOverlay.svelte';
import PauseOverlay from '../components/PauseOverlay.svelte';

// In template
<PauseOverlay {isPaused} onResume={togglePause} />
<GameOverOverlay {isWon} {isLost} {moves} {elapsedTime} />
```

### GameOverOverlay.svelte

```svelte
<script lang="ts">
  interface Props {
    isWon: boolean;
    isLost: boolean;
    moves: number;
    elapsedTime: number;
  }

  let { isWon, isLost, moves, elapsedTime }: Props = $props();

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

{#if isWon || isLost}
  <div class="game-over-overlay">
    <div class="game-over-message">
      <div class="game-over-icon">{isWon ? '🎉' : '😔'}</div>
      <h2>{isWon ? 'Voitit!' : 'Hävisit'}</h2>
      <div class="stats">
        <div>⏱ {formatTime(elapsedTime)}</div>
        <div>⇆ {moves} siirtoa</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .game-over-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
  }

  .game-over-message {
    text-align: center;
    color: white;
    text-shadow: 
      1px 1px 2px rgba(0,0,0,0.8),
      -1px -1px 2px rgba(0,0,0,0.8),
      1px -1px 2px rgba(0,0,0,0.8),
      -1px 1px 2px rgba(0,0,0,0.8);
  }
  /* ... */
</style>
```

### PauseOverlay.svelte

```svelte
<script lang="ts">
  interface Props {
    isPaused: boolean;
    onResume: () => void;
  }

  let { isPaused, onResume }: Props = $props();
</script>

{#if isPaused}
  <div class="pause-overlay">
    <div class="pause-message">
      <div class="pause-icon">⏸</div>
      <div>Peli tauolla</div>
      <button class="resume-btn" onclick={onResume}>▶ Jatka</button>
    </div>
  </div>
{/if}

<style>
  .pause-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
  }
  /* ... */
</style>
```

## Evolution History

### Stage 1: Alert Boxes (Initial)
```typescript
if (isGameWon(gameState)) {
  alert('Voitit!');
}
```
**Problem**: Blocked UI, poor UX

### Stage 2: GameResultModal (First Iteration)
```svelte
<GameResultModal 
  isWon={isWon} 
  on:newGame={initGame} 
  on:back={() => dispatch('back')} 
/>
```
**Problem**: Separate modal, navigation buttons duplicate header

### Stage 3: Inline Overlay (Second Iteration)
```svelte
{#if isWon || isLost}
  <div class="game-over-overlay">
    <!-- Inline overlay markup in each game -->
  </div>
{/if}
```
**Problem**: Code duplicated across 4 games (428 lines total)

### Stage 4: Refactored Components (Current) ✅
```svelte
<GameOverOverlay {isWon} {isLost} {moves} {elapsedTime} />
```
**Solution**: Shared component, DRY principle

## Code Impact

### Lines of Code Analysis

**Before refactoring**:
- Klondike: 107 lines (overlay + CSS)
- Napoleon: 107 lines
- AcesUp: 107 lines
- Clock: 107 lines
- **Total**: 428 lines duplicate code

**After refactoring**:
- GameOverOverlay.svelte: 95 lines
- PauseOverlay.svelte: 51 lines
- Game components: 4 lines import + usage each (16 lines total)
- **Total**: 162 lines
- **Net reduction**: -266 lines (-62%)

**Additional benefits**:
- Git commits document decision
- Clear component boundaries
- Easier to test overlays in isolation

## Testing Considerations

### Component Testing

```typescript
// Test GameOverOverlay
describe('GameOverOverlay', () => {
  it('shows win state', () => {
    render(GameOverOverlay, { 
      isWon: true, 
      isLost: false, 
      moves: 42, 
      elapsedTime: 123 
    });
    expect(screen.getByText('Voitit!')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    render(GameOverOverlay, { 
      isWon: true, 
      isLost: false, 
      moves: 10, 
      elapsedTime: 125 
    });
    expect(screen.getByText('⏱ 2:05')).toBeInTheDocument();
  });
});
```

### Integration Testing

Verify games use overlays correctly:
1. Play game to completion
2. Verify overlay appears
3. Check stats display correctly
4. Confirm no duplicate buttons

## Alternatives Considered

### 1. Keep Inline Overlays

Leave overlay code in each game component.

**Rejected**: 
- Violates DRY principle
- Maintenance burden
- Already duplicated 428 lines

### 2. Single Combined Overlay

One component handling both pause and game-over.

**Rejected**:
- Different visual styles (transparent vs opaque)
- Different purposes (info vs blocking)
- Props would be complex (`type: 'pause' | 'gameOver'`)

### 3. Slots for Customization

Allow games to customize overlay content via slots.

**Rejected for now**:
- Current props sufficient
- Can add slots later if needed (YAGNI)
- Keeps component simpler

### 4. Portal/Teleport Pattern

Render overlays at document root level.

**Rejected**:
- Adds complexity
- Current absolute positioning works fine
- Parent components are full-screen anyway

## Future Considerations

### Potential Enhancements

1. **Animation**: Fade in/scale transition on overlay appearance
2. **Accessibility**: ARIA labels, focus trap in pause overlay
3. **Customization**: Optional slots for game-specific content
4. **Sound**: Optional celebration sound on win

These can be added later without changing the core architecture.

### Monitoring

Watch for:
- Games needing overlay customization → consider slots
- Overlay performance issues → optimize rendering
- User feedback on transparency → adjust opacity

## References

- **Git Commits**:
  - `4ab85ca`: "Korvaa GameResultModal läpinäkyvällä game-over overlayllä"
  - `e0bd567`: "Refaktoroi overlay-komponentit omiin tiedostoihin"
- **Related ADRs**:
  - [ADR-003](ADR-003-callback-props-over-event-dispatchers.md): Callback props pattern

## Notes

This refactoring demonstrates the value of recognizing code duplication and extracting shared components. The overlay components are now:
- Easier to maintain
- Consistent across games
- Testable in isolation
- Well-documented

The transparency difference between pause (opaque) and game-over (transparent) is intentional UX design - pause blocks interaction, game-over allows viewing final state.
