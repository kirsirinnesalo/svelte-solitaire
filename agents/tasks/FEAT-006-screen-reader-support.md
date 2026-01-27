# FEAT-006: Add ARIA labels and screen reader support

Add proper ARIA attributes for screen reader accessibility.

## Summary

Visually impaired users need screen reader support to play. This requires semantic HTML and ARIA labels describing game state.

Key requirements:
- Describe card identity (rank, suit, face up/down)
- Announce game events (card moved, game won, etc.)
- Label interactive regions
- Provide context for piles

## Acceptance Criteria

- [ ] Cards have `aria-label` (e.g., "7 of hearts, face up")
- [ ] Piles have `role="region"` and `aria-label`
- [ ] Game events use `aria-live` regions
- [ ] Buttons have descriptive `aria-label`
- [ ] Tested with screen reader (NVDA or JAWS)
- [ ] Game is playable by keyboard + screen reader
- [ ] No ARIA errors in accessibility audit
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [FEAT-005](FEAT-005-keyboard-navigation.md) - Keyboard navigation (required first)

**External:**
- [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/)
- [NVDA screen reader](https://www.nvaccess.org/)

## Notes

Requires FEAT-005 (keyboard navigation) completed first.
Test with actual screen reader software.
