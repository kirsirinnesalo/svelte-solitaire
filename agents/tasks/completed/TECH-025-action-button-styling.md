# TECH-025: Action button styling

Explore a header action button style where only the primary action is green and other buttons are neutral, to reduce visual weight and free space.

## Summary

The header action row is dense and all buttons currently share the same green style. A lighter, neutral style for secondary actions could improve clarity and balance, while keeping the primary action ("Uusi peli") as the green accent.

We want to adjust action button styling so only the primary action remains green, and secondary actions use a neutral style with hover states. This should improve visual hierarchy without reducing affordance.

## Acceptance Criteria

- [ ] The primary action button remains green.
- [ ] Secondary action buttons use a neutral style (light background, subtle border).
- [ ] Hover/disabled states remain clear and accessible.
- [ ] Visual hierarchy is improved compared to the current all-green row.
- [ ] Tests written and passing (TDD)
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- None

**Related ADRs:**
- None

**External:**
- None

## Notes

Keep spacing and sizing consistent with current header controls.

Completed: 2026-02-21
