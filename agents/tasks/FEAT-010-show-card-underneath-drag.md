# FEAT-010: Show card underneath when dragging from tableau

Show the face-up card underneath when dragging cards from tableau pile.

## Summary

When a player grabs a card (or cards) from a tableau pile, they cannot see what card is underneath. This makes strategic decisions harder - players can't immediately see which card will be revealed.

Solution: When dragging starts, temporarily offset or make semi-transparent the dragged card(s) so the card underneath (if face-up) becomes visible. This provides immediate visual feedback for decision-making.

## Acceptance Criteria

- [ ] When dragging starts, dragged card(s) visually shift or become semi-transparent
- [ ] Card underneath (if face-up) becomes visible during drag
- [ ] Works for single card and multi-card drags
- [ ] Visual effect only applies during drag (not on click)
- [ ] Dragged cards return to normal position/opacity on drop or cancel
- [ ] No visual glitches or flickering
- [ ] Works in all games with tableau (Klondike, Napoleon)
- [ ] Performance remains smooth (60fps)
- [ ] No TypeScript errors

## Implementation Notes

**Option 1: Opacity**
```css
.card.dragging {
  opacity: 0.7;
  cursor: grabbing;
}
```

**Option 2: Offset**
```css
.card.dragging {
  transform: translateX(10px) translateY(-5px);
  cursor: grabbing;
}
```

**Option 3: Both**
Combine slight offset with reduced opacity for best effect.

**Svelte Implementation:**
```svelte
<script lang="ts">
  let isDragging = $state(false);
  
  function handleDragStart(event: DragEvent) {
    isDragging = true;
    // ... existing logic
  }
  
  function handleDragEnd() {
    isDragging = false;
  }
</script>

<div 
  class:dragging={isDragging}
  ondragstart={handleDragStart}
  ondragend={handleDragEnd}
>
```

**Edge cases:**
- Bottom card of pile (nothing underneath) - no special handling needed
- Face-down card underneath - should remain face-down (don't reveal)
- Multi-card drag - apply effect to entire sequence

## References

**Related ADRs:**
- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - Use Svelte 5 patterns

**Related Tasks:**
- [FEAT-001](FEAT-001-card-animations.md) - Card animations (may want to coordinate styles)
- [TECH-015](TECH-015-unify-drag-logic.md) - Unify drag & drop logic (consider when implementing)

**External:**
- Many card games use similar "peek underneath" effects
- Consider accessibility - ensure dragged state is announced to screen readers

## Notes

- Start with Klondike implementation, then apply to Napoleon
- Test with both mouse drag and touch drag (if touch is supported)
- Consider adding user preference to disable effect
- Could extend to show "ghost" of where card will land (future enhancement)
