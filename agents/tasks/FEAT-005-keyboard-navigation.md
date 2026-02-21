# FEAT-005: Implement keyboard navigation for cards

Add keyboard support for navigating and moving cards.

## Summary

Current game is mouse-only. Keyboard navigation improves accessibility and allows efficient play for power users.

Target controls:
- Tab/Shift+Tab: Navigate between piles
- Arrow keys: Move within pile
- Enter/Space: Select/move card
- U: Undo
- N: New game

## Acceptance Criteria

- [ ] Cards have `tabindex` attribute
- [ ] Tab navigates between card piles
- [ ] Arrow keys navigate within pile
- [ ] Enter/Space selects and moves cards
- [ ] Visible focus indicator
- [ ] Works in all games
- [ ] Doesn't interfere with mouse controls
- [ ] Keyboard shortcuts documented
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [FEAT-007](FEAT-007-focus-styles.md) - Focus styles

**Related ADRs:**
- [ADR-003](../../docs/adrs/ADR-003-callback-props-over-event-dispatchers.md) - Props pattern

**External:**
- [WAI-ARIA keyboard patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)

## Notes

This is foundation for FEAT-006 (screen reader support).
