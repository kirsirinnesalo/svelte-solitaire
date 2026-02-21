# FEAT-011: Card movement animations

Implement smooth animations when cards move between piles so they visually travel across the screen.

## Summary

When a card moves between piles (double-click to foundation, auto-complete, drag & drop, undo), it currently teleports instantly to its destination. This feels jarring and breaks the visual flow of gameplay.

We need cards to visually **travel** from their source pile to the destination pile—the same visual result as manually dragging a card, but automatic. The card should smoothly slide/fly across the screen using hardware-accelerated CSS transforms.

## Problem

The technical challenge: When state updates, Svelte moves the card's DOM element from one parent (source pile) to another (destination pile). We cannot animate a DOM element that changes parents. Solution: Use an overlay technique where a cloned card animates in a fixed-position layer while the real DOM updates.

## Acceptance Criteria

- [ ] Create `AnimationOverlay.svelte` component for animation layer
- [ ] Create animation utility module (`cardAnimations.ts` or similar) to coordinate:
  - Measure source card's screen position (getBoundingClientRect)
  - Wait for state update
  - Measure destination position
  - Animate overlay clone from source → destination
  - Cleanup clone
- [ ] Animate double-click moves (card → foundation)
- [ ] Animate auto-complete sequences with staggered timing (~100ms between moves)
- [ ] Animate drag & drop after release (from drop position to final position in destination pile)
- [ ] Animate undo with reverse animation direction
- [ ] Animation duration 250ms with ease-out timing
- [ ] Use CSS `transform` for 60fps hardware-acceleration (not top/left properties)
- [ ] Supports `prefers-reduced-motion` media query (instant move with no animation)
- [ ] Works in all games (Klondike, Napoleon, Aces Up, Clock)
- [ ] No visual glitches (z-index layering, clipping, position calculation errors)
- [ ] No interruption when user clicks/drags during animation
- [ ] Unit tests for animation utility functions
- [ ] No TypeScript errors
- [ ] No console warnings

## Related Tasks

- [FEAT-001](FEAT-001-card-animations.md) - Card flip animation (completed separately)

## Related ADRs

- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - Svelte 5 runes patterns
- [ADR-004](../../docs/adrs/ADR-004-json-parse-for-state-cloning.md) - State cloning with JSON.parse

## References

**External:**
- [getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- [CSS Transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [Will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

## Implementation Notes

### Architecture

```
AnimationOverlay.svelte
  └─ Fixed position layer (z-index: 100)
  └─ Cloned card element with animation

cardAnimations.ts
  ├─ animateCardMove(from: DOMRect, to: DOMRect, duration: number)
  ├─ createAnimationClone(card: Card): HTMLElement
  └─ cleanupAnimation(element: HTMLElement)

Game Component (e.g., Klondike.svelte)
  ├─ Import cardAnimations utility
  └─ Call before state updates:
      animateCardMove(sourceBounds, destBounds, 250)
        .then(() => { gameState = newState; })
```

### Programmatic Moves (Double-click, Auto-complete, Undo)

Flow:
1. Player double-clicks card or auto-complete triggers
2. Calculate source position: `sourceCard.getBoundingClientRect()`
3. Calculate destination position: `destPile.getBoundingClientRect()`
4. Call `animateCardMove(sourceBounds, destBounds, 250)`
5. Animation starts (clone visible, original hidden)
6. On animation complete: Update game state (`gameState = newState`)
7. Original card now visible at destination
8. Remove cloned card

### Drag & Drop Moves

Flow:
1. User releases mouse on drop target
2. Calculate drop position: final card position in destination pile
3. Animate from current position to destination
4. On animation complete: Update game state

### Auto-complete Stagger

When multiple cards move in sequence:
- First card: start animation immediately
- Second+ cards: wait 100ms before starting next animation
- This creates a satisfying cascade effect

### Performance Considerations

- Use `transform: translate()` instead of `top`/`left` (GPU-accelerated)
- Add `will-change: transform` during animation
- Remove `will-change` after animation
- Always use `requestAnimationFrame` for measurement → animate flow

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .card-animation {
    animation: none !important;
    transition: none !important;
  }
}
```

When `prefers-reduced-motion` is active, skip animations and update state immediately.

### Z-index Layering

```
100 - AnimationOverlay (animated clones)
50  - Game board (normal cards)
0   - Background
```

### Position Calculation Strategy

The overlay needs to position the clone exactly where the source card is:

```typescript
const style = getComputedStyle(sourceElement);
const transform = new DOMMatrixReadOnly(style.transform);

// Clone should start at source position
overlayClone.style.transform = `translate(${sourceBounds.left}px, ${sourceBounds.top}px)`;
```

### Testing Approach

1. Unit tests for `cardAnimations.ts`:
   - Test position calculation
   - Test animation state management
   - Test cleanup after animation

2. Component integration tests:
   - Test double-click animation
   - Test auto-complete staggering
   - Test drag & drop animation

3. Manual testing:
   - Visual verification in all games
   - Verify smooth 60fps animation
   - Test on low-end mobile devices
   - Test with `prefers-reduced-motion` enabled
   - Verify z-index layering (no cards hidden behind overlay)

### Clock Game Special Case

Clock game uses polar coordinates with CSS `transform: rotate()`. The animation utility must:
- Account for rotation when calculating positions
- Ensure animated clone uses same coordinate system

### Known Limitations

1. If source and destination piles are in different coordinate spaces (e.g., rotated containers), position calculations need adjustment
2. Rapid clicks during animation may create multiple overlays (implement debouncing/queuing if needed)
3. Full-screen transitions (like Clock spinner) may need special handling
