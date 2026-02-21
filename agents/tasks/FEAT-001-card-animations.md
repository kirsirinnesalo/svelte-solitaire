# FEAT-001: Card flip animation with CSS 3D transforms

Implement smooth card flip animations when cards are revealed using CSS 3D transforms.

## Summary

Currently, when a card flips from face-down to face-up, it instantly changes with no animation. This feels jarring and doesn't give visual feedback to the player.

We need to implement a CSS 3D flip animation that rotates the card 180 degrees around the Y-axis, showing a smooth transition between the back and front faces.

**Problem:** The current `CardComponent.svelte` uses `{#if card.faceUp}` which destroys and recreates the DOM element. CSS 3D animation requires both card faces to be rendered simultaneously and `backface-visibility: hidden` to hide the inactive side.

## Acceptance Criteria

- [ ] Refactor `CardComponent.svelte` to always render both card faces
- [ ] Implement CSS 3D flip using `transform: rotateY()`
- [ ] Add `.card-inner` wrapper with `transform-style: preserve-3d`
- [ ] Animation duration is 250ms with `ease-out` timing
- [ ] Card back face has `backface-visibility: hidden`
- [ ] Supports `prefers-reduced-motion` media query (disables animation)
- [ ] Card flip works in all games (Klondike, Napoleon, Aces Up, Clock)
- [ ] No visual glitches (back face text doesn't bleed through)
- [ ] Unit tests for CardComponent structure and animation classes
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related ADRs:**
- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - Use Svelte 5 runes patterns

**Related Tasks:**
- [FEAT-011](FEAT-011-card-movement-animations.md) - Card movement animations (separate task)

**External:**
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [Backface Visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility)
- [Transform Style](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style)

## Notes

### Implementation Details

**HTML Structure** (`CardComponent.svelte`):
```svelte
<div class="card" class:face-up={card.faceUp}>
  <div class="card-inner">
    <div class="card-front">
      <!-- Front face content -->
    </div>
    <div class="card-back">
      <!-- Back face content -->
    </div>
  </div>
</div>
```

**CSS Logic**:
```css
.card-inner {
  transition: transform 250ms ease-out;
  transform-style: preserve-3d;
}

.card.face-up .card-inner {
  transform: rotateY(0deg);
}

.card:not(.face-up) .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
  position: absolute;
}

.card-back {
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .card-inner {
    transition: none;
  }
}
```

### Testing Approach

1. Unit tests for DOM structure (both faces always present)
2. Verify class application (`.face-up` toggles correctly)
3. CSS visual verification (manual browser testing)
4. Test all games: card flip on reveal in tableau, auto-complete, initial deal

### Clock Game Note

The Clock game rotates cards around a circle. Verify that 3D flip works correctly with polar layout (cards are already rotated via CSS transform).

### Performance

Using `transform` (hardware-accelerated) ensures 60fps animation on all devices.
