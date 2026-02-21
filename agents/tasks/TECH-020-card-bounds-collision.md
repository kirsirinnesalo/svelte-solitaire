# TECH-020: Improve drag collision detection using card bounds

Use dragged card's bounds instead of mouse position for drop target detection.

## Summary

Currently drag & drop uses mouse cursor position (`event.clientX/Y`) to determine drop targets. This can feel unintuitive when the card is offset from the cursor - the visual card edges don't align with where the system thinks the drop will occur.

Using the dragged card's actual bounds (`getBoundingClientRect()`) to check collision with drop zones provides more logical visual feedback that matches what the user sees.

## Acceptance Criteria

- [ ] Replace mouse position with card bounds in drop detection
- [ ] Use `getBoundingClientRect()` on dragged card element
- [ ] Check intersection with target pile bounds (not just mouse point)
- [ ] Works correctly when card has offset from cursor
- [ ] Test in Klondike (multi-card drags)
- [ ] Test in Napoleon (single card drags)
- [ ] Test in Aces Up (single card drags)
- [ ] Test in Clock (single card drags)
- [ ] Drop behavior feels more intuitive
- [ ] No regressions in drag functionality

## References

**Related Tasks:**
- [TECH-015](TECH-015-unify-drag-logic.md) - Could be implemented as part of unified drag logic
- [FEAT-001](FEAT-001-card-animations.md) - Related to drag visual feedback

**Related ADRs:**
- [AGENTS.md](../../AGENTS.md) - User experience focus

## Notes

Consider using element intersection or overlap percentage (e.g., 50% of card overlaps target) instead of simple point collision.

May require storing reference to dragged card element during drag operation.
