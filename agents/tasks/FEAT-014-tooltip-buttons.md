# FEAT-014: Replace expanding buttons with icon tooltips

Replace current expanding action buttons with fixed-size icon buttons that show text in hover tooltips.

## Summary

Current action buttons (Uusi peli, Kumoa, Ohjeet etc.) expand on hover to reveal their text labels. This "bouncing" effect can be distracting and makes the UI feel less stable.

Instead, action buttons should:
- Remain a fixed icon size at all times
- Display their labels in a small tooltip/popup on hover
- Provide a cleaner, more professional look with less visual motion

This follows common UI patterns seen in modern web applications where icon-only toolbars use tooltips instead of inline label reveals.

## Acceptance Criteria

- [ ] Action buttons remain fixed size (icon only)
- [ ] Tooltip appears on hover showing button label
- [ ] Tooltip positioned near button (above/below, not overlapping)
- [ ] Tooltip has subtle fade-in animation (e.g., 150ms)
- [ ] Tooltip supports keyboard focus (visible on `:focus-visible`)
- [ ] Touch devices: tooltip appears on tap/hold
- [ ] Existing `title` attributes still present (browser fallback)
- [ ] All buttons maintain accessibility (ARIA labels)
- [ ] Tests written and passing (TDD)
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- [TECH-024](completed/TECH-024-icon-only-actions.md) - Original expanding button implementation
- [FEAT-003](completed/FEAT-003-game-instructions.md) - Added help button to header

**Related ADRs:**
- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - Svelte 5 runes patterns

**External:**
- [WAI-ARIA: Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)

## Notes

- Remove `.action-btn-icon-only` expanding behavior from GameHeader.svelte styles
- Create simple tooltip component or inline tooltip styling
- Tooltip should disappear immediately on mouseout (no delay)
- Consider z-index to ensure tooltips appear above game content
- Keep tooltip text concise (already present in current labels)
- Test tooltip positioning doesn't cause layout shifts

