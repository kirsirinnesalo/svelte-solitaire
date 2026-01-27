# FEAT-001: Add card movement animations

Add smooth CSS animations for card movements (drag, auto-move to foundation, deal).

## Summary

Cards currently move instantly, which feels jarring. Adding smooth transitions will make the game feel more polished and professional.

Target animations:
- Card flip (face down → face up)
- Card move (tableau to foundation, etc.)
- Card deal (from deck to tableau)

## Acceptance Criteria

- [ ] Add CSS transitions for card position changes
- [ ] Add flip animation for revealing cards
- [ ] Animation duration ~200-300ms
- [ ] Use ease-out or ease-in-out timing
- [ ] 60fps performance (no jank)
- [ ] Works in all games
- [ ] Can be disabled via preference (future)
- [ ] No visual glitches
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - Use Svelte transitions

**External:**
- [Svelte transitions](https://svelte.dev/docs/svelte/transition)
- [CSS transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

## Notes

Consider using Svelte's built-in transition directives:
```svelte
<div transition:fly={{ y: -20, duration: 200 }}>
```

Or CSS transitions for drag operations.
